import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword as fbSignInWithEmail,
  createUserWithEmailAndPassword as fbCreateUserWithEmail,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
  sendPasswordResetEmail as fbSendPasswordReset,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Detect if Firebase configuration has been successfully completed in the AI Studio UI
export const IS_FIREBASE_CONFIGURED = !!(firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey.trim().length > 0);

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  createdAt: string;
  bio?: string;
  completedVideoIds?: string[];
  bookmarkedVideoIds?: string[];
  xp?: number;
  streak?: number;
  certificates?: any[];
  watchHistory?: any[];
  examScores?: Record<string, number>;
}

// ----------------------------------------------------------------------------
// FIRESTORE ERROR HANDLING INTERFACES (AS MANDATED BY FIREBASE SKILL)
// ----------------------------------------------------------------------------
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: any, operationType: OperationType, path: string | null) {
  // Check if this error is specifically due to Firebase permissions/auth restriction
  const isPermissionError = error?.code === 'permission-denied' || 
                            error?.message?.includes('permission') || 
                            error?.message?.includes('Missing or insufficient permissions');
  
  if (isPermissionError) {
    const auth = liveAuth;
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth?.currentUser?.uid || null,
        email: auth?.currentUser?.email || null,
        emailVerified: auth?.currentUser?.emailVerified || null,
        isAnonymous: auth?.currentUser?.isAnonymous || null,
        tenantId: auth?.currentUser?.tenantId || null,
        providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || []
      },
      operationType,
      path
    };
    const serializedMessage = JSON.stringify(errInfo);
    console.error('🔥 Hardened Firestore Permission Exception caught: ', serializedMessage);
    throw new Error(serializedMessage);
  }
  
  // Throw original if not a clearance issue
  throw error;
}

// ----------------------------------------------------------------------------
// 1. LIVE OFFICIAL FIREBASE INITIALIZATION
// ----------------------------------------------------------------------------
export let liveAuth: any = null;
export let liveDb: any = null;

if (IS_FIREBASE_CONFIGURED) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    liveAuth = getAuth(app);
    liveDb = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
    console.log("🔥 Official Firebase connected successfully!");
  } catch (err) {
    console.error("⚠️ Failed to initialize official Firebase: ", err);
  }
} else {
  console.warn("ℹ️ Firebase API key not set. Using secure simulated database layer for evaluation.");
}

// ----------------------------------------------------------------------------
// 2. BACKUP LOCALSTORAGE AUTHENTICATION & STORAGE ENGINE (FOR DEVELOPER FALLBACK)
// ----------------------------------------------------------------------------
const LOCAL_USERS_KEY = "rojstudy_users_db";
const LOCAL_SESSION_KEY = "rojstudy_auth_session";

function getLocalUsersList(): Record<string, any> {
  const data = localStorage.getItem(LOCAL_USERS_KEY);
  return data ? JSON.parse(data) : {};
}

function saveLocalUsersList(users: Record<string, any>) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

// ----------------------------------------------------------------------------
// 3. EXPORTABLE FIREBASE / FLOW WRAPPER API
// ----------------------------------------------------------------------------
export const rzAuth = {
  /**
   * Tracks current active authentication status
   */
  onAuthStateChanged: (callback: (user: AppUser | null) => void) => {
    if (IS_FIREBASE_CONFIGURED && liveAuth) {
      return fbOnAuthStateChanged(liveAuth, async (fbUser: FirebaseUser | null) => {
        if (!fbUser) {
          callback(null);
          return;
        }

        // Retrieve extra metadata from Cloud Firestore
        try {
          const docRef = doc(liveDb, "users", fbUser.uid);
          let docSnap;
          try {
            docSnap = await getDoc(docRef);
          } catch (getErr) {
            handleFirestoreError(getErr, OperationType.GET, `users/${fbUser.uid}`);
          }
          if (docSnap && docSnap.exists()) {
            const data = docSnap.data();
            callback({
              uid: fbUser.uid,
              name: data.name || fbUser.displayName || "Student",
              email: fbUser.email || "",
              photoURL: data.photoURL || fbUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${fbUser.uid}`,
              createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
              bio: data.bio || "Enrolled in Roz Study Academy.",
              completedVideoIds: data.completedVideoIds || [],
              bookmarkedVideoIds: data.bookmarkedVideoIds || [],
              xp: typeof data.xp === "number" ? data.xp : 0,
              streak: typeof data.streak === "number" ? data.streak : 1,
              certificates: data.certificates || [],
              watchHistory: data.watchHistory || [],
              examScores: data.examScores || {}
            });
          } else {
            // Profile entry does not exist yet (e.g. initial Google login success)
            const newUser: AppUser = {
              uid: fbUser.uid,
              name: fbUser.displayName || "Graduate",
              email: fbUser.email || "",
              photoURL: fbUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${fbUser.uid}`,
              createdAt: new Date().toISOString(),
              bio: "Enrolled in Roz Study Academy.",
              completedVideoIds: [],
              bookmarkedVideoIds: [],
              xp: 0,
              streak: 1,
              certificates: [],
              watchHistory: [],
              examScores: {}
            };
            // Seed profile doc in Firestore asynchronously
            try {
              await setDoc(docRef, {
                uid: newUser.uid,
                name: newUser.name,
                email: newUser.email,
                photoURL: newUser.photoURL,
                createdAt: serverTimestamp(),
                bio: newUser.bio,
                completedVideoIds: newUser.completedVideoIds,
                bookmarkedVideoIds: newUser.bookmarkedVideoIds,
                xp: newUser.xp,
                streak: newUser.streak,
                certificates: newUser.certificates,
                watchHistory: newUser.watchHistory,
                examScores: newUser.examScores
              });
            } catch (setErr) {
              handleFirestoreError(setErr, OperationType.CREATE, `users/${fbUser.uid}`);
            }
            callback(newUser);
          }
        } catch (e) {
          // Fallback to local profile representation
          callback({
            uid: fbUser.uid,
            name: fbUser.displayName || "Graduate",
            email: fbUser.email || "",
            photoURL: fbUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${fbUser.uid}`,
            createdAt: new Date().toISOString(),
            bio: "Enrolled in Roz Study Academy.",
            completedVideoIds: [],
            bookmarkedVideoIds: [],
            xp: 0,
            streak: 1,
            certificates: [],
            watchHistory: [],
            examScores: {}
          });
        }
      });
    } else {
      // Local simulated response loop
      const checkSession = () => {
        const session = localStorage.getItem(LOCAL_SESSION_KEY);
        if (session) {
          const user = JSON.parse(session);
          // Retrieve latest from user list to get saved progress
          const users = getLocalUsersList();
          const latestUser = Object.values(users).find((u: any) => u.uid === user.uid);
          callback(latestUser || user);
        } else {
          callback(null);
        }
      };
      
      checkSession();
      // Listen to storage changes to coordinate across multi-tabs
      const handleStorage = (e: StorageEvent) => {
        if (e.key === LOCAL_SESSION_KEY) {
          checkSession();
        }
      };
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    }
  },

  /**
   * Registers a new student credential account
   */
  registerWithEmail: async (email: string, password: string, name: string): Promise<AppUser> => {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (IS_FIREBASE_CONFIGURED && liveAuth) {
      const userCredential = await fbCreateUserWithEmail(liveAuth, trimmedEmail, password);
      const fbUser = userCredential.user;
      
      // Assign the visual profile name with Firebase Auth update
      await updateProfile(fbUser, { displayName: name });
      
      const newUser: AppUser = {
        uid: fbUser.uid,
        name: name,
        email: trimmedEmail,
        photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${fbUser.uid}`,
        createdAt: new Date().toISOString(),
        bio: "Enrolled in Roz Study Academy.",
        completedVideoIds: [],
        bookmarkedVideoIds: [],
        xp: 0,
        streak: 1,
        certificates: [],
        watchHistory: [],
        examScores: {}
      };

      // Write user profile metadata to Cloud Firestore DB
      const userDocRef = doc(liveDb, "users", fbUser.uid);
      try {
        await setDoc(userDocRef, {
          uid: newUser.uid,
          name: newUser.name,
          email: newUser.email,
          photoURL: newUser.photoURL,
          createdAt: serverTimestamp(),
          bio: newUser.bio,
          completedVideoIds: newUser.completedVideoIds,
          bookmarkedVideoIds: newUser.bookmarkedVideoIds,
          xp: newUser.xp,
          streak: newUser.streak,
          certificates: newUser.certificates,
          watchHistory: newUser.watchHistory,
          examScores: newUser.examScores
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${fbUser.uid}`);
      }

      return newUser;
    } else {
      // Simulated Database write
      const users = getLocalUsersList();
      if (users[trimmedEmail]) {
        throw new Error("auth/email-already-in-use");
      }

      const uid = "usr_" + Math.random().toString(36).substring(2, 11);
      const newUser: AppUser = {
        uid,
        name,
        email: trimmedEmail,
        photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${uid}`,
        createdAt: new Date().toISOString(),
        bio: "Enrolled in Roz Study Academy.",
        completedVideoIds: [],
        bookmarkedVideoIds: [],
        xp: 0,
        streak: 1,
        certificates: [],
        watchHistory: [],
        examScores: {}
      };

      // Store in fake users array with hash simulation
      users[trimmedEmail] = { ...newUser, password };
      saveLocalUsersList(users);

      // Create Session
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(newUser));
      // Dispatch a storage event to alert active listeners
      window.dispatchEvent(new Event("storage"));
      
      return newUser;
    }
  },

  /**
   * Authenticates standard student credentials
   */
  loginWithEmail: async (email: string, password: string): Promise<AppUser> => {
    const trimmedEmail = email.trim().toLowerCase();

    if (IS_FIREBASE_CONFIGURED && liveAuth) {
      const userCredential = await fbSignInWithEmail(liveAuth, trimmedEmail, password);
      const fbUser = userCredential.user;

      // Fetch user profile from Firestore, fallback if failed
      let profile: AppUser = {
        uid: fbUser.uid,
        name: fbUser.displayName || "Interactive Student",
        email: trimmedEmail,
        photoURL: fbUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${fbUser.uid}`,
        createdAt: new Date().toISOString(),
        bio: "Enrolled in Roz Study Academy.",
        completedVideoIds: [],
        bookmarkedVideoIds: [],
        xp: 0,
        streak: 1,
        certificates: [],
        watchHistory: [],
        examScores: {}
      };

      try {
        const docRef = doc(liveDb, "users", fbUser.uid);
        let docSnap;
        try {
          docSnap = await getDoc(docRef);
        } catch (getErr) {
          handleFirestoreError(getErr, OperationType.GET, `users/${fbUser.uid}`);
        }
        if (docSnap && docSnap.exists()) {
          const data = docSnap.data();
          profile = {
            uid: fbUser.uid,
            name: data.name || profile.name,
            email: trimmedEmail,
            photoURL: data.photoURL || profile.photoURL,
            createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt || profile.createdAt,
            bio: data.bio || profile.bio,
            completedVideoIds: data.completedVideoIds || profile.completedVideoIds,
            bookmarkedVideoIds: data.bookmarkedVideoIds || profile.bookmarkedVideoIds,
            xp: typeof data.xp === "number" ? data.xp : profile.xp,
            streak: typeof data.streak === "number" ? data.streak : profile.streak,
            certificates: data.certificates || profile.certificates,
            watchHistory: data.watchHistory || profile.watchHistory,
            examScores: data.examScores || profile.examScores
          };
        }
      } catch (e) {
        // Log warning or handle
        console.warn("Firebase Auth Profile read warning in loginWithEmail: ", e);
      }

      return profile;
    } else {
      const users = getLocalUsersList();
      const match = users[trimmedEmail];
      if (!match || match.password !== password) {
        throw new Error("auth/wrong-password");
      }

      const currentProfile: AppUser = {
        uid: match.uid,
        name: match.name,
        email: match.email,
        photoURL: match.photoURL,
        createdAt: match.createdAt,
        bio: match.bio || "Enrolled in Roz Study Academy.",
        completedVideoIds: match.completedVideoIds || [],
        bookmarkedVideoIds: match.bookmarkedVideoIds || [],
        xp: typeof match.xp === "number" ? match.xp : 0,
        streak: typeof match.streak === "number" ? match.streak : 1,
        certificates: match.certificates || [],
        watchHistory: match.watchHistory || [],
        examScores: match.examScores || {}
      };

      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(currentProfile));
      window.dispatchEvent(new Event("storage"));
      return currentProfile;
    }
  },

  /**
   * Authenticates securely using Google Authentication Popup API
   */
  loginWithGooglePopup: async (): Promise<AppUser> => {
    if (IS_FIREBASE_CONFIGURED && liveAuth) {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(liveAuth, provider);
      const fbUser = userCredential.user;

      const userDocRef = doc(liveDb, "users", fbUser.uid);
      let docSnap;
      try {
        docSnap = await getDoc(userDocRef);
      } catch (getErr) {
        handleFirestoreError(getErr, OperationType.GET, `users/${fbUser.uid}`);
      }
      
      let profile: AppUser;
      if (docSnap && docSnap.exists()) {
        const data = docSnap.data();
        profile = {
          uid: fbUser.uid,
          name: data.name || fbUser.displayName || "Google Pupil",
          email: fbUser.email || "",
          photoURL: data.photoURL || fbUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${fbUser.uid}`,
          createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
          bio: data.bio || "Enrolled in Roz Study Academy.",
          completedVideoIds: data.completedVideoIds || [],
          bookmarkedVideoIds: data.bookmarkedVideoIds || [],
          xp: typeof data.xp === "number" ? data.xp : 0,
          streak: typeof data.streak === "number" ? data.streak : 1,
          certificates: data.certificates || [],
          watchHistory: data.watchHistory || [],
          examScores: data.examScores || {}
        };
      } else {
        profile = {
          uid: fbUser.uid,
          name: fbUser.displayName || "Google Pupil",
          email: fbUser.email || "",
          photoURL: fbUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${fbUser.uid}`,
          createdAt: new Date().toISOString(),
          bio: "Enrolled in Roz Study Academy via Google Secure Sign-In.",
          completedVideoIds: [],
          bookmarkedVideoIds: [],
          xp: 0,
          streak: 1,
          certificates: [],
          watchHistory: [],
          examScores: {}
        };
        // Seed Google User Document in Firestore
        try {
          await setDoc(userDocRef, {
            uid: profile.uid,
            name: profile.name,
            email: profile.email,
            photoURL: profile.photoURL,
            createdAt: serverTimestamp(),
            bio: profile.bio,
            completedVideoIds: profile.completedVideoIds,
            bookmarkedVideoIds: profile.bookmarkedVideoIds,
            xp: profile.xp,
            streak: profile.streak,
            certificates: profile.certificates,
            watchHistory: profile.watchHistory,
            examScores: profile.examScores
          });
        } catch (setErr) {
          handleFirestoreError(setErr, OperationType.CREATE, `users/${fbUser.uid}`);
        }
      }

      return profile;
    } else {
      // Simulate Google Sign In Success using beautiful random assets
      const uid = "usr_g" + Math.random().toString(36).substring(2, 11);
      const email = "evaluation.google@gmail.com";
      const profile: AppUser = {
        uid,
        name: "Google Evaluator",
        email,
        photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${uid}`,
        createdAt: new Date().toISOString(),
        bio: "Enrolled in Roz Study Academy.",
        completedVideoIds: [],
        bookmarkedVideoIds: [],
        xp: 0,
        streak: 1,
        certificates: [],
        watchHistory: [],
        examScores: {}
      };

      // Add to local database
      const users = getLocalUsersList();
      users[email] = { ...profile, password: "GoogleOAuthSimulated_Secure" };
      saveLocalUsersList(users);

      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(profile));
      window.dispatchEvent(new Event("storage"));
      return profile;
    }
  },

  /**
   * Resets forgotten account passwords
   */
  resetPasswordEmail: async (email: string): Promise<void> => {
    const trimmedEmail = email.trim().toLowerCase();
    if (IS_FIREBASE_CONFIGURED && liveAuth) {
      await fbSendPasswordReset(liveAuth, trimmedEmail);
    } else {
      // Simulated Email dispatch confirmation
      const users = getLocalUsersList();
      if (!users[trimmedEmail]) {
        throw new Error("auth/user-not-found");
      }
      console.log(`✉️ A password reset simulation has been logged to console for: ${trimmedEmail}`);
    }
  },

  /**
   * Dismisses session permissions
   */
  signOut: async (): Promise<void> => {
    if (IS_FIREBASE_CONFIGURED && liveAuth) {
      await fbSignOut(liveAuth);
    } else {
      localStorage.removeItem(LOCAL_SESSION_KEY);
      window.dispatchEvent(new Event("storage"));
    }
  },

  /**
   * Persists tracking data (XP, streaks, bookmarks, completions) synchronously to database (Firestore or Simulated)
   */
  saveUserProfile: async (uid: string, data: Partial<AppUser>): Promise<void> => {
    if (IS_FIREBASE_CONFIGURED && liveDb) {
      try {
        const userDocRef = doc(liveDb, "users", uid);
        await setDoc(userDocRef, data, { merge: true });
        console.log("💾 Progress safely persisted to cloud database.");
      } catch (err: any) {
        console.error("⚠️ Failed to update remote Firestore student progress:", err);
        handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
      }
    } else {
      const users = getLocalUsersList();
      const email = Object.keys(users).find(key => users[key].uid === uid);
      if (email) {
        users[email] = {
          ...users[email],
          ...data
        };
        saveLocalUsersList(users);
      }

      // Update current session storage too if it matches active user
      const currentSessionItem = localStorage.getItem(LOCAL_SESSION_KEY);
      if (currentSessionItem) {
        const currentSession = JSON.parse(currentSessionItem);
        if (currentSession.uid === uid) {
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({
            ...currentSession,
            ...data
          }));
          window.dispatchEvent(new Event("storage"));
        }
      }
    }
  }
};

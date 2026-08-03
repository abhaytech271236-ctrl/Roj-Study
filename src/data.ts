import { Playlist } from "./types";

export const PLAYLISTS_DATA: Playlist[] = [
  {
    id: "internship-1",
    title: "Internship Playlist (Frontend)",
    description: "Launch your career with a complete modern frontend curriculum. From absolute zero in HTML to advanced single-page applications in React.",
    category: "Frontend Development",
    totalVideos: 9,
    accentColor: "from-blue-500 to-cyan-400",
    videos: [
      { id: "v1", title: "1. HTML Essentials & Tags", youtubeUrl: "https://youtu.be/rklidcZ-aLU?si=wdDC-0BFSscTaqLb", duration: "4:14:36", description: "Learn the foundational markup language of the web. Explore document structures, headings, semantic tags, forms, and attributes." },
      { id: "v2", title: "2. Build Your First HTML Project", youtubeUrl: "https://youtu.be/uNcMKFkAKuw?si=JOd86VEgRQOuSiKz", duration: "25:15", description: "Solidify your HTML knowledge by building a clean, semantic personal resume website completely from scratch." },
      { id: "v3", title: "3. CSS Layouts, Flexbox & Grid", youtubeUrl: "https://youtu.be/OpWjt_wbV4E?si=WK7Nl8f36ge49N6h", duration: "32:08", description: "Design responsive, stylish page layouts. Deep dive into colors, margins, Flexbox positioning, and CSS Grid." },
      { id: "v4", title: "4. Complete HTML + CSS Landing Page", youtubeUrl: "https://youtu.be/nGhKIC_7Mkk?si=nICpD1rlUz82HtSm", duration: "45:30", description: "Implement a highly professional business landing page with background images, custom navigations, and hover transitions." },
      { id: "v5", title: "5. Responsive UI with Bootstrap", youtubeUrl: "https://youtu.be/fB00t4At0rk?si=iwOfIxCYaU4--pN_", duration: "22:12", description: "Accelerate development using the Bootstrap grid, components, dark cards, utility classes, and custom nav elements." },
      { id: "v6", title: "6. JavaScript Core & Logic Basics", youtubeUrl: "https://youtu.be/cpoXLj24BDY?si=GOvD8bQQcOUn3v-x", duration: "50:18", description: "Unlock browser interactivity. Code conditional logic, helper arithmetic, array methods, loops, and functional calculations." },
      { id: "v7", title: "7. HTML + CSS + JS Interactive Dashboard", youtubeUrl: "https://youtu.be/oFnIe-RpkE4?si=27e1_UA00xoFPp9H", duration: "38:40", description: "Create an interactive client dashboard with task adding lists, local storage sync, and dynamic UI updates." },
      { id: "v8", title: "8. Modern React Functional State & Hooks", youtubeUrl: "https://youtu.be/eILUmCJhl64?si=uSRqSmGniWNIk5JM", duration: "55:00", description: "Enter React with component-driven state, interactive JSX, dynamic props rendering, and state hook implementations." },
      { id: "v9", title: "9. Full React Capstone Project", youtubeUrl: "https://youtu.be/TTx7Y3a7EmA?si=gEWtWZpyQs4zYM8f", duration: "1:15:00", description: "Build a production-grade e-learning course dashboard containing playlist sidebars and progress percentages." }
    ]
  },
  {
    id: "internship-2",
    title: "Internship 2 (Backend Development)",
    description: "Deep dive into APIs, databases, authentication middleware, cookies, and production serving architectures.",
    category: "Backend Development",
    totalVideos: 23,
    accentColor: "from-purple-600 to-indigo-400",
    videos: Array.from({ length: 23 }, (_, index) => {
      const ids = [
        "TlB_eWDSMt4", "fBNz5xF-Kx4", "ENrzD9HAZK4", "yH59vK9YIQQ", 
        "H9M02of22z4", "Oe421EPjeBE", "K_M93vFm8YQ", "qwfE7fSVaCg"
      ];
      let youtubeUrl = `https://www.youtube.com/watch?v=${ids[index % ids.length]}`;
      if (index === 0) {
        youtubeUrl = "https://youtu.be/AZzV3wZCvI4?si=D67kEp9kiNp4BiYp";
      } else if (index === 1) {
        youtubeUrl = "https://youtu.be/sqTH6_xjhBY?si=ZXuN59Hby73f-y5u";
      } else if (index === 2) {
        youtubeUrl = "https://youtu.be/nNihy9kZmIU?si=VzWOuj7EPEASxyMt";
      } else if (index === 3) {
        youtubeUrl = "https://youtu.be/9HYAaXwS7I4?si=-Rw_dnbrgl-zlZm-";
      } else if (index === 4) {
        youtubeUrl = "https://youtu.be/u2CKVFcvaxA?si=qh8FYBUxMIUdcO_e";
      } else if (index === 5) {
        youtubeUrl = "https://youtu.be/Pk9J0SvNXUs?si=vYi_w-505YFup1PD";
      } else if (index === 6) {
        youtubeUrl = "https://youtu.be/Y-hNztFGOXo?si=TEo5Wdpmj_xCymas";
      } else if (index === 7) {
        youtubeUrl = "https://youtu.be/gG47rm_vg8M?si=Cfe1XtKtCg6xWTs6";
      } else if (index === 8) {
        youtubeUrl = "https://youtu.be/J-QgmSzyA_A?si=smhZofS6sbm-B_xR";
      } else if (index === 9) {
        youtubeUrl = "https://youtu.be/uY4cMWoZFMs?si=WjnS2Tme71jX9-rX";
      } else if (index === 10) {
        youtubeUrl = "https://youtu.be/GNTDLqKWknw?si=JsUMPHKGSac2ohbO";
      } else if (index === 11) {
        youtubeUrl = "https://youtu.be/WaObzvMEgd4?si=Yt_lYLL3XeIugTkT";
      } else if (index === 12) {
        youtubeUrl = "https://youtu.be/N3rkdpBjmH8?si=uvIXGtxLem1ZS3_l";
      } else if (index === 13) {
        youtubeUrl = "https://youtu.be/qbHmaHjOKPE?si=64jLa7XUncJ_n0lC";
      } else if (index === 14) {
        youtubeUrl = "https://youtu.be/68UFRuVyim8?si=umLndPeykkZA8QPl";
      } else if (index === 15) {
        youtubeUrl = "https://youtu.be/-6xGHdkwx_M?si=Nsi9SzZPJWPC-yvx";
      } else if (index === 16) {
        youtubeUrl = "https://youtu.be/dfgnVPB4muo?si=rXXUVlYBW3uLLkVy";
      } else if (index === 17) {
        youtubeUrl = "https://youtu.be/IegWwNkcTxg?si=FspcN6QtZTcplQql";
      } else if (index === 18) {
        youtubeUrl = "https://youtu.be/1GFXygmMvU4?si=IXnMiSySWsA8iZ02";
      } else if (index === 19) {
        youtubeUrl = "https://youtu.be/y_Ia7RP4rzk?si=yTiqNgcCwCLNihzl";
      } else if (index === 20) {
        youtubeUrl = "https://youtu.be/837d-bTG6Xs?si=kWtNmEAyFk1wnwSK";
      } else if (index === 21) {
        youtubeUrl = "https://youtu.be/n-7KgmUFvuI?si=E5AqwCk709YJ9Exu";
      } else if (index === 22) {
        youtubeUrl = "https://youtu.be/kfcnYB0sQbM?si=646n4uXrklWllUbb";
      }
      const titleNum = index + 1;
      let title = `${titleNum}. Backend Architecture & ${
        [
          "HTTP Protocol Essentials", "NodeJS Runtime Setup", "Npm Modules and Global Commands", "Express Server Bootstrapping",
          "Routing & Request Query Parameters", "REST API Schema Design", "JSON Middleware Handling", "Express Controllers Flow",
          "Understanding CORS Blockers", "Connecting MongoDB database", "Mongoose Object Schema Design", "CRUD Data Operations API",
          "Relational SQL vs Non-Relational Storage", "Designing Custom Middleware Functions", "Session Headers Verification",
          "JSON Web Token (JWT) Cryptography", "Local Storage vs Secure Cookies", "Hashing Passwords Safely (Bcrypt)",
          "Environment Variable Declarations", "Unit testing HTTP with Jest", "Deploying Node Server to Cloud Run",
          "Web App Security Best Practices", "Building Robust Backend Pipelines"
        ][index] || `Server Concept Pillar ${titleNum}`
      }`;
      if (index === 0) {
        title = "1. Introduction to NodeJS";
      } else if (index === 1) {
        title = "Lecture 2: Installing NodeJS";
      } else if (index === 2) {
        title = "Lecture 3: First Node Server";
      } else if (index === 3) {
        title = "Lecture 4: Request & Response";
      } else if (index === 4) {
        title = "Lecture 5: Parsing Request";
      } else if (index === 5) {
        title = "Lecture 6: Event Loop and Async Code";
      } else if (index === 6) {
        title = "Lecture 7: NPM and Tools";
      } else if (index === 7) {
        title = "Lecture 8: Errors and Debugging";
      } else if (index === 8) {
        title = "Lecture 9: Introduction to express.js";
      } else if (index === 9) {
        title = "Lecture 10: express.js DeepDive";
      } else if (index === 10) {
        title = "Lecture 11: Styling using Tailwind";
      } else if (index === 11) {
        title = "Lecture 12: Dynamic UI using EJS";
      } else if (index === 12) {
        title = "Lecture 13: MVC Architecture";
      } else if (index === 13) {
        title = "Lecture 14: Dynamic Path Part - 1";
      } else if (index === 14) {
        title = "Lecture 14: Dynamic Path Part - 2";
      } else if (index === 15) {
        title = "Lecture 15: Introduction to SQL";
      } else if (index === 16) {
        title = "Lecture 16: Introduction to MongoDB";
      } else if (index === 17) {
        title = "Lecture 17: Introduction to Mongoose";
      } else if (index === 18) {
        title = "Lecture 18: Cookies and Sessions";
      } else if (index === 19) {
        title = "Lecture 19: Authentication & Authorization";
      } else if (index === 20) {
        title = "Lecture 20: File Upload & Download";
      } else if (index === 21) {
        title = "Lecture 21: REST API and JSON Requests";
      } else if (index === 22) {
        title = "Lecture 22: Build Your Own AI Website Builder Using PERN Stack";
      }
      return {
        id: `v${titleNum}`,
        title,
        youtubeUrl,
        duration: `${15 + (index * 3) % 25}min`,
        description: `Backend curriculum standard node training: deep dive into constructing Express applications, securing server-level logic, and managing secure databases.`
      };
    })
  },
  {
    id: "fullstack-project",
    title: "Build a Full Stack Web Application Using (MongoDB, Express Js, React Js & Node Js)",
    description: "Learn to build a complete, production-ready MERN stack application from scratch, covering frontend views, API controllers, and database connectivity.",
    category: "Fullstack Systems",
    totalVideos: 10,
    accentColor: "from-pink-500 to-rose-400",
    videos: [
      {
        id: "v1",
        title: "1. Build Your Web Application Using MongoDB, Express, React & Node.js",
        youtubeUrl: "https://youtu.be/7l5UgtWfnw0?si=FowFkS2ZtEvW4KI2",
        duration: "11:54:12",
        description: "Connect high-performance React user panels with Node.js controllers, syncing remote state variables and MongoDB models."
      },
      {
        id: "v2",
        title: "2. Build an Uber Clone App with MERN Stack",
        youtubeUrl: "https://youtu.be/4qyBjxPlEZo?si=gIKV5tapsocMnXQG",
        duration: "6:24:18",
        description: "Master real-time geolocation mapping, socket connections, driver dispatching mechanics, and complex state management in a MERN stack clone."
      },
      {
        id: "v3",
        title: "3. Advanced Backend Project | Learn Bank Transaction System with Node.js, Express & MongoDB",
        youtubeUrl: "https://youtu.be/NQOAQP0mow0?si=BzGLGCtxEYampBgL",
        duration: "5:45:00",
        description: "Build a highly secure banking transaction application using Node.js, Express, and MongoDB, detailing transactional integrity and database schemas."
      },
      {
        id: "v4",
        title: "4. Build a FullStack Job Portal App with MERN Stack (MongoDB, Express, React Js, Node Js)",
        youtubeUrl: "https://youtu.be/F5EYXc91Cpo?si=MTrcZbskCAukRvgL",
        duration: "8:26:10",
        description: "Build a modern fullstack Job Portal from scratch, implementing advanced search, candidate/employer systems, application statuses, and resume parsing concepts."
      },
      {
        id: "v5",
        title: "5. Build Your Own AI Chatbot SaaS in 10 Minutes!",
        youtubeUrl: "https://youtu.be/rubsZej4wFM?si=h4zG1duadGpFl3mI",
        duration: "10:00",
        description: "Learn how to build and deploy an AI chatbot SaaS application under 10 minutes with rapid integration patterns."
      },
      {
        id: "v6",
        title: "6. Build and Deploy a Full Stack Video Conferencing App with Next JS",
        youtubeUrl: "https://youtu.be/R8CIO1DZ2b8?si=QiAji9_BHRBQHj1m",
        duration: "4:15:00",
        description: "Implement video calls, authentication, recording functionality, real-time feedback loops, and highly responsive conference UI grids."
      },
      {
        id: "v7",
        title: "7. Make Complete Hotel Booking App Using React js",
        youtubeUrl: "https://youtu.be/QSjHs5Qd-GQ?si=DWC8R8kKlYYxO8tQ",
        duration: "3:45:30",
        description: "Develop a complete hotel room booking application featuring calendar date pickers, dynamic pricing configurations, room detail modals, and polished reservation states."
      },
      {
        id: "v8",
        title: "8. Build and Deploy a Full Stack Movie Ticket Booking App using React js",
        youtubeUrl: "https://youtu.be/Pez37wmUaQM?si=T9gW1jEXmq8oKe9j",
        duration: "5:12:00",
        description: "Build a comprehensive cinema seat selection map, theater filter dropdown, receipt generation, and beautiful movie catalog with payment gateway simulations."
      },
      {
        id: "v9",
        title: "9. Create YouTube Clone Using React JS",
        youtubeUrl: "https://youtu.be/Zb1zVeXLUf8?si=IJRndGUEq5MmL6cw",
        duration: "2:54:10",
        description: "Build a fully integrated YouTube clone with video streams, dynamic sidebars, content categories, search functionalities, and an immersive video playback player."
      },
      {
        id: "v10",
        title: "10. GitHub Profile Analyzer using React.js",
        youtubeUrl: "https://youtu.be/tK5DegUFxyo?si=Y6UO6yRiEIiygIMr",
        duration: "1:24:45",
        description: "Build a sleek GitHub Profile Analyzer with interactive stats, charts, repositories, key metrics, and API integration utilizing React.js."
      }
    ]
  },
  {
    id: "dsa-java",
    title: "DSA {Data Structure & Algorithms}",
    description: "Unlock interview readiness. Master Java programming foundations, basic mathematics, recursion, and complex algorithmic architectures.",
    category: "Computer Science",
    totalVideos: 69,
    accentColor: "from-emerald-500 to-teal-400",
    videos: [
      {
        id: "v1",
        title: "1. DSA with java + Interview Lecture 1",
        youtubeUrl: "https://youtu.be/rZ41y93P2Qo?si=cYrDSTYtF9KIC5S5",
        duration: "2:34:25",
        description: "Begin your DSA journey with Java. This lecture covers system design foundations, compiler basics, flowcharts, and the curriculum syllabus."
      },
      {
        id: "v2",
        title: "2. Java vs C++ for Data Structures & Algorithms",
        youtubeUrl: "https://youtu.be/Nckx9qMy_kw?si=U-E-MX_8d1OuH3ww",
        duration: "23:45",
        description: "An in-depth debate and comparative analysis of Java vs C++ for learning data structures, algorithm implementation, and technical interviews."
      },
      {
        id: "v3",
        title: "3. Complete Git and GitHub Tutorial",
        youtubeUrl: "https://youtu.be/apGV9Kg7ics?si=SUo3zLmun9FRSK4K",
        duration: "1:21:40",
        description: "Master version control with Git and GitHub. Learn committing, branching, merging, resolving conflicts, and managing repositories efficiently."
      },
      {
        id: "v4",
        title: "4. How I Cleared My Google Interviews - Use LeetCode Effectively!",
        youtubeUrl: "https://youtu.be/waGfV-IoOt8?si=FThnLSAUJ6syuMP2",
        duration: "15:30",
        description: "Learn proven strategies to utilize LeetCode effectively, crack technical product architecture questions, and succeed in FAANG-level interviews."
      },
      {
        id: "v5",
        title: "5. Introduction to Programming - Types of Languages, Memory Management",
        youtubeUrl: "https://youtu.be/wn49bJOYAZM?si=MKfEzPyycX_jYC42",
        duration: "44:18",
        description: "Explore core programming paradigms, compiler vs interpreter operations, static vs dynamic typing mechanics, and computer memory management fundamentals."
      },
      {
        id: "v6",
        title: "6. Flow of Program - Flowcharts & Pseudocode",
        youtubeUrl: "https://youtu.be/lhELGQAV4gg?si=wJ5PEPMjdqJGbP9z",
        duration: "52:10",
        description: "Understand the logical flow of computer programs. Learn to design flowcharts, write clean pseudocode, and model programming control architectures."
      },
      {
        id: "v7",
        title: "7. Introduction to Java - Architecture & Installation",
        youtubeUrl: "https://youtu.be/4EP8YzcN0hQ?si=O11_DwGIUKh--eem",
        duration: "1:18:24",
        description: "Deep dive into the architecture of Java, including JVM, JRE, and JDK internals, and step-by-step setup guides to install development environments."
      },
      {
        id: "v8",
        title: "8. First Java Program - Input/Output, Debugging and Datatypes",
        youtubeUrl: "https://youtu.be/TAtrPoaJ7gc?si=FZV1_ecigkTlyHPO",
        duration: "2:17:35",
        description: "Explore your first Java program. Learn about compilation and execution processes, variables, primitive types, input/output operations, and basic debugging setup."
      },
      {
        id: "v9",
        title: "9. Conditionals and Loops + Calculator Program",
        youtubeUrl: "https://youtu.be/ldYLYRNaucM?si=sj1n97hTXRCpAQio",
        duration: "1:38:15",
        description: "Learn control flow mechanics using conditionals and loops. Build a fully functional, interactive command-line calculator program in Java."
      },
      {
        id: "v10",
        title: "10. Switch Statements + Nested Case in Java",
        youtubeUrl: "https://youtu.be/mA23x39DjbI?si=F7QH4Pq9f7CiPpLG",
        duration: "37:57",
        description: "Master switch statement syntax and behaviors in Java, including traditional vs modern enhanced switch structures and handling nested conditional cases."
      },
      {
        id: "v11",
        title: "11. Functions / Methods in Java",
        youtubeUrl: "https://youtu.be/vvanI8NRlSI?si=5yIOdHwQ4auiuVuQ",
        duration: "1:21:13",
        description: "Master functions and methods in Java. Learn about method definition, call stack operations, argument passing mechanics, block and method scopes, shadow variables, variable length arguments (varargs), and function overloading."
      },
      {
        id: "v12",
        title: "12. Introduction to Arrays and ArrayList in Java",
        youtubeUrl: "https://youtu.be/n60Dn0UsbEk?si=DG416Dpw7bYuJ0dd",
        duration: "2:21:39",
        description: "Comprehensive introduction to Arrays and ArrayList in Java. Master internal architecture, memory allocation, multi-dimensional structures, and dynamic sizing properties."
      },
      {
        id: "v13",
        title: "13. Linear Search Algorithm - Theory + Code + Questions",
        youtubeUrl: "https://youtu.be/_HRA37X8N_Q?si=hqVRUKzhX3Cta0zA",
        duration: "55:36",
        description: "Master the Linear Search algorithm in Java. Understand foundational searching concepts, index tracking, character searching, multidimensional searching, and search optimization questions."
      },
      {
        id: "v14",
        title: "14. Binary Search Algorithm - Theory + Code",
        youtubeUrl: "https://youtu.be/f6UU7V3szVw?si=anl67Ormt97zjcmq",
        duration: "1:14:30",
        description: "Master the Binary Search algorithm in Java. Understand search space halving, overflow-safe middle index calculation, and worst-case logarithmic complexity."
      },
      {
        id: "v15",
        title: "15. Binary Search Interview Questions - Google, Facebook, Amazon",
        youtubeUrl: "https://youtu.be/W9QJ8HaRvJQ?si=So1FJSMnWOeg4k9s",
        duration: "3:28:34",
        description: "Solve popular LeetCode and FAANG interview questions using Binary Search. Key topics include ceiling/floor search, indexing peak elements, searching in infinite arrays, and rotated array search."
      },
      {
        id: "v16",
        title: "16. Binary Search in 2D Arrays - Theory + Code",
        youtubeUrl: "https://youtu.be/enI_KyGLYPo?si=hJagd3KVlHxEjr9N",
        duration: "53:11",
        description: "Master Binary Search in 2D arrays (matrices). Learn optimal search strategies for row-wise & column-wise sorted matrices and strictly sorted matrices with full code implementation."
      },
      {
        id: "v17",
        title: "17. Bubble Sort Algorithm - Theory + Code",
        youtubeUrl: "https://youtu.be/F5MZyqRp_IM?si=ue6rpn50sAe73Or6",
        duration: "55:36",
        description: "Master the Bubble Sort algorithm in Java. Learn the swap operations, pass breakdown, best-case optimization metrics, and full complexity analysis."
      },
      {
        id: "v18",
        title: "18. Selection Sort Algorithm - Theory + Code",
        youtubeUrl: "https://youtu.be/Nd4SCCIHFWk?si=AdvkmOpubIwUJvW-",
        duration: "44:37",
        description: "Master the Selection Sort algorithm in Java. Learn the select-and-swap operations, pass transition breakdowns, stability analysis, and full complexity metrics."
      },
      {
        id: "v19",
        title: "19. Insertion Sort Algorithm - Theory + Code",
        youtubeUrl: "https://youtu.be/By_5-RRqVeE?si=AB2HkuKExcGX4A1V",
        duration: "38:07",
        description: "Master the Insertion Sort algorithm in Java. Learn the comparison-and-shift operations, sorted/unsorted partition boundaries, pass-by-pass logic, stability analysis, and full complexity analysis."
      },
      {
        id: "v20",
        title: "20. Cycle Sort - Amazon, Google, Microsoft Interview Questions",
        youtubeUrl: "https://youtu.be/JfinxytTYFQ?si=qQ8LlBnNTS9e_z7f",
        duration: "1:38:53",
        description: "Master the Cycle Sort algorithm and its applications in coding interviews. Learn how to solve popular problem patterns on missing numbers, repeating elements, and duplicates."
      },
      {
        id: "v21",
        title: "21. Strings and StringBuilder in Java",
        youtubeUrl: "https://youtu.be/zL1DPZ0Ovlo?si=PWtvR5q-H2sRBO_k",
        duration: "1:39:21",
        description: "Master the Strings and StringBuilder classes in Java. Understand String representation, immutability, the String Constant Pool (SCP) memory allocation, performance pitfalls of String manipulation, and how StringBuilder optimizes concatenations."
      },
      {
        id: "v22",
        title: "22. Solve Any Pattern Question With This Trick!",
        youtubeUrl: "https://youtu.be/lsOOs5J8ycw?si=4imyxT8d7lDnkUWw",
        duration: "57:07",
        description: "Master pattern-printing interview questions in Java. Undergo a guided step-by-step methodology to deconstruct nested loops, identify row-column relationships, translate dynamic grids into code logic, and solve any pattern printing problem with ease."
      },
      {
        id: "v23",
        title: "23. Introduction to Recursion - Learn In The Best Way",
        youtubeUrl: "https://youtu.be/M2uO2nMT0Bk?si=SgWb3FaTDAId9HJl",
        duration: "1:10:24",
        description: "Learn the fundamentals of Recursion. Understand how to think recursively, recursive call stacks, and solve basic questions."
      },
      {
        id: "v24",
        title: "24. Time and Space Complexity COMPLETE Tutorial - What is Big O?",
        youtubeUrl: "https://youtu.be/mV3wrLBbuuE?si=Fwdia04FOzqr2MlQ",
        duration: "2:18:41",
        description: "Master Space and Time Complexity analysis. Learn about Big-O, Theta, Omega notations, master theorem, Amortized complexity, and solve practical questions."
      },
      {
        id: "v25",
        title: "25. Bitwise Operators + Number Systems - Maths for DSA",
        youtubeUrl: "https://youtu.be/fzip9Aml6og?si=LbU3cIKVg1HbRcXs",
        duration: "1:52:19",
        description: "Understand Number Systems and Bitwise operators in depth. Learn why computers use binary, bitwise operations (AND, OR, XOR, shifts), and solve interview problems under 1 min."
      },
      {
        id: "v26",
        title: "26. Maths for Data Structures & Algorithms",
        youtubeUrl: "https://youtu.be/lmSpZ0bjCyQ?si=PX4iK2JR8eaqnzLL",
        duration: "1:45:30",
        description: "Master mathematics for competitive programming and tech interviews. Learn Prime Numbers, Sieve of Eratosthenes, Square Roots, GCD/LCM, and modulo arithmetic."
      },
      {
        id: "v27",
        title: "27. Recursion - Level 1 Questions (Theory + Code + Tips)",
        youtubeUrl: "https://youtu.be/JxILxTwHukM?si=eLlFkuRaF3yZFtbL",
        duration: "1:25:12",
        description: "Dive deeper into recursion with Level 1 questions. Learn sum of digits, reverse a number, palindrome, count steps, and conceptual understanding."
      },
      {
        id: "v28",
        title: "28. Recursion - Array Questions (Theory + Code + Tips)",
        youtubeUrl: "https://youtu.be/sTdiMLom00U?si=8KO9tlZXA0-Fwruj",
        duration: "1:15:45",
        description: "Solve recursion questions on 1D and 2D arrays. Understand array sorted checks, linear search with multiple occurrences, and rotated binary search using recursion."
      },
      {
        id: "v29",
        title: "29. Recursion - Pattern Questions + Bubble Sort + Selection Sort",
        youtubeUrl: "https://youtu.be/ymgnIIclCF0?si=OhL9Il7GWXMT0WdA",
        duration: "55:20",
        description: "Learn pattern printing, Bubble Sort, and Selection Sort recursively. Master passing of arguments, base condition structuring, and tree-like execution."
      },
      {
        id: "v30",
        title: "30. Merge Sort Using Recursion (Theory + Complexity + Code)",
        youtubeUrl: "https://youtu.be/iKGAgWdgoRk?si=tAuiUbLzPL5QcZK0",
        duration: "1:18:32",
        description: "Master Merge Sort algorithm using recursion. Practice divide and conquer approach, complexity derivation, sorting sub-arrays, and in-place vs new space comparisons."
      },
      {
        id: "v31",
        title: "31. Quick Sort Using Recursion (Theory + Complexity + Code)",
        youtubeUrl: "https://youtu.be/Z8svOqamag8?si=ErCD_WE0RW0kPIQ1",
        duration: "1:15:32",
        description: "Master the Quick Sort algorithm recursively in Java. Learn the pivot selection strategy, partitioning methodology (Lomuto/Hoare), space & time complexity derivations, and why it is preferred over Merge Sort in specific scenarios."
      },
      {
        id: "v32",
        title: "32. Recursion Subset, Subsequence, String Questions",
        youtubeUrl: "https://youtu.be/gdifkIwCJyg?si=AbZ_fLk5vtSgVwfP",
        duration: "2:05:40",
        description: "Solve complex subset and subsequence questions recursively in Java. Master string permutations, skipping specific characters/strings, subset generation, sub-sequences of a string, and list-returning recursive methods."
      },
      {
        id: "v33",
        title: "33. Recursion - Permutations (Theory + Code + Tips)",
        youtubeUrl: "https://youtu.be/gDGw0cvFXPQ?si=P8ntAmXK0Xklf3tz",
        duration: "1:12:15",
        description: "Understand recursive permutations of strings and arrays. Learn how recursive call trees branch out dynamically, identify how subset generation differs from permutation, and build recursive array-list accumulators."
      },
      {
        id: "v34",
        title: "34. Recursion Google, Amazon Questions: Dice Throw & Letter Combinations of a Phone Number",
        youtubeUrl: "https://youtu.be/9ByWqPzfXDU?si=WMPC612lavBt6NQ-",
        duration: "1:18:24",
        description: "Tackle major interview recursion problems from Google and Amazon. Write recursively engineered solutions for Letter Combinations of a Phone Number, Dice Roll combinations, and dynamic grid search paths."
      },
      {
        id: "v35",
        title: "35. Backtracking Introduction + Maze Problems - Theory + Code + Tips",
        youtubeUrl: "https://youtu.be/zg5v2rlV1tM?si=8K-gSr1xlr5jL73P",
        duration: "1:32:45",
        description: "Introduction to the backtracking paradigm. Understand maze navigation problems, exploring all paths, handling blocked cells in matrices, and the critical concept of undoing matrix state mutations during recursion unwind."
      },
      {
        id: "v36",
        title: "36. N-Queens, N-Knights, Sudoku Solver (LeetCode) - Backtracking Questions",
        youtubeUrl: "https://youtu.be/nC1rbW2YSz0?si=UTm-5J6qTZlDjBCu",
        duration: "2:22:18",
        description: "Master high-level standard backtracking questions in Java. Design and implement efficient backtracking solvers for the classical N-Queens, N-Knights, and full Sudoku puzzles on LeetCode."
      },
      {
        id: "v37",
        title: "37. OOP 1 | Introduction & Concepts - Classes, Objects, Constructors, Keywords",
        youtubeUrl: "https://youtu.be/BSVKUk58K6U?si=dnr0RrvpX1-phGuc",
        duration: "1:48:52",
        description: "Dive deep into Object-Oriented Programming (OOP) in Java. Master fundamental concepts of Classes, Objects, instance creation, constructors (default, parameterized, copy), memory allocations, and 'this', 'new', and 'final' keywords."
      },
      {
        id: "v38",
        title: "38. OOP 2 | Packages, Static, Singleton Class, In-built Methods",
        youtubeUrl: "https://youtu.be/_Ya6CN13t8k?si=sRdB1kBpGBKmAeTv",
        duration: "1:32:14",
        description: "Understand advanced structural OOP in Java. Discover package modularity, class hierarchy, static variables & methods, static initialization blocks, Singleton pattern implementations, and built-in object mechanisms."
      },
      {
        id: "v39",
        title: "39. OOP 3 | Principles - Inheritance, Polymorphism, Encapsulation, Abstraction",
        youtubeUrl: "https://youtu.be/46T2wD3IuhM?si=Kfi0xe7FA95fAYZl",
        duration: "2:14:40",
        description: "Master the four key pillars of Object-Oriented programming. Explore single/multi-level inheritance, dynamic method dispatch/polymorphism, data encapsulation interfaces, and abstract classes vs interfaces with strict examples."
      },
      {
        id: "v40",
        title: "40. OOP 4 | Access Control, In-built Packages, Object Class",
        youtubeUrl: "https://youtu.be/W145DXs8fFg?si=w-NaekHwNj34zkQc",
        duration: "1:15:20",
        description: "Learn the mechanics of Access Control modifiers (private, protected, public, package-private) in Java. Inspect built-in java.lang and utility packages, object class overrides (equals, hashCode, toString), and native clone mechanics."
      },
      {
        id: "v41",
        title: "41. OOP 5 | Abstract Classes, Interfaces, Annotations",
        youtubeUrl: "https://youtu.be/rgHZa7-Dibg?si=6oiSJ5rVQmNub_O7",
        duration: "1:44:15",
        description: "Master abstract classes, interfaces, and annotations in Java. Learn the difference between abstract classes and interfaces, multiple inheritance, default/static interface methods, and functional interfaces."
      },
      {
        id: "v42",
        title: "42. OOP 6 | Generics, Custom ArrayList, Lambda Expressions, Exception Handling, Object Cloning",
        youtubeUrl: "https://youtu.be/OY2lPr8h93U?si=T4GI84_9wPXHdYs_",
        duration: "2:52:10",
        description: "Explore advanced Java concepts. Learn Generics (wildcards, bounded types), custom generic ArrayList design, Lambda expressions, structured exception handling (try-catch-finally, custom exceptions), and deep vs shallow object cloning."
      },
      {
        id: "v43",
        title: "43. OOP 7 | Collections Framework, Vector Class, Enums in Java",
        youtubeUrl: "https://youtu.be/9ogGan-R1pc?si=MBeOnj9r-4MO2pD-",
        duration: "1:25:35",
        description: "Deep dive into the Java Collections Framework. Understand Hierarchy of collections, List/Set/Queue implementations, Vector class thread safety, and Enums class extensions with custom constructor properties."
      },
      {
        id: "v44",
        title: "44. Linked List Tutorial - Singly + Doubly + Circular (Theory + Code + Implementation)",
        youtubeUrl: "https://youtu.be/58YbpRDc4yw?si=Bb_V_QzoYaY3-GHF",
        duration: "1:58:20",
        description: "Complete guide to Linked Lists. Learn memory representation, structural differences, and implementation of Singly, Doubly, and Circular Linked Lists in Java from scratch with node operations."
      },
      {
        id: "v45",
        title: "45. Linked List Interview Questions - Google, Facebook, Amazon, Microsoft",
        youtubeUrl: "https://youtu.be/70tx7KcMROc?si=gMoImU4vV2dgG59S",
        duration: "2:10:45",
        description: "Crack top FAANG Linked List interview questions. Learn Floyd's cycle detection algorithm, list reversal, nodes intersection, middle node finding, merging sorted lists, and happy number solutions."
      },
      {
        id: "v46",
        title: "46. Stacks and Queues Complete Tutorial - Theory + Implementation + Types (Dynamic, Circular)",
        youtubeUrl: "https://youtu.be/rHQI4mrJ3cg?si=ZpQvSnX7lDLcoQ3A",
        duration: "1:35:12",
        description: "Understand Stack and Queue data structures. Master LIFO/FIFO architectures, array and linked list-based implementations, dynamic resizing queues, and circular queue pointer operations."
      },
      {
        id: "v47",
        title: "47. Stacks and Queues Interview Questions - Google, Facebook, Amazon, Microsoft",
        youtubeUrl: "https://youtu.be/S9LUYztYLu4?si=yLSoZe26EE1AxrDs",
        duration: "1:50:28",
        description: "Solve popular Stack and Queue interview problems. Implement queues using stacks (and vice versa), solve the Next Greater Element, Largest Rectangle in Histogram, and Valid Parentheses LeetCode questions."
      },
      {
        id: "v48",
        title: "48. Tic Tac Toe Java Game in Under 15 Minutes",
        youtubeUrl: "https://youtu.be/jlLNXmi4Nmw?si=zrU3bMbM7TowV8Vw",
        duration: "14:48",
        description: "Build a fully playable command-line Tic Tac Toe game in Java in under 15 minutes. Learn board state representation, coordinate parsing, dynamic turn-taking, and win condition checks."
      },
      {
        id: "v49",
        title: "49. Binary Trees Tutorial - Introduction + Traversals + Code | Binary Search Trees (BST)",
        youtubeUrl: "https://youtu.be/4s1Tcvm00pA?si=70gXxFcTsT7ZRJM-",
        duration: "2:08:42",
        description: "Comprehensive introduction to Binary Trees and BSTs. Master properties, memory representation, DFS/BFS traversals (pre-order, in-order, post-order), and node insertion/search operations in search trees."
      },
      {
        id: "v50",
        title: "50. AVL Trees Tutorial | Self Balancing Binary Search Trees",
        youtubeUrl: "https://youtu.be/CVA85JuJEn0?si=j4hh3n2kJWRjP4wU",
        duration: "1:22:15",
        description: "Learn the math and mechanics behind AVL Trees. Work through tree height imbalance issues, single (LL, RR) and double (LR, RL) rotations, and implement self-balancing binary search trees in Java."
      },
      {
        id: "v51",
        title: "51. Segment Trees Tutorial | Range Queries | Interview Questions",
        youtubeUrl: "https://youtu.be/ciHThtTVNto?si=CpzhWmUiH1sR6Jxs",
        duration: "2:14:30",
        description: "Master Segment Trees for answering range queries and carrying out point updates efficiently. Learn the structural representation, range query algorithms, point updates, and complexity breakdowns."
      },
      {
        id: "v52",
        title: "52. StringBuffer in Java | Data Formatting | Working With Large Data",
        youtubeUrl: "https://youtu.be/YFZai3fPUQI?si=fhk7EHg1bGX0hWtl",
        duration: "1:15:20",
        description: "Understand the StringBuffer class in Java. Learn about mutable sequences of characters, thread-safety, capacity vs length, and how it differs from String and StringBuilder during heavy I/O operations."
      },
      {
        id: "v53",
        title: "53. BigInteger & BigDecimal - Handling Large Numbers in Java",
        youtubeUrl: "https://youtu.be/lHtoypC-4Ps?si=-d6P8fzCXHoONqbF",
        duration: "1:02:15",
        description: "Unlock the power of BigInteger and BigDecimal classes in Java. Master handling arbitrarily large integers, high-precision floating-point arithmetic, custom rounding modes, and dynamic factorial calculations."
      },
      {
        id: "v54",
        title: "54. File Handling in Java Complete Course",
        youtubeUrl: "https://youtu.be/b35mlSPOlg?si=NtMSl2zm5nMWY4hB",
        duration: "1:45:30",
        description: "Complete guide to File Handling in Java. Learn about byte streams vs character streams, reading and writing files using FileReader/FileWriter, BufferedReader/BufferedWriter, and managing file systems recursively."
      },
      {
        id: "v55",
        title: "55. Binary Tree Questions for Technical Interviews - Google, Facebook, Amazon, Microsoft",
        youtubeUrl: "https://youtu.be/9D-vP-jcc-Y?si=PsM9u12y9DkM8Gsy",
        duration: "2:58:40",
        description: "Solve advanced binary tree and BST interview questions. Cover tree traversal optimizations, level-order problems, finding node paths, diameter calculations, and lowest common ancestor (LCA) algorithms."
      },
      {
        id: "v56",
        title: "56. Introduction to Heap Data Structure + Priority Queue + Heapsort Tutorial",
        youtubeUrl: "https://youtu.be/Qf-TDPr0nYw?si=MFX6GE5btD30rSSf",
        duration: "1:48:30",
        description: "Complete manual to Heap data structure and Priority Queues. Master Max-Heap/Min-Heap properties, array representation, insertion & deletion algorithms, heapify operations, and heapsort complexity."
      },
      {
        id: "v57",
        title: "57. Introduction to HashMap & HashTable in Java",
        youtubeUrl: "https://youtu.be/XLbvmMz8Fr8?si=32aBJ_7w3wx3XaWt",
        duration: "2:15:40",
        description: "Deep dive into HashMaps and HashTables in Java. Master hashing functions, collision resolution mechanisms (chaining and open addressing), custom Key object requirements, load factors, and rehashing algorithms."
      },
      {
        id: "v58",
        title: "58. Karp-Rabin String Matching Algorithm | Substring Search Pattern",
        youtubeUrl: "https://youtu.be/swciWFPq3NE?si=K0QW_Az3S1F8e7C7",
        duration: "45:20",
        description: "Master the Karp-Rabin string matching algorithm. Understand rolling hash function calculations, prefix sum evaluations, average-case linear-time matching, collision handling, and practical substring searching."
      },
      {
        id: "v59",
        title: "59. Count Sort Algorithm - Theory + Code",
        youtubeUrl: "https://youtu.be/FOo820lJV1Y?si=2f91ADaAmSePN9iF",
        duration: "50:15",
        description: "Learn the linear-time non-comparison based Counting Sort algorithm. Master index-mapping, frequency array configurations, stable prefix calculations, space trade-offs, and complete complexity analysis."
      },
      {
        id: "v60",
        title: "60. Radix Sort Algorithm - Theory + Code",
        youtubeUrl: "https://youtu.be/mLi6VQDqAOs?si=Yw_XfR1l0NOn_YwF",
        duration: "45:10",
        description: "Master the digit-by-digit Radix Sorting algorithm. Master stable distribution sorting, prefix count indexes, complexity derivations for various bases, and comparison with classic sort architectures."
      },
      {
        id: "v61",
        title: "61. Huffman Coding Greedy Algorithm | Text Compression",
        youtubeUrl: "https://youtu.be/XLfgeaYHinM?si=gj9I2vUrUgzYS3l3",
        duration: "1:16:20",
        description: "Master Huffman Coding for text compression utilizing a greedy approach with a Min-Heap. Walk through frequency map analysis, binary tree construction, prefix-free binary codes, and total bit saving calculations."
      },
      {
        id: "v62",
        title: "62. Easily Solve Range Query Interview Problems with Square Root Decomposition/Mo's Algorithm",
        youtubeUrl: "https://youtu.be/U4YmISZViSs?si=6Gbc0HdomRiWS0VO",
        duration: "1:42:20",
        description: "Master Square Root Decomposition and Mo's Algorithm for range query search problems. Learn query block grouping, sorting operations, step-by-step element shifts, and optimal complexity optimizations."
      },
      {
        id: "v63",
        title: "63. Binary Tree from Preorder & Inorder Traversal - Advance Tree Questions",
        youtubeUrl: "https://youtu.be/LFGBTFxHJII?si=G7Fur4FFLQoVUYEU",
        duration: "48:30",
        description: "Reconstruct a unique Binary Tree from Preorder and Inorder traversals using hash map indices. Build the recursive partitioning architecture, identify root nodes, and analyze boundary conditions."
      },
      {
        id: "v64",
        title: "64. Vertical Order Traversal of a Binary Tree - Google Interview Question",
        youtubeUrl: "https://youtu.be/Qdr3ohMSxBo?si=rmCcCGmDPA1FNoSD",
        duration: "1:02:15",
        description: "Solve the infamous Vertical Order Traversal of a Binary Tree problem. Master coordinate mapping with horizontal distances, BFS levels traversal, priority queue grouping, and sorting constraints."
      },
      {
        id: "v65",
        title: "65. Word Ladder - LeetCode Hard - Google Phone Screen Interview Question",
        youtubeUrl: "https://youtu.be/2odLxQWYDi0?si=lsbB2UjMRimfPbY-",
        duration: "1:12:40",
        description: "Master Word Ladder, a classic LeetCode Hard BFS and Graph problem. Learn step-by-step word transitions using a queue, lookup optimizations with sets, and path level tracking for shortest transformation sequence."
      },
      {
        id: "v66",
        title: "66. Two Sum IV - Google, Amazon, Facebook Interview Question",
        youtubeUrl: "https://youtu.be/oB1EIXIDS8s?si=xRoQwlpTa8cCS1nl",
        duration: "34:15",
        description: "Solve Two Sum IV in a Binary Search Tree. Compare BST-Iterator based two-pointer approaches, simple DFS with extra space hash set caching, and analyze execution times and memory spaces."
      },
      {
        id: "v67",
        title: "67. Kth Smallest Element in a BST - Google, Amazon, Facebook Interview Question",
        youtubeUrl: "https://youtu.be/guzgnCSafg4?si=RKK23ysflCIQIvIQ",
        duration: "22:10",
        description: "Discover how to find the Kth Smallest Element in a BST efficiently. Use properties of ordered Inorder traversal, optimized traversal count reductions, and iterative stack parsing without printing the whole tree."
      },
      {
        id: "v68",
        title: "68. Convert Binary Tree to Doubly Linked List - FAANG Interview Question",
        youtubeUrl: "https://youtu.be/kNZ5VIkqReU?si=i7oApZJrwuSbKs4d",
        duration: "35:50",
        description: "Convert a Binary Tree to a Doubly Linked List in-place. Understand pointer linkage manipulations, local reference tracking with left and right child definitions, and recursion-based link joins."
      },
      {
        id: "v69",
        title: "69. Correct Binary Tree That Has Two Nodes Swapped - FAANG Interview Question",
        youtubeUrl: "https://youtu.be/CxNRKTp6_9s?si=EizkAEiZStKBCv4t",
        duration: "38:40",
        description: "Learn how to recover or correct a Binary Tree that has two nodes swapped. Use single-pass inorder traversals to detect standard out-of-order pair sequences and swap their inner values to restore BST properties."
      }
    ]
  },
  {
    id: "generative-ai",
    title: "Generative AI & LLM System",
    description: "Master modern Generative AI, LLMs, prompt engineering, RAG databases, agent tool calling, and full-stack multi-agent architectures.",
    category: "Artificial Intelligence",
    totalVideos: 5,
    accentColor: "from-violet-600 to-fuchsia-400",
    videos: [
      {
        id: "v1",
        title: "1. Generative AI Full Course (Part 1 ) | Beginner to Advanced",
        youtubeUrl: "https://youtu.be/vwncYfhxbR0?si=Hyr_e5huu5G2qTi_",
        duration: "3:15:40",
        description: "Master the foundations of Large Language Models (LLMs). Understand deep learning, transformer architectures, tokenization, positional embeddings, self-attention, and fine-tuning paradigms."
      },
      {
        id: "v2",
        title: "2. Generative AI Full Course (Part 2)  Text Splitters, Vector DB, RAG & LangChain",
        youtubeUrl: "https://youtu.be/yodh-oEFnb4?si=rFMufzpRVJY0O0Cl",
        duration: "3:10:45",
        description: "Deep dive into production RAG pipelines. Learn text splitting techniques, embedding strategies, vector database selection, metadata filtering, and semantic search integration."
      },
      {
        id: "v3",
        title: "3. Tools, AI Agents, Tool Calling, APIs & LangChain Generative AI Full Course (Part 3)",
        youtubeUrl: "https://youtu.be/CUDT5E6jz84?si=adMaZCd2QRw8EyCp",
        duration: "3:20:15",
        description: "Explore tool calling and autonomous agents. Connect LLMs to custom APIs, construct logical reasoning loops (ReAct), handle external tool dependencies, and manage agentic state."
      },
      {
        id: "v4",
        title: "4. Build a Multi-Agent AI Research System with LangChain (Full Project)",
        youtubeUrl: "https://youtu.be/P22qI2RnNjA?si=SBYQI0vyzcG00gRR",
        duration: "2:10:30",
        description: "Build an industrial-grade multi-agent research system completely from scratch. Implement coordinated workflows where specialized agents collaborate to perform deep research."
      },
      {
        id: "v5",
        title: "5. AI Video Assistant With RAG | Full Project in Python",
        youtubeUrl: "https://youtu.be/xlYJhtL0qbQ?si=DNdOljeE6xFVK4pz",
        duration: "1:15:20",
        description: "Develop a functional AI Video Assistant using Python. Implement automated transcription (Whisper), prompt-based timestamp search, and retrieval-augmented generation over long video transcripts."
      }
    ]
  },
  {
    id: "design-ui-ux",
    title: "Design UI (Visual Arts & Glassmorphism)",
    description: "Master high-end visual systems, interactive canvas layouts, color workflows, and stateful Framer Motion animation frameworks.",
    category: "UI/UX Design",
    totalVideos: 8,
    accentColor: "from-amber-500 to-orange-400",
    videos: [
      {
        id: "v1",
        title: "1. Framer Motion Tutorial – Master React Animations (Beginner to Advanced)",
        youtubeUrl: "https://youtu.be/JALCoY9MQg8?si=5l4SHjOxt7Z0aSuB",
        duration: "3:12:45",
        description: "Master React animations with Framer Motion from beginner to advanced. Learn about motion components, animate props, transitions, animate presence, variants, gesture animations, drag-to-dismiss systems, scroll-linked animations, and layout transitions."
      },
      {
        id: "v2",
        title: "2. UI/UX Design Full Course for Beginners 2025 | Lets Uncover",
        youtubeUrl: "https://youtu.be/truRwcI7-kg?si=53sqp8qkwK5m-vhk",
        duration: "4:35:20",
        description: "An absolute beginner's guide to UI/UX design. Master product design principles, design thinking, color theory, typography, spacing guides, grid systems, wireframing, high-fidelity UI layout design, and prototyping secrets."
      },
      {
        id: "v3",
        title: "3. Flutter Full Course for Beginners – Part 1 | Full App Development Guide",
        youtubeUrl: "https://youtu.be/92h2XcvZ-vM?si=-ADVX6qaA2xe2amm",
        duration: "3:45:15",
        description: "Kickstart your cross-platform mobile app development journey. Learn Dart essentials, Flutter widget hierarchies, stateful and stateless setups, custom UI designs, row/column alignments, asset loading, and navigation routing."
      },
      {
        id: "v4",
        title: "4. Adobe Illustrator Full Course (Hindi) - Learn Everything in 7 Hours!",
        youtubeUrl: "https://youtu.be/5_aSDG1Ppqs?si=A9GlsiehYaKPM7De",
        duration: "7:15:30",
        description: "Master Adobe Illustrator completely in Hindi. Deep dive into vector art, drawing tools, pathfinders, typography, color palettes, mesh gradients, patterns, package design, and professional illustration workflows."
      },
      {
        id: "v5",
        title: "5. Canva Full Course | Learn Canva from Beginner to Advance Level in 4 Hours",
        youtubeUrl: "https://youtu.be/1vzda4uh7nA?si=zfpQYDvnMYRWt6ng",
        duration: "4:05:10",
        description: "Master the world's most popular visual design tool in 4 hours. Learn to assemble social media graphics, build elegant presentations, design branding kits, manipulate media, and utilize Canva's advanced printing setups."
      },
      {
        id: "v6",
        title: "6. How to Use NotebookLM - Full Tutorial in Hindi (2026)",
        youtubeUrl: "https://youtu.be/1vzda4uh7nA?si=StJZ_mnMi_4t9lex",
        duration: "24:15",
        description: "Learn how to leverage Google's NotebookLM for smart document synthesis, note taking, and audio podcast generation in Hindi. Master source document pinning, context querying, and AI-assisted study guides."
      },
      {
        id: "v7",
        title: "7. Rive Quick Start Tutorial - Interactive Menu",
        youtubeUrl: "https://youtu.be/wnwA0izJo4E?si=kpi-AuOQc94JHeEz",
        duration: "12:30",
        description: "Discover how to animate and build high-performance vector-interactive menus with Rive. Master state machines, triggers, hover transitions, click animations, and exporting assets to web developers."
      },
      {
        id: "v8",
        title: "8. Cursor AI Full Course For Beginners | Build Apps Without Coding",
        youtubeUrl: "https://youtu.be/Ts4ohUGg63s?si=B8Oqz7wlE7DB9KIp",
        duration: "2:15:40",
        description: "Master building modern websites and applications without writing code using Cursor AI. Learn prompt structure rules, code compose workflows, workspace indexing, third-party library imports, and deployment steps."
      }
    ]
  },
  {
    id: "blender-3d",
    title: "3D Rendering with Blender 4",
    description: "Get started with Blender 3D rendering. From absolute basics to complex lighting setups, asset modeling, and Hindi tutorials.",
    category: "3D & Motion",
    totalVideos: 1,
    accentColor: "from-red-500 to-yellow-500",
    videos: [
      {
        id: "v1",
        title: "1. Blender 3D Hindi Full Course",
        youtubeUrl: "https://youtu.be/fUA8tfC-0-E?si=A7I1tetOs_-TXL6T",
        duration: "18:24:35",
        description: "Master Blender 3D in Hindi with this complete full course. Learn interface navigation, mesh editing, standard transforms, advanced shading, lighting, modifiers, low-poly rendering, and professional camera compositions."
      }
    ]
  },
  {
    id: "programming-languages",
    title: "Programming Language",
    description: "Master foundational programming syntaxes, memory allocations, object-oriented designs, and scripting with C, C++, Java, and Python.",
    category: "Computer Science",
    totalVideos: 4,
    accentColor: "from-[#6366f1] to-[#06b6d4]",
    videos: [
      {
        id: "v1",
        title: "1. C Language Tutorial (With Notes + Surprise)",
        youtubeUrl: "https://youtu.be/aZb0iu4uGwA?si=zQgPpSqirzvAOmPB",
        duration: "10:32:15",
        description: "Master the foundations of application programming with C. Learn pointers, memory allocation, structures, syntax, variables, arrays, and standard libraries with complete notes.",
        language: "c",
        exampleCode: "#include <stdio.h>\n\nint main() {\n    printf(\"Hello, World from C!\\n\");\n    \n    int age = 21;\n    printf(\"Welcome to Roj Study Academy! Your age is %d.\\n\", age);\n    \n    return 0;\n}",
        practicePrompt: "Write a C program that declares an integer variable 'x' with value 10, a float variable 'y' with value 20.5, and prints their sum."
      },
      {
        id: "v2",
        title: "2. C++ Programming Complete Course",
        youtubeUrl: "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
        duration: "4:12:30",
        description: "Learn object-oriented programming (OOP) with C++. Master classes, objects, inheritance, polymorphism, templates, vectors, memory management, and standard template library (STL).",
        language: "cpp",
        exampleCode: "#include <iostream>\nusing namespace std;\n\nclass Learner {\npublic:\n    string name;\n    int xp;\n    \n    void display() {\n        cout << \"Learner \" << name << \" has \" << xp << \" XP!\\n\";\n    }\n};\n\nint main() {\n    cout << \"Welcome to C++ OOP!\" << endl;\n    \n    Learner student;\n    student.name = \"Abhay Dev\";\n    student.xp = 1500;\n    student.display();\n    \n    return 0;\n}",
        practicePrompt: "Create a C++ class named 'Calculator' with a public method 'add(int a, int b)' that returns the sum. Instantiate it in the main() function and print the result."
      },
      {
        id: "v3",
        title: "3. Java Programming Tutorial for Beginners",
        youtubeUrl: "https://www.youtube.com/watch?v=A7I1tetOs_-TXL6T",
        duration: "2:30:15",
        description: "Understand the high-level, write-once, run-anywhere nature of Java. Master JVM basics, class constructs, packages, collections, threads, and dynamic object architectures.",
        language: "java",
        exampleCode: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World from Java!\");\n        \n        String[] subjects = {\"C\", \"C++\", \"Java\", \"Python\"};\n        System.out.println(\"We are learning \" + subjects.length + \" key languages.\");\n        for(String sub : subjects) {\n            System.out.println(\" - \" + sub);\n        }\n    }\n}",
        practicePrompt: "Create a Java class/method named 'Calculator' with a method 'multiply(int a, int b)' inside. Instantiate it and print the result of 15 * 6."
      },
      {
        id: "v4",
        title: "4. Python for Beginners - Full Course",
        youtubeUrl: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
        duration: "4:20:00",
        description: "Learn Python, the most popular language for data science, automation, and AI. Master variables, functions, list comprehensions, dictionaries, error handling, and class designs.",
        language: "python",
        exampleCode: "def greet_learner(name, current_streak):\n    print(f\"Hello, {name}!\")\n    print(f\"\uD83D\uDD25 Your daily streak is: {current_streak} days.\")\n\nif __name__ == \"__main__\":\n    greet_learner(\"Abhay Dev\", 5)\n    \n    languages = [\"C\", \"C++\", \"Java\", \"Python\"]\n    print(\"Programming languages playlist:\")\n    for i, lang in enumerate(languages, 1):\n        print(f\"Section {i}: {lang}\")",
        practicePrompt: "Write a Python function called 'calculate_factorial(n)' that computes the factorial of an integer n using recursion or a loop, and print the factorial of 5."
      }
    ]
  },
  {
    id: "ai-ml-full-course",
    title: "AI and ML Full Course",
    description: "Master Machine Learning from math concepts to hands-on projects, engineering and deploying state-of-the-art ML models.",
    category: "Artificial Intelligence",
    totalVideos: 3,
    accentColor: "from-[#d946ef] to-[#3b82f6]",
    videos: [
      {
        id: "v1",
        title: "1. Machine Learning FULL Course with Practical (10 HOURS) | Learn Free ML in 2025 | Part-1",
        youtubeUrl: "https://youtu.be/LvC68w9JS4Y?si=VNBTSTFD2klnLOIy",
        duration: "10:00:00",
        description: "Comprehensive introduction to concepts in Machine Learning, Regression models, Classification techniques, and detailed mathematical justifications.",
        language: "python",
        exampleCode: "# Python Machine Learning regression example\nimport numpy as np\n\n# Sample training features (size) and target (price)\nX = np.array([1000, 1500, 2000, 2500])\ny = np.array([300000, 450000, 580000, 710000])\n\n# Simple linear regression slope calculation manually\nmean_x = sum(X) / len(X)\nmean_y = sum(y) / len(y)\n\nnum = sum((X[i] - mean_x) * (y[i] - mean_y) for i in range(len(X)))\ndenom = sum((X[i] - mean_x) ** 2 for i in range(len(X)))\n\nslope = num / denom\nintercept = mean_y - slope * mean_x\n\nnew_house = 1800\nprediction = slope * new_house + intercept\n\nprint(f\"Predicted price for {new_house} sq ft house: ${prediction:,.2f}\")\nprint(\"\uD83D\uDD25 Linear regression slope: \", round(slope, 2))\nprint(\"\uD83D\uDD25 Model training finished successfully!\")",
        practicePrompt: "Write a simple Python script using list comprehensions to calculate the mean of a custom list: [100, 200, 300, 400, 500]."
      },
      {
        id: "v2",
        title: "2. Machine Learning Full Course with Projects (2026) | Machine Learning Tutorial in One Video - Part-2",
        youtubeUrl: "https://youtu.be/--t2md5zF_0?si=6KNe1Y5UYtRsS6Jb",
        duration: "6:30:15",
        description: "Hands-on projects using modern libraries. Focus on exploratory data analysis, pipeline creations, data split structures, and model evaluations.",
        language: "python",
        exampleCode: "# Python classification simulation example\nfeatures_name = [\"sepal_length\", \"sepal_width\", \"petal_length\", \"petal_width\"]\nsample_flower = [5.1, 3.5, 1.4, 0.2]\n\n# Simple classifier function simulation\ndef predict_class(features):\n    if features[2] < 2.45:\n        return \"Iris-setosa\"\n    else:\n        return \"Iris-virginica\"\n\npredicted_species = predict_class(sample_flower)\nprint(f\"Iris sample predicted species: {predicted_species}\")\nprint(\"\uD83D\uDD25 Simulated classifier rule evaluated successfully!\")",
        practicePrompt: "Write a python dictionary to store model name 'RandomForest' and test accuracy '0.942', and print its keys."
      },
      {
        id: "v3",
        title: "3. Machine Learning Full Course with Practical (6 Hours) | Become a Machine Learning Engineer in 2026",
        youtubeUrl: "https://youtu.be/O0Ka_nBRtN0?si=zi9LMwEfMsUdznel",
        duration: "6:00:00",
        description: "Practical production engineering guidelines for deploying ML models. Learn serialization with JSON parameters, simple dict exports, and deployment setups.",
        language: "python",
        exampleCode: "# Model metrics exporting system in Python\nimport json\n\nmodel_parameters = {\n    \"model_type\": \"LogisticRegression\",\n    \"hyperparameters\": {\n        \"C\": 1.0,\n        \"solver\": \"lbfgs\",\n        \"max_iter\": 100\n    },\n    \"performance_metrics\": {\n        \"precision\": 0.94,\n        \"recall\": 0.92,\n        \"f1_score\": 0.93\n    }\n}\n\n# Serialize parameters to JSON string representation\njson_string = json.dumps(model_parameters, indent=2)\nprint(\"Serialized Model Configuration:\")\nprint(json_string)\nprint(\"\uD83D\uDD25 Model stats exported and validated successfully!\")",
        practicePrompt: "Write a python function called serialize(data) that returns a JSON string, then call it on a simple python dictionary list."
      }
    ]
  },
  {
    id: "data-science-full-course",
    title: "Data Science Full Course",
    description: "Master the complete path to Data Science: data manipulation, statistical analysis, and interactive data visualization with hands-on projects.",
    category: "Data Science",
    totalVideos: 1,
    accentColor: "from-[#22c55e] to-[#06b6d4]",
    videos: [
      {
        id: "v1",
        title: "1. Data Science FULL Course for Beginners in 27 HOURS - 2026 Edition",
        youtubeUrl: "https://youtu.be/gDZ6czwuQ18?si=o08etUsI6AQuntkO",
        duration: "27:00:00",
        description: "Become a professional Data Scientist in 2026 with this comprehensive 27-hour bootcamp. Learn Python, Pandas, Numpy, Matplotlib, Seaborn, and statistical modeling.",
        language: "python",
        exampleCode: "# Python Data Science pandas simulation\nimport numpy as np\n\n# Simulate a dataset of student grades\nstudent_scores = np.array([85, 92, 78, 90, 88, 95, 82, 89, 91, 76])\n\n# Calculate key statistics\nmean_score = np.mean(student_scores)\nmedian_score = np.median(student_scores)\nstd_dev = np.std(student_scores)\n\nprint(\"Dataset summary statistics:\")\nprint(f\" - Average Score: {mean_score:.2f}\")\nprint(f\" - Median Score: {median_score:.2f}\")\nprint(f\" - Standard Deviation: {std_dev:.2f}\")\nprint(\"\uD83D\uDD25 Best performing student score:\", np.max(student_scores))\nprint(\"\uD83D\uDD25 Data analysis successfully computed!\")",
        practicePrompt: "Write a simple Python script using list comprehensions to calculate the mean of a custom list: [100, 200, 300, 400, 500]."
      }
    ]
  }
];

export const SHADCN_LEADERBOARD_DATA = [
  { rank: 1, name: "Aarav Sharma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav", xp: 14850, streak: 18 },
  { rank: 2, name: "Priya Patel", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", xp: 12400, streak: 12 },
  { rank: 3, name: "Kabir Singh", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir", xp: 11950, streak: 9 },
  { rank: 4, name: "Isha Roy", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isha", xp: 9800, streak: 15 },
  { rank: 5, name: "Rishabh Dev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rishabh", xp: 8750, streak: 5 }
];

export const MOCK_CERTIFICATE_NAMES = [
  "HTML & CSS Core Mastery",
  "React Single-Page Engineering",
  "Node.js Backend Architecture",
  "DSA Elite Problem Solver",
  "Generative AI Systems Specialist",
  "UI/UX Visual Arts Professional"
];

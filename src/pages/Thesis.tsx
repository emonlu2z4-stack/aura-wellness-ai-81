import { useRef, useState } from "react";

const Thesis = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    if (!contentRef.current) return;
    setGenerating(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: [0.7, 0.8, 0.7, 0.8],
        filename: "Thesis_Proposal_Aura_Wellness_AI.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"], avoid: ["tr", "td"] },
      };
      await html2pdf().set(opt).from(contentRef.current).save();
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8 px-4">
      <button
        onClick={handleDownload}
        disabled={generating}
        className="mb-6 px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow hover:bg-blue-800 disabled:opacity-50 print:hidden sticky top-4 z-50"
      >
        {generating ? "Generating PDF..." : "Download as PDF"}
      </button>

      <div
        ref={contentRef}
        className="thesis-content bg-white text-black max-w-[210mm] w-full"
        style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "12pt", lineHeight: "1.8", color: "#000" }}
      >
        {/* ===== COVER PAGE ===== */}
        <div className="page-break-after text-center" style={{ paddingTop: "60px" }}>
          <h1 style={{ fontSize: "20pt", fontWeight: "bold", marginBottom: "4px" }}>Leading University</h1>
          <p style={{ fontSize: "13pt", marginBottom: "2px" }}>Sylhet, Bangladesh</p>
          <p style={{ fontSize: "14pt", fontWeight: "bold", marginBottom: "30px" }}>Department of Computer Science and Engineering (CSE)</p>

          <div style={{ border: "2px solid #000", padding: "20px 30px", margin: "30px auto", maxWidth: "500px" }}>
            <p style={{ fontSize: "13pt", fontWeight: "bold", marginBottom: "6px" }}>Thesis Proposal</p>
            <p style={{ fontSize: "11pt", marginBottom: "4px" }}>On</p>
            <h2 style={{ fontSize: "16pt", fontWeight: "bold", lineHeight: "1.4" }}>
              Aura Wellness AI: An AI-Powered Nutrition and Wellness Tracking App
            </h2>
          </div>

          <div style={{ marginTop: "40px", textAlign: "left", maxWidth: "460px", marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "13pt", fontWeight: "bold", textDecoration: "underline", marginBottom: "6px" }}>Submitted To:</p>
              <p style={{ fontSize: "12pt" }}>Kazi Md. Jahid Hasan</p>
              <p style={{ fontSize: "11pt" }}>Assistant Professor</p>
              <p style={{ fontSize: "11pt" }}>Department of Computer Science and Engineering</p>
              <p style={{ fontSize: "11pt" }}>Leading University, Sylhet</p>
            </div>

            <div>
              <p style={{ fontSize: "13pt", fontWeight: "bold", textDecoration: "underline", marginBottom: "6px" }}>Submitted By:</p>
              <table style={{ fontSize: "12pt", borderCollapse: "collapse" }}>
                <tbody>
                  <tr><td style={{ padding: "3px 12px 3px 0" }}>1.</td><td style={{ padding: "3px 16px 3px 0" }}>Emon Ahmed</td><td>ID: 0182320012101356</td></tr>
                  <tr><td style={{ padding: "3px 12px 3px 0" }}>2.</td><td style={{ padding: "3px 16px 3px 0" }}>MD Rayhan Akhand</td><td>ID: 0182320012101320</td></tr>
                  <tr><td style={{ padding: "3px 12px 3px 0" }}>3.</td><td style={{ padding: "3px 16px 3px 0" }}>Md Sams Uddin Emon</td><td>ID: 0182310012101144</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <p style={{ marginTop: "50px", fontSize: "13pt", fontWeight: "bold" }}>Date of Submission: March 2026</p>
        </div>

        {/* ===== PERMISSION APPLICATION ===== */}
        <div className="page-break-after" style={{ paddingTop: "60px" }}>
          <p style={{ textAlign: "right", marginBottom: "20px" }}>Date: March 2, 2026</p>
          <p style={{ marginBottom: "4px" }}>To</p>
          <p style={{ marginBottom: "2px" }}>Kazi Md. Jahid Hasan</p>
          <p style={{ marginBottom: "2px" }}>Assistant Professor</p>
          <p style={{ marginBottom: "2px" }}>Department of Computer Science and Engineering</p>
          <p style={{ marginBottom: "20px" }}>Leading University, Sylhet</p>

          <p style={{ marginBottom: "16px" }}><strong>Subject:</strong> Application for Permission to Conduct Thesis on "Aura Wellness AI: An AI-Powered Nutrition and Wellness Tracking App"</p>

          <p style={{ marginBottom: "12px" }}>Dear Sir,</p>
          <p style={{ marginBottom: "12px", textAlign: "justify" }}>
            We, the undersigned students of the Department of Computer Science and Engineering at Leading University, respectfully request your kind permission to undertake our thesis titled <strong>"Aura Wellness AI: An AI-Powered Nutrition and Wellness Tracking App"</strong>.
          </p>
          <p style={{ marginBottom: "12px", textAlign: "justify" }}>
            The proposed thesis aims to develop an intelligent nutrition and wellness tracking app that leverages artificial intelligence to analyze food items from photographs and provide real-time macronutrient estimation. The app will help users maintain a healthy lifestyle by offering personalized calorie tracking, progress monitoring, and social wellness group features.
          </p>
          <p style={{ marginBottom: "12px", textAlign: "justify" }}>
            We believe this project will contribute meaningfully to the field of AI-driven health technology and provide a practical solution for everyday nutrition management.
          </p>
          <p style={{ marginBottom: "20px" }}>We would be grateful if you could grant us your approval to proceed with this project under your esteemed supervision.</p>

          <p style={{ marginBottom: "8px" }}>Yours sincerely,</p>
          <div style={{ marginTop: "30px" }}>
            <p style={{ marginBottom: "4px" }}>1. Emon Ahmed (ID: 0182320012101356)</p>
            <p style={{ marginBottom: "4px" }}>2. MD Rayhan Akhand (ID: 0182320012101320)</p>
            <p style={{ marginBottom: "4px" }}>3. Md Sams Uddin Emon (ID: 0182310012101144)</p>
          </div>
        </div>

        {/* ===== THESIS NAME + MOTTO ===== */}
        <div className="page-break-after text-center" style={{ paddingTop: "180px" }}>
          <h1 style={{ fontSize: "22pt", fontWeight: "bold", lineHeight: "1.5", marginBottom: "40px" }}>
            Aura Wellness AI:<br />An AI-Powered Nutrition and Wellness Tracking App
          </h1>
          <p style={{ fontSize: "14pt", fontStyle: "italic", color: "#333" }}>
            "Empowering healthier lives through intelligent nutrition tracking."
          </p>
        </div>

        {/* ===== TABLE OF CONTENTS ===== */}
        <div className="page-break-after" style={{ paddingTop: "40px" }}>
          <h2 style={{ fontSize: "18pt", fontWeight: "bold", textAlign: "center", marginBottom: "30px" }}>Table of Contents</h2>
          <table style={{ width: "100%", fontSize: "12pt", borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["Chapter 1", "Introduction", "1"],
                ["1.1", "Background", "1"],
                ["1.2", "Motivation", "2"],
                ["1.3", "Problem Statement", "2"],
                ["1.4", "Research Objectives", "3"],
                ["1.5", "Scope of the Project", "3"],
                ["Chapter 2", "Literature Review", "4"],
                ["2.1", "Existing Nutrition Tracking Apps", "4"],
                ["2.2", "Limitations of Existing Solutions", "5"],
                ["2.3", "AI in Nutrition Analysis", "5"],
                ["2.4", "How Aura Wellness AI Differs", "6"],
                ["Chapter 3", "Methodology", "7"],
                ["3.1", "Development Approach", "7"],
                ["3.2", "System Architecture", "7"],
                ["3.3", "AI-Based Food Recognition", "8"],
                ["3.4", "Data Flow", "9"],
                ["Chapter 4", "Resources and Tools", "10"],
                ["Chapter 5", "Work Plan", "11"],
                ["Chapter 6", "Expected Outcomes", "12"],
                ["Chapter 7", "Conclusion", "13"],
                ["", "References", "14"],
              ].map(([num, title, page], i) => (
                <tr key={i}>
                  <td style={{ padding: "4px 8px", fontWeight: num.startsWith("Chapter") ? "bold" : "normal", width: "100px" }}>{num}</td>
                  <td style={{ padding: "4px 8px", fontWeight: num.startsWith("Chapter") ? "bold" : "normal" }}>{title}</td>
                  <td style={{ padding: "4px 8px", textAlign: "right", width: "40px" }}>{page}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== CHAPTER 1: INTRODUCTION ===== */}
        <div className="page-break-after" style={{ paddingTop: "30px" }}>
          <h2 style={{ fontSize: "18pt", fontWeight: "bold", marginBottom: "20px" }}>Chapter 1: Introduction</h2>

          <h3 style={{ fontSize: "14pt", fontWeight: "bold", marginBottom: "10px" }}>1.1 Background</h3>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            In recent years, global health consciousness has risen significantly, driven by growing concerns about obesity, diabetes, cardiovascular diseases, and other lifestyle-related health conditions. According to the World Health Organization (WHO), worldwide obesity has nearly tripled since 1975, and more than 1.9 billion adults were classified as overweight in 2016. These alarming statistics have fueled a growing demand for tools and technologies that can assist individuals in managing their nutrition and overall wellness effectively.
          </p>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            The proliferation of smartphones and advancements in artificial intelligence (AI) have created unprecedented opportunities for developing intelligent health management solutions. Mobile apps have emerged as the most accessible platform for health tracking, offering users the convenience of monitoring their dietary intake, physical activity, and health metrics from anywhere at any time.
          </p>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            Aura Wellness AI is an AI-powered nutrition and wellness tracking app designed to simplify and enhance the process of dietary management. By leveraging advanced AI capabilities, particularly Google's Gemini model for food image recognition, the app enables users to simply photograph their meals and receive instant, detailed nutritional breakdowns including calories, protein, carbohydrates, fats, fiber, sugar, and sodium content.
          </p>

          <h3 style={{ fontSize: "14pt", fontWeight: "bold", marginBottom: "10px", marginTop: "20px" }}>1.2 Motivation</h3>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            The primary motivation behind developing Aura Wellness AI stems from several key observations:
          </p>
          <ol style={{ paddingLeft: "24px", marginBottom: "12px" }}>
            <li style={{ marginBottom: "8px", textAlign: "justify" }}><strong>Manual Tracking is Tedious:</strong> Most existing nutrition tracking apps require users to manually search for food items in databases and input quantities. This process is time-consuming and often discourages consistent use, leading to abandoned health goals.</li>
            <li style={{ marginBottom: "8px", textAlign: "justify" }}><strong>Inaccurate Estimations:</strong> Users frequently misjudge portion sizes and nutritional content when manually logging meals, leading to significant inaccuracies in their dietary records.</li>
            <li style={{ marginBottom: "8px", textAlign: "justify" }}><strong>Lack of AI Integration:</strong> While AI has made remarkable strides in image recognition and natural language processing, very few nutrition apps have effectively integrated these capabilities to simplify the food logging process.</li>
            <li style={{ marginBottom: "8px", textAlign: "justify" }}><strong>Social Accountability:</strong> Research shows that individuals who track their health within supportive communities are more likely to achieve and maintain their goals. However, most nutrition apps lack robust social features.</li>
            <li style={{ marginBottom: "8px", textAlign: "justify" }}><strong>Comprehensive Tracking:</strong> Many apps focus solely on calorie counting while neglecting other critical macronutrients such as fiber, sugar, and sodium, which are equally important for overall health management.</li>
          </ol>

          <h3 style={{ fontSize: "14pt", fontWeight: "bold", marginBottom: "10px", marginTop: "20px" }}>1.3 Problem Statement</h3>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            Despite the availability of numerous nutrition tracking apps in the market, users continue to face challenges related to the complexity and tediousness of manual food logging, inaccurate nutritional estimations, limited macronutrient tracking beyond calories, and insufficient social features for community-based wellness support. There exists a significant need for an intelligent, user-friendly app that can automatically analyze food items from photographs, provide comprehensive macronutrient breakdowns, and offer social features that foster accountability and motivation among users.
          </p>

          <h3 style={{ fontSize: "14pt", fontWeight: "bold", marginBottom: "10px", marginTop: "20px" }}>1.4 Research Objectives</h3>
          <p style={{ textAlign: "justify", marginBottom: "8px" }}>The primary objectives of this thesis are:</p>
          <ol style={{ paddingLeft: "24px", marginBottom: "12px" }}>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}>To develop an AI-powered nutrition tracking app that can accurately analyze food items from photographs and estimate their nutritional content.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}>To implement comprehensive macronutrient tracking including calories, protein, carbohydrates, fats, fiber, sugar, and sodium.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}>To create an intuitive and visually appealing user interface that encourages consistent daily usage.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}>To integrate social wellness group features that promote community-based health accountability.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}>To provide progress tracking and visualization tools including weight monitoring, calorie trend analysis, and BMI calculation.</li>
          </ol>

          <h3 style={{ fontSize: "14pt", fontWeight: "bold", marginBottom: "10px", marginTop: "20px" }}>1.5 Scope of the Project</h3>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            The scope of Aura Wellness AI encompasses the development of a fully functional nutrition and wellness tracking app with the following capabilities: AI-powered meal analysis using image recognition, manual meal logging with detailed macronutrient input, daily calorie and macronutrient goal tracking with visual progress indicators, weight logging and trend analysis with interactive charts, social wellness groups with invite code functionality, user profile management with personalized macro targets, and a responsive, modern user interface optimized for mobile devices.
          </p>
        </div>

        {/* ===== CHAPTER 2: LITERATURE REVIEW ===== */}
        <div className="page-break-after" style={{ paddingTop: "30px" }}>
          <h2 style={{ fontSize: "18pt", fontWeight: "bold", marginBottom: "20px" }}>Chapter 2: Literature Review</h2>

          <h3 style={{ fontSize: "14pt", fontWeight: "bold", marginBottom: "10px" }}>2.1 Existing Nutrition Tracking Apps</h3>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            The market for nutrition and health tracking apps has grown substantially over the past decade. Several prominent apps have established themselves as leaders in this space:
          </p>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            <strong>MyFitnessPal</strong> is one of the most widely used calorie tracking apps globally, boasting a database of over 14 million foods. It allows users to log meals by searching for food items, scanning barcodes, or creating custom entries. While comprehensive in its food database, MyFitnessPal relies entirely on manual input, which can be tedious and error-prone (Lieffers et al., 2018).
          </p>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            <strong>Lose It!</strong> offers a similar approach to calorie tracking with an emphasis on weight loss goals. It features a barcode scanner and recipe logger but, like MyFitnessPal, lacks AI-powered food recognition capabilities. The app provides basic social features through challenges but lacks persistent group functionality (Turner-McGrievy et al., 2013).
          </p>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            <strong>Cronometer</strong> is known for its detailed micronutrient tracking, providing information on vitamins and minerals in addition to macronutrients. However, its interface is complex and not beginner-friendly, and it does not offer AI-based food analysis (Evenepoel et al., 2020).
          </p>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            <strong>Yazio</strong> and <strong>FatSecret</strong> are other notable entries in this space, each offering unique features such as intermittent fasting timers and community forums, respectively. However, none of these apps have successfully integrated AI image recognition for automatic food analysis.
          </p>

          <h3 style={{ fontSize: "14pt", fontWeight: "bold", marginBottom: "10px", marginTop: "20px" }}>2.2 Limitations of Existing Solutions</h3>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            Through our analysis of existing nutrition tracking apps, we identified several common limitations:
          </p>
          <ol style={{ paddingLeft: "24px", marginBottom: "12px" }}>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}><strong>Manual Data Entry Dependency:</strong> All major apps require users to manually search, select, and log food items, which is a significant barrier to consistent usage.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}><strong>Limited Macronutrient Scope:</strong> Most apps primarily focus on calories, with secondary attention to protein, carbs, and fats. Tracking of fiber, sugar, and sodium is often limited or requires premium subscriptions.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}><strong>Poor Social Integration:</strong> While some apps offer community features, they typically lack the ability to create private wellness groups with invite-based membership.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}><strong>Outdated User Interfaces:</strong> Many established apps suffer from cluttered, outdated interfaces that do not align with modern design standards.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}><strong>No AI Food Recognition:</strong> Despite advancements in computer vision, automatic food identification from photos remains absent in most mainstream nutrition apps.</li>
          </ol>

          <h3 style={{ fontSize: "14pt", fontWeight: "bold", marginBottom: "10px", marginTop: "20px" }}>2.3 AI in Nutrition Analysis</h3>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            Recent advances in deep learning and computer vision have made significant strides in food recognition. Convolutional Neural Networks (CNNs) have been successfully applied to food image classification tasks, achieving high accuracy rates in identifying various food categories (Meyers et al., 2015). Google's Vision AI and similar services have demonstrated the ability to identify food items with remarkable precision.
          </p>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            Large Language Models (LLMs) with multimodal capabilities, such as Google's Gemini, represent the latest evolution in AI-powered food analysis. These models can not only identify food items in images but also estimate portion sizes and provide detailed nutritional information based on their vast training data (Gemini Team, Google, 2024). This approach eliminates the need for separate food databases and can handle a wide variety of cuisines and food preparations.
          </p>

          <h3 style={{ fontSize: "14pt", fontWeight: "bold", marginBottom: "10px", marginTop: "20px" }}>2.4 How Aura Wellness AI Differs</h3>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            Aura Wellness AI distinguishes itself from existing solutions through several key innovations:
          </p>
          <ul style={{ paddingLeft: "24px", marginBottom: "12px" }}>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}>AI-powered instant food analysis from photographs using Google's Gemini model, eliminating the need for manual food database searches.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}>Comprehensive tracking of seven macronutrients (calories, protein, carbs, fats, fiber, sugar, sodium) without requiring premium subscriptions.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}>Modern, dark glassmorphic user interface with fluid animations and intuitive navigation.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}>Social wellness groups with private invite codes for community-based health accountability.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}>Real-time progress visualization with interactive charts and BMI calculations.</li>
          </ul>
        </div>

        {/* ===== CHAPTER 3: METHODOLOGY ===== */}
        <div className="page-break-after" style={{ paddingTop: "30px" }}>
          <h2 style={{ fontSize: "18pt", fontWeight: "bold", marginBottom: "20px" }}>Chapter 3: Methodology</h2>

          <h3 style={{ fontSize: "14pt", fontWeight: "bold", marginBottom: "10px" }}>3.1 Development Approach</h3>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            The development of Aura Wellness AI follows an Agile methodology with iterative development cycles. This approach allows for continuous refinement based on testing and feedback. The development process is divided into the following phases:
          </p>
          <ol style={{ paddingLeft: "24px", marginBottom: "12px" }}>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}><strong>Requirements Analysis and Planning:</strong> Identifying user needs, defining feature requirements, and planning the system architecture.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}><strong>UI/UX Design:</strong> Creating wireframes and high-fidelity mockups for all screens, establishing the dark glassmorphic design system.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}><strong>Backend Development:</strong> Setting up the cloud database, authentication system, storage, and API endpoints.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}><strong>Frontend Development:</strong> Building the user interface components, implementing state management, and integrating with backend services.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}><strong>AI Integration:</strong> Developing the meal analysis pipeline using Gemini AI for food recognition and nutritional estimation.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}><strong>Testing and Optimization:</strong> Conducting unit testing, integration testing, and performance optimization.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}><strong>Deployment and Evaluation:</strong> Deploying the app and evaluating its performance against defined objectives.</li>
          </ol>

          <h3 style={{ fontSize: "14pt", fontWeight: "bold", marginBottom: "10px", marginTop: "20px" }}>3.2 System Architecture</h3>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            Aura Wellness AI employs a modern three-tier architecture consisting of:
          </p>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            <strong>Presentation Layer (Frontend):</strong> Built with React and TypeScript, the frontend provides a responsive, single-page app experience. Tailwind CSS and Framer Motion are used for styling and animations respectively. The app follows a component-based architecture with reusable UI components, custom hooks for business logic, and React Query for server state management.
          </p>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            <strong>Application Layer (Backend Services):</strong> The backend is powered by a cloud-based platform providing authentication, database, storage, and serverless edge functions. The edge function for meal analysis serves as the intermediary between the frontend and the AI model, processing image data and returning structured nutritional information.
          </p>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            <strong>Data Layer (Database):</strong> A PostgreSQL database stores user profiles, meal logs, weight records, and group information. Row Level Security (RLS) policies ensure data isolation between users, guaranteeing that each user can only access their own data.
          </p>

          <h3 style={{ fontSize: "14pt", fontWeight: "bold", marginBottom: "10px", marginTop: "20px" }}>3.3 AI-Based Food Recognition</h3>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            The core innovation of Aura Wellness AI lies in its AI-powered food analysis system. The process follows these steps:
          </p>
          <ol style={{ paddingLeft: "24px", marginBottom: "12px" }}>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}><strong>Image Capture:</strong> The user photographs their meal using the app's built-in camera interface or selects an existing photo from their device gallery.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}><strong>Image Processing:</strong> The captured image is converted to a base64-encoded format and transmitted to the backend edge function via a secure API call.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}><strong>AI Analysis:</strong> The edge function forwards the image data to Google's Gemini 2.5 Flash model with a carefully crafted prompt that instructs the AI to identify all food items in the image and estimate their nutritional content.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}><strong>Structured Response:</strong> The AI returns a JSON-structured response containing the meal name and estimated values for calories, protein, carbohydrates, fats, fiber, sugar, and sodium.</li>
            <li style={{ marginBottom: "6px", textAlign: "justify" }}><strong>User Confirmation:</strong> The estimated nutritional data is presented to the user, who can review and adjust the values before saving the meal to their daily log.</li>
          </ol>

          <h3 style={{ fontSize: "14pt", fontWeight: "bold", marginBottom: "10px", marginTop: "20px" }}>3.4 Data Flow</h3>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            The data flow within the app follows a unidirectional pattern:
          </p>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            User interactions trigger actions in the frontend → React Query manages API calls to the backend → The backend processes requests, applies RLS policies, and returns data → The frontend updates the UI reactively based on the response. For real-time features, the app subscribes to database changes, ensuring that data remains synchronized across sessions.
          </p>
        </div>

        {/* ===== CHAPTER 4: RESOURCES AND TOOLS ===== */}
        <div className="page-break-after" style={{ paddingTop: "30px" }}>
          <h2 style={{ fontSize: "18pt", fontWeight: "bold", marginBottom: "20px" }}>Chapter 4: Resources and Tools</h2>
          <p style={{ textAlign: "justify", marginBottom: "16px" }}>
            The following technologies and tools are utilized in the development of Aura Wellness AI:
          </p>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11pt", marginBottom: "16px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={{ border: "1px solid #000", padding: "8px", textAlign: "left" }}>Category</th>
                <th style={{ border: "1px solid #000", padding: "8px", textAlign: "left" }}>Technology</th>
                <th style={{ border: "1px solid #000", padding: "8px", textAlign: "left" }}>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Frontend Framework", "React 18", "Component-based UI development"],
                ["Programming Language", "TypeScript", "Type-safe JavaScript development"],
                ["Styling", "Tailwind CSS", "Utility-first CSS framework for rapid UI design"],
                ["Animation", "Framer Motion", "Fluid animations and gesture support"],
                ["Charts", "Recharts", "Data visualization for progress tracking"],
                ["State Management", "React Query (TanStack)", "Server state management and caching"],
                ["Routing", "React Router v6", "Client-side navigation and routing"],
                ["Backend Platform", "Cloud Backend (PostgreSQL)", "Database, authentication, storage, and edge functions"],
                ["AI Model", "Google Gemini 2.5 Flash", "Food image recognition and nutritional analysis"],
                ["UI Components", "Radix UI / shadcn/ui", "Accessible, customizable UI primitives"],
                ["Form Handling", "React Hook Form + Zod", "Form validation and management"],
                ["Build Tool", "Vite", "Fast development server and build tool"],
                ["Version Control", "Git", "Source code management"],
              ].map(([cat, tech, purpose], i) => (
                <tr key={i}>
                  <td style={{ border: "1px solid #000", padding: "6px" }}>{cat}</td>
                  <td style={{ border: "1px solid #000", padding: "6px" }}>{tech}</td>
                  <td style={{ border: "1px solid #000", padding: "6px" }}>{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== CHAPTER 5: WORK PLAN ===== */}
        <div className="page-break-after" style={{ paddingTop: "30px" }}>
          <h2 style={{ fontSize: "18pt", fontWeight: "bold", marginBottom: "20px" }}>Chapter 5: Work Plan</h2>
          <p style={{ textAlign: "justify", marginBottom: "16px" }}>
            The development of Aura Wellness AI is planned over a period of six months, from January 2026 to June 2026. The following Gantt chart illustrates the timeline for each phase of the project:
          </p>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10pt", marginBottom: "16px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={{ border: "1px solid #000", padding: "6px", textAlign: "left" }}>Task</th>
                <th style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>Jan</th>
                <th style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>Feb</th>
                <th style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>Mar</th>
                <th style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>Apr</th>
                <th style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>May</th>
                <th style={{ border: "1px solid #000", padding: "6px", textAlign: "center" }}>Jun</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Requirements Analysis", [1, 1, 0, 0, 0, 0]],
                ["UI/UX Design", [0, 1, 1, 0, 0, 0]],
                ["Database & Backend Setup", [0, 1, 1, 0, 0, 0]],
                ["Frontend Development", [0, 0, 1, 1, 1, 0]],
                ["AI Integration (Gemini)", [0, 0, 1, 1, 0, 0]],
                ["Social Features (Groups)", [0, 0, 0, 1, 1, 0]],
                ["Testing & Bug Fixing", [0, 0, 0, 0, 1, 1]],
                ["Documentation & Report", [0, 0, 0, 0, 1, 1]],
                ["Final Submission", [0, 0, 0, 0, 0, 1]],
              ].map(([task, months], i) => (
                <tr key={i}>
                  <td style={{ border: "1px solid #000", padding: "6px" }}>{task as string}</td>
                  {(months as number[]).map((active, j) => (
                    <td key={j} style={{ border: "1px solid #000", padding: "6px", textAlign: "center", backgroundColor: active ? "#4a90d9" : "transparent", color: active ? "#fff" : "#000" }}>
                      {active ? "✓" : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== CHAPTER 6: EXPECTED OUTCOMES ===== */}
        <div className="page-break-after" style={{ paddingTop: "30px" }}>
          <h2 style={{ fontSize: "18pt", fontWeight: "bold", marginBottom: "20px" }}>Chapter 6: Expected Outcomes</h2>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            Upon successful completion of this thesis project, we expect to achieve the following outcomes:
          </p>
          <ol style={{ paddingLeft: "24px", marginBottom: "12px" }}>
            <li style={{ marginBottom: "10px", textAlign: "justify" }}>
              <strong>Accurate AI-Powered Meal Analysis:</strong> The app will be capable of analyzing food photographs with reasonable accuracy, identifying food items and estimating their nutritional content within an acceptable margin of error. Users will be able to log meals in seconds rather than minutes, significantly reducing the friction associated with nutrition tracking.
            </li>
            <li style={{ marginBottom: "10px", textAlign: "justify" }}>
              <strong>Comprehensive Macronutrient Tracking:</strong> Users will be able to track seven key macronutrients (calories, protein, carbohydrates, fats, fiber, sugar, and sodium) with personalized daily targets. Visual progress indicators will provide instant feedback on goal achievement.
            </li>
            <li style={{ marginBottom: "10px", textAlign: "justify" }}>
              <strong>Enhanced User Engagement:</strong> The modern, visually appealing dark glassmorphic interface with fluid animations will create an engaging user experience that encourages consistent daily usage. Streak tracking and progress visualization will further motivate users.
            </li>
            <li style={{ marginBottom: "10px", textAlign: "justify" }}>
              <strong>Social Wellness Communities:</strong> The group feature will enable users to create and join private wellness communities, fostering accountability and mutual support. Research indicates that social support significantly improves health behavior adherence (Cavallo et al., 2012).
            </li>
            <li style={{ marginBottom: "10px", textAlign: "justify" }}>
              <strong>Detailed Progress Analytics:</strong> Interactive charts and graphs will provide users with comprehensive insights into their weight trends, calorie patterns, and macronutrient distribution over time, enabling data-driven health decisions.
            </li>
            <li style={{ marginBottom: "10px", textAlign: "justify" }}>
              <strong>BMI Monitoring:</strong> An integrated BMI calculator with a color-coded scale will help users understand their body mass index category and track changes over time.
            </li>
          </ol>
        </div>

        {/* ===== CHAPTER 7: CONCLUSION ===== */}
        <div className="page-break-after" style={{ paddingTop: "30px" }}>
          <h2 style={{ fontSize: "18pt", fontWeight: "bold", marginBottom: "20px" }}>Chapter 7: Conclusion</h2>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            Aura Wellness AI represents a significant step forward in the evolution of nutrition and wellness tracking apps. By integrating cutting-edge artificial intelligence technology with a modern, user-centric design, this app addresses the key limitations of existing solutions and offers a more intuitive, efficient, and comprehensive approach to dietary management.
          </p>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            The use of Google's Gemini AI model for food image recognition eliminates the tedious process of manual food logging, making it easier for users to maintain consistent tracking habits. The comprehensive macronutrient tracking system goes beyond simple calorie counting to provide a holistic view of nutritional intake, while the social wellness group feature adds a valuable dimension of community support and accountability.
          </p>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            The technical architecture of the app, built on modern technologies such as React, TypeScript, and cloud-based backend services, ensures scalability, security, and performance. The implementation of Row Level Security policies guarantees data privacy, while the responsive design ensures accessibility across various devices.
          </p>
          <p style={{ textAlign: "justify", marginBottom: "12px" }}>
            This thesis project not only demonstrates the practical application of AI in health technology but also contributes to the growing body of knowledge on how intelligent systems can be leveraged to promote healthier lifestyles. We believe that Aura Wellness AI has the potential to make a meaningful impact on users' health management practices and serve as a foundation for future research in AI-driven wellness solutions.
          </p>
        </div>

        {/* ===== REFERENCES ===== */}
        <div style={{ paddingTop: "30px" }}>
          <h2 style={{ fontSize: "18pt", fontWeight: "bold", marginBottom: "20px" }}>References</h2>
          <ol style={{ paddingLeft: "24px", fontSize: "11pt" }}>
            {[
              'Cavallo, D. N., Tate, D. F., Ries, A. V., Brown, J. D., DeVellis, R. F., & Ammerman, A. S. (2012). "A social media–based physical activity intervention: a randomized controlled trial." American Journal of Preventive Medicine, 43(5), 527-532.',
              'Evenepoel, C., Clevers, E., Deroover, L., Van Hecke, W., & Verbeke, K. (2020). "Accuracy of nutrient calculations using the consumer-focused online app Cronometer: validation study." Journal of Medical Internet Research, 22(10), e18237.',
              'Gemini Team, Google. (2024). "Gemini: A Family of Highly Capable Multimodal Models." arXiv preprint arXiv:2312.11805.',
              'Lieffers, J. R., Arocha, J. F., Grodanovic, K., & Hanning, R. M. (2018). "Reported use and perceived usefulness of nutrition-related apps: a survey of registered dietitians in Canada." Canadian Journal of Dietetic Practice and Research, 79(1), 25-30.',
              'Meyers, A., Johnston, N., Rathod, V., Korattikara, A., Gorban, A., Silberman, N., ... & Murphy, K. P. (2015). "Im2Calories: towards an automated mobile vision food diary." In Proceedings of the IEEE International Conference on Computer Vision (pp. 1233-1241).',
              'Turner-McGrievy, G. M., Beets, M. W., Moore, J. B., Kaczynski, A. T., Barr-Anderson, D. J., & Tate, D. F. (2013). "Comparison of traditional versus mobile app self-monitoring of physical activity and dietary intake among overweight adults participating in an mHealth weight loss program." Journal of the American Medical Informatics Association, 20(3), 513-518.',
              'World Health Organization. (2021). "Obesity and Overweight." WHO Fact Sheet. Retrieved from https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight.',
              'React Documentation. (2024). "React – A JavaScript library for building user interfaces." Retrieved from https://react.dev/',
              'Supabase Documentation. (2024). "Supabase – The Open Source Firebase Alternative." Retrieved from https://supabase.com/docs.',
              'Google AI. (2024). "Gemini API Documentation." Retrieved from https://ai.google.dev/docs.',
            ].map((ref, i) => (
              <li key={i} style={{ marginBottom: "8px", textAlign: "justify" }}>{ref}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* Print/PDF styles */}
      <style>{`
        .page-break-after {
          page-break-after: always;
          break-after: page;
        }
        @media print {
          body { margin: 0; padding: 0; }
          .thesis-content { max-width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default Thesis;

export const professionalExperience = [
  {
    period: "Jan — Jun 2026",
    role: "Business Development Intern",
    org: "PT Krakatau Information Technology",
    detail:
      "Built a full-stack project management application with Laravel & MySQL, ran system analysis for upcoming feature requirements, and doubled as project manager for the team on the same project.",
    tags: ["Laravel", "MySQL", "System Analysis", "Project Management"],
  },
  {
    period: "Early 2024 — Present",
    role: "Freelance Full-Stack Developer & Business Analyst",
    org: "Independent",
    detail:
      "Handle digital products end to end — from e-commerce platforms to ML-powered mobile apps, including the business strategy behind them.",
    tags: ["React", "Mobile Dev", "Machine Learning", "Business Planning"],
  },
  {
    period: "Oct 2024 — Present",
    role: "Private Tutor",
    org: "Independent",
    detail:
      "Teach Math, Chemistry, Physics, and English to high school students, adapting each lesson to the student's pace and learning style.",
    tags: ["Teaching", "Mentoring"],
  },
];

export const organizationalExperience = [
  {
    period: "2025 — Present",
    role: "Head of Internal Affairs Department",
    org: "HMIF FT UNTIRTA",
    detail:
      "Oversee three internal divisions, keep cross-division coordination on track, and serve as the main liaison with the board of directors.",
    tags: ["Leadership", "Coordination"],
  },
  {
    period: "2024 — 2025",
    role: "Head of Evaluation Division, Internal Affairs",
    org: "HMIF FT UNTIRTA",
    detail:
      "Designed member performance evaluation parameters and ran the Best Member Award process. Awarded Best Member of the Internal Affairs Department, 2025.",
    tags: ["Evaluation Design", "Best Member 2025"],
  },
];

export const projects = [
  {
    title: "Project Management System",
    period: "Internship, KIT",
    description:
      "Enterprise project management system covering the full flow from planning to completion, built with a scalable architecture for real business requirements.",
    tags: ["Laravel", "MySQL"],
    image: "/projects/manpro.jpg",
    github: "",
    demo: "https://manpro.krakatau-it.co.id/login",
  },
  {
    title: "Robux E-Commerce Platform",
    period: "Freelance",
    description:
      "A buy/sell platform for Robux with bot-based automated delivery to cut down manual transaction handling.",
    tags: ["React", "Automation"],
    image: "/projects/aveiblox.jpg",
    github: "",
    demo: "https://aveiblox.com/",
  },
  {
    title: "3F Mobile Commerce",
    period: "Freelance",
    description:
      "Mobile commerce app with separate dashboards for buyers and sellers, complete with order tracking.",
    tags: ["Mobile", "Android"],
    image: "/projects/3f.jpg",
    github: "https://github.com/Murfid-m/retail_app",
    demo: "",
  },
  {
    title: "WasteLessEats",
    period: "Freelance",
    description:
      "Image-recognition app that estimates the remaining shelf life of food items, aimed at helping reduce household food waste.",
    tags: ["Machine Learning", "Mobile"],
    image: "/projects/wastelesseats.jpg",
    github: "",
    demo: "",
  },
  {
    title: "NoteApp",
    period: "Freelance",
    description:
      "A personal note-taking app designed for daily use, offering a fast and intuitive way to organize ideas, tasks, and important information across devices.",
    tags: ["Android", "Mobile"],
    image: "",
    github: "https://github.com/Usamah-Abdul-Aziz/note_app",
    demo: "",
  },
  {
    title: "Si Babeh",
    period: "Freelance",
    description:
      "A Unity puzzle game that challenges players to solve object-pushing puzzles through strategic thinking, level progression, and logical problem-solving.",
    tags: ["C#", "Unity"],
    image: "/projects/sibabeh.jpg",
    github: "https://github.com/Usamah-Abdul-Aziz/Si-Babeh",
    demo: "",
  },
];

export const skillGroups = [
  {
    label: "Development",
    items: ["Laravel", "React & Next.js", "MySQL", "Python", "Flutter"],
  },
  {
    label: "Data & Analysis",
    items: ["Machine Learning Fundamentals", "Data Analytics", "Power BI", "Business & System Analysis"],
  },
  {
    label: "Collaboration",
    items: ["Leadership", "Project Management", "Public Speaking", "Problem Solving"],
  },
];

// Add a "url" (verification link) to any entry that has one — leave it
// null for certs without a public verification page. Nothing else needs
// to change; Skills.jsx picks this up automatically.
export const certifications = [
  { name: "Introduction to Data Science", issuer: "Cisco", url: null },
  { name: "Cloud Computing", issuer: "Digital Talent Scholarship", url: null },
  { name: "AWS Academy Cloud Architecture", issuer: "AWS", url: null },
  { name: "AWS Academy Cloud Foundations", issuer: "AWS", url: null },
  { name: "AWS Knowledge: Cloud Essentials", issuer: "AWS", url: null },
  { name: "EF SET English Certificate 77/100 (C2 Proficient)", issuer: "EF SET", url: null },
];

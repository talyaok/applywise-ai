const SKILLS = {
  JavaScript: ["javascript", "js", "ecmascript"],
  TypeScript: ["typescript", "ts"],
  Python: ["python"],
  Java: ["java"],
  "C++": ["c++", "cpp"],
  "C#": ["c#", "csharp"],
  React: ["react", "react.js", "reactjs"],
  "Next.js": ["next.js", "nextjs"],
  "Node.js": ["node.js", "nodejs"],
  Express: ["express.js", "expressjs", "express"],
  HTML: ["html", "html5"],
  CSS: ["css", "css3"],
  Tailwind: ["tailwind", "tailwind css"],
  SQL: ["sql"],
  PostgreSQL: ["postgresql", "postgres"],
  MySQL: ["mysql"],
  MongoDB: ["mongodb", "mongo"],
  Supabase: ["supabase"],
  Firebase: ["firebase", "firestore"],
  AWS: ["aws", "amazon web services"],
  Docker: ["docker"],
  Kubernetes: ["kubernetes", "k8s"],
  Git: ["git"],
  GitHub: ["github"],
  REST: ["rest", "rest api", "restful api", "rest apis"],
  GraphQL: ["graphql"],
  Figma: ["figma"],
  Jest: ["jest"],
  Cypress: ["cypress"],
  Playwright: ["playwright"],
  Excel: ["excel", "microsoft excel"],
  "Machine Learning": ["machine learning"],
  "Data Analysis": ["data analysis", "data analytics"],
  "Project Management": ["project management"],
  Communication: ["communication"],
  Leadership: ["leadership"],
};

const ADVICE = {
  TypeScript: "Learn TypeScript types, interfaces, and how to use them in a React project.",
  React: "Build a small React application using components, props, and hooks.",
  Python: "Practice Python fundamentals and complete a small automation project.",
  SQL: "Practice SELECT, JOIN, GROUP BY, and database queries.",
  Docker: "Learn to containerize a small application with Docker.",
  AWS: "Explore AWS fundamentals and deploy a simple project.",
  Git: "Practice branching, commits, merging, and pull requests.",
  "Next.js": "Build a small Next.js application using the App Router.",
  "Node.js": "Build a basic backend API with Node.js.",
};

function hasSkill(text, aliases) {
  return aliases.some((alias) => {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(
      `(^|[^a-zA-Z0-9+#])${escaped}(?=$|[^a-zA-Z0-9+#])`,
      "i"
    );
    return pattern.test(text);
  });
}

function extractSkills(text) {
  return Object.entries(SKILLS)
    .filter(([, aliases]) => hasSkill(text, aliases))
    .map(([skill]) => skill);
}

export function analyzeMatch(userInput, jobDescription) {
  if (!userInput.trim() || !jobDescription.trim()) {
    throw new Error("Please enter your skills and a job description.");
  }

  const userSkills = extractSkills(userInput);
  const requiredSkills = extractSkills(jobDescription);

  if (requiredSkills.length === 0) {
    throw new Error(
      "No recognizable skills found in this job description. Try a more detailed description."
    );
  }

  const matchedSkills = requiredSkills.filter((skill) =>
    userSkills.includes(skill)
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !userSkills.includes(skill)
  );

  const score = Math.round(
    (matchedSkills.length / requiredSkills.length) * 100
  );

  const recommendations = missingSkills.slice(0, 5).map((skill) => ({
    skill,
    advice:
      ADVICE[skill] ||
      `Study ${skill} fundamentals and demonstrate the skill through a practical project.`,
  }));

  return {
    score,
    matchedSkills,
    missingSkills,
    requiredSkills,
    recommendations,
  };
}

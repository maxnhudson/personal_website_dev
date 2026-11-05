// Skill groups shown on the site. Each entry becomes one SkillGroup:
// `header` is the group heading, `skills` is the list under it.
// Define the shape of a single skill group
interface SkillGroup {
  header: string;
  skills: string[];
}

// Apply the SkillGroup array type to your constant
const skillGroups: SkillGroup[] = [
  {
    header: "Languages",
    skills: ["C", "C++", "Java", "JavaScript", "TypeScript", "Python"],
  },
  {
    header: "Front-end",
    skills: ["React", "Vue", "HTML", "CSS"],
  },
  {
    header: "Back-end",
    skills: ["SQL", "PostgreSQL", "ORM frameworks"],
  },
  {
    header: "Infrastructure",
    skills: ["Virtualization", "Containerization", "Pytorch"],
  },
];

export default skillGroups;

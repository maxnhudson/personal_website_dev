// Project entries shown on the home page. Each entry becomes one Project card:
// `title` is the project name, `description` the short summary, `url` where it
// can be viewed, and `technologies` the tags displayed on the card.
//
// URLs are relative (no leading slash) so they resolve correctly whether the
// site is deployed at the domain root or under a subpath like
// /personal_website_dev/.

interface projects {
  title: string;
  description: string;
  url: string;
  technologies: string[];
}

const projects = [
  {
    title: "Mushroom Tracker",
    description:
      "A React and Vite app for tracking mushroom specimens. Browse and search species, log finds, and manage a personal collection with full authentication.",
    url: "mushroom-tracker/",
    technologies: ["React", "Vite", "Leaflet", "Bootstrap"],
  },
  {
    title: "Personal Website",
    description:
      "This site, built with Vue 3 and Vite. A personal portfolio with about, skills, and projects sections, deployed to GitHub Pages.",
    url: "https://github.com/maxnhudson/personal_website_dev",
    technologies: ["Vue 3", "Vite", "JavaScript", "CSS"],
  },
];

export default projects;

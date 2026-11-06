import.meta.glob("./styles/*.css", { eager: true });
import img from "./assets/Profile Picture 1-7-26 smaller.png";
import { loadFile, skillMap, projectMap } from "./scripts/index.ts";

const about = await loadFile("../data/about.txt");

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<nav class = "navbar">
  <ul>
    <li><a href="#aboutme">About me</a></li>
    <li><a href="#projects">Projects</a></li>
    <li><a href="#skills">Skills</a></li>
    <li><a href=https://docs.google.com/forms/d/e/1FAIpQLSelMB5bzjRODvkb3fe4yHUrk0QbJugZZeqfWtB4-GVSlcGSsA/viewform?usp=dialog">Contact Me</a></li>
    <li><a href="../public/MHudson_Resume_091526.pdf">Resume</a></li>
  </ul></nav>

<section id="aboutme">
  <div>
    <img src="${img}" class=pro-pic />
  </div>
  <div>
    <p1 class = pro-txt> ${about} </p1>
  </div>
</section>

<section id="projects">
  <div>
    <h1>Projects</h1>
    <div id = projectSlot class = "card-grid"/>
  </div>
</section>

<section id ="skills"> 
  <div>
    <h1>Skills</h1>
    <div id = skillSlot class = "card-grid"/>
  </div>
</section>
`;

const listContainer = document.getElementById("projectSlot") as HTMLUListElement;
projectMap(listContainer);

const listContainer2 = document.getElementById("skillSlot") as HTMLUListElement;
skillMap(listContainer2);

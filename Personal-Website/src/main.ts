import "./style.css";
import img from "./assets/Profile Picture 1-7-26 smaller.png";
import { loadTextFile } from "./fileOpen.ts";

const about = await loadTextFile("../data/about.txt");

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<section id="about-me">
  <div>
    <img src="${img}" class=pro-pic />
  </div>
  <div>
    <p1 class = pro-txt> ${about} </p1>
  </div>
</section>
`;

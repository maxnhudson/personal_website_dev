import projects from "../../data/projects.ts";

export function projectMap(listContainer: HTMLUListElement) {
  if (listContainer) {
    projects.forEach((item) => {
      const div = document.createElement("div");
      const h3 = document.createElement("h3");
      const ul = document.createElement("ul");
      const p = document.createElement("p");
      const a = document.createElement("a");
      div.className = "card";
      h3.textContent = item.title;
      h3.className = "card-header";
      ul.className = "card-list";
      p.textContent = item.description;
      a.href = item.url;
      a.className = "card-container";

      a.appendChild(div);
      div.appendChild(h3);
      div.appendChild(p);
      div.appendChild(ul);

      item.technologies.forEach((skill) => {
        const li = document.createElement("li");
        li.textContent = skill;
        li.className = "card-list-item";
        ul.appendChild(li);
      });

      listContainer.appendChild(a);
    });
  }
}

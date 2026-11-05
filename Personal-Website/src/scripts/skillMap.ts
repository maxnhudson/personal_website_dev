export function skillMap(listContainer, skillGroups) {
  if (listContainer) {
    skillGroups.forEach((item) => {
      const div = document.createElement("div");
      const h3 = document.createElement("h3");
      const ul = document.createElement("ul");
      div.className = "card";
      h3.textContent = item.header;
      h3.className = "card-header";
      ul.className = "card-list";

      div.appendChild(h3);
      div.appendChild(ul);

      item.skills.forEach((skill) => {
        const li = document.createElement("li");
        li.textContent = skill;
        li.className = "card-list-item";
        ul.appendChild(li);
      });

      listContainer.appendChild(div);
    });
  }
}

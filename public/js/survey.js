const searchBar = document.querySelector("#search");
const container = document.querySelector(".tags__container");

function insertDomItem(newItem) {
  /**
    <div class="tag__item">
      {{ newValue }}
      <span class="tag__close">&times; </span>
    </div>  
  */
  const nodeItem = document.createElement("div");
  const inputItem = document.createElement("input");
  inputItem.classList.add("input_tag");
  nodeItem.classList.add("tag__item");

  const value = document.createTextNode(newItem);
  nodeItem.appendChild(value);
  inputItem.name = "tags";
  inputItem.setAttribute("value", newItem);

  const closeBtn = document.createElement("span");
  closeBtn.classList.add("tag__close");
  closeBtn.textContent = "×";
  nodeItem.appendChild(closeBtn);

  container.appendChild(nodeItem);
  container.appendChild(inputItem);
}

function deleteDomItem(item) {
  item.remove();
}

/**
 * @return true if newValue isn't duplicated
 */
function checkDuplicate(newValue) {
  const existedNodes = document.querySelectorAll(".tag__item");

  for (const node of existedNodes) {
    if (node.textContent === newValue + "×") {
      return false;
    }
  }

  return true;
}

function refreshInput() {
  searchBar.value = "";
}

function updatesInputNameAttribute() {
  let tag_name = [];
  let children = container.children;
  for (let i = 0; i < children.length; i++) {
    let element = children[i];
    tag_name.push(element.textContent.slice(0, -1));
  }

  return tag_name;
}

searchBar.addEventListener("keyup", function (e) {
  const newValue = e.target.value.split(",")[0];

  if (e.code === "Comma") {
    if (checkDuplicate(newValue)) {
      insertDomItem(newValue);
    }
    refreshInput();
  }
});

/**
 * We use event-delegation here,
 * so that we don't need to remove event-listener each time when we remove item.
 *
 * If you want to know more detail about what the event-delegation is, please read this: https://javascript.info/event-delegation.
 */
container.addEventListener("click", (e) => {
  if (e.target.className === "tag__close") {
    deleteDomItem(e.target.parentElement);
  }
});

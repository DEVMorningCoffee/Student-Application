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

class Calendar {
  constructor(inputSelector) {
    this.input = document.querySelector(inputSelector);
    this.form = this.input.parentElement;
    this.popupContainer = null;
    this.monthContainer = null;
    this.tableContainer = null;
    this.table = document.createElement("table");
    this.months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    this.selectedMonth = new Date().getMonth();
    this.selectedYear = new Date().getFullYear();

    this.buildCalendar();
    this.setMainEventListener();
  }

  buildCalendar() {
    this.popupContainer = document.createElement("div");
    this.popupContainer.classList.add("calendar-popup");
    this.form.appendChild(this.popupContainer);

    this.monthContainer = document.createElement("div");
    this.monthContainer.classList.add("month-and-year");
    this.monthContainer.innerHTML = `<h4>${this.getMonth()} ${this.getYear()}</h4>`;
    this.popupContainer.appendChild(this.monthContainer);

    this.createButtons();

    this.populateTable(this.selectedMonth, this.selectedYear);
  }

  createButtons() {
    const prev = document.createElement("button");
    prev.classList.add("button", "prev");
    prev.innerHTML = "<i class='fas fa-chevron-left'></i>";
    const next = document.createElement("button");
    next.classList.add("button", "next");
    next.innerHTML = "<i class='fas fa-chevron-right'></i>";

    prev.addEventListener("click", (e) => {
      e.preventDefault();
      this.updateMonth(this.selectedMonth - 1);
    });

    next.addEventListener("click", (e) => {
      e.preventDefault();
      this.updateMonth(this.selectedMonth + 1);
    });

    this.popupContainer.appendChild(prev);
    this.popupContainer.appendChild(next);
  }

  populateTable(month, year) {
    this.table.innerHTML = "";

    const namesRow = document.createElement("tr");
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach((name) => {
      const th = document.createElement("th");
      th.innerHTML = name;
      namesRow.appendChild(th);
    });
    this.table.appendChild(namesRow);

    const tempDate = new Date(year, month, 1);
    let firstMonthDay = tempDate.getDay();
    firstMonthDay = firstMonthDay === 0 ? 7 : tempDate.getDay();

    const daysInMonth = this.getDaysInMonth(month, year);
    const j = daysInMonth + firstMonthDay - 1;

    let tr = document.createElement("tr");

    if (firstMonthDay - 1 !== 0) {
      tr = document.createElement("tr");
      this.table.appendChild(tr);
    }

    for (let i = 0; i < firstMonthDay - 1; i++) {
      const td = document.createElement("td");
      td.innerHTML = "";
      tr.appendChild(td);
    }

    for (let i = firstMonthDay - 1; i < j; i++) {
      if (i % 7 === 0) {
        tr = document.createElement("tr");
        this.table.appendChild(tr);
      }

      const td = document.createElement("td");
      td.innerText = i - firstMonthDay + 2;
      td.dayNr = i - firstMonthDay + 2;
      td.classList.add("day");

      td.addEventListener("click", (e) => {
        const selectedDay = e.target.innerHTML;
        this.fillInput(selectedDay);
        this.hideCalendar();
      });

      tr.appendChild(td);
    }

    this.popupContainer.appendChild(this.table);
  }

  fillInput(day) {
    day = day < 10 ? "0" + day : day;
    let month = null;
    month =
      this.selectedMonth < 9
        ? "0" + (this.selectedMonth + 1)
        : this.selectedMonth + 1;
    this.input.value = `${this.selectedYear}-${month}-${day}`;
  }

  updateMonth(month) {
    this.selectedMonth = month;
    if (this.selectedMonth < 0) {
      this.selectedYear--;
      this.selectedMonth = 11;
    } else if (this.selectedMonth > 11) {
      this.selectedYear++;
      this.selectedMonth = 0;
    }
    this.monthContainer.innerHTML = `<h4>${this.months[this.selectedMonth]} ${
      this.selectedYear
    }</h4>`;

    this.populateTable(this.selectedMonth, this.selectedYear);
  }

  getMonth() {
    return this.months[this.selectedMonth];
  }

  getYear() {
    return this.selectedYear;
  }

  getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  hideCalendar() {
    this.form.classList.remove("open");
  }

  setMainEventListener() {
    this.input.addEventListener("click", (e) => {
      this.form.classList.toggle("open");

      if (!this.form.classList.contains("open")) {
        this.hideCalendar();
      }
    });
  }
}

new Calendar(".start_date_input");
new Calendar(".end_date_input");

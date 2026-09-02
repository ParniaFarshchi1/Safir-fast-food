function showSection(section) {
  document
    .querySelectorAll(".panel-section")
    .forEach((s) => (s.style.display = "none"));
  document.getElementById(section).style.display = "block";
}

function logout() {
  window.location.href = "index.html";
}

let categories = JSON.parse(localStorage.getItem("categories") || "[]");
let items = JSON.parse(localStorage.getItem("items") || "[]");

// --------------- ذخیره در localStorage --------------------
function saveData() {
  localStorage.setItem("categories", JSON.stringify(categories));
  localStorage.setItem("items", JSON.stringify(items));
}

// -------------------- نمایش پاپ‌آپ اضافه کردن ------------------
function openPopup(type, id = null) {
  const popup = document.createElement("div");
  popup.className = "popup";

  if (type === "category") {
    popup.innerHTML = `
      <div class="popup-box">
        <h3>${id ? "ویرایش دسته" : "افزودن دسته جدید"}</h3>
            <label for="popupCatName">Name:</label>
        <input id="popupCatName" placeholder="نام دسته..." value="${id ? categories.find((c) => c.id === id).name : ""}">
        <div class="popup-actions">
          <button onclick="${id ? `saveEditCategory(${id})` : "addCategoryPopup()"}">Save</button>
          <button class="exitbtn" onclick="closePopup()">Exit</button>
        </div>
      </div>`;
  } else if (type === "item") {
    let options = categories
      .map((c) => `<option value="${c.id}">${c.name}</option>`)
      .join("");
    let item = id ? items.find((i) => i.id === id) : null;
    popup.innerHTML = `
      <div class="popup-box">
        <h3>${id ? "ویرایش آیتم" : "افزودن آیتم جدید"}</h3>
            <label for="popupItemtName">Name:</label>
        <input id="popupItemName" placeholder="نام آیتم..." value="${item ? item.name : ""}">
                    <label for="popupItemtImage">Image:</label>
        <input type="file" id="popupItemImage" placeholder="عکس..." value="${item ? item.image : ""}">
                    <label for="popupItemtDesc">Description:</label>
        <textarea id="popupItemDesc" placeholder="توضیحات...">${item ? item.desc : ""}</textarea>
                    <label for="popupItemtPrice">Price:</label>
        <input id="popupItemPrice" type="number" placeholder="قیمت..." value="${item ? item.price : ""}">
                    <label for="popupItemtCat">Category:</label>
        <select id="popupItemCat">${options}</select>
        <div class="popup-actions">
          <button onclick="${id ? `saveEditItem(${id})` : "addItemPopup()"}">Save</button>
          <button class="exitbtn" onclick="closePopup()">Exit</button>
        </div>
      </div>`;
  }

  document.body.appendChild(popup);
}

function closePopup() {
  document.querySelector(".popup")?.remove();
}
function getNextId(key) {
  const counterKey = key + "_counter";
  let id = parseInt(localStorage.getItem(counterKey) || "0") + 1;
  localStorage.setItem(counterKey, id);
  return id;
}

function addCategoryPopup() {
  const name = document.getElementById("popupCatName").value.trim();
  if (!name) return alert("نام دسته را وارد کنید.");
  categories.push({ id: getNextId("cat"), name, active: true });
  saveData();
  renderCategories();
  closePopup();
}

function saveEditCategory(id) {
  const name = document.getElementById("popupCatName").value.trim();
  if (!name) return alert("نام دسته را وارد کنید.");
  const cat = categories.find((c) => c.id === id);
  cat.name = name;
  saveData();
  renderCategories();
  closePopup();
}

function addItemPopup() {
  let name = document.getElementById("popupItemName").value.trim();
  let image = document.getElementById("popupItemImage").value.trim();
  let desc = document.getElementById("popupItemDesc").value.trim();
  let price = document.getElementById("popupItemPrice").value.trim();
  let catId = document.getElementById("popupItemCat").value;

  if (!name || !price || !catId) return alert("تمام فیلدها را پر کنید.");

  items.push({
    id: getNextId("item"),
    name,
    image,
    desc,
    price,
    catId,
    active: true,
  });
  saveData();
  renderItems();
  closePopup();
}

function saveEditItem(id) {
  let item = items.find((i) => i.id === id);
  item.name = document.getElementById("popupItemName").value.trim();
  item.image = document.getElementById("popupItemImage").value.trim();
  item.desc = document.getElementById("popupItemDesc").value.trim();
  item.price = document.getElementById("popupItemPrice").value.trim();
  item.catId = document.getElementById("popupItemCat").value;
  saveData();
  renderItems();
  closePopup();
}
   
function toggleStatus(id) {
  let item = items.find((i) => i.id === id);
  item.active = !item.active;
  saveData();
  renderItems();
}
function toggleStatusI(id) {
  let category = categories.find((c) => c.id === id);
  category.active = !category.active;
  saveData();
  renderCategories();
}

function removeItem(id) {
  if (confirm("آیا مطمئن هستید؟")) {
    items = items.filter((i) => i.id !== id);
    saveData();
    renderItems();
  }
}
function removeCategory(id) {
  if (confirm("این کار تمام آیتم‌های این دسته را نیز حذف می‌کند. ادامه؟")) {
    categories = categories.filter((c) => c.id !== id);
    items = items.filter((i) => i.catId !== id);
    saveData();
    renderCategories();
    renderItems();
  }
}


function renderCategories() {
  const list = document.getElementById("cat-list");
  list.innerHTML = categories
    .map(
      (c) =>
        `<tr>
        <td>${c.name}</td>
        <td>${c.active ? "Enable" : "Disable"}</td>
        <td>
          <button onclick="openPopup('category', ${c.id})">Edit</button>
          <button id="delete" onclick="removeCategory(${c.id})">Delete</button>
          <button id="status" ${c.active ? "active" : "inactive"} onclick="toggleStatusI(${c.id})">Status</button>

        </td>
      </tr>`,
    )
    .join("");
}

function renderItems() {
  const list = document.getElementById("item-list");
  list.innerHTML = items
    .map((i) => {
      const cat = categories.find((c) => c.id === i.catId)?.name || "—";
      return `<tr>
        <td>${i.id}</td>
        <td><img src="${i.image}" width="50"></td>
        <td>${i.name}</td>
        <td>${i.desc}</td>
        <td>${i.price}</td>
        <td>${i.active ? "Enable" : "Disable"}</td>
        <td>
          <button id="edit"onclick="openPopup('item', ${i.id})">Edite</button>
          <button id="delete" onclick="removeItem(${i.id})">Delete</button>
          <button id="status" ${i.active ? "active" : "inactive"} onclick="toggleStatus(${i.id})">Status</button>
        </td>
      </tr>`;
    })
    .join("");
}

document.getElementById("create-categories").onclick = () =>
  openPopup("category");
document.getElementById("create-item").onclick = () => openPopup("item");

renderCategories();
renderItems();

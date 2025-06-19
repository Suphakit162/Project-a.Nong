window.onload = loadProducts;

let editingProductId = null;

// โหลดรายการสินค้า
async function loadProducts() {
  const res = await fetch('http://localhost:3000/api/admin/products');
  if (!res.ok) {
    console.error('HTTP error:', res.status);
    return;
  }
  const products = await res.json();
  if (!Array.isArray(products)) {
    console.error('Expected products array but got:', products);
    return;
  }

  const table = document.getElementById('product-table');
  table.innerHTML = '';
  products.forEach(p => {
    const row = `
      <tr>
        <td>${p.name}</td>
        <td>${p.description}</td>
        <td>${p.price}</td>
        <td><img src="${p.image_url}" width="60" /></td>
        <td>${p.category}</td>
        <td>
          <button class="edit-btn"
          data-id="${p.id}"
          data-name="${encodeURIComponent(p.name)}"
          data-description="${encodeURIComponent(p.description)}"
          data-price="${p.price}"
          data-image_url="${encodeURIComponent(p.image_url)}"
          data-category="${encodeURIComponent(p.category)}"
        >แก้ไข</button>
          <button onclick="deleteProduct(${p.id})">ลบ</button>
        </td>
      </tr>
    `;
    table.innerHTML += row;
  });
  
// หลังจากโหลดสินค้าเสร็จ
  document.querySelectorAll('.edit-btn').forEach(button => {
  button.addEventListener('click', () => {
    const id = button.dataset.id;
    const name = decodeURIComponent(button.dataset.name);
    const description = decodeURIComponent(button.dataset.description);
    const price = parseFloat(button.dataset.price);
    const image_url = decodeURIComponent(button.dataset.image_url);
    const category = decodeURIComponent(button.dataset.category);
    editProduct(id, name, description, price, image_url, category);
  });
});
}




// // ฟังก์ชันหนี quote เพื่อป้องกัน bug เวลาแก้ไข
// function escapeQuotes(str) {
//   return str.replace(/'/g, "\\'");
// }

// กรอกฟอร์มเพื่อแก้ไขสินค้า
function editProduct(id, name, description, price, image_url, category) {
  editingProductId = id;
  const form = document.getElementById('product-form');
  form.name.value = name;
  form.description.value = description;
  form.price.value = price;
  form.image_url.value = image_url;
  form.category.value = category;

  document.getElementById('submit-button').textContent = 'บันทึกการแก้ไข';
}

// เพิ่มหรือแก้ไขสินค้า
document.getElementById('product-form').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const product = Object.fromEntries(formData.entries());

  if (editingProductId) {
    // แก้ไข
    await fetch(`http://localhost:3000/api/admin/products/${editingProductId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    editingProductId = null;
    document.getElementById('submit-button').textContent = 'เพิ่มสินค้า';
  } else {
    // เพิ่ม
    await fetch('http://localhost:3000/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
  }

  form.reset();
  loadProducts();
});

// ลบสินค้า
async function deleteProduct(id) {
  await fetch(`http://localhost:3000/api/admin/products/${id}`, { method: 'DELETE' });
  loadProducts();
}

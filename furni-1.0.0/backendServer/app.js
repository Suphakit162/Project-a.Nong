const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/ecommerce.db');


const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const registerData = require('./data/register');
const loginData = require('./data/login');
const helmet = require('helmet');

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    fontSrc: ["'self'", "https:", "data:"],
    styleSrc: ["'self'", "'unsafe-inline'", "https:"],
    imgSrc: ["'self'", "data:", "https:"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
    connectSrc: ["'self'", "http://localhost:3000"]
  }
}));
app.use(express.static(path.resolve(__dirname, '../furni-1.0.0')));


//เสิร์ฟทุกไฟล์ static (เช่น index.html, login.html) จากโฟลเดอร์ furni-1.0.0

console.log('Static root folder is:', path.join(__dirname, '..'));

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/register', registerData);
app.use('/api/login', loginData);
app.use('/images', express.static(path.join(__dirname, '..', 'images')));



const PORT = 3000;

// === ADMIN APIs ===


// ดึงสินค้าทั้งหมด
app.get('/api/admin/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      console.error('Error fetching products:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


// เพิ่มสินค้าใหม่
app.post('/api/admin/products', (req, res) => {
  const { name, description, price, image_url, category } = req.body;

  // ตรวจสอบข้อมูลก่อน
  if (!name || !price || !image_url) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = 'INSERT INTO products (name, description, price, image_url, category) VALUES (?, ?, ?, ?, ?)';
  db.run(sql, [name, description, price, image_url, category], function (err) {
    if (err) {
      console.error('Error inserting product:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});


// ลบสินค้า
app.delete('/api/admin/products/:id', (req, res) => {
  const sql = 'DELETE FROM products WHERE id = ?';
  db.run(sql, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// แก้ไขสินค้า
app.put('/api/admin/products/:id', (req, res) => {
  const { name, description, price, image_url, category } = req.body;
  const sql = 'UPDATE products SET name=?, description=?, price=?, image_url=?, category=? WHERE id=?';
  db.run(sql, [name, description, price, image_url, category, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/ecommerce.db');

// ✅ ตัวนี้เวิร์กสุด
router.get('/', (req, res) => {
  const category = req.query.category;
  let sql = `SELECT * FROM products`;
  const params = [];

  if (category && category !== 'ทั้งหมด') {
    sql += ` WHERE category = ?`;
    params.push(category);
  }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/representatives', (req, res) => {
  // Query เพื่อดึงสินค้าหมวดละ 1 ชิ้น
  // SQLite ไม่มีฟังก์ชัน ROW_NUMBER() แบบเต็มรูปแบบ แต่สามารถใช้ GROUP BY ร่วมกับ MIN(id) ได้
  const sql = `
    SELECT p.*
    FROM products p
    INNER JOIN (
      SELECT category, MIN(id) AS min_id
      FROM products
      GROUP BY category
    ) grouped ON p.category = grouped.category AND p.id = grouped.min_id
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// ✅ Search สินค้า
router.get('/search', (req, res) => {
  const keyword = req.query.q;

  if (!keyword) {
    return res.status(400).json({ error: 'กรุณาระบุคำค้นหา' });
  }

  const sql = `SELECT * FROM products WHERE name LIKE ?`;
  const params = [`%${keyword}%`];

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});





module.exports = router;

const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/ecommerce.db');

router.get('/', (req, res) => {
  const query = "SELECT * FROM products";
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("DB ERROR:", err.message);  // 👍 เพิ่ม log
      return res.status(500).json({ error: err.message });
    }
    res.json(rows); // ✅ ส่งกลับ array
  });
});

module.exports = router;

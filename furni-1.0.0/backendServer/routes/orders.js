const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/ecommerce.db');

// POST /api/orders
router.post('/', (req, res) => {
  const { fullname, email, address, items } = req.body;

  if (!fullname || !email || !address || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const insertOrderSQL = `INSERT INTO orders (fullname, email, address, created_at) VALUES (?, ?, ?, datetime('now'))`;

  db.run(insertOrderSQL, [fullname, email, address], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    const orderId = this.lastID;
    const insertItemSQL = `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;

    const stmt = db.prepare(insertItemSQL);

    for (const item of items) {
      stmt.run(orderId, item.product_id, item.quantity, item.price);
    }

    stmt.finalize();

    // ล้างตะกร้า (cart_items)
    db.run(`DELETE FROM cart_items`);

    res.json({ success: true, order_id: orderId });
  });
});

module.exports = router;

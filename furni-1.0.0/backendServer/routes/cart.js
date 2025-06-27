const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/ecommerce.db');

// ✅ middleware เช็ค login
function requireLogin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "กรุณาเข้าสู่ระบบก่อน" });
  }
  const token = authHeader.split(' ')[1];
  if (token !== "yes") {
    return res.status(401).json({ success: false, message: "Token ไม่ถูกต้อง" });
  }
  next();
}



// ✅ เพิ่มสินค้าในตะกร้า (ต้อง login)
router.post('/', requireLogin, (req, res) => {
  const { product_id, quantity } = req.body;
  if (!product_id) return res.status(400).json({ error: "Missing product_id" });

  db.run(
    `INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)`,
    [product_id, quantity || 1],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, insertedId: this.lastID });
    }
  );
});

router.post('/orders', (req, res) => {
  const { fullname, email, address, items } = req.body;

  if (!fullname || !email || !address || !items || !items.length) {
    return res.status(400).json({ success: false, message: 'ข้อมูลไม่ครบถ้วน' });
  }
})

router.get('/', (req, res) => {
  const query = `
    SELECT cart_items.id, products.name, products.price, products.image_url, cart_items.quantity
    FROM cart_items
    JOIN products ON cart_items.product_id = products.id
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

//remove from cart
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM cart_items WHERE id = ?`;
    db.run(sql, [id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });

  //อัปเดตจำนวนสินค้า
  router.put('/:id', (req, res) => {
    const { quantity } = req.body;
    const id = req.params.id;
    db.run(`UPDATE cart_items SET quantity = ? WHERE id = ?`, [quantity, id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });

  //backend endpoint 
router.delete('/clear', (req, res) => {
    db.run('DELETE FROM cart_items', [], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });
  
  
  

module.exports = router;

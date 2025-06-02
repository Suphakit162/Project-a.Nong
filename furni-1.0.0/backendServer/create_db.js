const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const dbFolder = './db';

if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder);
}

const db = new sqlite3.Database('./db/ecommerce.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image_url TEXT,
    category TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY (product_id) REFERENCES products(id)
  )`);


  db.run(`INSERT INTO products (name, description, price, image_url, category)
    VALUES 
    ('Nordic Chair', 'Stylish chair', 50.00, 'images/product-1.png', 'Chair'),
    ('Kruzo Aero Chair', 'Comfortable design', 78.00, 'images/product-2.png', 'Chair'),
    ('Ergonomic Chair', 'Work-friendly chair', 43.00, 'images/product-3.png', 'Chair')
  `);

  console.log("Database created and sample products inserted.");
});

db.close();

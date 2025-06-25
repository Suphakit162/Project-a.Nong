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

  db.run(`DELETE FROM products`); // เคลียร์ก่อน insert ใหม่

  db.run(`CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    image_urls TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id)
  )`);

  //เพิ่มสินค้า
  db.run(`INSERT INTO products (name, description, price, image_url, category)
    VALUES 
    
    ('Nordic Chair', 'Stylish chair', 50.00, 'images/product-1.png', 'เก้าอี้'),
    ('Kruzo Aero Chair', 'Comfortable design', 78.00, 'images/product-2.png', 'เก้าอี้'),
    ('Ergonomic Chair', 'Work-friendly chair', 43.00, 'images/product-3.png', 'เก้าอี้'),

    ('KIVIK ชีวิค', 'โซฟา3ที่นั่ง, ทิบเบลบือ เบจ/เทา', 12990.00, 'images/sofa1.png', 'โซฟา'),
    ('ESÖDERHAMN เซอเดอร์ฮัมน์', 'โซฟา2ที่นั่ง, ทูเนรูดแดง', 15400.00, 'images/sofa2.png', 'โซฟา'),
    ('HYLTARP ฮิลทาร์ป', 'โซฟาเบด 2 ที่นั่ง, คิลันดาฟ้าอ่อน', 28990.00, 'images/sofa3.png', 'โซฟา'),
    ('LANDSKRONA ลันด์สครูน่า', 'โซฟา2ที่นั่ง, กุนนาเรียด เขียวอ่อน/ไม้', 12990.00, 'images/sofa4.png', 'โซฟา'),
    ('JÄTTEBO แยทตะโบ', 'โซฟาโมดูลาร์มีที่เก็บของ, ซัมซอลาเขียวเข้ม', 10500.00, 'images/sofa5.png', 'โซฟา'),

    ('IDANÄS อิดาแนส', 'เตียงบุนวม, กุนนาเรียดเทาเข้ม', 27990.00, 'images/bed1.png', 'เตียงนอน'),
    ('IDANÄS v2 อิดาแนส', 'เตียงบุนวมพร้อมที่เก็บของ, นักเก็น เบจ', 24990.00, 'images/bed2.png', 'เตียงนอน'),
    ('TÄLLÅSEN ทัลลัวเซน', 'โครงเตียงบุนวม, กูลสตาเทา-เขียว', 13590.00, 'images/bed4.png', 'เตียงนอน'),
    ('SMYGA สมีกา', 'โครงเตียงพร้อมลิ้นชักเก็บของ, เทาอ่อน', 9990.00, 'images/bed3.png', 'เตียงนอน'),
    ('MYDAL มีดอล', 'โครงเตียงสองชั้น, ไม้สน', 14990.00, 'images/bed6.png', 'เตียงนอน'),
    ('ÅBYGDA อัวบิกดา', 'ที่นอนโฟม, แน่น/ขาว', 5990.00, 'images/bed5.png', 'เตียงนอน'),

    ('RODULF รูดูล์ฟ', 'โต๊ะทำงาน นั่ง/ยืน, ไฟฟ้า/ขาว', 10990.00, 'images/desk1.png', 'โต๊ะ'),
    ('MITTZON มิตต์ซุน', 'โต๊ะประชุมวีเนียร์วอลนัท/ดำ', 8990.00, 'images/desk2.png', 'โต๊ะ'),

    ('MITTZON มิตต์ซุน', 'โต๊ะประชุมวีเนียร์วอลนัท/ดำ', 8990.00, 'images/shelf1.avif', 'ชั้นวางของ'),
    ('MITTZON มิตต์ซุน', 'โต๊ะประชุมวีเนียร์วอลนัท/ดำ', 8990.00, 'images/shelf2.avif', 'ชั้นวางของ'),
    ('MITTZON มิตต์ซุน', 'โต๊ะประชุมวีเนียร์วอลนัท/ดำ', 8990.00, 'images/shelf3.avif', 'ชั้นวางของ'),

    ('MITTZON มิตต์ซุน', 'โต๊ะประชุมวีเนียร์วอลนัท/ดำ', 8990.00, 'images/closet1.avif', 'ตู้เสื้อผ้า'),
    ('MITTZON มิตต์ซุน', 'โต๊ะประชุมวีเนียร์วอลนัท/ดำ', 8990.00, 'images/closet2.avif', 'ตู้เสื้อผ้า'),
    ('MITTZON มิตต์ซุน', 'โต๊ะประชุมวีเนียร์วอลนัท/ดำ', 8990.00, 'images/closet3.avif', 'ตู้เสื้อผ้า'),

    ('MITTZON มิตต์ซุน', 'โต๊ะประชุมวีเนียร์วอลนัท/ดำ', 8990.00, 'images/TVdesk1.avif', 'โต๊ะหน้าทีวี'),
    ('MITTZON มิตต์ซุน', 'โต๊ะประชุมวีเนียร์วอลนัท/ดำ', 8990.00, 'images/TVdesk2.avif', 'โต๊ะหน้าทีวี'),

    ('MITTZON มิตต์ซุน', 'โต๊ะประชุมวีเนียร์วอลนัท/ดำ', 8990.00, 'images/kitchen1.avif', 'สินค้าสำหรับห้องครัว'),
    ('MITTZON มิตต์ซุน', 'โต๊ะประชุมวีเนียร์วอลนัท/ดำ', 8990.00, 'images/kitchen2.avif', 'สินค้าสำหรับห้องครัว'),

    ('MITTZON มิตต์ซุน', 'โต๊ะประชุมวีเนียร์วอลนัท/ดำ', 8990.00, 'images/toilet1.avif', 'สินค้าสำหรับห้องน้ำ'),
    ('MITTZON มิตต์ซุน', 'โต๊ะประชุมวีเนียร์วอลนัท/ดำ', 8990.00, 'images/toilet2.avif', 'สินค้าสำหรับห้องน้ำ'),
    ('MITTZON มิตต์ซุน', 'โต๊ะประชุมวีเนียร์วอลนัท/ดำ', 8990.00, 'images/toilet3.avif', 'สินค้าสำหรับห้องน้ำ'),

    ('ÅRSTID อัวช์ทีด', 'โคมไฟตั้งโต๊ะ, ทองเหลือง/ขาว', 790.00, 'images/deco1.avif', 'ของตกแต่ง'),
    ('BUSENKEL บูเซงเกล', 'พรม, ลายข้าวหลามตัด/หลากสี', 1790.00, 'images/deco2.avif', 'ของตกแต่ง'),
    ('RÖDALM เรอดัล์ม', 'ภาพโปสเตอร์ใส่กรอบ, ทานตะวัน', 890.00, 'images/deco3.avif', 'ของตกแต่ง'),
    ('FEJKA เฟคก้า', 'ไม้ประดิษฐ์ในกระถาง, ใน/นอกอาคาร ต้นมะกอก', 690.00, 'images/deco4.avif', 'ของตกแต่ง')


  `);
  db.run(`DELETE FROM product_images`);

  db.run(`INSERT INTO product_images (product_id, image_url) VALUES
  (1, 'img/Pic-proDetail-bed-1.avif'),
  (1, 'img/desk2.png'),
  (1, 'img/product-1-3.png')
`);

  console.log("Database created and sample products inserted.");
});

db.close();

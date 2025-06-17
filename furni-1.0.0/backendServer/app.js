const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const registerData = require('./data/register');
const loginData = require('./data/login');

app.use(cors());
app.use(express.json());

//เสิร์ฟทุกไฟล์ static (เช่น index.html, login.html) จากโฟลเดอร์ furni-1.0.0
app.use(express.static(path.join(__dirname, '..')));
console.log('Static root folder is:', path.join(__dirname, '..'));

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/register', registerData);
app.use('/api/login', loginData);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const registerData = require('./data/register');
const loginData = require('./data/login');
const helmet = require('helmet');

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


app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/register', registerData);
app.use('/api/login', loginData);
app.use('/images', express.static(path.join(__dirname, '..', 'images')));



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

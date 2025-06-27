const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide both username and password.' });
  }

  const filePath = path.join(__dirname, '../data/user.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Internal server error' });

    let users;
    try {
      users = JSON.parse(data);
    } catch {
      return res.status(500).json({ message: 'Internal server error' });
    }

    const user = users.find(user => user.email === username && user.password === password);

    if (user) {
  return res.json({
    message: 'Login successfully.',
    user: {
      email: user.email,
      role: user.role || 'user'
    },
    token: 'yes' // ✅ mock token สำหรับใช้ตรวจสอบฝั่ง backend
  });
} else {
      return res.status(400).json({ message: 'Incorrect email or password' });
    }
  });
});

module.exports = router;
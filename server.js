// server.js
const express = require('express');
const db = require('./firebase-config'); // Đưa vào cấu hình Firebase

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tạo một endpoint để lấy dữ liệu từ Firestore
app.get('/api/users', async (req, res) => {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    const usersList = snapshot.docs.map(doc => doc.data());
    res.json(usersList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Tạo một endpoint để thêm dữ liệu vào Firestore
app.post('/api/users', async (req, res) => {
  const { name, email, password, age } = req.body;
  console.log(req.body);
  try {
    const newUser = { name, email, password, age };
    await db.collection('users').add(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

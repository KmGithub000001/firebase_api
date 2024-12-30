// functions/index.js
const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

// Khởi tạo Firebase Admin SDK
admin.initializeApp();

// Lấy đối tượng Firestore
const db = admin.firestore();

// Tạo cors option
const corsOption = {
  origin: "http://localhost:3000",
};

// Khởi tạo ứng dụng Express
const app = express();
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Tạo endpoint GET để lấy dữ liệu từ Firestore
app.get("/api/users", async (req, res) => {
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();
    const usersList = snapshot.docs.map((doc) => doc.data());
    res.json(usersList);
  } catch (error) {
    res.status(500).json({error: "Failed to fetch users"});
  }
});

// Tạo endpoint POST để thêm người dùng mới vào Firestore
app.post("/api/users", async (req, res) => {
  const {name, email} = req.body;
  try {
    const newUser = {name, email};
    await db.collection("users").add(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({error: "Failed to add user"});
  }
});

// Khởi tạo Firebase Function để triển khai Express
exports.api = functions.https.onRequest(app);

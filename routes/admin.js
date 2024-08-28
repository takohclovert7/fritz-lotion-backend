const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { saveItem} = require('../models/itemModel');
var  ProductOderModel=require("../models/productOrderModel")
// Mock database (replace with your actual database)
const users = [
  {
    id: 1,
    email: "admin@example.com",
    password: "$2a$10$qsA65CZb1r/NryjFYLl5n.ycCG5msqpEIl612nwC.HLFtF2Zg7noC", // hashed password
  }
];

// Secret key for JWT
const JWT_SECRET = "Lush & Glow Lotion Store";

// Middleware to check if the user is authenticated
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ message: 'Access denied, no token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin login route
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists in the database
  const user = users.find(u => u.email === email);
  if (!user) {
    console.log({ message: 'Invalid email or password' });
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Check if the password is correct
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    console.log({ message: 'Invalid email or password' });
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Generate a JWT token
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

  // Send the token back to the client
  console.log({ token });
  res.json({ token });
});

// Protected route: Admin dashboard
router.post('/admin/dashboard', authenticateToken,async (req, res) => {
  try {
    const {  itemName,itemPrice,itemImage,itemDescription} = req.body; // Assume the item data is sent in the request body
    const savedItem = await saveItem({itemName,itemPrice,itemImage,itemDescription} );
    res.status(201).json({message:"item save successfully"});
  } catch (error) {
    res.status(500).json({ message: 'Error saving item', error: error.message });
  }
  
});

// Protected route: Admin settings
router.get('/admin/see/all/orders', authenticateToken,async (req, res) => {
 
  try {
    const documents = await ProductOderModel.find({});
    res.json({ documents});
   
  } catch (err) {
    res.json({message: err});
  }

  

});

module.exports = router;

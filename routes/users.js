var express = require('express');
var router = express.Router();
var User=require("../models/userModel")
var  ProductOderModel=require("../models/productOrderModel")
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/signup",async function(req,res,next){
  const { email,password,name }=req.body
  User.signup(email, password,name)
  .then(user => res.status(200).json({user}))
  .catch(error => res.status(500).json({error:error.message}));
  
})

router.post("/login",async function (req,res,next) {
  const {email,password}=req.body
  User.login(email, password)
  .then(user => res.status(200).json({user}))
  .catch(error => res.status(500).json({error:error.message}));
  
})

router.post("/place/order",async function(req,res,next){
  const { productImage,productName,productDescription,productPrice,buyerName,buyerEmail}=req.body;
  const saveProduct= new  ProductOderModel({
    cover: productImage,
    name:productName,
    description:productDescription,
    price:productPrice,
    buyname: buyerName,
    buyeremail:buyerEmail
  });
  saveProduct.save()
  .then(() => res.json({message:"oder placed successly"}))
  .catch(err => res.json({message:err.message}));
})
 
router.post('/get/invoice/data', async (req, res) => {
  try {
    const {email} = req.body;
    const products = await ProductOderModel.find({ buyeremail:email});
    if (products.length > 0) {
      res.status(200).json({products});
    } else {
      res.status(404).json({ message: 'No products found for this user' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;

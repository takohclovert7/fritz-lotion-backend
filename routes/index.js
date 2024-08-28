var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
const {getAllItems } = require('../models/itemModel');
// Configure Nodemailer transporter for Yahoo Mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lushandglowlotionstore@gmail.com', // Your Yahoo email address
    pass: 'lzma mgxw ecsv ljvt', // Your Yahoo email password (or App Password if 2FA is enabled)
  },
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({message:"sever is ok"});
});

/* POST send email */
router.post('/send-email', function(req, res, next) {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email, // The email of the user sending the message
    to: 'lushandglowlotionstore@gmail.com', // Your Yahoo email address where you'll receive the message
    subject: name, // Subject line
    text: message // Plain text body
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
    res.status(200).json({ message: 'Email sent successfully!' });
  });
});


router.get("/get/all/products",async function (req,res,next) {
  try {
    const items = await getAllItems();
    res.status(200).json({items});
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving items', error: error.message });
  }
})
module.exports = router;

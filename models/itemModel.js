const mongoose = require('mongoose');

// Define the schema
const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
  itemPrice: {
    type: String,
    required: true
  },
  itemImage: {
    type: String,
    required: true
  },
  itemDescription: {
    type: String,
    required: true
  }
});

// Create the model from the schema
const Item = mongoose.model('Item', itemSchema);

// Function to save a new item to the database
const saveItem = async (itemData) => {  
  try {
    const item = new Item(itemData);
    const savedItem = await item.save();
    // console.log('Item saved successfully:', savedItem);
    return savedItem;
  } catch (error) {
    // console.error('Error saving item:', error);
    throw error;
  }
};

// Function to get all items from the database
const getAllItems = async () => {
  try {
    const items = await Item.find();
    // console.log('Items retrieved successfully:', items);
    return items;
  } catch (error) {
    // console.error('Error retrieving items:', error);
    throw error;
  }
};

module.exports = {
  Item,
  saveItem,
  getAllItems
};

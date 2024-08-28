const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {  
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Add createdAt and updatedAt fields
});

// Pre-save hook to hash password before saving to database
userSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Method to compare given password with the hashed password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Static method to sign up a new user
userSchema.statics.signup = async function(email, password,name) {
  try {
    // Check if the user already exists
    const existingUser = await this.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create a new user
    const user = new this({ email, password,name });
    await user.save();
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Static method to log in a user
userSchema.statics.login = async function(email, password) {
  try {
    // Find the user by email
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error('No user found with this email');
    }

    // Compare the given password with the stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid password');
    }

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Create the model
const User = mongoose.model('UserModel', userSchema);

module.exports = User;

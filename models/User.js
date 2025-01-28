const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User Schema
const userSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: [true, 'Name is required'] 
        },
        lName: { 
            type: String, 
            required: [true, 'Last Name is required'] 
        },
        mobile: { 
            type: Number, 
            required: [true, 'Mobile number is required'],
            validate: {
                validator: function(value) {
                  return /^[0-9]{10}$/.test(value);
                },
                message: 'Mobile number must be exactly 10 digits'
              }
        },
        email: { 
            type: String, 
            required: [true, 'Email is required'], 
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
        },
        gender: {
            type: String,
            required: [true, 'Gender is required'],
            enum: ['Male', 'Female', 'Other'],
            message: 'Gender must be Male, Female, or Other'
        },
        dob: {
            type: Date,
            required: [true, 'Date of birth is required'],
            validate: {
              validator: function(value) {
                // Ensures the date is not a future date (optional)
                return value <= new Date();
              },
              message: 'Date of birth cannot be in the future'
            }
        },
        password: { 
            type: String, 
            required: [true, 'Password is required'] 
        },
        isAdmin: { 
            type: Boolean, 
            default: false 
        },
        refreshToken: { 
            type: String 
        },
    },
    { 
        timestamps: true 
    }
);

// Method to match entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// Pre-save middleware to hash password before saving to the database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Por favor, forneça um nome.'],
    },
    email: {
      type: String,
      required: [true, 'Por favor, forneça um email.'],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Por favor, forneça uma senha.'],
      select: false,
    },
    username: {
      type: String,
      required: [true, 'Por favor, forneça um nome de usuário.'],
      unique: true,
      trim: true,
    },
    profilePicUrl: {
      type: String,
      default: 'https://www.gravatar.com/avatar/?d=mp',
    },
    newMessagePopup: {
      type: Boolean,
      default: true,
    },
    unreadMessage: {
      type: Boolean,
      default: false,
    },
    unreadNotification: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'root'],
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
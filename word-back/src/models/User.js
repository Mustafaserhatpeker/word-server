// src/models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // şifre veritabanında varsayılan olarak döndürülmez
  },
  name: {
    type: String,
    required: true,
  },
});

// Şifreyi hash'leme (pre-save middleware)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Şifre değiştirilmediyse, işleme devam etme

  const salt = await bcrypt.genSalt(10); // 10, bcrypt'teki salt rounds sayısıdır
  this.password = await bcrypt.hash(this.password, salt); // Şifreyi hash'le
  next();
});

// Şifreyi kontrol etme metodu
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password); // Şifreyi karşılaştır
};

const User = mongoose.model('User', userSchema);

export default User;

// src/models/doctor.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const doctorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false, 
  },
});


doctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); 

  const salt = await bcrypt.genSalt(10); 
  this.password = await bcrypt.hash(this.password, salt); 
  next();
});


doctorSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password); 
};

const Doctor = mongoose.model('doctor', doctorSchema);

export default Doctor;

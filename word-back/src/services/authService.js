//authService.js
import User from '../models/User.js';
import { signToken } from '../utils/jwtSign.js';
import AppError from '../utils/AppError.js';


export const registerUser = async (email, password, username) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw AppError.conflict('Bu email adresi zaten kayıtlı.');
  }


  const user = await User.create({
    email,
    password,
    username,
  });

  return {
    id: user._id,
    username: user.username,
    email: user.email,
  };
};





export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw AppError.unauthorized('Email veya şifre hatalı.');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw AppError.unauthorized('Şifre hatalı.');
  }

  const token = signToken(user.email);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

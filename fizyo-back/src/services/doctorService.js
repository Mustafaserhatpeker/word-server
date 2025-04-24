
import Doctor from '../models/Doctor.js';
import { signToken } from '../utils/jwtSign.js';
import AppError from '../utils/AppError.js';


export const registerUser = async (username, password) => {
    const existingUser = await Doctor.findOne({ username });
    if (existingUser) {
        throw AppError.conflict('Bu Doktor zaten kayıtlı.');
    }

    
    const user = await Doctor.create({
        username,
        password,
        
    });

    return {
        id: user._id,
        username: user.username,
    };
};





export const loginUser = async (username, password) => {
  const user = await Doctor.findOne({ username }).select('+password');

  if (!user) {
    throw AppError.unauthorized('username veya şifre hatalı.');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw AppError.unauthorized('Şifre hatalı.');
  }

  const token = signToken(user._id);

  return {
    user: {
      id: user._id,
      username: user.username,
    },
    token,
  };
};

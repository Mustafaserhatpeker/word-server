import User from '../models/User.js';


export const getAllUsers = async () => {
  const users = await User.find().select('-password'); 
  return users;
};


export const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password'); 
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}
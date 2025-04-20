import * as userService from '../services/userService.js';

export const getAllUsersController = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const registerController = async (req, res, next) => {
  try {
    const {email, password, name} = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password ve name alanları zorunludur.' });
    }
    const newUser = await userService.registerUser(email, password, name);
   
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

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
    const newUser = await userService.registerUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

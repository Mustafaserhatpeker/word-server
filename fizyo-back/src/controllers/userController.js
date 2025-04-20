import { getAllUsers, createUser } from '../services/userService.js';

export async function getAllUsersController(req, res, next) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function createUserController(req, res, next) {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
}

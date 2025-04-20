import * as authService from '../services/authService.js';



export const registerController = async (req, res, next) => {
  try {
    const {email, password, name} = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password ve name alanları zorunludur.' });
    }
    const newUser = await authService.registerUser(email, password, name);
   
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

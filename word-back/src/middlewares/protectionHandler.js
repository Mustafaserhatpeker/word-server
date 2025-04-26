// src/middlewares/protect.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const protect = catchAsync(async (req, res, next) => {
  let token;

  // Header'dan token'ı al
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(AppError.unauthorized('Bu işlemi yapmak için giriş yapmalısınız.'));
  }

  // Token'ı verify et
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Kullanıcı hâlâ var mı?
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(AppError.unauthorized('Kullanıcı artık mevcut değil.'));
  }

  req.user = currentUser;
  next();
});

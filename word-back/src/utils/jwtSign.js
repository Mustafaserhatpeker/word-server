// src/utils/jwt.js

import jwt from 'jsonwebtoken';

export const signToken = (userId, username) => {
  return jwt.sign({ id: userId, username: username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

import User from '../models/User.js';

// GET /users
export const getAllUsers = async () => {
  const users = await User.find().select('-password'); // şifreyi response'tan çıkar
  return users;
};

// POST /register
export const registerUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('Bu email adresiyle zaten bir kullanıcı mevcut.');
  }

  // Şifre hash'lemesi burada yapılabilir (opsiyonel)
  const user = await User.create(userData);
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};

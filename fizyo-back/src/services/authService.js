import User from '../models/User.js';

// GET /users
export const getAllUsers = async () => {
  const users = await User.find().select('-password'); // şifreyi response'tan çıkar
  return users;
};

// POST /register
export const registerUser = async (email, password, name) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Şifre hash'lemesi burada yapılabilir (opsiyonel)
    const user = await User.create({
        email,
        password,
        name,
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
    };
};

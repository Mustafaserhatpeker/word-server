
import User from '../models/User.js';




export const registerUser = async (email, password, name) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Bu email adresi zaten kayıtlı.');
    }

    
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

import bcrypt from 'bcryptjs';
import User from '../../models/user.js';

const authResolver = {
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User Exists Already');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      const result = await user.save();
      return { ...result._doc, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
};

export default authResolver;

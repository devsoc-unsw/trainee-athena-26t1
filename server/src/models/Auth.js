import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  savedRecipes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    default: [],
  },
});

export default mongoose.model('User', userSchema);
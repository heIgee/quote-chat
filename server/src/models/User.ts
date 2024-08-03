import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  googleId: String,
  displayName: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

export default User;

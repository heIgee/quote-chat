import mongoose, { Schema } from 'mongoose';
// import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new Schema({
  googleId: String,
  displayName: String,
  email: String,
});

// userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

export default User;

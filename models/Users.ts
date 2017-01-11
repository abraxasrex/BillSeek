
import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  username: string,
  password: string,
  starredItems: string [],
  notifications: string []
}
function arrayLimit (val){
  return val.length <= 15;
}
let userSchema = new mongoose.Schema({
  username: {
    type:String,
    required: true,
    minlength: 5,
    maxLength: 14
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 14
  },
  starredItems: {
    type: Array
  },
  notifications: {
    type: Array
    // validate: [arrayLimit, '{PATH} exceeds the limit of 15']
  }
});

export default mongoose.model<IUser>('User', userSchema);


import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  username: string,
  password: string,
  starredItems: string []
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
  }
});

export default mongoose.model<IUser>('User', userSchema);

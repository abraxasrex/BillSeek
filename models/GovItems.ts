import * as mongoose from 'mongoose';

export interface IGovItem extends mongoose.Document {
  type: 'bill' | 'person',
  stars: number,
  apiLocation: string
}

let govItemSchema = new mongoose.Schema({
  type: {
    type:String,
    required: true,
    enum: ['bill','person']
  },
  stars: {
    type: String,
    required: true,
    default: 0
  },
  apiLocation: {
    type: String
  }
});

export default mongoose.model<IGovItem>('GovItem', govItemSchema);

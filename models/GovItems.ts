import * as mongoose from 'mongoose';
//needs to compare to govTrack aPI partner
export interface IGovItem extends mongoose.Document {
//  type: 'bill' | 'person',
  type:string,
  apiLocation: string
  govId: string
}

let govItemSchema = new mongoose.Schema({
  type: {
    type:String,
    required: true,
    enum: ['bill','role']
  },
  apiLocation: {
    type: String,
    required: true
  },
  data: {
    required: true,
    type: Object
  },
  govId: {
    required: true,
    type: String
  }
});

export default mongoose.model<IGovItem>('GovItem', govItemSchema);

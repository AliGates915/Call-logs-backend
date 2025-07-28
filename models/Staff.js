import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String },
  address: { type: String },
  number: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: {
    url: String,
    public_id: String,  
  },
}, { timestamps: true });

const Staff = mongoose.model('Staff', staffSchema);
export default Staff;

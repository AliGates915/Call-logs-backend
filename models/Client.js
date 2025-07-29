import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  businessType: { type: String, required: true },
  companyName: { type: String, required: true },
  companyLogo: {
    url: String,
    public_id: String,
  },
  address: String,
  city: String,
  mobileNumber: String,
  email: String,
  persons: [
    {
      name: String,
      designation: String,
      department: String,
      email: String,
      phoneNumber: String,
    }
  ],
  assignToStaffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  assignToProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);
export default Client;

import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  // Date and Time
  date: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  time: { 
    type: String, 
    required: true 
  },
  
  // Client Information (from Client table)
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },
  personId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },
  designation: { 
    type: String, 
    required: true 
  },
  
  // Product Information
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  
  // Details/Status
  details: { 
    type: String, 
    enum: ['Phone Not Responding', 'Followup Required', 'Not Interested', 'Already Installed'],
    required: true 
  },
  
  // Status
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

const Meeting = mongoose.model('Meeting', meetingSchema);
export default Meeting;

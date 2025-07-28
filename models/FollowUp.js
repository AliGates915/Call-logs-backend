import mongoose from 'mongoose';

const followUpSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },
  customerDescription: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  time: { 
    type: String, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  followUpType: { 
    type: String, 
    enum: ['call', 'meeting', 'email', 'other'],
    default: 'call'
  }
}, { timestamps: true });

const FollowUp = mongoose.model('FollowUp', followUpSchema);
export default FollowUp;

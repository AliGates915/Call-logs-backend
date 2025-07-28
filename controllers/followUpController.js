import FollowUp from '../models/FollowUp.js';
import Client from '../models/Client.js';

// CREATE Follow Up
export const addFollowUp = async (req, res) => {
  try {
    const { customerId, customerDescription, date, time, isActive, followUpType } = req.body;
    
    // Validate that customer exists
    const customer = await Client.findById(customerId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    
    const followUp = new FollowUp({
      customerId,
      customerDescription,
      date,
      time,
      isActive,
      followUpType
    });

    await followUp.save();
    
    // Populate customer details for response
    const populatedFollowUp = await FollowUp.findById(followUp._id)
      .populate('customerId', 'companyName mobileNumber email person');
    
    res.status(201).json({ success: true, data: populatedFollowUp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ All Follow Ups
export const getAllFollowUps = async (req, res) => {
  try {
    const followUps = await FollowUp.find()
      .populate('customerId', 'companyName mobileNumber email person')
      .sort({ date: -1, time: -1 });

    // Format the data for frontend
    const formattedFollowUps = followUps.map(followUp => {
      const customer = followUp.customerId;
      let customerName = 'N/A';
      let customerNumber = 'N/A';

      if (customer) {
        // Get customer name from person.name or companyName
        customerName = customer.person?.name || customer.companyName || 'N/A';
        // Get customer number from mobileNumber or person.phoneNumber
        customerNumber = customer.mobileNumber || customer.person?.phoneNumber || 'N/A';
      }

      return {
        _id: followUp._id,
        customerName,
        customerNumber,
        customerDescription: followUp.customerDescription,
        date: followUp.date.toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        time: followUp.time,
        isActive: followUp.isActive,
        followUpType: followUp.followUpType
      };
    });

    res.status(200).json({ success: true, data: formattedFollowUps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ Single Follow Up
export const getFollowUpById = async (req, res) => {
  try {
    const followUp = await FollowUp.findById(req.params.id)
      .populate('customerId', 'companyName mobileNumber email person');
    
    if (!followUp) {
      return res.status(404).json({ success: false, message: 'Follow Up not found' });
    }

    res.status(200).json({ success: true, data: followUp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE Follow Up
export const updateFollowUp = async (req, res) => {
  try {
    const { customerId, customerDescription, date, time, isActive, followUpType } = req.body;
    
    // Validate that customer exists if customerId is being updated
    if (customerId) {
      const customer = await Client.findById(customerId);
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }
    }
    
    const updatedFollowUp = await FollowUp.findByIdAndUpdate(
      req.params.id,
      {
        customerId,
        customerDescription,
        date,
        time,
        isActive,
        followUpType
      },
      { new: true }
    ).populate('customerId', 'companyName mobileNumber email person');

    if (!updatedFollowUp) {
      return res.status(404).json({ success: false, message: 'Follow Up not found' });
    }

    res.status(200).json({ success: true, data: updatedFollowUp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE Follow Up
export const deleteFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findByIdAndDelete(req.params.id);
    
    if (!followUp) {
      return res.status(404).json({ success: false, message: 'Follow Up not found' });
    }

    res.status(200).json({ success: true, message: 'Follow Up deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Follow Ups by Customer ID
export const getFollowUpsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    // Validate that customer exists
    const customer = await Client.findById(customerId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    
    const followUps = await FollowUp.find({ customerId })
      .populate('customerId', 'companyName mobileNumber email person')
      .sort({ date: -1, time: -1 });

    res.status(200).json({ success: true, data: followUps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Toggle Active Status
export const toggleFollowUpStatus = async (req, res) => {
  try {
    const followUp = await FollowUp.findById(req.params.id);
    
    if (!followUp) {
      return res.status(404).json({ success: false, message: 'Follow Up not found' });
    }

    followUp.isActive = !followUp.isActive;
    await followUp.save();

    const updatedFollowUp = await FollowUp.findById(followUp._id)
      .populate('customerId', 'companyName mobileNumber email person');

    res.status(200).json({ success: true, data: updatedFollowUp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

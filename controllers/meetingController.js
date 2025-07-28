import Meeting from '../models/Meeting.js';
import Client from '../models/Client.js';
import Product from '../models/Product.js';
import Staff from '../models/Staff.js';

// CREATE Meeting
export const addMeeting = async (req, res) => {
  try {
    const { 
      date, 
      time, 
      companyId, 
      personId, 
      designation, 
      productId, 
      details, 
    } = req.body;
    
    // Validate that company exists
    const company = await Client.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    
    // Validate that person exists
    const person = await Client.findById(personId);
    if (!person) {
      return res.status(404).json({ success: false, message: 'Person not found' });
    }
    
    // Validate that product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    const meeting = new Meeting({
      date,
      time,
      companyId,
      personId,
      designation,
      productId,
      details,
    });

    await meeting.save();
    
    // Populate all references for response
    const populatedVisit = await Meeting.findById(meeting._id)
      .populate('companyId', 'companyName businessType')
      .populate('personId', 'person.name person.designation')
      .populate('productId', 'name price')
    
    res.status(201).json({ success: true, data: populatedVisit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ All Market Visits
export const getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate('companyId', 'companyName businessType')
      .populate('personId', 'person.name person.designation')
      .populate('productId', 'name price')
      .sort({ date: -1, time: -1 });

    // Format the data for frontend table
    const formattedVisits = meetings.map((visit, index) => {
      const company = visit.companyId;
      const person = visit.personId;
      const product = visit.productId;

      return {
        sr: index + 1,
        _id: visit._id,
        date: visit.date.toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        client: company?.companyName || 'N/A',
        person: person?.person?.name || 'N/A',
        product: product?.name || 'N/A',
        status: visit.details,
        designation: visit.designation,
        time: visit.time,
      };
    });

    res.status(200).json({ success: true, data: formattedVisits });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ Single Market Visit
export const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('companyId', 'companyName businessType')
      .populate('personId', 'person.name person.designation')
      .populate('productId', 'name price')
    
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Market Visit not found' });
    }

    res.status(200).json({ success: true, data: meeting });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE Market Visit
export const updateMeeting = async (req, res) => {
  try {
    const { 
      date, 
      time, 
      companyId, 
      personId, 
      designation, 
      productId, 
      details, 
    } = req.body;
    
    // Validate references if they're being updated
    if (companyId) {
      const company = await Client.findById(companyId);
      if (!company) {
        return res.status(404).json({ success: false, message: 'Company not found' });
      }
    }
    
    if (personId) {
      const person = await Client.findById(personId);
      if (!person) {
        return res.status(404).json({ success: false, message: 'Person not found' });
      }
    }
    
    if (productId) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
    }
    
    
    const updatedVisit = await Meeting.findByIdAndUpdate(
      req.params.id,
      {
        date,
        time,
        companyId,
        personId,
        designation,
        productId,
        details,
      },
      { new: true }
    ).populate('companyId', 'companyName businessType')
     .populate('personId', 'person.name person.designation')
     .populate('productId', 'name price')

    if (!updatedVisit) {
      return res.status(404).json({ success: false, message: 'Market Visit not found' });
    }

    res.status(200).json({ success: true, data: updatedVisit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE Market Visit
export const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Market Visit not found' });
    }

    res.status(200).json({ success: true, message: 'Market Visit deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Market Visits by Company
export const getMeetingsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    
    const visits = await Meeting.find({ companyId })
      .populate('companyId', 'companyName businessType')
      .populate('personId', 'person.name person.designation')
      .populate('productId', 'name price')
      .sort({ date: -1, time: -1 });

    res.status(200).json({ success: true, data: visits });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

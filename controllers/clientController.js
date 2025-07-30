import Client from '../models/Client.js';
import { cloudinary } from '../config/cloudinary.js';

// Create a new client
export const createClient = async (req, res) => {
  try {
    let companyLogo = {};
    if (req.file) {
      companyLogo = {
        url: req.file.path,         // Cloudinary URL
        public_id: req.file.filename // Cloudinary public_id
      };
    }

    const newClient = new Client({
      ...req.body,
      companyLogo,
      persons: req.body.persons ? JSON.parse(req.body.persons) : [],
      companyWebsite: req.body.companyWebsite, // Explicitly add this line if you want
    });
    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all clients
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find()
      .populate('assignToStaffId')
      .populate('assignToProductId');
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get client by ID
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('assignToStaffId')
      .populate('assignToProductId');
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.status(200).json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update client
export const updateClient = async (req, res) => {
  try {
    let companyLogo = req.body.companyLogo || {};

    // If a new file is uploaded, use its Cloudinary info
    if (req.file) {
      companyLogo = {
        url: req.file.path,         // Cloudinary URL
        public_id: req.file.filename // Cloudinary public_id
      };
    }

    const updateData = {
      ...req.body,
      companyLogo,
      companyWebsite: req.body.companyWebsite, // Explicitly add this line if you want
    };

    if (req.body.persons) {
      updateData.persons = JSON.parse(req.body.persons);
    }

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    res.status(200).json(updatedClient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete client
export const deleteClient = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all clients assigned to the logged-in staff member
export const getAssignedClients = async (req, res) => {
  try {
    // req.user.id should be the staff member's ID (from JWT)
    const staffId = req.user.id;
    console.log(staffId);

    const clients = await Client.find({ assignToStaffId: staffId })
      .populate('assignToProductId') // populate product details
      .populate('assignToStaffId');  // optional: populate staff details

    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

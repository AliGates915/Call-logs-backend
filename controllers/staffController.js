import Staff from '../models/Staff.js';
import bcrypt from 'bcryptjs';
import { cloudinary } from '../config/cloudinary.js';

// CREATE Staff
export const addStaff = async (req, res) => {
  try {
    const { name, department, designation, address, number, email, password } = req.body;



    // Upload image to Cloudinary
    let image = {};
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'staff' });
      image = { url: result.secure_url, public_id: result.public_id };
    }

    const staff = new Staff({
      name,
      department,
      designation,
      address,
      number,
      email,
      password,
      image,
    });

    await staff.save();
    res.status(201).json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ All Staff
export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().select('-password');
    res.status(200).json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ Single Staff
export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).select('-password');
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });
    res.status(200).json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE Staff
export const updateStaff = async (req, res) => {
  try {
    const { name, department, designation, address, number, email, password } = req.body;
    let staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });

    // Handle image update
    let image = staff.image;
    if (req.file) {
      // Delete old image from Cloudinary
      if (image && image.public_id) {
        await cloudinary.uploader.destroy(image.public_id);
      }
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'staff' });
      image = { url: result.secure_url, public_id: result.public_id };
    }


    const updatedFields = {
      name: name ?? staff.name,
      department: department ?? staff.department,
      designation: designation ?? staff.designation,
      address: address ?? staff.address,
      number: number ?? staff.number,
      email: email ?? staff.email,
      password,
      image,
    };

    staff = await Staff.findByIdAndUpdate(req.params.id, updatedFields, { new: true }).select('-password');
    res.status(200).json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE Staff
export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });

    // Delete image from Cloudinary
    if (staff.image && staff.image.public_id) {
      await cloudinary.uploader.destroy(staff.image.public_id);
    }

    await Staff.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Staff deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
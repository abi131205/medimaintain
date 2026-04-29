const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Equipment name is required'],
      trim: true,
    },

    assetTag: {
      type: String,
      required: [true, 'Asset tag is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ['Diagnostic', 'Therapeutic', 'Monitoring', 'Lab', 'Other'],
      default: 'Other',
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    purchaseDate: {
      type: Date,
    },

    warrantyExpiry: {
      type: Date,
    },

    status: {
      type: String,
      enum: ['Active', 'Under Maintenance', 'Retired'],
      default: 'Active',
    },

    notes: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Equipment', equipmentSchema);
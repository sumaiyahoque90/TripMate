const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      index: true
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9+()-\s]{8,20}$/, 'Please enter a valid phone number']
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true
    },
    travelDate: {
      type: Date,
      required: [true, 'Travel date is required']
    },
    travelers: {
      type: Number,
      required: [true, 'Number of travelers is required'],
      min: [1, 'At least 1 traveler is required'],
      max: [50, 'Maximum 50 travelers per standard group']
    },
    packageId: {
      type: String,
      default: 'custom-plan'
    },
    packageName: {
      type: String,
      default: 'Smart Custom Trip Plan'
    },
    totalAmount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'BDT'
    },
    specialRequests: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate human-friendly booking reference if missing
bookingSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    this.bookingReference = `TM-${randomSuffix}`;
  }
  next();
});

module.exports = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

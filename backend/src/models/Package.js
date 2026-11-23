const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    destination: { type: String, required: true },
    destinationId: { type: String, required: true },
    duration: { type: String, required: true },
    durationDays: { type: Number, required: true },
    pricePerPerson: { type: Number, required: true },
    originalPrice: { type: Number },
    currency: { type: String, default: 'BDT' },
    badge: { type: String },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 0 },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    includedServices: [{ type: String }],
    excludedServices: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.models.Package || mongoose.model('Package', packageSchema);

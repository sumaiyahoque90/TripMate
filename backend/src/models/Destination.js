const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    division: { type: String },
    title: { type: String },
    description: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    currency: { type: String, default: 'BDT' },
    durationRecommendation: { type: String },
    bestSeason: { type: String },
    rating: { type: Number, default: 4.5 },
    reviewsCount: { type: Number, default: 0 },
    category: { type: String },
    imageUrl: { type: String, required: true },
    highlights: [{ type: String }],
    costEstimates: {
      transport: Number,
      hotelPerNight: Number,
      foodPerDay: Number,
      activitiesPerDay: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Destination || mongoose.model('Destination', destinationSchema);

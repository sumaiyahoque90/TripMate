const destinationsData = require('../data/destinationsData');

// @desc    Get all Dubai destinations
// @route   GET /api/destinations
const getDestinations = async (req, res, next) => {
  try {
    const { search } = req.query;
    let list = [...destinationsData];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
    }

    res.status(200).json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single attraction by ID
// @route   GET /api/destinations/:id
const getDestinationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = destinationsData.find(d => d.id === id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Attraction "${id}" not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDestinations,
  getDestinationById
};

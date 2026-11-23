const packagesData = require('../data/packagesData');

// @desc    Get all Dubai travel packages
// @route   GET /api/packages
const getPackages = async (req, res, next) => {
  try {
    const { maxPrice, search } = req.query;
    let list = [...packagesData];

    if (maxPrice) {
      list = list.filter(p => p.pricePerPerson <= Number(maxPrice));
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.destination.toLowerCase().includes(q)
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

// @desc    Get package by ID
// @route   GET /api/packages/:id
const getPackageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pkg = packagesData.find(p => p.id === id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: `Package "${id}" not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: pkg
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPackages,
  getPackageById
};

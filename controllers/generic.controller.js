// Get all from db
const getAll = (Model) => async (req, res) => {
  try {
    const info = Model.find();
    const data = await info
      .limit(req.query.limit)
      .skip(req.query.skip * req.query.limit)
      .sort(req.query.sort);
    const totalCount = await Model.countDocuments();
    res.json({
      status: "success",
      message: "Data retrieved successfully",
      data,
      totalCount,
    });
  } catch (err) {
    res.status(500).json({
      status: "failure",
      message: err.message ? err.message : "Internal Server error",
    });
  }
};

//Create One
const createOne = (Model, name) => async (req, res) => {
  try {
    const data = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      message: `${name} created successfully`,
      data,
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message ? err.message : "Internal Server error",
    });
  }
};

module.exports = {
  createOne,
  getAll,
};

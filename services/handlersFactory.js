const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.deleteOne({ _id: id });
    if (!document) {
      return next(new ApiError(`no document for this id ${id}`, 404));
    }
    res.status(204).send("removed");
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`no document for this id ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ data: document });
  });

exports.createNew = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getOne = (Model, populateOptions) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1- build query
    let query = Model.findById(id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    // 2- execute query
    const document = await query;
    if (!document) {
      return next(new ApiError(`no document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.getAllOf = (Model) =>
  asyncHandler(async (req, res) => {
    let filterObj = {};
    if (req.filterObject) {
      filterObj = req.filterObject;
    }
    // build mongoose query
    const apiFeatures = new ApiFeatures(Model.find(filterObj), req.query)
      .filter()
      .paginate(await Model.countDocuments())
      .limitFields()
      .sort()
      .search();
    // execute mongoose query
    const { mongooseQuery, pagination } = apiFeatures;
    const document = await mongooseQuery;
    // .populate({ path: "category", select: "name -_id" });
    res
      .status(200)
      .json({ results: document.length, pagination, data: document });
  });

exports.deactivateUser = (Model) =>
  asyncHandler(async (req, res) => {
    await Model.findByIdAndUpdate(req.params.id, { active: false });
    res.status(201).json({ data: `user deactivated` });
  });

exports.activateUser = (Model) =>
  asyncHandler(async (req, res) => {
    await Model.findByIdAndUpdate(req.params.id, { active: true });
    res.status(201).json({ data: `user activated` });
  });

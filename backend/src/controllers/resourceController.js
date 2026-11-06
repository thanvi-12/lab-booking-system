const service = require("../services/resourceService");
const asyncHandler = require("../utils/asyncHandler");

const createResource = asyncHandler(async (req, res) => {
  const resource = await service.createResource(req.body);

  res.status(201).json({
    success: true,
    message: "Resource created",
    data: resource
  });
});

const getResources = asyncHandler(async (req, res) => {
  const resources = await service.getResources();

  res.status(200).json({
    success: true,
    data: resources
  });
});

const updateResource = asyncHandler(async (req, res) => {
  const resource = await service.updateResource(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Resource updated",
    data: resource
  });
});

const deleteResource = asyncHandler(async (req, res) => {
  const resource = await service.deleteResource(req.params.id);

  res.status(200).json({
    success: true,
    message: "Resource deactivated",
    data: resource
  });
});

module.exports = {
  createResource,
  getResources,
  updateResource,
  deleteResource
};
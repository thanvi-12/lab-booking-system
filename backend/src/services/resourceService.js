const Resource = require("../models/Resource");

const createResource = async (data) => {
  return await Resource.create(data);
};

const getResources = async () => {
  return await Resource.find({ isActive: true });
};

const updateResource = async (id, data) => {
  const resource = await Resource.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  );

  if (!resource) throw new Error("Resource not found");

  return resource;
};

const deleteResource = async (id) => {
  const resource = await Resource.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!resource) throw new Error("Resource not found");

  return resource;
};

module.exports = {
  createResource,
  getResources,
  updateResource,
  deleteResource
};
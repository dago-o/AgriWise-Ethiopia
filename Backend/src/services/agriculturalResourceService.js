import AgriculturalResource from "../models/AgriculturalResource.js";

export const createResourceService = async (resourceData) => {
  const {
    title,
    description,
    resourceType,
    category,
    cropName,
    content,
    videoUrl,
    imageUrl,
    source,
    published,
  } = resourceData;

  return await AgriculturalResource.create({
    title,
    description,
    resourceType,
    category,
    cropName,
    content,
    videoUrl,
    imageUrl,
    source,
    published,
  });
};

export const getResourcesService = async (userRole, filters) => {
  const query = {};

  // Farmers can only see published resources
  if (userRole === "farmer") {
    query.published = true;
  }

  // Optional filters
  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.cropName) {
    query.cropName = filters.cropName;
  }

  if (filters.resourceType) {
    query.resourceType = filters.resourceType;
  }

  return await AgriculturalResource.find(query).sort({ createdAt: -1 });
};

export const getResourceByIdService = async (id, userRole) => {
  const query = { _id: id };

  // Farmers can only access published resources
  if (userRole === "farmer") {
    query.published = true;
  }

  const resource = await AgriculturalResource.findOne(query);

  if (!resource) {
    throw new Error("Agricultural resource not found");
  }

  return resource;
};

export const updateResourceService = async (id, resourceData) => {
  const resource = await AgriculturalResource.findById(id);

  if (!resource) {
    throw new Error("Agricultural resource not found");
  }

  const {
    title,
    description,
    resourceType,
    category,
    cropName,
    content,
    videoUrl,
    imageUrl,
    source,
    published,
  } = resourceData;

  // Only update fields that were provided
  resource.title = title ?? resource.title;
  resource.description = description ?? resource.description;
  resource.resourceType = resourceType ?? resource.resourceType;
  resource.category = category ?? resource.category;
  resource.cropName = cropName ?? resource.cropName;
  resource.content = content ?? resource.content;
  resource.videoUrl = videoUrl ?? resource.videoUrl;
  resource.imageUrl = imageUrl ?? resource.imageUrl;
  resource.source = source ?? resource.source;
  resource.published = published ?? resource.published;

  await resource.save();

  return resource;
};

export const deleteResourceService = async (id) => {
  const resource = await AgriculturalResource.findById(id);

  if (!resource) {
    throw new Error("Agricultural resource not found");
  }

  await AgriculturalResource.findByIdAndDelete(id);

  return resource;
};
import { connectToDatabase } from "../utils/mongodb";
import Part from "../db/models/Part";
import Scene from "../db/models/Scene";
export const getPart = async (partId) => {
  try {
    await connectToDatabase();
    const part = await Part.findById(partId).lean();
    return part;
  } catch (e) {
    throw e;
  }
};
export const getProjectParts = async (projectId) => {
  try {
    await connectToDatabase();
    const part = await Part.find({ project: projectId }).lean();
    return part;
  } catch (e) {
    throw e;
  }
};
export const createPart = async ({ partName, ownerId, projectId }) => {
  try {
    await connectToDatabase();
    const part = new Part({
      name: partName,
      owner: ownerId,
      project: projectId,
    });
    part.save();
    return part;
  } catch (e) {
    throw e;
  }
};

export const deletePart = async (partId) => {
  try {
    await connectToDatabase();
    // first we need to delete the scenes related to this part
    await Scene.deleteMany({ part: partId });
    // Now, delete the part
    const partDeletion = await Part.findByIdAndRemove(partId);
    return partDeletion;
  } catch (e) {
    throw e;
  }
};

export const userOwnsPart = async ({ userId, partId }) => {
  try {
    await connectToDatabase();
    const part = await Part.findById(partId);
    console.log(part.owner, userId);
    return userId.toString() === part.owner.toString();
  } catch (e) {
    throw e;
  }
};

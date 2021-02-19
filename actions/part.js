import { connectToDatabase } from "../utils/mongodb";
import Part from "../db/models/Part";

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

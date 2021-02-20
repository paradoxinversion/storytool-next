import { connectToDatabase } from "../utils/mongodb";
import Scene from "../db/models/Scene";

export const getScene = async (sceneId) => {
  try {
    await connectToDatabase();
    const scene = await Scene.findById(sceneId).lean();
    return scene;
  } catch (e) {
    throw e;
  }
};
export const getPartScenes = async (partId) => {
  try {
    await connectToDatabase();
    const scenes = await Scene.find({ part: partId }).lean();
    return scenes;
  } catch (e) {
    throw e;
  }
};
export const createScene = async ({
  name,
  text,
  ownerId,
  projectId,
  partId,
}) => {
  try {
    await connectToDatabase();
    const scene = new Scene({
      name,
      text,
      owner: ownerId,
      project: projectId,
      part: partId,
    });
    scene.save();
    return scene;
  } catch (e) {
    throw e;
  }
};

export const updateSceneText = async ({ sceneId, sceneText }) => {
  try {
    await connectToDatabase();
    const sceneUpdate = await Scene.findByIdAndUpdate(
      sceneId,
      { text: sceneText },
      { new: true, select: "text" }
    );
    return sceneUpdate;
  } catch (e) {
    throw e;
  }
};
export const getUserScenes = async (userId) => {
  try {
    await connectToDatabase();
    const scenes = await Scene.find({ owner: userId }).populate("project part");

    console.log(scenes);
    return scenes;
  } catch (e) {
    throw e;
  }
};

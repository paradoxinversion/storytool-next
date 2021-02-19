import { connectToDatabase } from "../utils/mongodb";
import Scene from "../db/models/Scene";

export const getScene = async (sceneId) => {
  try {
    await connectToDatabase();
    console.log(sceneId);
    const scene = await Scene.findById(sceneId).lean();
    console.log(scene);
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
    console.log(name, text, ownerId, projectId, partId);
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

import { connectToDatabase } from "../utils/mongodb";
import Project from "../db/models/Project";
import Scene from "../db/models/Scene";
import Part from "../db/models/Part";

export const getProject = async (projectId) => {
  try {
    await connectToDatabase();
    const project = await Project.findById(projectId).lean();
    return project;
  } catch (e) {
    throw e;
  }
};
export const getUserProjects = async (userId) => {
  try {
    await connectToDatabase();
    const projects = await Project.find({ owner: userId }).lean();
    return projects;
  } catch (e) {
    throw e;
  }
};
export const createProject = async ({ projectName, ownerId }) => {
  try {
    await connectToDatabase();
    const project = new Project({
      name: projectName,
      owner: ownerId,
    });
    project.save();
    return project;
  } catch (e) {
    throw e;
  }
};

export const deleteProject = async (projectId) => {
  try {
    await connectToDatabase();
    await Scene.deleteMany({ project: projectId });
    await Part.deleteMany({ project: projectId });
    const projectDeletion = await Project.findByIdAndRemove(projectId);
    return projectDeletion;
  } catch (e) {
    throw e;
  }
};
export const userOwnsProject = async ({ userId, projectId }) => {
  try {
    await connectToDatabase();
    const project = await Project.findById(projectId);
    return userId.toString() === project.owner.toString();
  } catch (e) {
    throw e;
  }
};

export const updateProjectName = async ({ projectId, name }) => {
  try {
    await connectToDatabase();
    const project = await Project.findByIdAndUpdate(projectId, { name }).lean();
    return project;
  } catch (e) {
    throw e;
  }
};

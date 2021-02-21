import { ApolloServer, gql } from "apollo-server-micro";
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import { logInUser, registerUser, returnUser } from "../../actions/user";

import {
  createPart,
  deletePart,
  getPart,
  getProjectParts,
  updatePartName,
  userOwnsPart,
} from "../../actions/part";
import {
  getPartScenes,
  createScene,
  getScene,
  updateSceneText,
  getUserScenes,
  deleteScene,
  userOwnsScene,
  updateSceneName,
} from "../../actions/scene";
import {
  createProject,
  deleteProject,
  getProject,
  getUserProjects,
  updateProjectName,
  userOwnsProject,
} from "../../actions/project";

const verifyToken = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.SECRET);
  } catch {
    return null;
  }
};

const typeDefs = gql`
  type Query {
    sayHello: String
    authorized: User
    projects: [Project]
    project(projectId: String!): Project
    projectParts(projectId: String): [Part]
    part(partId: String!): Part
    partScenes(partId: String!): [Scene]
    scene(sceneId: String!): Scene
    userScenes: [Scene]
  }

  type Mutation {
    login(username: String!, password: String!): AuthenticationResult
    register(username: String!, password: String): AuthenticationResult
    createProject(projectName: String!): CreationResult
    createPart(partName: String, projectId: String!): CreationResult
    createScene(
      sceneName: String
      text: String!
      projectId: String!
      partId: String!
    ): CreationResult
    updateSceneText(text: String!, sceneId: String!): CreationResult
    deleteScene(sceneId: String!): CreationResult
    deletePart(partId: String!): CreationResult
    deleteProject(projectId: String!): CreationResult
    updateProjectName(projectId: String!, projectName: String!): Project
    updatePartName(partId: String!, partName: String!): Part
    updateSceneName(sceneId: String!, sceneName: String!): Scene
  }

  type User {
    _id: String
    username: String
  }

  type Project {
    _id: String
    name: String
    owner: User
  }

  type Part {
    _id: String
    name: String
    project: Project
    owner: User
  }

  type Scene {
    _id: String
    text: String
    name: String
    owner: User
    project: Project
    part: Part
  }
  type AuthenticationResult {
    user: User
    error: String
  }
  """
  CreationResults are used both in creation, modification, and deletion results. Need a better name for them.
  """
  type CreationResult {
    project: Project
    part: Part
    scene: Scene
    error: String
  }
`;

const resolvers = {
  Query: {
    sayHello(parent, args, context) {
      return "Hello World!";
    },
    async authorized(parent, args, context) {
      if (!context.user) {
        return null;
      }
      return await returnUser(context.user.id);
    },
    async project(parent, { projectId }, context) {
      try {
        if (!(await userOwnsProject({ projectId, userId: context.user.id }))) {
          throw new Error("User does not own this Asset.");
        }
        const userProject = await getProject(projectId);
        return userProject;
      } catch (e) {
        throw e;
      }
    },
    async projects(parent, args, context) {
      try {
        const userProjects = await getUserProjects(context.user.id);
        return userProjects;
      } catch (e) {
        throw e;
      }
    },
    async projectParts(parent, { projectId }, context) {
      try {
        if (!(await userOwnsProject({ projectId, userId: context.user.id }))) {
          throw new Error("User does not own this Asset.");
        }
        const parts = await getProjectParts(projectId);
        return parts;
      } catch (e) {
        throw e;
      }
    },
    async part(parent, { partId }, context) {
      try {
        if (!(await userOwnsPart({ partId, userId: context.user.id }))) {
          throw new Error("User does not own this Asset.");
        }
        const part = await getPart(partId);
        return part;
      } catch (e) {
        throw e;
      }
    },
    async partScenes(parent, { partId }, context) {
      try {
        if (!(await userOwnsPart({ partId, userId: context.user.id }))) {
          throw new Error("User does not own this Asset.");
        }
        const parts = await getPartScenes(partId);
        return parts;
      } catch (e) {
        throw e;
      }
    },
    async scene(parent, { sceneId }, context) {
      try {
        if (!(await userOwnsScene({ sceneId, userId: context.user.id }))) {
          throw new Error("User does not own this Asset.");
        }
        const scene = await getScene(sceneId);
        return scene;
      } catch (e) {
        throw e;
      }
    },
    async userScenes(parent, args, context) {
      const scenes = await getUserScenes(context.user.id);
      return scenes;
    },
  },
  Mutation: {
    async register(parent, { username, password }, context) {
      const registrationResult = await registerUser({ username, password });
      if (registrationResult.success) {
        const token = jwt.sign(
          { id: registrationResult.user.id },
          process.env.SECRET
        );
        context.cookies.set("auth-token", token, {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 600000 * 6 * 6, // in ms
          secure: process.env.NODE_ENV === "production",
        });
        return { user: registrationResult.user, error: null };
      } else {
        return { user: null, error: registrationResult.error };
      }
    },
    async login(parent, { username, password }, context) {
      const loggedInUser = await logInUser({ username, password });

      if (loggedInUser.success) {
        const token = jwt.sign(
          { id: loggedInUser.user.id },
          process.env.SECRET
        );
        context.cookies.set("auth-token", token, {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 600000 * 6 * 6, // in ms
          secure: process.env.NODE_ENV === "production",
        });
        return { user: loggedInUser.user, error: null };
      } else {
        return { user: null, error: loggedInUser.error };
      }
    },
    async createProject(parent, { projectName }, context) {
      try {
        const project = await createProject({
          projectName,
          ownerId: context.user.id,
        });
        return { project: project, part: null, scene: null, error: null };
      } catch (e) {
        return { project: null, part: null, scene: null, error: e.message };
      }
    },
    async createPart(parent, { partName, projectId }, context) {
      try {
        if (!(await userOwnsProject({ projectId, userId: context.user.id }))) {
          throw new Error("User does not own this Asset.");
        }
        const part = await createPart({
          partName,
          ownerId: context.user.id,
          projectId,
        });
        return { project: null, part: part, scene: null, error: null };
      } catch (e) {
        return { project: null, part: null, scene: null, error: e.message };
      }
    },
    async createScene(parent, { sceneName, text, projectId, partId }, context) {
      try {
        if (!(await userOwnsProject({ projectId, userId: context.user.id }))) {
          throw new Error("User does not own this Asset.");
        }
        if (!(await userOwnsPart({ partId, userId: context.user.id }))) {
          throw new Error("User does not own this Asset.");
        }
        const scene = await createScene({
          name: sceneName,
          text,
          ownerId: context.user.id,
          projectId,
          partId: partId,
        });
        return { project: null, part: null, scene: scene, error: null };
      } catch (e) {
        return { project: null, part: null, scene: null, error: e.message };
      }
    },
    async updateSceneText(parent, { sceneId, text }, context) {
      try {
        if (!(await userOwnsScene({ sceneId, userId: context.user.id }))) {
          throw new Error("User does not own this Asset.");
        }
        const sceneUpdate = await updateSceneText({ sceneId, sceneText: text });
        return { project: null, part: null, scene: sceneUpdate, error: null };
      } catch (e) {
        return { project: null, part: null, scene: null, error: e.message };
      }
    },
    async deleteScene(parent, { sceneId }, context) {
      try {
        if (!(await userOwnsScene({ sceneId, userId: context.user.id }))) {
          throw new Error("User does not own this Asset.");
        }
        const sceneDeletion = await deleteScene(sceneId);
        return { project: null, part: null, scene: sceneDeletion, error: null };
      } catch (e) {
        return { project: null, part: null, scene: null, error: e.message };
      }
    },
    async deletePart(parent, { partId }, context) {
      try {
        if (!(await userOwnsPart({ partId, userId: context.user.id }))) {
          throw new Error("User does not own this Asset.");
        }
        const partDeletion = await deletePart(partId);
        return { project: null, part: partDeletion, scene: null, error: null };
      } catch (e) {
        return { project: null, part: null, scene: null, error: e.message };
      }
    },
    async deleteProject(parent, { projectId }, context) {
      try {
        if (!(await userOwnsProject({ projectId, userId: context.user.id }))) {
          throw new Error("User does not own this Asset.");
        }
        const projectDeletion = await deleteProject(projectId);
        return {
          project: projectDeletion,
          part: null,
          scene: null,
          error: null,
        };
      } catch (e) {
        return { project: null, part: null, scene: null, error: e.message };
      }
    },
    async updateProjectName(parent, { projectId, projectName }, context) {
      try {
        if (!(await userOwnsProject({ projectId, userId: context.user.id }))) {
          throw new Error("User does not own this Asset.");
        }
        const project = await updateProjectName({
          projectId,
          name: projectName,
        });
        return project;
      } catch (e) {
        throw e;
      }
    },
    async updatePartName(parent, { partId, partName }, context) {
      try {
        if (!(await userOwnsPart({ partId, userId: context.user.id }))) {
          throw new Error("User does not own this Asset.");
        }
        const part = await updatePartName({
          partId,
          name: partName,
        });
        return part;
      } catch (e) {
        throw e;
      }
    },
    async updateSceneName(parent, { sceneId, sceneName }, context) {
      try {
        if (!(await userOwnsScene({ sceneId, userId: context.user.id }))) {
          throw new Error("User does not own this Asset.");
        }
        const scene = await updateSceneName({
          sceneId,
          name: sceneName,
        });
        return scene;
      } catch (e) {
        throw e;
      }
    },
  },
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    const cookies = new Cookies(req, res);
    const token = cookies.get("auth-token");
    const user = verifyToken(token);
    return {
      cookies,
      user,
    };
  },
});
export default apolloServer.createHandler({ path: "/api/graphql" });

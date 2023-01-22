const Project = require("../../models/Project");
const checkAuth = require("../../utils/check-auth");
const { AuthenticationError, UserInputError } = require("apollo-server");
const moment = require("moment");

module.exports = {
  Query: {
    async getProjects(_, __, context) {
      const user = checkAuth(context);
      try {
        const projects = await Project.find({ user: user.id }).sort({
          project_time: -1,
        });

        return projects;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getProject(_, { project_id }, context) {
      const user = checkAuth(context);
      try {
        const project = await Project.findOne({
          user: user.id,
          _id: project_id,
        });
        if (project) {
          return project;
        } else {
          throw new Error("Project not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createProject(
      _,
      { newProjectInput: { project_name, project_description } },
      context
    ) {
      const user = checkAuth(context);

      if (project_name.trim() === "") {
        throw new UserInputError("Project name cannot be empty", {
          errors: {
            project_name: "Project name cannot be empty",
          },
        });
      }

      if (project_description.trim() === "") {
        throw new UserInputError("Project description cannot be empty", {
          errors: {
            project_description: "Project description cannot be empty",
          },
        });
      }

      // Check if project already exists

      const checkproject = await Project.findOne({ project_name });

      if (checkproject) {
        throw new UserInputError("Project with this name already exists", {
          errors: {
            project_name: "Project already exists",
          },
        });
      }

      const newProject = new Project({
        project_name,
        project_description,
        project_status: "Ongoing",
        user: user.id,
        email: user.email,
        project_time: new Date().toISOString(),
      });

      const project = await newProject.save();

      return project;
    },
    async deleteProject(_, { project_id }, context) {
      const user = checkAuth(context);
      // Also check is user created the post

      try {
        const project = await Project.findById(project_id);
        if (user.email === project.email) {
          await project.delete();
          return "Project deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

const { AuthenticationError, UserInputError } = require("apollo-server");
const { validateResourceInput } = require("../../utils/resource-validators");
const checkAuth = require("../../utils/check-auth");
const Project = require("../../models/Project");

module.exports = {
  Query: {
    async getResource(_, { project_id, resource_id }, context) {
      const user = checkAuth(context);
      try {
        const resources = await Project.find({
          user: user.id,
          _id: project_id,
        });

        const resource = resources[0].resources.filter(
          (item) => item._id == resource_id
        );

        if (resource[0]) {
          return resource[0];
        } else {
          throw new Error("Resource not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    createResource: async (
      _,
      {
        project_id,
        newResourceInput: {
          location,
          country,
          state,
          coordinates,
          image_1_description,
          image_2_description,
          image_1_source,
          image_2_source,
          image_1_date,
          image_2_date,
        },
      },
      context
    ) => {
      const user = checkAuth(context);
      const { errors, valid } = validateResourceInput(
        location,
        country,
        state,
        coordinates,
        image_1_description,
        image_2_description,
        image_1_date,
        image_2_date
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const project = await Project.findOne({ user: user.id, _id: project_id });

      if (project) {
        project.resources.unshift({
          email: user.email,
          location,
          country,
          state,
          coordinates,
          image_1_description,
          image_2_description,
          image_1_source,
          image_2_source,
          image_1_date,
          image_2_date,
          resource_time: new Date().toISOString(),
        });
        await project.save();
        return project;
      } else throw new UserInputError("Project not found");
    },
    async deleteResource(_, { project_id, resource_id }, context) {
      const user = checkAuth(context);

      const project = await Project.findById(project_id);

      if (project) {
        const resourceIndex = project.resources.findIndex(
          (c) => c.id === resource_id
        );
        console.log(user.email);

        if (project.email === user.email) {
          project.resources.splice(resourceIndex, 1);
          await project.save();
          return project;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Project not found");
      }
    },
  },
};

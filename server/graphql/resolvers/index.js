const usersResolvers = require("./users_resolvers");
const projectResolvers = require("./project_resolvers");
const resourceResolvers = require("./resource_resolvers");

module.exports = {
  Query: {
    ...usersResolvers.Query,
    ...projectResolvers.Query,
    ...resourceResolvers.Query,
  },

  Mutation: {
    ...usersResolvers.Mutation,
    ...projectResolvers.Mutation,
    ...resourceResolvers.Mutation,
  },
};

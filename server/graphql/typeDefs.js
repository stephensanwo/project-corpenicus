const { gql } = require("apollo-server");

module.exports = gql`
  # Types

  type User {
    id: ID!
    first_name: String!
    last_name: String!
    token: String!
    email: String!
    createdOn: String!
  }

  type Project {
    id: ID!
    project_name: String!
    project_description: String!
    project_time: String!
    project_status: String!
    email: String!
    resources: [Resource]!
  }

  type Resource {
    id: ID!
    email: String!
    location: String!
    country: String!
    state: String!
    coordinates: String!
    image_1_description: String!
    image_2_description: String!
    image_1_source: String
    image_2_source: String
    image_1_date: String!
    image_2_date: String!
    resource_time: String!
  }

  # Inputs

  input RegisterInput {
    first_name: String!
    last_name: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input NewProjectInput {
    project_name: String!
    project_description: String!
  }

  input NewResourceInput {
    location: String!
    country: String!
    state: String!
    coordinates: String!
    image_1_description: String!
    image_2_description: String!
    image_1_source: String
    image_2_source: String
    image_1_date: String!
    image_2_date: String!
  }

  # Queries

  type Query {
    getUsers: [User]
    getProjects: [Project]
    getProject(project_id: ID!): Project
    getResource(project_id: ID!, resource_id: ID!): Resource
  }

  # Mutations

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(loginInput: LoginInput): User!
    createProject(newProjectInput: NewProjectInput): Project!
    deleteProject(project_id: ID!): String!
    createResource(
      project_id: ID!
      newResourceInput: NewResourceInput
    ): Project!
    deleteResource(project_id: ID!, resource_id: ID!): Project!
  }
`;

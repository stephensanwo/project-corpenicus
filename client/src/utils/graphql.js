import { gql } from "@apollo/client";

export const GET_PROJECTS = gql`
  query {
    getProjects {
      id
      project_name
      project_time
      project_description
      project_status
      email
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation createProject(
    $project_name: String!
    $project_description: String!
  ) {
    createProject(
      newProjectInput: {
        project_name: $project_name
        project_description: $project_description
      }
    ) {
      id
      project_name
      project_time
      project_description
      project_status
    }
  }
`;

export const GET_PROJECT = gql`
  query getProject($project_id: ID!) {
    getProject(project_id: $project_id) {
      id
      project_name
      resources {
        id
        location
        state
        country
        coordinates
        location
        resource_time
        image_1_source
        image_2_source
        image_1_date
        image_2_date
      }
    }
  }
`;

export const CREATE_RESOURCE = gql`
  mutation createResource(
    $project_id: ID!
    $location: String!
    $state: String!
    $country: String!
    $coordinates: String!
    $image_1_description: String!
    $image_2_description: String!
    $image_1_source: String!
    $image_2_source: String!
    $image_1_date: String!
    $image_2_date: String!
  ) {
    createResource(
      project_id: $project_id
      newResourceInput: {
        location: $location
        state: $state
        country: $country
        coordinates: $coordinates
        image_1_description: $image_1_description
        image_2_description: $image_2_description
        image_1_source: $image_1_source
        image_2_source: $image_2_source
        image_1_date: $image_1_date
        image_2_date: $image_2_date
      }
    ) {
      id
      project_name
      project_time
      project_description
      project_status
      resources {
        id
        location
        state
        country
        coordinates
        resource_time
        image_1_description
        image_2_description
        image_1_source
        image_2_source
        image_1_date
        image_2_date
      }
    }
  }
`;

export const GET_RESOURCE = gql`
  query getResource($project_id: ID!, $resource_id: ID!) {
    getResource(project_id: $project_id, resource_id: $resource_id) {
      id
      location
      state
      country
      coordinates
      location
      resource_time
      image_1_source
      image_2_source
      image_1_date
      image_2_date
      image_1_description
      image_2_description
    }
  }
`;

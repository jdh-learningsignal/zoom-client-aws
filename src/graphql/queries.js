/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTraffic = /* GraphQL */ `
  query GetTraffic($id: ID!) {
    getTraffic(id: $id) {
      id
      studentId
      meetingId
      state
      dateTime
      createdAt
      updatedAt
    }
  }
`;
export const listTraffics = /* GraphQL */ `
  query ListTraffics(
    $filter: ModelTrafficFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTraffics(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        studentId
        meetingId
        state
        dateTime
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getFile = /* GraphQL */ `
  query GetFile($id: ID!) {
    getFile(id: $id) {
      id
      name
      hash
      createdAt
      updatedAt
    }
  }
`;
export const listFiles = /* GraphQL */ `
  query ListFiles(
    $filter: ModelFileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        hash
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

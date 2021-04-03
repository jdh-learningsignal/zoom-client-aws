/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTraffic = /* GraphQL */ `
  query GetTraffic($id: ID!) {
    getTraffic(id: $id) {
      id
      studentId
      meetingId
      state
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

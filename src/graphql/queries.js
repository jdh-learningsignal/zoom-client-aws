/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTraffic = /* GraphQL */ `
  query GetTraffic($id: ID!) {
    getTraffic(id: $id) {
      id
      studentId
      affiliation
      meetingId
      hash
      pageNumber
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
        affiliation
        meetingId
        hash
        pageNumber
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
      uploadedTime
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
        uploadedTime
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPage = /* GraphQL */ `
  query GetPage($id: ID!) {
    getPage(id: $id) {
      id
      hash
      numPages
      pageNumber
      finishedTime
      createdAt
      updatedAt
    }
  }
`;
export const listPages = /* GraphQL */ `
  query ListPages(
    $filter: ModelPageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        hash
        numPages
        pageNumber
        finishedTime
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

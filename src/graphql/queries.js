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
export const getAttendance = /* GraphQL */ `
  query GetAttendance($id: ID!) {
    getAttendance(id: $id) {
      id
      hash
      meetingId
      userName
      studentId
      affiliation
      state
      device
      dateTime
      createdAt
      updatedAt
    }
  }
`;
export const listAttendances = /* GraphQL */ `
  query ListAttendances(
    $filter: ModelAttendanceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAttendances(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        hash
        meetingId
        userName
        studentId
        affiliation
        state
        device
        dateTime
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTraffics = /* GraphQL */ `
  query GetTraffics($id: ID!) {
    getTraffics(id: $id) {
      id
      studentId
      affiliation
      hash
      pageNumber
      state
      createdAt
      updatedAt
    }
  }
`;
export const listTrafficss = /* GraphQL */ `
  query ListTrafficss(
    $filter: ModelTrafficsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTrafficss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        studentId
        affiliation
        hash
        pageNumber
        state
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getFiles = /* GraphQL */ `
  query GetFiles($id: ID!) {
    getFiles(id: $id) {
      id
      name
      hash
      createdAt
      updatedAt
    }
  }
`;
export const listFiless = /* GraphQL */ `
  query ListFiless(
    $filter: ModelFilesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFiless(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
export const getPages = /* GraphQL */ `
  query GetPages($id: ID!) {
    getPages(id: $id) {
      id
      hash
      numPages
      pageNumber
      createdAt
      updatedAt
    }
  }
`;
export const listPagess = /* GraphQL */ `
  query ListPagess(
    $filter: ModelPagesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPagess(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        hash
        numPages
        pageNumber
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAttendances = /* GraphQL */ `
  query GetAttendances($id: ID!) {
    getAttendances(id: $id) {
      id
      hash
      meetingId
      userName
      studentId
      affiliation
      state
      device
      createdAt
      updatedAt
    }
  }
`;
export const listAttendancess = /* GraphQL */ `
  query ListAttendancess(
    $filter: ModelAttendancesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAttendancess(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        hash
        meetingId
        userName
        studentId
        affiliation
        state
        device
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCurrentPages = /* GraphQL */ `
  query GetCurrentPages($id: ID!) {
    getCurrentPages(id: $id) {
      id
      hash
      pageNumber
      createdAt
      updatedAt
    }
  }
`;
export const listCurrentPagess = /* GraphQL */ `
  query ListCurrentPagess(
    $filter: ModelCurrentPagesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCurrentPagess(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        hash
        pageNumber
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTrafficsArchive = /* GraphQL */ `
  query GetTrafficsArchive($id: ID!) {
    getTrafficsArchive(id: $id) {
      id
      studentId
      affiliation
      hash
      pageNumber
      state
      createdAt
      updatedAt
    }
  }
`;
export const listTrafficsArchives = /* GraphQL */ `
  query ListTrafficsArchives(
    $filter: ModelTrafficsArchiveFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTrafficsArchives(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        studentId
        affiliation
        hash
        pageNumber
        state
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTrafficsArchives = /* GraphQL */ `
  query GetTrafficsArchives($id: ID!) {
    getTrafficsArchives(id: $id) {
      id
      studentId
      affiliation
      hash
      pageNumber
      state
      originId
      originCreatedAt
      createdAt
      updatedAt
    }
  }
`;
export const listTrafficsArchivess = /* GraphQL */ `
  query ListTrafficsArchivess(
    $filter: ModelTrafficsArchivesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTrafficsArchivess(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        studentId
        affiliation
        hash
        pageNumber
        state
        originId
        originCreatedAt
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

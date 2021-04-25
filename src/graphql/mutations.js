/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTraffic = /* GraphQL */ `
  mutation CreateTraffic(
    $input: CreateTrafficInput!
    $condition: ModelTrafficConditionInput
  ) {
    createTraffic(input: $input, condition: $condition) {
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
export const updateTraffic = /* GraphQL */ `
  mutation UpdateTraffic(
    $input: UpdateTrafficInput!
    $condition: ModelTrafficConditionInput
  ) {
    updateTraffic(input: $input, condition: $condition) {
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
export const deleteTraffic = /* GraphQL */ `
  mutation DeleteTraffic(
    $input: DeleteTrafficInput!
    $condition: ModelTrafficConditionInput
  ) {
    deleteTraffic(input: $input, condition: $condition) {
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
export const createFile = /* GraphQL */ `
  mutation CreateFile(
    $input: CreateFileInput!
    $condition: ModelFileConditionInput
  ) {
    createFile(input: $input, condition: $condition) {
      id
      name
      hash
      uploadedTime
      createdAt
      updatedAt
    }
  }
`;
export const updateFile = /* GraphQL */ `
  mutation UpdateFile(
    $input: UpdateFileInput!
    $condition: ModelFileConditionInput
  ) {
    updateFile(input: $input, condition: $condition) {
      id
      name
      hash
      uploadedTime
      createdAt
      updatedAt
    }
  }
`;
export const deleteFile = /* GraphQL */ `
  mutation DeleteFile(
    $input: DeleteFileInput!
    $condition: ModelFileConditionInput
  ) {
    deleteFile(input: $input, condition: $condition) {
      id
      name
      hash
      uploadedTime
      createdAt
      updatedAt
    }
  }
`;
export const createPage = /* GraphQL */ `
  mutation CreatePage(
    $input: CreatePageInput!
    $condition: ModelPageConditionInput
  ) {
    createPage(input: $input, condition: $condition) {
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
export const updatePage = /* GraphQL */ `
  mutation UpdatePage(
    $input: UpdatePageInput!
    $condition: ModelPageConditionInput
  ) {
    updatePage(input: $input, condition: $condition) {
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
export const deletePage = /* GraphQL */ `
  mutation DeletePage(
    $input: DeletePageInput!
    $condition: ModelPageConditionInput
  ) {
    deletePage(input: $input, condition: $condition) {
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

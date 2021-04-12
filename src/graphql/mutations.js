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
      meetingId
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
      meetingId
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
      meetingId
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
      createdAt
      updatedAt
    }
  }
`;

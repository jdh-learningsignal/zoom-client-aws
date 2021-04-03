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
      createdAt
      updatedAt
    }
  }
`;

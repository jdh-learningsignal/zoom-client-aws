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
export const createAttendance = /* GraphQL */ `
  mutation CreateAttendance(
    $input: CreateAttendanceInput!
    $condition: ModelAttendanceConditionInput
  ) {
    createAttendance(input: $input, condition: $condition) {
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
export const updateAttendance = /* GraphQL */ `
  mutation UpdateAttendance(
    $input: UpdateAttendanceInput!
    $condition: ModelAttendanceConditionInput
  ) {
    updateAttendance(input: $input, condition: $condition) {
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
export const deleteAttendance = /* GraphQL */ `
  mutation DeleteAttendance(
    $input: DeleteAttendanceInput!
    $condition: ModelAttendanceConditionInput
  ) {
    deleteAttendance(input: $input, condition: $condition) {
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
export const createTraffics = /* GraphQL */ `
  mutation CreateTraffics(
    $input: CreateTrafficsInput!
    $condition: ModelTrafficsConditionInput
  ) {
    createTraffics(input: $input, condition: $condition) {
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
export const updateTraffics = /* GraphQL */ `
  mutation UpdateTraffics(
    $input: UpdateTrafficsInput!
    $condition: ModelTrafficsConditionInput
  ) {
    updateTraffics(input: $input, condition: $condition) {
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
export const deleteTraffics = /* GraphQL */ `
  mutation DeleteTraffics(
    $input: DeleteTrafficsInput!
    $condition: ModelTrafficsConditionInput
  ) {
    deleteTraffics(input: $input, condition: $condition) {
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
export const createFiles = /* GraphQL */ `
  mutation CreateFiles(
    $input: CreateFilesInput!
    $condition: ModelFilesConditionInput
  ) {
    createFiles(input: $input, condition: $condition) {
      id
      name
      hash
      createdAt
      updatedAt
    }
  }
`;
export const updateFiles = /* GraphQL */ `
  mutation UpdateFiles(
    $input: UpdateFilesInput!
    $condition: ModelFilesConditionInput
  ) {
    updateFiles(input: $input, condition: $condition) {
      id
      name
      hash
      createdAt
      updatedAt
    }
  }
`;
export const deleteFiles = /* GraphQL */ `
  mutation DeleteFiles(
    $input: DeleteFilesInput!
    $condition: ModelFilesConditionInput
  ) {
    deleteFiles(input: $input, condition: $condition) {
      id
      name
      hash
      createdAt
      updatedAt
    }
  }
`;
export const createPages = /* GraphQL */ `
  mutation CreatePages(
    $input: CreatePagesInput!
    $condition: ModelPagesConditionInput
  ) {
    createPages(input: $input, condition: $condition) {
      id
      hash
      numPages
      pageNumber
      createdAt
      updatedAt
    }
  }
`;
export const updatePages = /* GraphQL */ `
  mutation UpdatePages(
    $input: UpdatePagesInput!
    $condition: ModelPagesConditionInput
  ) {
    updatePages(input: $input, condition: $condition) {
      id
      hash
      numPages
      pageNumber
      createdAt
      updatedAt
    }
  }
`;
export const deletePages = /* GraphQL */ `
  mutation DeletePages(
    $input: DeletePagesInput!
    $condition: ModelPagesConditionInput
  ) {
    deletePages(input: $input, condition: $condition) {
      id
      hash
      numPages
      pageNumber
      createdAt
      updatedAt
    }
  }
`;
export const createAttendances = /* GraphQL */ `
  mutation CreateAttendances(
    $input: CreateAttendancesInput!
    $condition: ModelAttendancesConditionInput
  ) {
    createAttendances(input: $input, condition: $condition) {
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
export const updateAttendances = /* GraphQL */ `
  mutation UpdateAttendances(
    $input: UpdateAttendancesInput!
    $condition: ModelAttendancesConditionInput
  ) {
    updateAttendances(input: $input, condition: $condition) {
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
export const deleteAttendances = /* GraphQL */ `
  mutation DeleteAttendances(
    $input: DeleteAttendancesInput!
    $condition: ModelAttendancesConditionInput
  ) {
    deleteAttendances(input: $input, condition: $condition) {
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
export const createCurrentLectures = /* GraphQL */ `
  mutation CreateCurrentLectures(
    $input: CreateCurrentLecturesInput!
    $condition: ModelCurrentLecturesConditionInput
  ) {
    createCurrentLectures(input: $input, condition: $condition) {
      id
      hash
      pageNumber
      affiliation
      name
      profName
      meetingId
      createdAt
      updatedAt
    }
  }
`;
export const updateCurrentLectures = /* GraphQL */ `
  mutation UpdateCurrentLectures(
    $input: UpdateCurrentLecturesInput!
    $condition: ModelCurrentLecturesConditionInput
  ) {
    updateCurrentLectures(input: $input, condition: $condition) {
      id
      hash
      pageNumber
      affiliation
      name
      profName
      meetingId
      createdAt
      updatedAt
    }
  }
`;
export const deleteCurrentLectures = /* GraphQL */ `
  mutation DeleteCurrentLectures(
    $input: DeleteCurrentLecturesInput!
    $condition: ModelCurrentLecturesConditionInput
  ) {
    deleteCurrentLectures(input: $input, condition: $condition) {
      id
      hash
      pageNumber
      affiliation
      name
      profName
      meetingId
      createdAt
      updatedAt
    }
  }
`;
export const createTrafficsArchive = /* GraphQL */ `
  mutation CreateTrafficsArchive(
    $input: CreateTrafficsArchiveInput!
    $condition: ModelTrafficsArchiveConditionInput
  ) {
    createTrafficsArchive(input: $input, condition: $condition) {
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
export const updateTrafficsArchive = /* GraphQL */ `
  mutation UpdateTrafficsArchive(
    $input: UpdateTrafficsArchiveInput!
    $condition: ModelTrafficsArchiveConditionInput
  ) {
    updateTrafficsArchive(input: $input, condition: $condition) {
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
export const deleteTrafficsArchive = /* GraphQL */ `
  mutation DeleteTrafficsArchive(
    $input: DeleteTrafficsArchiveInput!
    $condition: ModelTrafficsArchiveConditionInput
  ) {
    deleteTrafficsArchive(input: $input, condition: $condition) {
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
export const createTrafficsArchives = /* GraphQL */ `
  mutation CreateTrafficsArchives(
    $input: CreateTrafficsArchivesInput!
    $condition: ModelTrafficsArchivesConditionInput
  ) {
    createTrafficsArchives(input: $input, condition: $condition) {
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
export const updateTrafficsArchives = /* GraphQL */ `
  mutation UpdateTrafficsArchives(
    $input: UpdateTrafficsArchivesInput!
    $condition: ModelTrafficsArchivesConditionInput
  ) {
    updateTrafficsArchives(input: $input, condition: $condition) {
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
export const deleteTrafficsArchives = /* GraphQL */ `
  mutation DeleteTrafficsArchives(
    $input: DeleteTrafficsArchivesInput!
    $condition: ModelTrafficsArchivesConditionInput
  ) {
    deleteTrafficsArchives(input: $input, condition: $condition) {
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

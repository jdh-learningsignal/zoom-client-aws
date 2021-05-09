const axios = require("axios");
const gql = require("graphql-tag");
const graphql = require("graphql");
const { print } = graphql;

const API_URL =
    "https://qf2bjn3cbrefton7n7vple6l5e.appsync-api.ap-northeast-2.amazonaws.com/graphql";
const API_KEY = "da2-j5ymrnchmjaxhesdhnqpddx3y4";

const listTrafficss = gql`
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

const createTrafficsArchives = gql`
    mutation createTrafficsArchives($input: CreateTrafficsArchivesInput!) {
        createTrafficsArchives(input: $input) {
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

exports.handler = async (event) => {
    try {
        let items = [];
        let nextToken = null;

        while (true) {
            let apiData;

            if (nextToken) {
                apiData = await axios({
                    url: API_URL,
                    method: "post",
                    headers: {
                        "x-api-key": API_KEY,
                    },
                    data: {
                        query: print(listTrafficss),
                        variables: {
                            nextToken: nextToken,
                        },
                    },
                });
            } else {
                apiData = await axios({
                    url: API_URL,
                    method: "post",
                    headers: {
                        "x-api-key": API_KEY,
                    },
                    data: {
                        query: print(listTrafficss),
                    },
                });
            }

            items = [...items, ...apiData.data.data.listTrafficss.items];
            nextToken = apiData.data.data.listTrafficss.nextToken;

            if (!nextToken) break;
        }

        try {
            console.log("items: ", items);

            items.forEach(async (element) => {
                const result = await axios({
                    url: API_URL,
                    method: "post",
                    headers: {
                        "x-api-key": API_KEY,
                    },
                    data: {
                        query: print(createTrafficsArchives),
                        variables: {
                            input: {
                                studentId: element.studentId,
                                affiliation: element.affiliation,
                                hash: element.hash,
                                pageNumber: element.pageNumber,
                                state: element.state,
                                originId: element.id,
                                originCreatedAt: element.createdAt,
                            },
                        },
                    },
                });
                console.log(result);
            });
        } catch (err) {
            console.log("error to appsync: ", err);
        }

        const body = {
            message: "successfully created traffics!",
            items: items,
        };

        return {
            statusCode: 200,
            body: JSON.stringify(body),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
        };
    } catch (err) {
        console.log("error to appsync: ", err);
    }
};

import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { 
    createTrafficsArchives as createTrafficsArchivesMutation, 
} from './graphql/mutations';
import { listTrafficss } from './graphql/queries';

const Archive = () => {
    const [result, setResult] = useState("");
    const { hash } = useParams();

    useEffect(() => {
        archiveTrafficss();
    }, []);

    const archiveTrafficss = async () => {
        let items = [];
        let nextToken = null;

        while (true) {
            let apiData;

            if (nextToken) {
                apiData = await API.graphql({
                    query: listTrafficss,
                    variables: {
                        nextToken: nextToken,
                    },
                });
            } else {
                apiData = await API.graphql({
                    query: listTrafficss,
                    variables: {
                    },
                });
            }

            items = [...items, ...apiData.data.listTrafficss.items];
            nextToken = apiData.data.listTrafficss.nextToken;

            if (!nextToken) break;
        }

        items.forEach(async (element) => {
            await API.graphql({ 
                query: createTrafficsArchivesMutation, 
                variables: { 
                    input: {
                        studentId: String(element.studentId),
                        affiliation: String(element.affiliation),
                        hash: String(element.hash),
                        pageNumber: Number(element.pageNumber),
                        state: String(element.state),
                        originId: String(element.id),
                        originCreatedAt: String(element.createdAt),
                    },
                } 
            }).catch((err) => {
                console.log(err);
            });
        });
    };

    return (
        <div className="App">
            <h1>{result}</h1>
        </div>
    );
};

export default withAuthenticator(Archive);

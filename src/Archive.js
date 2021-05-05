import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";

const Archive = () => {
    const [result, setResult] = useState("");

    const callApi = async () => {
        const apiResult = await API.get("archivingtraffics", "/archive", {});
        console.log(apiResult);
        setResult(apiResult.message);
    };

    useEffect(() => {
        callApi();
    }, []);

    return (
        <div className="App">
            <h1>{result}</h1>
        </div>
    );
};

export default withAuthenticator(Archive);

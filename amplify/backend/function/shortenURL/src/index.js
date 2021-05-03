const { default: axios } = require("axios");

const client_id = '7pQYtV_au9iewBtjLqW9';
const client_secret = '8IEuvLlN7C';
const api_url = 'https://openapi.naver.com/v1/util/shorturl';

exports.handler = async (event) => {
    const options = {
        method: 'get',
        url: api_url,
        data: {
            'url': "www.naver.com"
        },
        headers: {
            'X-Naver-Client-Id': client_id, 
            'X-Naver-Client-Secret': client_secret}
    };

    const result = await axios(config);

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        }, 
        body: JSON.stringify(result),
    };
    
    return response;
};

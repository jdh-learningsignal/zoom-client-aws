import axios from 'axios';

const naverAPI = {
    shortenURL: async (url) => {
        const config = {
            method: 'get',
            url: 'https://1no99guab7.execute-api.ap-northeast-2.amazonaws.com/default/shortenURL-staging/shortenURL',
            params: {
                'url': url
            },
            headers: {
                'x-api-key': 'vErJMHsgX56uxrh3D7dVY6sgMrfbsOyM7pPvTTGd'
            }
        };

        console.log("before result");
        
        const result = await axios(config);

        console.log("after result");
        console.log(result);

        return result;
    }
};

export default naverAPI;
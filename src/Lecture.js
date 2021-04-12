import { React, Fragment, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from "styled-components";
import './Lecture.css';
import { Storage } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react'
// import { Document, Page } from 'react-pdf';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

const Lecture = () => {
    const { hash } = useParams();
    const [file, setFile] = useState('');

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        fetchFile();
    }, []);

    const fetchFile = async () => {
        const file = await Storage.get(hash);
        setFile(file);
    };

    const onDocumentLoadSuccess = async ({ numPages }) => {
        setNumPages(numPages);
    }

    return (
        <Fragment>
            <div>
                <Document
                    file="https://lecture113543-staging.s3.ap-northeast-2.amazonaws.com/public/7745f99c670c9d4d0c34210e4a9b884f942c83621ecb92c5548d3d3fe7c80a1a?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA2KLJ5TB32VCIPFWQ%2F20210412%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20210412T032400Z&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaDmFwLW5vcnRoZWFzdC0yIkYwRAIgNAwatSzbxN7RRjawdCFNJ9hzxBoKfm7xNcuiL0G0DqYCIEHTnmG2P9G0dtKUHyoTPoZJ%2Bd9mAPVO%2BxS9Yb3LU82TKusECLX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNzA5NDI4NjE1Mjg3IgwwtcTqba4F%2BXPkSekqvwQyhYXv4fOP6jx4LuyCUZv0z33wNA3PbRpHcuFmekKpYrLfznTfjbb%2BGOAUnspR5k1kIpb0ExDcF88kGTBFaRLad%2F4xWb7xcEzcKc8FiBSp0vmF%2FL5oHGUBr2BlT0vVyJFUXZhajUeUUxKEUuCe6Ccgu4z6xb34T%2BCkng9I6CULF59urAAkYu8avEDLWZLC8cVJT48CKLTFtTHVDTMJL7NxlLQ%2BPrjYIke9zzP26V00Zup2Xe2juJolmi4TqOUjxmOofkna7Dc7pl2Cf5NZCxYO5aU3JfrGVbrgbf1IbwnnEWFvAOCvsei9JcyrOrSoHbsIomy8uKNkSWAAVFE%2FegASMMx2NypC6dOWbv6WEEDXsvsl%2FAbhVTnZYZtNp3RncbCMI8tK2cYihZpcIG324BP0fIpIf5%2BdQjlXsG4g87hTS7GoNlIbBpUyMkcyElrVbdaF8MiAcBrWBmq60cw02FdjCPH1WpThLibgN99sySGmbzxyjUb%2FA0ZT9EB30Stwo5x5mKKHEyYm5VobQX7UAAD1hbUazI%2Ftp0khROPbxNDxAvOs2YfggkPcNgMBbne9wOXFLl%2FWkqB2rr75PopW7mCQogK%2BW5FtTnXFLEYZslccpsLvXujQl5lizWfdbZ6lS6oQgIPsZ37hkpJwiROSTQoQ1ZTkGpXvq4HF7Vx6kQylEp9Dx4rEjoqRNdO9OHJSdReZWS1cjioIYB9yzOwuh8ZaR%2Fi3N5y7%2Bs2wUqv2DTBvRHFVU4Y8lik3WiTnIuk9RjCg%2Bs6DBjqGAhZ8%2B41XtvIfgyAEsJHafXaTtGfOn6NzUjMhhPQcfioL8ICCqEnytkZ5sc3zvbeiUnH%2BQF9BM7UomqM1u7F1DtC2TVnE6M2pPnj33b2r8Sgb%2BRLwFpgwdnuEtGBEZtrd%2FBk2sWk82r%2BPBv4CZYlRd00VSzgxUQtLHdH%2Fb1ABGS2DLUSGdPISJl7U306kfa3HZTv4qVRoTX4Ac4QXBd8lrIxezMoTKKI681FrZd07qRBaf8hcCGlNTlWotoju6SDAiyY%2BPUvqHSqIlGYW9R6QnE4%2BSlTcPvD7%2F582hyjZr05TVOMA6GPlQKsh6byQveZGYaHYaEIpdQdVJAqlCgaAP27MelW18Z8%3D&X-Amz-Signature=7dcf0ee7a4b3e229106550b63ae247d383b3aed7ac17273dc772c74ae02b9131&X-Amz-SignedHeaders=host&x-amz-user-agent=aws-sdk-js%2F3.6.1%20os%2FmacOS%2F11.2.2%20lang%2Fjs%20md%2Fbrowser%2FChrome_89.0.4389.114%20api%2Fs3%2F3.6.1%20aws-amplify%2F3.8.20_js&x-id=GetObject"
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page pageNumber={pageNumber} />
                </Document>
                <p>Page {pageNumber} of {numPages}</p>
                <div>{file}</div>
            </div>
        </Fragment>
    );
};

export default withAuthenticator(Lecture);
import { React, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from "styled-components";
import './Lecture.css';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { Chart } from "react-google-charts";
import { Container, Col, Row } from 'react-bootstrap';
import { createPage as createPageMutation} from './graphql/mutations';
import { listPages } from './graphql/queries';

const Lecture = () => {
    const { hash } = useParams();
    const [file, setFile] = useState('');
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.1);
    const [pageDatas, setPageDatas] = useState(null);

    useEffect(() => {
        fetchFile();
    }, []);

    const fetchFile = async () => {
        const file = await Storage.get(hash);
        setFile(file);
    };

    const fetchPageDatas = async () => {
        const apiData = await API.graphql({ 
            query: listPages,
            variables: {
                filter: {
                    hash: {
                        eq: hash
                    }
                }
            }
        });
        setPageDatas(apiData.data.listPages.items.map(
            (value) => {
                return [value.pageNumber, value.finishedTime];
            })
        );

        console.log(apiData.data.listPages.items.map(
            (value) => {
                return [value.pageNumber, value.finishedTime];
            }))
    };

    const onDocumentLoadSuccess = async ({ numPages }) => {
        setNumPages(numPages);
    };

    const onPrevPage = async () => {
        if (pageNumber <= 1) return;
        setPageNumber(pageNumber - 1);
    };

    const onNextPage = async () => {
        if (pageNumber >= numPages) return;
        setPageNumber(pageNumber + 1);

        // insert Page
        if (!hash || !numPages || !pageNumber) return;
        await API.graphql({ 
          query: createPageMutation, 
          variables: { 
            input: {
                hash: hash, 
                numPages: numPages,
                pageNumber: pageNumber,
                finishedTime: new Date()
            }
          } 
        });
        fetchPageDatas();
    };

    const PageButton = styled.button`
        position:relative;
        display:block; 
        width:40px; 
        height:40px; 
        text-align:center; 
        line-height:40px; 
        border : 1px solid #000;
        text-decoration:none;
        color: #000;
        transition: all  0.3s;

        &:active {
            top:5px;
            left:5px;
        }

        &:active:after {
            border:0;
        }
    `;

    return (
        <>
            <Container>
                <Row>
                    <Col sm={9} lg={true}>
                        <Document
                            file={file}
                            onLoadSuccess={onDocumentLoadSuccess}
                        >
                            <Page 
                                pageNumber={pageNumber}
                                scale={scale}
                            />
                        </Document>
                        <div>{pageNumber} / {numPages}</div>
                        <PageButton onClick={onPrevPage}>&lt;</PageButton>
                        <PageButton onClick={onNextPage}>&gt;</PageButton>
                    </Col>
                    <Col sm={3}>
                        <Chart
                            width={'400px'}
                            height={'300px'}
                            chartType="PieChart"
                            loader={<div>Loading...</div>}
                            data={[
                                ['응답', '횟수'],
                                ['어려워요', 45],
                                ['알겠어요', 34]
                            ]}
                            options={{
                                title: '총 응답',
                            }}
                        />
                        <Chart
                            width={'400px'}
                            height={'300px'}
                            chartType="PieChart"
                            loader={<div>Loading...</div>}
                            data={[
                                ['응답', '횟수'],
                                ['어려워요', 11],
                                ['알겠어요', 2]
                            ]}
                            options={{
                                title: '이전 슬라이드 응답',
                            }}
                        />
                        <Chart
                            width={'500px'}
                            height={'350px'}
                            chartType="LineChart"
                            loader={<div>Loading...</div>}
                            data={[
                                ['x', '어려워요', '알겠어요'],
                                [0, 0, 0],
                                [1, 10, 5],
                                [2, 23, 15],
                                [3, 17, 9],
                                [4, 18, 10],
                                [5, 9, 5],
                                [6, 11, 3],
                                [7, 27, 19]
                            ]}
                            options={{
                                hAxis: {
                                    title: '페이지'
                                },
                                vAxis: {
                                    title: '페이지 별 응답 변화 추이'
                                }
                            }}
                        />
                        <div>{pageDatas}</div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default withAuthenticator(Lecture);
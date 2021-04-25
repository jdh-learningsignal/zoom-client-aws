import { React, useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import jwt from 'jsonwebtoken';
import { useParams } from 'react-router-dom';
import styled from "styled-components";
import './Lecture.css';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { Chart } from "react-google-charts";
import { Container, Col, Row } from 'react-bootstrap';
import { createPage as createPageMutation} from './graphql/mutations';
import { listTraffics } from './graphql/queries';
import { createHmac } from 'crypto';
import config from './config';
import axios from 'axios';

import AdminContext from './contexts/admin';

const url = window.location.origin;

const payload = {
    iss: config.apiKey,
    exp: ((new Date()).getTime() + 5000)
};

const token = jwt.sign(payload, config.apiSecret);

const Lecture = () => {
    const context = useContext(AdminContext);
    const { hash } = useParams();
    const [file, setFile] = useState('');
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [traffics, setTraffics] = useState([[1, 0, 0]]);
    const [totalReds, setTotalReds] = useState(0);
    const [totalGreens, setTotalGreens] = useState(0);
    const [prevReds, setPrevReds] = useState(0);
    const [prevGreens, setPrevGreens] = useState(0);
    const [userNumber, setUserNumber] = useState(0);
    const [browserWidth, setBrowserWidth] = useState(window.innerWidth);
    const copyLinkRef = useRef(null);

    useEffect(() => {
        fetchFile();
        setBrowserWidth(window.innerWidth);
    }, []);

    const fetchFile = async () => {
        const file = await Storage.get(hash);
        setFile(file);
    };

    const fetchTraffics = async () => {
        const apiData = await API.graphql({
            query: listTraffics,
            variables: {
                filter: {
                    hash: {
                        eq: hash
                    }
                }
            }
        });

        const items = apiData.data.listTraffics.items;

        if (items.length === 0) return;
        
        const maxPageNumber = Math.max(...items.map((value) => value.pageNumber));

        const traffics = [];
        for (let i = 1; i <= maxPageNumber; i++) traffics.push([i, 0, 0]);
        
        items.forEach((value) => {
            if (value.state === 'GREEN') {
                traffics[value.pageNumber - 1][1] = traffics[value.pageNumber - 1][1] + 1;
            } else {
                traffics[value.pageNumber - 1][2] = traffics[value.pageNumber - 1][2] + 1; 
            } 
        });
        
        setTraffics([...traffics]);
        setTotalGreens([...traffics].map(value => value[1]).reduce((accumulator, value) => accumulator + value));
        setTotalReds([...traffics].map(value => value[2]).reduce((accumulator, value) => accumulator + value));
        setPrevGreens([...traffics].map(value => value[1])[pageNumber - 1]);
        setPrevReds([...traffics].map(value => value[2])[pageNumber - 1]);
    };

    const onDocumentLoadSuccess = async ({ numPages }) => {
        setNumPages(numPages);
    };

    const onPrevPage = async () => {
        if (pageNumber <= 1) return;
        
        setPageNumber(pageNumber - 1);
        setPrevGreens([...traffics].map(value => value[1])[pageNumber - 3]);
        setPrevReds([...traffics].map(value => value[2])[pageNumber - 3]);
    };

    const onNextPage = async () => {
        if (pageNumber >= numPages) return;
        setPageNumber(pageNumber + 1);

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

        fetchTraffics();
    };

    const onCopyLink = e => {
        copyLinkRef.current.select();
        copyLinkRef.current.setSelectionRange(0, 99999);

        document.execCommand("copy");
    };

    // const fetchUserNumber = () => {
    //     const option = {
    //         url: 'https://api.zoom.us/v2/',
    //         qs: {
    //             status: 'active'
    //         },
    //         auth: {
    //             'bearer': token
    //         },
    //         headers: {
    //             'User-Agent': 'Zoom-Jwt-Request',
    //             'content-type': 'application/json'
    //         },
    //         json: true
    //     };
          
    //     axios(option).then(response => console.log(response))
    // };

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
        <div className="App">
            <Container fluid>
                <Row>
                    <Col sm={8} lg={true}>
                        <Document
                            file={file}
                            onLoadSuccess={onDocumentLoadSuccess}
                            width={'100%'}
                        >
                            <Page 
                                pageNumber={pageNumber}
                                width={browserWidth * 0.65}
                            />
                        </Document>
                        <div>{pageNumber} / {numPages}</div>
                        <Button onClick={onPrevPage}>이전</Button>{' '}
                        <Button onClick={onNextPage}>다음</Button><br/><br/>
                    </Col>
                    <Col sm={3}>
                        {/* <div>현재 접속자 수: {userNumber}</div> */}
                        <Chart
                            width={browserWidth * 0.25}
                            chartType="PieChart"
                            loader={<div>Loading...</div>}
                            data={[
                                ['응답', '횟수'],
                                ['알겠어요', totalGreens],
                                ['어려워요', totalReds]
                            ]}
                            options={{
                                title: '총 응답',
                            }}
                        />
                        <Chart
                            width={browserWidth * 0.25}
                            chartType="PieChart"
                            loader={<div>Loading...</div>}
                            data={[
                                ['응답', '횟수'],
                                ['알겠어요', prevGreens],
                                ['어려워요', prevReds]
                            ]}
                            options={{
                                title: '이전 슬라이드 응답',
                            }}
                        />
                        <Chart
                            width={browserWidth * 0.25}
                            chartType="LineChart"
                            loader={<div>Loading...</div>}
                            data={[['x', '알겠어요', '어려워요'], ...traffics]}
                            options={{
                                hAxis: {
                                    title: '페이지'
                                },
                                vAxis: {
                                    title: '페이지 별 응답 변화 추이'
                                }
                            }}
                        />
                        <Button 
                            onClick={onCopyLink}
                            variant="primary"
                            style={{
                                right:"21%",
                                bottom:"95px",
                                position:"fixed"
                            }}
                        >
                            강의실 링크 복사
                        </Button>{' '}
                        <input 
                            ref={copyLinkRef}
                            value={`${url}?meetingNumber=${context.state.meetingNumber}&passWord=${context.state.passWord}&hash=${hash}`}
                            style={{
                                display: "hidden",
                                bottom:"100px",
                                position:"fixed"
                            }}
                        >
                        </input>
                        <Link to={`/admin`} 
                            style={{
                                marginTop: "50px",
                                backgroundColor: "grey",
                                color: "#ffffff",
                                textDecoration: "none",
                                paddingTop: "10px",
                                paddingBottom: "10px",
                                paddingLeft: "40px",
                                paddingRight: "40px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                border: "none",
                                outline: "none",
                                textAlign: "center",
                                width: "10%",
                                margin: "auto",
                                right:"10%",
                                bottom:"50px",
                                position:"fixed",
                                textAlign: "center"
                            }}
                        >
                            강의 종료
                        </Link>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default withAuthenticator(Lecture);
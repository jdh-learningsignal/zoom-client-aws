import { React, useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import jwt from 'jsonwebtoken';
import { useParams } from 'react-router-dom';
import './Lecture.css';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { Chart } from "react-google-charts";
import { Container, Col, Row } from 'react-bootstrap';
import { 
    createPages as createPagesMutation, 
    createCurrentPages as createCurrentPagesMutation,
    updateCurrentPages as updateCurrentPagesMutation
} from './graphql/mutations';
import { listTrafficss, getCurrentPages } from './graphql/queries';
import config from './config';

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
    const [file, setFile] = useState("");
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [traffics, setTraffics] = useState([[1, 0, 0]]);
    const [totalReds, setTotalReds] = useState(0);
    const [totalGreens, setTotalGreens] = useState(0);
    const [prevReds, setPrevReds] = useState(0);
    const [prevGreens, setPrevGreens] = useState(0);
    const [prevCurrentReds, setPrevCurrentReds] = useState(0);
    const [prevCurrentGreens, setPrevCurrentGreens] = useState(0);
    const [currentReds, setCurrentReds] = useState(0);
    const [currentGreens, setCurrentGreens] = useState(0);
    const [browserWidth, setBrowserWidth] = useState(window.innerWidth);
    const [fakeKey, setFakeKey] = useState(false);
    const [fURL, setFURL] = useState(
        `${url}?m=${context.state.meetingNumber}&p=${context.state.passWord}&h=${hash}`
    );
    const [sURL, setSURL] = useState(
        `${url}?m=${context.state.meetingNumber}&p=${context.state.passWord}&h=${hash}`
    );

    const copyOriginLinkRef = useRef(null);
    const copyShortLinkRef = useRef(null);

    const shortenURL = async (url) => {
        const apiName = "utils";
        const path = "/utils/shortenURL";
        const myInit = {
            queryStringParameters: {
                encodeURI: encodeURI(url),
            },
        };

        const response = await API.get(apiName, path, myInit);

        if (response.code === "200") {
            setSURL(response.result.url);
        } else {
            setSURL(url);
        }
    };

    const fetchFile = async () => {
        const file = await Storage.get(hash);
        setFile(file);
    };

    const handleResize = () => {
        setFakeKey((prevKey) => !prevKey);
        setBrowserWidth(window.innerWidth);
    };

    useEffect(() => {
        fetchFile();
        setBrowserWidth(window.innerWidth);
        shortenURL(fURL);

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const listApiData = async (hash) => {
        let items = [];
        let nextToken = null;

        while (true) {
            let apiData;

            if (nextToken) {
                apiData = await API.graphql({
                    query: listTrafficss,
                    variables: {
                        filter: {
                            hash: {
                                eq: hash,
                            },
                        },
                        nextToken: nextToken,
                    },
                });
            } else {
                apiData = await API.graphql({
                    query: listTrafficss,
                    variables: {
                        filter: {
                            hash: {
                                eq: hash,
                            },
                        },
                    },
                });
            }

            items = [...items, ...apiData.data.listTrafficss.items];
            nextToken = apiData.data.listTrafficss.nextToken;

            if (!nextToken) break;
        }

        return items;
    };

    const fetchTraffics = async (direction) => {
        const items = await listApiData(hash);

        if (items.length === 0) return;

        const maxPageNumber = Math.max(
            ...items.map((value) => value.pageNumber)
        );

        const traffics = [];
        for (let i = 1; i <= maxPageNumber; i++) traffics.push([i, 0, 0]);

        items.sort(sortItems);

        let set = new Set();
        items.forEach((value) => {
            if (
                !set.has(
                    value.affiliation +
                        "," +
                        value.studentId +
                        "," +
                        value.pageNumber
                )
            ) {
                if (value.state === "GREEN") {
                    traffics[value.pageNumber - 1][1] =
                        traffics[value.pageNumber - 1][1] + 1;
                } else {
                    traffics[value.pageNumber - 1][2] =
                        traffics[value.pageNumber - 1][2] + 1;
                }

                set.add(
                    value.affiliation +
                        "," +
                        value.studentId +
                        "," +
                        value.pageNumber
                );
            }
        });

        setTraffics([...traffics]);

        setTotalGreens(
            [...traffics]
                .map((value) => value[1])
                .reduce((accumulator, value) => accumulator + value)
        );
        setTotalReds(
            [...traffics]
                .map((value) => value[2])
                .reduce((accumulator, value) => accumulator + value)
        );

        let curPage = pageNumber;
        if (direction === "NEXT") curPage = curPage + 1;
        else curPage = curPage - 1;

        setPrevGreens([...traffics].map((value) => value[1])[curPage - 2]);
        setPrevReds([...traffics].map((value) => value[2])[curPage - 2]);

        setPrevCurrentGreens(
            [...traffics].map((value) => value[1])[curPage - 1]
        );
        setPrevCurrentReds([...traffics].map((value) => value[2])[curPage - 1]);

        setCurrentGreens(0);
        setCurrentReds(0);
    };

    const onDocumentLoadSuccess = async ({ numPages }) => {
        setNumPages(numPages);
        await API.graphql({
            query: createPagesMutation,
            variables: {
                input: {
                    hash: hash,
                    numPages: numPages,
                    pageNumber: pageNumber,
                },
            },
        });

        try {
            const apiData = await API.graphql({
                query: getCurrentPages,
                variables: {
                    id: hash,
                },
            });

            if (apiData.data) {
                await API.graphql({
                    query: updateCurrentPagesMutation,
                    variables: {
                        input: {
                            id: hash,
                            pageNumber: pageNumber,
                        },
                    },
                });
            }
        } catch (e) {
            await API.graphql({
                query: createCurrentPagesMutation,
                variables: {
                    input: {
                        id: hash,
                        hash: hash,
                        pageNumber: pageNumber,
                    },
                },
            });
        }
    };

    const onPrevPage = async () => {
        if (pageNumber <= 1) return;
        const temp = pageNumber;

        if (!hash || !numPages || !temp) return;
        await API.graphql({
            query: createPagesMutation,
            variables: {
                input: {
                    hash: hash,
                    numPages: numPages,
                    pageNumber: temp - 1,
                },
            },
        });

        await API.graphql({
            query: updateCurrentPagesMutation,
            variables: {
                input: {
                    id: hash,
                    pageNumber: temp - 1,
                },
            },
        });

        setPageNumber(temp - 1);

        await fetchTraffics("PREV");
    };

    const onNextPage = async () => {
        if (pageNumber >= numPages) return;

        const temp = pageNumber;

        if (!hash || !numPages || !temp) return;

        await API.graphql({
            query: createPagesMutation,
            variables: {
                input: {
                    hash: hash,
                    numPages: numPages,
                    pageNumber: temp + 1,
                },
            },
        });

        await API.graphql({
            query: updateCurrentPagesMutation,
            variables: {
                input: {
                    id: hash,
                    pageNumber: temp + 1,
                },
            },
        });

        setPageNumber(temp + 1);

        await fetchTraffics("NEXT");
    };

    const sortItems = (a, b) => {
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;
        return 0;
    };

    const onFetchCurrentTraffics = async () => {
        const getApiData = await API.graphql({
            query: getCurrentPages,
            variables: {
                id: hash,
            },
        });

        const updatedTime = getApiData.data.getCurrentPages.updatedAt;

        const items = await listApiData(hash);

        if (items.length === 0) return;

        items.sort(sortItems);

        const result = items.filter((value) => value.createdAt >= updatedTime);

        let set = new Set();
        let greenNumber = 0;
        let redNumber = 0;
        result.forEach((value) => {
            if (
                !set.has(
                    value.affiliation +
                        "," +
                        value.studentId +
                        "," +
                        value.pageNumber
                )
            ) {
                if (value.state === "GREEN") {
                    greenNumber += 1;
                } else {
                    redNumber += 1;
                }
            }

            set.add(
                value.affiliation +
                    "," +
                    value.studentId +
                    "," +
                    value.pageNumber
            );
        });

        setCurrentGreens(greenNumber);
        setCurrentReds(redNumber);
    };

    const onCopyShortLink = (e) => {
        copyShortLinkRef.current.select();
        copyShortLinkRef.current.setSelectionRange(0, 99999);

        document.execCommand("copy");
    };

    const onCopyOriginLink = (e) => {
        copyOriginLinkRef.current.select();
        copyOriginLinkRef.current.setSelectionRange(0, 99999);

        document.execCommand("copy");
    };

    return (
        <div className="App">
            <Container fluid>
                <Row>
                    <Col sm={8}>
                        <Document
                            file={file}
                            onLoadSuccess={onDocumentLoadSuccess}
                            width={"100%"}
                        >
                            <Page
                                pageNumber={pageNumber}
                                width={browserWidth * 0.7}
                            />
                        </Document>
                        <div
                            style={{
                                right: "25.5%",
                                bottom: "17%",
                                position: "fixed",
                                fontWeight: "normal",
                            }}
                        >
                            {pageNumber} / {numPages}
                        </div>
                        <Button
                            onClick={onPrevPage}
                            style={{
                                position: "fixed",
                                right: "27%",
                                bottom: "13%",
                            }}
                        >
                            &lt;
                        </Button>

                        <Button
                            onClick={onNextPage}
                            style={{
                                position: "fixed",
                                right: "24.5%",
                                bottom: "13%",
                            }}
                        >
                            &gt;
                        </Button>
                    </Col>
                    <Col sm={3}>
                        <Chart
                            key={fakeKey}
                            style={{
                                position: "fixed",
                                right: "0%",
                                top: "0%",
                                zIndex: 2,
                            }}
                            width={browserWidth * 0.16}
                            chartType="PieChart"
                            loader={<div>Loading...</div>}
                            data={[
                                ["응답", "횟수"],
                                ["알겠어요", totalGreens],
                                ["어려워요", totalReds],
                            ]}
                            options={{
                                title: "총 응답",
                            }}
                        />
                        <Chart
                            key={fakeKey}
                            style={{
                                position: "fixed",
                                right: "13%",
                                top: "0%",
                                zIndex: 1,
                            }}
                            width={browserWidth * 0.16}
                            chartType="PieChart"
                            loader={<div>Loading...</div>}
                            data={[
                                ["응답", "횟수"],
                                ["알겠어요", prevGreens],
                                ["어려워요", prevReds],
                            ]}
                            options={{
                                title: "이전 페이지의 응답",
                            }}
                        />
                        <Chart
                            key={fakeKey}
                            style={{
                                position: "fixed",
                                right: "13%",
                                top: "24%",
                                zIndex: 3,
                            }}
                            width={browserWidth * 0.16}
                            chartType="PieChart"
                            loader={<div>Loading...</div>}
                            data={[
                                ["응답", "횟수"],
                                ["알겠어요", prevCurrentGreens],
                                ["어려워요", prevCurrentReds],
                            ]}
                            options={{
                                title: "현재 페이지의 과거 응답",
                            }}
                        />
                        <Chart
                            key={fakeKey}
                            style={{
                                position: "fixed",
                                right: "0%",
                                top: "24%",
                                zIndex: 4,
                            }}
                            width={browserWidth * 0.16}
                            chartType="PieChart"
                            loader={<div>Loading...</div>}
                            data={[
                                ["응답", "횟수"],
                                ["알겠어요", currentGreens],
                                ["어려워요", currentReds],
                            ]}
                            options={{
                                title: "현재 페이지의 실시간 응답",
                            }}
                        />
                        <Button
                            onClick={onFetchCurrentTraffics}
                            variant="primary"
                            style={{
                                right: "1%",
                                top: "38%",
                                position: "fixed",
                                zIndex: 6,
                            }}
                        >
                            확인
                        </Button>
                        <Chart
                            key={fakeKey}
                            style={{
                                position: "fixed",
                                right: "0%",
                                top: "45%",
                                zIndex: 5,
                            }}
                            width={browserWidth * 0.29}
                            chartType="LineChart"
                            loader={<div>Loading...</div>}
                            data={[["x", "알겠어요", "어려워요"], ...traffics]}
                            options={{
                                hAxis: {
                                    title: "페이지",
                                },
                                vAxis: {
                                    title: "페이지 별 응답 변화 추이",
                                },
                            }}
                        />
                        <Button
                            onClick={onCopyShortLink}
                            variant="primary"
                            style={{
                                right: "11.5%",
                                bottom: "16.1%",
                                position: "fixed",
                            }}
                        >
                            강의실 링크 복사 (단축)
                        </Button>{" "}
                        <input
                            ref={copyShortLinkRef}
                            value={sURL}
                            style={{
                                width: "119px",
                                right: "5%",
                                bottom: "16.3%",
                                position: "fixed",
                            }}
                        ></input>
                        <Button
                            onClick={onCopyOriginLink}
                            variant="primary"
                            style={{
                                right: "11.5%",
                                bottom: "12.1%",
                                position: "fixed",
                            }}
                        >
                            강의실 링크 복사 (원본)
                        </Button>{" "}
                        <input
                            ref={copyOriginLinkRef}
                            value={fURL}
                            style={{
                                width: "119px",
                                right: "5%",
                                bottom: "12.3%",
                                position: "fixed",
                            }}
                        ></input>
                        <Link
                            to={`/admin`}
                            style={{
                                marginTop: "50px",
                                backgroundColor: "grey",
                                color: "#ffffff",
                                textDecoration: "none",
                                paddingTop: "10px",
                                paddingBottom: "10px",
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                border: "none",
                                outline: "none",
                                textAlign: "center",
                                width: "8%",
                                margin: "auto",
                                right: "5%",
                                bottom: "5%",
                                position: "fixed",
                                textAlign: "center",
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
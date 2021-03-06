import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
import { API } from 'aws-amplify';
import { 
  createTraffics as createTrafficsMutation, 
  createAttendances as createAttendancesMutation 
} from './graphql/mutations';
import { getCurrentLectures } from "./graphql/queries";
import { ZoomMtg } from '@zoomus/websdk';
import { createHmac } from 'crypto';
import { useLocation } from 'react-router-dom';
import config from './config';
import crypto from 'crypto';

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, InputGroup, FormControl, Form, Row, Col, Button } from 'react-bootstrap';

import "./Zoom.css";

ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.1/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

const href = window.location.href;
const agent = window.navigator.userAgent;
const leaveUrl = href.includes("localhost") ? config.localUrl : href.includes("amplifyapp") ? config.devUrl : config.realUrl;
const role = 0;

const Zoom = () => {
    const [userName, setUserName] = useState("NULL");
    const [studentId, setStudentId] = useState("NULL");
    const [affiliation, setAffiliation] = useState("HYU");
    const [prevFeedTime, setPrevFeedTime] = useState(new Date());
    const [passWord, setPassWord] = useState("");
    const divTL = useRef(null);
    const query = new URLSearchParams(useLocation().search);
    const meetingNumber = query.get("m");
    const hash = query.get("h");
    const inputRef = useRef(null);

    // let passWord = query.get("p");
    // if (passWord) {
    //     const decipher = crypto.createDecipher('aes-256-cbc', 'key');
    //     let result2 = decipher.update(passWord, 'hex', 'utf8');
    //     result2 += decipher.final('utf8');
    //     passWord = result2;
    // }

    const TrafficButton = styled.button`
        width: 55px;
        height: 55px;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 2.5px;
        font-weight: 500;
        color: #000;
        border: none;
        margin-right: 5px;
        margin-bottom: 10px;
        border-radius: 50%;
        transition: all 0.3s ease 0s;
        cursor: pointer;
        outline: none;
        background-color: ${(props) => props.color || "white"};
        font-size: revert;
        font-weight: bold;
        text-decoration: none;
        position: relative;

        &:hover {
            background-color: #fff;
            box-shadow: 0px 15px 20px rgba(0, 0, 0, 0.5);
            color: #000;
            transform: translateY(-2px);
        }

        &:active {
            top: 5px;
            left: 5px;
        }

        &:active:after {
            border: 0;
        }
    `;

    useEffect(() => {}, []);

    function generateSignature() {
        const timestamp = new Date().getTime() - 30000;
        const msg = Buffer.from(
            config.apiKey + meetingNumber + timestamp + role
        ).toString("base64");
        const hmac = createHmac("sha256", config.apiSecret)
            .update(msg)
            .digest("base64");
        const signature = Buffer.from(
            `${config.apiKey}.${meetingNumber}.${timestamp}.${role}.${hmac}`
        ).toString("base64");
        return signature;
    }

    const onOut = (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.returnValue = "";

        API.graphql({
            query: createAttendancesMutation,
            variables: {
                input: {
                    hash: hash,
                    meetingId: meetingNumber,
                    userName: userName,
                    studentId: studentId,
                    affiliation: affiliation,
                    state: "OUT",
                    device: agent,
                },
            },
        });

        ZoomMtg.endMeeting({});
    };

    function startMeeting(e) {
        e.preventDefault();
        e.stopPropagation();
        
        inputRef.current.style.display = "none";

        document.getElementById("zmmtg-root").style.display = "block";
        const signature = generateSignature();

        ZoomMtg.init({
            leaveUrl: leaveUrl,
            isSupportAV: true,
            success: (success) => {
                ZoomMtg.join({
                    signature: signature,
                    meetingNumber: meetingNumber,
                    userName: userName,
                    apiKey: config.apiKey,
                    passWord: passWord,

                    success: async (success) => {
                        divTL.current.style.display = "flex";

                        API.graphql({
                            query: createAttendancesMutation,
                            variables: {
                                input: {
                                    hash: hash,
                                    meetingId: meetingNumber,
                                    userName: userName,
                                    studentId: studentId,
                                    affiliation: affiliation,
                                    state: "IN",
                                    device: agent,
                                },
                            },
                        });

                        window.removeEventListener("beforeunload", onOut);
                        window.addEventListener("beforeunload", onOut);
                    },
                    error: (error) => {
                        console.log(error);
                    },
                });
            },
            error: (error) => {
                console.log(error);
            },
        });
    }

    const sendTraffic = async (value) => {
        const currentTime = new Date();
        if (currentTime.getTime() - prevFeedTime.getTime() < 2000) return;
        if (!value || !studentId || !affiliation || !hash) return;

        // ?????? ?????? ????????? ????????????
        const apiData = await API.graphql({
            query: getCurrentLectures,
            variables: {
                id: hash,
            },
        });

        setPrevFeedTime(currentTime);

        const currentPageNumber = apiData.data.getCurrentLectures.pageNumber;

        await API.graphql({
            query: createTrafficsMutation,
            variables: {
                input: {
                    studentId: studentId,
                    affiliation: affiliation,
                    hash: hash,
                    pageNumber: currentPageNumber,
                    state: value,
                },
            },
        });
    };

    const onClickButton = (e) => {
        sendTraffic(e.target.value);
    };

    if (!hash || !meetingNumber) {
        return <h1></h1>;
    }

    return (
        <Container fluid>
            <div ref={inputRef}>
                <Row>&nbsp;</Row>
                <Row>&nbsp;</Row>
                <Row>
                    <Col></Col>
                    <Col>
                        <Form.Group>
                            <Form.Control
                                onChange={(e) => setAffiliation(e.target.value)}
                                as="select"
                                custom
                            >
                                <option value="HYU">???????????????</option>
                                <option value="KJWU">?????????????????????</option>
                                <option value="LTU">???????????????</option>
                                <option value="BSU">???????????????</option>
                                <option value="BSCU">?????????????????????</option>
                                <option value="SMU">???????????????</option>
                                <option value="EJU">???????????????</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>??????</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="???) ?????????"
                            />
                        </InputGroup>
                    </Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>??????</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                onChange={(e) => setStudentId(e.target.value)}
                                placeholder="???) 2021123123"
                            />
                        </InputGroup>
                    </Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>?????? ????????????</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                onChange={(e) => setPassWord(e.target.value)}
                                placeholder="???) 1234"
                            />
                        </InputGroup>
                    </Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col>
                        <Button onClick={startMeeting} variant="primary" block>
                            ??????
                        </Button>
                    </Col>
                    <Col></Col>
                </Row>
            </div>
            <div ref={divTL} style={{ display: "none" }}>
                <div
                    style={{
                        position: "fixed",
                        bottom: "152px",
                        left: "3%",
                        zIndex: "100000",
                    }}
                >
                    <TrafficButton
                        onClick={onClickButton}
                        color="red"
                        value="RED"
                    >
                        ??????
                        <br />
                        ??????
                    </TrafficButton>
                </div>
                <div
                    style={{
                        position: "fixed",
                        bottom: "87px",
                        left: "3%",
                        zIndex: "100000",
                    }}
                >
                    <TrafficButton
                        onClick={onClickButton}
                        color="green"
                        value="GREEN"
                    >
                        ??????
                        <br />
                        ??????
                    </TrafficButton>
                </div>
            </div>
        </Container>
    );
};

export default Zoom;
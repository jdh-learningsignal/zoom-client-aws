import React, { useState, useEffect, useRef } from 'react';
import { API, Storage } from 'aws-amplify';
import { createFiles as createFilesMutation } from './graphql/mutations';
import { withAuthenticator} from '@aws-amplify/ui-react'
import { createHmac } from 'crypto';
import crypto from 'crypto';

import {
    Container,
    InputGroup,
    FormControl,
    Form,
    Row,
    Col,
    Button,
    Badge
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Upload = () => {
    const [affiliation, setAffiliation] = useState('HYU');
    const [name, setName] = useState('');
    const [lectureName, setLectureName] = useState('');
    const [meetingNumber, setMeetingNumber] = useState('');
    const [material, setMaterial] = useState({ name: "강의 자료 업로드 (PDF만 가능)", hash: '' });
    const startButtonRef = useRef(null);

    const onChangeFile = async (e) => {
        if (!e.target.files[0]) return;
        
        const file = e.target.files[0];
        const hash = createHmac('sha256', file.name + new Date()).digest('hex');
        
        await Storage.put(hash, file);
        await insertFile(file.name, hash);
        
        setMaterial({ name: file.name, hash: hash });
        startButtonRef.current.style.display = "block";
    };

    const insertFile = async (name, hash) => {
        if (!name || !hash) return;
    
        await API.graphql({ 
          query: createFilesMutation, 
          variables: { 
            input: {
                name: name, 
                hash: hash
            }
          } 
        });
    };

    return (
        <Container fluid>
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
                            <option value="HYU">한양대학교</option>
                            <option value="KJWU">광주여자대학교</option>
                            <option value="LTU">루터대학교</option>
                            <option value="BSU">백석대학교</option>
                            <option value="BSCU">백석문화대학교</option>
                            <option value="SMU">상명대학교</option>
                            <option value="EJU">을지대학교</option>
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
                            <InputGroup.Text>이름</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            onChange={(e) => setName(e.target.value)}
                            placeholder="예) 홍길동"
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
                            <InputGroup.Text>강의 제목</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            onChange={(e) => setLectureName(e.target.value)}
                            placeholder="예) AI+X:인공지능 10주차"
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
                            <InputGroup.Text>회의 ID</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            onChange={(e) => setMeetingNumber(e.target.value.replace(/ /gi, ""))}
                            placeholder="예) 451 551 4600"
                        />
                    </InputGroup>
                </Col>
                <Col></Col>
            </Row>

            <Row>
                <Col></Col>
                <Col>
                    <Form>
                        <Form.File
                            className="mb-3"
                            onChange={onChangeFile}
                            label={material.name}
                            data-browse="파일 선택"
                            custom
                        />
                    </Form>
                </Col>
                <Col></Col>
            </Row>

            <Row>
                <Col></Col>
                <Col>
                    <Button 
                        style={{
                            display: "none"
                        }}
                        ref={startButtonRef}
                        href={`/lecture/${material.hash}?a=${affiliation}&n=${name}&l=${lectureName}&m=${meetingNumber}`}
                        block
                    >
                        강의 시작
                    </Button>
                </Col>
                <Col></Col>
            </Row>

            {/* <div>
                <h6
                    style={{
                        fontWeight: "bold",
                    }}
                >
                    암호
                </h6>
                <input
                    onChange={(e) => {
                        const cipher = crypto.createCipher(
                            "aes-256-cbc",
                            "key"
                        );
                        let result = cipher.update(
                            e.target.value,
                            "utf8",
                            "hex"
                        );
                        result += cipher.final("hex");
                        setPassWord(result);
                    }}
                    placeholder="예) 951810"
                    type="text"
                    style={{
                        marginTop: "0px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        width: "230px",
                        fontSize: "15px",
                    }}
                ></input>
            </div> */}
        </Container>
    );
};

export default withAuthenticator(Upload);
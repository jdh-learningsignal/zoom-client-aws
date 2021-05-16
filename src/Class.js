import { React, useState, useEffect } from "react";
import {
    Card,
    ListGroupItem,
    ListGroup,
    Container,
    Row,
    Col,
} from "react-bootstrap";
import { API } from "aws-amplify";

import { listCurrentLecturess } from "./graphql/queries";

// import "./Class.css";

const url = window.location.origin;

const Class = () => {
    const [lectures, setLectures] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const items = await listLecturessData();
        setLectures(items);
    };

    const sortAscendingItems = (a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    };

    const listLecturessData = async () => {
        let items = [];
        let nextToken = null;

        while (true) {
            let apiData;

            if (nextToken) {
                apiData = await API.graphql({
                    query: listCurrentLecturess,
                    variables: {
                        nextToken: nextToken,
                    },
                });
            } else {
                apiData = await API.graphql({
                    query: listCurrentLecturess,
                    variables: {},
                });
            }

            items = [...items, ...apiData.data.listCurrentLecturess.items];
            nextToken = apiData.data.listCurrentLecturess.nextToken;

            if (!nextToken) break;
        }

        return items.sort(sortAscendingItems);
    };

    const mapAffiliation = (value) => {
        switch (value) {
            case "HYU":
                return "한양대학교";
            case "KJWU":
                return "광주여자대학교";
            case "LTU":
                return "루터대학교";
            case "BSU":
                return "백석대학교";
            case "BSCU":
                return "백석문화대학교";
            case "SMU":
                return "상명대학교";
            case "EJU":
                return "을지대학교";
        }
    };

    const LectureCard = ({ lecture }) => {
        const { name, affiliation, profName, meetingId, hash } = lecture;
        
        return (
            <ListGroupItem>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle className="mb-2">
                    {mapAffiliation(affiliation) + " " + profName}
                </Card.Subtitle>
                <Card.Link
                    href={url + "/attendance?m=" + meetingId + "&h=" + hash}
                >
                    수업 참가
                </Card.Link>
            </ListGroupItem>
        );
    };

    const LectureList = ({ lectures }) => {
        return (
            <Card style={{ width: "24rem" }}>
                <Card.Header>현재 참여 가능한 수업</Card.Header>
                <ListGroup  variant="flush">
                    {lectures.map((lecture) => {
                        return (
                            <LectureCard lecture={lecture} key={lecture.id} />
                        );
                    })}
                </ListGroup>
            </Card>
        );
    };

    return (
        <Container>
            <Row>&nbsp;</Row>
            <Row>&nbsp;</Row>
            <Row>
                <Col></Col>
                <Col>
                    <LectureList lectures={lectures}></LectureList>
                </Col>
                <Col></Col>
            </Row>
            <Row>&nbsp;</Row>
            <Row>&nbsp;</Row>
            <Row>&nbsp;</Row>
        </Container>
    );
};

export default Class;

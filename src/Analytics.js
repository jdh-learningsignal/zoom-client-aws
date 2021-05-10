import { React, useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Chart } from "react-google-charts";
import { Container, Col, Row } from "react-bootstrap";
import {
    listAttendancess,
    listFiless,
    listPagess,
    listTrafficsArchivess,
} from "./graphql/queries";

const Analytics = () => {
    // - 참여 학생 수 (전체): totalStudentNum
    // - 참여 학생 수 (일별): dayStudentNum

    // - 신호등 사용 가능한 (크롬 & 데스크톱을 사용) 참여  학생 수 (전체): totalPossibleStudentNum
    // - 신호등 사용 가능한 (크롬 & 데스크톱을 사용) 참여 학생 수 (일별): dayPossibleStudentNum

    // - 신호등을 한 번이라도 사용한 학생들의 수 (전체): totalClickedStudentNum
    // - 신호등을 한 번이라도 사용한 학생들의 수 (일별): dayClickedStudentNum

    // - 평균 슬라이드 수 (전체): meanSlideNum
    // - 슬라이드 수 (일별): daySlideNum

    // - 총 신호 개수 (중복 허용): duplicatedTotalTrafficsNum
    // - 총 신호 개수 (중복 제거): totalTrafficsNum

    // - 처음 신호 알겠어요/어려워요 개수 (전체): firstTotalGreens, firstTotalReds
    // - 최종 신호 알겠어요/어려워요 개수 (전체): finalTotalGreens, finalTotalReds
    // - 처음 신호 알겠어요/어려워요 개수 (일별): firstDayGreens, firstDayReds
    // - 처음 신호 알겠어요/어려워요 개수 (일별): finalDayGreens, finalDayReds

    const [totalStudentNum, setTotalStudentNum] = useState(0);
    const [dayStudentNum, setDayStudentNum] = useState([[], []]);
    const [totalPossibleStudentNum, setTotalPossibleStudentNum] = useState(0);
    const [dayPossibleStudentNum, setDayPossibleStudentNum] = useState([
        [],
        [],
    ]);

    const [totalClickedStudentNum, setTotalClickedStudentNum] = useState(0);
    const [dayClickedStudentNum, setDayClickedStudentNum] = useState([[], []]);

    const [meanSlideNum, setMeanSlideNum] = useState(0);
    const [daySlideNum, setDaySlideNum] = useState([[], []]);

    const [
        duplicatedTotalTrafficsNum,
        setDuplicatedTotalTrafficsNum,
    ] = useState(0);
    const [totalTrafficsNum, setTotalTrafficsNum] = useState(0);

    const [firstTotalGreens, setFirstTotalGreens] = useState(0);
    const [firstTotalReds, setFirstTotalReds] = useState(0);
    const [finalTotalGreens, setFinalTotalGreens] = useState(0);
    const [finalTotalReds, setFinalTotalReds] = useState(0);

    const [firstDayGreens, setFirstDayGreens] = useState([[], []]);
    const [firstDayReds, setFirstDayReds] = useState([[], []]);
    const [finalDayGreens, setFinalDayGreens] = useState([[], []]);
    const [finalDayReds, setFinalDayReds] = useState([[], []]);

    const [firstTotalTraffics, setFirstTotalTraffics] = useState([]);
    const [finalTotalTraffics, setFinalTotalTraffics] = useState([]);

    const [browserWidth, setBrowserWidth] = useState(window.innerWidth);
    const [fakeKey, setFakeKey] = useState(false);

    useEffect(() => {
        setBrowserWidth(window.innerWidth);

        fetchData();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleResize = () => {
        setFakeKey((prevKey) => !prevKey);
        setBrowserWidth(window.innerWidth);
    };

    const fetchData = async () => {
        const filessData = await listFilessData();
        const attendancessData = await listAttendancessData();
        const trafficsArchivessData = await listTrafficsArchivessData();
        const pagessData = await listPagessData();

        const totalStudentNum = await calTotalStudentNum(
            filessData,
            attendancessData
        );

        setTotalStudentNum(totalStudentNum);

        const dayStudentNum = await calDayStudentNum(
            filessData,
            attendancessData
        );

        setDayStudentNum(dayStudentNum);

        const totalPossibleStudentNum = await calTotalPossibleStudentNum(
            filessData,
            attendancessData
        );

        setTotalPossibleStudentNum(totalPossibleStudentNum);

        const dayPossibleStudentNum = await calDayPossibleStudentNum(
            filessData,
            attendancessData
        );

        setDayPossibleStudentNum(dayPossibleStudentNum);

        const totalClickedStudentNum = await calTotalClickedStudentNum(
            filessData,
            trafficsArchivessData
        );

        setTotalClickedStudentNum(totalClickedStudentNum);

        const dayClickedStudentNum = await calDayClickedStudentNum(
            filessData,
            trafficsArchivessData
        );

        setDayClickedStudentNum(dayClickedStudentNum);

        const meanSlideNum = await calMeanSlideNum(filessData, pagessData);

        setMeanSlideNum(meanSlideNum);

        const daySlideNum = await calDaySlideNum(filessData, pagessData);

        setDaySlideNum(daySlideNum);

        const duplicatedTotalTrafficsNum = await calDuplicatedTotalTrafficsNum(
            filessData,
            trafficsArchivessData
        );

        setDuplicatedTotalTrafficsNum(duplicatedTotalTrafficsNum);

        const totalTrafficsNum = await calTotalTrafficsNum(
            filessData,
            trafficsArchivessData
        );

        setTotalTrafficsNum(totalTrafficsNum);

        const firstTotalTraffics = await calFirstTraffics(
            filessData,
            trafficsArchivessData
        );

        setFirstTotalTraffics(firstTotalTraffics);

        const finalTotalTraffics = await calFinalTraffics(
            filessData,
            trafficsArchivessData
        );

        setFinalTotalTraffics(finalTotalTraffics);

        const firstTotalGreens = await calFirstTotalGreens(firstTotalTraffics);
        setFirstTotalGreens(firstTotalGreens);

        const firstTotalReds = await calFirstTotalReds(firstTotalTraffics);
        setFirstTotalReds(firstTotalReds);

        const finalTotalGreens = await calFinalTotalGreens(finalTotalTraffics);
        setFinalTotalGreens(finalTotalGreens);

        const finalTotalReds = await calFinalTotalReds(finalTotalTraffics);
        setFinalTotalReds(finalTotalReds);

        const firstDayGreens = await calFirstDayGreens(
            filessData,
            firstTotalTraffics
        );

        setFirstDayGreens(firstDayGreens);

        const firstDayReds = await calFirstDayReds(
            filessData,
            firstTotalTraffics
        );

        setFirstDayReds(firstDayReds);

        const finalDayGreens = await calFinalDayGreens(
            filessData,
            finalTotalTraffics
        );

        setFinalDayGreens(finalDayGreens);

        const finalDayReds = await calFinalDayReds(
            filessData,
            finalTotalTraffics
        );

        setFinalDayReds(finalDayReds);
    };

    const calFirstDayGreens = async (filessData, firstTotalTraffics) => {
        const sorted = firstTotalTraffics.sort((a, b) => {
            if (a.originCreatedAt < b.originCreatedAt) return -1;
            if (a.originCreatedAt > b.originCreatedAt) return 1;
            return 0;
        });

        let result = [[], []];

        filessData
            .sort((a, b) => {
                if (a.createdAt < b.createdAt) return -1;
                if (a.createdAt > b.createdAt) return 1;
                return 0;
            })
            .forEach((file) => {
                let traffics = [];

                [...sorted]
                    .filter((value) => value.hash === file.hash)
                    .forEach((fValue) => {
                        traffics.push(fValue);
                    });

                result[0].push(file.createdAt);
                result[1].push(
                    traffics.filter((value) => value.state === "GREEN").length
                );
            });

        console.log("calFirstDayGreens: ");
        console.log(result);

        return result;
    };

    const calFirstDayReds = async (filessData, firstTotalTraffics) => {
        const sorted = firstTotalTraffics.sort((a, b) => {
            if (a.originCreatedAt < b.originCreatedAt) return -1;
            if (a.originCreatedAt > b.originCreatedAt) return 1;
            return 0;
        });

        let result = [[], []];

        filessData
            .sort((a, b) => {
                if (a.createdAt < b.createdAt) return -1;
                if (a.createdAt > b.createdAt) return 1;
                return 0;
            })
            .forEach((file) => {
                let traffics = [];

                [...sorted]
                    .filter((value) => value.hash === file.hash)
                    .forEach((fValue) => {
                        traffics.push(fValue);
                    });

                result[0].push(file.createdAt);
                result[1].push(
                    traffics.filter((value) => value.state === "RED").length
                );
            });

        console.log("calFirstDayReds: ");
        console.log(result);

        return result;
    };

    const calFinalDayGreens = async (filessData, finalTotalTraffics) => {
        const sorted = finalTotalTraffics.sort((a, b) => {
            if (a.originCreatedAt < b.originCreatedAt) return -1;
            if (a.originCreatedAt > b.originCreatedAt) return 1;
            return 0;
        });

        let result = [[], []];

        filessData
            .sort((a, b) => {
                if (a.createdAt < b.createdAt) return -1;
                if (a.createdAt > b.createdAt) return 1;
                return 0;
            })
            .forEach((file) => {
                let traffics = [];

                [...sorted]
                    .filter((value) => value.hash === file.hash)
                    .forEach((fValue) => {
                        traffics.push(fValue);
                    });

                result[0].push(file.createdAt);
                result[1].push(
                    traffics.filter((value) => value.state === "GREEN").length
                );
            });

        console.log("calFinalDayGreens: ");
        console.log(result);

        return result;
    };

    const calFinalDayReds = async (filessData, finalTotalTraffics) => {
        const sorted = finalTotalTraffics.sort((a, b) => {
            if (a.originCreatedAt < b.originCreatedAt) return -1;
            if (a.originCreatedAt > b.originCreatedAt) return 1;
            return 0;
        });

        let result = [[], []];

        filessData
            .sort((a, b) => {
                if (a.createdAt < b.createdAt) return -1;
                if (a.createdAt > b.createdAt) return 1;
                return 0;
            })
            .forEach((file) => {
                let traffics = [];

                [...sorted]
                    .filter((value) => value.hash === file.hash)
                    .forEach((fValue) => {
                        traffics.push(fValue);
                    });

                result[0].push(file.createdAt);
                result[1].push(
                    traffics.filter((value) => value.state === "RED").length
                );
            });

        console.log("calFinalDayReds: ");
        console.log(result);

        return result;
    };

    const calFirstTotalGreens = async (firstTotalTraffics) => {
        console.log("calFirstTotalGreens: ");
        console.log(
            firstTotalTraffics.filter((value) => value.state === "GREEN").length
        );

        return firstTotalTraffics.filter((value) => value.state === "GREEN")
            .length;
    };

    const calFirstTotalReds = async (firstTotalTraffics) => {
        console.log("calFirstTotalReds: ");
        console.log(
            firstTotalTraffics.filter((value) => value.state === "RED").length
        );

        return firstTotalTraffics.filter((value) => value.state === "RED")
            .length;
    };

    const calFinalTotalGreens = async (finalTotalTraffics) => {
        console.log("calFinalTotalGreens: ");
        console.log(
            finalTotalTraffics.filter((value) => value.state === "GREEN").length
        );

        return finalTotalTraffics.filter((value) => value.state === "GREEN")
            .length;
    };

    const calFinalTotalReds = async (finalTotalTraffics) => {
        console.log("calFinalTotalReds: ");
        console.log(
            finalTotalTraffics.filter((value) => value.state === "RED").length
        );

        return finalTotalTraffics.filter((value) => value.state === "RED")
            .length;
    };

    const sortAscendingItems = (a, b) => {
        if (a.createdAt < b.createdAt) return -1;
        if (a.createdAt > b.createdAt) return 1;
        return 0;
    };

    const sortDecendingItems = (a, b) => {
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;
        return 0;
    };

    const calFirstTraffics = async (filessData, trafficsArchivessData) => {
        trafficsArchivessData.sort((a, b) => {
            if (a.originCreatedAt < b.originCreatedAt) return -1;
            if (a.originCreatedAt > b.originCreatedAt) return 1;
            return 0;
        });

        const hashs = filessData.map((value) => value.hash);

        const filtered = trafficsArchivessData.filter((value) =>
            hashs.includes(value.hash)
        );

        let set = new Set();
        let firstTraffics = [];

        filtered.forEach((value) => {
            if (
                !set.has(
                    value.hash +
                        "," +
                        value.affiliation +
                        "," +
                        value.studentId +
                        "," +
                        value.pageNumber
                )
            ) {
                set.add(
                    value.hash +
                        "," +
                        value.affiliation +
                        "," +
                        value.studentId +
                        "," +
                        value.pageNumber
                );
                firstTraffics.push(value);
            }
        });

        console.log("calFirstTraffics: ");
        console.log(firstTraffics);

        return firstTraffics;
    };

    const calFinalTraffics = async (filessData, trafficsArchivessData) => {
        trafficsArchivessData.sort((a, b) => {
            if (a.originCreatedAt > b.originCreatedAt) return -1;
            if (a.originCreatedAt < b.originCreatedAt) return 1;
            return 0;
        });

        const hashs = filessData.map((value) => value.hash);

        const filtered = trafficsArchivessData.filter((value) =>
            hashs.includes(value.hash)
        );

        let set = new Set();
        let finalTraffics = [];

        filtered.forEach((value) => {
            if (
                !set.has(
                    value.hash +
                        "," +
                        value.affiliation +
                        "," +
                        value.studentId +
                        "," +
                        value.pageNumber
                )
            ) {
                set.add(
                    value.hash +
                        "," +
                        value.affiliation +
                        "," +
                        value.studentId +
                        "," +
                        value.pageNumber
                );
                finalTraffics.push(value);
            }
        });

        console.log("calFinalTraffics: ");
        console.log(finalTraffics);

        return finalTraffics;
    };

    const calTotalTrafficsNum = async (filessData, trafficsArchivessData) => {
        const hashs = filessData.map((value) => value.hash);

        const filtered = trafficsArchivessData.filter((value) =>
            hashs.includes(value.hash)
        );

        let set = new Set();

        filtered.forEach((value) => {
            set.add(
                value.affiliation +
                    "," +
                    value.studentId +
                    "," +
                    value.pageNumber +
                    "," +
                    value.state
            );
        });

        console.log("calTotalTrafficsNum: ");
        console.log(set.size);

        return set.size;
    };

    const calDuplicatedTotalTrafficsNum = async (
        filessData,
        trafficsArchivessData
    ) => {
        const hashs = filessData.map((value) => value.hash);

        const filtered = trafficsArchivessData.filter((value) =>
            hashs.includes(value.hash)
        );

        console.log("calDuplicatedTotalTrafficsNum: ");
        console.log(filtered.length);

        return filtered.length;
    };

    const calMeanSlideNum = async (filessData, pagessData) => {
        const hashs = filessData.map((value) => value.hash);

        const filtered = pagessData.filter((value) =>
            hashs.includes(value.hash)
        );

        let set = new Set();
        let num = 0;
        filtered.forEach((value) => {
            if (!set.has(value.numPages)) {
                num += value.numPages;
                set.add(value.numPages);
            }
        });

        console.log("calMeanSlideNum: ");
        console.log(num / hashs.length);

        return num / hashs.length;
    };

    const calDaySlideNum = async (filessData, pagessData) => {
        const filtered = pagessData.filter((value) =>
            [...filessData].map((value) => value.hash).includes(value.hash)
        );

        let result = [[], []];

        filessData.forEach((file) => {
            let set = new Set();
            let num = 0;
            [...filtered]
                .filter((value) => value.hash === file.hash)
                .forEach((fValue) => {
                    if (!set.has(fValue.numPages)) {
                        num = fValue.numPages;
                        set.add(fValue.numPages);
                    }
                });

            result[0].push(file.createdAt);
            result[1].push(num);
        });

        console.log("calDaySlideNum: ");
        console.log(result);

        return result;
    };

    const calDayClickedStudentNum = async (
        filessData,
        trafficsArchivessData
    ) => {
        const filtered = trafficsArchivessData.filter(
            (value) =>
                [...filessData]
                    .map((value) => value.hash)
                    .includes(value.hash) &
                (value.studentId !== "NULL")
        );

        let result = [[], []];

        filessData.forEach((file) => {
            let set = new Set();
            [...filtered]
                .filter((value) => value.hash === file.hash)
                .forEach((fValue) => {
                    set.add(fValue.affiliation + "," + fValue.studentId);
                });

            result[0].push(file.createdAt);
            result[1].push(set.size);
        });

        console.log("calDayClickedStudentNum: ");
        console.log(result);

        return result;
    };

    const calTotalClickedStudentNum = async (
        filessData,
        trafficsArchivessData
    ) => {
        const hashs = filessData.map((value) => value.hash);

        const filtered = trafficsArchivessData.filter(
            (value) => hashs.includes(value.hash) & (value.studentId !== "NULL")
        );

        let set = new Set();

        filtered.forEach((value) => {
            set.add(value.affiliation + "," + value.studentId);
        });

        console.log("calTotalClickedStudentNum: ");
        console.log(set.size);

        return set.size;
    };

    const calDayPossibleStudentNum = async (filessData, attendancessData) => {
        const filtered = attendancessData.filter(
            (value) =>
                [...filessData]
                    .map((value) => value.hash)
                    .includes(value.hash) &
                (value.studentId !== "NULL") &
                !value.device.toLowerCase().includes("mobile") &
                value.device.toLowerCase().includes("chrome")
        );

        let result = [[], []];

        filessData.forEach((file) => {
            let set = new Set();
            let num = 0;
            [...filtered]
                .filter((value) => value.hash === file.hash)
                .forEach((fValue) => {
                    if (!set.has(fValue.affiliation + "," + fValue.studentId)) {
                        num += 1;
                    }

                    set.add(fValue.affiliation + "," + fValue.studentId);
                });

            result[0].push(file.createdAt);
            result[1].push(num);
        });

        console.log("calDayPossibleStudentNum: ");
        console.log(result);

        return result;
    };

    const calTotalPossibleStudentNum = async (filessData, attendancessData) => {
        const hashs = filessData.map((value) => value.hash);

        const filtered = attendancessData.filter(
            (value) =>
                hashs.includes(value.hash) &
                (value.studentId !== "NULL") &
                !value.device.toLowerCase().includes("mobile") &
                value.device.toLowerCase().includes("chrome")
        );

        let set = new Set();
        let num = 0;

        filtered.forEach((value) => {
            if (!set.has(value.affiliation + "," + value.studentId)) {
                num += 1;
            }

            set.add(value.affiliation + "," + value.studentId);
        });

        console.log("calTotalPossibleStudentNum: ");
        console.log(num);

        return num;
    };

    const calDayStudentNum = async (filessData, attendancessData) => {
        const filtered = attendancessData.filter(
            (value) =>
                [...filessData]
                    .map((value) => value.hash)
                    .includes(value.hash) &
                (value.studentId !== "NULL")
        );

        let result = [[], []];

        filessData.forEach((file) => {
            let set = new Set();
            let num = 0;
            [...filtered]
                .filter((value) => value.hash === file.hash)
                .forEach((fValue) => {
                    if (!set.has(fValue.affiliation + "," + fValue.studentId)) {
                        num += 1;
                    }

                    set.add(fValue.affiliation + "," + fValue.studentId);
                });

            result[0].push(file.createdAt);
            result[1].push(num);
        });

        console.log("calDayStudentNum: ");
        console.log(result);

        return result;
    };

    const calTotalStudentNum = async (filessData, attendancessData) => {
        const hashs = filessData.map((value) => value.hash);

        const filtered = attendancessData.filter(
            (value) => hashs.includes(value.hash) & (value.studentId !== "NULL")
        );

        let set = new Set();
        let num = 0;

        filtered.forEach((value) => {
            if (!set.has(value.affiliation + "," + value.studentId)) {
                num += 1;
            }

            set.add(value.affiliation + "," + value.studentId);
        });

        console.log("calTotalStudentNum: ");
        console.log(num);

        return num;
    };

    const listFilessData = async () => {
        let items = [];
        let nextToken = null;

        while (true) {
            let apiData;

            if (nextToken) {
                apiData = await API.graphql({
                    query: listFiless,
                    variables: {
                        nextToken: nextToken,
                    },
                });
            } else {
                apiData = await API.graphql({
                    query: listFiless,
                    variables: {},
                });
            }

            items = [...items, ...apiData.data.listFiless.items];
            nextToken = apiData.data.listFiless.nextToken;

            if (!nextToken) break;
        }

        console.log("listFilessData: ");
        console.log(items);

        return items.sort(sortAscendingItems);
    };

    const listTrafficsArchivessData = async () => {
        let items = [];
        let nextToken = null;

        while (true) {
            let apiData;

            if (nextToken) {
                apiData = await API.graphql({
                    query: listTrafficsArchivess,
                    variables: {
                        nextToken: nextToken,
                    },
                });
            } else {
                apiData = await API.graphql({
                    query: listTrafficsArchivess,
                    variables: {},
                });
            }

            items = [...items, ...apiData.data.listTrafficsArchivess.items];
            nextToken = apiData.data.listTrafficsArchivess.nextToken;

            if (!nextToken) break;
        }

        console.log("listTrafficsArchivessData: ");
        console.log(items);

        return items;
    };

    const listAttendancessData = async () => {
        let items = [];
        let nextToken = null;

        while (true) {
            let apiData;

            if (nextToken) {
                apiData = await API.graphql({
                    query: listAttendancess,
                    variables: {
                        nextToken: nextToken,
                    },
                });
            } else {
                apiData = await API.graphql({
                    query: listAttendancess,
                    variables: {},
                });
            }

            items = [...items, ...apiData.data.listAttendancess.items];
            nextToken = apiData.data.listAttendancess.nextToken;

            if (!nextToken) break;
        }

        console.log("listAttendancessData: ");
        console.log(items);

        return items;
    };

    const listPagessData = async () => {
        let items = [];
        let nextToken = null;

        while (true) {
            let apiData;

            if (nextToken) {
                apiData = await API.graphql({
                    query: listPagess,
                    variables: {
                        nextToken: nextToken,
                    },
                });
            } else {
                apiData = await API.graphql({
                    query: listPagess,
                    variables: {},
                });
            }

            items = [...items, ...apiData.data.listPagess.items];
            nextToken = apiData.data.listPagess.nextToken;

            if (!nextToken) break;
        }

        console.log("listPagessData: ");
        console.log(items);

        return items;
    };

    return (
        <Container fluid>
            <h1>참여 학생 수 (전체): {totalStudentNum}</h1>
            <h1>참여 학생 수 (일별): {dayStudentNum[1].join(", ")}</h1>
            <h1>
                신호등 사용 가능한 (크롬 & 데스크톱을 사용) 참여 학생 수 (전체):{" "}
                {totalPossibleStudentNum}
            </h1>
            <h1>
                신호등 사용 가능한 (크롬 & 데스크톱을 사용) 참여 학생 수 (일별):{" "}
                {dayPossibleStudentNum[1].join(", ")}
            </h1>
            <h1>
                신호등을 한 번이라도 사용한 학생들의 수 (전체):{" "}
                {totalClickedStudentNum}
            </h1>
            <h1>
                신호등을 한 번이라도 사용한 학생들의 수 (일별):{" "}
                {dayClickedStudentNum[1].join(", ")}
            </h1>
            <h1>평균 슬라이드 수 (전체): {meanSlideNum}</h1>
            <h1>슬라이드 수 (일별): {daySlideNum[1].join(", ")}</h1>
            <h1>총 신호 개수 (중복 허용): {duplicatedTotalTrafficsNum}</h1>
            <h1>총 신호 개수 (중복 제거): {totalTrafficsNum}</h1>
            <h1>
                처음 신호 알겠어요/어려워요 개수 (전체): 알겠어요:{" "}
                {firstTotalGreens} / 어려워요: {firstTotalReds}
            </h1>
            <h1>
                최종 신호 알겠어요/어려워요 개수 (전체): 알겠어요:{" "}
                {finalTotalGreens} / 어려워요: {finalTotalReds}
            </h1>
            <h1>
                처음 신호 알겠어요/어려워요 개수 (일별): 알겠어요:{" "}
                {firstDayGreens[1].join(", ")} / 어려워요:{" "}
                {firstDayReds[1].join(", ")}
            </h1>
            <h1>
                최종 신호 알겠어요/어려워요 개수 (일별): 알겠어요:{" "}
                {finalDayGreens[1].join(", ")} / 어려워요:{" "}
                {finalDayReds[1].join(", ")}
            </h1>
        </Container>
    );
};

export default withAuthenticator(Analytics);

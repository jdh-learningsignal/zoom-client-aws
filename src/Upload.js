import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Upload.css';
import { API, Storage } from 'aws-amplify';
import { createFiles as createFilesMutation } from './graphql/mutations';
import { withAuthenticator} from '@aws-amplify/ui-react'
import { createHmac } from 'crypto';
import crypto from 'crypto';

const Upload = () => {
    const [affiliation, setAffiliation] = useState('HYU');
    const [name, setName] = useState('');
    const [lectureName, setLectureName] = useState('');
    const [meetingNumber, setMeetingNumber] = useState('');
    const [material, setMaterial] = useState({ name: '', hash: '' });
    const startButtonRef = useRef(null);

    const onChangeFile = async (e) => {
        if (!e.target.files[0]) return;
        
        const file = e.target.files[0];
        const hash = createHmac('sha256', file.name + new Date()).digest('hex');
        setMaterial({ name: file.name, hash: hash });
        
        await Storage.put(hash, file);
        await insertFile(file.name, hash);
        startButtonRef.current.style.display = "inline-block";
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
        <div className="App">
            <div 
                style={{
                    marginTop: "10%",
                }}
            >
                <h6
                    style={{
                        fontWeight: "bold"
                    }}
                >
                    학교
                </h6>
                <select
                    onChange={e => setAffiliation(e.target.value)}
                    style={{
                            marginTop: "0px",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            borderRadius: "5px",
                            width: "230px",
                            height: "25px",
                            fontSize: "15px"
                        }}
                >
                    <option value="HYU">한양대학교</option>
                    <option value="KJWU">광주여자대학교</option>
                    <option value="LTU">루터대학교</option>
                    <option value="BSU">백석대학교</option>
                    <option value="BSCU">백석문화대학교</option>
                    <option value="SMU">상명대학교</option>
                    <option value="EJU">을지대학교</option>
                </select>
            </div>
            <div>
                <h6
                    style={{
                        fontWeight: "bold",
                    }}
                >
                    교수자 이름
                </h6>
                <input
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    placeholder="예) 홍길동"
                    type="text"
                    maxLength="20"
                    style={{
                        marginTop: "0px",
                        marginBottom: "2px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        width: "230px",
                        fontSize: "15px",
                    }}
                ></input>
            </div>
            <div>
                <h6
                    style={{
                        fontWeight: "bold",
                    }}
                >
                    강의 제목
                </h6>
                <input
                    onChange={(e) =>
                        setLectureName(e.target.value)
                    }
                    placeholder="예) AI+X:인공지능 10주차"
                    type="text"
                    maxLength="20"
                    style={{
                        marginTop: "0px",
                        marginBottom: "2px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        width: "230px",
                        fontSize: "15px",
                    }}
                ></input>
            </div>
            <div>
                <h6
                    style={{
                        fontWeight: "bold",
                    }}
                >
                    회의 ID
                </h6>
                <input
                    onChange={(e) => setMeetingNumber(e.target.value.replace(/ /gi, ""))
                    }
                    placeholder="예) 451 551 4600"
                    type="text"
                    maxLength="20"
                    style={{
                        marginTop: "0px",
                        marginBottom: "2px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        width: "230px",
                        fontSize: "15px",
                    }}
                ></input>
            </div>
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
            <div>
                <h6
                    style={{
                        fontWeight: "bold",
                    }}
                >
                    강의자료 업로드 (PDF만 가능)
                </h6>
                <input
                    onChange={onChangeFile}
                    type="file"
                    style={{
                        marginTop: "0px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        width: "230px",
                        fontSize: "15px",
                        display: "inline",
                    }}
                ></input>
            </div>

            <Link
                ref={startButtonRef}
                to={`/lecture/${material.hash}?a=${affiliation}&n=${name}&l=${lectureName}&m=${meetingNumber}`}
                style={{
                    display: "none",
                    backgroundColor: "#2D8CFF",
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
                    width: "11%",
                    margin: "auto",
                    left: "44.5%",
                    bottom: "28%",
                    position: "fixed",
                    textAlign: "center",
                }}
            >
                강의 시작
            </Link>
        </div>
    );
};

export default withAuthenticator(Upload);
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from "styled-components";
import './Upload.css';
import { API, Storage } from 'aws-amplify';
import { createFile as createFileMutation} from './graphql/mutations';
import { withAuthenticator} from '@aws-amplify/ui-react'
import { createHmac } from 'crypto';

import AdminContext from './contexts/admin';

const Upload = () => {
    const context = useContext(AdminContext);
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
          query: createFileMutation, 
          variables: { 
            input: {
                name: name, 
                hash: hash,
                uploadedTime: new Date()
            }
          } 
        });
    };

    return (
        <div className="App">
            <div style={{
                marginTop:"15%"
            }}>
                <h6
                    style={{
                        fontWeight: "bold"
                    }}
                >
                    회의 ID
                </h6>
                <input 
                    onChange={e => context.actions.setMeetingNumber(e.target.value.replace(/ /gi, ''))}
                    placeholder="예) 451 551 4600"
                    type="text"
                    maxLength="20"
                    style={{
                        marginTop: "0px",
                        marginBottom: "2px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        width: "230px",
                        fontSize: "15px"
                    }}
                >
                </input>
            </div>
            <div>
                <h6
                    style={{
                        fontWeight: "bold"
                    }}
                >
                    암호
                </h6>
                <input 
                    onChange={e => context.actions.setPassWord(e.target.value)}
                    placeholder="예) 951810"
                    type="text"
                    style={{
                            marginTop: "0px",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            width: "230px",
                            fontSize: "15px"
                        }}
                >
                </input>
            </div>
            <div>
                <h6
                    style={{
                        fontWeight: "bold"
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
                        display: "inline"
                    }}
                >
                </input>
            </div>

            <Link ref={startButtonRef} to={`/lecture/${material.hash}`} 
                style={{
                    display:"none",
                    marginTop: "50px",
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
                    width: "10%",
                    margin: "auto",
                    left:"45%",
                    position:"fixed",
                    textAlign: "center"
                }}
            >
                강의 시작
            </Link>
        </div>
    );
};

export default withAuthenticator(Upload);
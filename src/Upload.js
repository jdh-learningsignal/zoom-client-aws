import { React, useState, useEffect, useRef, Fragment } from 'react';
import { Route, Link, useParams } from 'react-router-dom';
import styled from "styled-components";
import './Upload.css';
import Lecture from './Lecture';
import { API, Storage } from 'aws-amplify';
import { createFile as createFileMutation} from './graphql/mutations';
import { withAuthenticator, AmplifySignOut, AmplifyLink } from '@aws-amplify/ui-react'
import { createHmac } from 'crypto';

const Upload = () => {
    const [material, setMaterial] = useState({ name: '', hash: '' });
    const startButtonRef = useRef(null);

    const onChangeFile = async (e) => {
        if (!e.target.files[0]) return;

        const file = e.target.files[0];
        const hash = createHmac('sha256', file.name).update(new Date()).digest('hex');
        setMaterial({ name: file.name, hash: hash });
        
        await Storage.put(hash, file);
        await insertFile(file.name, hash);
        startButtonRef.current.style.display = "inline-block" 
    };

    const insertFile = async (name, hash) => {
        if (!name || !hash) return;
    
        await API.graphql({ 
          query: createFileMutation, 
          variables: { 
            input: {
                name: name, 
                hash: hash
            }
          } 
        });
    };

    return (
        <>
            <div class="container">
                <div class="row">
                    <div class="col-md-6">
                        <form method="post" action="#" id="#">
                            <div class="form-group files">
                                <label for="formFileLg" class="form-label">강의 자료 업로드</label>
                                <input onChange={onChangeFile} type="file" class="form-control" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Link ref={startButtonRef} to={`/lecture/${material.hash}`} 
                style={{
                    display:"none",
                    marginTop: "20px",
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
                    left:"25%",
                    position:"fixed"
                }}
            >
                강의 시작
            </Link>
        </>
    );
};

export default withAuthenticator(Upload);
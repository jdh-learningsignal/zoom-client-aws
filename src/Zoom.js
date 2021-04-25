import React, { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-bootstrap';
import styled from "styled-components";
import { API } from 'aws-amplify';
import { createTraffic as createTrafficMutation } from './graphql/mutations';
import { ZoomMtg } from '@zoomus/websdk';
import { createHmac } from 'crypto';
import { useLocation } from 'react-router-dom';
import { listPages } from './graphql/queries';
import config from './config';

import './Zoom.css';

ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.1/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

const href = window.location.href;
const leaveUrl = href.includes("localhost") ? config.localUrl : href.includes("amplifyapp") ? config.devUrl : config.realUrl;
const role = 0;

const Zoom = () => {
  const [userName, setUserName] = useState('NULL');
  const [studentId, setStudentId] = useState('NULL');
  const [affiliation, setAffiliation] = useState('HYU');
  const [pageNumber, setPageNumber] = useState(0);
  const [feedText, setFeedText] = useState('');
  const divTL = useRef(null);
  const feedAlertRef = useRef(null);
  const query = new URLSearchParams(useLocation().search);
  const meetingNumber = query.get("meetingNumber");
  const passWord = query.get("passWord");

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
    background-color: ${props => props.color || "white"};
    font-size: revert;
    font-weight: bold;
    text-decoration:none;
    position:relative;
    
    &:hover {
      background-color: #fff;
      box-shadow: 0px 15px 20px rgba(0, 0, 0, 0.5);
      color: #000;
      transform: translateY(-2px);
    }

    &:active {
      top:5px;
      left:5px;
    }
    
    &:active:after {
      border:0;
    }
  `;
  
  useEffect(() => {}, []);

  function generateSignature() {
    const timestamp = new Date().getTime() - 30000;
    const msg = Buffer.from(config.apiKey + meetingNumber + timestamp + role).toString('base64');
    const hmac = createHmac('sha256', config.apiSecret).update(msg).digest('base64');
    const signature = Buffer.from(`${config.apiKey}.${meetingNumber}.${timestamp}.${role}.${hmac}`).toString('base64');
    return signature;
  }

  function startMeeting() {
    document.getElementById('zmmtg-root').style.display = 'block';
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
          success: (success) => {
            divTL.current.style.display = "flex";

            window.addEventListener('beforeunload', (event) => {
              event.preventDefault();
              event.returnValue = '';
              ZoomMtg.endMeeting({});
            });
          },
          error: (error) => {
            console.log(error)
          }
        })
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  const sendTraffic = async (value) => {
    if (!value || !studentId || !affiliation || !meetingNumber || !query.get('hash')) return;

    const apiData = await API.graphql({ 
      query: listPages,
      variables: {
        filter: {
          hash: {
            eq: query.get('hash')
          }
        }
      }
    });

    const pages = apiData.data.listPages.items.map((value) => value.pageNumber);
    let maxPageNumber = Math.max(...pages);

    if (!isFinite(maxPageNumber)) {
      maxPageNumber = 1;
    } else {
      maxPageNumber = maxPageNumber + 1;
    }

    if (maxPageNumber > pageNumber) {
      await API.graphql({ 
        query: createTrafficMutation, 
        variables: { 
          input: {
            studentId: studentId, 
            affiliation: affiliation,
            meetingId: meetingNumber,
            hash: query.get('hash'),
            pageNumber: maxPageNumber,
            state: value,
            dateTime: new Date()
          }
        } 
      });

      setPageNumber(maxPageNumber);
    } else {
      return ;
    }    
  }

  const onClickButton = e => {
    sendTraffic(e.target.value);
  };

  return (
    <div className="App">
      <div 
        style={{
            marginTop:"15%"
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
            fontWeight: "bold"
          }}
        >
          이름
        </h6>
        <input 
              onChange={e => setUserName(e.target.value)}
              placeholder="예) 홍길동"
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
          }}>학번</h6>
        <input 
              onChange={e => setStudentId(e.target.value)}
              placeholder="예) 2021123123"
              type="text"
              style={{
                    marginTop: "0px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    width: "230px",
                    fontSize: "15px"
                  }}>
        </input>
      </div>
      <main>
        <button onClick={startMeeting}
                style={{
                  marginTop: "20px",
                  backgroundColor: "#2D8CFF",
                  color: "#ffffff",
                  textDecoration: "none",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  paddingLeft: "40px",
                  paddingRight: "40px",
                  display: "inline-block",
                  borderRadius: "10px",
                  cursor: "pointer",
                  border: "none",
                  outline: "none"
                }}>수업 참가
        </button>
      </main>

      <div ref={divTL} style={{display:"none"}}>
        <div 
        style={{
          position:"fixed", 
          bottom:"152px", 
          left:"3%", 
          zIndex:"100000"}}>
          <TrafficButton onClick={onClickButton} color="red" value="RED">
            어려<br/>워요
          </TrafficButton>
        </div>
        <div 
        style={{
          position:"fixed", 
          bottom:"87px", 
          left:"3%",
          zIndex:"100000"}}>
          <TrafficButton onClick={onClickButton} color="green" value="GREEN">
            알겠<br/>어요
          </TrafficButton>
        </div>
      </div>
      <Alert ref={feedAlertRef} variant="secondary">
        {feedText}
      </Alert>
    </div>
  );
};

export default Zoom;
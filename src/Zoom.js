import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
import { API } from 'aws-amplify';
import { createTraffic as createTrafficMutation } from './graphql/mutations';
import { ZoomMtg } from '@zoomus/websdk';
import { createHmac } from 'crypto';
import { useLocation } from 'react-router-dom';

import './Zoom.css';

ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.1/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

const apiKey = 'gpyibdvWRaKeXWf_1x3yZA';
const apiSecret = 'LmDzEXT9nxRv7SCI2rwXn82phJDuOCzQDRtB';
const devUrl = "https://master.dg7q46trqte00.amplifyapp.com/";
const realUrl = "https://zoom-client.learningsignal.com/";

const href = window.location.href;
const leaveUrl = href.includes("localhost") ? "http://localhost:3000" : href.includes("amplifyapp") ? devUrl : realUrl;
const role = 0;

const Zoom = () => {
  const [userName, setUserName] = useState('');
  const [studentId, setStudentId] = useState('');
  const divTL = useRef(null);
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
    const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64');
    const hash = createHmac('sha256', apiSecret).update(msg).digest('base64');
    const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');
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
          apiKey: apiKey,
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
    if (!value || !studentId) return;

    await API.graphql({ 
      query: createTrafficMutation, 
      variables: { 
        input: {
          studentId: studentId, 
          meetingId: meetingNumber,
          hash: query.get('hash'),
          state: value,
          dateTime: new Date()
        }
      } 
    });
  }

  const onClickButton = e => {
    sendTraffic(e.target.value);
  };

  return (
    <div className="App">
      <div style={{
            marginTop:"15%"
          }}>
        <h6
          style={{
            fontWeight: "bold"
          }}>이름</h6>
        <input 
              onChange={e => setUserName(e.target.value)}
              placeholder="예) 정동훈"
              type="text"
              maxLength="20"
              style={{
                    marginTop: "0px",
                    marginBottom: "2px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    borderRadius: "5px",
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
              placeholder="예) 2021278706"
              type="text"
              style={{
                    marginTop: "0px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    borderRadius: "5px",
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
    </div>
  );
};

export default Zoom;
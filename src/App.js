import {React, useState, useEffect, useRef} from 'react';
import styled from "styled-components";
// import logo from './logo.svg';
import './App.css';
import { API } from 'aws-amplify';
import { createTraffic as createTrafficMutation} from './graphql/mutations';
import { ZoomMtg } from '@zoomus/websdk';
import { createHmac } from 'crypto';

ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.1/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

const crypto = require('crypto');

function App() {
  const apiKey = 'gpyibdvWRaKeXWf_1x3yZA';
  const apiSecret = 'LmDzEXT9nxRv7SCI2rwXn82phJDuOCzQDRtB';
  const meetingNumber = '8476497784';
  const passWord = 'u4UrS5';
  let role = 0;
  let leaveUrl = window.location.href.includes("localhost") ? "http://localhost:3000":"https://master.dg7q46trqte00.amplifyapp.com/";

  const [userName, setUserName] = useState('');
  const [studentId, setStudentId] = useState('');

  const divTL = useRef(null);

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

    &:hover {
      background-color: #fff;
      box-shadow: 0px 15px 20px rgba(0, 0, 0, 0.5);
      color: #000;
      transform: translateY(-2px);
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
            divTL.current.style.display = "flex"
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

  async function sendTraffic(state) {
    if (!state || !studentId) return;

    await API.graphql({ 
      query: createTrafficMutation, 
      variables: { 
        input: {
          studentId: studentId, 
          meetingId: meetingNumber, 
          state: state,
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
                  }}></input>
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
          bottom:"282px", 
          right:"0%", 
          right:"0", 
          zIndex:"100000"}}>
          <TrafficButton onClick={onClickButton} color="red" value="RED">
            어려<br/>워요
          </TrafficButton>
        </div>
        <div 
        style={{
          position:"fixed", 
          bottom:"217px", 
          right:"0%", 
          right:"0", 
          zIndex:"100000"}}>
          <TrafficButton onClick={onClickButton} color="grey" value="GREY">
            지루<br/>해요
          </TrafficButton>
        </div>
        <div 
        style={{
          position:"fixed", 
          bottom:"152px", 
          right:"0%", 
          right:"0", 
          zIndex:"100000"}}>
          <TrafficButton onClick={onClickButton} color="yellow" value="YELLOW">
            헷갈<br/>려요
          </TrafficButton>
        </div>
        <div 
        style={{
          position:"fixed", 
          bottom:"87px", 
          right:"0%", 
          right:"0", 
          zIndex:"100000"}}>
          <TrafficButton onClick={onClickButton} color="green" value="GREEN">
            알겠<br/>어요
          </TrafficButton>
        </div>
      </div>
    </div>
  );
}

export default App;
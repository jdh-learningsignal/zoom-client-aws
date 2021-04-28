import React, { useState, useEffect, useRef, useContext } from 'react';
import { Alert } from 'react-bootstrap';
import styled from "styled-components";
import { API } from 'aws-amplify';
import { 
  createTraffic as createTrafficMutation, 
  createAttendance as createAttendanceMutation 
} from './graphql/mutations';
import { listAttendances } from './graphql/queries';
import { ZoomMtg } from '@zoomus/websdk';
import { createHmac } from 'crypto';
import { useLocation } from 'react-router-dom';
import { listPages } from './graphql/queries';
import config from './config';
import crypto from 'crypto';
import AttendanceContext from './contexts/attendance';

import './Zoom.css';

ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.1/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

const href = window.location.href;
const agent = window.navigator.userAgent;
const leaveUrl = href.includes("localhost") ? config.localUrl : href.includes("amplifyapp") ? config.devUrl : config.realUrl;
const role = 0;

const Zoom = () => {
  const [userName, setUserName] = useState('NULL');
  const [studentId, setStudentId] = useState('NULL');
  const [affiliation, setAffiliation] = useState('HYU');
  const [pageNumber, setPageNumber] = useState(0);
  const [prevFeedTime, setPrevFeedTime] = useState(new Date());
  const divTL = useRef(null);
  const context = useContext(AttendanceContext);
  const query = new URLSearchParams(useLocation().search);
  const meetingNumber = query.get("m");
  const hash = query.get('h');

  let passWord = query.get("p");
  if (passWord) {
    const decipher = crypto.createDecipher('aes-256-cbc', 'key');
    let result2 = decipher.update(passWord, 'hex', 'utf8');
    result2 += decipher.final('utf8');
    passWord = result2;
  }

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

  const onOut = (event) => {
    event.preventDefault();
    event.returnValue = '';
    
    API.graphql({ 
      query: createAttendanceMutation, 
      variables: { 
        input: {
          hash: hash,
          meetingId: meetingNumber,
          userName: userName,
          studentId: studentId,
          affiliation: affiliation,
          state: 'OUT',
          device: agent,
          dateTime: new Date()
        }
      } 
    });
    context.actions.setIsIn(false);
    ZoomMtg.endMeeting({});
  };

  function startMeeting(e) {
    e.preventDefault();
    e.stopPropagation();

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
          success: async (success) => {
            divTL.current.style.display = "flex";

            const apiData = await API.graphql({
              query: listAttendances,
              variables: {
                filter: {
                  hash: {
                    eq: hash
                  },
                  studentId: {
                    eq: studentId
                  },
                  affiliation: {
                    eq: affiliation
                  }
                }
              }
            });
            
            const items = apiData.data.listAttendances.items;

            if (!context.state.isIn && items.length % 2 === 0) {
              API.graphql({ 
                query: createAttendanceMutation, 
                variables: {
                  input: {
                    hash: hash,
                    meetingId: meetingNumber,
                    userName: userName,
                    studentId: studentId,
                    affiliation: affiliation,
                    state: 'IN',
                    device: agent,
                    dateTime: new Date()
                  }
                } 
              });

              context.actions.setIsIn(true);
            };
            
            window.removeEventListener('beforeunload', onOut);
            window.addEventListener('beforeunload', onOut);
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
    const currentTime = new Date();
    if (currentTime.getTime() - prevFeedTime.getTime() < 3000) return ;
    if (!value || !studentId || !affiliation || !meetingNumber || !hash) return ;

    const apiData = await API.graphql({ 
      query: listPages,
      variables: {
        filter: {
          hash: {
            eq: hash
          }
        }
      }
    });

    setPrevFeedTime(currentTime);

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
            hash: hash,
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

  if (!hash || !meetingNumber) {
    return (
      <h1></h1>
    );
  }

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
    </div>
  );
};

export default Zoom;
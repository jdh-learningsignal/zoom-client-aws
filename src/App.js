import {React, useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { API } from 'aws-amplify';
import { listTraffics } from './graphql/queries';
import { createTraffic as createTrafficMutation} from './graphql/mutations';

const initialTrafficState = { studentId: 'rapido300@hanyang.ac.kr', meetingId: '1000000000', state: ''}

function App() {
  const [trafficData, setTrafficData] = useState(initialTrafficState);

  useEffect(() => {}, []);

  async function sendTraffic() {
    if (!trafficData.name || !trafficData.description) return;
    await API.graphql({ query: createTrafficMutation, variables: { input: trafficData } });
    setTrafficData(initialTrafficState);
  }

  function onClickButton(e) {
    setTrafficData({ ...trafficData, 'state': e.target.value});
    sendTraffic();
  }

  return (
    <div className="App">
      <h1>Traffic Test</h1>
      <div style={{display:"flex", position:"fixed", top:"80%", left:"70%", right:"0"}}>
        <button onClick={onClickButton}
                placeholder="매우 어려움"
                value="RED"
                style={{backgroundColor:"red", width:"100px", height:"100px"}}
        />
        <button onClick={onClickButton}
                placeholder="약간 어려움"
                value="YELLOW"
                style={{backgroundColor:"yellow", width:"100px", height:"100px"}}
        />
        <button onClick={onClickButton}
                placeholder="너무 쉬움"
                value="GREEN"
                style={{backgroundColor:"green", width:"100px", height:"100px"}}
        />
      </div>
    </div>
  );
}

export default App;
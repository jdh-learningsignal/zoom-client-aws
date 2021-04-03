import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Traffic Test</h1>
      <div style={{display:"flex", position:"fixed", top:"80%", left:"70%", right:"0"}}>
        <button onClick={e => {}}
                placeholder="매우 어려움"
                value="RED"
                style={{backgroundColor:"red", width:"100px", height:"100px"}}
        />
        <button onClick={e => {}}
                placeholder="약간 어려움"
                value="YELLOW"
                style={{backgroundColor:"yellow", width:"100px", height:"100px"}}
        />
        <button onClick={e => {}}
                placeholder="너무 쉬움"
                value="GREEN"
                style={{backgroundColor:"green", width:"100px", height:"100px"}}
        />
      </div>
    </div>
  );
}

export default App;
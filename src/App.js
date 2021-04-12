import { React, Fragment } from 'react';
import { Route } from 'react-router-dom';
import Zoom from './Zoom';
import Upload from './Upload';
import Lecture from './Lecture';

import './App.css';
// import logo from './logo.svg';

const App = () => {
  return (
    <Fragment>
      <Route exact path="/" component={Zoom} />
      <Route path="/admin" component={Upload} />
      <Route path="/lecture/:hash" component={Lecture} />
    </Fragment>
  );
}

export default App;
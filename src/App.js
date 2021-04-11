import {React, Fragment} from 'react';
import { Route } from 'react-router-dom';
import Zoom from './Zoom';
import Lecture from './Lecture';

// import logo from './logo.svg';
import './App.css';

const App = () => {
  return (
    <Fragment>
      <Route path="/" component={Zoom} exact={true} />
      <Route path="/Lecture" component={Lecture} />
    </Fragment>
  );
}

export default App;
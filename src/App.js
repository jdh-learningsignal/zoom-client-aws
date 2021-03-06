import { React, Fragment } from 'react';
import { Route } from 'react-router-dom';

import Main from "./Main";
import Class from "./Class";
import Zoom from './Zoom';
import Upload from './Upload';
import Lecture from './Lecture';
import Archive from "./Archive";
import Analytics from "./Analytics";
import { AdminProvider } from './contexts/admin';

import './App.css';
// import logo from './logo.svg';

const App = () => {
  return (
      <AdminProvider>
          <Fragment>
              <Route exact path="/" component={Main} />
              <Route path="/class" component={Class} />
              <Route path="/attendance" component={Zoom} />
              <Route path="/admin" component={Upload} />
              <Route path="/archive" component={Archive} />
              <Route path="/lecture/:hash" component={Lecture} />
              <Route path="/analytics" component={Analytics} />
          </Fragment>
      </AdminProvider>
  );
}

export default App;
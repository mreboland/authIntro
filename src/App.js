import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import Login from "./components/Login";
import Main from "./components/Main";
import SignUp from "./components/SignUp";

function App() {
  const [user, setUser] = useState(undefined);
  
  const getUser = useCallback(async function() {
    try {
      const response = await fetch("/api/users/me");
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message);
      }

      setUser(json.data);
    } catch (err) {
      console.log("error?");
      setUser(undefined);
      console.log({ err });
    }
  }, [])

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route
            exact
            path="/login"
            render={props => {
              if (user) {
                return <Redirect to="/" />;
              }

              return <Login getUser={getUser} {...props} />;
            }}
          />
          <Route
            exact
            path="/signup"
            render={props => {
              if (user) {
                return <Redirect to="/" />;
              }
              return <SignUp getUser={getUser} updateUser={setUser} {...props} />;
            }}
          />
          <Route
            path="/"
            render={props => {
              if (!user) {
                return <Redirect to="/login" />;
              }

              return <Main {...props} />;
            }}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;

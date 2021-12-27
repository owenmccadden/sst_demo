import React, { useState, useEffect } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import './App.css';
import { AppContext } from "./lib/contextLib";
import { Auth } from "aws-amplify";
import Routing from "./Routing";

function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [AuthenticateUser, setAuthenticateUser] = useState(false);
  let navigate = useNavigate();

  async function handleLogout() {
    await Auth.signOut();
    setAuthenticateUser(false);
    navigate("/login");
  }

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      setAuthenticateUser(true);
    }
    catch (e) {
      if (e != "No current user") {
        alert(e);
      }
    }

    setIsAuthenticating(false);
  }

  return (
    !isAuthenticating && (
      <div className="App container py-3">
        <Navbar collapseOnSelect bg='light' expand="md" className="mb-3">
          <Navbar.Brand className="font-weight-bold text-muted" as={Link} to="/">
            Scratch
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {AuthenticateUser ? (
                <>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                  <Nav.Link as={Link} to="/settings">Settings</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider value={{ AuthenticateUser, setAuthenticateUser }}>
          <Routing/>
        </AppContext.Provider>
      </div>
    )
  );
}

export default App;

import React, { useNavigate } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Routes, Route, Link } from "react-router-dom";
import Home from './containers/Home';
import './App.css';
import NotFound from "./containers/NotFound";

function App() {
  return (
    <div className="App container py-3">
      <Navbar collapseOnSelect bg='light' expand="md" className="mb-3">
          <Navbar.Brand className="font-weight-bold text-muted" as={Link} to="/">
            Scratch
          </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav activeKey={window.location.pathname}>
              <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route path="/signup" element={<Home/>}/>
            <Route path="/login" element={<Home/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    </div>
  );
}

export default App;

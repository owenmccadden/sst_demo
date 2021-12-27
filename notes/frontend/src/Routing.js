import React from 'react'
import { Routes, Route } from "react-router-dom";

import Signup from "./containers/Signup";
import NewNote from "./containers/NewNote";
import Notes from "./containers/Notes";
import Settings from "./containers/Settings";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Home from './containers/Home';

import RequireAuth from './components/RequireAuth';

const Routing = () => {
    return (
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<RequireAuth />}>
                <Route path="/notes/new" element={<NewNote />} />
                <Route path="/notes/:id" element={<Notes />} />
                <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default Routing

import { API } from "aws-amplify";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { BsPencilSquare } from "react-icons/bs";
import { useAppContext } from "../lib/contextLib";
import { onError } from "../lib/errorLib";
import "./HomeStyles.css";

const Home = () => {
    const [notes, setNotes] = useState([]);
    const { AuthenticateUser } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);

    function loadNotes() {
        return API.get("notes", "/notes");
    }

    useEffect(() => {
        async function onLoad() {
            if (!AuthenticateUser) {
                return;
            }

            try {
                const notes = await loadNotes();
                setNotes(notes);
            } catch (e) {
                onError(e);
            }

            setIsLoading(false);
        }

        onLoad();
    }, [AuthenticateUser]);

    function renderNotesList(notes) {
        return (
            <>
                <ListGroup to="/notes/new" as={Link}>
                    <ListGroup.Item action className="py-3 text-nowrap text-truncate">
                        <BsPencilSquare size={17} />
                        <span className="ml-2 font-weight-bold">Create a new note</span>
                    </ListGroup.Item>
                </ListGroup>
                {notes.map(({ noteId, content, createdAt }) => (
                    <ListGroup as={Link} key={noteId} to={`/notes/${noteId}`}>
                        <ListGroup.Item action>
                            <span className="font-weight-bold">
                                {content.trim().split("/n")[0]}
                            </span>
                            <br/>
                            <span className="text-muted">
                                Created: {new Date(createdAt).toLocaleString()}
                            </span>
                        </ListGroup.Item>
                    </ListGroup>
                ))}
            </>
        );
    }

    function renderLander() {
        return (
            <div className="lander">
                <h1>Scratch</h1>
                <p className="text-muted">A simple note taking app</p>
            </div>
        )
    }

    function renderNotes() {
        return (
            <div className="notes">
                <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
                <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
            </div>
        );
    }

    return (
        <div className="Home">
            {AuthenticateUser ? renderNotes() : renderLander()}
        </div>
    );
}

export default Home
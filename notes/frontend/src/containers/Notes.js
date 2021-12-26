import React, {useRef, useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../lib/errorLib";
import { config } from "aws-sdk";
import { Form } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./NotesStyles.css";
import { s3Upload } from "../lib/awsLib";

export default function Notes() {
    const file = useRef(null);
    const { id } = useParams();
    let navigate = useNavigate();
    const [note, setNote] = useState(null);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        function loadNote() {
            return API.get("notes", `/notes/${id}`);
        }

        async function onLoad() {
            try {
                const tempNote = await loadNote();
                const { content, attachment } = tempNote;
                if (attachment) {
                    tempNote.attachmentURL = await Storage.vault.get(attachment);
                }

                setContent(content);
                setNote(tempNote);
            } catch (e) {
                onError(e);
            }
        }

        onLoad();
    }, [id]);

    function validateForm() {
        return content.length > 0;
    }

    function formatFilename(str) {
        return str.replace(/^\w+-/, "");
    }

    function handleFileChange(event) {
        file.current = event.target.files[0];
    }

    function saveNote(note) {
        return API.put("notes", `/notes/${id}`, {
            body: note
        });
    }

    async function handleSubmit(event) {
        let attachment;
        event.preventDefault();

        if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
            alert(
                `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`
            );
            return;
        }
        setIsLoading(true);

        try {
            if (file.current) {
                attachment = await s3Upload(file.current);
            }

            await saveNote({
                content,
                attachment: attachment || note.attachment
            });
            navigate("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    function deleteNote() {
        return API.del("notes", `/notes/${id}`);
    }

    async function handleDelete(event) {
        event.preventDefault();

        const confirmed = window.confirm(
            "Are you sure you want to delete this note?"
        );

        if (!confirmed) {
            return;
        }

        setIsDeleting(true);

        try {
            await deleteNote();
            navigate("/");
        } catch (e) {
            onError(e);
            setIsDeleting(false);
        }
    }

    return (
        <div className="Notes">
            {note && (
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="content" className="mb-3">
                        <Form.Control
                            as="textarea"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="content" className="mb-3">
                        <Form.Label>Attachment</Form.Label>
                        {note.attachment && (
                            <p>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={note.attachmentURL}
                                >
                                    {formatFilename(note.attachment)}
                                </a>
                            </p>
                        )}
                        <Form.Control onChange={handleFileChange} type="file"/>
                    </Form.Group>
                    <LoaderButton
                        size="lg"
                        type="submit"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                        className="mb-3"
                    >
                        Save
                    </LoaderButton>
                    <LoaderButton
                        size="lg"
                        variant="danger"
                        onClick={handleDelete}
                        isLoading={isDeleting}
                        className="mb-3 justify-content-end"
                    >
                        Delete
                    </LoaderButton>
                </Form>
            )}
        </div>
    );
}
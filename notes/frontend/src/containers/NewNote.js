import React, { useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoaderButton from '../components/LoaderButton';
import { onError } from '../lib/errorLib';
import config from '../config';
import { API } from "aws-amplify";
import "./NewNoteStyles.css";
import { s3Upload } from '../lib/awsLib';

export default function NewNote() {
    const file = useRef(null);
    let navigate = useNavigate();
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return content.length > 0;
    }

    function handleFileChange(event) {
        file.current = event.target.files[0];
    }

    function createNote(note) {
        return API.post("notes", "/notes", {body: note});
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
            alert(
                `Please select a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`
            );
            return;
        }
        setIsLoading(true);

        try {
            const attachment = file.current ? await s3Upload(file.current) : null;
            await createNote({content, attachment});
            navigate("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    return (
        <div className='NewNote'>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId='content'>
                    <Form.Control
                        value={content}
                        as="textarea"
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId='file'>
                    <Form.Label>Attachment</Form.Label>
                    <Form.Control
                        onChange={handleFileChange}
                        type="file"
                    />
                </Form.Group>
                <LoaderButton
                    type="submit"
                    size="lg"
                    variant="primary"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Create
                </LoaderButton>
            </Form>
        </div>
    );
}

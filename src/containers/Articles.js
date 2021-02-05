import React, { useRef, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { API, Storage } from 'aws-amplify';
import { onError } from '../libs/errorLib';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import LoaderButton from '../components/LoaderButton';
import config from '../config';
import './Articles.css';
import { s3Upload } from '../libs/awsLib';
import Stackedit from 'stackedit-js';
import ReactMarkdown from 'react-markdown';

export default function Article() {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [article, setArticle] = useState(null);
  const [content, setContent] = useState('');
  const [isEdited, setIsEdited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (content && article && article.content !== content) setIsEdited(true);
    else setIsEdited(false);
  }, [content, article]);

  useEffect(() => {
    function loadArticle() {
      return API.get('articles', `/articles/${id}`);
    }

    async function onLoad() {
      try {
        const article = await loadArticle();
        const { content, attachment } = article;

        if (attachment) {
          article.attachmentURL = await Storage.vault.get(attachment);
        }

        setContent(content);
        setArticle(article);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function handleEdit() {
    const stackedit = new Stackedit();
    console.log(content);
    stackedit.openFile({
      content: {
        text: content,
      },
    });

    stackedit.on('fileChange', (file) => {
      console.log(file.content.text);
      setContent(file.content.text);
    });
  }

  function validateForm() {
    return content.length > 0;
  }

  function formatFilename(str) {
    return str.replace(/^\w+-/, '');
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  function saveArticle(article) {
    return API.put('articles', `/articles/${id}`, {
      body: article,
    });
  }

  async function handleSubmit(event) {
    let attachment;

    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      if (file.current) {
        attachment = await s3Upload(file.current);
      }

      await saveArticle({
        content,
        attachment: attachment || article.attachment,
      });
      history.push('/');
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function deleteArticle() {
    return API.del('articles', `/articles/${id}`);
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      'Are you sure you want to delete this article?'
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteArticle();
      history.push('/');
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  return (
    <div className="Articles">
      {article && (
        <Form onSubmit={handleSubmit}>
          {isEdited && (
            <Alert variant="danger">
              You have unsaved changes! To save changes made in the markdown
              editor press the blue save button at the bottom of this page.
            </Alert>
          )}
          <ReactMarkdown className="markdown-preview" source={content} />
          <Form.Group controlId="file">
            <Form.Label>Attachment</Form.Label>
            {article.attachment && (
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={article.attachmentURL}
                >
                  {formatFilename(article.attachment)}
                </a>
              </p>
            )}
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group>
          <LoaderButton
            block
            size="lg"
            variant="warning"
            onClick={handleEdit}
            isLoading={false}
          >
            Edit
          </LoaderButton>
          <LoaderButton
            block
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            size="lg"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </Form>
      )}
    </div>
  );
}

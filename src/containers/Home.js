import React, { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { LinkContainer } from 'react-router-bootstrap';
import { BsPencilSquare } from 'react-icons/bs';
import { API } from 'aws-amplify';
import { useAppContext } from '../libs/contextLib';
import { onError } from '../libs/errorLib';
import './Home.css';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const articles = await loadArticles();
        setArticles(articles);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadArticles() {
    return API.get('articles', '/articles');
  }

  function renderArticlesList(artilces) {
    return (
      <>
        <LinkContainer to="/articles/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Create a new article</span>
          </ListGroup.Item>
        </LinkContainer>
        {articles.map(({ articleId, content, createdAt }) => (
          <LinkContainer key={articleId} to={`/articles/${articleId}`}>
            <ListGroup.Item action>
              <span className="font-weight-bold">
                {content.trim().split('\n')[0]}
              </span>
              <br />
              <span className="text-muted">
                Created: {new Date(createdAt).toLocaleString()}
              </span>
            </ListGroup.Item>
          </LinkContainer>
        ))}
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Starship</h1>
        <p className="text-muted">Bulls Of Brass content management</p>
      </div>
    );
  }

  function renderArticles() {
    return (
      <div className="articles">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Articles</h2>
        <ListGroup>{!isLoading && renderArticlesList(articles)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderArticles() : renderLander()}
    </div>
  );
}

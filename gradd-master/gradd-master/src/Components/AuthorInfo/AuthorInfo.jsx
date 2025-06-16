import React from 'react';

const AuthorInfo = ({ authorInfo }) => {
  if (!authorInfo) return null;

  return (
    <div className="author-section">
      <h2>About the Author</h2>
      <div className="author-content">
        <img src={authorInfo.image} alt={authorInfo.name} className="author-image" />
        <div className="author-details">
          <h3>{authorInfo.name}</h3>
          <p>{authorInfo.description}</p>
          <a href={authorInfo.link} target="_blank" rel="noopener noreferrer">Read more on Wikipedia</a>
        </div>
      </div>
    </div>
  );
};

export default AuthorInfo;
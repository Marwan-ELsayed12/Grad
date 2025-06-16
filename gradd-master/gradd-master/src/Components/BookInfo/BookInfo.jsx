import React from 'react';

const BookInfo = ({ book }) => {
  return (
    <div className="book-info">
      <div className="book-info-header">
        <h2>{book.title}</h2>
        <div className="book-rating">{book.rating} ★</div>
      </div>

      <p className="book-author">By {book.authors}</p>
      <p className="book-description">{book.description}</p>

      <div className="book-details">
        <div className="detail-item">
          <span className="detail-label">ISBN:</span>
          <span className="detail-value">{book.asin}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Format:</span>
          <span className="detail-value">{book.format}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Published:</span>
          <span className="detail-value">{book.published}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Language:</span>
          <span className="detail-value">{book.language}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Genre:</span>
          <span className="detail-value">{book.genres}</span>
        </div>
      </div>
    </div>
  );
};

export default BookInfo;


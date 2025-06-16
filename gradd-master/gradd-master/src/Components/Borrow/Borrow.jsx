import React, { useState, useEffect } from 'react';
import './Borrow.css';  
import BookSwiper from '../BookSwiper/BookSwiper';

const Borrow = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchMostBorrowedBooks = async () => {
      try {
        const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=fiction');
        const data = await response.json();

      
        const formattedBooks = data.items.map(book => ({
          id: book.id,
          title: book.volumeInfo.title,
          image: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x195?text=No+Image',
          new_price: book.saleInfo && book.saleInfo.retailPrice ? book.saleInfo.retailPrice.amount : 'N/A',
        }));

        setBooks(formattedBooks);
      } catch (error) {
        console.error('Failed to fetch most borrowed books:', error);
      }
    };

    fetchMostBorrowedBooks();
  }, []);

  return (
    <div className="borrow">
      <h1>Most Borrowed Books</h1>
      
      <BookSwiper data={books} />
    </div>
  );
};

export default Borrow;

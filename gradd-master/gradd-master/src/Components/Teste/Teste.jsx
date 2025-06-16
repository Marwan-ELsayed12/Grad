import React, { useState, useEffect } from 'react';
import './Teste.css';
import BookSwiper from '../BookSwiper/BookSwiper';
import illustration from '../Images/photo_2024-12-21_19-23-24.jpg';
import { Link } from 'react-router-dom';

const Teste = () => {
  const [books, setBooks] = useState([]); 

  //  Books API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=fiction');
        const data = await response.json();
        const formattedBooks = data.items.map((book) => ({
          id: book.id,
          title: book.volumeInfo.title,
          image: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'default_image_url',  // في حال عدم وجود صورة
          new_price: book.saleInfo.retailPrice ? book.saleInfo.retailPrice.amount : 'N/A',  // في حال عدم وجود سعر
        }));
        setBooks(formattedBooks); 
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []); 

  return (
    <div className="teste">
      <div className="mm"></div>
      <div className="oo"></div>
      <h1>Based On Your Teste</h1>
      <hr />
      
      <BookSwiper data={books} /> 
      <div className="flex-container">
        <div className="illustration">
          <img src={illustration} alt="ill" />
        </div>
        <div className="Quote">
          <p>LIVE AS IF YOU WERE TO DIE TOMORROW,<span> LEARN AS IF YOU WERE TO LIVE FOREVER</span></p>
        
<button>
  <Link to="/my-books" className="link-button">My Books</Link>
</button>
        </div>
      </div>
    </div>
  );
};

export default Teste;


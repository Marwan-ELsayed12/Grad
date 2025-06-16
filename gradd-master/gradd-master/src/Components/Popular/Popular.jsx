import React, { useState, useEffect } from 'react';
import './Popular.css';
import BookSwiper from '../BookSwiper/BookSwiper';

const Popular = () => {
  const [books, setBooks] = useState([]);

  // جلب البيانات من Google Books API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=fiction');
        const data = await response.json();
        const formattedBooks = data.items.map((book) => ({
          id: book.id,
          title: book.volumeInfo.title,
          image: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'default_image_url',  // استخدام صورة افتراضية في حال عدم وجود صورة
          new_price: book.saleInfo.retailPrice ? book.saleInfo.retailPrice.amount : 'N/A',  // في حال عدم وجود سعر
        }));
        setBooks(formattedBooks); // تعيين البيانات المحملة
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="popular">
      <h1>POPULAR BOOKS</h1>
      <hr />
      {/* تمرير البيانات للمكون BookSwiper */}
      <BookSwiper data={books} />
    </div>
  );
};

export default Popular;




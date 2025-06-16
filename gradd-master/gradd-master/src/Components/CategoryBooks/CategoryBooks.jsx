import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CategoryBooks.css';
import Item from '../Items/Item';


const CategoryBooks = () => {
  // Get the category parameter from the URL
  const { category } = useParams();

  // State variables for storing books and filters
  const [books, setBooks] = useState([]); // Stores fetched books
  const [filteredBooks, setFilteredBooks] = useState([]); // Stores books after filtering
  const [filter, setFilter] = useState(''); // Stores the search input
  const [maxPrice, setMaxPrice] = useState(50); // Stores the max price filter
  const [selectedLanguage, setSelectedLanguage] = useState('all'); // Stores selected language filter
  const [selectedCategories, setSelectedCategories] = useState([]); // Stores selected categories
  const [initialCategories, setInitialCategories] = useState([]); // Stores initial categories from localStorage
  const [loading, setLoading] = useState(true); // State for loading status
  const [sortOption, setSortOption] = useState(""); // Stores the selected sorting option

  // Effect to load selected category from localStorage or URL
  useEffect(() => {
    const storedCategory = localStorage.getItem("selectedCategory") || category;
    if (storedCategory) {
      setSelectedCategories([storedCategory]); // Set the category
      setInitialCategories([storedCategory]); // Store the initial category for resetting
    }
  }, [category]); // Runs when `category` changes

  // Function to fetch books from Google Books API based on categories
  const fetchBooks = async (categories) => {
    setLoading(true); // Set loading state
    try {
      // Fetch books for each selected category
      const requests = categories.map((cat) =>
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${cat}`).then((res) => res.json())
      );

      // Wait for all fetch requests to complete
      const responses = await Promise.all(requests);

      // Extract relevant data from API response
      const formattedBooks = responses.flatMap((data) =>
        data.items?.map((book) => ({
          id: book.id,
          title: book.volumeInfo.title,
          image: book.volumeInfo.imageLinks?.thumbnail || 'default_image_url',
          new_price: book.saleInfo?.retailPrice?.amount || 0, // Get price or default to 0
          language: book.volumeInfo.language || 'unknown',
          categories: book.volumeInfo.categories || ['Uncategorized'],
        })) || []
      );

      setBooks(formattedBooks); // Store books in state
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Effect to fetch books when selectedCategories change
  useEffect(() => {
    if (selectedCategories.length === 0) return; // Don't fetch if no category is selected
    fetchBooks(selectedCategories);
  }, [selectedCategories]); // Runs when selectedCategories change

  // Effect to filter books based on user input
  useEffect(() => {
    const filtered = books.filter((book) =>
      book.new_price <= maxPrice && // Filter by max price
      (selectedLanguage === 'all' || book.language === selectedLanguage) && // Filter by language
      book.title.toLowerCase().includes(filter.toLowerCase()) && // Search filter
      (
        selectedCategories.length === 1
          ? selectedCategories.some((cat) => book.categories.includes(cat)) // If one category, check if it exists
          : selectedCategories.every((cat) => book.categories.includes(cat)) // If multiple, check all exist
      )
    );
    setFilteredBooks(filtered); // Store filtered books
  }, [books, filter, maxPrice, selectedLanguage, selectedCategories]); // Runs when any filter changes

  // Effect to sort books when sortOption changes
  useEffect(() => {
    let sorted = [...filteredBooks];

    if (sortOption === "title-asc") {
      sorted.sort((a, b) => a.title.localeCompare(b.title)); // Sort A-Z
    } else if (sortOption === "title-desc") {
      sorted.sort((a, b) => b.title.localeCompare(a.title)); // Sort Z-A
    } else if (sortOption === "price-asc") {
      sorted.sort((a, b) => a.new_price - b.new_price); // Sort price low to high
    } else if (sortOption === "price-desc") {
      sorted.sort((a, b) => b.new_price - a.new_price); // Sort price high to low
    }

    setFilteredBooks(sorted);
  }, [sortOption]); // Runs when sort option changes
  // مكون SortDropdown
const SortDropdown = ({ sortOption, onSortChange }) => {
  return (
    <div className="sort-dropdown">
      <select value={sortOption} onChange={(e) => onSortChange(e.target.value)}>
        <option value="">Sort By</option>
        <option value="title-asc">Title (A-Z)</option>
        <option value="title-desc">Title (Z-A)</option>
        <option value="price-asc">Price (Low to High)</option>
        <option value="price-desc">Price (High to Low)</option>
      </select>
    </div>
  );
};


  return (
    <div>
      {/* Sorting Dropdown */}
      <div className="sort-container">
        <SortDropdown sortOption={sortOption} onSortChange={setSortOption} />
      </div>

      <div className="category-books-container">
        {/* Sidebar Filters */}
        <div className="sidebar">
          <h3>Filter By</h3>

          {/* Search Bar */}
          <div className="search-container">
            <input type="text" placeholder="🔍 Search for books..." value={filter} onChange={(e) => setFilter(e.target.value)} />
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <h4>Category</h4>
            {["Fiction", "History", "Romance", "Horror", "Children"].map((cat) => (
              <label key={cat} className="category-checkbox">
                <input 
                  type="checkbox" 
                  value={cat} 
                  checked={selectedCategories.includes(cat)} 
                  onChange={() => setSelectedCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat])} 
                />
                {cat}
              </label>
            ))}
          </div>

          {/* Price Filter */}
          <div className="filter-section">
            <h4>Price</h4>
            <input type="range" min="0" max="100" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
            <p>Max Price: ${maxPrice}</p>
          </div>

          {/* Language Filter */}
          <div className="filter-section">
            <h4>Language</h4>
            <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
              <option value="all">All Languages</option>
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="ar">Arabic</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          <div className="filter-section reset-filter">
            <button onClick={() => { 
              setFilter(''); 
              setMaxPrice(50); 
              setSelectedLanguage('all'); 
              setSelectedCategories([...initialCategories]); 
            }}>
              Reset Filters
            </button>
          </div>
        </div>

        {/* Book Grid */}
        <div className="category-books">
          {loading ? (
            <div className="loading">⏳ Loading books...</div>
          ) : (
            <div className="books-grid">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <Item key={book.id} id={book.id} image={book.image} new_price={book.new_price} title={book.title} />
                ))
              ) : (
                <div className="not-found">📚 No books found ! 😢</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryBooks;



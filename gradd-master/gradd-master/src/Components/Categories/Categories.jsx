import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import './Categories.css';

const Categories = () => {
  const navigate = useNavigate();

  const categories = [
    { name: "Fiction", icon: "🌌" },
    { name: "History", icon: "📖" },
    { name: "Children", icon: "🧸" },
    { name: "Romance", icon: "❤️" },
    { name: "Horror", icon: "👻" },
    { name: "Action", icon: "⚔️" }
  ];

  const handleClick = (categoryName) => {
    localStorage.setItem("selectedCategory", categoryName); // ✅ حفظ الفئة المحددة
    navigate(`/category/${categoryName.toLowerCase()}`);
  };

  return (
    <div className="categories-container">
      
     
        
     <div class='pp'>
 </div>
<div class='uu'></div>
      <h1 className="categories-title">CATEGORIES</h1>
      <hr />
      <Swiper modules={[Navigation]} navigation spaceBetween={20} slidesPerView={4} loop={true} className="categories-swiper">
        {categories.map((category) => (
          <SwiperSlide key={category.name}>
            <div className="category-item" onClick={() => handleClick(category.name)}>
              <div className="category-icon">{category.icon}</div>
              <p className="category-name">{category.name}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Categories;

  
   


     



import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { HashLink as Link } from 'react-router-hash-link';
import "./About.css";

import hh from  '../Images/photo_2024-12-17_20-14-10.jpg';

// ممكن تستخدم صورة افتراضية للبروفايلات لان API مش بتدي صور
const defaultProfile = "https://randomuser.me/api/portraits/lego/1.jpg";

const About = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/comments?_limit=8")
      .then(res => {
        // نعمل map لتحويل بيانات API لشكل Testimonials بسيط
        const data = res.data.map(item => ({
          name: item.name.split(' ')[0], // ناخد أول كلمة كاسم
          comment: item.body,
          rating: Math.floor(Math.random() * 2) + 4, // تقييم عشوائي 4 أو 5 نجوم
          profile: defaultProfile,
        }));
        setTestimonials(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading testimonials...</p>;

  return (
    <div className="testimonials">
      <h2>See what customers are saying</h2>

      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        initialSlide={Math.floor(testimonials.length / 2)} 
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination]}
        className="testimonial-slider"
       breakpoints={{
    
    480: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 5,
      spaceBetween: 30,
    },}}
   
 
  
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index} className="testimonial-card">
            <img
              src={testimonial.profile}
              alt={`${testimonial.name}'s profile`}
              className="profile-image"
            />
            <h3>{testimonial.name}</h3>
            <p>{testimonial.comment}</p>
            <div className="rating">
              {"★".repeat(testimonial.rating)}{" "}
              {"☆".repeat(5 - testimonial.rating)}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div id="about" className="about-container">
        <div className="aboutt">
          <div className="abouty">
            <h1>ABOUT <span>US</span></h1>
          </div>
          <div className="paragh">
            <p>
              Welcome to <strong>IQRAA</strong>! Our mission is to transform the way readers
              discover, purchase, and borrow books in today’s digital age. We believe in
              creating a community where literature thrives, ensuring every reader finds their
              next favorite book.
            </p>

            <p>
              Our website offers a user-friendly platform that prioritizes
              personalized experiences. With seamless authentication and powerful search
              options for both purchasing and borrowing books, we strive to make your literary
              journey effortless and enjoyable.
            </p>

            <p>
              We take pride in providing tailored book recommendations based
              on your unique tastes and reading habits. Our curated suggestions, combined with
              user-generated ratings and reviews, help you discover content that truly resonates
              with you.
            </p>

            <p>
              Join us in revolutionizing the reading experience, making it
              more engaging, interactive, and enjoyable for everyone.
            </p>

            <p>Happy reading!</p>

            <Link to="/#services">
              <button className="show-more-button">Show More</button>
            </Link>
          </div>
        </div>
        <div className='imagee'>
          <img src={hh} alt="About us" />
        </div>
      </div>
    </div>
  );
};

export default About;

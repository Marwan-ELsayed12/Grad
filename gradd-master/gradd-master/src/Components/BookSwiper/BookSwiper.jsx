import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import Item from '../Items/Item';  

const BookSwiper = ({ data }) => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={20}
      slidesPerView={4}
      navigation
      pagination={{ clickable: true }}
      breakpoints={{
        640: { slidesPerView: 4, spaceBetween: 10 },
        768: { slidesPerView: 4, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 30 },
        1280: { slidesPerView: 4, spaceBetween: 30 },
      }}
    >
      {data.slice(0, 9).map((item, i) => (
        <SwiperSlide key={i}>
          <Item
            id={item.id}
            image={item.image}
            new_price={item.new_price}
            title={item.title}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BookSwiper;


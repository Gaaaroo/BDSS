import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";


function ImageCarousel() {
  return (
    <div className="relative group px-20 pb-20">
      <Swiper
        modules={[Navigation, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        loop={true}
        autoplay={{ delay: 20000, disableOnInteraction: false, duration: 2000 }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        className="w-full h-auto"
      >
          <SwiperSlide >
            
          </SwiperSlide>
      </Swiper>
      <style>
        {`
          .swiper-button-next,
          .swiper-button-prev {
            opacity: 0;
            transition: opacity 0.3s;
            color: black;
          }
          .group:hover .swiper-button-next,
          .group:hover .swiper-button-prev {
            opacity: 1;
          }
        `}
      </style>
    </div>
  );
}

export default ImageCarousel;

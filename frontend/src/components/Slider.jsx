import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";

import img1 from "../assets/images/slider-1.PNG";
import img2 from "../assets/images/slider-2.PNG";
import img3 from "../assets/images/slider-3.PNG";
import img4 from "../assets/images/slider-4.PNG";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

function ImageCarousel() {
  return (
    <>
      <Swiper
        modules={[Navigation, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        loop={true}
        autoplay={{ delay: 20000, disableOnInteraction: false, duration: 2000 }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        className="w-full h-[400px] group bg-white"
      >
        <SwiperSlide>
          <h1 className="text-center text-7xl font-bold text-red-700 p-5">
            A Snapshot of blood donation today
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-80">
            <img src={img4} alt="" className="w-38 h-38 object-contain" />
            <img src={img3} alt="" className="w-38 h-38 object-contain" />
            <img src={img2} alt="" className="w-38 h-38 object-contain" />
            <img src={img1} alt="" className="w-38 h-38 object-contain" />
          </div>
          <div className="flex flex-col-4 items-center text-center gap-15 text-3xl text-gray-700 px-20 py-3">
            <h3>
              Every 2 seconds someone in America needs a blood transfusion
            </h3>
            <h3>The need is great extending beyond unexpected emergencies.</h3>
            <h3>
              3% of the population donates blood, but 100% of us will need it at
              some point.
            </h3>
            <h3>Nearly 7 million people selflessly give blood every year.</h3>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="text-4xl text-center justify-center">chưa xong</div>
        </SwiperSlide>
      </Swiper>
      <style>
        {`
          .swiper-button-next,
          .swiper-button-prev {
          margin: 0 30px;
            
            // opacity: 0;
            // transition: opacity 0.3s;
            color: gray;
          }
          .group:hover .swiper-button-next,
          .group:hover .swiper-button-prev {
            opacity: 1;
          }
        `}
      </style>
    </>
  );
}

export default ImageCarousel;

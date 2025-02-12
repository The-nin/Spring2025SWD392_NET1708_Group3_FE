import { motion } from "framer-motion";
import { Carousel } from "antd";

const HeroSection = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const heroImages = [
    "https://media.hcdn.vn/hsk/1732069393web.jpg",
    "https://www.larocheposay.vn/-/media/project/loreal/brand-sites/lrp/apac/vn/simple-page/landing-page/spotscan-plus/entry-points/lrpspotscansitecoredesktopbanner1440x450pxzoe.jpg",
    "https://jda.com.vn/wp-content/uploads/2024/12/J27L-J64-J115-web-copy-1-1400x455.jpg",
  ];

  return (
    <Carousel autoplay>
      {heroImages.map((src, index) => (
        <motion.div
          key={index}
          className="h-[500px] text-white font-bold text-center bg-black"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <img className="w-full h-full" src={src} alt={`hero-${index}`} />
        </motion.div>
      ))}
    </Carousel>
  );
};

export default HeroSection;

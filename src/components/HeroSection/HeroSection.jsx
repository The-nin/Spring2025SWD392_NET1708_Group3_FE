import { motion } from "framer-motion";
import { Carousel } from "antd";
import { Link } from "react-router-dom"; // Import Link

const HeroSection = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const heroImages = [
    {
      src: "https://clippingpathstudio.com/wp-content/uploads/2023/10/Skincare-Product-Photography.jpg",
      link: "/shop",
    },
    {
      src: "https://romand.us/cdn/shop/files/PC_1_f3f7996f-b772-4c13-80ca-9f780fa212a6.png?v=1739778622&width=1512",
      link: "/blog",
    },
    {
      src: "https://www.glowwithjasmine.com/wp-content/uploads/2023/10/Skin-quiz-banner.png",
      link: "/skinquiz",
    },
  ];

  return (
    <Carousel autoplay>
      {heroImages.map(({ src, link }, index) => (
        <motion.div
          key={index}
          className="h-[500px] text-white font-bold text-center bg-black"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <Link to={link}>
            <img
              className="w-full h-full cursor-pointer"
              src={src}
              alt={`hero-${index}`}
            />
          </Link>
        </motion.div>
      ))}
    </Carousel>
  );
};

export default HeroSection;

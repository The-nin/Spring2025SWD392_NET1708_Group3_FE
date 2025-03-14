import React from "react";
import { motion } from "framer-motion";

// Team members data
const teamMembers = [
  {
    name: "John Doe",
    role: "CEO & Founder",
    image: "src/assets/img/aboutus-team1.webp",
  },
  {
    name: "Jane Smith",
    role: "Lead Developer",
    image: "src/assets/img/aboutus-team2.webp",
  },
  {
    name: "Michael Johnson",
    role: "UI/UX Designer",
    image: "src/assets/img/aboutus-team3.jpg",
  },
  {
    name: "Samroy",
    role: "UI/UX Designer",
    image: "src/assets/img/aboutus-team4.jpg",
  },
  {
    name: "SamroyIsMe",
    role: "UI/UX Designer",
    image: "src/assets/img/aboutus-team5.jpg",
  },
];

const AboutUsPage = () => {
  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen">
      {/* Header */}
      <motion.header
        className="bg-black text-white py-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl font-bold">About Us</h1>
        <p className="text-lg mt-2">Learn more about our mission and team</p>
      </motion.header>

      {/* About Section */}
      <motion.section
        className="container mx-auto my-12 px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="bg-white p-8 shadow-lg rounded-lg flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-black mb-4">Who We Are</h2>
            <p className="text-gray-700 text-justify">
              At SKYN, we believe that skincare is more than just a routine—it
              is a journey to healthy, radiant skin. Our mission is to provide
              high-quality, science-backed, and nature-inspired skincare
              products that nourish, protect, and enhance your natural beauty.
              Founded with a passion for clean beauty, we carefully select
              natural ingredients and dermatologist-approved formulas to ensure
              every product is gentle, effective, and safe for all skin types.
              From hydrating serums to rejuvenating face masks, we craft
              skincare solutions that empower you to feel confident in your
              skin.
              <br></br>At SKYN, we are more than just a brand—we are a community
              that celebrates self-care, sustainability, and skin positivity.
              Join us on this journey to glowing, healthy skin—because you
              deserve the best.
            </p>
          </div>
          {/* Image */}
          <motion.div
            className="md:w-1/2 mt-6 md:mt-0 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src="src/assets/img/aboutus-whoarewe.webp"
              alt="Who We Are"
              className="rounded-lg shadow-lg w-full max-w-xl transform hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* History Section */}
      <motion.section
        className="container mx-auto my-12 px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="bg-white p-8 shadow-lg rounded-lg flex flex-col md:flex-row items-center">
          {/* Image */}
          <motion.div
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src="src/assets/img/aboutus-whywecreate.jpg"
              alt="History"
              className="rounded-lg shadow-lg w-full max-w-xl transform hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
          <div className="md:w-1/2 text-center md:text-right">
            <h2 className="text-3xl font-bold text-black mb-4">
              Why We Create
            </h2>
            <p className="text-gray-700 text-justify">
              The decision to create this website stemmed from a deep
              appreciation for the rich and evolving history of skin care. As
              the beauty industry continues to grow at an unprecedented rate,
              it’s easy to overlook the incredible journey that skincare has
              undergone over thousands of years. From ancient rituals to modern
              technological advancements, skin care is not just about
              products—it’s about cultural heritage, scientific progress, and
              personal care. <br></br> <br></br>
              We believe that understanding the history behind the products we
              use today allows us to appreciate the craftsmanship, dedication,
              and innovation that has shaped the skincare industry. This website
              was created as a space for anyone interested in exploring the
              origins of skin care, the ancient remedies that inspired modern
              solutions, and how skin care practices have adapted to meet the
              needs of different generations.
              <br></br>
              <br></br>
              In addition to honoring the past, we aim to provide insightful
              content that celebrates the diversity of skin care across cultures
              and time periods. By learning more about skin care history, we
              hope to empower people to make informed decisions about their
              beauty routines and connect them with the deeper significance of
              self-care.
              <br></br>
              <br></br>
              Whether you are a skincare enthusiast, a history buff, or simply
              curious about how beauty and health intersect, this website offers
              a unique and informative perspective. We’re excited to share the
              fascinating evolution of skin care and invite others to join in on
              the journey!
            </p>
          </div>
        </div>
      </motion.section>
      {/* Vision & Mission Section */}
      <motion.section
        className="container mx-auto my-12 px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="bg-white p-8 shadow-lg rounded-lg flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-black mb-4">Vision</h2>
            <p className="text-gray-700 text-justify">
              At SKYN, our vision is to revolutionize the skincare industry by
              making clean, effective, and sustainable beauty products
              accessible to everyone. We aspire to empower individuals to
              embrace their natural beauty, fostering confidence and self-love
              with each product they use. We envision a world where skincare is
              not just a routine but a meaningful journey towards healthy,
              radiant skin—a world where everyone feels valued, cared for, and
              confident in their skin, regardless of age, gender, or background.
            </p>
            <h2 className="text-3xl font-bold text-black mb-4 mt-6 text-right">
              Mission
            </h2>
            <p className="text-gray-700 text-justify">
              Our mission at SKYN is to create high-quality, nature-inspired
              skincare products that are both effective and gentle for all skin
              types. We are dedicated to combining the best of science and
              nature to offer formulations that nourish, protect, and enhance
              your skin. With a focus on clean beauty, we prioritize natural
              ingredients, sustainability, and dermatologist-approved formulas
              to ensure the highest standard of care. We are committed to making
              self-care a positive and inclusive experience, providing skincare
              solutions that promote health, well-being, and confidence for
              every individual.
              <br />
              <br />
              By fostering a community that values transparency, sustainability,
              and skin positivity, we aim to inspire people to care for their
              skin with the same love and attention they give to their overall
              well-being.
            </p>
          </div>
          {/* Image */}
          <motion.div
            className="md:w-1/2 mt-6 md:mt-0 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src="src/assets/img/aboutus-vision-mission.webp"
              alt="Vision & Mission"
              className="rounded-lg shadow-lg w-full max-w-xl transition-transform duration-500 transform hover:scale-105"
            />
          </motion.div>
        </div>
      </motion.section>
      {/* Slogan Section */}
      <motion.section
        className="container mx-auto my-12 px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="bg-[#CBB596] p-8 shadow-xl rounded-lg text-center">
          <p className="text-white text-3xl font-semibold leading-relaxed">
            "Glow from within and radiate confidence with every step you take"
          </p>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className="container mx-auto px-6 my-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold text-black text-center mb-6">
          Meet Our Team
        </h2>
        <div className="grid md:grid-cols-5 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 shadow-lg rounded-lg text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <img
                src={member.image}
                alt={member.name}
                className="mx-auto rounded-full mb-4 transition-transform duration-500 ease-in-out transform hover:scale-110"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUsPage;

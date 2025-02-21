import React, { useEffect } from "react";
import { motion } from "framer-motion";
// A simple fade-in function for each section
const fadeIn = () => {
  const elements = document.querySelectorAll(".fade-in");
  elements.forEach((element) => {
    const position = element.getBoundingClientRect();
    if (position.top < window.innerHeight && position.bottom >= 0) {
      element.classList.add(
        "opacity-100",
        "transition-opacity",
        "duration-1000"
      );
    } else {
      element.classList.remove("opacity-100");
    }
  });
};

const AboutUsPage = () => {
  // Scroll event listener to trigger fade-in
  useEffect(() => {
    window.addEventListener("scroll", fadeIn);
    return () => window.removeEventListener("scroll", fadeIn);
  }, []);

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen">
      {/* Header */}
      <header className="bg-black text-white py-6 text-center fade-in">
        <h1 className="text-3xl font-bold">About Us</h1>
        <p className="text-lg mt-2">Learn more about our mission and team</p>
      </header>

      {/* About Section */}
      <section className="container mx-auto my-12 px-6 fade-in ">
        <div className="bg-white p-8 shadow-lg rounded-lg flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-black mb-4 text-left">
              Who We Are
            </h2>
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
              <br />
              <br />
              At SKYN, we are more than just a brand—we are a community that
              celebrates self-care, sustainability, and skin positivity. Join us
              on this journey to glowing, healthy skin—because you deserve the
              best.
            </p>
          </div>
          {/* Image Section */}
          <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
            <img
              src="src\assets\img\aboutus-whoarewe.webp" // Local path to image
              alt="Who We Are"
              className="rounded-lg shadow-lg w-full max-w-xl transition-transform duration-500 ease-in-out transform hover:scale-105" // Change max-w-sm to max-w-xl or any larger size
            />
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="container mx-auto my-12 px-6 fade-in opacity-0">
        <div className="bg-white p-8 shadow-lg rounded-lg flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
            <img
              src="src/assets/img/aboutus-whywecreate.jpg"
              alt="History"
              className="rounded-lg shadow-lg w-full max-w-xl transition-transform duration-500 ease-in-out transform hover:scale-105" // Change max-w-sm to max-w-xl or any larger size
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-black mb-4 text-right">
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
              personal care.
              <br />
              <br />
              We believe that understanding the history behind the products we
              use today allows us to appreciate the craftsmanship, dedication,
              and innovation that has shaped the skincare industry. This website
              was created as a space for anyone interested in exploring the
              origins of skin care, the ancient remedies that inspired modern
              solutions, and how skin care practices have adapted to meet the
              needs of different generations.
              <br />
              <br />
              In addition to honoring the past, we aim to provide insightful
              content that celebrates the diversity of skin care across cultures
              and time periods. By learning more about skin care history, we
              hope to empower people to make informed decisions about their
              beauty routines and connect them with the deeper significance of
              self-care.
              <br />
              <br />
              Whether you are a skincare enthusiast, a history buff, or simply
              curious about how beauty and health intersect, this website offers
              a unique and informative perspective. We’re excited to share the
              fascinating evolution of skin care and invite others to join in on
              the journey!
            </p>
          </div>
        </div>
      </section>

      {/* Vision and Mission Section */}
      <section className="container mx-auto my-12 px-6 fade-in opacity-0">
        <div className="bg-white p-8 shadow-lg rounded-lg flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-black mb-4 text-left">
              Vision
            </h2>
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
            <h2 className="text-3xl font-bold text-black mb-4 text-right">
              <br />
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
          {/* Image Section */}
          <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
            <img
              src="src\assets\img\aboutus-vision-mission.webp" // Local path to image
              alt="Who We Are"
              className="rounded-lg shadow-lg w-full max-w-xl transition-transform duration-500 ease-in-out transform hover:scale-105" // Change max-w-sm to max-w-xl or any larger size
            />
          </div>
        </div>
      </section>
      {/* Slogan Section */}
      <section className="container mx-auto my-12 px-6 fade-in opacity-0">
        <div className="bg-[#CBB596] p-8 shadow-xl rounded-lg flex flex-col md:flex-row items-center justify-center">
          <div className="md:w-3/4 text-center md:text-center">
            <p className="text-white text-3xl md:text-3xl font-semibold leading-relaxed">
              "Glow from within and radiate confidence with every step you take"
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-6 my-12 fade-in opacity-0">
        <h2 className="text-2xl font-bold text-black text-center mb-6">
          Meet Our Team
        </h2>
        <div className="grid md:grid-cols-5 gap-8">
          {[
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
          ].map((member, index) => (
            <div
              key={index}
              className="bg-white p-6 shadow-lg rounded-lg text-center"
            >
              <img
                src={member.image} // Custom image path for each member
                alt={member.name}
                className="mx-auto rounded-full mb-4 transition-transform duration-500 ease-in-out transform hover:scale-110"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;

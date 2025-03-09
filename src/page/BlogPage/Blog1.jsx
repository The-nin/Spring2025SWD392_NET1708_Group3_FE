import { useState, useEffect } from "react";

const Blog1 = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Function to check if element is in the viewport
  const handleScroll = () => {
    const element = document.getElementById("fade-element");
    const rect = element.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      setIsVisible(true);
    }
  };

  // Add scroll event listener when the component mounts
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Ensure the content is visible on initial load
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      id="fade-element"
      className={`max-w-4xl mx-auto p-6 mb-8 transition-opacity duration-1000 ${
        isVisible ? "fade-in" : "opacity-0"
      }`}
    >
      <h1 className="text-4xl font-semibold text-center text-gray-800 mb-6">
        How to Build Your First Skincare Routine: A Step-by-Step Guide
      </h1>

      <div className="mb-8">
        <p className="text-lg text-gray-700">
          Starting a skincare routine can feel overwhelming, especially with all
          the options out there. But don't worry – it't is simpler than you
          think! Whether you're new to skincare or looking to refine your
          routine, we’ve got you covered with a basic step-by-step guide to
          building a skincare routine that works for you.
        </p>
      </div>

      {/* Step 1: Cleanser Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Step 1: Cleanser – The Foundation of Any Routine
        </h2>
        <p className="text-lg text-gray-700">
          The first step in any skincare routine is cleansing. A good cleanser
          removes dirt, oil, and impurities without stripping your skin of its
          natural moisture.
        </p>
        <h3 className="text-xl font-medium text-gray-800 mt-4 mb-2">
          Choose a Cleanser Based on Your Skin Type:
        </h3>
        <ul className="list-disc pl-6 text-gray-700">
          <li>For dry skin: Look for a hydrating, cream-based cleanser.</li>
          <li>
            For oily skin: Opt for a foaming or gel cleanser that helps control
            excess oil.
          </li>
          <li>
            For sensitive skin: Choose a fragrance-free, gentle cleanser to
            avoid irritation.
          </li>
        </ul>
        <p className="text-gray-700 mt-4">
          Tip: Cleanse your face twice daily – once in the morning and again
          before bed.
        </p>
      </div>

      {/* Other Sections (Step 2, Step 3, etc.) would follow here, similar to the above */}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Conclusion: Keep It Simple, But Consistent
        </h2>
        <p className="text-lg text-gray-700">
          Building your first skincare routine doesn’t need to be complicated.
          With just five essential steps – cleanse, tone, serum, moisturize, and
          protect – you’re on your way to healthy, glowing skin. Consistency is
          key, so stick to your routine for a few weeks and give your skin time
          to adjust.
        </p>
        <p className="text-lg text-gray-700 mt-4">
          Remember, everyone`&apos;`s skin is different, so it might take a bit
          of experimentation to find the products that work best for you.
          Don`&apos;`t be afraid to tweak your routine as you go!
        </p>
        <p className="text-lg text-gray-700 mt-4">
          We hope this guide helps you get started on your skincare journey! If
          you have any questions or need recommendations, feel free to leave a
          comment below or reach out to us on social media!
        </p>
      </div>
    </div>
  );
};

export default Blog1;

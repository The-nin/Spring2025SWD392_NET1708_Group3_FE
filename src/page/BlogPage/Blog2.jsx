import { useState, useEffect } from "react";

const Blog2 = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Function to check if element is in the viewport
  const handleScroll = () => {
    const element = document.getElementById("fade-element");
    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        setIsVisible(true);
      }
    }
  };

  useEffect(() => {
    // Trigger fade-in on mount and add scroll listener
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      id="fade-element"
      className={`max-w-4xl mx-auto p-6 mb-8 transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <h1 className="text-4xl font-semibold text-center text-gray-800 mb-6">
        The Science of Glowing Skin
      </h1>

      <div className="mb-8">
        <p className="text-lg text-gray-700">
          Achieving beautiful, glowing skin isn’t just about using the latest
          skincare products. It’s about understanding how your skin works and
          what it truly needs to stay healthy. With the right habits, products,
          and knowledge, you can unlock your skin’s natural radiance. Let’s dive
          into the science behind glowing skin and how you can achieve it.
        </p>
      </div>

      {/* Step 1: Hydration and Nutrition */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Step 1: Hydration and Nutrition – The Inside-Out Approach
        </h2>
        <p className="text-lg text-gray-700">
          Your skin’s glow starts from within. Drinking enough water and eating
          a balanced diet rich in vitamins and antioxidants can do wonders for
          your complexion.
        </p>
        <h3 className="text-xl font-medium text-gray-800 mt-4 mb-2">
          Key Nutrients for Radiant Skin:
        </h3>
        <ul className="list-disc pl-6 text-gray-700">
          <li>
            <strong>Vitamin C:</strong> Helps brighten skin and boosts collagen
            production.
          </li>
          <li>
            <strong>Omega-3 Fatty Acids:</strong> Found in fish and flaxseeds,
            they help maintain skin’s elasticity.
          </li>
          <li>
            <strong>Water:</strong> Keeps your skin hydrated and flushes out
            toxins.
          </li>
        </ul>
        <p className="text-gray-700 mt-4">
          Tip: Start your day with a glass of lemon water to give your skin a
          natural boost of hydration and antioxidants.
        </p>
      </div>

      {/* Step 2: The Role of Skincare Ingredients */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Step 2: The Role of Skincare Ingredients
        </h2>
        <p className="text-lg text-gray-700">
          Using the right ingredients can help your skin stay bright, smooth,
          and youthful. Here are a few key skincare ingredients to look for:
        </p>
        <ul className="list-disc pl-6 text-gray-700 mt-4">
          <li>
            <strong>Hyaluronic Acid:</strong> A powerhouse hydrator that plumps
            the skin.
          </li>
          <li>
            <strong>Niacinamide:</strong> Helps with inflammation, redness, and
            brightening.
          </li>
          <li>
            <strong>Retinol:</strong> Boosts collagen and fights signs of aging.
          </li>
          <li>
            <strong>Sunscreen:</strong> Protects your skin from UV damage, which
            is the #1 cause of premature aging.
          </li>
        </ul>
        <p className="text-gray-700 mt-4">
          Tip: Always wear SPF 30 or higher, even on cloudy days, to maintain a
          youthful glow.
        </p>
      </div>

      {/* Step 3: Daily Skincare Routine */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Step 3: Building a Daily Skincare Routine
        </h2>
        <p className="text-lg text-gray-700">
          A simple but effective skincare routine is the key to glowing skin.
          Follow these basic steps:
        </p>
        <ol className="list-decimal pl-6 text-gray-700 mt-4">
          <li>
            <strong>Cleanser:</strong> Removes dirt, oil, and impurities.
          </li>
          <li>
            <strong>Toner:</strong> Balances skin pH and preps for serums.
          </li>
          <li>
            <strong>Serum:</strong> Targets specific skin concerns.
          </li>
          <li>
            <strong>Moisturizer:</strong> Locks in hydration.
          </li>
          <li>
            <strong>Sunscreen (AM):</strong> Protects against UV rays.
          </li>
        </ol>
        <p className="text-gray-700 mt-4">
          Tip: Stick to your routine consistently for at least 4–6 weeks to see
          noticeable results.
        </p>
      </div>

      {/* Conclusion */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Conclusion: Healthy Skin is Glowing Skin
        </h2>
        <p className="text-lg text-gray-700">
          Glowing skin isn’t just about using expensive skincare products—it’s
          about a balanced approach that includes hydration, proper nutrition,
          effective skincare ingredients, and a consistent routine.
        </p>
        <p className="text-lg text-gray-700 mt-4">
          Start small, be patient, and most importantly, enjoy the process. Your
          skin will thank you for it!
        </p>
        <p className="text-lg text-gray-700 mt-4">
          Do you have any favorite skincare tips for glowing skin? Share them in
          the comments below!
        </p>
      </div>
    </div>
  );
};

export default Blog2;

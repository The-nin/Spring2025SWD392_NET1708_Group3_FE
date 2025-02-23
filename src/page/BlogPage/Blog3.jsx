import { useState, useEffect } from "react";

const Blog3 = () => {
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
        Dealing with Acne: Tips and Best Products to Clear Your Skin
      </h1>

      <div className="mb-8">
        <p className="text-lg text-gray-700">
          Acne is one of the most common skin concerns, affecting people of all
          ages. While it can be frustrating, the good news is that with the
          right approach, you can manage and reduce breakouts effectively. In
          this guide, we’ll explore what causes acne, how to prevent it, and the
          best products to help you achieve clear skin.
        </p>
      </div>

      {/* Step 1: Understanding Acne */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Step 1: Understanding Acne – What Causes Breakouts?
        </h2>
        <p className="text-lg text-gray-700">
          Acne occurs when hair follicles become clogged with oil, dead skin
          cells, and bacteria. Here are some of the main causes:
        </p>
        <ul className="list-disc pl-6 text-gray-700">
          <li>
            <strong>Excess Oil Production:</strong> Overactive sebaceous glands
            can lead to clogged pores.
          </li>
          <li>
            <strong>Bacteria:</strong> The presence of <em>P. acnes</em>{" "}
            bacteria can trigger inflammation.
          </li>
          <li>
            <strong>Hormonal Changes:</strong> Fluctuations during puberty,
            menstruation, or stress can cause breakouts.
          </li>
          <li>
            <strong>Poor Skincare Habits:</strong> Using the wrong products or
            not cleansing properly can contribute to acne.
          </li>
        </ul>
        <p className="text-gray-700 mt-4">
          Tip: Understanding the root cause of your acne can help you find the
          best treatment for your skin type.
        </p>
      </div>

      {/* Step 2: Building an Acne-Fighting Skincare Routine */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Step 2: Building an Acne-Fighting Skincare Routine
        </h2>
        <p className="text-lg text-gray-700">
          A proper skincare routine can help manage acne and prevent future
          breakouts. Follow these essential steps:
        </p>
        <ol className="list-decimal pl-6 text-gray-700 mt-4">
          <li>
            <strong>Cleanser:</strong> Use a gentle, sulfate-free cleanser with
            salicylic acid or benzoyl peroxide to remove excess oil and
            bacteria.
          </li>
          <li>
            <strong>Toner:</strong> Opt for a toner with witch hazel or
            niacinamide to help balance oil production.
          </li>
          <li>
            <strong>Spot Treatment:</strong> Apply a targeted treatment with
            benzoyl peroxide or tea tree oil to active pimples.
          </li>
          <li>
            <strong>Moisturizer:</strong> Even oily skin needs hydration—choose
            a lightweight, non-comedogenic formula.
          </li>
          <li>
            <strong>Sunscreen (AM):</strong> Always use SPF 30+ to protect
            against sun damage and prevent post-acne marks.
          </li>
        </ol>
        <p className="text-gray-700 mt-4">
          Tip: Avoid over-exfoliating, as it can strip your skin and lead to
          more breakouts.
        </p>
      </div>

      {/* Step 3: Best Ingredients & Products for Acne */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Step 3: Best Ingredients & Products for Acne
        </h2>
        <p className="text-lg text-gray-700">
          Choosing the right skincare ingredients is key to managing acne
          effectively. Here are some of the best:
        </p>
        <ul className="list-disc pl-6 text-gray-700 mt-4">
          <li>
            <strong>Salicylic Acid:</strong> A beta-hydroxy acid (BHA) that
            exfoliates inside the pores, preventing clogs.
          </li>
          <li>
            <strong>Benzoyl Peroxide:</strong> Kills acne-causing bacteria and
            reduces inflammation.
          </li>
          <li>
            <strong>Niacinamide:</strong> Helps with redness, oil control, and
            post-acne marks.
          </li>
          <li>
            <strong>Clay Masks:</strong> Absorb excess oil and detoxify pores.
          </li>
        </ul>
        <p className="text-gray-700 mt-4">
          Tip: Patch-test new products before applying them to your whole face
          to avoid irritation.
        </p>
      </div>

      {/* Conclusion */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Conclusion: Be Patient and Stay Consistent
        </h2>
        <p className="text-lg text-gray-700">
          Managing acne takes time, and results don’t happen overnight. Stick to
          a gentle, effective routine, use the right ingredients, and be patient
          with your skin.
        </p>
        <p className="text-lg text-gray-700 mt-4">
          If your acne persists or worsens, consider consulting a dermatologist
          for personalized treatment options.
        </p>
        <p className="text-lg text-gray-700 mt-4">
          Have you found any acne-fighting products that work wonders for you?
          Share your recommendations in the comments!
        </p>
      </div>
    </div>
  );
};

export default Blog3;

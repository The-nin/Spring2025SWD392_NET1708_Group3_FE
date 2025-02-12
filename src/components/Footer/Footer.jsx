const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
        {/* Logo and Social Links */}
        <div className="col-span-2 md:col-span-1">
          <h2 className="text-xl font-bold">SKYN.</h2>
          <p className="mt-4">FOLLOW US</p>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="text-white hover:text-gray-400">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-white hover:text-gray-400">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-white hover:text-gray-400">
              <i className="fab fa-facebook"></i>
            </a>
          </div>
        </div>

        {/* Products */}
        <div>
          <h3 className="font-semibold mb-2">Products</h3>
          <ul>
            <li>
              <a href="#" className="hover:underline">
                Inner Care
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Skin Care
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Scalp Care
              </a>
            </li>
          </ul>
        </div>

        {/* Guides */}
        <div>
          <h3 className="font-semibold mb-2">Guides</h3>
          <ul>
            <li>
              <a href="#" className="hover:underline">
                News
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Vision
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Q&A
              </a>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-semibold mb-2">Service</h3>
          <ul>
            <li>
              <a href="#" className="hover:underline">
                About Concierge
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Online Consultation
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Market
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <ul>
            <li>
              <a href="#" className="hover:underline">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-xs text-center">
        <p>SKYN. 2019 KINS All rights reserved.</p>
        <div className="flex flex-col md:flex-row justify-center mt-2 space-y-2 md:space-y-0 md:space-x-4">
          <a href="#" className="hover:underline">
            Company Profile
          </a>
          <a href="#" className="hover:underline">
            Privacy policy
          </a>
          <a href="#" className="hover:underline">
            Cancellation policy
          </a>
          <a href="#" className="hover:underline">
            Terms of service
          </a>
          <a href="#" className="hover:underline">
            Refund/Return Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

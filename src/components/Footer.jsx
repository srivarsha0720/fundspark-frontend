// Footer component → shows navigation, trust links, and brand information

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 pb-6 mt-20">
      {/* main footer wrapper */}

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        {/* responsive grid for footer columns */}

        {/* ===== BRAND COLUMN ===== */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">FundSpark</h2>
          {/* brand logo */}

          <p className="text-sm text-gray-400 leading-relaxed">
            Empowering creators, startups, and communities to turn ideas
            into reality through transparent crowdfunding.
          </p>

          {/* social icons */}
          <div className="flex gap-4 mt-4 text-lg">
            <span className="hover:text-white cursor-pointer">🌐</span>
            <span className="hover:text-white cursor-pointer">🐦</span>
            <span className="hover:text-white cursor-pointer">📸</span>
            <span className="hover:text-white cursor-pointer">💼</span>
          </div>
        </div>

        {/* ===== PLATFORM LINKS ===== */}
        <div>
          <h3 className="text-white font-semibold mb-3">Platform</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Explore Projects</li>
            <li className="hover:text-white cursor-pointer">Start a Project</li>
            <li className="hover:text-white cursor-pointer">Success Stories</li>
            <li className="hover:text-white cursor-pointer">How it Works</li>
          </ul>
        </div>

        {/* ===== SUPPORT LINKS ===== */}
        <div>
          <h3 className="text-white font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Help Center</li>
            <li className="hover:text-white cursor-pointer">Contact Us</li>
            <li className="hover:text-white cursor-pointer">FAQs</li>
            <li className="hover:text-white cursor-pointer">Safety</li>
          </ul>
        </div>

        {/* ===== LEGAL LINKS ===== */}
        <div>
          <h3 className="text-white font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Terms of Service</li>
            <li className="hover:text-white cursor-pointer">Refund Policy</li>
          </ul>
        </div>
      </div>

      {/* ===== bottom bar ===== */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} FundSpark. Built with ❤️ for creators.
      </div>
    </footer>
  );
};

export default Footer;
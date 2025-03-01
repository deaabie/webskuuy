
import React from "react";
import { Link } from "react-router-dom";

const IndexFooter = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-center">
          {/* Our Products Column */}
          <div className="text-center">
            <h3 className="text-lg font-bold mb-4">Our Products</h3>
            <ul className="space-y-2">
              <li>
                <Link to="https://explorer.skuuy.com" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-white transition">
                  Explorers
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-white transition">
                  Staking
                </Link>
              </li>
              <li>
                <Link to="/tools" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-white transition">
                  Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="text-center">
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-white transition">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="text-center">
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-white transition">
                  Feedback & Bug Report
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-white transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials Column */}
          <div className="text-center">
            <h3 className="text-lg font-bold mb-4">Socials</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://twitter.com/BrigadirCurva" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-white transition">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://github.com/deabie" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-white transition">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://t.me/suncomefaster" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-white transition">
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Horizontal Border Line */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>
        
        {/* Copyright Section */}
        <div className="text-center pb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 Skuuy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default IndexFooter;

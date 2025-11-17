import React from 'react';
import { Film, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = ({ setCurrentView, setFilterStatus }) => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Film className="w-8 h-8 text-red-500" />
              <span className="text-xl font-bold">
                <span className="text-white">AMBA</span><span className="text-red-500">MAX</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Your premier destination for the latest movies and unforgettable cinema experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button 
                  onClick={() => {
                    if (setFilterStatus) setFilterStatus('now_playing');
                    if (setCurrentView) setCurrentView('home');
                  }}
                  className="hover:text-red-500 transition"
                >
                  Now Playing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    if (setFilterStatus) setFilterStatus('coming_soon');
                    if (setCurrentView) setCurrentView('home');
                  }}
                  className="hover:text-red-500 transition"
                >
                  Coming Soon
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    if (setFilterStatus) setFilterStatus('ended');
                    if (setCurrentView) setCurrentView('home');
                  }}
                  className="hover:text-red-500 transition"
                >
                  History
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@ambamax.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600 transition">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 <span className="text-white">AMBA</span><span className="text-red-500">MAX</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

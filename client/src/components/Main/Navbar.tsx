"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Upload", path: "/upload" },
    { name: "Agent", path: "/agent" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-800">
          DocxifyAI
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8 text-slate-700 text-lg font-medium">
          {navItems.map((item, index) => (
            <motion.li
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hover:text-blue-800 transition-colors"
            >
              <Link href={item.path}>{item.name}</Link>
            </motion.li>
          ))}
        </ul>

        {/* CTA Button */}
        <Link href="/upload">
          <Button
            size="lg"
            className="hidden md:flex bg-blue-800 hover:bg-blue-700 text-white cursor-pointer"
          >
            Get Started
          </Button>
        </Link>
        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-slate-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full py-4"
        >
          <ul className="flex flex-col space-y-4 text-center text-lg text-slate-700">
            {navItems.map((item, index) => (
              <li key={index} className="hover:text-blue-800 transition-colors">
                <Link href={item.path} onClick={() => setIsOpen(false)}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="text-center mt-4">
            <Link href="/upload">
              <Button
                size="lg"
                className="bg-blue-800 hover:bg-blue-700 text-white cursor-pointer"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, FileText, Home, Bot } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    setScrolled(window.scrollY > 10);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/", icon: <Home className="h-4 w-4" /> },
    { name: "Upload", path: "/upload", icon: <FileText className="h-4 w-4" /> },
    { name: "Ops", path: "/ops", icon: <Bot className="h-4 w-4" /> },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-xl shadow-sm" : "bg-transparent"
      }`}
      suppressHydrationWarning
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center"
          >
            <Link href="/" className="group">
              <div className="flex items-baseline space-x-0.5">
                <span className="text-lg font-bold text-slate-800">
                  Docxify
                </span>
                <span className="text-lg font-medium bg-gradient-to-r from-blue-800 to-slate-700 bg-clip-text text-transparent">
                  AI
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <motion.div
              className="bg-slate-100/80 backdrop-blur-lg rounded-full px-2 py-1.5 mx-auto"
              initial={false}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <ul className="flex items-center">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.path;

                  return (
                    <motion.li
                      key={index}
                      className="relative"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href={item.path}>
                        <div
                          className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-200 ${
                            isActive
                              ? "bg-white text-blue-800 shadow-sm"
                              : "text-slate-600 hover:text-blue-800 hover:bg-white/50"
                          }`}
                          suppressHydrationWarning
                        >
                          {item.icon}
                          <span className="text-sm font-medium">
                            {item.name}
                          </span>
                        </div>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>

            {/* CTA Button */}
            <div className="ml-6">
              <Link href="/upload">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="sm"
                    className="bg-blue-800 hover:bg-blue-700 text-white font-medium shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer rounded-full px-6"
                  >
                    Get Started
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 rounded-full hover:bg-slate-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 bg-white/90 backdrop-blur-xl overflow-hidden rounded-2xl shadow-lg border border-slate-200/50"
            >
              <div className="p-3 space-y-1">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.path;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={item.path} onClick={() => setIsOpen(false)}>
                        <div
                          className={`p-3 rounded-xl flex items-center gap-3 transition-all ${
                            isActive
                              ? "bg-slate-100 text-blue-800"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                          suppressHydrationWarning
                        >
                          {item.icon}
                          <span className="text-sm font-medium">
                            {item.name}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-2 px-3"
                >
                  <Link href="/upload" onClick={() => setIsOpen(false)}>
                    <Button
                      size="sm"
                      className="w-full bg-blue-800 hover:bg-blue-700 text-white font-medium shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer rounded-xl py-5"
                    >
                      Get Started
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, FileText, Home, Bot, Sparkles } from "lucide-react";

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
    { name: "Agent", path: "/agent", icon: <Bot className="h-4 w-4" /> },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/40 backdrop-blur-xl shadow-sm" : "bg-transparent"
      }`}
      suppressHydrationWarning
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2"
          >
            <Link href="/" className="flex items-center">
              <Sparkles className="h-6 w-6 text-blue-800" />
              <span className="text-xl font-light tracking-tight text-slate-800">
                Docxify
                <span className="font-semibold text-blue-800">AI</span>
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex items-center space-x-6">
              {navItems.map((item, index) => {
                const isActive = pathname === item.path;

                return (
                  <motion.li
                    key={index}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <Link href={item.path}>
                      <div
                        className={`flex items-center gap-2 transition-all duration-200 ${
                          isActive
                            ? "text-blue-800"
                            : "text-slate-600 hover:text-blue-800"
                        }`}
                        suppressHydrationWarning
                      >
                        <span className="text-sm font-medium">{item.name}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-800"
                            initial={false}
                          />
                        )}
                      </div>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            {/* CTA Button */}
            <Link href="/upload">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="sm"
                  className="bg-blue-800 hover:bg-blue-700 text-white font-medium shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer rounded-full px-4"
                >
                  Get Started
                </Button>
              </motion.div>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white/80 backdrop-blur-xl overflow-hidden rounded-xl shadow-lg"
            >
              <div className="px-4 py-4 space-y-2">
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
                          className={`p-3 rounded-lg flex items-center gap-3 transition-all ${
                            isActive
                              ? "bg-blue-50 text-blue-800"
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
                  className="pt-2"
                >
                  <Link href="/upload" onClick={() => setIsOpen(false)}>
                    <Button
                      size="sm"
                      className="w-full bg-blue-800 hover:bg-blue-700 text-white font-medium shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer rounded-full"
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

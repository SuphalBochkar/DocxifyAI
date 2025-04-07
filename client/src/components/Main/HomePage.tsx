"use client";

import { FileText, Bot, Upload, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import HeroAnimation from "@/components/Home/hero-animation";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center opacity-5"></div> */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              className="flex-1 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                Intelligent Document Processing
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 tracking-tight">
                Transform how you{" "}
                <span className="text-blue-800">process documents</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl">
                Extract, analyze, and retrieve missing information from your
                documents with our advanced AI assistant. Save time and reduce
                errors.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  size="lg"
                  className="bg-blue-800 hover:bg-blue-700 text-white hover:cursor-pointer"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <HeroAnimation />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-blue-800/5"></div>
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent"></div>

        {/* Decorative elements */}
        <div className="absolute top-40 left-10 w-64 h-64 rounded-full bg-blue-800/10 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-blue-800/10 blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-6 h-6 rounded-full bg-blue-800/20"></div>
        <div className="absolute bottom-1/3 left-1/3 w-4 h-4 rounded-full bg-blue-800/20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="inline-block mb-6 px-5 py-2 rounded-full bg-blue-800 text-white font-medium text-sm tracking-wide uppercase shadow-sm">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-5 leading-tight">
              Everything you need for{" "}
              <span className="text-blue-800">document processing</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our platform combines powerful AI with an intuitive interface to
              make document processing effortless.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-800/10 h-full relative overflow-hidden transition-all duration-300 hover:shadow-blue-800/20">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-800/10 to-transparent rounded-bl-[100px] -mr-6 -mt-6"></div>
                <div className="mb-6 relative">
                  <div className="w-14 h-14 rounded-xl bg-blue-800 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                    <Upload className="h-7 w-7 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  Smart Document Upload
                </h3>
                <p className="text-slate-600">
                  Upload documents in PDF format. Our system automatically
                  detects errors and processes them.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-800/10 h-full relative overflow-hidden transition-all duration-300 hover:shadow-blue-800/20">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-800/10 to-transparent rounded-bl-[100px] -mr-6 -mt-6"></div>
                <div className="mb-6 relative">
                  <div className="w-14 h-14 rounded-xl bg-blue-800 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                    <FileText className="h-7 w-7 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  Intelligent Extraction
                </h3>
                <p className="text-slate-600">
                  Our AI efficiently extracts and organizes information from
                  your documents with a high degree of accuracy, providing
                  detailed insights regarding any errors and missing data
                  identified.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-800/10 h-full relative overflow-hidden transition-all duration-300 hover:shadow-blue-800/20">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-800/10 to-transparent rounded-bl-[100px] -mr-6 -mt-6"></div>
                <div className="mb-6 relative">
                  <div className="w-14 h-14 rounded-xl bg-blue-800 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                    <Bot className="h-7 w-7 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  AI Assistant
                </h3>
                <p className="text-slate-600">
                  Chat with our AI to find missing information or get insights
                  about your documents in real-time.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-800/5 to-white/80"></div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-blue-800/10 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-blue-800/10 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="inline-block mb-6 px-5 py-2 rounded-full bg-blue-800 text-white font-medium text-sm tracking-wide uppercase shadow-sm">
              Our Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
              How <span className="text-blue-800">DocxifyAI</span> works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Transform your documents into structured data in three simple
              steps
            </p>
          </motion.div>

          <div className="relative mt-12">
            {/* Connection lines for desktop */}
            <div className="hidden lg:block absolute top-32 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-1 bg-blue-800/20"></div>
            <div className="hidden lg:block absolute top-32 left-[calc(16.67%+2rem)] h-2 w-2 rounded-full bg-blue-800 -ml-1 -mt-0.5"></div>
            <div className="hidden lg:block absolute top-32 right-[calc(16.67%+2rem)] h-2 w-2 rounded-full bg-blue-800 -mr-1 -mt-0.5"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              {[
                {
                  step: "01",
                  title: "Upload Document",
                  description:
                    "Drag & drop your document or use our API for seamless integration with your workflow",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  ),
                },
                {
                  step: "02",
                  title: "AI Processing",
                  description:
                    "Our advanced AI engine extracts, analyzes, and structures your document data with precision",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="2"
                        y="3"
                        width="20"
                        height="14"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  ),
                },
                {
                  step: "03",
                  title: "Review & Export",
                  description:
                    "Validate your data and export it in your preferred format - JSON, CSV, Excel, or API response",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  ),
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-xl border border-blue-800/10 p-8 h-full relative overflow-hidden group-hover:shadow-2xl group-hover:shadow-blue-800/20 transition-all duration-500">
                    {/* Decorative circle in the background */}
                    <div className="absolute -right-16 -top-16 w-32 h-32 bg-blue-800/5 rounded-full opacity-70 group-hover:scale-125 transition-transform duration-500"></div>

                    {/* Step number indicator - repositioned to show inside card */}
                    <div className="absolute top-4 left-4">
                      <div className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-lg shadow-md">
                        {item.step}
                      </div>
                    </div>

                    <div className="relative pl-12">
                      {" "}
                      {/* Added left padding to accommodate the circle */}
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-xl bg-blue-800/10 text-blue-800 flex items-center justify-center mb-6 group-hover:bg-blue-800/20 transition-all">
                        {item.icon}
                      </div>
                      {/* Title */}
                      <h3 className="text-xl font-bold text-slate-800 mb-3">
                        {item.title}
                      </h3>
                      {/* Description */}
                      <p className="text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                      {/* Bottom indicator */}
                      <div className="h-1 bg-blue-800 rounded-full mt-6 w-16 group-hover:w-32 transition-all duration-500"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <motion.div
            className="text-center mt-14"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button className="px-10 py-4 bg-blue-800 text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:shadow-blue-800/20 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 hover:cursor-pointer">
              Get Started Today
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

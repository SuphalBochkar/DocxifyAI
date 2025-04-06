"use client";

import { FileText, Bot, Upload, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import HeroAnimation from "@/components/Home/hero-animation";
import FeatureCard from "@/components/Home/feature-card";

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
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <Badge className="inline-block mb-4 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium text-sm tracking-wide uppercase">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
              Everything you need for document processing
            </h2>
            <p className="text-lg text-slate-600">
              Our platform combines powerful AI with an intuitive interface to
              make document processing effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Upload className="h-7 w-7 text-blue-700" />}
              title="Smart Document Upload"
              description="Upload documents in PDF format. Our system automatically detects errors and processes them."
            />
            <FeatureCard
              icon={<FileText className="h-7 w-7 text-blue-700" />}
              title="Intelligent Extraction"
              description="Our AI efficiently extracts and organizes information from your documents with a high degree of accuracy, providing detailed insights regarding any errors and missing data identified."
            />
            <FeatureCard
              icon={<Bot className="h-7 w-7 text-blue-700" />}
              title="AI Assistant"
              description="Chat with our AI to find missing information or get insights about your documents in real-time."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-14 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-block mb-4 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium text-sm tracking-wide uppercase">
              Our Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              How DocxifyAI <span className="text-blue-800">works</span>
            </h2>
            <p className="text-xl text-slate-600">
              Transform your documents into structured data in three simple
              steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-1/3 left-0 right-0 h-0.5 bg-blue-800"></div>

            {[
              {
                step: "01",
                title: "Upload Document",
                description:
                  "Drag & drop your document or use our API for seamless integration with your workflow",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
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
                    width="24"
                    height="24"
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
                    width="24"
                    height="24"
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
              <div
                key={index}
                className="relative bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Step number indicator */}
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <div className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:bg-blue-700 transition-colors">
                    {item.step}
                  </div>
                </div>

                <div className="pt-6">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-100 transition-colors">
                    {item.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-slate-800 mb-3 text-center">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 text-center leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom indicator */}
                <div className="w-10 h-1 bg-blue-600 rounded-full mx-auto mt-4 group-hover:w-20 transition-all duration-300"></div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-10">
            <button className="px-8 py-3 bg-blue-800 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:cursor-pointer">
              Get Started Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
"use client";

import {
  FileText,
  Bot,
  Upload,
  ArrowRight,
  CheckCircle,
  Database,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import HeroAnimation from "@/components/Home/hero-animation";
import FeatureCard from "@/components/Home/feature-card";
import TestimonialSlider from "@/components/Home/testimonial-slider";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              className="flex-1 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                Intelligent Document Processing
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 tracking-tight">
                Transform how you{" "}
                <span className="text-blue-600">process documents</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl">
                Extract, analyze, and retrieve missing information from your
                documents with our advanced AI assistant. Save time and reduce
                errors.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full border-2 border-white bg-blue-${
                        i * 100
                      } flex items-center justify-center text-xs text-white font-medium`}
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">500+</span> companies trust
                  Docxify
                </p>
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Everything you need for document processing
            </h2>
            <p className="text-lg text-slate-600">
              Our platform combines powerful AI with an intuitive interface to
              make document processing effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Upload className="h-6 w-6 text-blue-600" />}
              title="Smart Document Upload"
              description="Upload documents in various formats including PDF, DOC, and images. Our system automatically detects and processes them."
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6 text-blue-600" />}
              title="Intelligent Extraction"
              description="Our AI automatically extracts and structures important information from your documents with high accuracy."
            />
            <FeatureCard
              icon={<Bot className="h-6 w-6 text-blue-600" />}
              title="AI Assistant"
              description="Chat with our AI to find missing information or get insights about your documents in real-time."
            />
            <FeatureCard
              icon={<Database className="h-6 w-6 text-blue-600" />}
              title="Structured Data Output"
              description="Get your document data in structured JSON format that can be easily integrated with your existing systems."
            />
            <FeatureCard
              icon={<CheckCircle className="h-6 w-6 text-blue-600" />}
              title="Validation & Verification"
              description="Automatically validate extracted data against your business rules to ensure accuracy."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-blue-600" />}
              title="Secure Processing"
              description="Your documents are processed securely with enterprise-grade encryption and compliance standards."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
              Process
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              How Docxify works
            </h2>
            <p className="text-lg text-slate-600">
              Our streamlined process makes document data extraction simple and
              efficient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection lines (only visible on md and up) */}
            <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-slate-200"></div>

            {[
              {
                step: "01",
                title: "Upload Document",
                description:
                  "Upload your document through our intuitive interface or API",
              },
              {
                step: "02",
                title: "AI Processing",
                description:
                  "Our AI extracts and structures the document data automatically",
              },
              {
                step: "03",
                title: "Review & Complete",
                description:
                  "Review the extracted data and use our AI assistant to fill any gaps",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Trusted by businesses worldwide
            </h2>
            <p className="text-lg text-slate-600">
              See what our customers have to say about Docxify
            </p>
          </div>

          <TestimonialSlider />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to transform your document processing?
              </h2>
              <p className="text-blue-50 text-lg mb-6">
                Join hundreds of companies that are saving time and reducing
                errors with Docxify.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-300 text-white hover:bg-blue-700"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

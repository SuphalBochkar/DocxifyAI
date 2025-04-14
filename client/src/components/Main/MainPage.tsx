
"use client";
import { FileText, Bot, Upload, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import HeroAnimation from "@/components/Home/hero-animation";

export default function MainPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
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
            </div>
            <div className="flex-1">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Upload className="h-7 w-7 text-white" />,
                title: "Smart Document Upload",
                description:
                  "Upload documents in PDF format. Our system automatically detects errors and processes them.",
              },
              {
                icon: <FileText className="h-7 w-7 text-white" />,
                title: "Intelligent Extraction",
                description:
                  "Our AI efficiently extracts and organizes information from your documents with a high degree of accuracy, providing detailed insights regarding any errors and missing data identified.",
              },
              {
                icon: <Bot className="h-7 w-7 text-white" />,
                title: "AI Assistant",
                description:
                  "Chat with our AI to find missing information or get insights about your documents in real-time.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-md border border-blue-800/10 h-full transition-all"
              >
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-xl bg-blue-800 flex items-center justify-center shadow-md">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Document",
                description:
                  "Drag & drop your document or use our API for seamless integration with your workflow",
                icon: (
                  <Upload className="h-6 w-6 text-blue-800" />
                ),
              },
              {
                step: "02",
                title: "AI Processing",
                description:
                  "Our advanced AI engine extracts, analyzes, and structures your document data with precision",
                icon: (
                  <FileText className="h-6 w-6 text-blue-800" />
                ),
              },
              {
                step: "03",
                title: "Review & Export",
                description:
                  "Validate your data and export it in your preferred format - JSON, CSV, Excel, or API response",
                icon: (
                  <ArrowRight className="h-6 w-6 text-blue-800" />
                ),
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md border border-blue-800/10 p-8 h-full"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-800/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <button className="px-10 py-4 bg-blue-800 text-white font-medium rounded-full shadow-md hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2">
              Get Started Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

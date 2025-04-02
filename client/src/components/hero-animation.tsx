"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { FileText, CheckCircle, AlertCircle } from "lucide-react"

export default function HeroAnimation() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl">
      {/* Document UI Background */}
      <div className="absolute inset-0 bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Header Bar */}
        <div className="h-12 bg-slate-100 border-b border-slate-200 flex items-center px-4">
          <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
          <div className="flex-1 ml-2 text-sm text-slate-500">Document Processor</div>
        </div>

        {/* Document Content */}
        <div className="p-6 h-full">
          <motion.div
            className="flex flex-col h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Document Icon */}
            <motion.div
              className="mx-auto mb-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-20 h-24 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
                <FileText className="h-10 w-10 text-blue-500" />
              </div>
            </motion.div>

            {/* Document Lines */}
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="flex items-center"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                >
                  <div className="w-24 h-4 bg-slate-200 rounded mr-3"></div>
                  <div className={`flex-1 h-4 ${i % 2 === 0 ? "bg-blue-100" : "bg-slate-100"} rounded`}></div>
                  {i === 2 && (
                    <motion.div
                      className="ml-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 1 }}
                    >
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    </motion.div>
                  )}
                  {i !== 2 && (
                    <motion.div
                      className="ml-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
                    >
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* AI Chat Interface */}
            <motion.div
              className="mt-auto bg-slate-50 rounded-lg border border-slate-200 p-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <div className="flex items-start mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <div className="bg-white rounded-lg p-3 text-sm text-slate-700 shadow-sm border border-slate-100 max-w-[80%]">
                  I noticed the invoice number is missing. Based on the document, it should be INV-2023-0458. Is that
                  correct?
                </div>
              </div>

              <div className="flex items-center mt-3">
                <div className="flex-1 bg-white rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-400">
                  Type your response...
                </div>
                <motion.button
                  className="ml-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

import { ArrowRight, Bot } from "lucide-react"


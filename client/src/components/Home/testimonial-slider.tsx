"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    id: 1,
    content:
      "Docxify has transformed our invoice processing workflow. What used to take hours now takes minutes, and the AI assistant is incredibly helpful for finding missing information.",
    author: "Sarah Johnson",
    role: "Finance Director",
    company: "TechCorp Inc.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    content:
      "The accuracy of data extraction is impressive. We've reduced errors by 95% since implementing Docxify in our logistics department.",
    author: "Michael Chen",
    role: "Operations Manager",
    company: "Global Logistics",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    content:
      "As a small business owner, I was spending too much time on paperwork. Docxify has given me back hours every week that I can now spend growing my business.",
    author: "Emma Rodriguez",
    role: "CEO",
    company: "Bright Solutions",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay])

  const next = () => {
    setAutoplay(false)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setAutoplay(false)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="relative">
      <div className="overflow-hidden py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <Card className="max-w-3xl border-slate-200 shadow-sm">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-lg text-slate-700 mb-6 italic">"{testimonials[current].content}"</p>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonials[current].avatar} alt={testimonials[current].author} />
                    <AvatarFallback className="bg-blue-100 text-blue-800">
                      {testimonials[current].author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-slate-800">{testimonials[current].author}</h4>
                    <p className="text-sm text-slate-600">
                      {testimonials[current].role}, {testimonials[current].company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-slate-200 hover:bg-slate-100 hover:text-slate-900"
          onClick={prev}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous</span>
        </Button>
        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-blue-500 w-4" : "bg-slate-300"}`}
              onClick={() => {
                setAutoplay(false)
                setCurrent(i)
              }}
            >
              <span className="sr-only">Testimonial {i + 1}</span>
            </button>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-slate-200 hover:bg-slate-100 hover:text-slate-900"
          onClick={next}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    </div>
  )
}


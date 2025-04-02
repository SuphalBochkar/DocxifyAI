"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="border-slate-200 h-full transition-all duration-200 hover:shadow-md hover:border-blue-200">
        <CardHeader>
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">{icon}</div>
          <CardTitle className="text-xl text-slate-800">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-slate-600 text-base">{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  )
}


'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, Briefcase, FileSpreadsheet, MessageSquare } from 'lucide-react'

// ... (previous code remains unchanged)

export default function JobDetailsPage() {
  const [companyName, setCompanyName] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [resume, setResume] = useState<string>("")
  const [resumePrompt, setResumePrompt] = useState("")
  const [imageError, setImageError] = useState(false)

  // ... (other functions remain unchanged)

  return (
    <div className="min-h-screen bg-white text-[#333333]">
      {/* ... (header remains unchanged) */}

      <main className="container mx-auto py-8 pl-4">
        <div className="flex items-center mb-8">
          <div className="w-[100px] h-[100px] mr-6 relative">
            <Image 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Droider-dAdM6vbwN3OroOp0kCvDcjfJ4abzbc.webp"
              alt="AI assistant robot reviewing job application documents at a desk" 
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg shadow-lg"
              onError={(e) => {
                console.error('Image failed to load:', e);
                setImageError(true);
              }}
            />
            {imageError && (
              <div className="absolute inset-0 bg-gray-200 rounded-lg shadow-lg flex items-center justify-center text-gray-500 text-xs text-center">
                Image not available
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">Customize Your Job Application - In 3 Easy Steps!</h2>
            <p className="text-[#666666] mb-0 text-xl">Let our AI-powered assistant help you create the perfect resume, cover letter, and interview prep for your dream job.</p>
          </div>
        </div>

        {/* ... (rest of the component remains unchanged) */}
      </main>

      {/* ... (footer remains unchanged) */}
    </div>
  )
}
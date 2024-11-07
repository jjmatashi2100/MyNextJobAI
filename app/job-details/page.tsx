'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Upload, Briefcase, FileSpreadsheet, MessageSquare } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import mammoth from 'mammoth'
import * as pdfjs from 'pdfjs-dist'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export default function JobDetailsPage() {
  const [companyName, setCompanyName] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [resume, setResume] = useState("")
  const [resumePrompt, setResumePrompt] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [coverLetterPrompt, setCoverLetterPrompt] = useState("")
  const [interviewPrep, setInterviewPrep] = useState("")
  const [interviewPrepPrompt, setInterviewPrepPrompt] = useState("")
  const [uploadStatus, setUploadStatus] = useState("")
  const { toast } = useToast()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 256 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 256KB.",
        variant: "destructive",
      })
      return
    }

    try {
      const content = await convertFileToText(file)
      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error('Failed to upload resume')
      }

      setUploadStatus("Success - Your Resume has been Uploaded")
      toast({
        title: "Resume Uploaded",
        description: "Your resume has been successfully uploaded to Airtable.",
      })
    } catch (error) {
      console.error('Error uploading resume:', error)
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your resume. Please try again.",
        variant: "destructive",
      })
    }
  }

  const convertFileToText = async (file: File): Promise<string> => {
    const reader = new FileReader()
    
    if (file.type === 'application/pdf') {
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const typedarray = new Uint8Array(e.target?.result as ArrayBuffer)
            const pdf = await pdfjs.getDocument(typedarray).promise
            let text = ''
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i)
              const content = await page.getTextContent()
              text += content.items.map((item: any) => item.str).join(' ') + '\n'
            }
            resolve(text)
          } catch (error) {
            reject(error)
          }
        }
        reader.readAsArrayBuffer(file)
      })
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer
            const result = await mammoth.extractRawText({ arrayBuffer })
            resolve(result.value)
          } catch (error) {
            reject(error)
          }
        }
        reader.readAsArrayBuffer(file)
      })
    } else {
      // For plain text files
      return new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = (e) => reject(e)
        reader.readAsText(file)
      })
    }
  }

  const handleOptimize = (type: 'resume' | 'coverLetter' | 'interview') => {
    console.log(`Optimizing ${type}`)
    if (type === 'resume') {
      setResume('Your optimized resume will appear here...'.repeat(20).slice(0, 4000))
    } else if (type === 'coverLetter') {
      setCoverLetter('Your optimized cover letter will appear here...'.repeat(20).slice(0, 4000))
    } else if (type === 'interview') {
      setInterviewPrep('Your interview preparation content will appear here...'.repeat(20).slice(0, 4000))
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#333333]">
      <header className="bg-[#F5F5F5] py-4">
        <nav className="container mx-auto flex items-center justify-between px-4">
          <h1 className="text-2xl font-bold text-[#1A3A8F] pl-4">MyNextJob.AI</h1>
          <div className="flex-grow flex justify-center">
            <div className="inline-flex space-x-8">
              <Button variant="ghost" className="px-4 text-lg">Features</Button>
              <Button variant="ghost" className="px-4 text-lg">How It Works</Button>
              <Button variant="ghost" className="px-4 text-lg">Testimonials</Button>
            </div>
          </div>
          <div className="flex items-center space-x-4 pr-4">
            <Button variant="ghost" className="text-[#1A3A8F] hover:text-[#1A3A8F]/90 text-base">Log in</Button>
            <Button className="bg-[#1A3A8F] text-white hover:bg-[#1A3A8F]/90 text-base">Sign up</Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Customize Your Job Application - In 3 Easy Steps!</h2>
          <p className="text-[#666666] mb-0 text-xl">Let our AI-powered assistant help you create the perfect resume, cover letter, and interview prep for your dream job.</p>
        </div>

        <Card className="mb-8 shadow-lg border-2 border-[#1A3A8F]/20 rounded-xl overflow-hidden">
          <CardHeader className="bg-[#E6EAF5]">
            <CardTitle className="text-2xl">1. Resume Import</CardTitle>
            <CardDescription className="text-[#444444] text-lg">
              <span className="text-red-600 font-bold">Start Here</span> - Import your resume to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex flex-col justify-center items-center">
            <div className="w-full">
              <Input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
                accept=".pdf,.doc,.docx,.txt,.rtf,.pages"
              />
              <Button
                onClick={() => document.getElementById('resume-upload')?.click()}
                className="bg-[#1A3A8F] text-white hover:bg-[#1A3A8F]/90 rounded-full px-6 py-4 text-lg font-semibold inline-flex items-center justify-center w-full max-w-md mx-auto"
              >
                <Upload className="mr-2 h-6 w-6" />
                Import Resume (PDF, Word, TXT, RTF, Pages)
              </Button>
            </div>
            {uploadStatus && (
              <p className="mt-4 text-green-600 font-semibold">{uploadStatus}</p>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8 shadow-lg border-2 border-[#1A3A8F]/20 rounded-xl overflow-hidden">
          <CardHeader className="bg-[#E6EAF5]">
            <CardTitle className="text-2xl">2. Job Information Upload</CardTitle>
            <CardDescription className="text-[#444444] text-lg">
              <span className="font-bold text-red-600">Next</span> - Enter the details for this job application
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName" className="text-[#333333] mb-2 block">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value.slice(0, 128))}
                    className="border-[#666666] rounded-md"
                    placeholder="Enter company name"
                    maxLength={128}
                  />
                </div>
                <div>
                  <Label htmlFor="jobTitle" className="text-[#333333] mb-2 block">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value.slice(0, 128))}
                    className="border-[#666666] rounded-md"
                    placeholder="Enter job title"
                    maxLength={128}
                  />
                </div>
                <Button 
                  className="bg-[#1A3A8F] text-white hover:bg-[#1A3A8F]/90 rounded-full px-8 py-6 text-xl font-semibold inline-flex items-center justify-center w-full"
                  onClick={() => console.log("Job Information Uploaded")}
                >
                  <Upload className="mr-3 h-7 w-7" />
                  Upload Job Information
                </Button>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="jobDescription" className="text-[#333333] mb-2 block">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value.slice(0, 2000))}
                  className="border-[#666666] rounded-md h-[200px]"
                  placeholder="Copy and paste your target job description here"
                  maxLength={2000}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-12 shadow-lg border-2 border-[#1A3A8F]/20 rounded-xl overflow-hidden">
          <CardHeader className="bg-[#E6EAF5]">
            <CardTitle className="text-2xl">3. Your Downloads</CardTitle>
            <CardDescription className="text-[#444444] text-lg">
              <span className="font-bold text-red-600">Finally</span> - Optimize and download your customized resume, cover letter, and interview prep materials
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <Tabs defaultValue="resume" className="w-full">
              <TabsList className="flex w-full mb-8 border-b border-[#1A3A8F]">
                <TabsTrigger 
                  value="resume" 
                  className="flex-1 text-xl py-3 px-6 bg-white text-[#1A3A8F] border-t border-x border-[#1A3A8F] rounded-t-lg data-[state=active]:bg-[#1A3A8F] data-[state=active]:text-white -mb-px data-[state=active]:border-b-transparent transition-colors duration-200 mr-1"
                >
                  <Briefcase className="mr-2 h-6 w-6" />
                  Resume
                </TabsTrigger>
                <TabsTrigger 
                  value="coverLetter" 
                  className="flex-1 text-xl py-3 px-6 bg-white text-[#1A3A8F] border-t border-x border-[#1A3A8F] rounded-t-lg data-[state=active]:bg-[#1A3A8F] data-[state=active]:text-white -mb-px data-[state=active]:border-b-transparent transition-colors duration-200 mx-1"
                >
                  <FileSpreadsheet className="mr-2 h-6 w-6" />
                  Cover Letter
                </TabsTrigger>
                <TabsTrigger 
                  value="interview" 
                  className="flex-1 text-xl py-3 px-6 bg-white text-[#1A3A8F] border-t border-x border-[#1A3A8F] rounded-t-lg data-[state=active]:bg-[#1A3A8F] data-[state=active]:text-white -mb-px data-[state=active]:border-b-transparent transition-colors duration-200 ml-1"
                >
                  <MessageSquare className="mr-2 h-6 w-6" />
                  Interview Prep
                </TabsTrigger>
              </TabsList>
              <TabsContent value="resume">
                <Card className="shadow-lg">
                  <CardHeader className="bg-[#E6EAF5]">
                    <CardTitle className="text-xl flex items-center">
                      <Briefcase className="mr-2 h-6 w-6 text-[#1A3A8F]" />
                      Resume Optimization
                    </CardTitle>
                    <CardDescription className="text-[#666666]">
                      Tailor your resume to highlight relevant skills and experiences for this specific job opportunity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold">Targeted Resume</h3>
                        <Textarea 
                          value={resume}
                          onChange={(e) => setResume(e.target.value.slice(0, 4000))}
                          className="h-[500px] w-full rounded-md border border-[#666666] p-4"
                          placeholder="Your optimized resume will appear here..."
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Optimization</h3>
                        <p className="text-sm text-[#666666]">
                          Describe how you would like to modify your resume. Be specific about sections, skills, or experiences you want to highlight or change.
                        </p>
                        <Textarea 
                          placeholder="Enter your prompt here" 
                          value={resumePrompt} 
                          onChange={(e) => setResumePrompt(e.target.value.slice(0, 500))}
                          className="border-[#666666] rounded-md"
                          rows={6}
                        />
                        <Button 
                          onClick={() => handleOptimize('resume')} 
                          className="bg-[#1A3A8F] text-white hover:bg-[#1A3A8F]/90 rounded-full px-4 py-2 text-lg font-medium"
                        >
                          Optimize Resume
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-start p-6 bg-[#F5F5F5] space-x-4">
                    <Button className="rounded-full bg-[#2B579A] text-white hover:bg-[#2B579A]/90 px-6 py-3">
                      <span className="text-lg font-bold">Download as Word</span>
                    </Button>
                    <Button className="rounded-full bg-[#CC0000] text-white hover:bg-[#CC0000]/90 px-6 py-3">
                      <span className="text-lg font-bold">Download as PDF</span>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="coverLetter">
                <Card className="shadow-lg">
                  <CardHeader className="bg-[#E6EAF5]">
                    <CardTitle className="text-xl flex items-center">
                      <FileSpreadsheet className="mr-2 h-6 w-6 text-[#1A3A8F]" />
                      Cover Letter Generation
                    </CardTitle>
                    <CardDescription className="text-[#666666]">
                      Create a personalized cover letter that showcases your enthusiasm and qualifications for the role
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold">Generated Cover Letter</h3>
                        <Textarea 
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value.slice(0, 4000))}
                          className="h-[500px] w-full rounded-md border border-[#666666] p-4"
                          placeholder="Your generated cover letter will appear here..."
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Customization</h3>
                        <p className="text-sm text-[#666666]">
                          Provide additional details or preferences for your cover letter. Mention specific achievements or skills you want to emphasize.
                        </p>
                        <Textarea 
                          placeholder="Enter your customization instructions here" 
                          value={coverLetterPrompt} 
                          onChange={(e) => setCoverLetterPrompt(e.target.value.slice(0, 500))}
                          className="border-[#666666] rounded-md"
                          rows={6}
                        />
                        <Button 
                          onClick={() => handleOptimize('coverLetter')} 
                          className="bg-[#1A3A8F] text-white hover:bg-[#1A3A8F]/90 rounded-full px-4 py-2 text-lg font-medium"
                        >
                          Generate Cover Letter
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-start p-6 bg-[#F5F5F5] space-x-4">
                    <Button className="rounded-full bg-[#2B579A] text-white hover:bg-[#2B579A]/90 px-6 py-3">
                      <span className="text-lg font-bold">Download as Word</span>
                    </Button>
                    <Button className="rounded-full bg-[#CC0000] text-white hover:bg-[#CC0000]/90 px-6 py-3">
                      <span className="text-lg font-bold">Download as PDF</span>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="interview">
                <Card className="shadow-lg">
                  <CardHeader className="bg-[#E6EAF5]">
                    <CardTitle className="text-xl flex items-center">
                      <MessageSquare className="mr-2 h-6 w-6 text-[#1A3A8F]" />
                      Interview Preparation
                    </CardTitle>
                    <CardDescription className="text-[#666666]">
                      Prepare for your interview with tailored questions and suggested responses based on the job description
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold">Interview Questions and Answers</h3>
                        <Textarea 
                          value={interviewPrep}
                          onChange={(e) => setInterviewPrep(e.target.value.slice(0, 4000))}
                          className="h-[500px] w-full rounded-md border border-[#666666] p-4"
                          placeholder="Your interview preparation content will appear here..."
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Customization</h3>
                        <p className="text-sm text-[#666666]">
                          Specify any areas you want to focus on or particular types of questions you'd like to prepare for.
                        </p>
                        <Textarea 
                          placeholder="Enter your interview prep preferences here" 
                          value={interviewPrepPrompt} 
                          onChange={(e) => setInterviewPrepPrompt(e.target.value.slice(0, 500))}
                          className="border-[#666666] rounded-md"
                          rows={6}
                        />
                        <Button 
                          onClick={() => handleOptimize('interview')} 
                          className="bg-[#1A3A8F] text-white hover:bg-[#1A3A8F]/90 rounded-full px-4 py-2 text-lg font-medium"
                        >
                          Generate Interview Prep
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-start p-6 bg-[#F5F5F5] space-x-4">
                    <Button className="rounded-full bg-[#2B579A] text-white hover:bg-[#2B579A]/90 px-6 py-3">
                      <span className="text-lg font-bold">Download as Word</span>
                    </Button>
                    <Button className="rounded-full bg-[#CC0000] text-white hover:bg-[#CC0000]/90 px-6 py-3">
                      <span className="text-lg font-bold">Download as PDF</span>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-[#F5F5F5] py-8 mt-12">
        <div className="container mx-auto text-center text-[#666666]">
          <p>&copy; 2024 MyNextJob.AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
'use client'

import { useState } from 'react'
import FileUpload from './components/FileUpload'
import DataVisualization, { AnalysisOptions } from './components/DataVisualization'
import { analyzeData } from './lib/api'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file)
    setError(null)
    await performAnalysis(file)
  }

  const performAnalysis = async (file: File, options?: AnalysisOptions) => {
    setIsAnalyzing(true)
    setError(null)
    try {
      const result = await analyzeData(file, options)
      console.log('New analysis result:', result)
      setAnalysisResult(result)
    } catch (error) {
      console.error('Error analyzing data:', error)
      setError('An error occurred while analyzing the data. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAnalyze = async (options: AnalysisOptions) => {
    if (!uploadedFile) return
    await performAnalysis(uploadedFile, options)
  }

  const handleReset = () => {
    setAnalysisResult(null)
    setUploadedFile(null)
    setError(null)
  }

  return (
    <main className="min-h-screen p-8 md:p-24 bg-gradient-to-b from-gray-900 to-gray-950">
      <Card className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-100">Data Analysis App</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {!analysisResult && <FileUpload onUpload={handleFileUpload} />}
          {isAnalyzing && (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <p className="text-blue-500">Analyzing data...</p>
              {uploadedFile && (
                <p className="text-gray-400">File: {uploadedFile.name}</p>
              )}
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {analysisResult && (
            <>
              <DataVisualization data={analysisResult} onAnalyze={handleAnalyze} />
              <div className="flex justify-center">
                <Button onClick={handleReset} variant="outline">
                  Analyze New File
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
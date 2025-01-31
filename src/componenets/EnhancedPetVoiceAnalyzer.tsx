'use client'

import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Input } from "./ui/Input"
import { Button } from './ui/Button'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs"
import { BarChart2, Upload, Loader2, Mic, Square } from 'lucide-react'

export default function EnhancedPetVoiceAnalyzerWithRecording() {
  const [file, setFile] = useState<File | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null)
  const [analysis, setAnalysis] = useState<Record<string, number> | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  // const audioChunks = useRef<Blob[]>([])

  useEffect(() => {
    return () => {
      if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
        mediaRecorder.current.stop()
      }
    }
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile)
      setRecordedAudio(null)
      setError(null)
    } else {
      setFile(null)
      setError('Please select a valid audio file.')
    }
  }

  const startRecording = async () => {
    try {
      // const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // mediaRecorder.current = new MediaRecorder(stream)
      // audioChunks.current = []

      // mediaRecorder.current.ondataavailable = (event) => {
      //   audioChunks.current.push(event.data)
      // }

      // mediaRecorder.current.onstop = () => {
      //   const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' })
      //   setRecordedAudio(audioBlob)
      //   setFile(null)
      // }

      // mediaRecorder.current.start()
      await fetch('http://localhost:8080/api/audio/start', {
        method: 'POST'
      }).then(response => {
        if (response.ok) {
          return response.blob()
        } else {
          throw new Error('Failed to record audio')
        }
      }
      ).then(blob => {
        setRecordedAudio(blob)
      })


      setIsRecording(true)
    } catch (err) {
      console.error('Error accessing microphone:', err)
      setError('Unable to access microphone. Please check your permissions.')
    }
  }

  const stopRecording = async() => {
    // if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      // mediaRecorder.current.stop()
await fetch('http://localhost:8080/api/audio/stop', {
        method: 'POST'
      }).then(response => {
        if (response.ok) {
          return response.blob()
        } else {
          throw new Error('Failed to record audio')
        }
      }
      ).then(blob => {
        setRecordedAudio(blob)
      })
      setIsRecording(false)
    // }
  }

  const handleAnalyze = async () => {
    if (!file && !recordedAudio) {
      setError('Please select an audio file or record audio first.')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    const formData = new FormData()
    if (file) {
      formData.append('audio', file)
    } else if (recordedAudio) {
      formData.append('audio', recordedAudio, 'recorded_audio.wav')
    }

    try {
      
      formData.append('device', 'web')
      const response = await fetch('http://localhost:8080/api/audio/start', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to analyze audio')
      }

      const result = await response.json()
      setAnalysis(result)
    } catch (error) {
      console.error('Error analyzing audio:', error)
      setError('Failed to analyze audio. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
            <CardTitle className="text-center text-2xl font-bold">Pet Voice Analyzer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="record">Record</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="space-y-4">
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors duration-300"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Select Audio File
                  </Button>
                </motion.div>
                <AnimatePresence>
                  {file && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm text-gray-500"
                    >
                      {file.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </TabsContent>
              <TabsContent value="record" className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    variant="outline"
                    className={`w-full ${isRecording ? 'bg-red-100 hover:bg-red-200' : 'bg-green-100 hover:bg-green-200'} transition-colors duration-300`}
                  >
                    {isRecording ? (
                      <>
                        <Square className="w-4 h-4 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                </motion.div>
                <AnimatePresence>
                  {recordedAudio && !isRecording && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm text-gray-500"
                    >
                      Audio recorded successfully
                    </motion.p>
                  )}
                </AnimatePresence>
              </TabsContent>
            </Tabs>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full"
            >
              <Button
                onClick={handleAnalyze}
                disabled={(!file && !recordedAudio) || isAnalyzing}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <BarChart2 className="w-4 h-4 mr-2" />
                )}
                {isAnalyzing ? 'Analyzing...' : 'Analyze Pet Voice'}
              </Button>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {analysis && !isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <Card className="bg-white shadow-md">
                    <CardHeader className="bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-t-lg">
                      <CardTitle className="text-lg flex items-center justify-center">
                        <BarChart2 className="w-5 h-5 mr-2" />
                        Analysis Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <ul className="space-y-2">
                        {Object.entries(analysis).map(([emotion, score], index) => (
                          <motion.li
                            key={emotion}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex justify-between items-center"
                          >
                            <span className="capitalize text-gray-700">{emotion}</span>
                            <motion.div
                              className="w-1/2 bg-gray-200 rounded-full h-2.5 overflow-hidden"
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                              <motion.div
                                className="bg-gradient-to-r from-green-400 to-blue-400 h-2.5 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${score * 100}%` }}
                                transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                              />
                            </motion.div>
                            <span className="font-semibold text-gray-800 ml-2">
                              {(score * 100).toFixed(0)}%
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
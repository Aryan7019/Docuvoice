"use client"
import axios from 'axios'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { IconMicrophone, IconVideo, IconPlus, IconX, IconCaretRightFilled } from "@tabler/icons-react"
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

function AddNewSessionDialog() {
  const [note,setNote]=useState<string>();
  const [loading,setLoading]=useState<boolean>(false);
  const [suggestedDoctors,setSuggestedDoctors]=useState<(any)>();

  const OnClickNext=async()=>{
    setLoading(true);
    const result = await axios.post('/api/suggest-doctors', { notes: note });
    console.log(result.data);
    setLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 md:p-6 shadow-lg cursor-pointer w-full hover:shadow-xl transition-shadow">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full mb-3 md:mb-4">
              <IconMicrophone className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              Start Instant Consultation
            </h2>
            <p className="text-blue-100 text-sm md:text-base mb-4 md:mb-6">
              Connect with a doctor in minutes. 24/7 availability.
            </p>
            <div className="inline-flex bg-white text-blue-600 px-6 py-2 md:px-8 md:py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors items-center justify-center gap-2 text-sm md:text-base">
              <IconVideo className="h-4 w-4 md:h-5 md:w-5" />
              Start Voice Consultation
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <IconPlus className="h-5 w-5 text-blue-600" />
            Start New Consultation
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Add your symptoms or any details to help the AI doctor understand your condition better.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="symptoms" className="text-sm font-medium text-gray-700 dark:text-gray-300 ">
              Symptoms & Details
            </label>
            <Textarea 
              id="symptoms"
              placeholder="Describe your symptoms, duration, severity, and any other relevant information..."
              className="min-h-[120px] mt-2 resize-none border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
              onChange={(e) => setNote(e.target.value)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              The more details you provide, the better the AI doctor can assist you.
            </p>
          </div>
          
          <div className="flex gap-3 pt-2">
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 border-gray-300 dark:border-neutral-600 dark:text-white"
              >
                <IconX className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </DialogClose>
            <Button 
  type="button" 
  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center justify-center"
  disabled={!note || note.trim().length === 0}
  onClick={OnClickNext}
>
  Next
  <IconCaretRightFilled className="h-4 w-4" />
</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewSessionDialog

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  isDisabled: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onTranscription, 
  isDisabled 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        
        // For browser that support Web Speech API
        try {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.lang = 'en-US';
          
          recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            onTranscription(transcript);
          };
          
          recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            toast.error("Couldn't recognize speech");
          };
          
          // Use the recorded audio for speech recognition
          // Note: This is a simplified example. In reality, we might need 
          // to send the audio to a server for transcription
          recognition.start();
        } catch (error) {
          console.error('Speech recognition failed', error);
          toast.error("Speech recognition not supported in this browser");
        }
        
        // Stop all tracks from stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone', error);
      toast.error("Couldn't access microphone");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  if (!isSupported) {
    return (
      <Button
        variant="outline"
        size="icon"
        disabled
        className="text-slate-400 border-slate-700 bg-slate-800/50"
        title="Voice input not supported in this browser"
      >
        <MicOff className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      disabled={isDisabled}
      onClick={isRecording ? stopRecording : startRecording}
      className={`transition-all ${
        isRecording 
          ? 'bg-red-900/30 text-red-400 border-red-800/50 hover:bg-red-900/50' 
          : 'text-slate-400 border-slate-700 bg-slate-800/50 hover:text-indigo-300'
      }`}
    >
      {isRecording ? (
        <StopCircle className="h-4 w-4 animate-pulse" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};

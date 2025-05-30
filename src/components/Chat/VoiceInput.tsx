import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';

// Define TypeScript interface for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isDisabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, isDisabled = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';
      
      recognition.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
          
        if (event.results[event.resultIndex].isFinal) {
          onTranscript(transcript);
        }
      };
      
      recognition.current.onerror = () => {
        toast.error("Error occurred with voice recognition");
        setIsRecording(false);
      };
      
      recognition.current.onend = () => {
        setIsRecording(false);
      };
    }
    
    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, [onTranscript]);
  
  const toggleRecording = () => {
    if (!recognition.current) {
      toast.error("Speech recognition not supported in your browser");
      return;
    }
    
    if (isRecording) {
      recognition.current.stop();
      setIsRecording(false);
    } else {
      recognition.current.start();
      setIsRecording(true);
      toast.info("Listening for voice input...");
    }
  };
  
  return (
    <Button
      onClick={toggleRecording}
      variant="outline"
      size="icon"
      disabled={isDisabled}
      className={`relative w-10 h-10 rounded-xl border-border/50 transition-all duration-200 ${
        isRecording 
          ? 'bg-red-500/10 text-red-500 border-red-500/30 animate-pulse' 
          : 'bg-background/50 backdrop-blur-sm hover:bg-muted/50'
      }`}
      title={isRecording ? "Stop recording" : "Start voice input"}
    >
      {isRecording ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
      {isRecording && (
        <div className="absolute inset-0 rounded-xl bg-red-500/20 animate-ping" />
      )}
    </Button>
  );
};

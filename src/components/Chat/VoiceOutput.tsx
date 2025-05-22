
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface VoiceOutputProps {
  text: string;
  isLatestMessage: boolean;
}

// Default ElevenLabs voice ID (for Rachel voice)
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";
// Default ElevenLabs API key - would be better from environment variables
const DEFAULT_API_KEY = "your-eleven-labs-api-key"; 

export const VoiceOutput: React.FC<VoiceOutputProps> = ({ 
  text, 
  isLatestMessage 
}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [elevenLabsKey, setElevenLabsKey] = useState<string>(() => {
    return localStorage.getItem('elevenlabs_api_key') || '';
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Save API key to localStorage when it changes
  useEffect(() => {
    if (elevenLabsKey) {
      localStorage.setItem('elevenlabs_api_key', elevenLabsKey);
    }
  }, [elevenLabsKey]);

  // Handle auto-play for latest message if enabled
  useEffect(() => {
    if (isLatestMessage && isEnabled && text && !isPlaying) {
      handlePlay();
    }
  }, [isLatestMessage, isEnabled, text]);

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handlePlay = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    const apiKey = elevenLabsKey || DEFAULT_API_KEY;
    
    if (!apiKey) {
      toast.error("Please provide an ElevenLabs API key for voice output");
      return;
    }

    // Limit text length to prevent large API requests
    const limitedText = text.substring(0, 1000);
    
    try {
      setIsPlaying(true);
      
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${DEFAULT_VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': apiKey
          },
          body: JSON.stringify({
            text: limitedText,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.75,
              similarity_boost: 0.75
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.message || 'Failed to convert text to speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      } else {
        const audio = new Audio(audioUrl);
        audio.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
          toast.error("Error playing audio");
        };
        audio.play();
        audioRef.current = audio;
      }
    } catch (error) {
      console.error('Error with ElevenLabs API:', error);
      setIsPlaying(false);
      toast.error(`Text-to-speech error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 mt-1.5">
      <div className="flex items-center space-x-2">
        <Switch
          id="voice-mode"
          checked={isEnabled}
          onCheckedChange={setIsEnabled}
        />
        <Label htmlFor="voice-mode" className="text-xs text-slate-400">
          Voice Output
        </Label>
      </div>
      
      <div className="flex items-center gap-2">
        {isEnabled && (
          <input
            type="password"
            value={elevenLabsKey}
            onChange={(e) => setElevenLabsKey(e.target.value)}
            placeholder="ElevenLabs API Key (optional)"
            className="px-2 py-1 text-xs rounded-md bg-slate-800 border border-slate-700 text-slate-300 placeholder:text-slate-500 w-52"
          />
        )}
        
        <Button
          variant="outline"
          size="icon"
          disabled={!text || (!elevenLabsKey && !DEFAULT_API_KEY)}
          onClick={handlePlay}
          className={`h-6 w-6 ${
            isPlaying 
              ? 'bg-indigo-900/30 text-indigo-400 border-indigo-800/50' 
              : 'text-slate-400 border-slate-700 bg-slate-800/50'
          }`}
        >
          {isPlaying ? (
            <VolumeX className="h-3 w-3" />
          ) : (
            <Volume2 className="h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  );
};

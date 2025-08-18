import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '../ui/button';
import { Mic, MicOff } from 'lucide-react';
import { toast } from '@/components/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface VoiceCommandsProps {
  categories?: Array<{ _id: string; title: string; questions: any[] }>;
  onCategoryOpen?: (categoryId: string) => void;
  onSearchQuery?: (query: string) => void;
  onDifficultyFilter?: (difficulty: string) => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionError extends Event {
  error: string;
  message?: string;
}

const VoiceCommands: React.FC<VoiceCommandsProps> = ({
  categories = [],
  onCategoryOpen,
  onSearchQuery,
  onDifficultyFilter,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const navigate = useNavigate();
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setIsSupported(true);
        synthRef.current = window.speechSynthesis;
        
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          setTranscript('');
          speak("I'm listening...");
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const result = event.results[event.resultIndex];
          const transcript = result[0].transcript.toLowerCase();
          const confidence = result[0].confidence;
          
          setTranscript(transcript);
          setConfidence(confidence);
          
          processCommand(transcript);
        };

        recognition.onerror = (event: SpeechRecognitionError) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          if (event.error === 'not-allowed') {
            toast({
              title: "Microphone Access Denied",
              description: "Please allow microphone access to use voice commands.",
              variant: "destructive",
            });
          } else if (event.error === 'no-speech') {
            speak("I didn't hear anything. Please try again.");
          } else {
            speak("Sorry, I couldn't understand that. Please try again.");
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setIsSupported(false);
        console.warn('Speech Recognition API not supported');
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (synthRef.current && 'speechSynthesis' in window) {
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Alex') || 
        voice.name.includes('Samantha')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      synthRef.current.speak(utterance);
    }
  }, []);

  const processCommand = useCallback((command: string) => {
    console.log('Processing command:', command);
    
    if (command.includes('go to dashboard') || command.includes('open dashboard')) {
      navigate('/dashboard');
      speak("Opening dashboard");
      return;
    }

    if (command.includes('go to progress') || command.includes('open progress')) {
      navigate('/progress');
      speak("Opening progress page");
      return;
    }

    if (command.includes('go to bookmarks') || command.includes('open bookmarks')) {
      navigate('/bookmarks');
      speak("Opening bookmarks");
      return;
    }

    if (command.includes('go to profile') || command.includes('open profile')) {
      navigate('/profile');
      speak("Opening profile settings");
      return;
    }

    const categoryMatch = categories.find(category => {
      const categoryName = category.title.toLowerCase();
      return command.includes(`open ${categoryName}`) || 
             command.includes(`show ${categoryName}`) ||
             command.includes(categoryName);
    });

    if (categoryMatch && onCategoryOpen) {
      onCategoryOpen(categoryMatch._id);
      speak(`Opening ${categoryMatch.title} questions`);
      return;
    }

    if (command.includes('search for') || command.includes('find')) {
      const searchQuery = command
        .replace(/^(search for|find)/i, '')
        .trim();
      
      if (searchQuery && onSearchQuery) {
        onSearchQuery(searchQuery);
        speak(`Searching for ${searchQuery}`);
        return;
      }
    }

    if (command.includes('show easy') || command.includes('filter easy')) {
      if (onDifficultyFilter) {
        onDifficultyFilter('Easy');
        speak("Showing easy questions");
        return;
      }
    }

    if (command.includes('show medium') || command.includes('filter medium')) {
      if (onDifficultyFilter) {
        onDifficultyFilter('Medium');
        speak("Showing medium questions");
        return;
      }
    }

    if (command.includes('show hard') || command.includes('filter hard')) {
      if (onDifficultyFilter) {
        onDifficultyFilter('Hard');
        speak("Showing hard questions");
        return;
      }
    }

    if (command.includes('clear filters') || command.includes('reset filters')) {
      if (onDifficultyFilter) {
        onDifficultyFilter('');
        speak("Clearing all filters");
        return;
      }
    }

    if (command.includes('help') || command.includes('what can you do')) {
      const helpText = "I can help you navigate. Try saying: 'go to dashboard', 'open arrays', 'search for sorting', 'show easy questions', or 'help' for this message.";
      speak(helpText);
      toast({
        title: "Voice Commands Help",
        description: "Check the console for available commands or say 'help' anytime.",
      });
      return;
    }

    speak("I didn't understand that command. Say 'help' to see what I can do.");
    
    toast({
      title: "Command not recognized",
      description: `"${command}" - Try saying "help" for available commands.`,
      variant: "destructive",
    });
  }, [categories, navigate, onCategoryOpen, onSearchQuery, onDifficultyFilter, speak]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast({
          title: "Voice Recognition Error",
          description: "Could not start voice recognition. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && event.ctrlKey && !event.shiftKey) {
        event.preventDefault();
        toggleListening();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleListening]);

  if (!isSupported) {
    return (
      <div className="fixed bottom-4 right-4 p-2 bg-gray-600 text-white rounded-lg text-xs max-w-xs">
        Voice commands not supported in this browser
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col items-end gap-2">
        {transcript && (
          <div className="bg-black/80 text-white p-3 rounded-lg max-w-xs backdrop-blur-sm animate-slide-up">
            <div className="text-xs text-gray-300 mb-1">
              Voice Command ({Math.round(confidence * 100)}% confidence)
            </div>
            <div className="text-sm">{transcript}</div>
          </div>
        )}

        <Button
          onClick={toggleListening}
          className={`w-14 h-14 rounded-full p-0 transition-all duration-300 shadow-lg ${
            isListening 
              ? 'bg-red-600 hover:bg-red-700 animate-pulse-gentle' 
              : 'bg-blue-600 hover:bg-blue-700 hover:scale-110'
          }`}
          title={isListening ? 'Stop listening (Ctrl+Space)' : 'Start voice commands (Ctrl+Space)'}
        >
          {isListening ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>

        <div className="text-xs text-gray-400 text-center max-w-[200px]">
          {isListening ? (
            <span className="text-red-400">🎙️ Listening...</span>
          ) : (
            "Click or press Ctrl+Space for voice commands"
          )}
        </div>
      </div>

      {isListening && (
        <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-20"></div>
      )}
    </div>
  );
};

export default VoiceCommands;
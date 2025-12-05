
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Loader2, Sparkles, AlertCircle, ShieldCheck, Power, Lock, Camera, X, Scan, CheckCircle, ShoppingCart, ArrowRight, AlertTriangle, Mic, MicOff } from 'lucide-react';
import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { Message, User, Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AIChatProps {
    user: User | null;
    isEnabled: boolean;
    onToggle: () => void;
    products: Product[];
    onAddToCart: (product: Product) => void;
}

interface AnalysisResult {
    diseaseName: string;
    symptoms: string[];
    recommendedProductIds: number[];
    explanation: string;
}

export const AIChat: React.FC<AIChatProps> = ({ user, isEnabled, onToggle, products, onAddToCart }) => {
  const { language } = useLanguage(); // Get current language context
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Namaste! I am your Krushi Mitra. \n\n**Option 1:** Type or Speak your query.\n**Option 2:** Click the 'Scan Crop' button to detect diseases using your camera.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // --- VOICE INPUT STATE ---
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // --- SCANNER STATES ---
  const [scanStep, setScanStep] = useState<0 | 1 | 2 | 3>(0); // 0: Idle, 1: Camera, 2: Processing, 3: Result
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Ref to hold the Chat session instance
  const chatSessionRef = useRef<Chat | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = () => {
    if (!process.env.API_KEY) {
      console.error("API Key is missing!");
      return null;
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are an expert agricultural advisor for "Kastkar Krushi Seva Kendra" located in Keliweli, Maharashtra.
        
        YOUR ROLE:
        1. Identify crop diseases and pests.
        2. EXPLAIN symptoms clearly.
        3. DIAGNOSE based on descriptions.
        4. Respond in the language the user asks in (Marathi or English).
        
        IMPORTANT:
        - Do NOT recommend generic chemical names or specific brands unless they are strictly common knowledge (like Neem Oil).
        - Refer users to the shop for "Specific Medicines".
        `,
      },
    });
  };

  // Initialize chat on mount
  useEffect(() => {
    chatSessionRef.current = initializeChat();
    
    // Cleanup recognition on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
         chatSessionRef.current = initializeChat();
      }
      
      if (!chatSessionRef.current) {
        throw new Error("Failed to initialize AI Chat");
      }

      // Optimistic UI
      const responseId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: responseId,
        role: 'model',
        text: '', 
        timestamp: new Date()
      }]);

      const result = await chatSessionRef.current.sendMessageStream({ message: userMessage.text });
      
      let fullText = '';
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const chunkText = c.text || '';
        fullText += chunkText;
        setMessages(prev => prev.map(msg => msg.id === responseId ? { ...msg, text: fullText } : msg));
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I apologize, but I'm having trouble connecting to the network right now.",
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // --- VOICE INPUT HANDLER ---
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support voice input. Please use Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'mr' ? 'mr-IN' : 'en-IN'; // Set language based on app context
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => (prev ? prev + ' ' + transcript : transcript));
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };


  // --- CAMERA & ANALYSIS LOGIC ---

  const startCamera = async () => {
    setScanStep(1);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setCameraStream(stream);
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Camera access denied. Please allow camera permissions.");
        setScanStep(0);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
    }
  };

  const capturePhoto = () => {
      if (videoRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
              ctx.drawImage(videoRef.current, 0, 0);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
              setCapturedImage(dataUrl);
              analyzeImage(dataUrl);
          }
      }
      stopCamera();
  };

  const analyzeImage = async (base64Image: string) => {
      setScanStep(2); // Processing state
      
      if (!process.env.API_KEY) {
          alert("API Key missing");
          setScanStep(0);
          return;
      }

      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          
          // Prepare list of available products for AI to choose from
          const availableProducts = products.map(p => ({ id: p.id, name: p.name, category: p.category }));
          
          const prompt = `
            Analyze this plant/crop image.
            1. Identify the specific disease, pest, or deficiency.
            2. List exactly 3 distinctive symptoms observed in the image.
            3. From the provided 'Available Products' list, select the product IDs that would best treat this condition. If none match perfectly, select the closest general purpose pesticide/fertilizer.
            
            Available Products: ${JSON.stringify(availableProducts)}
            
            Return ONLY a valid JSON object with this structure:
            {
                "diseaseName": "Name of disease",
                "symptoms": ["Symptom 1", "Symptom 2", "Symptom 3"],
                "explanation": "Short 1-sentence explanation of what is happening.",
                "recommendedProductIds": [id1, id2]
            }
          `;

          // Clean base64 string
          const cleanBase64 = base64Image.split(',')[1];

          const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: [
                  { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
                  { text: prompt }
              ],
              config: {
                  responseMimeType: "application/json",
                  responseSchema: {
                      type: Type.OBJECT,
                      properties: {
                          diseaseName: { type: Type.STRING },
                          symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
                          explanation: { type: Type.STRING },
                          recommendedProductIds: { type: Type.ARRAY, items: { type: Type.NUMBER } }
                      }
                  }
              }
          });

          const resultText = response.text;
          if (resultText) {
              const resultData = JSON.parse(resultText) as AnalysisResult;
              setAnalysisResult(resultData);
              setScanStep(3); // Result state
          } else {
              throw new Error("Empty response from AI");
          }

      } catch (error) {
          console.error("Vision Analysis Error", error);
          alert("Could not analyze image. Please try again.");
          setScanStep(0);
      }
  };

  const closeScanner = () => {
      stopCamera();
      setScanStep(0);
      setCapturedImage(null);
      setAnalysisResult(null);
  };

  // --- RENDER HELPERS ---

  const renderRecommendedProducts = (ids: number[]) => {
      const recProducts = products.filter(p => ids.includes(p.id));
      if (recProducts.length === 0) return <p className="text-sm text-slate-500 italic">No specific medicines in stock. Please visit the shop for advice.</p>;

      return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {recProducts.map(p => (
                  <div key={p.id} className="bg-white border border-green-200 rounded-xl p-3 shadow-sm flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                      <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-slate-800 truncate">{p.name}</h4>
                          <p className="text-green-700 font-bold text-xs">₹{p.price}</p>
                      </div>
                      <button 
                        onClick={() => onAddToCart(p)}
                        className="bg-green-700 text-white p-2 rounded-lg hover:bg-green-800"
                        title="View Details"
                      >
                          <ArrowRight size={16} />
                      </button>
                  </div>
              ))}
          </div>
      );
  };


  // --- DISABLED STATE (Guests) ---
  if (!isEnabled && !user) {
      return (
          <div className="max-w-4xl mx-auto h-[400px] flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 shadow-inner p-8 text-center my-8">
              <div className="bg-slate-200 p-6 rounded-full mb-6">
                  <Bot size={64} className="text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-2">Krushi Mitra is Sleeping</h3>
              <p className="text-slate-500 max-w-md">The AI service is currently disabled. Please contact the owner.</p>
          </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto h-[600px] flex flex-col bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8 relative">
      
      {/* SCANNER OVERLAY MODAL */}
      {scanStep > 0 && (
          <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col animate-in fade-in duration-300">
              
              {/* Header */}
              <div className="p-4 flex justify-between items-center text-white bg-black/20 backdrop-blur-sm absolute top-0 w-full z-10">
                  <div className="flex items-center gap-2">
                      <Scan className="text-yellow-400" />
                      <span className="font-bold">AI Disease Detector</span>
                  </div>
                  <button onClick={closeScanner} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><X size={20} /></button>
              </div>

              {/* STEP 1: CAMERA VIEW */}
              {scanStep === 1 && (
                  <div className="flex-1 relative flex flex-col">
                      <video ref={videoRef} autoPlay playsInline className="flex-1 object-cover w-full h-full" />
                      
                      {/* Grid Overlay */}
                      <div className="absolute inset-0 border-2 border-white/30 m-8 rounded-3xl pointer-events-none">
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-yellow-400 -mt-1 -ml-1 rounded-tl-lg"></div>
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-yellow-400 -mt-1 -mr-1 rounded-tr-lg"></div>
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-yellow-400 -mb-1 -ml-1 rounded-bl-lg"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-yellow-400 -mb-1 -mr-1 rounded-br-lg"></div>
                      </div>

                      <div className="bg-black/80 p-6 flex justify-center items-center gap-8">
                          <button onClick={capturePhoto} className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center hover:bg-white/40 transition-all">
                              <div className="w-16 h-16 bg-white rounded-full"></div>
                          </button>
                      </div>
                  </div>
              )}

              {/* STEP 2: PROCESSING VIEW */}
              {scanStep === 2 && (
                  <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 text-white p-8">
                      {capturedImage && (
                          <img src={capturedImage} alt="Captured" className="w-32 h-32 rounded-2xl object-cover mb-8 border-4 border-green-500 opacity-50" />
                      )}
                      <div className="relative">
                          <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
                          <Loader2 size={64} className="text-green-400 animate-spin relative z-10" />
                      </div>
                      <h3 className="text-2xl font-bold mt-8">Analyzing Crop...</h3>
                      <p className="text-slate-400 mt-2">Identifying symptoms and checking medicines</p>
                  </div>
              )}

              {/* STEP 3, 4, 5: RESULTS VIEW */}
              {scanStep === 3 && analysisResult && (
                  <div className="flex-1 bg-slate-50 flex flex-col overflow-y-auto">
                      {/* Image Header */}
                      <div className="relative h-48 bg-black">
                          <img src={capturedImage || ''} alt="Analyzed" className="w-full h-full object-cover opacity-80" />
                          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">DISEASE DETECTED</span>
                              <h2 className="text-3xl font-bold text-white leading-none">{analysisResult.diseaseName}</h2>
                          </div>
                      </div>

                      <div className="p-6 space-y-6">
                           {/* Explanation */}
                           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                               <p className="text-slate-700 italic">"{analysisResult.explanation}"</p>
                           </div>

                           {/* Symptoms */}
                           <div>
                               <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                                   <AlertTriangle size={18} className="text-orange-500" />
                                   Identified Symptoms
                               </h3>
                               <ul className="space-y-2">
                                   {analysisResult.symptoms.map((sym, idx) => (
                                       <li key={idx} className="flex items-start gap-3 bg-orange-50 p-3 rounded-lg text-sm text-slate-700">
                                           <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 shrink-0"></span>
                                           {sym}
                                       </li>
                                   ))}
                               </ul>
                           </div>

                           {/* Recommended Medicines */}
                           <div>
                               <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                                   <ShoppingCart size={18} className="text-green-600" />
                                   Recommended Medicines (In Stock)
                               </h3>
                               {renderRecommendedProducts(analysisResult.recommendedProductIds)}
                           </div>
                           
                           <div className="pt-4 text-center">
                               <button onClick={() => setScanStep(1)} className="text-green-700 font-bold hover:underline">
                                   Scan Another Crop
                               </button>
                           </div>
                      </div>
                  </div>
              )}
          </div>
      )}

      {/* Admin Control Bar (Owner Only) */}
      {user && (
          <div className="bg-slate-800 text-white p-3 flex justify-between items-center z-20">
              <span className="font-bold flex items-center gap-2 text-sm">
                  <ShieldCheck size={16} className="text-yellow-400" /> 
                  Owner Control
              </span>
              <button
                  onClick={() => {
                      if (isEnabled) {
                          if (window.confirm('Are you sure you want to disable Krushi Mitra AI? Farmers will not be able to use this feature.')) {
                              onToggle();
                          }
                      } else {
                          onToggle();
                      }
                  }}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-xs transition-all shadow-lg ${
                      isEnabled ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
              >
                  <Power size={14} />
                  {isEnabled ? 'AI Enabled' : 'AI Disabled'}
              </button>
          </div>
      )}

      {/* Chat Header */}
      <div className={`bg-gradient-to-r ${isEnabled ? 'from-green-700 to-emerald-600' : 'from-slate-600 to-slate-500'} p-4 flex items-center justify-between shadow-md z-10 transition-colors duration-300`}>
        <div className="flex items-center space-x-3 text-white">
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
             {isEnabled ? <Sparkles size={24} className="text-yellow-300" /> : <Lock size={24} className="text-slate-300" />}
          </div>
          <div>
            <h2 className="font-bold text-lg">Krushi Mitra AI</h2>
            <p className="text-xs text-green-100 opacity-90">
                {isEnabled ? 'Identifying Diseases & Insects' : 'Service Disabled (Admin Mode)'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 ${!isEnabled ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
                msg.role === 'user' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-indigo-100 text-indigo-700'
              }`}>
                {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
              </div>

              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-green-600 text-white rounded-tr-none'
                    : msg.isError 
                      ? 'bg-red-50 text-red-800 border border-red-200 rounded-tl-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                {msg.role === 'model' && !msg.isError ? (
                  <div className="prose prose-sm max-w-none prose-green prose-p:my-1 prose-headings:my-2 prose-strong:text-slate-900">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                   <div className="whitespace-pre-wrap">{msg.text}</div>
                )}
                <div className={`text-[10px] mt-2 flex justify-end ${
                    msg.role === 'user' ? 'text-green-200' : 'text-slate-400'
                }`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
               <div className="flex max-w-[75%] flex-row items-start gap-3">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mt-1">
                       <Bot size={16} />
                   </div>
                   <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center space-x-2">
                       <Loader2 className="animate-spin text-green-600" size={16} />
                       <span className="text-slate-500 text-sm">Identifying...</span>
                   </div>
               </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 relative">
        <div className="flex space-x-2 relative">
          
          {/* CAMERA BUTTON */}
          <button 
            onClick={startCamera}
            disabled={!isEnabled}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-3 rounded-full transition-colors flex items-center justify-center border border-slate-200"
            title="Scan Crop Disease"
          >
              <Camera size={24} className="text-green-600" />
          </button>

          {/* MIC BUTTON */}
          <button 
            onClick={toggleListening}
            disabled={!isEnabled}
            className={`p-3 rounded-full transition-all flex items-center justify-center border ${
                isListening 
                ? 'bg-red-500 text-white border-red-500 animate-pulse' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
            }`}
            title="Voice Input"
          >
              {isListening ? <MicOff size={24} /> : <Mic size={24} className="text-blue-600" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Describe symptoms..."}
            className="flex-1 bg-slate-100 border-none rounded-full px-6 py-4 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-green-500 focus:bg-white transition-all outline-none"
            disabled={isLoading || !isEnabled}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim() || !isEnabled}
            className={`absolute right-2 top-2 p-2 rounded-full transition-all ${
              isLoading || !input.trim() || !isEnabled
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105 shadow-md'
            }`}
          >
            <Send size={20} className={isLoading ? 'opacity-0' : 'opacity-100'} />
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 size={20} className="animate-spin text-slate-500" />
                </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

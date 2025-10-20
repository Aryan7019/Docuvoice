"use client"

import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { DoctorAgent } from '../../components/DoctorAgentsList'
import { Bot, MessageCircle, PhoneOff, PhoneCall, Loader2, UserCircle2, MicOff } from 'lucide-react'
import { Navbar } from '@/app/_components/Navbar'
import Image from 'next/image'
import Vapi from '@vapi-ai/web';

type SessionDetail = {
    id: number,
    notes: string,
    sessionId: string,
    report: any,
    selectedDoctor: DoctorAgent,
    createdOn: string,
    voiceId: string,
    agentPrompt: string,
}

type Message = {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    isComplete?: boolean;
}

function MedicalVoiceAgent() {
    const { sessionId } = useParams();
    const [sessionDetails, setSessionDetails] = useState<SessionDetail | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [callTimer, setCallTimer] = useState(0);
    const [messages, setMessages] = useState<Message[]>([]);
    const [vapi, setVapi] = useState<any>(null);
    const [callError, setCallError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
        if (!apiKey) {
            console.error("VAPI Error: NEXT_PUBLIC_VAPI_API_KEY is not set.");
            setCallError("Client configuration error. Cannot initialize call service.");
            return;
        }

        if (typeof window !== 'undefined') {
            const vapiInstance = new Vapi(apiKey);
            setVapi(vapiInstance);

            vapiInstance.on('call-start', () => {
                console.log('Call started');
                setIsConnected(true);
                setIsConnecting(false);
                setCallError(null);
            });

            vapiInstance.on('call-end', () => {
                console.log('Call ended');
                setIsConnected(false);
                setIsConnecting(false);
                setMessages(prev => prev.map(msg => ({ ...msg, isComplete: true })));
            });

            vapiInstance.on('message', (message: any) => {
                if (message.type === 'transcript' && message.transcript) {
                    const role = message.role;
                    const transcript = message.transcript;
                    const isFinal = message.transcriptType === 'final';

                    setMessages(prevMessages => {
                        const lastMessageIndex = prevMessages.findLastIndex(
                            (msg) => msg.role === role && !msg.isComplete
                        );

                        if (lastMessageIndex !== -1) {
                            const updatedMessages = [...prevMessages];
                            updatedMessages[lastMessageIndex] = {
                                ...updatedMessages[lastMessageIndex],
                                content: transcript,
                                isComplete: isFinal,
                            };
                            return updatedMessages;
                        } else {
                            const newMessage: Message = {
                                id: `${Date.now()}-${Math.random()}`,
                                role: role,
                                content: transcript,
                                timestamp: new Date(),
                                isComplete: isFinal,
                            };
                            return [...prevMessages, newMessage];
                        }
                    });
                }
            });

            vapiInstance.on('error', (error: any) => {
                console.error('VAPI error:', error);
                setIsConnecting(false);
                const errorMessage = error.message || 'An unknown error occurred.';
                if (errorMessage.includes('Permission denied')) {
                    setCallError('Microphone access was denied. Please allow microphone access in your browser settings.');
                } else {
                    setCallError(`Connection failed: ${errorMessage}`);
                }
            });

            return () => {
                vapiInstance.stop();
            };
        }
    }, []);

    const StartCall = async () => {
        if (!vapi) {
            setCallError("Call service is not available. Please check the configuration.");
            return;
        }
        
        if (!sessionDetails?.selectedDoctor?.voiceId || !sessionDetails?.selectedDoctor?.agentPrompt) {
            console.error("StartCall Error: Session details with voiceId and agentPrompt are not loaded.");
            setCallError("Agent details not loaded. Please refresh and try again.");
            return;
        }

        const VapiAgentConfig = {
            name: 'AI Medical Assistant',
            firstMessage: 'Hello! How can I assist you with your health concerns today?',
            transcriber: {
                provider: 'deepgram', 
                language: 'en-US',
            },
            voice: {
                provider: 'playht',
                voiceId: sessionDetails.selectedDoctor.voiceId,
            },
            model: {
                provider: 'openai',
                model: 'gpt-4o', 
                messages: [
                    {
                        role: 'system',
                        content: sessionDetails.selectedDoctor.agentPrompt,
                    }
                ]
            }
        }

        try {
            setIsConnecting(true);
            setCallError(null);
            setMessages([]);
            await vapi.start(VapiAgentConfig);
        } catch (error: any) {
            console.error('Failed to start call:', error);
            setIsConnecting(false);
            const errorMessage = error.message || 'An unexpected error occurred.';
            if (errorMessage.includes('Permission denied')) {
                setCallError('Microphone access denied. Please enable it in your browser to start the call.');
            } else {
                setCallError(`Failed to start the call. Please try again.`);
            }
        }
    }

    const EndCall = () => {
        if (!vapi) return;
        try {
            vapi.stop();
            setMessages(prev => prev.map(msg => !msg.isComplete ? { ...msg, isComplete: true } : msg));
        } catch (error) {
            console.error('Failed to end call:', error);
        }
    }

    useEffect(() => {
        if (sessionId) {
            GetSessionDetails();
        }
    }, [sessionId]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isConnected) {
            interval = setInterval(() => {
                setCallTimer(prev => prev + 1);
            }, 1000);
        } else {
            setCallTimer(0);
        }
        return () => clearInterval(interval);
    }, [isConnected]);

    const GetSessionDetails = async () => {
        try {
            const result = await axios.get(`/api/session-chat?sessionId=${sessionId}`);
            console.log("Fetched session details:", result.data);
            setSessionDetails(result.data);
        } catch (error) {
            console.error('Failed to fetch session details:', error);
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    const formatMessageTime = (timestamp: Date) => {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-purple-900/20 relative">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-3xl opacity-30"></div>
            </div>

            <div className="relative z-10">
                <Navbar />

                <div className="mt-20 py-5">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-row justify-between items-center">
                            <div className={`flex items-center space-x-3 px-4 py-3 rounded-full backdrop-blur-sm transition-all duration-300 ${isConnected
                                ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
                                : isConnecting
                                    ? 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800'
                                    : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
                                }`}>
                                <div className="relative flex items-center justify-center">
                                    {isConnected && (
                                        <div className="absolute inset-0 animate-ping bg-green-400 rounded-full opacity-75"></div>
                                    )}
                                    {isConnecting && (
                                        <div className="absolute inset-0 animate-ping bg-yellow-400 rounded-full opacity-75"></div>
                                    )}
                                    <div className={`relative w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}></div>
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-sm font-semibold ${isConnected
                                        ? 'text-green-700 dark:text-green-300'
                                        : isConnecting
                                            ? 'text-yellow-700 dark:text-yellow-300'
                                            : 'text-red-700 dark:text-red-300'
                                        }`}>
                                        {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Not Connected'}
                                    </span>
                                </div>
                            </div>

                            <div className={`flex items-center space-x-3 px-4 py-3 rounded-full border backdrop-blur-sm transition-all duration-300 ${isConnected
                                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'
                                : 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800'
                                }`}>
                                <Bot className="h-5 w-5 text-purple-500" />
                                <div className="flex flex-col items-end">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        {formatTime(callTimer)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {sessionDetails?.selectedDoctor ? (
                    <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 space-y-8 flex-1 max-w-4xl mx-auto w-full pb-8">
                        <div className="flex flex-col items-center text-center space-y-6 w-full">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                                    <Image
                                        src={sessionDetails.selectedDoctor.image}
                                        alt={sessionDetails.selectedDoctor.specialist}
                                        width={160}
                                        height={160}
                                        className="rounded-full object-cover border-4 border-white dark:border-neutral-800 shadow-xl w-full h-full"
                                        priority
                                    />
                                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-1 shadow-lg">
                                        <Bot className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                                <div className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white dark:border-neutral-800 ${isConnected ? 'bg-green-500 animate-pulse' : isConnecting ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'
                                    }`}></div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-center space-x-2">
                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        {sessionDetails.selectedDoctor.specialist}
                                    </h3>
                                    <Bot className="h-6 w-6 text-purple-500" />
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-md leading-relaxed">
                                    {sessionDetails.selectedDoctor.description}
                                </p>
                                <div className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                                    <MessageCircle className="h-3 w-3 text-blue-500" />
                                    <span className="text-xs text-blue-600 dark:text-blue-400">AI Medical Assistant</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex-1 max-w-2xl">
                            <div
                                ref={chatContainerRef}
                                className="h-64 sm:h-80 w-full p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-neutral-900 dark:to-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-lg overflow-y-auto"
                            >
                                <div className="flex flex-col space-y-3 min-h-full">
                                    {messages.length === 0 ? (
                                        <div className="flex-1 flex items-center justify-center">
                                            <div className="text-center py-8">
                                                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-gray-400">
                                                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                                    <span className="text-sm font-medium">
                                                        {isConnecting ? 'Establishing connection...' : 'Start session to begin AI conversation'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        messages.map((message) => (
                                            <div key={message.id} className={`flex items-end ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                {message.role === 'assistant' && (
                                                    <div className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-2 h-8 w-8 mr-2 flex items-center justify-center">
                                                        <Bot className="h-4 w-4 text-white" />
                                                    </div>
                                                )}
                                                <div className={`max-w-xs sm:max-w-md ${message.role === 'user'
                                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-none'
                                                        : 'bg-white dark:bg-neutral-800 rounded-2xl rounded-tl-none'
                                                    } px-4 py-3 shadow-lg border border-gray-100 dark:border-neutral-700`}>
                                                    <p className={`whitespace-normal break-words ${message.role === 'assistant' ? 'text-gray-700 dark:text-gray-300' : 'text-white'}`}>
                                                        {message.content}
                                                        {!message.isComplete && message.role === 'assistant' && <span className="inline-block w-1 h-4 bg-gray-400 ml-1 animate-pulse"></span>}
                                                    </p>
                                                    <span className={`text-xs ${message.role === 'user' ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'} mt-1 block text-right`}>
                                                        {formatMessageTime(message.timestamp)}
                                                    </span>
                                                </div>
                                                {message.role === 'user' && (
                                                    <div className="flex-shrink-0 h-10 w-10 ml-2 flex items-center justify-center">
                                                        <UserCircle2 className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>
                        </div>

                        <div className="w-full max-w-md space-y-2">
                            <button
                                onClick={isConnected ? EndCall : StartCall}
                                disabled={isConnecting || !!callError}
                                className={`group relative w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed ${isConnected
                                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                                    : isConnecting
                                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                                        : !!callError
                                            ? 'bg-gradient-to-r from-gray-400 to-gray-500'
                                            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                                    }`}
                            >
                                {!isConnecting && (
                                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                )}

                                <span className="relative flex items-center justify-center space-x-2">
                                    {isConnecting ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Connecting...</span>
                                        </>
                                    ) : isConnected ? (
                                        <>
                                            <PhoneOff className="h-5 w-5" />
                                            <span>End Consultation</span>
                                        </>
                                    ) : (
                                        <>
                                            <PhoneCall className="h-5 w-5" />
                                            <span>Start Consultation</span>
                                        </>
                                    )}
                                </span>
                            </button>
                            
                            {callError && (
                                <div className="flex items-center justify-center space-x-2 text-center text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                    <MicOff className="h-5 w-5 flex-shrink-0" />
                                    <span>{callError}</span>
                                </div>
                            )}

                            {!callError && (
                                <p className={`text-xs text-center px-4 
                                    ${isConnecting ? 'text-yellow-600 dark:text-yellow-400'
                                        : isConnected ? 'text-green-600 dark:text-green-400'
                                            : 'text-gray-500 dark:text-gray-400'
                                    }
                                    `}>
                                    {isConnecting ? 'Establishing connection with AI assistant...'
                                        : isConnected ? 'AI session active. Speak naturally with your medical assistant.'
                                            : 'Connect with your AI medical assistant for voice consultation'}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-screen">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading AI agent details...</p>
                    </div>
                )}
            </div>
        </div>
    )
} 

export default MedicalVoiceAgent;
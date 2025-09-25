"use client"

import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { DoctorAgent } from '../../components/DoctorAgentsList'
import { Circle, Bot, MessageCircle, PhoneOff, PhoneCall, Loader2 } from 'lucide-react'
import { Navbar } from '@/app/_components/Navbar'
import Image from 'next/image'
import Vapi from '@vapi-ai/web';

type SessionDetail = {
    id: number,
    notes: string,
    sessionId: string,
    report: any,
    selectedDoctor: DoctorAgent,
    createdOn: string
}

type Message = {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    isComplete?: boolean; // New field to track if message is complete
}

function MedicalVoiceAgent() {
    const { sessionId } = useParams();
    const [sessionDetails, setSessionDetails] = useState<SessionDetail | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [callTimer, setCallTimer] = useState(0);
    const [messages, setMessages] = useState<Message[]>([]);
    const [vapi, setVapi] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Track the last assistant message ID for updates
    const lastAssistantMessageIdRef = useRef<string | null>(null);

    // Auto-scroll to bottom when new messages are added
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Initialize Vapi only on client side
        if (typeof window !== 'undefined') {
            const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
            setVapi(vapiInstance);

            // Set up event listeners
            vapiInstance.on('call-start', () => {
                console.log('Call started');
                setIsConnected(true);
                setIsConnecting(false);
            });

            vapiInstance.on('call-end', () => {
                console.log('Call ended');
                setIsConnected(false);
                setIsConnecting(false);
                // Reset last assistant message ID when call ends
                lastAssistantMessageIdRef.current = null;
            });

            vapiInstance.on('message', (message: any) => {
    if (message.type === 'transcript') {
        console.log(`${message.role}: ${message.transcript}`);
        
        setMessages(prev => {
            // For user messages, always create a new message
            if (message.role === 'user') {
                return [...prev, {
                    id: Date.now().toString() + Math.random(),
                    role: 'user' as const, // Explicitly type as const
                    content: message.transcript,
                    timestamp: new Date(),
                    isComplete: true
                }];
            }
            
            // For assistant messages
            if (message.role === 'assistant') {
                const currentLastMessage = prev[prev.length - 1];
                
                // If the last message is from assistant and not complete, update it
                if (currentLastMessage && 
                    currentLastMessage.role === 'assistant' && 
                    currentLastMessage.id === lastAssistantMessageIdRef.current &&
                    !currentLastMessage.isComplete) {
                    
                    // Check if this is a continuation or new thought
                    const isContinuation = message.transcript.toLowerCase().startsWith(
                        currentLastMessage.content.toLowerCase().substring(0, 10)
                    );
                    
                    if (isContinuation) {
                        // Update existing assistant message
                        return prev.map(msg => 
                            msg.id === lastAssistantMessageIdRef.current 
                                ? { ...msg, content: message.transcript }
                                : msg
                        );
                    } else {
                        // New thought - mark previous as complete and create new message
                        const updatedPrev = prev.map(msg => 
                            msg.id === lastAssistantMessageIdRef.current 
                                ? { ...msg, isComplete: true }
                                : msg
                        );
                        
                        const newMessage: Message = { // Explicitly type as Message
                            id: Date.now().toString() + Math.random(),
                            role: 'assistant',
                            content: message.transcript,
                            timestamp: new Date(),
                            isComplete: false
                        };
                        
                        lastAssistantMessageIdRef.current = newMessage.id;
                        return [...updatedPrev, newMessage];
                    }
                } else {
                    // Create new assistant message
                    const newMessage: Message = { // Explicitly type as Message
                        id: Date.now().toString() + Math.random(),
                        role: 'assistant',
                        content: message.transcript,
                        timestamp: new Date(),
                        isComplete: false
                    };
                    
                    lastAssistantMessageIdRef.current = newMessage.id;
                    return [...prev, newMessage];
                }
            }
            
            return prev;
        });
    }
});

            // Handle speech start/end to mark messages as complete
            vapiInstance.on('speech-start', () => {
                console.log('Speech started');
            });

            vapiInstance.on('speech-end', () => {
                console.log('Speech ended');
                // Mark the last assistant message as complete when speech ends
                setMessages(prev => {
                    if (lastAssistantMessageIdRef.current) {
                        return prev.map(msg => 
                            msg.id === lastAssistantMessageIdRef.current 
                                ? { ...msg, isComplete: true }
                                : msg
                        );
                    }
                    return prev;
                });
            });

            vapiInstance.on('error', (error: any) => {
                console.error('VAPI error:', error);
                setIsConnecting(false);
            });

            return () => {
                // Cleanup
                vapiInstance.stop();
            };
        }
    }, []);

    const StartCall = async () => {
        if (!vapi) return;
        
        try {
            setIsConnecting(true);
            // Clear previous messages and reset state
            setMessages([]);
            lastAssistantMessageIdRef.current = null;
            await vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID!);
        } catch (error) {
            console.error('Failed to start call:', error);
            setIsConnecting(false);
        }
    }

    const EndCall = () => {
        if (!vapi) return;
        
        try {
            vapi.stop();
            // Mark any incomplete assistant messages as complete when call ends
            setMessages(prev => 
                prev.map(msg => 
                    msg.role === 'assistant' && !msg.isComplete 
                        ? { ...msg, isComplete: true }
                        : msg
                )
            );
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

    // Group consecutive messages from the same role
    const groupedMessages = messages.reduce<Message[][]>((groups, message) => {
        const lastGroup = groups[groups.length - 1];
        
        if (lastGroup && lastGroup[0].role === message.role) {
            // Add to existing group if same role
            lastGroup.push(message);
        } else {
            // Start new group
            groups.push([message]);
        }
        
        return groups;
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-purple-900/20 relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-3xl opacity-30"></div>
            </div>
            
            <div className="relative z-10">
                <Navbar />

                {/* AI Connection Status Header */}
                <div className="mt-20 py-5">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-row justify-between items-center">
                            {/* AI Connection Status */}
                            <div className={`flex items-center space-x-3 px-4 py-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                                isConnected 
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
                                    <div className={`relative w-3 h-3 rounded-full ${
                                        isConnected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}></div>
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-sm font-semibold ${
                                        isConnected 
                                            ? 'text-green-700 dark:text-green-300' 
                                            : isConnecting
                                            ? 'text-yellow-700 dark:text-yellow-300'
                                            : 'text-red-700 dark:text-red-300'
                                    }`}>
                                        {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Not Connected'}
                                    </span>
                                </div>
                            </div>

                            {/* Timer with AI Theme */}
                            <div className={`flex items-center space-x-3 px-4 py-3 rounded-full border backdrop-blur-sm transition-all duration-300 ${
                                isConnected 
                                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' 
                                    : isConnecting
                                    ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800'
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
                        {/* AI Agent Profile Section */}
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
                                    {/* AI Badge */}
                                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-1 shadow-lg">
                                        <Bot className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                                {/* Connection Status Dot */}
                                <div className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white dark:border-neutral-800 ${
                                    isConnected ? 'bg-green-500 animate-pulse' : isConnecting ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'
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

                        {/* AI Conversation Interface */}
                        <div className="w-full flex-1 max-w-2xl">
                            <div 
                                ref={chatContainerRef}
                                className="h-64 sm:h-80 w-full p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-neutral-900 dark:to-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-lg overflow-y-auto"
                            >
                                <div className="flex flex-col space-y-3 min-h-full">
                                    {groupedMessages.length === 0 ? (
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
                                        groupedMessages.map((messageGroup, groupIndex) => (
                                            <div key={groupIndex} className={`flex ${messageGroup[0].role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                {messageGroup[0].role === 'assistant' && (
                                                    <div className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-2 h-8 w-8 mt-1 mr-2 flex items-center justify-center">
                                                        <Bot className="h-3 w-3 text-white" />
                                                    </div>
                                                )}
                                                <div className={`flex-1 max-w-xs sm:max-w-md ${
                                                    messageGroup[0].role === 'user' 
                                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-none' 
                                                        : 'bg-white dark:bg-neutral-800 rounded-2xl rounded-tl-none'
                                                } px-4 py-3 shadow-lg border border-gray-100 dark:border-neutral-700`}>
                                                    {/* For user groups, show each message as separate paragraph */}
                                                    {messageGroup[0].role === 'user' ? (
                                                        <div className="space-y-2">
                                                            {messageGroup.map((message, idx) => (
                                                                <p key={message.id} className="whitespace-normal break-words">
                                                                    {message.content}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        /* For assistant, show the latest message content (real-time updates) */
                                                        <p className="whitespace-normal break-words text-gray-700 dark:text-gray-300">
                                                            {messageGroup[messageGroup.length - 1].content}
                                                        </p>
                                                    )}
                                                    <span className={`text-xs ${messageGroup[0].role === 'user' ? 'text-blue-200' : 'text-gray-500'} mt-1 block`}>
                                                        {formatMessageTime(messageGroup[messageGroup.length - 1].timestamp)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>
                        </div>

                        {/* AI Action Button */}
                        <div className="w-full max-w-md space-y-4">
                            <button
                                onClick={isConnected ? EndCall : StartCall}
                                disabled={isConnecting}
                                className={`group relative w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed ${
                                    isConnected
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                                        : isConnecting
                                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
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
                            
                            {isConnecting ? (
                                <p className="mb-5 text-xs text-yellow-600 dark:text-yellow-400 text-center px-4">
                                    Establishing connection with AI assistant...
                                </p>
                            ) : !isConnected ? (
                                <p className="mb-5 text-xs text-gray-500 dark:text-gray-400 text-center px-4">
                                    Connect with your AI medical assistant for voice consultation
                                </p>
                            ) : (
                                <p className="mb-5 text-xs text-green-600 dark:text-green-400 text-center px-4">
                                    AI session active. Speak naturally with your medical assistant.
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center flex-1 px-4 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading AI agent details...</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MedicalVoiceAgent;
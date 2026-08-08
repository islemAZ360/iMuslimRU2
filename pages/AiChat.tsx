import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {
    loadConversations,
    getConversation,
    deleteConversation,
    appendMessage,
    makeMessage,
    createConversation,
    compressImage,
    type Conversation,
    type ChatMessage,
} from '../services/chatMemoryService';
import { sendChatMessage } from '../services/aiChatService';
import { hasValidApiKey, getApiKey, setApiKey } from '../services/geminiService';

const formatTime = (ts: number) =>
    new Date(ts).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const AiChat: React.FC = () => {
    const location = useLocation();

    const [activeId, setActiveId] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [active, setActive] = useState<Conversation | null>(null);
    const [input, setInput] = useState('');
    const [attachedImage, setAttachedImage] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const [streamingText, setStreamingText] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    const [apiKeyInput, setApiKeyInput] = useState('');
    const [showKeySetup, setShowKeySetup] = useState(!hasValidApiKey());
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const refreshList = () => setConversations(loadConversations());
    const refreshActive = (id: string) => setActive(getConversation(id));

    // Network status
    useEffect(() => {
        const onOnline = () => setIsOnline(true);
        const onOffline = () => setIsOnline(false);
        window.addEventListener('online', onOnline);
        window.addEventListener('offline', onOffline);
        return () => {
            window.removeEventListener('online', onOnline);
            window.removeEventListener('offline', onOffline);
        };
    }, []);

    // Initial load + open conversation passed via navigation state
    useEffect(() => {
        refreshList();
    }, []);

    useEffect(() => {
        const state = location.state as { conversationId?: string } | null;
        if (state?.conversationId) {
            setActiveId(state.conversationId);
            window.history.replaceState({}, document.title);
        }
    }, [location.state?.conversationId]);

    useEffect(() => {
        if (activeId) refreshActive(activeId);
    }, [activeId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [active?.messages.length, sending, streamingText]);

    const handleDelete = (id: string) => {
        deleteConversation(id);
        refreshList();
        if (activeId === id) {
            setActiveId(null);
            setActive(null);
        }
    };

    const handlePickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = async () => {
            const dataUrl = reader.result as string;
            try {
                setAttachedImage(await compressImage(dataUrl, 1024, 0.8));
            } catch {
                setAttachedImage(dataUrl);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSaveApiKey = () => {
        const key = apiKeyInput.trim();
        if (key.length > 10) {
            setApiKey(key);
            setShowKeySetup(false);
            setNotice(null);
        }
    };

    const handleSend = async () => {
        const text = input.trim();
        if ((!text && !attachedImage) || sending) return;

        if (!hasValidApiKey()) {
            setShowKeySetup(true);
            return;
        }

        if (!isOnline) {
            setNotice('⚠️ لا يوجد اتصال بالانترنت. يحتاج Sheikh AI إلى انترنت للعمل.');
            return;
        }

        // Create (and persist) the conversation on first message
        let conv = activeId ? getConversation(activeId) : null;
        if (!conv) {
            conv = createConversation();
            setActiveId(conv.id);
            refreshList();
        }

        const userMsg: ChatMessage = makeMessage('user', text, attachedImage);
        appendMessage(conv.id, userMsg);
        refreshActive(conv.id);
        setInput('');
        setAttachedImage(null);
        setSending(true);
        setNotice(null);

        try {
            const history = (getConversation(conv.id)?.messages || []).slice(0, -1);
            setStreamingText('');
            let acc = '';
            const reply = await sendChatMessage(
                history,
                text,
                userMsg.image || null,
                (delta) => {
                    acc += delta;
                    setStreamingText(acc);
                },
                conv?.persona
            );
            appendMessage(conv.id, makeMessage('assistant', reply));
        } catch (error: any) {
            console.error('Sheikh AI error:', error);
            const msg = String(error?.message || error || '');

            if (msg.includes('API_KEY_MISSING')) {
                setShowKeySetup(true);
                appendMessage(conv.id, makeMessage(
                    'assistant',
                    '⚠️ Gemini API key is not set. Enter your API key above to get started.',
                ));
            } else if (msg.includes('429') || msg.includes('quota') || msg.includes('402')) {
                const keySnippet = getApiKey().slice(-4);
                appendMessage(conv.id, makeMessage(
                    'assistant',
                    `⚠️ Credit limit reached or Rate limited (Key ending in ...${keySnippet}). Please check your OpenRouter credits.`,
                ));
            } else {
                appendMessage(conv.id, makeMessage(
                    'assistant',
                    `⚠️ Error: Could not get a response. Details: ${msg}`,
                ));
            }
        }

        refreshActive(conv.id);
        refreshList();
        setSending(false);
        setStreamingText(null);
    };

    // ---------------- CONVERSATION LIST VIEW ----------------
    if (!active) {
        return (
            <div className="pb-32 pt-6 px-4 min-h-screen flex flex-col max-w-lg mx-auto w-full animate-in fade-in duration-500">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-bright via-white to-gold-bright">Sheikh AI</h1>
                        <p className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-[0.3em] mt-1">Islamic AI Companion</p>
                    </div>
                </div>

                {/* Status badge */}
                <div className="flex items-center self-center gap-2 rounded-full border border-gold/20 bg-gold/5 p-1.5 mb-6">
                    <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${isOnline ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                        <span className={`size-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                        {isOnline ? 'Gemini AI · Online' : 'Offline'}
                    </span>
                </div>

                {/* API Key setup */}
                {showKeySetup && (
                    <div className="mb-6 p-4 rounded-2xl bg-gold/5 border border-gold/25">
                        <p className="text-[10px] text-gold-200 text-center leading-relaxed mb-3">
                            أدخل مفتاح Gemini API للبدء (مجاني من <span className="font-mono text-emerald-300">aistudio.google.com</span>)
                        </p>
                        <div className="flex gap-2">
                            <input
                                value={apiKeyInput}
                                onChange={e => setApiKeyInput(e.target.value)}
                                placeholder="AIza..."
                                className="flex-1 min-w-0 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gold/40"
                            />
                            <button
                                onClick={handleSaveApiKey}
                                disabled={apiKeyInput.trim().length <= 10}
                                className="px-4 py-2 rounded-xl bg-gold-500/20 border border-gold-500/40 text-gold-200 text-[10px] font-bold uppercase tracking-widest hover:bg-gold-500/30 active:scale-95 transition-all disabled:opacity-40"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                )}

                {/* New chat */}
                <button
                    onClick={() => {
                        const conv = createConversation();
                        setActiveId(conv.id);
                        setNotice(null);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-900/30 border border-emerald-500/30 text-emerald-200 text-xs font-bold uppercase tracking-[0.3em] hover:bg-emerald-900/50 active:scale-[0.99] transition-all mb-8"
                >
                    <span className="material-symbols-outlined text-lg">add_comment</span>
                    New Conversation
                </button>

                {notice && (
                    <div className="mb-4 p-3 rounded-xl bg-gold/10 border border-gold/30 text-[11px] text-gold-200 text-center">{notice}</div>
                )}

                {/* Conversation list */}
                <div className="space-y-3">
                    {conversations.length === 0 ? (
                        <div className="flex flex-col items-center py-16 text-center opacity-60">
                            <span className="material-symbols-outlined text-5xl text-gold/40 mb-4">auto_awesome</span>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">No conversations yet</p>
                            <p className="text-[10px] text-gray-500 mt-2">Scan a product or start chatting with Sheikh AI</p>
                        </div>
                    ) : (
                        conversations.map(conv => {
                            const last = conv.messages[conv.messages.length - 1];
                            return (
                                <div
                                    key={conv.id}
                                    onClick={() => setActiveId(conv.id)}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-gold/40 transition-colors cursor-pointer group"
                                >
                                    <div className="size-11 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-gold-300 text-xl">{last?.image ? 'image' : 'chat'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-0.5">
                                            <h3 className="text-sm font-bold text-white truncate">{conv.title}</h3>
                                            <span className="text-[9px] text-gray-500 shrink-0 font-mono">{formatTime(conv.updatedAt)}</span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 truncate">{last ? (last.role === 'user' ? 'You: ' : (active?.persona?.includes('Doctor AI') ? 'Doctor AI: ' : 'Sheikh AI: ')) + last.content : 'Empty conversation'}</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(conv.id); }}
                                        className="size-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-red-400 hover:border-red-500/40 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                                    >
                                        <span className="material-symbols-outlined text-base">delete</span>
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        );
    }

    // ---------------- CHAT VIEW ----------------
    return (
        <div className="h-screen flex flex-col max-w-lg mx-auto w-full relative animate-in fade-in duration-300" dir="ltr">
            {/* Header */}
            <div className="pt-10 pb-3 px-4 flex items-center gap-3 border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-20">
                <button
                    onClick={() => { setActiveId(null); setActive(null); setNotice(null); }}
                    className="size-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                </button>
                <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-bold text-white truncate">{active.persona?.includes('Doctor AI') ? 'Doctor AI' : active.title}</h2>
                    <p className="text-[9px] uppercase tracking-widest flex items-center gap-1">
                        <span className={`size-1.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                        <span className={isOnline ? 'text-emerald-400/80' : 'text-red-400/80'}>
                            {isOnline ? 'Online' : 'Offline'}
                        </span>
                    </p>
                </div>
                <button
                    onClick={() => handleDelete(active.id)}
                    className="size-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors"
                >
                    <span className="material-symbols-outlined text-base">delete</span>
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {active.messages.length === 0 && (
                    <div className="flex flex-col items-center py-8 text-center">
                        <div className={`size-16 rounded-2xl ${active.persona?.includes('Doctor AI') ? 'bg-blue-900/20 border-blue-500/30' : 'bg-gold/10 border-gold/30'} border flex items-center justify-center mb-3`}>
                            <span className={`material-symbols-outlined ${active.persona?.includes('Doctor AI') ? 'text-blue-300' : 'text-gold-300'} text-3xl`}>
                                {active.persona?.includes('Doctor AI') ? 'medical_services' : 'auto_awesome'}
                            </span>
                        </div>
                        <h3 className="text-lg font-serif font-bold text-white">{active.persona?.includes('Doctor AI') ? 'Doctor AI' : 'Sheikh AI'}</h3>
                        <p className="text-[10px] text-gray-500 max-w-[240px] leading-relaxed mt-1">
                            {active.persona?.includes('Doctor AI') 
                                ? 'I can analyze food, suggest exercises, and provide wellness guidance.' 
                                : 'Ask anything about Islam, food rulings (halal/haram), or send a product image for analysis.'}
                        </p>
                    </div>
                )}

                {active.messages.map(m => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] px-4 py-3 rounded-2xl border ${m.role === 'user'
                            ? 'bg-gold/15 border-gold/30 rounded-br-md'
                            : 'bg-emerald-950/40 border-white/10 rounded-bl-md'}`}>
                            {m.image && (
                                <img src={m.image} alt="Attached" className="rounded-xl max-h-56 w-auto mb-2 border border-white/10" />
                            )}
                            {m.content && (
                                <div dir="auto" className="text-sm text-white/95 leading-relaxed break-words space-y-2 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&_strong]:text-gold-300">
                                    <ReactMarkdown>{m.content}</ReactMarkdown>
                                </div>
                            )}
                            <div className={`mt-1.5 text-[9px] ${m.role === 'user' ? 'text-gold-200/50 text-right' : 'text-gray-600'}`}>
                                {formatTime(m.createdAt)}
                            </div>
                        </div>
                    </div>
                ))}

                {sending && streamingText !== null && (
                    <div className="flex justify-start">
                        <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-emerald-950/40 border border-white/10 rounded-bl-md">
                            <div dir="auto" className="text-sm text-white/95 leading-relaxed break-words space-y-2 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&_strong]:text-gold-300">
                                <ReactMarkdown>{streamingText + ' ▋'}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                )}

                {sending && streamingText === null && (
                    <div className="flex justify-start">
                        <div className="px-4 py-3 rounded-2xl bg-emerald-950/40 border border-white/10 rounded-bl-md flex items-center gap-2">
                            <span className="size-2 rounded-full bg-gold animate-pulse"></span>
                            <span className="size-2 rounded-full bg-gold animate-pulse [animation-delay:150ms]"></span>
                            <span className="size-2 rounded-full bg-gold animate-pulse [animation-delay:300ms]"></span>
                            <span className="text-[10px] text-white/40 ml-1 uppercase tracking-widest">Thinking...</span>
                        </div>
                    </div>
                )}

                {/* Offline notice */}
                {!isOnline && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-[11px] text-red-300 text-center">
                        ⚠️ لا يوجد اتصال بالانترنت. يحتاج Sheikh AI إلى انترنت للعمل.
                    </div>
                )}

                {notice && (
                    <div className="p-3 rounded-xl bg-gold/10 border border-gold/30 text-[11px] text-gold-200 text-center">{notice}</div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="px-4 pb-28 pt-2 bg-gradient-to-t from-black via-black/95 to-transparent">
                {attachedImage && (
                    <div className="flex items-center gap-3 mb-2">
                        <img src={attachedImage} alt="Attachment" className="h-14 rounded-xl border border-gold/30" />
                        <button
                            onClick={() => setAttachedImage(null)}
                            className="size-7 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-red-400 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>
                )}
                <div className="flex items-end gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePickImage}
                        className="hidden"
                        accept="image/*"
                        capture="environment"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="size-11 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-300 hover:bg-white/10 transition-colors"
                    >
                        <span className="material-symbols-outlined text-xl">add_photo_alternate</span>
                    </button>
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder={showIntro ? "Ask Sheikh AI anything..." : "Message Sheikh AI..."}
                        className="flex-1 min-w-0 bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold/40 transition-colors"
                        dir="auto"
                    />
                    <button
                        onClick={handleSend}
                        disabled={(!input.trim() && !attachedImage) || sending}
                        className="size-11 shrink-0 rounded-2xl bg-gold/80 text-black flex items-center justify-center hover:bg-gold disabled:opacity-40 active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined text-xl">arrow_upward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiChat;

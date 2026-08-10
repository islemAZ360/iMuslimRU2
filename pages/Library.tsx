import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { libraryData, LibraryCategory, LibraryTopic, LibrarySubTopic, LibraryContent } from '../data/libraryData';

const Library: React.FC = () => {
    const { t, profile, updateProfile } = useUser();
    
    const [currentCategory, setCurrentCategory] = useState<LibraryCategory | null>(null);
    const [currentTopic, setCurrentTopic] = useState<LibraryTopic | null>(null);
    const [currentSubTopic, setCurrentSubTopic] = useState<LibrarySubTopic | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Navigation Helpers
    const goBack = () => {
        if (currentSubTopic) {
            setCurrentSubTopic(null);
        } else if (currentTopic) {
            setCurrentTopic(null);
        } else if (currentCategory) {
            setCurrentCategory(null);
        } else if (searchQuery) {
            setSearchQuery('');
        }
    };

    // Progress Logic
    const completedTopics = profile.completedLibraryTopics || [];
    
    const toggleCompleted = (subTopicId: string) => {
        const isCompleted = completedTopics.includes(subTopicId);
        const newCompleted = isCompleted 
            ? completedTopics.filter(id => id !== subTopicId)
            : [...completedTopics, subTopicId];
        updateProfile({ completedLibraryTopics: newCompleted });
    };

    const getCategoryProgress = (category: LibraryCategory) => {
        let total = 0;
        let completed = 0;
        category.topics.forEach(t => {
            t.subTopics.forEach(s => {
                total++;
                if (completedTopics.includes(s.id)) completed++;
            });
        });
        return { total, completed, percentage: total === 0 ? 0 : Math.round((completed / total) * 100) };
    };

    const getGlobalProgress = () => {
        let total = 0;
        let completed = 0;
        libraryData.forEach(cat => {
            cat.topics.forEach(t => {
                t.subTopics.forEach(s => {
                    total++;
                    if (completedTopics.includes(s.id)) completed++;
                });
            });
        });
        return { total, completed, percentage: total === 0 ? 0 : Math.round((completed / total) * 100) };
    };

    const getLastReadInfo = () => {
        if (!profile.lastReadSubTopicId) return null;
        for (const cat of libraryData) {
            for (const top of cat.topics) {
                for (const sub of top.subTopics) {
                    if (sub.id === profile.lastReadSubTopicId) {
                        return { category: cat, topic: top, subTopic: sub };
                    }
                }
            }
        }
        return null;
    };

    const handleSubTopicSelect = (sub: LibrarySubTopic) => {
        setCurrentSubTopic(sub);
        updateProfile({ lastReadSubTopicId: sub.id });
    };

    // Global Search Logic
    const getSearchResults = () => {
        if (!searchQuery.trim()) return [];
        const results: { category: string; topic: string; subTopic: LibrarySubTopic }[] = [];
        const query = searchQuery.toLowerCase();

        libraryData.forEach(cat => {
            cat.topics.forEach(top => {
                top.subTopics.forEach(sub => {
                    if (
                        sub.title.includes(query) ||
                        sub.blocks.some(b => b.content.includes(query)) ||
                        top.title.includes(query)
                    ) {
                        results.push({ category: cat.title, topic: top.title, subTopic: sub });
                    }
                });
            });
        });
        return results;
    };

    const searchResults = getSearchResults();

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const renderContentBlock = (block: LibraryContent, index: number) => {
        switch (block.type) {
            case 'text':
                return <p key={index} className="text-sm text-gray-300 leading-relaxed mb-4 font-sans">{block.content}</p>;
            case 'hadith':
                return (
                    <div key={index} className="my-6 p-5 bg-gold/10 border-l-4 border-gold rounded-r-xl">
                        <p className="text-md font-serif text-gold-light leading-loose text-center">« {block.content} »</p>
                    </div>
                );
            case 'quran':
                return (
                    <div key={index} className="my-6 p-6 glass-panel border border-emerald-500/30 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full blur-xl"></div>
                        <p className="text-lg font-serif text-emerald-400 leading-loose text-center relative z-10">
                            ﴾ {block.content} ﴿
                        </p>
                    </div>
                );
            case 'highlight':
                return <h4 key={index} className="text-md font-bold text-gold mt-6 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-gold rounded-full"></span>
                    {block.content}
                </h4>;
            case 'step':
                return (
                    <div key={index} className="flex items-start gap-3 mb-3 bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="material-symbols-outlined text-gold mt-0.5 text-[18px]">check_circle</span>
                        <p className="text-sm text-gray-200 leading-relaxed font-sans">{block.content}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex-1 flex flex-col pt-12 pb-24 px-6 relative max-w-md w-full mx-auto">
            
            {/* Header / Breadcrumbs */}
            <div className="flex items-center gap-3 mb-6 relative z-10">
                {(currentCategory || currentTopic || currentSubTopic || searchQuery) ? (
                    <button 
                        onClick={goBack}
                        className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors backdrop-blur-md"
                    >
                        <span className="material-symbols-outlined text-gold">arrow_back_ios_new</span>
                    </button>
                ) : (
                    <div className="size-10 rounded-full bg-gradient-to-br from-gold-dark to-gold-light p-[1px]">
                        <div className="size-full bg-black/80 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-gold">local_library</span>
                        </div>
                    </div>
                )}
                <div className="flex flex-col">
                    <h1 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark tracking-wide drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)]">
                        {currentSubTopic ? currentSubTopic.title : currentTopic ? currentTopic.title : currentCategory ? currentCategory.title : 'مكتبة المؤمن'}
                    </h1>
                    <div className="flex items-center gap-1 text-[10px] text-gold-dim uppercase tracking-widest mt-1">
                        {searchQuery && !currentSubTopic ? <span>نتائج البحث</span> : null}
                        {currentCategory && <span>{currentCategory.title}</span>}
                        {currentTopic && <><span className="material-symbols-outlined text-[10px]">chevron_right</span><span>{currentTopic.title}</span></>}
                    </div>
                </div>
            </div>

            {/* Hero Dashboard Section (Only visible at root level) */}
            {!currentCategory && !currentTopic && !currentSubTopic && !searchQuery && (
                <div className="mb-6 flex flex-col gap-4">
                    {/* Welcome & Stats */}
                    <div className="relative rounded-3xl overflow-hidden glass-panel border border-gold/20 p-6 flex flex-row items-center justify-between">
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent pointer-events-none"></div>
                        <div className="flex flex-col z-10">
                            <h2 className="text-xl font-serif font-bold text-gold-light mb-1">اقرأ باسم ربك</h2>
                            <p className="text-xs text-gray-300 font-sans">واصل رحلتك في طلب العلم الشرعي.</p>
                        </div>
                        <div className="relative size-16 flex items-center justify-center shrink-0 z-10">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path
                                    className="text-white/10"
                                    strokeWidth="3"
                                    stroke="currentColor"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                    className="text-gold transition-all duration-1000 ease-out"
                                    strokeWidth="3"
                                    strokeDasharray={`${getGlobalProgress().percentage}, 100`}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-[10px] font-bold text-gold-light leading-none">{getGlobalProgress().percentage}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Continue Reading */}
                    {getLastReadInfo() && (
                        <div 
                            onClick={() => handleSubTopicSelect(getLastReadInfo()!.subTopic)}
                            className="glass-panel p-4 rounded-2xl border border-emerald-500/30 hover:border-emerald-500/60 transition-all flex items-center gap-4 cursor-pointer relative overflow-hidden group"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/50 group-hover:bg-emerald-400 transition-colors"></div>
                            <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                <span className="material-symbols-outlined">menu_book</span>
                            </div>
                            <div className="flex flex-col flex-1 text-right">
                                <span className="text-[10px] text-emerald-400/70 mb-0.5">مواصلة القراءة</span>
                                <span className="font-serif font-bold text-sm text-gray-200">{getLastReadInfo()!.subTopic.title}</span>
                            </div>
                            <span className="material-symbols-outlined text-gray-500 text-sm">arrow_forward_ios</span>
                        </div>
                    )}
                </div>
            )}

            {/* Search Bar (Only visible at root level) */}
            {!currentCategory && !currentTopic && !currentSubTopic && (
                <div className="relative mb-8 z-10">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gold/50">search</span>
                    </div>
                    <input 
                        type="text" 
                        placeholder="ابحث في المكتبة (فقه، عقيدة، قصص...)" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-right text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 transition-colors"
                        dir="rtl"
                    />
                </div>
            )}

            <AnimatePresence mode="wait">
                
                {/* Search Results View */}
                {searchQuery && !currentSubTopic && (
                    <motion.div 
                        key="search-results"
                        initial="hidden" animate="show" exit="hidden"
                        variants={containerVariants}
                        className="flex flex-col gap-3"
                    >
                        {searchResults.length === 0 ? (
                            <div className="text-center py-10">
                                <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">search_off</span>
                                <p className="text-gray-400 font-sans">لا توجد نتائج تطابق بحثك</p>
                            </div>
                        ) : (
                            searchResults.map((res, index) => {
                                const isCompleted = completedTopics.includes(res.subTopic.id);
                                return (
                                    <motion.button
                                        variants={itemVariants}
                                        key={res.subTopic.id + index}
                                        onClick={() => handleSubTopicSelect(res.subTopic)}
                                        className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-gold/50 transition-all flex items-center gap-4 group text-right relative overflow-hidden"
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${isCompleted ? 'bg-emerald-500' : 'bg-gold/30 group-hover:bg-gold'}`}></div>
                                        <div className="flex flex-col flex-1">
                                            <span className="font-serif font-bold text-sm text-gray-200 group-hover:text-gold-light transition-colors">{res.subTopic.title}</span>
                                            <span className="text-[10px] text-gray-400 mt-1">{res.category} • {res.topic}</span>
                                        </div>
                                        {isCompleted ? (
                                            <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                                        ) : (
                                            <span className="material-symbols-outlined text-gray-500 text-sm">menu_book</span>
                                        )}
                                    </motion.button>
                                );
                            })
                        )}
                    </motion.div>
                )}

                {/* Level 1: Categories */}
                {!currentCategory && !searchQuery && (
                    <motion.div 
                        key="categories"
                        initial="hidden" animate="show" exit="hidden"
                        variants={containerVariants}
                        className="grid grid-cols-2 gap-4"
                    >
                        {libraryData.map(cat => {
                            const progress = getCategoryProgress(cat);
                            return (
                                <motion.button
                                    variants={itemVariants}
                                    key={cat.id}
                                    onClick={() => setCurrentCategory(cat)}
                                    className="glass-panel p-5 rounded-3xl border border-white/10 hover:border-gold/50 transition-all flex flex-col items-center justify-center text-center gap-3 group h-36 relative overflow-hidden"
                                >
                                    <div className="size-12 rounded-full bg-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-gold/20">
                                        <span className="material-symbols-outlined text-gold text-2xl">{cat.icon}</span>
                                    </div>
                                    <span className="font-serif font-bold text-sm text-gray-200 group-hover:text-gold-light transition-colors">{cat.title}</span>
                                    
                                    {/* Progress Bar */}
                                    <div className="w-full mt-2">
                                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                            <div 
                                                className="bg-gold h-full rounded-full transition-all duration-1000"
                                                style={{ width: `${progress.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </motion.div>
                )}

                {/* Level 2: Topics */}
                {currentCategory && !currentTopic && (
                    <motion.div 
                        key="topics"
                        initial="hidden" animate="show" exit="hidden"
                        variants={containerVariants}
                        className="flex flex-col gap-3"
                    >
                        {currentCategory.topics.map(topic => (
                            <motion.button
                                variants={itemVariants}
                                key={topic.id}
                                onClick={() => setCurrentTopic(topic)}
                                className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-gold/50 transition-all flex items-center gap-4 group text-right"
                            >
                                <div className="size-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                                    <span className="material-symbols-outlined text-gold">{topic.icon}</span>
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="font-serif font-bold text-md text-white group-hover:text-gold-light transition-colors">{topic.title}</span>
                                    <span className="text-[10px] text-gray-400 mt-1">{topic.subTopics.length} فصول</span>
                                </div>
                                <span className="material-symbols-outlined text-gold/50 group-hover:text-gold transition-colors">chevron_left</span>
                            </motion.button>
                        ))}
                    </motion.div>
                )}

                {/* Level 3: SubTopics (Chapters) */}
                {currentTopic && !currentSubTopic && (
                    <motion.div 
                        key="subtopics"
                        initial="hidden" animate="show" exit="hidden"
                        variants={containerVariants}
                        className="flex flex-col gap-3"
                    >
                        {currentTopic.subTopics.map((sub, index) => {
                            const isCompleted = completedTopics.includes(sub.id);
                            return (
                                <motion.button
                                    variants={itemVariants}
                                    key={sub.id}
                                    onClick={() => handleSubTopicSelect(sub)}
                                    className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-gold/50 transition-all flex items-center gap-4 group text-right relative overflow-hidden"
                                >
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${isCompleted ? 'bg-emerald-500' : 'bg-gold/30 group-hover:bg-gold'}`}></div>
                                    <div className={`size-8 rounded-full flex items-center justify-center shrink-0 border ${isCompleted ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-black/30 border-white/5'}`}>
                                        <span className={`text-xs font-bold ${isCompleted ? 'text-emerald-400' : 'text-gold-dim'}`}>{index + 1}</span>
                                    </div>
                                    <span className="font-serif font-bold text-sm text-gray-200 flex-1 group-hover:text-gold-light transition-colors">{sub.title}</span>
                                    {isCompleted ? (
                                        <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-gray-500 text-sm">menu_book</span>
                                    )}
                                </motion.button>
                            );
                        })}
                    </motion.div>
                )}

                {/* Level 4: Content Reading View */}
                {currentSubTopic && (
                    <motion.div 
                        key="content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="flex flex-col pb-10"
                    >
                        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gold/20 relative overflow-hidden text-right shadow-[0_0_30px_rgba(212,175,55,0.05)]" dir="rtl">
                            {/* Decorative background Tezhip */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full pointer-events-none blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-tr-full pointer-events-none blur-2xl"></div>
                            
                            {/* Corners */}
                            <div className="absolute top-0 left-0 w-10 h-10 border-t border-l border-gold/30 rounded-tl-2xl m-3 pointer-events-none"></div>
                            <div className="absolute bottom-0 right-0 w-10 h-10 border-b border-r border-gold/30 rounded-br-2xl m-3 pointer-events-none"></div>

                            <div className="relative z-10">
                                {currentSubTopic.blocks.map((block, i) => renderContentBlock(block, i))}
                            </div>
                            
                            {/* Mark as Completed Button */}
                            <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
                                <button
                                    onClick={() => toggleCompleted(currentSubTopic.id)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                                        completedTopics.includes(currentSubTopic.id)
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            : 'bg-gold/20 text-gold-light border border-gold/30 hover:bg-gold/30'
                                    }`}
                                >
                                    <span className="material-symbols-outlined">
                                        {completedTopics.includes(currentSubTopic.id) ? 'task_alt' : 'done'}
                                    </span>
                                    {completedTopics.includes(currentSubTopic.id) ? 'تمت القراءة' : 'تحديد كمقروء'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
};

export default Library;

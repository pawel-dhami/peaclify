'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import {
  Globe,
  Heart,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
  X,
  Clock,
} from 'lucide-react';

interface Post {
  id: string;
  content: string;
  emoji: string;
  likes: number;
  replies: number;
  timeAgo: string;
  color: string;
  liked: boolean;
}

const mockPosts: Post[] = [
  {
    id: '1',
    content:
      '"The storm will pass. It always does." Needed to hear my own words today.',
    emoji: '🌊',
    likes: 47,
    replies: 12,
    timeAgo: '2m ago',
    color: 'from-nebula/20 to-nebula/5',
    liked: false,
  },
  {
    id: '2',
    content:
      'Day 30 of therapy and I finally cried in session. Feels like unlocking a door I forgot existed.',
    emoji: '🔓',
    likes: 128,
    replies: 34,
    timeAgo: '8m ago',
    color: 'from-ember/20 to-ember/5',
    liked: false,
  },
  {
    id: '3',
    content:
      'Small win: I went outside today. Just sat on the porch for 10 minutes. It counts.',
    emoji: '☀️',
    likes: 256,
    replies: 45,
    timeAgo: '15m ago',
    color: 'from-warmth/20 to-warmth/5',
    liked: false,
  },
  {
    id: '4',
    content:
      "Reminder: You don't always need to be productive. Sometimes existing is enough.",
    emoji: '🌙',
    likes: 312,
    replies: 28,
    timeAgo: '22m ago',
    color: 'from-serenity/20 to-serenity/5',
    liked: false,
  },
  {
    id: '5',
    content:
      'Started a gratitude journal today. First entry: grateful for this anonymous space where I can just be.',
    emoji: '📝',
    likes: 89,
    replies: 16,
    timeAgo: '35m ago',
    color: 'from-aura/20 to-aura/5',
    liked: false,
  },
  {
    id: '6',
    content:
      'My anxiety said "what if everything goes wrong?" and I replied "what if everything goes right?" for the first time.',
    emoji: '💪',
    likes: 445,
    replies: 67,
    timeAgo: '1h ago',
    color: 'from-pulse/20 to-pulse/5',
    liked: false,
  },
  {
    id: '7',
    content:
      'Three things I learned this week: 1) It\'s okay to rest 2) Progress isn\'t linear 3) I am not my thoughts.',
    emoji: '📖',
    likes: 201,
    replies: 43,
    timeAgo: '1h ago',
    color: 'from-nebula/20 to-nebula/5',
    liked: false,
  },
  {
    id: '8',
    content:
      "Called my mom today for the first time in months. She cried. I cried. Sometimes healing starts with a phone call.",
    emoji: '📞',
    likes: 567,
    replies: 89,
    timeAgo: '2h ago',
    color: 'from-ember/20 to-ember/5',
    liked: false,
  },
  {
    id: '9',
    content:
      "Meditation felt impossible today. Five minutes of trying IS the practice. Don't let perfection steal your peace.",
    emoji: '🧘',
    likes: 178,
    replies: 22,
    timeAgo: '3h ago',
    color: 'from-aura/20 to-aura/5',
    liked: false,
  },
];

export default function WallPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [showModal, setShowModal] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💜');

  const emojis = ['💜', '🌊', '☀️', '🌙', '🔥', '🌿', '✨', '🫂', '📝', '💪'];

  // Create masonry columns
  const columns = useMemo(() => {
    const cols: Post[][] = [[], [], []];
    posts.forEach((post, i) => {
      cols[i % 3].push(post);
    });
    return cols;
  }, [posts]);

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const handlePost = () => {
    if (!newContent.trim()) return;
    const newPost: Post = {
      id: Date.now().toString(),
      content: newContent.trim(),
      emoji: selectedEmoji,
      likes: 0,
      replies: 0,
      timeAgo: 'just now',
      color: 'from-nebula/20 to-nebula/5',
      liked: false,
    };
    setPosts((prev) => [newPost, ...prev]);
    setNewContent('');
    setSelectedEmoji('💜');
    setShowModal(false);
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between mb-8 flex-col sm:flex-row gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-bold text-white"
            >
              <span className="glow-text">Echo</span> Wall
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 mt-2 flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Anonymous voices finding resonance
            </motion.p>
          </div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="glow-btn flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Share Your Echo
          </motion.button>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="space-y-4">
              {column.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className={`glass-card p-5 relative overflow-hidden group`}
                >
                  {/* Gradient accent */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${post.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  <div className="relative z-10">
                    {/* Emoji + Time */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl">{post.emoji}</span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.timeAgo}
                      </span>
                    </div>

                    {/* Content */}
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-4">
                      {post.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${
                          post.liked
                            ? 'text-red-400'
                            : 'text-slate-500 hover:text-red-400'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`}
                        />
                        {post.likes}
                      </motion.button>
                      <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        {post.replies}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Post Creation Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="glass-strong p-6 w-full max-w-lg relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-semibold text-white mb-1 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-nebula" />
                  Share Your Echo
                </h3>
                <p className="text-sm text-slate-400 mb-6">
                  Your voice matters. Post anonymously.
                </p>

                {/* Emoji Picker */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {emojis.map((em) => (
                    <motion.button
                      key={em}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => setSelectedEmoji(em)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                        selectedEmoji === em
                          ? 'glass border-nebula/40 scale-110'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      {em}
                    </motion.button>
                  ))}
                </div>

                {/* Text Area */}
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="What's on your mind? Your echo might resonate with someone who needs it..."
                  rows={4}
                  className="w-full bg-white/5 text-white placeholder-slate-500 text-sm rounded-xl border border-white/10 p-4 resize-none outline-none focus:border-nebula/40 transition-colors"
                  maxLength={500}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-slate-500">
                    {newContent.length}/500
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handlePost}
                    disabled={!newContent.trim()}
                    className="glow-btn flex items-center gap-2 text-sm disabled:opacity-40"
                  >
                    <Send className="w-4 h-4" /> Post Echo
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}

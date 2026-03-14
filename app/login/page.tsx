'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-browser';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Loader2,
  GraduationCap, Stethoscope, Sparkles, CheckCircle,
} from 'lucide-react';

type AuthMode = 'login' | 'signup';
type UserRole = 'student' | 'psychologist';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id, email: data.user.email, role,
            created_at: new Date().toISOString(),
          });
          setSuccess('Account created! Check your email to verify, then log in.');
          setMode('login');
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles').select('role').eq('id', data.user.id).single();
          const userRole = profile?.role || 'student';
          router.push(`/dashboard/${userRole}`);
          router.refresh();
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-nebula/20 via-slate-900 to-ember/10" />
        <div className="absolute top-20 left-20 w-64 h-64 bg-nebula/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-ember/15 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-nebula to-ember flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-nebula/30">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            Your mind deserves <span className="glow-text">peace.</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Peaclify connects students with support through AI-powered emotional intelligence and real counselor care.
          </p>
          <div className="space-y-3 text-left">
            {[
              '🧠 AI-powered emotional support, 24/7',
              '📊 Mood tracking & wellness analytics',
              '👨‍⚕️ Direct connection to campus psychologists',
              '🔒 100% anonymous & private',
            ].map(item => (
              <div key={item} className="flex items-center gap-3 glass px-4 py-3 rounded-xl">
                <span className="text-sm text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-slate-950/80">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">
              {mode === 'login' ? 'Welcome back 👋' : 'Create your account'}
            </h1>
            <p className="text-slate-400">
              {mode === 'login' ? 'Sign in to your Peaclify portal' : 'Join the Peaclify community'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-1 glass p-1 rounded-xl mb-6">
            {(['login', 'signup'] as AuthMode[]).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize
                  ${mode === m ? 'bg-gradient-to-r from-nebula to-violet-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                {m === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Role Selector — shown on both login and signup */}
          <div className="mb-6">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-3">I am a...</p>
            <div className="grid grid-cols-2 gap-3">
              {/* Student */}
              <button onClick={() => setRole('student')}
                className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2
                  ${role === 'student' ? 'border-nebula bg-nebula/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                  ${role === 'student' ? 'bg-nebula/30' : 'bg-white/5'}`}>
                  <GraduationCap className={`w-5 h-5 ${role === 'student' ? 'text-nebula' : 'text-slate-400'}`} />
                </div>
                <span className={`text-sm font-semibold ${role === 'student' ? 'text-white' : 'text-slate-400'}`}>Student</span>
                {role === 'student' && (
                  <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-nebula" />
                )}
              </button>

              {/* Psychologist */}
              <button onClick={() => setRole('psychologist')}
                className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2
                  ${role === 'psychologist' ? 'border-ember bg-ember/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                  ${role === 'psychologist' ? 'bg-ember/30' : 'bg-white/5'}`}>
                  <Stethoscope className={`w-5 h-5 ${role === 'psychologist' ? 'text-ember' : 'text-slate-400'}`} />
                </div>
                <span className={`text-sm font-semibold ${role === 'psychologist' ? 'text-white' : 'text-slate-400'}`}>Psychologist</span>
                {role === 'psychologist' && (
                  <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-ember" />
                )}
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email address" required
                className="w-full bg-white/5 text-white placeholder-slate-500 text-sm rounded-xl border border-white/10 pl-11 pr-4 py-3.5 outline-none focus:border-nebula/50 focus:ring-1 focus:ring-nebula/20 transition-all" />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type={showPassword ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)} placeholder="Password" required minLength={6}
                className="w-full bg-white/5 text-white placeholder-slate-500 text-sm rounded-xl border border-white/10 pl-11 pr-11 py-3.5 outline-none focus:border-nebula/50 focus:ring-1 focus:ring-nebula/20 transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-3 border border-red-400/20">
                  {error}
                </motion.p>
              )}
              {success && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-sm text-emerald-400 bg-emerald-400/10 rounded-xl px-4 py-3 border border-emerald-400/20">
                  ✅ {success}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm transition-all shadow-lg disabled:opacity-60
                ${role === 'psychologist'
                  ? 'bg-gradient-to-r from-ember to-orange-500 shadow-ember/20 hover:shadow-ember/40'
                  : 'bg-gradient-to-r from-nebula to-violet-500 shadow-nebula/20 hover:shadow-nebula/40'
                }`}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className={`font-semibold hover:underline ${role === 'psychologist' ? 'text-ember' : 'text-nebula'}`}>
              {mode === 'login' ? 'Sign up free' : 'Log in'}
            </button>
          </p>
          <p className="text-center text-[10px] text-slate-600 mt-3">
            🔒 Your data is encrypted and never shared.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

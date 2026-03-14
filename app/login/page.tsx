'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-browser';
import PageTransition from '@/components/PageTransition';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  GraduationCap,
  Stethoscope,
  ArrowRight,
  Loader2,
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
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        // Sign up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          // Upsert profile with role
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              email: data.user.email,
              role,
              created_at: new Date().toISOString(),
            });

          if (profileError) {
            console.error('Profile error:', profileError);
          }

          setSuccess('Account created! Check your email to verify, then log in.');
          setMode('login');
        }
      } else {
        // Sign in
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (data.user) {
          // Fetch role from profiles
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            console.error('Login error fetching profile:', profileError);
          }

          const userRole = profile?.role || 'student';
          console.log('Redirecting to dashboard for role:', userRole);
          router.push(`/dashboard/${userRole}`);
          router.refresh(); // Ensure layout updates
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[85vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-nebula to-ember flex items-center justify-center mx-auto mb-4 relative"
            >
              <Sparkles className="w-8 h-8 text-white" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-nebula to-ember opacity-50 blur-xl" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white">
              {mode === 'login' ? 'Welcome back' : 'Join Peaclify'}
            </h1>
            <p className="text-slate-400 mt-2">
              {mode === 'login'
                ? 'Your safe space is waiting for you'
                : 'Start your wellness journey today'}
            </p>
          </div>

          {/* Auth Card */}
          <div className="glass-strong p-8">
            {/* Mode Toggle */}
            <div className="flex gap-1 glass p-1 rounded-xl mb-6">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  mode === 'login'
                    ? 'bg-nebula/30 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  mode === 'signup'
                    ? 'bg-nebula/30 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Role Selector (signup only) */}
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <p className="text-sm text-slate-400 mb-3">I am a...</p>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setRole('student')}
                      className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                        role === 'student'
                          ? 'glass border-nebula/40 bg-nebula/10'
                          : 'glass border-white/5 hover:border-white/15'
                      }`}
                    >
                      <GraduationCap
                        className={`w-6 h-6 ${
                          role === 'student' ? 'text-nebula' : 'text-slate-400'
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          role === 'student' ? 'text-white' : 'text-slate-400'
                        }`}
                      >
                        Student
                      </span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setRole('psychologist')}
                      className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                        role === 'psychologist'
                          ? 'glass border-ember/40 bg-ember/10'
                          : 'glass border-white/5 hover:border-white/15'
                      }`}
                    >
                      <Stethoscope
                        className={`w-6 h-6 ${
                          role === 'psychologist' ? 'text-ember' : 'text-slate-400'
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          role === 'psychologist' ? 'text-white' : 'text-slate-400'
                        }`}
                      >
                        Psychologist
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="w-full bg-white/5 text-white placeholder-slate-500 text-sm rounded-xl border border-white/10 pl-11 pr-4 py-3.5 outline-none focus:border-nebula/40 transition-colors"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  minLength={6}
                  className="w-full bg-white/5 text-white placeholder-slate-500 text-sm rounded-xl border border-white/10 pl-11 pr-11 py-3.5 outline-none focus:border-nebula/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Error / Success */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-2.5 border border-red-400/20"
                  >
                    {error}
                  </motion.p>
                )}
                {success && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-emerald-400 bg-emerald-400/10 rounded-xl px-4 py-2.5 border border-emerald-400/20"
                  >
                    {success}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full glow-btn flex items-center justify-center gap-2 text-base disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? 'Log In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <p className="text-center text-xs text-slate-500 mt-6">
              {mode === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-nebula hover:underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-nebula hover:underline"
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Privacy note */}
          <p className="text-center text-[10px] text-slate-600 mt-4">
            Your data is encrypted and never shared. We take your privacy seriously.
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
}

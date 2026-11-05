import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Zap,
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { login, setShowLanding } = useApp();
  const [email, setEmail] = useState('admin@mentora.demo');
  const [password, setPassword] = useState('demo123');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      const ok = login(email, password);
      if (!ok) {
        setError('Invalid credentials. Please use demo credentials: admin@mentora.demo / demo123');
      }
      setIsSubmitting(false);
    }, 300);
  };

  const handleUseDemo = () => {
    setEmail('admin@mentora.demo');
    setPassword('demo123');
    login('admin@mentora.demo', 'demo123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202C45]/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-[#EAE2D8] grid grid-cols-1 md:grid-cols-2">
        {/* Left Branding / Knowledge Panel */}
        <div className="bg-gradient-to-br from-[#FFF9F0] to-[#F9E3D9]/60 p-8 md:p-10 text-[#202C45] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#EAE2D8]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#64748B] text-xs font-semibold mb-6 border border-[#EAE2D8] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#F07857]" />
              <span className="font-heading text-[#202C45]">Bloom &amp; Knowledge</span>
            </div>

            <Logo size="md" showSubtitle={true} />

            <div className="mt-8 space-y-4 text-xs text-[#64748B] leading-relaxed">
              <p>
                An intelligent mentorship operations platform engineered for higher education. Operates multi-clause matching algorithms over student requests, schedule tables, and bipartite network graphs.
              </p>
            </div>
          </div>

          <div className="my-6 space-y-3 pt-6 border-t border-[#EAE2D8]">
            <div className="flex items-center gap-3 text-xs text-[#64748B]">
              <div className="w-8 h-8 rounded-xl bg-white border border-[#EAE2D8] flex items-center justify-center text-[#F07857] shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-semibold text-[#202C45]">100-Point Transparent Scoring</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#64748B]">
              <div className="w-8 h-8 rounded-xl bg-white border border-[#EAE2D8] flex items-center justify-center text-[#5478D4] shadow-2xs">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-semibold text-[#202C45]">Faculty Workload Protection</span>
            </div>
          </div>

          <div className="text-[11px] text-[#64748B] flex items-center justify-between font-mono">
            <span>Enterprise Mentorship v2.4</span>
            <span className="text-[#63AFA3] font-bold">READY</span>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="p-8 md:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono uppercase tracking-wider text-[#F07857] font-bold">
                SIGN IN
              </span>
              <button
                type="button"
                onClick={() => setShowLanding(true)}
                className="text-xs text-[#64748B] hover:text-[#202C45] transition font-semibold"
              >
                &larr; Return to Overview
              </button>
            </div>

            <h2 className="font-heading text-2xl font-extrabold text-[#202C45] tracking-tight">
              Access Workspace
            </h2>
            <p className="text-xs text-[#64748B] mt-1 mb-6">
              Enter demonstration coordinator credentials to manage allocations.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-[#F07857]/10 border border-[#F07857]/30 text-xs text-[#F07857] font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#202C45] mb-1.5 font-heading text-xs">
                  COORDINATOR EMAIL
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFF9F0] border border-[#EAE2D8] rounded-xl text-[#202C45] focus:outline-none focus:border-[#5478D4] focus:ring-1 focus:ring-[#5478D4] text-xs transition"
                    placeholder="admin@mentora.demo"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-[#202C45] font-heading text-xs">
                    PASSWORD
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="text-[11px] text-[#5478D4] hover:underline font-semibold"
                  >
                    {showPass ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FFF9F0] border border-[#EAE2D8] rounded-xl text-[#202C45] focus:outline-none focus:border-[#5478D4] focus:ring-1 focus:ring-[#5478D4] text-xs transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Verified demo credentials card */}
              <div className="p-3 rounded-xl bg-[#FFF9F0] border border-[#EAE2D8] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#63AFA3] shrink-0 mt-0.5" />
                <div className="text-[11px] text-[#64748B]">
                  <span className="font-bold text-[#202C45] block">Preloaded Demo Access:</span>
                  <span>Email: <code className="text-[#5478D4] font-semibold">admin@mentora.demo</code> &middot; Pass: <code className="text-[#5478D4] font-semibold">demo123</code></span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#F07857] hover:bg-[#DE6240] text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 active:scale-98"
              >
                {isSubmitting ? 'Authenticating...' : 'Sign In to Workspace'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-[#EAE2D8] flex items-center justify-between">
            <button
              type="button"
              onClick={handleUseDemo}
              className="text-xs text-[#5478D4] font-bold hover:underline flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 fill-[#5478D4]" />
              <span>Instant 1-Click Access &rarr;</span>
            </button>
            <span className="text-[11px] font-mono text-[#64748B]">Demo Mode Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

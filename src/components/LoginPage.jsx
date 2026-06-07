import React, { useState } from 'react';
import { User, Lock, Mail, Loader2, Sparkles, LogIn, UserPlus, ArrowRight } from 'lucide-react';
import request from '../utils/request';

const LoginPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { username, password } : { username, password, email };
      
      const responseData = await request.post(url, payload);
      const { access_token, user: userData } = responseData;
      
      if (access_token) {
        onLoginSuccess(access_token, userData);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.response?.data?.message || err.message || '操作失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col md:flex-row bg-white overflow-hidden font-academic">
      {/* 左侧装饰区 - 极简品牌展示 */}
      <div className="hidden md:flex md:w-1/2 bg-black relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-zinc-800 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-zinc-700 blur-[150px]" />
        </div>
        
        <div className="relative z-10 max-w-md text-center md:text-left">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="text-amber-400" size={20} />
            <span className="text-white font-black text-sm tracking-tight">Lumi 简历管理平台</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            用 AI 重新定义<br />
            <span className="text-zinc-500">简历创作。</span>
          </h1>
          
          <p className="text-zinc-400 text-lg font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
            极简设计、云端同步、AI 增强。让您的职业履历在每一页都闪耀专业的光芒。
          </p>
          
          <div className="flex items-center gap-8 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-300">
            <div className="flex flex-col">
              <span className="text-white text-2xl font-black">100%</span>
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">隐私保护</span>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="flex flex-col">
              <span className="text-white text-2xl font-black">云端</span>
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">多端同步</span>
            </div>
          </div>
        </div>

        {/* 底部版权 */}
        <div className="absolute bottom-12 left-12 text-zinc-600 text-xs font-bold tracking-widest uppercase animate-in fade-in duration-1000 delay-500">
          © 2026 Lumi Studio. All rights reserved.
        </div>
      </div>

      {/* 右侧登录表单区 */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-16 lg:p-24 bg-white relative">
        {/* 移动端 Logo */}
        <div className="md:hidden absolute top-8 left-8 flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Sparkles className="text-white" size={16} />
          </div>
          <span className="font-black text-lg tracking-tight">Lumi</span>
        </div>

        <div className="max-w-sm mx-auto w-full animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-zinc-900 mb-3 tracking-tight">
              {isLogin ? '欢迎回来' : '创建新账号'}
            </h2>
            <p className="text-zinc-500 font-medium leading-relaxed">
              {isLogin ? '请登录您的账号以继续管理简历。' : '加入 Lumi，开启您的职业进阶之旅。'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-3 animate-in shake duration-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">用户名</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-black focus:bg-white transition-all font-medium text-sm"
                  placeholder="请输入用户名"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">邮箱地址</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-black focus:bg-white transition-all font-medium text-sm"
                    placeholder="请输入邮箱"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">访问密码</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-black focus:bg-white transition-all font-medium text-sm"
                  placeholder="请输入密码"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black hover:bg-zinc-800 text-white rounded-2xl font-black transition-all active:scale-95 shadow-xl shadow-zinc-200 flex items-center justify-center gap-2 mt-8"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isLogin ? '立即登录' : '注册账号'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-zinc-100 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm font-bold text-zinc-500 hover:text-black transition-all inline-flex items-center gap-2"
            >
              {isLogin ? (
                <>
                  <UserPlus size={16} /> 还没有账号？立即注册
                </>
              ) : (
                <>
                  <LogIn size={16} /> 已有账号？直接登录
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

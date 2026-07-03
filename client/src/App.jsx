import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Star, ExternalLink, ShieldCheck, Search, Sun, Moon, X, User, LogOut, LayoutGrid, CheckCircle, Globe, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedApp, setSelectedApp] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem('user')));

  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [authError, setAuthError] = useState("");

  const GITHUB_URL = "https://raw.githubusercontent.com/My-Store-Group/My-Store/main/apps.json";

  let baseApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  if (!baseApiUrl.endsWith('/api')) {
    baseApiUrl = baseApiUrl.endsWith('/') ? `${baseApiUrl}api` : `${baseApiUrl}/api`;
  }
  const API_URL = baseApiUrl;

  useEffect(() => {
    fetchApps();
    if (darkMode) document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const fetchApps = async () => {
    try {
      const response = await axios.get(GITHUB_URL);
      setApps(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError("");
    const endpoint = isLogin ? "/auth/login" : "/auth/register";
    try {
      const res = await axios.post(`${API_URL}${endpoint}`, formData);
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUserData(res.data.user);
        setShowAuthModal(false);
      } else {
        setIsLogin(true);
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserData(null);
  };

  const categories = ["All", ...new Set(apps.map(app => app.category))];

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) ||
                         app.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || app.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className={`rounded-3xl p-6 border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-gray-50 border-gray-100'} animate-pulse`}>
      <div className="flex gap-5">
        <div className="w-20 h-20 bg-gray-300 dark:bg-zinc-800 rounded-2xl"></div>
        <div className="flex-1 space-y-3 mt-2">
          <div className="h-4 bg-gray-300 dark:bg-zinc-800 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 dark:bg-zinc-800 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-6 space-y-2">
        <div className="h-3 bg-gray-300 dark:bg-zinc-800 rounded w-full"></div>
        <div className="h-3 bg-gray-300 dark:bg-zinc-800 rounded w-5/6"></div>
      </div>
      <div className="mt-8 h-12 bg-gray-300 dark:bg-zinc-800 rounded-2xl"></div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-500 selection:bg-indigo-500 selection:text-white ${darkMode ? 'bg-[#09090b] text-zinc-100' : 'bg-[#fafafa] text-zinc-900'}`}>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAuthModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className={`relative w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl ${darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black tracking-tight">{isLogin ? "Welcome" : "Join Us"}</h2>
                <button onClick={() => setShowAuthModal(false)} className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleAuth} className="space-y-5">
                {!isLogin && (
                  <div>
                    <label className="text-sm font-bold ml-1 mb-2 block opacity-70">Username</label>
                    <input type="text" required className={`w-full px-5 py-4 rounded-2xl outline-none border-2 focus:border-indigo-500 transition-all ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-100'}`} onChange={(e) => setFormData({...formData, username: e.target.value})}/>
                  </div>
                )}
                <div>
                  <label className="text-sm font-bold ml-1 mb-2 block opacity-70">Email Address</label>
                  <input type="email" required className={`w-full px-5 py-4 rounded-2xl outline-none border-2 focus:border-indigo-500 transition-all ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-100'}`} onChange={(e) => setFormData({...formData, email: e.target.value})}/>
                </div>
                <div>
                  <label className="text-sm font-bold ml-1 mb-2 block opacity-70">Password</label>
                  <input type="password" required className={`w-full px-5 py-4 rounded-2xl outline-none border-2 focus:border-indigo-500 transition-all ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-100'}`} onChange={(e) => setFormData({...formData, password: e.target.value})}/>
                </div>
                {authError && <p className="text-red-500 text-sm font-bold text-center">{authError}</p>}
                <button className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-500/30">{isLogin ? "Sign In" : "Create Account"}</button>
              </form>
              <p className="mt-8 text-center text-sm font-bold opacity-60">
                {isLogin ? "New to My Store?" : "Already a member?"} <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 hover:underline">{isLogin ? "Sign Up" : "Log In"}</button>
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* App Detail Sidebar */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[150] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApp(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className={`relative w-full max-w-2xl h-full overflow-y-auto shadow-2xl p-8 md:p-12 ${darkMode ? 'bg-zinc-900' : 'bg-white'}`}>
              <button onClick={() => setSelectedApp(null)} className="absolute top-8 right-8 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"><X className="w-8 h-8" /></button>

              <div className="flex flex-col md:flex-row gap-8 items-start mt-8">
                <img src={selectedApp.iconUrl} className="w-32 h-32 rounded-[2rem] shadow-2xl object-cover" />
                <div className="space-y-2">
                  <h2 className="text-4xl font-black leading-none">{selectedApp.name}</h2>
                  <p className="text-xl font-bold text-indigo-500">{selectedApp.owner}</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-500 rounded-full text-sm font-black uppercase tracking-widest">{selectedApp.category}</span>
                    <span className="px-4 py-1.5 bg-green-500/10 text-green-500 rounded-full text-sm font-black flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Verified</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-12 py-8 border-y border-zinc-100 dark:border-zinc-800 text-center">
                <div><p className="text-2xl font-black">{selectedApp.stars}</p><p className="text-xs font-bold opacity-40 uppercase">Stars</p></div>
                <div><p className="text-2xl font-black">{selectedApp.fileSize}</p><p className="text-xs font-bold opacity-40 uppercase">Size</p></div>
                <div><p className="text-2xl font-black">{selectedApp.version}</p><p className="text-xs font-bold opacity-40 uppercase">Version</p></div>
              </div>

              <div className="mt-12 space-y-6">
                <h3 className="text-2xl font-black">About the App</h3>
                <p className="text-lg leading-relaxed opacity-70">{selectedApp.description}</p>
              </div>

              <div className="mt-12 space-y-6">
                <h3 className="text-2xl font-black">Screenshots</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {selectedApp.screenshots.map((url, i) => (
                    <img key={i} src={url} className="h-[400px] rounded-[2rem] shadow-lg flex-shrink-0" />
                  ))}
                </div>
              </div>

              <div className="sticky bottom-0 left-0 right-0 pt-8 pb-4 bg-inherit border-t border-zinc-100 dark:border-zinc-800 flex gap-4">
                <a href={selectedApp.downloadUrl} className="flex-1 bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-xl text-center shadow-xl shadow-indigo-500/30 hover:scale-[1.02] transition-transform flex items-center justify-center gap-3">
                  <Download /> Download Now
                </a>
                <a href={selectedApp.repoUrl} target="_blank" className={`p-5 rounded-[1.5rem] border-2 transition-colors ${darkMode ? 'border-zinc-800 hover:bg-zinc-800' : 'border-zinc-100 hover:bg-zinc-50'}`}><Github className="w-7 h-7" /></a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[80] px-6 py-4 transition-all duration-300 ${darkMode ? 'bg-zinc-950/80' : 'bg-white/80'} backdrop-blur-2xl border-b ${darkMode ? 'border-zinc-900' : 'border-zinc-100'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-4 cursor-pointer">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/30">
              <LayoutGrid className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter hidden md:block italic">MY STORE</h1>
          </motion.div>

          <div className="flex-1 max-w-xl relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
            <input type="text" placeholder="Explore awesome apps..." className={`w-full h-14 pl-14 pr-6 rounded-2xl outline-none font-bold transition-all border-2 ${darkMode ? 'bg-zinc-900 border-zinc-900 focus:border-indigo-500/50' : 'bg-zinc-100 border-zinc-100 focus:border-indigo-500/50'}`} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 ${darkMode ? 'bg-zinc-900 text-yellow-400' : 'bg-zinc-100 text-zinc-500'}`}>
              {darkMode ? <Sun /> : <Moon />}
            </button>

            {userData ? (
              <div className="flex items-center gap-2 group cursor-pointer relative">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/20">{userData.username[0].toUpperCase()}</div>
                <div className="absolute top-14 right-0 hidden group-hover:block w-40 p-2 rounded-2xl shadow-2xl border bg-inherit dark:border-zinc-800">
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 text-red-500 rounded-xl font-bold transition-colors"><LogOut className="w-4 h-4"/> Log Out</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-indigo-600 text-white px-8 h-12 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-600/20">Login</button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-600/10 blur-[120px] rounded-full -z-10 animate-pulse" />
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block px-5 py-2 rounded-full bg-indigo-600/10 text-indigo-500 text-sm font-black tracking-widest uppercase">Verified Android Hub</motion.div>
          <motion.h2 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] italic">THE APPS YOU <br/> ACTUALLY NEED.</motion.h2>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl md:text-2xl font-bold opacity-40 max-w-2xl mx-auto leading-relaxed">Secure, fast, and open-source. Discover the best tools handpicked for your mobile experience.</motion.p>
        </div>
      </section>

      {/* Categories & Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-40">

        {/* Category Chips */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-10 sticky top-[88px] z-[70] bg-inherit py-4">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-3 rounded-2xl font-black text-sm transition-all flex-shrink-0 ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 scale-105' : 'bg-zinc-500/10 opacity-50 hover:opacity-100 hover:bg-zinc-500/20'}`}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredApps.map((app, index) => (
                <motion.div key={index} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} onClick={() => setSelectedApp(app)} className={`group relative rounded-[2.5rem] p-8 border-2 transition-all duration-500 cursor-pointer ${darkMode ? 'bg-zinc-900/50 border-zinc-900 hover:border-indigo-500/50 hover:bg-zinc-900' : 'bg-white border-zinc-100 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10'}`}>
                  <div className="flex gap-6">
                    <img src={app.iconUrl} alt={app.name} className="w-24 h-24 rounded-[1.8rem] shadow-xl object-cover transition-transform group-hover:scale-110 duration-500" />
                    <div className="flex-1 pt-2">
                      <h3 className="text-2xl font-black tracking-tight leading-none mb-2 line-clamp-1">{app.name}</h3>
                      <p className="text-indigo-500 font-black text-sm uppercase tracking-widest opacity-80">{app.owner}</p>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-black text-xl">
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      {app.stars}
                    </div>
                    <div className="px-4 py-1.5 rounded-xl bg-zinc-500/10 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">
                      {app.category}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="font-bold text-sm opacity-40">{app.fileSize}</span>
                    <button className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                      <Download className="w-6 h-6" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className={`py-20 px-6 border-t ${darkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-50 border-zinc-100'}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
          <div className="space-y-6">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><LayoutGrid/></div>
              <h2 className="text-xl font-black italic tracking-tighter uppercase">My Store</h2>
            </div>
            <p className="font-bold opacity-40 leading-relaxed">Providing the best handpicked applications for the modern mobile user. Secure, verified, and forever free.</p>
          </div>
          <div><h4 className="font-black mb-6 uppercase tracking-widest text-xs opacity-40">Resources</h4><ul className="space-y-4 font-bold text-sm"><li><a href="#" className="hover:text-indigo-600 transition">Dev APIs</a></li><li><a href="#" className="hover:text-indigo-600 transition">Docs</a></li><li><a href="#" className="hover:text-indigo-600 transition">Community</a></li></ul></div>
          <div><h4 className="font-black mb-6 uppercase tracking-widest text-xs opacity-40">Legal</h4><ul className="space-y-4 font-bold text-sm"><li><a href="#" className="hover:text-indigo-600 transition">Privacy</a></li><li><a href="#" className="hover:text-indigo-600 transition">Terms</a></li><li><a href="#" className="hover:text-indigo-600 transition">Cookies</a></li></ul></div>
          <div><h4 className="font-black mb-6 uppercase tracking-widest text-xs opacity-40">Connect</h4><div className="flex gap-4 justify-center md:justify-start"><a href="#" className="w-10 h-10 rounded-xl border-2 flex items-center justify-center opacity-40 hover:opacity-100 hover:border-indigo-600 transition-all"><Globe className="w-5 h-5"/></a><a href="#" className="w-10 h-10 rounded-xl border-2 flex items-center justify-center opacity-40 hover:opacity-100 hover:border-indigo-600 transition-all"><Github className="w-5 h-5"/></a></div></div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-zinc-100 dark:border-zinc-900 text-center font-bold text-xs opacity-40 uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} My Store • Crafted with precision
        </div>
      </footer>
    </div>
  );
};

export default App;

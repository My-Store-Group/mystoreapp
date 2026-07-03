import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useParams, Link, useNavigate } from 'react-router-dom';
import { Download, Star, ExternalLink, ShieldCheck, Search, Sun, Moon, X, User, LogOut, LayoutGrid, CheckCircle, Globe, Github, Share2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Constants ---
const GITHUB_URL = "https://raw.githubusercontent.com/My-Store-Group/My-Store/main/apps.json";

// --- Helper: Generate Unique Slug ---
const getAppSlug = (app) => {
  const pName = app.packageName || app.name.toLowerCase().replace(/ /g, '.');
  const suffix = app.category.toLowerCase().includes('game') ? '.game' : '.app';
  return `${pName}${suffix}`;
};

// --- Navbar Component ---
const Navbar = ({ darkMode, setDarkMode, search, setSearch, userData, handleLogout, setShowAuthModal }) => (
  <nav className={`fixed top-0 left-0 right-0 z-[80] px-6 py-4 transition-all duration-300 ${darkMode ? 'bg-zinc-950/80' : 'bg-white/80'} backdrop-blur-2xl border-b ${darkMode ? 'border-zinc-900' : 'border-zinc-100'}`}>
    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <Link to="/" className="flex items-center gap-4 cursor-pointer">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/30">
          <LayoutGrid className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black tracking-tighter hidden md:block italic uppercase">MY STORE</h1>
      </Link>

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
);

// --- Home Component ---
const Home = ({ apps, loading, search, activeCategory, setActiveCategory, darkMode }) => {
  const categories = ["All", ...new Set(apps.map(app => app.category))];
  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) || app.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || app.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <header className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-600/10 blur-[120px] rounded-full -z-10 animate-pulse" />
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block px-5 py-2 rounded-full bg-indigo-600/10 text-indigo-500 text-sm font-black tracking-widest uppercase">Verified Android Hub</motion.div>
          <motion.h2 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] italic">THE APPS YOU <br/> ACTUALLY NEED.</motion.h2>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-40">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-10 sticky top-[88px] z-[70] bg-inherit py-4">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-3 rounded-2xl font-black text-sm transition-all flex-shrink-0 ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 scale-105' : 'bg-zinc-500/10 opacity-50 hover:opacity-100 hover:bg-zinc-500/20'}`}>{cat}</button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-64 rounded-[2.5rem] bg-zinc-500/10 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredApps.map((app, index) => (
              <Link to={`/details/${getAppSlug(app)}`} key={index}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className={`group relative rounded-[2.5rem] p-8 border-2 transition-all duration-500 cursor-pointer ${darkMode ? 'bg-zinc-900/50 border-zinc-900 hover:border-indigo-500/50 hover:bg-zinc-900' : 'bg-white border-zinc-100 hover:border-indigo-500/30 hover:shadow-2xl'}`}>
                  <div className="flex gap-6">
                    <img src={app.iconUrl} alt={app.name} className="w-24 h-24 rounded-[1.8rem] shadow-xl object-cover transition-transform group-hover:scale-110 duration-500" />
                    <div className="flex-1 pt-2">
                      <h3 className="text-2xl font-black tracking-tight leading-none mb-2 line-clamp-1">{app.name}</h3>
                      <p className="text-indigo-500 font-black text-sm uppercase tracking-widest opacity-80">{app.owner}</p>
                    </div>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-black text-xl"><Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />{app.stars}</div>
                    <div className="px-4 py-1.5 rounded-xl bg-zinc-500/10 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{app.category}</div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

// --- Details Component ---
const Details = ({ apps, darkMode, API_URL }) => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const app = apps.find(a => getAppSlug(a) === appId);

  if (!app) return <div className="pt-40 text-center font-black text-4xl">App Not Found!</div>;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-40 px-6 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-black opacity-40 hover:opacity-100 transition-opacity mb-8 text-lg"><ArrowLeft /> Back to Store</button>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        <motion.img initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={app.iconUrl} className="w-48 h-48 rounded-[3rem] shadow-2xl object-cover" />
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <h2 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter">{app.name}</h2>
            <p className="text-2xl font-black text-indigo-500">{app.owner}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <span className="px-6 py-2 bg-indigo-500/10 text-indigo-500 rounded-full text-sm font-black uppercase tracking-widest">{app.category}</span>
            <span className="px-6 py-2 bg-green-500/10 text-green-500 rounded-full text-sm font-black flex items-center gap-2"><CheckCircle className="w-5 h-5"/> Verified Security</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 py-10 border-y border-zinc-100 dark:border-zinc-800 text-center">
        <div><p className="text-3xl font-black">{app.stars}</p><p className="text-xs font-bold opacity-40 uppercase tracking-widest">Stars</p></div>
        <div><p className="text-3xl font-black">{app.fileSize}</p><p className="text-xs font-bold opacity-40 uppercase tracking-widest">File Size</p></div>
        <div><p className="text-3xl font-black">{app.version}</p><p className="text-xs font-bold opacity-40 uppercase tracking-widest">Version</p></div>
        <div><p className="text-3xl font-black">1M+</p><p className="text-xs font-bold opacity-40 uppercase tracking-widest">Downloads</p></div>
      </div>

      <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-6">
            <h3 className="text-3xl font-black italic underline decoration-indigo-500 underline-offset-8">Description</h3>
            <p className="text-xl leading-relaxed opacity-70">{app.description}</p>
          </div>
          <div className="space-y-6">
            <h3 className="text-3xl font-black italic underline decoration-indigo-500 underline-offset-8">Screenshots</h3>
            <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
              {app.screenshots.map((url, i) => (
                <motion.img whileHover={{ scale: 1.02 }} key={i} src={url} className="h-[500px] rounded-[2.5rem] shadow-2xl flex-shrink-0 cursor-zoom-in" />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className={`p-8 rounded-[2.5rem] border-2 sticky top-32 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-50 shadow-xl shadow-zinc-100'}`}>
            <h4 className="text-xl font-black mb-6">Action Center</h4>
            <div className="space-y-4">
              <a href={app.downloadUrl} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/30 hover:scale-[1.03] active:scale-[0.98] transition-all"><Download /> Get APK</a>
              <button onClick={handleShare} className={`w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 border-2 transition-all ${darkMode ? 'border-zinc-800 hover:bg-zinc-800' : 'border-zinc-100 hover:bg-zinc-50'}`}><Share2 /> Share App</button>
            </div>
            <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
              <div className="flex items-center gap-3 text-sm font-bold opacity-60"><Globe className="w-5 h-5"/> Official Website</div>
              <div className="flex items-center gap-3 text-sm font-bold opacity-60"><ShieldCheck className="w-5 h-5 text-green-500"/> Privacy Guaranteed</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App Component ---
const App = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [authError, setAuthError] = useState("");

  let baseApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  if (!baseApiUrl.endsWith('/api')) {
    baseApiUrl = baseApiUrl.endsWith('/') ? `${baseApiUrl}api` : `${baseApiUrl}/api`;
  }
  const API_URL = baseApiUrl;

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await axios.get(GITHUB_URL);
        setApps(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };
    fetchApps();
    if (darkMode) document.documentElement.classList.add('dark');
  }, []);

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

  return (
    <Router>
      <div className={`min-h-screen transition-all duration-500 selection:bg-indigo-500 selection:text-white ${darkMode ? 'bg-[#09090b] text-zinc-100' : 'bg-[#fafafa] text-zinc-900'}`}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} search={search} setSearch={setSearch} userData={userData} handleLogout={() => setUserData(null)} setShowAuthModal={setShowAuthModal} />

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

        <Routes>
          <Route path="/" element={<Home apps={apps} loading={loading} search={search} activeCategory={activeCategory} setActiveCategory={setActiveCategory} darkMode={darkMode} />} />
          <Route path="/details/:appId" element={<Details apps={apps} darkMode={darkMode} API_URL={API_URL} />} />
        </Routes>

        <footer className={`py-20 px-6 border-t ${darkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-50 border-zinc-100'}`}>
          <div className="max-w-7xl mx-auto mt-10 text-center font-bold text-xs opacity-40 uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} My Store • Crafted with precision
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;

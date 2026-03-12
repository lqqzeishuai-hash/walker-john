import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Wrench, 
  MessageSquare, 
  ShoppingBag, 
  User as UserIcon, 
  Bell, 
  ChevronRight, 
  Plus,
  LogOut,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Notice, Repair, Post } from './types';

// --- Components ---

const BottomNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', icon: Home, label: '首页' },
    { id: 'service', icon: Wrench, label: '服务' },
    { id: 'community', icon: MessageSquare, label: '社区' },
    { id: 'mall', icon: ShoppingBag, label: '商城' },
    { id: 'profile', icon: UserIcon, label: '我的' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center h-16 pb-safe z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
            activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          <tab.icon size={20} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
          <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

const Header = ({ title, rightElement }: { title: string, rightElement?: React.ReactNode }) => (
  <header className="sticky top-0 bg-white/80 backdrop-blur-md z-40 px-4 h-14 flex items-center justify-between border-b border-gray-50">
    <h1 className="text-lg font-bold text-gray-900">{title}</h1>
    {rightElement}
  </header>
);

// --- Pages ---

const HomePage = () => {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    fetch('/api/notices')
      .then(res => res.json())
      .then(data => setNotices(data));
  }, []);

  return (
    <div className="pb-20">
      <Header title="智慧社区" rightElement={<Bell size={20} className="text-gray-600" />} />
      
      {/* Banner */}
      <div className="px-4 mt-4">
        <div className="w-full h-40 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold">欢迎回家</h2>
            <p className="text-blue-100 text-sm mt-1">智慧社区，让生活更美好</p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4 px-4 mt-6">
        {[
          { icon: '🔑', label: '智能门禁' },
          { icon: '🚗', label: '停车查询' },
          { icon: '💧', label: '水电缴费' },
          { icon: '📦', label: '快递代收' },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl mb-1 shadow-sm">
              {item.icon}
            </div>
            <span className="text-xs text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Notices */}
      <div className="mt-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">社区公告</h3>
          <button className="text-xs text-blue-600 flex items-center">更多 <ChevronRight size={14} /></button>
        </div>
        <div className="space-y-3">
          {notices.map(notice => (
            <div key={notice.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">
                  {notice.type}
                </span>
                <h4 className="font-bold text-sm text-gray-800 truncate">{notice.title}</h4>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{notice.content}</p>
              <div className="mt-2 text-[10px] text-gray-400">
                {new Date(notice.create_time).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ServicePage = ({ user }: { user: User }) => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState('');

  const fetchRepairs = () => {
    fetch(`/api/repairs?userId=${user.id}`)
      .then(res => res.json())
      .then(data => setRepairs(data));
  };

  useEffect(() => {
    fetchRepairs();
  }, [user.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    
    await fetch('/api/repairs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, description }),
    });
    
    setDescription('');
    setShowForm(false);
    fetchRepairs();
  };

  return (
    <div className="pb-20">
      <Header title="物业服务" />
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg shadow-blue-100"
          >
            <Wrench size={24} />
            <span className="font-bold">在线报修</span>
          </button>
          <button className="bg-white border border-gray-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-sm">
            <MessageSquare size={24} className="text-orange-500" />
            <span className="font-bold text-gray-800">投诉建议</span>
          </button>
        </div>

        <h3 className="font-bold text-gray-900 mb-4">报修记录</h3>
        <div className="space-y-3">
          {repairs.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">暂无记录</div>
          ) : (
            repairs.map(repair => (
              <div key={repair.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-800 font-medium mb-1">{repair.description}</p>
                  <p className="text-[10px] text-gray-400">{new Date(repair.create_time).toLocaleString()}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                  repair.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                  repair.status === 'processing' ? 'bg-blue-50 text-blue-600' :
                  'bg-green-50 text-green-600'
                }`}>
                  {repair.status === 'pending' ? '待处理' : repair.status === 'processing' ? '处理中' : '已完成'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={() => setShowForm(false)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-t-3xl p-6 pb-10"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
              <h3 className="text-xl font-bold mb-4">提交报修</h3>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="请描述您遇到的问题..."
                  className="w-full h-32 bg-gray-50 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
                />
                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100"
                >
                  确认提交
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CommunityPage = ({ user }: { user: User }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');

  const fetchPosts = () => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, content }),
    });

    setContent('');
    fetchPosts();
  };

  return (
    <div className="pb-20">
      <Header title="邻里互动" />
      
      {/* Post Input */}
      <div className="p-4 bg-white border-b border-gray-50">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold shrink-0">
            {user.username[0]}
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="分享新鲜事..."
              className="w-full bg-gray-50 rounded-full px-4 py-2.5 text-sm focus:outline-none"
            />
            <button type="submit" className="absolute right-2 top-1.5 text-blue-600">
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* Feed */}
      <div className="space-y-4 p-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-2xl p-4 border border-gray-50 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
                {post.username[0]}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{post.username}</h4>
                <p className="text-[10px] text-gray-400">{new Date(post.create_time).toLocaleString()}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>
            <div className="mt-4 flex items-center gap-6">
              <button className="flex items-center gap-1 text-gray-400 text-xs">
                <MessageSquare size={16} /> 评论
              </button>
              <button className="flex items-center gap-1 text-gray-400 text-xs">
                ❤️ 点赞
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MallPage = () => {
  const items = [
    { name: '家政保洁', price: '¥199', icon: '🧹', color: 'bg-yellow-50' },
    { name: '管道疏通', price: '¥80', icon: '🚿', color: 'bg-blue-50' },
    { name: '家电维修', price: '¥120', icon: '📺', color: 'bg-red-50' },
    { name: '社区团购', price: '热卖中', icon: '🍎', color: 'bg-green-50' },
  ];

  return (
    <div className="pb-20">
      <Header title="社区商城" />
      <div className="p-4 grid grid-cols-2 gap-4">
        {items.map((item, i) => (
          <div key={i} className={`${item.color} p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm border border-white/50`}>
            <span className="text-3xl mb-2">{item.icon}</span>
            <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
            <p className="text-xs text-blue-600 font-medium mt-1">{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfilePage = ({ user, onLogout }: { user: User, onLogout: () => void }) => {
  return (
    <div className="pb-20">
      <div className="bg-gradient-to-b from-blue-600 to-blue-500 pt-16 pb-10 px-6 rounded-b-[3rem] text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-bold border border-white/30">
            {user.username[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p className="text-blue-100 text-sm">{user.phone}</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6">
        <div className="bg-white rounded-3xl p-2 shadow-xl shadow-gray-100 border border-gray-50">
          {[
            { icon: Wrench, label: '我的报修', color: 'text-blue-500' },
            { icon: MessageSquare, label: '我的发布', color: 'text-green-500' },
            { icon: ShoppingBag, label: '我的订单', color: 'text-orange-500' },
            { icon: Bell, label: '消息通知', color: 'text-purple-500' },
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors">
              <div className="flex items-center gap-3">
                <item.icon size={20} className={item.color} />
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          ))}
        </div>

        <button 
          onClick={onLogout}
          className="w-full mt-6 flex items-center justify-center gap-2 p-4 text-red-500 font-bold bg-red-50 rounded-2xl"
        >
          <LogOut size={20} />
          退出登录
        </button>
      </div>
    </div>
  );
};

const AuthPage = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const endpoint = isLogin ? '/api/login' : '/api/register';
    const body = isLogin ? { username, password } : { username, password, phone };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      
      if (data.success) {
        if (isLogin) {
          onLogin(data.user);
        } else {
          setIsLogin(true);
          alert('注册成功，请登录');
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('网络错误，请稍后再试');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-blue-100 mb-4">
            <Home size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">智慧社区服务平台</h1>
          <p className="text-gray-500 mt-2">Smart Community App</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-50">
          <div className="flex gap-4 mb-8 border-b border-gray-100 pb-2">
            <button 
              onClick={() => setIsLogin(true)}
              className={`pb-2 px-2 font-bold transition-all ${isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
            >
              登录
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`pb-2 px-2 font-bold transition-all ${!isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
            >
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">用户名</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">手机号</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">密码</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 mt-4"
            >
              {isLogin ? '立即登录' : '立即注册'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home');

  // Check for saved user in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('community_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('community_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('community_user');
  };

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans max-w-md mx-auto relative shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'home' && <HomePage />}
          {activeTab === 'service' && <ServicePage user={user} />}
          {activeTab === 'community' && <CommunityPage user={user} />}
          {activeTab === 'mall' && <MallPage />}
          {activeTab === 'profile' && <ProfilePage user={user} onLogout={handleLogout} />}
        </motion.div>
      </AnimatePresence>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

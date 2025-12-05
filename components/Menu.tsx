
import React from 'react';
import { AppView, User } from '../types';
import { 
  Home, ShoppingBag, MessageSquare, ClipboardList, BookOpen, 
  Phone, Users, LogIn, LogOut, ShieldCheck, Grid, Calculator 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface MenuProps {
  onNavigate: (view: AppView) => void;
  user: User | null;
  onLogout: () => void;
}

export const Menu: React.FC<MenuProps> = ({ onNavigate, user, onLogout }) => {
  const { t } = useLanguage();

  const menuItems = [
    { 
      title: 'Home / मुख्यपृष्ठ', 
      view: AppView.HOME, 
      icon: <Home size={28} />, 
      color: 'bg-green-100 text-[#2E7D32]' 
    },
    { 
      title: 'Products / उत्पादने', 
      view: AppView.PRODUCTS, 
      icon: <ShoppingBag size={28} />, 
      color: 'bg-blue-100 text-blue-700' 
    },
    { 
      title: 'Agri Calculator', 
      view: AppView.CALCULATOR, 
      icon: <Calculator size={28} />, 
      color: 'bg-yellow-100 text-[#FBC02D]' 
    },
    { 
      title: 'AI Mitra / कृषी मित्र', 
      view: AppView.ADVISOR, 
      icon: <MessageSquare size={28} />, 
      color: 'bg-purple-100 text-purple-700' 
    },
    { 
      title: 'Advisory / पीक सल्ला', 
      view: AppView.ADVISORY, 
      icon: <ClipboardList size={28} />, 
      color: 'bg-orange-100 text-orange-700' 
    },
    { 
      title: 'Schemes / योजना', 
      view: AppView.SCHEMES, 
      icon: <BookOpen size={28} />, 
      color: 'bg-teal-100 text-teal-700' 
    },
    { 
      title: 'Contact / संपर्क', 
      view: AppView.CONTACT, 
      icon: <Phone size={28} />, 
      color: 'bg-red-100 text-red-700' 
    }
  ];

  const adminItems = [
    {
      title: 'Visitor Log',
      view: AppView.VISITORS,
      icon: <Users size={28} />,
      color: 'bg-slate-800 text-white'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Grid className="text-[#2E7D32]" />
        All Services (सर्व सेवा)
      </h2>

      {/* Main Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onNavigate(item.view)}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-green-200 transition-all hover:scale-[1.02] active:scale-95 group"
          >
            <div className={`p-4 rounded-full mb-3 ${item.color} group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <span className="font-bold text-slate-700 text-sm text-center">{item.title}</span>
          </button>
        ))}
      </div>

      {/* Owner Section */}
      {user && (
        <div className="mt-10 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ShieldCheck className="text-[#FBC02D]" />
            Owner Controls
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {adminItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate(item.view)}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-95 group"
              >
                <div className={`p-4 rounded-full mb-3 ${item.color}`}>
                  {item.icon}
                </div>
                <span className="font-bold text-slate-700 text-sm">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Account Section */}
      <div className="mt-10">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Account</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {user ? (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-4 p-4 hover:bg-red-50 text-red-600 transition-colors"
            >
              <div className="bg-red-100 p-2 rounded-full"><LogOut size={20} /></div>
              <span className="font-bold">Logout ({user.name})</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate(AppView.LOGIN)}
              className="w-full flex items-center gap-4 p-4 hover:bg-green-50 text-[#2E7D32] transition-colors"
            >
              <div className="bg-green-100 p-2 rounded-full"><LogIn size={20} /></div>
              <span className="font-bold">Owner Login</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

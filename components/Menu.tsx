
import React from 'react';
import { AppView, User } from '../types';
import { 
  Home, ShoppingBag, MessageSquare, ClipboardList, BookOpen, 
  Phone, Users, LogIn, LogOut, ShieldCheck, Grid, Calculator, Info 
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
      title: 'Home\nमुख्यपृष्ठ', 
      view: AppView.HOME, 
      icon: <Home size={32} />, 
      gradient: 'from-green-500 to-green-700',
      shadow: 'shadow-green-200'
    },
    { 
      title: 'Shop\nदुकान', 
      view: AppView.PRODUCTS, 
      icon: <ShoppingBag size={32} />, 
      gradient: 'from-blue-500 to-blue-700',
      shadow: 'shadow-blue-200'
    },
    { 
      title: 'Calculator\nकॅल्क्युलेटर', 
      view: AppView.CALCULATOR, 
      icon: <Calculator size={32} />, 
      gradient: 'from-yellow-400 to-orange-500',
      shadow: 'shadow-yellow-200'
    },
    { 
      title: 'AI Mitra\nकृषी मित्र', 
      view: AppView.ADVISOR, 
      icon: <MessageSquare size={32} />, 
      gradient: 'from-purple-500 to-purple-700',
      shadow: 'shadow-purple-200'
    },
    { 
      title: 'Advisory\nपीक सल्ला', 
      view: AppView.ADVISORY, 
      icon: <ClipboardList size={32} />, 
      gradient: 'from-teal-400 to-teal-600',
      shadow: 'shadow-teal-200'
    },
    { 
      title: 'Schemes\nयोजना', 
      view: AppView.SCHEMES, 
      icon: <BookOpen size={32} />, 
      gradient: 'from-indigo-400 to-indigo-600',
      shadow: 'shadow-indigo-200'
    },
    { 
      title: 'About Us\nआमच्याबद्दल', 
      view: AppView.ABOUT, 
      icon: <Info size={32} />, 
      gradient: 'from-cyan-500 to-cyan-700',
      shadow: 'shadow-cyan-200'
    },
    { 
      title: 'Contact\nसंपर्क', 
      view: AppView.CONTACT, 
      icon: <Phone size={32} />, 
      gradient: 'from-red-400 to-red-600',
      shadow: 'shadow-red-200'
    }
  ];

  const adminItems = [
    {
      title: 'Visitor Log',
      view: AppView.VISITORS,
      icon: <Users size={28} />,
      gradient: 'from-slate-700 to-slate-900',
      shadow: 'shadow-slate-300'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Grid className="text-[#2E7D32]" />
        All Apps (सर्व सेवा)
      </h2>

      {/* Main Grid - Mobile App Style */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-y-8 gap-x-4">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onNavigate(item.view)}
            className="flex flex-col items-center group"
          >
            {/* App Icon Shape */}
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[1.2rem] bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center shadow-lg ${item.shadow} mb-2 transform transition-all group-hover:scale-110 group-active:scale-95 group-active:shadow-inner border border-white/10`}>
              {item.icon}
            </div>
            {/* Label */}
            <span className="text-xs sm:text-sm font-medium text-slate-700 text-center whitespace-pre-line leading-tight">
              {item.title}
            </span>
          </button>
        ))}
      </div>

      {/* Owner Section */}
      {user && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 border-t border-slate-100 pt-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <ShieldCheck className="text-[#FBC02D]" />
            Owner Apps
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-6">
            {adminItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate(item.view)}
                className="flex flex-col items-center group"
              >
                <div className={`w-16 h-16 rounded-[1.2rem] bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center shadow-lg ${item.shadow} mb-2 transform transition-all group-hover:scale-110 group-active:scale-95`}>
                  {item.icon}
                </div>
                <span className="text-xs font-medium text-slate-700 text-center">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Account Section */}
      <div className="mt-12 bg-slate-50 rounded-3xl p-6 border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Account Settings</h3>
        {user ? (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 hover:bg-red-50 hover:border-red-100 transition-colors group"
            >
              <div className="flex items-center gap-3">
                 <div className="bg-red-100 p-2 rounded-full text-red-600"><LogOut size={20} /></div>
                 <div className="text-left">
                     <p className="font-bold text-slate-800">Logout</p>
                     <p className="text-xs text-slate-500">{user.name}</p>
                 </div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => onNavigate(AppView.LOGIN)}
              className="w-full flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 hover:bg-green-50 hover:border-green-100 transition-colors"
            >
               <div className="flex items-center gap-3">
                 <div className="bg-green-100 p-2 rounded-full text-green-700"><LogIn size={20} /></div>
                 <div className="text-left">
                     <p className="font-bold text-slate-800">Owner Login</p>
                     <p className="text-xs text-slate-500">Authorized Access</p>
                 </div>
              </div>
            </button>
          )}
      </div>
    </div>
  );
};

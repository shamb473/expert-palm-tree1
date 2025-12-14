
import React from 'react';
import { AppView, User } from '../types';
import { Sprout, ShoppingBag, MessageSquare, Home, LogIn, LogOut, Users, Grid, Languages, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView, user, onLogout }) => {
  const { language, setLanguage, t } = useLanguage();

  // Desktop Nav Items
  const desktopNavItems = [
    { view: AppView.HOME, label: t.nav.home, icon: <Home size={24} /> },
    { view: AppView.PRODUCTS, label: t.nav.products, icon: <ShoppingBag size={24} /> },
    { view: AppView.ADVISOR, label: 'AI Mitra', icon: <MessageSquare size={24} /> },
    { view: AppView.ADVISORY, label: t.nav.advisory, icon: <Grid size={24} /> }, 
    { view: AppView.SCHEMES, label: t.nav.schemes, icon: <Sprout size={24} /> }, 
  ];

  // Mobile Bottom Nav Items
  const mobileNavItems = [
    { view: AppView.HOME, label: 'Home', icon: <Home size={24} /> },
    { view: AppView.PRODUCTS, label: 'Shop', icon: <ShoppingBag size={24} /> },
    { view: AppView.ADVISOR, label: 'AI', icon: <MessageSquare size={24} /> },
    { view: AppView.MENU, label: 'Menu', icon: <Grid size={24} /> },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'mr' : 'en');
  };

  return (
    <>
      {/* --- TOP NAVBAR (Compact Branding) --- */}
      <nav className="bg-[#2E7D32] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Left Section: Back Btn & Logo */}
            <div className="flex items-center gap-1">
                {currentView !== AppView.HOME && (
                    <button 
                        onClick={() => onChangeView(AppView.HOME)}
                        className="p-1.5 rounded-full hover:bg-[#1B5E20] text-white transition-colors mr-1"
                        aria-label="Back"
                    >
                        <ArrowLeft size={22} />
                    </button>
                )}
                
                <div 
                  className="flex items-center space-x-2 cursor-pointer active:opacity-80 transition-opacity" 
                  onClick={() => onChangeView(AppView.HOME)}
                >
                  <div className="bg-white p-1.5 rounded-lg shadow-sm">
                    <Sprout size={20} className="text-[#2E7D32]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-base leading-none tracking-tight">Kastkar</span>
                    <span className="text-[9px] text-[#FBC02D] font-medium tracking-wider uppercase">Krushi Seva</span>
                  </div>
                </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {desktopNavItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => onChangeView(item.view)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                    currentView === item.view
                      ? 'bg-[#1B5E20] text-[#FBC02D] shadow-inner'
                      : 'text-green-100 hover:bg-[#1B5E20] hover:text-white'
                  }`}
                >
                  {/* FIX: Cast to ReactElement<any> to allow size prop */}
                  {React.cloneElement(item.icon as React.ReactElement<any>, { size: 18 })}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Right Side: Language & User */}
            <div className="flex items-center gap-3">
               {/* Language Toggle */}
              <button 
                  onClick={toggleLanguage}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#1B5E20]/50 border border-[#81C784]/30 text-white transition-all hover:bg-[#1B5E20]"
              >
                  <Languages size={14} className="text-[#FBC02D]" />
                  <span className={`text-[10px] font-bold ${language === 'en' ? 'text-white' : 'text-green-200'}`}>EN</span>
                  <span className="text-green-400 text-[10px]">|</span>
                  <span className={`text-[10px] font-bold ${language === 'mr' ? 'text-white' : 'text-green-200'}`}>म</span>
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                   <button
                    onClick={() => onChangeView(AppView.VISITORS)}
                    className="p-1.5 rounded-full hover:bg-[#1B5E20] text-[#FBC02D]"
                    title="Visitor Log"
                  >
                    <Users size={20} />
                  </button>
                  <button 
                    onClick={onLogout}
                    className="p-1.5 rounded-full hover:bg-red-900/50 text-red-200 hover:text-red-100 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onChangeView(AppView.LOGIN)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-[#FBC02D] text-[#1B5E20] text-xs font-bold shadow-md hover:bg-yellow-400 transition-transform active:scale-95"
                >
                  <LogIn size={14} />
                  <span className="hidden sm:inline">{t.nav.login}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE BOTTOM NAVIGATION (Floating) --- */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-50 rounded-2xl h-16">
        <div className="flex justify-around items-center h-full px-1">
          {mobileNavItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.label}
                onClick={() => onChangeView(item.view)}
                className="flex-1 flex flex-col items-center justify-center h-full relative group"
              >
                <div className={`transition-all duration-300 transform ${
                  isActive 
                  ? 'text-[#2E7D32] -translate-y-1' 
                  : 'text-slate-400 group-active:scale-90'
                }`}>
                  {/* FIX: Cast to ReactElement<any> to allow size and other props */}
                  {React.cloneElement(item.icon as React.ReactElement<any>, { 
                    size: 24, 
                    strokeWidth: isActive ? 2.5 : 2,
                    className: isActive ? 'drop-shadow-sm' : ''
                  })}
                </div>
                {isActive && (
                    <span className="absolute bottom-1.5 w-1 h-1 bg-[#2E7D32] rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
    </>
  );
};

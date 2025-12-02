
import React, { useState } from 'react';
import { AppView, User } from '../types';
import { Sprout, Menu, X, ShoppingBag, MessageSquare, Phone, Home, LogIn, LogOut, User as UserIcon, BookOpen, ClipboardList, Languages, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { view: AppView.HOME, label: t.nav.home, icon: <Home size={20} /> },
    { view: AppView.PRODUCTS, label: t.nav.products, icon: <ShoppingBag size={20} /> },
    { view: AppView.ADVISORY, label: t.nav.advisory, icon: <ClipboardList size={20} /> },
    { view: AppView.ADVISOR, label: t.nav.advisor, icon: <MessageSquare size={20} /> },
    { view: AppView.SCHEMES, label: t.nav.schemes, icon: <BookOpen size={20} /> },
    { view: AppView.CONTACT, label: t.nav.contact, icon: <Phone size={20} /> },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'mr' : 'en');
  };

  return (
    <nav className="bg-[#2E7D32] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => onChangeView(AppView.HOME)}
          >
            <Sprout size={32} className="text-[#FBC02D]" />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">Kastkar</span>
              <span className="text-xs text-[#81C784] font-medium">Krushi Seva Kendra</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <div className="flex space-x-1 lg:space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => onChangeView(item.view)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === item.view
                      ? 'bg-[#1B5E20] text-white shadow-inner'
                      : 'text-[#81C784] hover:bg-[#1B5E20] hover:text-white'
                  }`}
                >
                  {React.cloneElement(item.icon as React.ReactElement<any>, { className: currentView === item.view ? 'text-[#FBC02D]' : 'currentColor' })}
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Language Toggle */}
            <button 
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-[#1B5E20] hover:bg-green-900 border border-[#81C784]/30 text-white transition-all ml-2"
                title="Switch Language"
            >
                <Languages size={16} className="text-[#FBC02D]" />
                <span className={`text-xs font-bold ${language === 'en' ? 'text-[#FBC02D]' : 'text-slate-300'}`}>EN</span>
                <span className="text-slate-400">|</span>
                <span className={`text-xs font-bold ${language === 'mr' ? 'text-[#FBC02D]' : 'text-slate-300'}`}>म</span>
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-[#81C784] mx-2 opacity-30"></div>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-4">
                 {/* Owner Visitor Log Button */}
                <button
                  onClick={() => onChangeView(AppView.VISITORS)}
                  className={`p-2 rounded-full transition-colors ${
                    currentView === AppView.VISITORS ? 'bg-[#FBC02D] text-[#1B5E20]' : 'hover:bg-[#1B5E20] text-[#81C784] hover:text-white'
                  }`}
                  title="Visitor Log"
                >
                  <Users size={20} />
                </button>

                <div className="flex items-center space-x-2 text-white px-3 py-1.5 bg-[#1B5E20] rounded-full border border-[#81C784]/30">
                  <div className="bg-white text-[#2E7D32] p-1 rounded-full">
                    <UserIcon size={14} />
                  </div>
                  <span className="font-medium text-sm pr-1 truncate max-w-[80px]">Hi, {user.name.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 rounded-full hover:bg-[#1B5E20] text-[#81C784] hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onChangeView(AppView.LOGIN)}
                className={`flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-bold transition-all shadow-md ${
                  currentView === AppView.LOGIN
                    ? 'bg-[#FBC02D] text-[#1B5E20] ring-2 ring-white/30'
                    : 'bg-white text-[#2E7D32] hover:bg-[#FBC02D] hover:text-[#1B5E20]'
                }`}
              >
                <LogIn size={18} />
                <span>{t.nav.login}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button 
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-2 py-1.5 rounded-full bg-[#1B5E20] border border-[#81C784]/30 text-white"
            >
                <span className={`text-xs font-bold ${language === 'en' ? 'text-[#FBC02D]' : 'text-slate-300'}`}>EN</span>
                <span className="text-slate-400">|</span>
                <span className={`text-xs font-bold ${language === 'mr' ? 'text-[#FBC02D]' : 'text-slate-300'}`}>म</span>
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-[#81C784] hover:text-white hover:bg-[#1B5E20] focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#2E7D32] border-t border-[#1B5E20]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  onChangeView(item.view);
                  setIsMenuOpen(false);
                }}
                className={`flex w-full items-center space-x-3 px-3 py-3 rounded-md text-base font-medium ${
                  currentView === item.view
                    ? 'bg-[#1B5E20] text-white'
                    : 'text-[#81C784] hover:bg-[#1B5E20] hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
            
            {/* Mobile Auth */}
            <div className="border-t border-[#1B5E20] mt-2 pt-2 pb-1">
              {user ? (
                <>
                   <button 
                    onClick={() => { onChangeView(AppView.VISITORS); setIsMenuOpen(false); }}
                    className="flex w-full items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-[#FBC02D] hover:bg-[#1B5E20]"
                  >
                    <Users size={20} />
                    <span>Visitor Log</span>
                  </button>

                  <div className="flex items-center px-3 py-3 text-white font-medium bg-[#1B5E20]/30 rounded-md mb-2 mx-2">
                    <UserIcon size={20} className="mr-3 text-[#FBC02D]" />
                    <span>Hi, {user.name}</span>
                  </div>
                  <button 
                    onClick={() => { onLogout(); setIsMenuOpen(false); }}
                    className="flex w-full items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-red-200 hover:bg-red-900/30 hover:text-red-100"
                  >
                    <LogOut size={20} />
                    <span>{t.nav.logout}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { onChangeView(AppView.LOGIN); setIsMenuOpen(false); }}
                  className="flex w-full items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-[#FBC02D] hover:bg-[#1B5E20]"
                >
                  <LogIn size={20} />
                  <span>{t.nav.login} / Register</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

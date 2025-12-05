
import React, { useState } from 'react';
import { AppView, User, MarketRate, FarmerProfile, DailyWeather } from '../types';
import { TrendingUp, Sun, CloudRain, Sprout, ArrowUpRight, Search, Plus, Trash2, X, Trophy, MapPin, Edit, Camera, MessageCircle, Calendar, Wind, Droplets, AlertTriangle, CheckCircle, CloudLightning, Cloud, CloudSun, Sparkles, BookOpen, ClipboardList, Phone, ChevronRight, Umbrella, ArrowRight, Award, Calculator, Lightbulb } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
  onNavigate: (view: AppView) => void;
  user: User | null;
  marketRates: MarketRate[];
  onAddMarketRate: (rate: MarketRate) => void;
  onDeleteMarketRate: (id: string) => void;
  farmersList: FarmerProfile[];
  onAddFarmer: (profile: FarmerProfile) => void;
  onUpdateFarmer: (profile: FarmerProfile) => void;
  onDeleteFarmer: (id: string) => void;
  weatherData: DailyWeather[];
  weatherLocation: string;
  onWeatherLocationChange: (location: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onNavigate, 
  user,
  marketRates,
  onAddMarketRate,
  onDeleteMarketRate,
  farmersList,
  onAddFarmer,
  onUpdateFarmer,
  onDeleteFarmer,
  weatherData,
  weatherLocation,
  onWeatherLocationChange
}) => {
  const { t } = useLanguage();
  const [mandiSearchQuery, setMandiSearchQuery] = useState('');
  
  // Modal States
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
  const [isFarmerModalOpen, setIsFarmerModalOpen] = useState(false);

  // New Rate States
  const [newMarketRate, setNewMarketRate] = useState<Partial<MarketRate>>({ crop: '', market: '', price: '', trend: '', date: '' });
  
  const [isLocating, setIsLocating] = useState(false);

  // Farmer State
  const defaultFarmer: FarmerProfile = {
      id: '',
      name: '',
      location: '',
      achievement: '',
      image: '',
      year: new Date().getFullYear().toString()
  };
  const [currentFarmer, setCurrentFarmer] = useState<FarmerProfile>(defaultFarmer);
  const [isEditingFarmer, setIsEditingFarmer] = useState(false);

  const todayStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

  const handleDetectLocation = () => {
      if (navigator.geolocation) {
          setIsLocating(true);
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  setTimeout(() => {
                      onWeatherLocationChange('Akola');
                      setIsLocating(false);
                  }, 1000);
              },
              (error) => {
                  alert("Location access denied. Defaulting to Keliweli.");
                  onWeatherLocationChange('Keliweli');
                  setIsLocating(false);
              }
          );
      } else {
          alert("Geolocation not supported.");
      }
  };

  // --- Dynamic Weather Visuals ---
  const getWeatherGradient = (condition: string) => {
      const c = condition.toLowerCase();
      if (c.includes('rain') || c.includes('thunder')) return 'from-blue-700 to-slate-800'; // Rainy
      if (c.includes('cloud')) return 'from-slate-500 to-slate-700'; // Cloudy
      return 'from-orange-400 to-amber-500'; // Sunny/Clear
  };

  const getWeatherIcon = (condition: string, size: number = 24) => {
      switch(condition) {
          case 'Sunny': return <Sun size={size} className="text-yellow-100" />;
          case 'Partly Cloudy': return <CloudSun size={size} className="text-yellow-100" />;
          case 'Cloudy': return <Cloud size={size} className="text-slate-200" />;
          case 'Light Rain': return <CloudRain size={size} className="text-blue-200" />;
          case 'Heavy Rain': return <CloudRain size={size} className="text-blue-100" />;
          case 'Thunderstorm': return <CloudLightning size={size} className="text-purple-200" />;
          default: return <Sun size={size} className="text-yellow-100" />;
      }
  };

  const filteredRates = marketRates.filter(item => 
    item.market.toLowerCase().includes(mandiSearchQuery.toLowerCase()) || 
    item.crop.toLowerCase().includes(mandiSearchQuery.toLowerCase())
  );

  const handleMarketSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(newMarketRate.crop && newMarketRate.market && newMarketRate.price) {
          onAddMarketRate({
              id: Date.now().toString(),
              crop: newMarketRate.crop!,
              market: newMarketRate.market!,
              price: newMarketRate.price!,
              trend: newMarketRate.trend || '0.0%',
              date: newMarketRate.date || todayStr
          });
          setIsMarketModalOpen(false);
          setNewMarketRate({ crop: '', market: '', price: '', trend: '', date: '' });
      }
  };

  const handleFarmerSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (isEditingFarmer) {
          onUpdateFarmer(currentFarmer);
      } else {
          onAddFarmer({
              ...currentFarmer,
              id: Date.now().toString(),
              image: currentFarmer.image || `https://picsum.photos/400/400?random=${Date.now()}`
          });
      }
      setIsFarmerModalOpen(false);
  };

  const handleFarmerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentFarmer(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddFarmerModal = () => {
      setCurrentFarmer(defaultFarmer);
      setIsEditingFarmer(false);
      setIsFarmerModalOpen(true);
  };

  const openEditFarmerModal = (farmer: FarmerProfile) => {
      setCurrentFarmer(farmer);
      setIsEditingFarmer(true);
      setIsFarmerModalOpen(true);
  };

  // --- Quick Action Buttons (Compact Mobile Grid) ---
  const quickActions = [
      { view: AppView.PRODUCTS, label: 'Shop', icon: <Sprout size={24} />, bg: 'bg-green-100', text: 'text-[#2E7D32]' },
      { view: AppView.CALCULATOR, label: 'Calc', icon: <Calculator size={24} />, bg: 'bg-yellow-100', text: 'text-[#FBC02D]' },
      { view: AppView.ADVISORY, label: 'Advisory', icon: <ClipboardList size={24} />, bg: 'bg-orange-100', text: 'text-orange-800' },
      { view: AppView.ADVISOR, label: 'AI Mitra', icon: <Sparkles size={24} />, bg: 'bg-purple-100', text: 'text-purple-800' },
  ];

  const currentWeather = weatherData[0];

  return (
    <div className="bg-slate-50 min-h-screen pb-28">
      
      {/* 1. SMART HEADER & WEATHER */}
      <div className="relative bg-[#2E7D32] pt-4 pb-16 px-4 rounded-b-[2rem] shadow-lg overflow-hidden">
         {/* Background Shapes */}
         <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
         
         <div className="max-w-7xl mx-auto relative z-10">
             {/* Greeting */}
             <div className="flex justify-between items-center mb-6 text-white">
                 <div>
                     <h1 className="text-2xl font-bold">
                         {t.hero.welcome} <span className="text-[#FBC02D]">Kastkar</span>
                     </h1>
                     <p className="text-green-200 text-xs flex items-center gap-1 mt-1">
                        <MapPin size={12}/> {weatherLocation} • {todayStr}
                     </p>
                 </div>
                 <button onClick={handleDetectLocation} className="bg-white/10 p-2 rounded-full hover:bg-white/20 backdrop-blur-md">
                     <MapPin size={20} className={isLocating ? 'animate-bounce' : ''} />
                 </button>
             </div>

             {/* Daily Smart Tip */}
             <div className="mb-4 bg-white/10 backdrop-blur-md rounded-xl p-3 flex items-start gap-3 border border-white/20">
                <div className="bg-[#FBC02D] p-1.5 rounded-full text-[#1B5E20] mt-0.5">
                    <Lightbulb size={14} />
                </div>
                <div>
                    <h4 className="text-white text-xs font-bold uppercase tracking-wide opacity-80">Daily Smart Tip</h4>
                    <p className="text-white text-xs font-medium leading-relaxed mt-0.5">
                        Clean nozzles of your sprayer before applying new pesticides to ensure even distribution.
                    </p>
                </div>
             </div>

             {/* Dedication Text */}
             <div className="mb-6 text-center px-2">
                 <p className="text-white text-sm font-medium leading-relaxed">
                     Providing top-quality agricultural inputs and expert guidance to maximize your yield.
                 </p>
                 <p className="text-green-200 text-xs mt-1">
                     Kastkar Krushi Seva Kendra is dedicated to the prosperity of every farmer.
                 </p>
             </div>

             {/* Weather Card (Main Feature) */}
             {currentWeather ? (
                <div className={`rounded-3xl p-5 text-white bg-gradient-to-br ${getWeatherGradient(currentWeather.condition)} shadow-lg border border-white/10`}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div>
                                {getWeatherIcon(currentWeather.condition, 48)}
                            </div>
                            <div>
                                <h2 className="text-4xl font-bold">{currentWeather.temp}°</h2>
                                <p className="text-sm opacity-90 font-medium">{currentWeather.condition}</p>
                            </div>
                        </div>
                        
                        <div className="text-right">
                             <div className="flex items-center justify-end gap-1 mb-1">
                                <Umbrella size={16} className="text-blue-200" />
                                <span className="text-xl font-bold">{currentWeather.rainChance}%</span>
                             </div>
                             <p className="text-[10px] opacity-75">Rain Chance</p>
                        </div>
                    </div>
                    
                    {/* Mini Stats */}
                    <div className="mt-4 flex justify-between items-center text-xs font-medium bg-black/10 rounded-xl p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-1.5">
                            <Wind size={14} className="opacity-70" /> {currentWeather.windSpeed} km/h
                        </div>
                        <div className="w-px h-4 bg-white/20"></div>
                        <div className="flex items-center gap-1.5">
                            <Droplets size={14} className="opacity-70" /> {currentWeather.humidity}% Hum
                        </div>
                        <div className="w-px h-4 bg-white/20"></div>
                         <div className={`flex items-center gap-1.5 ${currentWeather.isSpraySafe ? 'text-green-300' : 'text-red-300'}`}>
                            {currentWeather.isSpraySafe ? <CheckCircle size={14} /> : <AlertTriangle size={14} />} 
                            {currentWeather.isSpraySafe ? 'Spray OK' : 'No Spray'}
                        </div>
                    </div>
                </div>
             ) : (
                 <div className="h-40 bg-white/10 rounded-3xl animate-pulse"></div>
             )}
         </div>
      </div>

      {/* 2. QUICK ACTIONS (Floating Grid) */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
          <div className="bg-white rounded-2xl shadow-xl p-4 border border-slate-100">
              <div className="grid grid-cols-4 gap-2">
                  {quickActions.map((action, idx) => (
                      <button 
                        key={idx}
                        onClick={() => onNavigate(action.view)}
                        className="flex flex-col items-center gap-2 group p-2 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${action.bg} ${action.text} group-hover:scale-105 transition-transform`}>
                              {action.icon}
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">
                              {action.label}
                          </span>
                      </button>
                  ))}
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">

        {/* 4. MANDI RATES (Clean List) */}
        <div>
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <TrendingUp size={20} className="text-[#2E7D32]" />
                    {t.hero.mandiRates}
                </h3>
                {user && <button onClick={() => setIsMarketModalOpen(true)} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">+ Add Rate</button>}
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Search Header */}
                <div className="p-3 border-b border-slate-50 bg-slate-50/50">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search crop or market..."
                            value={mandiSearchQuery}
                            onChange={(e) => setMandiSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border-none bg-white rounded-xl shadow-sm focus:ring-1 focus:ring-green-500 outline-none placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Rate List */}
                <div className="max-h-[300px] overflow-y-auto">
                    {filteredRates.length > 0 ? (
                        filteredRates.map((rate, idx) => (
                            <div key={rate.id} className={`p-4 flex justify-between items-center ${idx !== filteredRates.length - 1 ? 'border-b border-slate-50' : ''}`}>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                                        {rate.crop}
                                        {rate.isAiVerified && <Sparkles size={10} className="text-yellow-500 fill-yellow-500" />}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wide mt-0.5">
                                        {rate.market} • <span className="text-slate-400">{rate.date}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="font-bold text-[#2E7D32]">{rate.price}</p>
                                        <p className={`text-[10px] font-bold ${rate.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                                            {rate.trend}
                                        </p>
                                    </div>
                                    {user && (
                                        <button onClick={() => onDeleteMarketRate(rate.id)} className="text-slate-300 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-slate-400 text-sm">No rates found</div>
                    )}
                </div>
            </div>
        </div>

        {/* 5. FARMER OF THE YEAR (Vertical List) */}
        <div>
          <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Award size={20} className="text-[#FBC02D] fill-[#FBC02D]" />
                  {t.hero.farmerAward}
              </h2>
              {user && <button onClick={openAddFarmerModal} className="text-xs font-bold text-[#2E7D32] bg-green-50 px-3 py-1 rounded-full">+ Add</button>}
          </div>

          <div className="space-y-4">
              {farmersList.map(farmer => (
                  <div key={farmer.id} className="bg-gradient-to-r from-yellow-50 to-white rounded-2xl p-4 shadow-sm border border-yellow-100 relative flex gap-4 items-center">
                      {/* Badge */}
                      <div className="absolute top-0 left-0 bg-[#FBC02D] text-[#1B5E20] text-[9px] font-bold px-2 py-0.5 rounded-br-lg rounded-tl-xl z-10">
                          YEAR {farmer.year}
                      </div>

                      <div className="relative shrink-0">
                          <img 
                              src={farmer.image} 
                              alt={farmer.name} 
                              className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-md"
                          />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                          <h3 className="font-extrabold text-slate-900 text-base leading-tight truncate">{farmer.name}</h3>
                          <p className="text-xs text-yellow-800 font-bold flex items-center gap-1 mt-1 mb-2">
                              <MapPin size={10} /> {farmer.location}
                          </p>
                          <p className="text-xs text-slate-600 italic leading-relaxed line-clamp-2">"{farmer.achievement}"</p>
                      </div>
                      
                      {user && (
                          <div className="flex flex-col gap-2">
                              <button onClick={() => openEditFarmerModal(farmer)} className="p-1.5 bg-white rounded-lg text-slate-400 hover:text-blue-500 shadow-sm"><Edit size={14}/></button>
                              <button onClick={() => onDeleteFarmer(farmer.id)} className="p-1.5 bg-white rounded-lg text-slate-400 hover:text-red-500 shadow-sm"><Trash2 size={14}/></button>
                          </div>
                      )}
                  </div>
              ))}
          </div>
        </div>
      
      </div>

      {/* --- MODALS (Standardized) --- */}
      {/* Market Modal */}
      {isMarketModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
              <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                  <h3 className="font-bold mb-4 text-xl">Add Rate</h3>
                  <form onSubmit={handleMarketSubmit} className="space-y-4">
                      <input type="text" placeholder="Crop Name" className="w-full border p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-green-500" value={newMarketRate.crop} onChange={e => setNewMarketRate({...newMarketRate, crop: e.target.value})} required />
                      <input type="text" placeholder="Market Name" className="w-full border p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-green-500" value={newMarketRate.market} onChange={e => setNewMarketRate({...newMarketRate, market: e.target.value})} required />
                      <input type="text" placeholder="Price (e.g. ₹5000)" className="w-full border p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-green-500" value={newMarketRate.price} onChange={e => setNewMarketRate({...newMarketRate, price: e.target.value})} required />
                      <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setIsMarketModalOpen(false)} className="flex-1 py-3 text-slate-500 font-bold rounded-xl hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="flex-1 bg-[#2E7D32] text-white py-3 rounded-xl font-bold shadow-lg shadow-green-200">Save</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Farmer Modal */}
      {isFarmerModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
              <div className="bg-white rounded-3xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
                  <h3 className="font-bold mb-6 text-xl text-center">{isEditingFarmer ? 'Edit' : 'Add'} Farmer</h3>
                  <form onSubmit={handleFarmerSubmit} className="space-y-4">
                      <div className="flex justify-center mb-4">
                           <div className="relative w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300">
                              {currentFarmer.image ? <img src={currentFarmer.image} className="w-full h-full object-cover" /> : <Camera className="text-slate-400" size={32} />}
                              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFarmerImageUpload} />
                           </div>
                      </div>
                      <input type="text" placeholder="Full Name" className="w-full border p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-green-500" value={currentFarmer.name} onChange={e => setCurrentFarmer({...currentFarmer, name: e.target.value})} required />
                      <input type="text" placeholder="Location" className="w-full border p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-green-500" value={currentFarmer.location} onChange={e => setCurrentFarmer({...currentFarmer, location: e.target.value})} required />
                      <textarea placeholder="Achievement Details" className="w-full border p-3 rounded-xl bg-slate-50 h-24 outline-none focus:ring-2 focus:ring-green-500" value={currentFarmer.achievement} onChange={e => setCurrentFarmer({...currentFarmer, achievement: e.target.value})} required />
                      <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setIsFarmerModalOpen(false)} className="flex-1 py-3 text-slate-500 font-bold rounded-xl hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="flex-1 bg-[#2E7D32] text-white py-3 rounded-xl font-bold shadow-lg shadow-green-200">Save Profile</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
};

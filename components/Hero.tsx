
import React, { useState } from 'react';
import { AppView, User, MarketRate, FarmerProfile, DailyWeather } from '../types';
import { TrendingUp, Sun, CloudRain, Sprout, Search, Trash2, MapPin, Edit, Camera, Sparkles, ClipboardList, Umbrella, Award, Calculator, Lightbulb, Wind, Droplets, CheckCircle, AlertTriangle, CloudSun, Cloud, CloudLightning } from 'lucide-react';
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
  const [showFullForecast, setShowFullForecast] = useState(false);

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
      if (c.includes('rain') || c.includes('thunder')) return 'from-blue-600 to-blue-800'; // Rainy
      if (c.includes('cloud')) return 'from-slate-400 to-slate-600'; // Cloudy
      return 'from-orange-400 to-yellow-500'; // Sunny/Clear
  };

  const getWeatherIcon = (condition: string, size: number = 24) => {
      switch(condition) {
          case 'Sunny': return <Sun size={size} className="text-yellow-100" />;
          case 'Partly Cloudy': return <CloudSun size={size} className="text-yellow-100" />;
          case 'Cloudy': return <Cloud size={size} className="text-slate-200" />;
          case 'Light Rain': return <CloudRain size={size} className="text-blue-100" />;
          case 'Heavy Rain': return <CloudRain size={size} className="text-blue-100" />;
          case 'Thunderstorm': return <CloudLightning size={size} className="text-purple-100" />;
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

  // --- Quick Action Buttons (App Icon Style) ---
  const quickActions = [
      { view: AppView.PRODUCTS, label: 'Shop', icon: <Sprout size={28} />, gradient: 'from-blue-500 to-blue-700' },
      { view: AppView.CALCULATOR, label: 'Calc', icon: <Calculator size={28} />, gradient: 'from-yellow-400 to-orange-500' },
      { view: AppView.ADVISORY, label: 'Advisory', icon: <ClipboardList size={28} />, gradient: 'from-teal-400 to-teal-600' },
      { view: AppView.ADVISOR, label: 'AI Mitra', icon: <Sparkles size={28} />, gradient: 'from-purple-500 to-purple-700' },
  ];

  const currentWeather = weatherData[0];

  return (
    <div className="bg-slate-50 min-h-screen pb-28">
      
      {/* 1. SMART HEADER & WEATHER */}
      <div className="relative bg-[#2E7D32] pt-4 pb-20 px-4 rounded-b-[2.5rem] shadow-lg overflow-hidden">
         {/* Background Shapes */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
         
         <div className="max-w-7xl mx-auto relative z-10">
             {/* Header Row */}
             <div className="flex justify-between items-start mb-6 text-white">
                 <div>
                     <h1 className="text-xl font-bold">
                         {t.hero.welcome} <span className="text-[#FBC02D]">Kastkar</span>
                     </h1>
                     <div className="flex items-center gap-1 mt-1 opacity-90">
                         <MapPin size={12} className="text-[#FBC02D]" />
                         <span className="text-xs font-medium">Serving All Farmers (शेतकरी)</span>
                     </div>
                     <div className="mt-2 text-[10px] opacity-80 leading-tight space-y-0.5">
                         <p>Dedicated to Farmer's Prosperity</p>
                         <p>Best Quality • Best Price</p>
                     </div>
                 </div>
                 
                 {/* Location Pill */}
                 <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
                    <span className="text-xs font-bold text-white">{weatherLocation}</span>
                    <button onClick={handleDetectLocation} className="p-1 rounded-full hover:bg-white/20">
                         <MapPin size={14} className={`text-[#FBC02D] ${isLocating ? 'animate-bounce' : ''}`} />
                    </button>
                 </div>
             </div>

             {/* Daily Smart Tip (Widget Style) */}
             <div className="mb-6 bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3 border border-white/20 shadow-sm">
                <div className="bg-[#FBC02D] w-10 h-10 rounded-full flex items-center justify-center text-[#1B5E20] shrink-0 shadow-sm">
                    <Lightbulb size={20} />
                </div>
                <div>
                    <h4 className="text-white text-[10px] font-bold uppercase tracking-wide opacity-80">Daily Smart Tip</h4>
                    <p className="text-white text-xs font-medium leading-snug">
                        Clean nozzles of your sprayer before applying new pesticides.
                    </p>
                </div>
             </div>

             {/* Weather Card (Glassmorphic) */}
             {currentWeather ? (
                <div className={`rounded-3xl p-5 text-white bg-gradient-to-br ${getWeatherGradient(currentWeather.condition)} shadow-xl border border-white/10 relative overflow-hidden transition-all`}>
                    
                    {/* Main Weather Info */}
                    <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="drop-shadow-md transform scale-110">
                                {getWeatherIcon(currentWeather.condition, 56)}
                            </div>
                            <div>
                                <h2 className="text-5xl font-bold tracking-tighter">{currentWeather.temp}°</h2>
                                <p className="text-sm font-medium opacity-90">{currentWeather.condition}</p>
                                <p className="text-xs opacity-75 mt-0.5 font-medium">{currentWeather.date}</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                             <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                <Umbrella size={14} className="text-white" />
                                <span className="text-sm font-bold">{currentWeather.rainChance}% Rain</span>
                             </div>
                             <button 
                                onClick={() => setShowFullForecast(!showFullForecast)}
                                className="text-xs font-medium underline opacity-80 hover:opacity-100"
                             >
                                {showFullForecast ? 'Hide Forecast' : '7-Day Forecast'}
                             </button>
                        </div>
                    </div>
                    
                    {/* Mini Metrics */}
                    {!showFullForecast && (
                        <div className="mt-5 grid grid-cols-3 gap-2">
                             <div className="bg-black/10 rounded-xl p-2 flex flex-col items-center justify-center backdrop-blur-sm">
                                 <Wind size={16} className="mb-1 opacity-80" />
                                 <span className="text-xs font-bold">{currentWeather.windSpeed} km/h</span>
                             </div>
                             <div className="bg-black/10 rounded-xl p-2 flex flex-col items-center justify-center backdrop-blur-sm">
                                 <Droplets size={16} className="mb-1 opacity-80" />
                                 <span className="text-xs font-bold">{currentWeather.humidity}%</span>
                             </div>
                             <div className={`rounded-xl p-2 flex flex-col items-center justify-center backdrop-blur-sm ${currentWeather.isSpraySafe ? 'bg-green-500/30 text-green-100' : 'bg-red-500/30 text-red-100'}`}>
                                 {currentWeather.isSpraySafe ? <CheckCircle size={16} className="mb-1"/> : <AlertTriangle size={16} className="mb-1"/>}
                                 <span className="text-xs font-bold">{currentWeather.isSpraySafe ? 'Spray OK' : 'No Spray'}</span>
                             </div>
                        </div>
                    )}

                    {/* 7-Day Forecast (Toggle) */}
                    {showFullForecast && (
                        <div className="mt-5 border-t border-white/20 pt-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
                                {weatherData.map((day, idx) => (
                                    <div key={idx} className="flex flex-col items-center min-w-[70px] bg-white/10 rounded-xl p-2 shrink-0">
                                        <span className="text-[10px] font-bold uppercase opacity-80">{day.day.slice(0,3)}</span>
                                        <span className="text-[9px] opacity-70 mb-1">{day.date}</span>
                                        <div className="my-1">{getWeatherIcon(day.condition, 20)}</div>
                                        <span className="text-sm font-bold">{day.temp}°</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
             ) : (
                 <div className="h-48 bg-white/10 rounded-3xl animate-pulse"></div>
             )}
         </div>
      </div>

      {/* 2. QUICK ACTIONS (App Icon Grid) */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 mb-8">
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
              <div className="flex justify-between items-start">
                  {quickActions.map((action, idx) => (
                      <button 
                        key={idx}
                        onClick={() => onNavigate(action.view)}
                        className="flex flex-col items-center gap-2 group w-1/4"
                      >
                          {/* App Icon Shape */}
                          <div className={`w-14 h-14 rounded-[1.2rem] bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg text-white transform transition-transform group-hover:scale-110 group-active:scale-95 border border-white/20`}>
                              {action.icon}
                          </div>
                          <span className="text-[11px] font-bold text-slate-700 text-center leading-tight">
                              {action.label}
                          </span>
                      </button>
                  ))}
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-8">

        {/* 4. MANDI RATES */}
        <div>
            <div className="flex justify-between items-center mb-4 px-1">
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
          <div className="flex justify-between items-center mb-4 px-1">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Award size={20} className="text-[#FBC02D] fill-[#FBC02D]" />
                  {t.hero.farmerAward}
              </h2>
              {user && <button onClick={openAddFarmerModal} className="text-xs font-bold text-[#2E7D32] bg-green-50 px-3 py-1 rounded-full">+ Add</button>}
          </div>

          <div className="space-y-4">
              {farmersList.map(farmer => (
                  <div key={farmer.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative flex gap-4 items-center overflow-hidden">
                      {/* Decorative Gold Side */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-yellow-300 to-yellow-500"></div>

                      <div className="relative shrink-0 ml-2">
                          <img 
                              src={farmer.image} 
                              alt={farmer.name} 
                              className="w-16 h-16 rounded-full object-cover border-2 border-yellow-100 shadow-sm"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-[#FBC02D] text-[#1B5E20] text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                              {farmer.year}
                          </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 text-base leading-tight truncate">{farmer.name}</h3>
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5 mb-1.5">
                              <MapPin size={10} /> {farmer.location}
                          </p>
                          <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg leading-relaxed line-clamp-2">"{farmer.achievement}"</p>
                      </div>
                      
                      {user && (
                          <div className="flex flex-col gap-2">
                              <button onClick={() => openEditFarmerModal(farmer)} className="p-1.5 bg-slate-50 rounded-lg text-slate-400 hover:text-blue-500 shadow-sm"><Edit size={14}/></button>
                              <button onClick={() => onDeleteFarmer(farmer.id)} className="p-1.5 bg-slate-50 rounded-lg text-slate-400 hover:text-red-500 shadow-sm"><Trash2 size={14}/></button>
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

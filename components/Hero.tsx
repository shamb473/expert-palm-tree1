
import React, { useState } from 'react';
import { AppView, User, MarketRate, BullionRate, FarmerProfile, DailyWeather } from '../types';
import { TrendingUp, Sun, CloudRain, Sprout, ArrowUpRight, Coins, Search, Plus, Trash2, X, Trophy, MapPin, Edit, Camera, MessageCircle, Calendar, Wind, Droplets, AlertTriangle, CheckCircle, CloudLightning, Cloud, CloudSun, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
  onNavigate: (view: AppView) => void;
  user: User | null;
  marketRates: MarketRate[];
  onAddMarketRate: (rate: MarketRate) => void;
  onDeleteMarketRate: (id: string) => void;
  bullionRates: BullionRate[];
  onAddBullionRate: (rate: BullionRate) => void;
  onDeleteBullionRate: (id: string) => void;
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
  bullionRates,
  onAddBullionRate,
  onDeleteBullionRate,
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
  const [isBullionModalOpen, setIsBullionModalOpen] = useState(false);
  const [isFarmerModalOpen, setIsFarmerModalOpen] = useState(false);

  // New Rate States
  const [newMarketRate, setNewMarketRate] = useState<Partial<MarketRate>>({ crop: '', market: '', price: '', trend: '', date: '' });
  const [newBullionRate, setNewBullionRate] = useState<Partial<BullionRate>>({ metal: '', price: '', trend: '', date: '' });
  
  const [isLocating, setIsLocating] = useState(false);

  // Farmer State (for Add/Edit)
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
                  console.error(error);
                  alert("Location access denied or unavailable. Defaulting to Keliweli.");
                  onWeatherLocationChange('Keliweli');
                  setIsLocating(false);
              }
          );
      } else {
          alert("Geolocation is not supported by this browser.");
      }
  };

  const getWeatherIcon = (condition: string, size: number = 24) => {
      switch(condition) {
          case 'Sunny': return <Sun size={size} className="text-orange-500" />;
          case 'Partly Cloudy': return <CloudSun size={size} className="text-yellow-500" />;
          case 'Cloudy': return <Cloud size={size} className="text-slate-400" />;
          case 'Light Rain': return <CloudRain size={size} className="text-blue-400" />;
          case 'Heavy Rain': return <CloudRain size={size} className="text-blue-600" />;
          case 'Thunderstorm': return <CloudLightning size={size} className="text-purple-600" />;
          default: return <Sun size={size} className="text-orange-500" />;
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

  const handleBullionSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(newBullionRate.metal && newBullionRate.price) {
          onAddBullionRate({
              id: Date.now().toString(),
              metal: newBullionRate.metal!,
              price: newBullionRate.price!,
              trend: newBullionRate.trend || '0.0%',
              date: newBullionRate.date || todayStr
          });
          setIsBullionModalOpen(false);
          setNewBullionRate({ metal: '', price: '', trend: '', date: '' });
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

  return (
    <div className="space-y-8 pb-10">
      {/* Main Banner */}
      <div className="relative bg-[#2E7D32] text-white overflow-hidden rounded-b-3xl shadow-2xl">
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/1920/1080?grayscale&blur=2" 
            alt="Farming Background" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            {t.hero.welcome} <span className="text-[#FBC02D]">Kastkar</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#81C784] max-w-3xl mb-10 font-medium">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => onNavigate(AppView.PRODUCTS)}
              className="px-8 py-4 bg-[#FBC02D] hover:bg-yellow-400 text-[#1B5E20] font-bold rounded-full transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 border border-transparent"
            >
              <Sprout size={20} />
              <span>{t.hero.viewProducts}</span>
            </button>
            <button 
              onClick={() => onNavigate(AppView.ADVISOR)}
              className="px-8 py-4 bg-[#1B5E20] hover:bg-green-900 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg border border-[#81C784] flex items-center justify-center space-x-2"
            >
              <Search size={20} />
              <span>{t.hero.askAI}</span>
            </button>
            <button 
              onClick={() => window.open('https://wa.me/918999678500', '_blank')}
              className="px-8 py-4 bg-[#25D366] hover:bg-green-500 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              <MessageCircle size={20} />
              <span>{t.hero.chatWhatsapp}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Weather Card */}
        <div className="bg-white rounded-2xl p-0 shadow-xl border-t-4 border-[#FBC02D] md:col-span-2 xl:col-span-2 overflow-hidden flex flex-col">
            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <MapPin size={18} className="text-[#2E7D32]" />
                        <select 
                            value={weatherLocation}
                            onChange={(e) => onWeatherLocationChange(e.target.value)}
                            className="bg-transparent font-bold text-lg text-slate-800 outline-none cursor-pointer hover:bg-white/50 rounded px-1 -ml-1"
                        >
                            <option value="Keliweli">Keliweli</option>
                            <option value="Akot">Akot</option>
                            <option value="Akola">Akola</option>
                        </select>
                        <button 
                            onClick={handleDetectLocation} 
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            disabled={isLocating}
                        >
                            {isLocating ? t.hero.locating : `(${t.hero.detectLoc})`}
                        </button>
                    </div>
                </div>
            </div>

            {weatherData.length > 0 && (
                <div className="flex flex-col md:flex-row flex-1">
                    <div className="p-6 flex-1 flex flex-col justify-between border-r border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="text-4xl font-bold text-slate-800">{weatherData[0].temp}°C</h4>
                                <p className="text-slate-600 font-medium flex items-center mt-1">
                                    {getWeatherIcon(weatherData[0].condition, 18)}
                                    <span className="ml-2">{weatherData[0].condition}</span>
                                </p>
                            </div>
                            {getWeatherIcon(weatherData[0].condition, 48)}
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-slate-50 p-2 rounded-lg flex items-center gap-2">
                                <Wind size={18} className="text-slate-400" />
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Wind</p>
                                    <p className="text-sm font-bold text-slate-700">{weatherData[0].windSpeed} km/h</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-lg flex items-center gap-2">
                                <Droplets size={18} className="text-blue-400" />
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Humidity</p>
                                    <p className="text-sm font-bold text-slate-700">{weatherData[0].humidity}%</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-lg flex items-center gap-2 col-span-2">
                                <CloudRain size={18} className="text-blue-500" />
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Rain Chance</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${weatherData[0].rainChance}%` }}></div>
                                        </div>
                                        <p className="text-sm font-bold text-blue-600">{weatherData[0].rainChance}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`p-3 rounded-xl border flex items-center gap-3 ${weatherData[0].isSpraySafe ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            {weatherData[0].isSpraySafe ? (
                                <CheckCircle size={24} className="text-green-600" />
                            ) : (
                                <AlertTriangle size={24} className="text-red-500" />
                            )}
                            <div>
                                <p className={`text-xs font-bold uppercase ${weatherData[0].isSpraySafe ? 'text-green-700' : 'text-red-700'}`}>
                                    Spray Condition: {weatherData[0].isSpraySafe ? 'SAFE' : 'UNSAFE'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 w-full md:w-48 overflow-y-auto max-h-[320px]">
                        <h5 className="text-xs font-bold text-slate-400 uppercase mb-3">7 Days Forecast</h5>
                        <div className="space-y-3">
                            {weatherData.map((day, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm group">
                                    <div className="w-12">
                                        <p className={`font-medium ${idx===0 ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>{day.day.slice(0,3)}</p>
                                        <p className="text-[10px] text-slate-400">{day.date.split(' ')[0]}</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        {getWeatherIcon(day.condition, 16)}
                                        {day.rainChance > 20 && <span className="text-[9px] text-blue-500 font-bold">{day.rainChance}%</span>}
                                    </div>
                                    <span className="font-bold text-slate-700 w-8 text-right">{day.temp}°</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Live Mandi Rates Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-t-4 border-[#2E7D32] md:col-span-2 xl:col-span-1">
          <div className="flex flex-col items-start justify-between mb-4 gap-2">
            <div className="flex items-center space-x-2 text-[#2E7D32] w-full justify-between">
               <div className="flex items-center gap-2">
                   <TrendingUp size={24} />
                   <h3 className="font-bold text-lg leading-none">{t.hero.mandiRates}</h3>
               </div>
               {user && (
                    <button 
                        onClick={() => setIsMarketModalOpen(true)}
                        className="bg-[#2E7D32] text-white p-1.5 rounded-full hover:bg-[#1B5E20] shadow-md transition-colors"
                        title="Add Rate"
                    >
                        <Plus size={16} />
                    </button>
                )}
            </div>
            
            <div className="relative w-full">
                <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search crop..."
                    value={mandiSearchQuery}
                    onChange={(e) => setMandiSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2E7D32] outline-none bg-slate-50"
                />
            </div>
          </div>
          
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {filteredRates.length > 0 ? filteredRates.map((rate) => (
              <div key={rate.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-green-50 transition-colors group">
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-sm flex items-center gap-1">
                        {rate.crop}
                        {rate.isAiVerified && <span title="AI Verified"><Sparkles size={10} className="text-yellow-500 fill-yellow-500" /></span>}
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">{rate.date}</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-500 mt-0.5">
                    <span className="font-medium mr-2">{rate.market}</span>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2 ml-2">
                  <div>
                    <div className="font-bold text-[#2E7D32] text-sm">{rate.price}</div>
                    <div className={`text-[10px] flex items-center justify-end ${rate.trend.startsWith('+') ? 'text-green-600' : rate.trend === 'Forecast' ? 'text-blue-500' : 'text-red-500'}`}>
                      {rate.trend !== 'Forecast' && <ArrowUpRight size={10} className={`mr-0.5 ${rate.trend.startsWith('-') ? 'rotate-180' : ''}`} />}
                      {rate.trend}
                    </div>
                  </div>
                  {user && (
                    <button 
                        onClick={() => onDeleteMarketRate(rate.id)}
                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                        <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            )) : (
                <div className="text-center py-8 text-slate-400 text-xs">No rates found</div>
            )}
          </div>
        </div>

        {/* Live Bullion Rates Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-t-4 border-[#FBC02D] md:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-[#2E7D32]">
              <Coins size={24} className="text-[#FBC02D]" />
              <div>
                  <h3 className="font-bold text-lg leading-none">{t.hero.bullion}</h3>
                  <span className="text-[10px] text-slate-400 font-medium">Gold & Silver</span>
              </div>
            </div>
            {user && (
                <button 
                    onClick={() => setIsBullionModalOpen(true)}
                    className="bg-[#2E7D32] text-white p-1.5 rounded-full hover:bg-[#1B5E20] shadow-md transition-colors"
                >
                    <Plus size={16} />
                </button>
            )}
          </div>
          
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {bullionRates.map((rate) => (
              <div key={rate.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-yellow-50 transition-colors group">
                <div>
                  <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm flex items-center gap-1">
                          {rate.metal}
                          {rate.isAiVerified && <span title="AI Verified"><Sparkles size={10} className="text-yellow-500 fill-yellow-500" /></span>}
                      </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium flex items-center mt-1">
                      <Calendar size={10} className="mr-1" /> {rate.date}
                  </span>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <div className="font-bold text-[#2E7D32] text-sm">{rate.price}</div>
                    <div className={`text-[10px] ${rate.trend.startsWith('+') ? 'text-green-600' : rate.trend === 'Forecast' ? 'text-blue-500' : 'text-red-500'}`}>
                      {rate.trend}
                    </div>
                  </div>
                  {user && (
                    <button 
                        onClick={() => onDeleteBullionRate(rate.id)}
                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                        <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Services Grid (Static Info) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <span className="w-2 h-8 bg-[#FBC02D] rounded-full mr-3"></span>
            {t.hero.servicesTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow group">
            <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#2E7D32] transition-colors">
              <Sprout size={28} className="text-[#2E7D32] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">{t.hero.service1Title}</h3>
            <p className="text-slate-600 leading-relaxed">{t.hero.service1Desc}</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow group">
            <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#2E7D32] transition-colors">
              <TrendingUp size={28} className="text-[#2E7D32] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">{t.hero.service2Title}</h3>
            <p className="text-slate-600 leading-relaxed">{t.hero.service2Desc}</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow group">
             <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#2E7D32] transition-colors">
              <Sun size={28} className="text-[#2E7D32] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">{t.hero.service3Title}</h3>
            <p className="text-slate-600 leading-relaxed">{t.hero.service3Desc}</p>
            <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
               <span className="text-xs font-bold text-[#FBC02D] uppercase tracking-wider">{t.hero.supporting}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Farmer of the Year Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
          <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-10 opacity-10 transform rotate-12">
                  <Trophy size={200} />
              </div>

              <div className="relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-green-700/50 pb-6">
                      <div>
                          <div className="flex items-center gap-3 mb-2">
                              <Trophy className="text-[#FBC02D]" size={32} />
                              <h2 className="text-3xl font-extrabold text-[#FBC02D]">{t.hero.farmerAward}</h2>
                          </div>
                          <p className="text-green-100 max-w-xl">Celebrating the hard work and success of our local Keliweli farmers.</p>
                      </div>
                      {user && (
                          <button 
                              onClick={openAddFarmerModal}
                              className="bg-white text-[#2E7D32] px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-[#FBC02D] hover:text-[#1B5E20] transition-colors flex items-center gap-2"
                          >
                              <Plus size={18} />
                              Add Farmer
                          </button>
                      )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {farmersList.map(farmer => (
                          <div key={farmer.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-colors group relative">
                              <div className="flex items-start gap-4">
                                  <img 
                                      src={farmer.image} 
                                      alt={farmer.name} 
                                      className="w-20 h-20 rounded-full border-4 border-[#FBC02D] object-cover shadow-md"
                                  />
                                  <div>
                                      <h3 className="font-bold text-xl text-white">{farmer.name}</h3>
                                      <div className="flex items-center text-green-200 text-sm mb-2">
                                          <MapPin size={14} className="mr-1" /> {farmer.location}
                                      </div>
                                      <span className="inline-block bg-[#FBC02D] text-[#1B5E20] text-xs font-bold px-2 py-0.5 rounded-full">
                                          Year {farmer.year}
                                      </span>
                                  </div>
                              </div>
                              <div className="mt-4 bg-[#1B5E20]/50 p-3 rounded-xl border border-white/10">
                                  <p className="text-sm italic text-green-50">"{farmer.achievement}"</p>
                              </div>
                              
                              {user && (
                                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button 
                                          onClick={() => openEditFarmerModal(farmer)}
                                          className="p-1.5 bg-white text-[#2E7D32] rounded-full hover:bg-[#FBC02D] shadow-sm"
                                          title="Edit"
                                      >
                                          <Edit size={14} />
                                      </button>
                                      <button 
                                          onClick={() => onDeleteFarmer(farmer.id)}
                                          className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm"
                                          title="Delete"
                                      >
                                          <Trash2 size={14} />
                                      </button>
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {/* --- MODALS --- */}

      {/* Add Market Rate Modal */}
      {isMarketModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg text-[#2E7D32]">Add Market Rate</h3>
                      <button onClick={() => setIsMarketModalOpen(false)}><X className="text-slate-400" /></button>
                  </div>
                  <form onSubmit={handleMarketSubmit} className="space-y-3">
                      <input type="text" placeholder="Crop Name (e.g. Cotton)" className="w-full border p-2 rounded-lg" value={newMarketRate.crop} onChange={e => setNewMarketRate({...newMarketRate, crop: e.target.value})} required />
                      <input type="text" placeholder="Market Name (e.g. Akola)" className="w-full border p-2 rounded-lg" value={newMarketRate.market} onChange={e => setNewMarketRate({...newMarketRate, market: e.target.value})} required />
                      <input type="text" placeholder="Price (e.g. ₹7,000)" className="w-full border p-2 rounded-lg" value={newMarketRate.price} onChange={e => setNewMarketRate({...newMarketRate, price: e.target.value})} required />
                      <div className="grid grid-cols-2 gap-2">
                         <input type="text" placeholder="Trend (e.g. +1.5%)" className="w-full border p-2 rounded-lg" value={newMarketRate.trend} onChange={e => setNewMarketRate({...newMarketRate, trend: e.target.value})} />
                         <input type="text" placeholder="Date (e.g. Today)" className="w-full border p-2 rounded-lg" value={newMarketRate.date} onChange={e => setNewMarketRate({...newMarketRate, date: e.target.value})} />
                      </div>
                      <button type="submit" className="w-full bg-[#2E7D32] text-white py-2.5 rounded-lg font-bold">Add Rate</button>
                  </form>
              </div>
          </div>
      )}

      {/* Add Bullion Rate Modal */}
      {isBullionModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg text-[#FBC02D]">Add Bullion Rate</h3>
                      <button onClick={() => setIsBullionModalOpen(false)}><X className="text-slate-400" /></button>
                  </div>
                  <form onSubmit={handleBullionSubmit} className="space-y-3">
                      <input type="text" placeholder="Metal (e.g. Gold 24K)" className="w-full border p-2 rounded-lg" value={newBullionRate.metal} onChange={e => setNewBullionRate({...newBullionRate, metal: e.target.value})} required />
                      <input type="text" placeholder="Price (e.g. ₹72,000)" className="w-full border p-2 rounded-lg" value={newBullionRate.price} onChange={e => setNewBullionRate({...newBullionRate, price: e.target.value})} required />
                      <div className="grid grid-cols-2 gap-2">
                         <input type="text" placeholder="Trend (e.g. +0.5%)" className="w-full border p-2 rounded-lg" value={newBullionRate.trend} onChange={e => setNewBullionRate({...newBullionRate, trend: e.target.value})} />
                         <input type="text" placeholder="Date" className="w-full border p-2 rounded-lg" value={newBullionRate.date} onChange={e => setNewBullionRate({...newBullionRate, date: e.target.value})} />
                      </div>
                      <button type="submit" className="w-full bg-[#FBC02D] text-[#1B5E20] py-2.5 rounded-lg font-bold">Add Rate</button>
                  </form>
              </div>
          </div>
      )}

      {/* Add/Edit Farmer Modal */}
      {isFarmerModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg text-[#2E7D32]">{isEditingFarmer ? 'Edit Farmer' : 'Add Farmer of the Year'}</h3>
                      <button onClick={() => setIsFarmerModalOpen(false)}><X className="text-slate-400" /></button>
                  </div>
                  <form onSubmit={handleFarmerSubmit} className="space-y-4">
                      
                      {/* Image Upload */}
                      <div className="flex justify-center mb-4">
                          <div className="relative w-24 h-24 group cursor-pointer">
                              <img 
                                  src={currentFarmer.image || "https://via.placeholder.com/150"} 
                                  alt="Farmer" 
                                  className="w-full h-full rounded-full object-cover border-4 border-slate-100" 
                              />
                              <label htmlFor="farmer-img-upload" className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                  <Camera className="text-white" size={24} />
                              </label>
                              <input 
                                  id="farmer-img-upload" 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={handleFarmerImageUpload} 
                              />
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                          <input type="text" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-[#2E7D32] outline-none" value={currentFarmer.name} onChange={e => setCurrentFarmer({...currentFarmer, name: e.target.value})} required />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                              <input type="text" className="w-full border p-2.5 rounded-lg outline-none" value={currentFarmer.location} onChange={e => setCurrentFarmer({...currentFarmer, location: e.target.value})} required />
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                              <input type="text" className="w-full border p-2.5 rounded-lg outline-none" value={currentFarmer.year} onChange={e => setCurrentFarmer({...currentFarmer, year: e.target.value})} required />
                           </div>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Achievement</label>
                          <textarea rows={3} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-[#2E7D32] outline-none" value={currentFarmer.achievement} onChange={e => setCurrentFarmer({...currentFarmer, achievement: e.target.value})} required placeholder="Describe their success..." />
                      </div>

                      <button type="submit" className="w-full bg-[#2E7D32] text-white py-3 rounded-lg font-bold hover:bg-[#1B5E20] transition-colors">
                          {isEditingFarmer ? 'Update Farmer' : 'Add Farmer'}
                      </button>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
};

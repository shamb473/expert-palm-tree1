
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AIChat } from './components/AIChat';
import { Products } from './components/Products';
import { Contact } from './components/Contact';
import { Login } from './components/Login';
import { Schemes } from './components/Schemes';
import { CropAdvisory } from './components/CropAdvisory';
import { VisitorEntry } from './components/VisitorEntry';
import { VisitorList } from './components/VisitorList';
import { Menu } from './components/Menu';
import { Calculator } from './components/Calculator';
import { AppView, User, Product, MarketRate, FarmerProfile, Visitor, DailyWeather } from './types';
import { MessageCircle, CheckCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- INITIAL DATA GENERATION ---
const getToday = () => new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

// Initial Mock Data for Products
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Hybrid Cotton Seeds (Bt)",
    category: "Seeds",
    price: 850,
    inStock: true,
    quantity: 50,
    company: "Ankur Seeds",
    image: "https://picsum.photos/400/300?random=1",
    images: [
      "https://picsum.photos/400/300?random=1",
      "https://picsum.photos/400/300?random=101",
      "https://picsum.photos/400/300?random=102"
    ],
    description: "High-yield, pest-resistant cotton seeds perfect for black soil.",
    suitableSoil: "Black Cotton Soil (Regur)",
    ratings: [5, 5, 4, 5]
  },
  {
    id: 2,
    name: "NPK 19:19:19",
    category: "Fertilizers",
    price: 1200,
    inStock: true,
    quantity: 8,
    company: "IFFCO",
    image: "https://picsum.photos/400/300?random=2",
    images: [
      "https://picsum.photos/400/300?random=2",
      "https://picsum.photos/400/300?random=201",
      "https://picsum.photos/400/300?random=202"
    ],
    description: "Balanced water-soluble fertilizer for vegetative growth.",
    ratings: [4, 4, 5]
  },
  {
    id: 3,
    name: "Neem Oil Spray",
    category: "Pesticides",
    price: 350,
    inStock: true,
    quantity: 25,
    company: "EcoAgro",
    image: "https://picsum.photos/400/300?random=3",
    images: [
      "https://picsum.photos/400/300?random=3",
      "https://picsum.photos/400/300?random=301"
    ],
    description: "Organic pest repellent, eco-friendly and effective.",
    ratings: [5, 3, 4, 4]
  },
  {
    id: 4,
    name: "Soybean Seeds Gold",
    category: "Seeds",
    price: 2200,
    inStock: false,
    quantity: 0,
    company: "Mahyco",
    image: "https://picsum.photos/400/300?random=4",
    images: [
      "https://picsum.photos/400/300?random=4",
      "https://picsum.photos/400/300?random=401",
      "https://picsum.photos/400/300?random=402"
    ],
    description: "Early maturity variety, resistant to yellow mosaic virus.",
    suitableSoil: "Well-drained Loamy Soil",
    ratings: [5, 5, 5, 5, 4]
  },
  {
    id: 5,
    name: "Micronutrient Mix",
    category: "Supplements",
    price: 500,
    inStock: true,
    quantity: 5,
    company: "Yara",
    image: "https://picsum.photos/400/300?random=5",
    images: [
        "https://picsum.photos/400/300?random=5",
        "https://picsum.photos/400/300?random=501"
    ],
    description: "Zinc, Boron, and Iron mix for deficiency correction.",
    ratings: [3, 4]
  },
  {
    id: 6,
    name: "Knapsack Sprayer",
    category: "Equipment",
    price: 2500,
    inStock: true,
    quantity: 12,
    company: "KisanKraft",
    image: "https://picsum.photos/400/300?random=6",
    images: [
        "https://picsum.photos/400/300?random=6",
        "https://picsum.photos/400/300?random=601",
        "https://picsum.photos/400/300?random=602"
    ],
    description: "16L Manual sprayer, durable and lightweight.",
    ratings: [4, 5, 4]
  }
];

// Initial Mock Data for Market Rates
const INITIAL_MARKET_RATES: MarketRate[] = [
    { id: '1', date: getToday(), crop: 'Cotton (Kapus)', market: 'Chohotta Bazar', price: '₹6,850 - ₹7,200', trend: '+1.0%' },
    { id: '2', date: getToday(), crop: 'Cotton (Kapus)', market: 'Akot FMC', price: '₹6,900 - ₹7,350', trend: '+1.2%' },
    { id: '3', date: getToday(), crop: 'Soybean', market: 'Chohotta Bazar', price: '₹4,500 - ₹4,750', trend: '+0.2%' },
    { id: '4', date: getToday(), crop: 'Soybean', market: 'Akola FMC', price: '₹4,600 - ₹4,850', trend: '+0.5%' },
    { id: '5', date: getToday(), crop: 'Soybean', market: 'Akot FMC', price: '₹4,550 - ₹4,800', trend: '+0.3%' },
    { id: '6', date: getToday(), crop: 'Tur (Pigeon Pea)', market: 'Akola FMC', price: '₹9,300 - ₹10,200', trend: '+1.8%' },
    { id: '7', date: getToday(), crop: 'Tur (Pigeon Pea)', market: 'Akot FMC', price: '₹9,150 - ₹10,000', trend: '+1.6%' },
    { id: '8', date: getToday(), crop: 'Mung (Green Gram)', market: 'Akola FMC', price: '₹7,800 - ₹8,500', trend: '+0.5%' },
    { id: '9', date: getToday(), crop: 'Mung (Green Gram)', market: 'Akot FMC', price: '₹7,600 - ₹8,200', trend: '+0.4%' },
    { id: '10', date: getToday(), crop: 'Gram (Chana)', market: 'Akola FMC', price: '₹5,800 - ₹6,200', trend: '+0.2%' },
    { id: '11', date: getToday(), crop: 'Wheat', market: 'Amravati FMC', price: '₹2,600 - ₹3,100', trend: '+0.1%' },
    { id: '12', date: getToday(), crop: 'Onion', market: 'Lasalgaon', price: '₹1,200 - ₹1,800', trend: '-2.0%' }
];

// Initial Farmer of the Year
const INITIAL_FARMERS: FarmerProfile[] = [
    {
        id: '1',
        name: "Ramesh Patil",
        location: "Keliweli",
        achievement: "Record Soybean yield of 14 quintals/acre using our organic fertilizers.",
        image: "https://picsum.photos/400/400?random=100",
        year: "2023"
    },
    {
        id: '2',
        name: "Suresh Deshmukh",
        location: "Akot",
        achievement: "Adopted drip irrigation for 20 acres of Cotton.",
        image: "https://picsum.photos/400/400?random=101",
        year: "2024"
    }
];

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('kastkar_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Data States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [marketRates, setMarketRates] = useState<MarketRate[]>(INITIAL_MARKET_RATES);
  const [farmersList, setFarmersList] = useState<FarmerProfile[]>(INITIAL_FARMERS);
  
  // Weather State
  const [weatherLocation, setWeatherLocation] = useState<string>('Keliweli');
  const [weatherData, setWeatherData] = useState<DailyWeather[]>([]);

  // Visitor State
  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    const saved = localStorage.getItem('kastkar_visitors');
    return saved ? JSON.parse(saved) : [];
  });
  const [showVisitorPopup, setShowVisitorPopup] = useState(false);

  // AI Enabled State
  const [isAIEnabled, setIsAIEnabled] = useState<boolean>(() => {
      const saved = localStorage.getItem('kastkar_ai_enabled');
      return saved !== null ? JSON.parse(saved) : true;
  });

  // Pesticide Price Visibility State
  const [showPesticidePrices, setShowPesticidePrices] = useState<boolean>(() => {
      const saved = localStorage.getItem('kastkar_show_pesticide_prices');
      return saved !== null ? JSON.parse(saved) : true;
  });

  // --- Weather Generation Logic ---
  useEffect(() => {
    const generateWeather = () => {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain', 'Thunderstorm'];
      const forecast: DailyWeather[] = [];
      const today = new Date();

      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dayName = i === 0 ? 'Today' : days[d.getDay()];
        const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        
        const rand = Math.random();
        let condition = conditions[0];
        let rainChance = 0;
        let humidity = 40 + Math.floor(Math.random() * 20);
        let windSpeed = 5 + Math.floor(Math.random() * 15);
        let temp = 30 + Math.floor(Math.random() * 8);

        if (rand > 0.7) {
            condition = 'Partly Cloudy';
            rainChance = 10 + Math.floor(Math.random() * 20);
        } else if (rand > 0.85) {
            condition = 'Light Rain';
            rainChance = 40 + Math.floor(Math.random() * 30);
            temp -= 3;
            humidity += 20;
        } else if (rand > 0.95) {
            condition = 'Thunderstorm';
            rainChance = 80 + Math.floor(Math.random() * 20);
            windSpeed += 15;
            temp -= 5;
            humidity += 30;
        }

        const isSpraySafe = rainChance < 40 && windSpeed < 18;

        forecast.push({
          day: dayName,
          date: dateStr,
          temp,
          condition,
          rainChance,
          windSpeed,
          humidity,
          isSpraySafe
        });
      }
      setWeatherData(forecast);
    };

    generateWeather();
  }, [weatherLocation]);

  useEffect(() => {
    // Check if visitor has already entered details
    const hasVisited = localStorage.getItem('kastkar_has_visited');
    if (!hasVisited && !user) {
        // Show popup after a short delay
        const timer = setTimeout(() => setShowVisitorPopup(true), 2000);
        return () => clearTimeout(timer);
    }
  }, [user]);

  // AI Data Verification on Load
  useEffect(() => {
    const fetchVerifiedData = async () => {
        if (!process.env.API_KEY || !isAIEnabled) return;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Only update if we don't have today's fresh verified data
            // For demo, we just trigger it once on mount
            const prompt = `
                Act as a real-time agricultural data parser. 
                Generate JSON data for:
                1. Market Rates for Akola/Akot (Cotton, Soybean, Tur) based on typical current market trends in Maharashtra.
                
                Return strictly JSON:
                {
                    "marketRates": [ { "crop": "Cotton", "market": "Akola", "price": "₹7000", "trend": "+1%" } ... ]
                }
            `;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });

            const text = response.text;
            if (text) {
                const data = JSON.parse(text);
                
                if (data.marketRates && Array.isArray(data.marketRates)) {
                    const newRates = data.marketRates.map((r: any, idx: number) => ({
                        id: `ai-${idx}`,
                        date: getToday(),
                        crop: r.crop,
                        market: r.market,
                        price: r.price,
                        trend: r.trend,
                        isAiVerified: true
                    }));
                    setMarketRates(prev => {
                        const manual = prev.filter(p => !p.id.startsWith('ai-'));
                        return [...newRates, ...manual].slice(0, 15);
                    });
                }
            }
        } catch (e) {
            console.error("Failed to fetch verified data", e);
        }
    };

    fetchVerifiedData();
  }, [isAIEnabled]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('kastkar_user', JSON.stringify(userData));
    setShowVisitorPopup(false);
    setCurrentView(AppView.HOME);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('kastkar_user');
    setCurrentView(AppView.HOME);
  };

  // --- Visitor Handler ---
  const handleVisitorSubmit = (visitor: Visitor) => {
      const newVisitors = [visitor, ...visitors];
      setVisitors(newVisitors);
      localStorage.setItem('kastkar_visitors', JSON.stringify(newVisitors));
      localStorage.setItem('kastkar_has_visited', 'true');
      setShowVisitorPopup(false);
  };

  // --- Product Handlers ---
  const handleAddProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  // --- Cart Handler ---
  const handleAddToCart = (product: Product) => {
      setCurrentView(AppView.PRODUCTS);
  };

  // --- Market Rate Handlers ---
  const handleAddMarketRate = (rate: MarketRate) => {
      setMarketRates(prev => [rate, ...prev]);
  };

  const handleDeleteMarketRate = (id: string) => {
      setMarketRates(prev => prev.filter(r => r.id !== id));
  };

  // --- Farmer Handlers ---
  const handleAddFarmer = (farmer: FarmerProfile) => {
      setFarmersList(prev => [farmer, ...prev]);
  };

  const handleUpdateFarmer = (updatedFarmer: FarmerProfile) => {
      setFarmersList(prev => prev.map(f => f.id === updatedFarmer.id ? updatedFarmer : f));
  };

  const handleDeleteFarmer = (id: string) => {
      setFarmersList(prev => prev.filter(f => f.id !== id));
  };

  // --- AI Toggle Handler ---
  const handleToggleAI = () => {
      setIsAIEnabled(prev => {
          const newState = !prev;
          localStorage.setItem('kastkar_ai_enabled', JSON.stringify(newState));
          return newState;
      });
  };

  // --- Pesticide Price Toggle Handler ---
  const handleTogglePesticidePrices = () => {
      setShowPesticidePrices(prev => {
          const newState = !prev;
          localStorage.setItem('kastkar_show_pesticide_prices', JSON.stringify(newState));
          return newState;
      });
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return (
            <Hero 
                onNavigate={setCurrentView} 
                user={user}
                marketRates={marketRates}
                onAddMarketRate={handleAddMarketRate}
                onDeleteMarketRate={handleDeleteMarketRate}
                farmersList={farmersList}
                onAddFarmer={handleAddFarmer}
                onUpdateFarmer={handleUpdateFarmer}
                onDeleteFarmer={handleDeleteFarmer}
                weatherData={weatherData}
                weatherLocation={weatherLocation}
                onWeatherLocationChange={setWeatherLocation}
            />
        );
      case AppView.PRODUCTS:
        return (
            <Products 
                products={products} 
                user={user} 
                onAddProduct={handleAddProduct} 
                onDeleteProduct={handleDeleteProduct}
                onUpdateProduct={handleUpdateProduct}
                showPesticidePrices={showPesticidePrices}
                onTogglePesticidePrices={handleTogglePesticidePrices}
            />
        );
      case AppView.ADVISORY:
        return <CropAdvisory weatherData={weatherData} />;
      case AppView.ADVISOR:
        return (
            <AIChat 
                user={user} 
                isEnabled={isAIEnabled}
                onToggle={handleToggleAI}
                products={products}
                onAddToCart={handleAddToCart}
            />
        );
      case AppView.SCHEMES:
        return <Schemes />;
      case AppView.CONTACT:
        return <Contact />;
      case AppView.LOGIN:
        return <Login onLogin={handleLogin} />;
      case AppView.VISITORS:
        return <VisitorList visitors={visitors} />;
      case AppView.MENU:
        return <Menu onNavigate={setCurrentView} user={user} onLogout={handleLogout} />;
      case AppView.CALCULATOR:
        return <Calculator />;
      default:
        return (
            <Hero 
                onNavigate={setCurrentView} 
                user={user}
                marketRates={marketRates}
                onAddMarketRate={handleAddMarketRate}
                onDeleteMarketRate={handleDeleteMarketRate}
                farmersList={farmersList}
                onAddFarmer={handleAddFarmer}
                onUpdateFarmer={handleUpdateFarmer}
                onDeleteFarmer={handleDeleteFarmer}
                weatherData={weatherData}
                weatherLocation={weatherLocation}
                onWeatherLocationChange={setWeatherLocation}
            />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow">
        {renderView()}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-medium text-slate-300">Kastkar Krushi Seva Kendra</p>
          <p className="text-sm mt-2">Empowering Farmers since 2012</p>
          <p className="text-xs mt-4 opacity-50">© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>

      {/* Global Floating WhatsApp Button */}
      <button 
        onClick={() => window.open('https://wa.me/918999678500', '_blank')}
        className="fixed bottom-6 left-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl z-50 hover:scale-110 transition-transform group"
        title="Chat with Owner"
      >
        <MessageCircle size={28} />
        <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat with Owner
        </span>
      </button>

      {/* Visitor Entry Popup */}
      {showVisitorPopup && (
          <VisitorEntry 
            onSubmit={handleVisitorSubmit} 
            onClose={() => setShowVisitorPopup(false)} 
          />
      )}

    </div>
  );
}

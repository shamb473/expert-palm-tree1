
import React, { useState, useEffect } from 'react';
import { CropGuide, DailyWeather } from '../types';
import { 
    Sprout, Droplets, Bug, TrendingUp, Calendar, AlertTriangle, 
    ClipboardList, Check, Bell, BellRing, Beaker, Tractor, Info, Sun, CloudRain, Wind, Thermometer
} from 'lucide-react';

interface CropAdvisoryProps {
    weatherData: DailyWeather[];
}

const CROP_DATA: CropGuide[] = [
    {
        id: 'cotton',
        name: 'Cotton (Kapus)',
        scientificName: 'Gossypium',
        image: 'https://picsum.photos/800/400?random=20',
        preparation: [
            'Deep ploughing (20-25 cm) immediately after harvest of previous crop.',
            'Apply 10-15 cartloads of FYM/Compost per hectare before last harrowing.',
            'Soil solarization in May to control soil-borne pests.'
        ],
        sowing: {
            period: 'June 15 - July 15 (After 75-100mm rain)',
            method: 'Dibbling method (Topography dependent)',
            seedRate: '2 Packet (900g) Bt Cotton per Acre'
        },
        fertilizer: [
            {
                stage: 'Basal Dose (At Sowing)',
                timing: '0 Days',
                activities: ['DAP: 50kg/acre', 'Potash: 25kg/acre']
            },
            {
                stage: 'First Top Dressing',
                timing: '30-35 Days',
                activities: ['Urea: 25kg/acre', 'Magnesium Sulphate: 10kg/acre']
            },
            {
                stage: 'Second Top Dressing',
                timing: '60-65 Days',
                activities: ['Urea: 25kg/acre', '19:19:19 Spray']
            }
        ],
        spraying: [
            {
                stage: 'Sucking Pests (Aphids/Jassids)',
                timing: '25-30 Days',
                activities: ['Imidacloprid 17.8 SL (0.5ml/L) OR', 'Acetamiprid 20 SP (0.2g/L)']
            },
            {
                stage: 'Bollworm Prevention',
                timing: '60-70 Days',
                activities: ['Profenophos 50 EC (2ml/L)', 'Neem Oil 10000 ppm (2ml/L)']
            }
        ],
        diseases: [
            {
                name: 'Pink Bollworm',
                symptoms: 'Rosette flowers, exit holes in bolls, stained lint.',
                solution: 'Install Pheromone traps (5/acre). Spray Emamectin Benzoate.'
            },
            {
                name: 'Leaf Reddening',
                symptoms: 'Leaves turn red or purple, plant growth stunted.',
                solution: 'Spray Magnesium Sulphate 1% + Urea 1%.'
            }
        ],
        irrigation: [
            'Critical stages: Square formation, Flowering, Boll development.',
            'Maintain adequate moisture but avoid waterlogging.',
            'Drip irrigation increases yield by 20-30%.'
        ],
        yieldEstimate: '8 - 12 Quintals/Acre'
    },
    {
        id: 'soybean',
        name: 'Soybean',
        scientificName: 'Glycine max',
        image: 'https://picsum.photos/800/400?random=21',
        preparation: [
            'One deep ploughing followed by two harrowings.',
            'Prepare seed bed with good drainage to avoid waterlogging.'
        ],
        sowing: {
            period: 'June 20 - July 10 (On sufficient moisture)',
            method: 'Broad Bed Furrow (BBF) recommended',
            seedRate: '25-30 kg per Acre'
        },
        fertilizer: [
            {
                stage: 'Basal Dose',
                timing: 'At Sowing',
                activities: ['DAP: 50kg/acre', 'Sulphur: 10kg/acre']
            },
            {
                stage: 'Flowering Stage',
                timing: '35-40 Days',
                activities: ['00:52:34 Foliar Spray (100g/pump)']
            }
        ],
        spraying: [
            {
                stage: 'Stem Fly / Girdle Beetle',
                timing: '15-20 Days',
                activities: ['Chlorantraniliprole 18.5 SC (3ml/10L)']
            },
            {
                stage: 'Defoliators',
                timing: '40-50 Days',
                activities: ['Emamectin Benzoate (4g/10L)']
            }
        ],
        diseases: [
            {
                name: 'Yellow Mosaic Virus',
                symptoms: 'Yellow patches on leaves, stunted growth.',
                solution: 'Control Whitefly vector with Thiamethoxam. Remove infected plants.'
            }
        ],
        irrigation: [
            'Critical stages: Pod initiation and Grain filling.',
            'Avoid moisture stress during flowering.'
        ],
        yieldEstimate: '8 - 10 Quintals/Acre'
    },
    {
        id: 'tur',
        name: 'Tur (Pigeon Pea)',
        scientificName: 'Cajanus cajan',
        image: 'https://picsum.photos/800/400?random=22',
        preparation: [
            'Deep ploughing to break hard pans.',
            'Apply compost 2-3 weeks before sowing.'
        ],
        sowing: {
            period: 'June 15 - July 15',
            method: 'Intercropping with Soybean/Cotton or Sole Crop',
            seedRate: '5-6 kg per Acre (Sole crop)'
        },
        fertilizer: [
            {
                stage: 'Basal Dose',
                timing: 'At Sowing',
                activities: ['DAP: 40kg/acre']
            }
        ],
        spraying: [
            {
                stage: 'Pod Borer (Helicoverpa)',
                timing: 'Flowering/Podding',
                activities: ['Indoxacarb 14.5 SC (10ml/10L)']
            }
        ],
        diseases: [
            {
                name: 'Wilt (Udhali)',
                symptoms: 'Sudden drooping of leaves, black streaks on stem.',
                solution: 'Seed treatment with Trichoderma. Avoid water stagnation.'
            }
        ],
        irrigation: [
            'One irrigation at branching and one at pod filling increases yield.',
        ],
        yieldEstimate: '6 - 8 Quintals/Acre'
    },
    {
        id: 'wheat',
        name: 'Wheat (Gahu)',
        scientificName: 'Triticum',
        image: 'https://picsum.photos/800/400?random=23',
        preparation: [
            'Pre-sowing irrigation (Palewa) is necessary.',
            'Fine seed bed required.'
        ],
        sowing: {
            period: 'Nov 1 - Nov 15 (Timely sown)',
            method: 'Seed Drill',
            seedRate: '40 kg per Acre'
        },
        fertilizer: [
            {
                stage: 'Basal Dose',
                timing: 'At Sowing',
                activities: ['N:P:K 12:32:16 (50kg/acre)']
            },
            {
                stage: 'Top Dressing',
                timing: '21 Days (CRI Stage)',
                activities: ['Urea: 30kg/acre']
            }
        ],
        spraying: [
            {
                stage: 'Aphids/Termites',
                timing: 'As required',
                activities: ['Chlorpyriphos 20 EC']
            }
        ],
        diseases: [
            {
                name: 'Rust (Tambera)',
                symptoms: 'Brown/Yellow pustules on leaves.',
                solution: 'Spray Propiconazole 25 EC (1ml/L).'
            }
        ],
        irrigation: [
            'Critical: CRI Stage (21 days), Tillering (40-45 days), Flowering (60-65 days).',
        ],
        yieldEstimate: '15 - 18 Quintals/Acre'
    }
];

export const CropAdvisory: React.FC<CropAdvisoryProps> = ({ weatherData }) => {
    const [selectedCropId, setSelectedCropId] = useState<string>('cotton');
    const [activeTab, setActiveTab] = useState<string>('sowing');
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [weatherAlert, setWeatherAlert] = useState<{type: 'warning' | 'danger' | 'success', message: string} | null>(null);

    const selectedCrop = CROP_DATA.find(c => c.id === selectedCropId) || CROP_DATA[0];
    const currentWeather = weatherData[0];

    // Weather Analysis Logic
    useEffect(() => {
        if (!currentWeather) return;

        let alert = null;

        if (activeTab === 'spraying') {
            if (currentWeather.windSpeed > 15) {
                alert = { type: 'danger', message: `High wind speed (${currentWeather.windSpeed} km/h). Avoid spraying today to prevent drift.` };
            } else if (currentWeather.rainChance > 40) {
                alert = { type: 'danger', message: `Rain forecast (${currentWeather.rainChance}%). Spraying might be washed off.` };
            } else {
                alert = { type: 'success', message: `Weather is suitable for spraying.` };
            }
        } else if (activeTab === 'sowing') {
            if (currentWeather.rainChance > 70) {
                alert = { type: 'warning', message: `Heavy rain expected. Delay sowing to avoid seed washout.` };
            } else if (currentWeather.temp > 40) {
                alert = { type: 'warning', message: `High temperature (${currentWeather.temp}°C). Ensure soil moisture before sowing.` };
            } else if (currentWeather.temp < 15) {
                alert = { type: 'warning', message: `Low temperature (${currentWeather.temp}°C). Germination might be delayed.` };
            } else {
                 alert = { type: 'success', message: `Conditions are favorable for sowing.` };
            }
        } else if (activeTab === 'diseases') {
            if (currentWeather.humidity > 80 && currentWeather.temp > 25) {
                alert = { type: 'danger', message: `High humidity & temp detected. High risk of fungal attacks like Rust or Blight.` };
            } else if (currentWeather.condition.includes('Cloudy')) {
                alert = { type: 'warning', message: `Cloudy weather promotes pest attacks (like Bollworm/Caterpillars). Monitor closely.` };
            }
        } else if (activeTab === 'irrigation') {
            if (currentWeather.rainChance > 50) {
                alert = { type: 'success', message: `Rain expected. You can skip irrigation today to save water.` };
            } else if (currentWeather.temp > 38) {
                alert = { type: 'warning', message: `High heat stress. Ensure critical stage irrigation.` };
            }
        }

        setWeatherAlert(alert as any);

    }, [activeTab, currentWeather, selectedCropId]);


    const renderTabContent = () => {
        switch (activeTab) {
            case 'prep':
                return (
                    <ul className="space-y-3">
                        {selectedCrop.preparation.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg">
                                <Tractor className="text-orange-600 mt-1 shrink-0" size={20} />
                                <span className="text-slate-700">{step}</span>
                            </li>
                        ))}
                    </ul>
                );
            case 'sowing':
                return (
                    <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                            <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2"><Calendar size={18}/> Sowing Period</h4>
                            <p className="text-green-800">{selectedCrop.sowing.period}</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white border p-4 rounded-xl">
                                <h4 className="font-bold text-slate-700 mb-1">Seed Rate</h4>
                                <p className="text-slate-600">{selectedCrop.sowing.seedRate}</p>
                            </div>
                            <div className="bg-white border p-4 rounded-xl">
                                <h4 className="font-bold text-slate-700 mb-1">Method</h4>
                                <p className="text-slate-600">{selectedCrop.sowing.method}</p>
                            </div>
                        </div>
                    </div>
                );
            case 'fertilizer':
                return (
                    <div className="space-y-4">
                        {selectedCrop.fertilizer.map((dose, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-[#2E7D32]">{dose.stage}</h4>
                                    <span className="text-xs bg-slate-100 px-2 py-1 rounded font-bold text-slate-500">{dose.timing}</span>
                                </div>
                                <ul className="space-y-1">
                                    {dose.activities.map((act, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                            <Beaker size={14} className="text-purple-500" /> {act}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                );
            case 'spraying':
                return (
                    <div className="space-y-4">
                         {selectedCrop.spraying.map((spray, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
                                <div className="relative z-10">
                                    <h4 className="font-bold text-slate-800 mb-1">{spray.stage}</h4>
                                    <p className="text-xs text-slate-400 mb-3 font-bold uppercase">{spray.timing}</p>
                                    <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                                        {spray.activities.map((act, i) => (
                                            <p key={i} className="flex items-center gap-2 text-sm text-red-900 font-medium">
                                                <Bug size={14} /> {act}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
             case 'diseases':
                return (
                    <div className="space-y-4">
                        {selectedCrop.diseases.map((dis, idx) => (
                            <div key={idx} className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                                <h4 className="font-bold text-orange-900 text-lg mb-2">{dis.name}</h4>
                                <div className="space-y-2 text-sm">
                                    <p><strong className="text-orange-800">Symptoms:</strong> {dis.symptoms}</p>
                                    <p><strong className="text-green-800">Solution:</strong> {dis.solution}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                );
             case 'irrigation':
                return (
                    <ul className="space-y-3">
                        {selectedCrop.irrigation.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                <Droplets className="text-blue-500 mt-1 shrink-0" size={20} />
                                <span className="text-slate-700">{step}</span>
                            </li>
                        ))}
                    </ul>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <ClipboardList className="text-[#2E7D32]" size={32} />
                        Crop Advisory
                    </h2>
                    <p className="text-slate-600 mt-1">Stage-wise expert guidance for maximum yield.</p>
                </div>
                
                <button 
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
                        notificationsEnabled 
                        ? 'bg-[#2E7D32] text-white shadow-lg' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    {notificationsEnabled ? <BellRing size={18} /> : <Bell size={18} />}
                    {notificationsEnabled ? 'Weekly Alerts On' : 'Enable Weekly Alerts'}
                </button>
            </div>

            {/* Crop Selector */}
            <div className="flex gap-4 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                {CROP_DATA.map((crop) => (
                    <button
                        key={crop.id}
                        onClick={() => setSelectedCropId(crop.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap font-bold transition-all ${
                            selectedCropId === crop.id 
                            ? 'bg-[#2E7D32] text-white shadow-md transform scale-105' 
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-green-50'
                        }`}
                    >
                        <Sprout size={18} />
                        {crop.name}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
                
                {/* Left: Image & Stats */}
                <div className="lg:w-1/3 bg-slate-50 p-6 border-r border-slate-100">
                    <img 
                        src={selectedCrop.image} 
                        alt={selectedCrop.name} 
                        className="w-full h-56 object-cover rounded-2xl shadow-sm mb-6" 
                    />
                    <h3 className="text-2xl font-bold text-slate-800 mb-1">{selectedCrop.name}</h3>
                    <p className="text-slate-500 italic mb-6">{selectedCrop.scientificName}</p>
                    
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mb-6">
                        <h4 className="font-bold text-yellow-800 flex items-center gap-2 mb-2">
                            <TrendingUp size={18} /> Est. Yield
                        </h4>
                        <p className="text-slate-800 font-bold text-lg">{selectedCrop.yieldEstimate}</p>
                    </div>

                    <div className="text-xs text-slate-400">
                        <p className="flex items-center gap-1 mb-1"><Info size={12}/> Based on Vidarbha region data.</p>
                        <p>Updated for Season 2024-25</p>
                    </div>
                </div>

                {/* Right: Advisory Tabs */}
                <div className="lg:w-2/3 flex flex-col">
                    {/* Tabs */}
                    <div className="flex overflow-x-auto border-b border-slate-100">
                        {[
                            { id: 'prep', label: 'Preparation', icon: <Tractor size={16}/> },
                            { id: 'sowing', label: 'Sowing', icon: <Sprout size={16}/> },
                            { id: 'fertilizer', label: 'Fertilizers', icon: <Beaker size={16}/> },
                            { id: 'spraying', label: 'Spraying', icon: <Bug size={16}/> },
                            { id: 'diseases', label: 'Diseases', icon: <AlertTriangle size={16}/> },
                            { id: 'irrigation', label: 'Irrigation', icon: <Droplets size={16}/> },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 min-w-[100px] flex flex-col items-center justify-center p-4 gap-1 text-xs font-bold transition-colors ${
                                    activeTab === tab.id 
                                    ? 'text-[#2E7D32] border-b-2 border-[#2E7D32] bg-green-50/50' 
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Alert Banner (Weather Integrated) */}
                    {weatherAlert && (
                        <div className={`m-6 mb-0 p-4 rounded-xl flex items-start gap-3 border animate-in fade-in slide-in-from-top-2 ${
                            weatherAlert.type === 'danger' ? 'bg-red-50 border-red-200 text-red-900' :
                            weatherAlert.type === 'warning' ? 'bg-orange-50 border-orange-200 text-orange-900' :
                            'bg-green-50 border-green-200 text-green-900'
                        }`}>
                            {weatherAlert.type === 'danger' ? <AlertTriangle className="shrink-0 mt-0.5" /> : 
                             weatherAlert.type === 'warning' ? <AlertTriangle className="shrink-0 mt-0.5" /> : 
                             <Check className="shrink-0 mt-0.5" />}
                            <div>
                                <h4 className="font-bold text-sm">Crop-Weather Insight</h4>
                                <p className="text-sm">{weatherAlert.message}</p>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex-1 overflow-y-auto max-h-[600px]">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

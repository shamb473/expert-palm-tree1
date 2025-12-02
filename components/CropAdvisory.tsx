
import React, { useState, useEffect } from 'react';
import { CropGuide, DailyWeather } from '../types';
import { 
    Sprout, Droplets, Bug, TrendingUp, Calendar, AlertTriangle, 
    ClipboardList, Check, Bell, BellRing, Beaker, Tractor, Info, Sun, CloudRain
} from 'lucide-react';

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
            'Avoid water logging during seedling stage.',
            'Drip irrigation increases yield by 25-30%.'
        ],
        yieldEstimate: '8 - 12 Quintals per Acre (with good management)'
    },
    {
        id: 'soybean',
        name: 'Soybean',
        scientificName: 'Glycine max',
        image: 'https://picsum.photos/800/400?random=21',
        preparation: [
            'One deep ploughing followed by 2-3 harrowings.',
            'Prepare seed bed with good drainage.',
            'Seed treatment with Rhizobium and PSB culture is mandatory.'
        ],
        sowing: {
            period: 'June 20 - July 10',
            method: 'Drilling or BBF (Broad Bed Furrow) method',
            seedRate: '25-30 kg per Acre'
        },
        fertilizer: [
            {
                stage: 'Basal Dose',
                timing: 'At Sowing',
                activities: ['DAP: 50kg/acre', 'Sulphur: 10kg/acre (Crucial for oil content)']
            }
        ],
        spraying: [
            {
                stage: 'Weed Control',
                timing: '0-3 Days (Pre-emergence)',
                activities: ['Pendimethalin 30 EC']
            },
            {
                stage: 'Stem Fly / Girdle Beetle',
                timing: '20-25 Days',
                activities: ['Chlorantraniliprole 18.5 SC']
            }
        ],
        diseases: [
            {
                name: 'Yellow Mosaic Virus',
                symptoms: 'Yellow irregular patches on leaves.',
                solution: 'Control Whitefly vector. Remove infected plants. Spray Thiamethoxam.'
            }
        ],
        irrigation: [
            'Critical stages: Pod initiation and Grain filling.',
            'Moisture stress at pod filling drastically reduces yield.',
            'Avoid water stagnation.'
        ],
        yieldEstimate: '8 - 10 Quintals per Acre'
    },
    {
        id: 'tur',
        name: 'Tur (Pigeon Pea)',
        scientificName: 'Cajanus cajan',
        image: 'https://picsum.photos/800/400?random=22',
        preparation: [
            'Deep ploughing to break hard pans.',
            'Often intercropped with Soybean or Cotton.'
        ],
        sowing: {
            period: 'June - July',
            method: 'Dibbling',
            seedRate: '4-5 kg per Acre (Sole crop)'
        },
        fertilizer: [
            {
                stage: 'Basal',
                timing: 'At Sowing',
                activities: ['DAP: 40kg/acre', 'Zinc Sulphate: 5kg/acre']
            }
        ],
        spraying: [
            {
                stage: 'Pod Borer',
                timing: 'Flowering Stage',
                activities: ['Indoxacarb 14.5 SC']
            }
        ],
        diseases: [
            {
                name: 'Wilt (Ukhata)',
                symptoms: 'Yellowing and drying of leaves, internal vascular browning.',
                solution: 'Use resistant varieties (BSMR-736). Seed treatment with Trichoderma.'
            }
        ],
        irrigation: [
            'Branching, Flowering and Pod filling stages are critical.',
            'Requires less water but sensitive to water logging.'
        ],
        yieldEstimate: '6 - 8 Quintals per Acre'
    },
    {
        id: 'wheat',
        name: 'Wheat',
        scientificName: 'Triticum',
        image: 'https://picsum.photos/800/400?random=23',
        preparation: [
            'Pre-sowing irrigation (Palewa) is necessary.',
            '2-3 harrowings to create fine tilth.'
        ],
        sowing: {
            period: 'Nov 1 - Nov 15 (Timely), up to Dec 10 (Late)',
            method: 'Seed Drill',
            seedRate: '40 kg per Acre'
        },
        fertilizer: [
            {
                stage: 'Basal',
                timing: 'At Sowing',
                activities: ['NPK 12:32:16: 50kg/acre']
            },
            {
                stage: 'Top Dressing',
                timing: '21 Days (CRI Stage)',
                activities: ['Urea: 25kg/acre after irrigation']
            }
        ],
        spraying: [
            {
                stage: 'Weed Control',
                timing: '30-35 Days',
                activities: ['2,4-D or Metsulfuron']
            }
        ],
        diseases: [
            {
                name: 'Rust (Tambera)',
                symptoms: 'Orange/Yellow pustules on leaves.',
                solution: 'Propiconazole 25 EC spray.'
            }
        ],
        irrigation: [
            'Requires 4-6 irrigations.',
            'Most Critical: CRI (21 days), Tillering (40 days), Flowering (60 days).'
        ],
        yieldEstimate: '15 - 18 Quintals per Acre'
    }
];

interface CropAdvisoryProps {
    weatherData?: DailyWeather[];
}

export const CropAdvisory: React.FC<CropAdvisoryProps> = ({ weatherData }) => {
    const [selectedCropId, setSelectedCropId] = useState<string>(CROP_DATA[0].id);
    const [activeTab, setActiveTab] = useState<string>('prep');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [advisoryAlert, setAdvisoryAlert] = useState<{message: string, type: 'warning' | 'safe' | 'danger' | null}>({ message: '', type: null });

    const selectedCrop = CROP_DATA.find(c => c.id === selectedCropId) || CROP_DATA[0];
    const currentWeather = weatherData && weatherData.length > 0 ? weatherData[0] : null;

    useEffect(() => {
        if (!currentWeather) {
            setAdvisoryAlert({ message: '', type: null });
            return;
        }

        // Analyze weather against selected stage
        let message = '';
        let type: 'warning' | 'safe' | 'danger' | null = null;

        switch(activeTab) {
            case 'spray':
                if (!currentWeather.isSpraySafe) {
                    message = `⚠️ Warning: High winds (${currentWeather.windSpeed} km/h) or rain detected. Spraying is NOT recommended today.`;
                    type = 'danger';
                } else {
                    message = `✅ Weather conditions (Wind: ${currentWeather.windSpeed} km/h) are favorable for spraying.`;
                    type = 'safe';
                }
                break;
            case 'sow':
                if (currentWeather.rainChance > 60) {
                     message = `⚠️ Heavy rain forecast (${currentWeather.rainChance}%). Delay sowing to avoid seed wash-off.`;
                     type = 'warning';
                } else if (currentWeather.rainChance < 20) {
                     message = `ℹ️ Low rain chance. Ensure sufficient soil moisture before sowing.`;
                     type = 'warning';
                } else {
                     message = `✅ Good conditions for sowing.`;
                     type = 'safe';
                }
                break;
            case 'disease':
                 if (currentWeather.humidity > 80) {
                      message = `⚠️ High humidity (${currentWeather.humidity}%) significantly increases fungal disease risk. Monitor crop closely.`;
                      type = 'danger';
                 } else {
                      message = `✅ Moderate humidity. Lower risk of fungal spread today.`;
                      type = 'safe';
                 }
                 break;
            case 'irrig':
                 if (currentWeather.rainChance > 50) {
                      message = `🌧️ Rain predicted today. You may skip irrigation to save water.`;
                      type = 'safe';
                 }
                 break;
            default:
                 if (currentWeather.rainChance > 70) {
                      message = `⚠️ Heavy rain alert today. Plan farm activities accordingly.`;
                      type = 'warning';
                 }
                 break;
        }

        setAdvisoryAlert({ message, type });

    }, [activeTab, currentWeather, selectedCropId]);

    const toggleSubscription = () => {
        setIsSubscribed(!isSubscribed);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const tabs = [
        { id: 'prep', label: 'Preparation', icon: <Tractor size={18} /> },
        { id: 'sow', label: 'Sowing', icon: <Sprout size={18} /> },
        { id: 'fert', label: 'Fertilizer', icon: <Beaker size={18} /> },
        { id: 'spray', label: 'Spraying', icon: <Info size={18} /> },
        { id: 'disease', label: 'Diseases', icon: <Bug size={18} /> },
        { id: 'irrig', label: 'Irrigation', icon: <Droplets size={18} /> },
        { id: 'yield', label: 'Yield', icon: <TrendingUp size={18} /> },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
            
            {/* Header with Subscription */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <ClipboardList className="text-[#2E7D32]" size={36} />
                        Crop Advisory
                    </h2>
                    <p className="text-slate-600 mt-2">Complete guide from sowing to harvesting for Vidarbha region.</p>
                </div>
                
                <button 
                    onClick={toggleSubscription}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all shadow-md ${
                        isSubscribed 
                        ? 'bg-green-100 text-green-800 border-2 border-green-500' 
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                >
                    {isSubscribed ? <BellRing size={20} className="text-green-600" /> : <Bell size={20} />}
                    <div className="text-left">
                        <span className="block text-xs uppercase tracking-wider opacity-70">Weekly Alerts</span>
                        <span className="text-sm">{isSubscribed ? 'Subscribed' : 'Subscribe Now'}</span>
                    </div>
                </button>
            </div>

            {/* Crop Selector */}
            <div className="flex overflow-x-auto gap-4 mb-8 pb-4 scrollbar-hide">
                {CROP_DATA.map(crop => (
                    <button
                        key={crop.id}
                        onClick={() => {
                            setSelectedCropId(crop.id);
                            setActiveTab('prep');
                        }}
                        className={`flex-shrink-0 flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all min-w-[200px] ${
                            selectedCropId === crop.id
                            ? 'border-[#FBC02D] bg-[#2E7D32] text-white shadow-lg transform scale-105'
                            : 'border-slate-100 bg-white text-slate-600 hover:border-green-200'
                        }`}
                    >
                        <img src={crop.image} alt={crop.name} className="w-12 h-12 rounded-full object-cover border-2 border-white" />
                        <div className="text-left">
                            <span className="block font-bold text-lg">{crop.name.split(' ')[0]}</span>
                            <span className={`text-xs ${selectedCropId === crop.id ? 'text-green-200' : 'text-slate-400'}`}>
                                {crop.scientificName}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Weather Alert Banner */}
            {advisoryAlert.message && (
                <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
                    advisoryAlert.type === 'danger' ? 'bg-red-50 border-red-200 text-red-800' :
                    advisoryAlert.type === 'warning' ? 'bg-orange-50 border-orange-200 text-orange-800' :
                    'bg-green-50 border-green-200 text-green-800'
                }`}>
                    <div className={`mt-0.5 ${
                        advisoryAlert.type === 'danger' ? 'text-red-500' : 
                        advisoryAlert.type === 'warning' ? 'text-orange-500' : 'text-green-500'
                    }`}>
                        {advisoryAlert.type === 'safe' ? <Sun size={20} /> : <AlertTriangle size={20} />}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm uppercase mb-1">Crop-Weather Insight</h4>
                        <p className="text-sm font-medium">{advisoryAlert.message}</p>
                    </div>
                </div>
            )}

            {/* Detailed Content Area */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 min-h-[600px] flex flex-col md:flex-row">
                
                {/* Tabs Sidebar */}
                <div className="bg-slate-50 md:w-64 border-r border-slate-200 flex flex-row md:flex-col overflow-x-auto md:overflow-visible">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-6 py-5 text-sm font-bold transition-all whitespace-nowrap md:whitespace-normal border-b md:border-b-0 md:border-l-4 ${
                                activeTab === tab.id
                                ? 'bg-white text-[#2E7D32] border-[#2E7D32] shadow-sm'
                                : 'text-slate-500 border-transparent hover:bg-slate-100'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Panel */}
                <div className="flex-1 p-8">
                    <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                        <h3 className="text-2xl font-bold text-slate-800">{selectedCrop.name}</h3>
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            {tabs.find(t => t.id === activeTab)?.label} Stage
                        </span>
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        
                        {activeTab === 'prep' && (
                            <div className="space-y-4">
                                <h4 className="text-lg font-bold text-slate-700 mb-2">Land Preparation</h4>
                                <ul className="space-y-3">
                                    {selectedCrop.preparation.map((step, idx) => (
                                        <li key={idx} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <span className="flex-shrink-0 w-6 h-6 bg-[#FBC02D] text-[#1B5E20] rounded-full flex items-center justify-center font-bold text-sm">{idx + 1}</span>
                                            <p className="text-slate-700">{step}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {activeTab === 'sow' && (
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                    <h4 className="text-blue-900 font-bold mb-4 flex items-center gap-2">
                                        <Calendar size={20} /> Best Time
                                    </h4>
                                    <p className="text-blue-800 text-lg font-medium">{selectedCrop.sowing.period}</p>
                                </div>
                                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                                    <h4 className="text-green-900 font-bold mb-4 flex items-center gap-2">
                                        <Sprout size={20} /> Seed Rate
                                    </h4>
                                    <p className="text-green-800 text-lg font-medium">{selectedCrop.sowing.seedRate}</p>
                                </div>
                                <div className="col-span-1 md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                    <h4 className="text-slate-700 font-bold mb-2">Method</h4>
                                    <p className="text-slate-600">{selectedCrop.sowing.method}</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'fert' && (
                            <div className="space-y-6">
                                {selectedCrop.fertilizer.map((item, idx) => (
                                    <div key={idx} className="relative pl-8 border-l-2 border-dashed border-green-300 pb-8 last:pb-0">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 ring-4 ring-green-100"></div>
                                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                            <div className="flex justify-between items-center mb-3">
                                                <h5 className="font-bold text-green-700">{item.stage}</h5>
                                                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold">{item.timing}</span>
                                            </div>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-600">
                                                {item.activities.map((act, i) => (
                                                    <li key={i}>{act}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'spray' && (
                            <div className="space-y-6">
                                {selectedCrop.spraying.map((item, idx) => (
                                    <div key={idx} className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                                        <div className="flex justify-between items-center mb-3">
                                            <h5 className="font-bold text-orange-800 flex items-center gap-2">
                                                <AlertTriangle size={18} />
                                                {item.stage}
                                            </h5>
                                            <span className="text-xs bg-white text-orange-600 border border-orange-200 px-2 py-1 rounded font-bold">{item.timing}</span>
                                        </div>
                                        <div className="space-y-2">
                                            {item.activities.map((act, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                                    <Check size={16} className="text-orange-500" />
                                                    {act}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'disease' && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {selectedCrop.diseases.map((d, idx) => (
                                    <div key={idx} className="bg-red-50 p-6 rounded-2xl border border-red-100">
                                        <h4 className="font-bold text-red-900 text-lg mb-3">{d.name}</h4>
                                        <div className="mb-4">
                                            <p className="text-xs font-bold text-red-400 uppercase mb-1">Symptoms</p>
                                            <p className="text-sm text-red-800">{d.symptoms}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-green-600 uppercase mb-1">Solution</p>
                                            <p className="text-sm text-slate-700 bg-white p-2 rounded border border-red-100">{d.solution}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'irrig' && (
                            <div className="bg-cyan-50 p-8 rounded-2xl border border-cyan-100">
                                <div className="flex items-start gap-4">
                                    <Droplets size={40} className="text-cyan-600" />
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-cyan-900 text-lg">Irrigation Management</h4>
                                        <ul className="space-y-3">
                                            {selectedCrop.irrigation.map((point, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-cyan-800">
                                                    <span className="mt-1.5 w-1.5 h-1.5 bg-cyan-500 rounded-full shrink-0"></span>
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'yield' && (
                            <div className="flex flex-col items-center justify-center py-12 text-center bg-yellow-50 rounded-2xl border border-yellow-100">
                                <div className="bg-white p-6 rounded-full shadow-lg mb-6">
                                    <TrendingUp size={48} className="text-[#2E7D32]" />
                                </div>
                                <h4 className="text-slate-500 font-medium mb-2 uppercase tracking-widest text-xs">Expected Yield</h4>
                                <h2 className="text-4xl md:text-5xl font-extrabold text-[#2E7D32] mb-4">{selectedCrop.yieldEstimate}</h2>
                                <p className="text-slate-500 text-sm max-w-md">
                                    *Estimates depend on soil quality, weather conditions, and farm management practices.
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-4">
                    {isSubscribed ? <Check size={20} className="text-green-400" /> : <Info size={20} />}
                    <span>{isSubscribed ? 'Subscribed to weekly crop alerts!' : 'Unsubscribed from alerts.'}</span>
                </div>
            )}
        </div>
    );
};

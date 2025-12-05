import React, { useState } from 'react';
import { Search, MapPin, Phone, FileText, Heart, Download, Building2, FlaskConical, Filter } from 'lucide-react';

interface SoilLab {
  id: number;
  name: string;
  type: 'Government' | 'Private';
  district: string;
  address: string;
  phone: string;
}

const LAB_DATA: SoilLab[] = [
  {
    id: 1,
    name: "District Soil Testing Laboratory (Govt)",
    type: "Government",
    district: "Akola",
    address: "Near Collector Office, Civil Lines, Akola, Maharashtra 444001",
    phone: "0724-2435123"
  },
  {
    id: 2,
    name: "Dr. PDKV Soil Testing Lab",
    type: "Government",
    district: "Akola",
    address: "Dr. Panjabrao Deshmukh Krishi Vidyapeeth, Krishi Nagar, Akola",
    phone: "0724-2258200"
  },
  {
    id: 3,
    name: "Krushi Vigyan Kendra (KVK)",
    type: "Government",
    district: "Akola",
    address: "At Post Sisa (Udegaon), Tq. Akot, Dist. Akola",
    phone: "07258-295025"
  },
  {
    id: 4,
    name: "Bhumiputra Soil Testing Lab",
    type: "Private",
    district: "Akot",
    address: "Main Market Road, Near Cotton Market, Akot",
    phone: "9876543210"
  },
  {
    id: 5,
    name: "District Soil Survey & Testing Office",
    type: "Government",
    district: "Amravati",
    address: "Maltekdi, Amravati, Maharashtra 444606",
    phone: "0721-2662123"
  },
  {
    id: 6,
    name: "Green Earth Agro Lab",
    type: "Private",
    district: "Amravati",
    address: "MIDC Area, Badnera Road, Amravati",
    phone: "9988776655"
  },
  {
    id: 7,
    name: "Regional Soil Testing Laboratory",
    type: "Government",
    district: "Nagpur",
    address: "Seminary Hills, Nagpur, Maharashtra",
    phone: "0712-2510234"
  },
  {
    id: 8,
    name: "College of Agriculture Soil Lab",
    type: "Government",
    district: "Pune",
    address: "Shivajinagar, Pune, Maharashtra 411005",
    phone: "020-25537033"
  },
  {
    id: 9,
    name: "Nashik Soil Health Centre",
    type: "Private",
    district: "Nashik",
    address: "Agro Complex, Mumbai Naka, Nashik",
    phone: "9123456789"
  },
  {
    id: 10,
    name: "Yash Agro Laboratory",
    type: "Private",
    district: "Buldhana",
    address: "Chikhli Road, Buldhana",
    phone: "9000000000"
  }
];

export const SoilTest: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Government' | 'Private'>('All');

  const filteredLabs = LAB_DATA.filter(lab => {
    const matchesSearch = 
      lab.district.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'All' || lab.type === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
          <Heart className="text-[#2E7D32]" size={36} />
          Soil Health (जमीन आरोग्य)
        </h2>
        <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
          तुमच्या जमिनीचे आरोग्य तपासा. नजीकच्या लॅबचा पत्ता शोधा आणि रिपोर्ट मिळवा.
          (Check your soil health. Find nearby labs and get reports.)
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Educational & PDF Guide */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* Download PDF Guide */}
            <div className="bg-green-700 rounded-3xl shadow-xl p-6 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                     <FileText size={100} />
                 </div>
                 <h3 className="text-xl font-bold mb-3 flex items-center gap-2 relative z-10">
                    <FileText className="text-[#FBC02D]" />
                    Testing Guide
                 </h3>
                 <p className="text-green-100 text-sm mb-6 relative z-10 leading-relaxed">
                    माती परीक्षण कसे करावे, नमुना कसा घ्यावा याची सविस्तर माहिती PDF मध्ये वाचा.
                 </p>
                 <a 
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        alert("Soil Testing Guide PDF downloading... (Demo)");
                    }}
                    className="flex items-center justify-center gap-2 bg-[#FBC02D] text-[#1B5E20] px-4 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-all shadow-lg relative z-10 text-sm"
                 >
                    <Download size={18} />
                    Download Guide
                 </a>
            </div>

            {/* Why Test Soil? */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <FlaskConical className="text-blue-600" size={20} />
                    Why Test Soil?
                </h4>
                <ul className="space-y-3">
                    <li className="flex gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"></div>
                        To know nutrient deficiency (N, P, K).
                    </li>
                    <li className="flex gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"></div>
                        To determine pH level (Acidic/Alkaline).
                    </li>
                    <li className="flex gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"></div>
                        To save cost on unnecessary fertilizers.
                    </li>
                    <li className="flex gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"></div>
                        To improve crop yield and quality.
                    </li>
                </ul>
            </div>
        </div>

        {/* Right Column: Lab Locator */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <MapPin className="text-red-500" />
                        Find Laboratory
                    </h3>
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Search District, City..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-3 text-slate-400" size={18} />
                            <select 
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as any)}
                                className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E7D32] appearance-none cursor-pointer"
                            >
                                <option value="All">All Labs</option>
                                <option value="Government">Govt</option>
                                <option value="Private">Private</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {filteredLabs.length > 0 ? (
                        filteredLabs.map(lab => (
                            <div key={lab.id} className="border border-slate-100 rounded-2xl p-4 hover:shadow-md transition-shadow bg-slate-50">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg">{lab.name}</h4>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${lab.type === 'Government' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {lab.type}
                                        </span>
                                    </div>
                                    <div className="bg-green-100 p-2 rounded-full text-green-700">
                                        <Building2 size={20} />
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-slate-600 mb-4">
                                    <div className="flex items-start gap-2">
                                        <MapPin size={16} className="mt-0.5 shrink-0 text-red-400" />
                                        <span>{lab.address}</span>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                                        <Phone size={16} className="text-green-600" />
                                        {lab.phone}
                                    </div>
                                    <a 
                                        href={`tel:${lab.phone}`}
                                        className="bg-[#2E7D32] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-green-800 transition-colors"
                                    >
                                        Call Now
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-400">
                            <Search size={48} className="mx-auto mb-2 opacity-20" />
                            <p>No labs found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};
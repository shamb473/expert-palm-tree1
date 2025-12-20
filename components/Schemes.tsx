
import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, CheckCircle, ExternalLink, Shield, Tractor, Droplets, Coins, IdCard, User, MapPin, QrCode, Download, X, ArrowRight } from 'lucide-react';

interface Scheme {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  benefits: string[];
  documents: string[];
  process: string[];
  link?: string;
}

interface FarmerID {
  name: string;
  aadhaarLast4: string;
  village: string;
  mobile: string;
  regNo: string;
  date: string;
}

export const Schemes: React.FC = () => {
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  
  // Farmer ID State
  const [showIdModal, setShowIdModal] = useState(false);
  const [farmerProfile, setFarmerProfile] = useState<FarmerID | null>(() => {
    const saved = localStorage.getItem('kastkar_scheme_id');
    return saved ? JSON.parse(saved) : null;
  });

  // Form State
  const [formData, setFormData] = useState({ name: '', aadhaar: '', village: '', mobile: '' });

  const handleIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId: FarmerID = {
      name: formData.name,
      aadhaarLast4: formData.aadhaar.slice(-4),
      village: formData.village,
      mobile: formData.mobile,
      regNo: `MH-AG-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-IN')
    };
    setFarmerProfile(newId);
    localStorage.setItem('kastkar_scheme_id', JSON.stringify(newId));
    setShowIdModal(false);
  };

  const handleDeleteId = () => {
    if(confirm("Are you sure you want to delete your Farmer ID?")) {
      setFarmerProfile(null);
      localStorage.removeItem('kastkar_scheme_id');
      setFormData({ name: '', aadhaar: '', village: '', mobile: '' });
    }
  };

  const schemes: Scheme[] = [
    {
      id: 'pm-kisan',
      title: 'PM-Kisan Samman Nidhi',
      category: 'Financial Support',
      icon: <Coins size={24} className="text-yellow-500" />,
      description: 'Central government scheme providing income support of ₹6,000 per year to all landholding farmer families.',
      benefits: [
        '₹6,000 per year in 3 equal installments of ₹2,000 each.',
        'Direct Bank Transfer (DBT) to beneficiary accounts.',
        'Available to all landholding farmers families.'
      ],
      documents: [
        'Aadhaar Card',
        'Land Ownership Documents (7/12, 8A)',
        'Bank Account Passbook',
        'Mobile Number linked with Aadhaar'
      ],
      process: [
        'Visit official PM-Kisan portal (pmkisan.gov.in) or nearest CSC center.',
        'Register as "New Farmer".',
        'Fill in land and personal details.',
        'Submit required documents for verification.',
        'Check status via "Beneficiary Status" on portal.'
      ],
      link: 'https://pmkisan.gov.in/'
    },
    {
      id: 'pmfby',
      title: 'Pradhan Mantri Fasal Bima Yojana',
      category: 'Insurance',
      icon: <Shield size={24} className="text-blue-500" />,
      description: 'Comprehensive crop insurance scheme to provide financial support to farmers suffering crop loss/damage.',
      benefits: [
        'Coverage against non-preventable natural risks (Drought, Flood, Pests).',
        'Low premium rates (2% for Kharif, 1.5% for Rabi).',
        'Full sum insured provided for crop loss.'
      ],
      documents: [
        'Aadhaar Card',
        'Land Records (7/12)',
        'Bank Passbook (First Page)',
        'Sowing Certificate (Peera)',
        'Cancelled Cheque'
      ],
      process: [
        'Apply online via PMFBY portal or through Banks/CSC.',
        'Application must be submitted before the cut-off date for the season.',
        'Pay the premium share.',
        'In case of crop loss, intimate insurance company/bank within 72 hours.'
      ],
      link: 'https://pmfby.gov.in/'
    },
    {
      id: 'mahadbt-mech',
      title: 'Agricultural Mechanization',
      category: 'Subsidy',
      icon: <Tractor size={24} className="text-red-500" />,
      description: 'Subsidy for purchasing farm machinery like Tractors, Rotavators, Threshers, etc. to modernize farming.',
      benefits: [
        'Subsidy ranging from 40% to 50% on cost of machinery.',
        'Available for Tractors, Power Tillers, Rotavators, Harvesters, etc.',
        'Promotes efficiency and reduces labor dependency.'
      ],
      documents: [
        'Aadhaar Card',
        '7/12 Extract and 8A',
        'Caste Certificate (if applicable for higher subsidy)',
        'Bank Passbook',
        'Quotation from Authorized Dealer'
      ],
      process: [
        'Register on MahaDBT Farmer Portal.',
        'Login and select "Agricultural Mechanization" scheme.',
        'Select the machinery required.',
        'Participate in the lottery system.',
        'If selected, upload documents and get pre-sanction.'
      ],
      link: 'https://mahadbt.maharashtra.gov.in/'
    },
    {
      id: 'pmksy',
      title: 'PM Krishi Sinchayee Yojana',
      category: 'Irrigation',
      icon: <Droplets size={24} className="text-cyan-500" />,
      description: 'Subsidy scheme to promote water efficiency through Drip and Sprinkler irrigation systems.',
      benefits: [
        'Subsidy up to 80% for small/marginal farmers and 75% for others.',
        '"Per Drop More Crop" initiative.',
        'Increases yield and saves water.'
      ],
      documents: [
        'Aadhaar Card',
        '7/12 Extract with Water Source Entry',
        'Map of the field (Nakasha)',
        'Bank Passbook',
        'Electricity Bill'
      ],
      process: [
        'Apply online via MahaDBT portal.',
        'Select "Irrigation Tools" option.',
        'Choose Drip or Sprinkler system.',
        'Upon selection in lottery, upload technical sanction from dealer.',
        'Install system and get spot verification done for subsidy release.'
      ],
      link: 'https://mahadbt.maharashtra.gov.in/'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
          <BookOpen className="text-green-700" size={36} />
          Government Schemes
        </h2>
        <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
          Information about key agricultural schemes, subsidies, and application processes.
        </p>
      </div>

      {/* --- FARMER ID SECTION --- */}
      <div className="mb-12">
        {!farmerProfile ? (
          /* Registration Banner */
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
             {/* Decor */}
             <div className="absolute -right-10 -top-10 bg-white/10 w-40 h-40 rounded-full blur-2xl"></div>
             
             <div className="flex items-center gap-6 relative z-10">
                <div className="bg-white/20 p-5 rounded-full backdrop-blur-sm shadow-inner">
                   <IdCard size={48} className="text-white" />
                </div>
                <div>
                   <h3 className="text-2xl font-bold mb-1">Get Your Farmer Scheme ID</h3>
                   <p className="text-orange-100 text-sm max-w-md">Create your digital identity card for faster scheme access & verification at Kastkar Kendra.</p>
                </div>
             </div>
             <button 
               onClick={() => setShowIdModal(true)}
               className="bg-white text-orange-600 px-8 py-3.5 rounded-xl font-bold shadow-lg hover:bg-orange-50 transition-colors whitespace-nowrap z-10"
             >
                Generate ID Card
             </button>
          </div>
        ) : (
          /* Digital ID Display */
          <div className="flex justify-center">
             <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 relative group transform hover:scale-[1.01] transition-transform duration-300">
                {/* Card Header */}
                <div className="bg-[#2E7D32] p-5 text-center relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                   <div className="flex justify-between items-center relative z-10">
                      <div className="flex items-center gap-3">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem" className="w-10 h-10 opacity-90 filter invert brightness-0" />
                        <div className="text-left">
                           <h3 className="text-[10px] text-green-200 font-bold uppercase tracking-wider">Kastkar Krushi Seva</h3>
                           <h2 className="text-lg font-bold text-white leading-none">Farmer Identity Card</h2>
                        </div>
                      </div>
                      <Shield className="text-yellow-400 opacity-90 drop-shadow-sm" size={32} />
                   </div>
                </div>

                {/* Card Body */}
                <div className="p-6 relative">
                    <div className="flex items-start justify-between mb-8">
                        <div className="flex gap-4">
                           <div className="w-20 h-20 bg-slate-100 rounded-2xl border-2 border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                               <User size={40} className="text-slate-300" />
                           </div>
                           <div>
                              <h4 className="text-xl font-bold text-slate-800 leading-tight mb-1">{farmerProfile.name}</h4>
                              <p className="text-sm text-slate-500 font-medium mb-2">Reg No: {farmerProfile.regNo}</p>
                              <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200">
                                 <CheckCircle size={10} /> VERIFIED FARMER
                              </span>
                           </div>
                        </div>
                        <div className="text-center bg-white p-1 rounded-lg">
                            <QrCode size={56} className="text-slate-800" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-2">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                           <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Village</p>
                           <p className="font-semibold text-slate-700 flex items-center gap-1.5"><MapPin size={12} className="text-red-500"/> {farmerProfile.village}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                           <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Mobile</p>
                           <p className="font-semibold text-slate-700">+91 {farmerProfile.mobile}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                           <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Aadhaar (Last 4)</p>
                           <p className="font-semibold text-slate-700">XXXX-XXXX-{farmerProfile.aadhaarLast4}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                           <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Issued On</p>
                           <p className="font-semibold text-slate-700">{farmerProfile.date}</p>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center">
                   <p className="text-[10px] text-slate-400 max-w-[150px] leading-tight">Valid for all scheme applications via Kastkar.</p>
                   <div className="flex gap-2">
                      <button onClick={handleDeleteId} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete ID">
                         <X size={18} />
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-4 py-2 rounded-xl hover:bg-green-200 transition-colors">
                         <Download size={14} /> Save Card
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* --- ID GENERATION MODAL --- */}
      {showIdModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
               <div className="bg-orange-500 p-5 rounded-t-3xl flex justify-between items-center text-white">
                  <h3 className="font-bold text-lg flex items-center gap-2"><IdCard size={20}/> New Farmer ID</h3>
                  <button onClick={() => setShowIdModal(false)} className="hover:bg-orange-600 p-1 rounded-full transition-colors"><X size={20}/></button>
               </div>
               
               <form onSubmit={handleIdSubmit} className="p-6 space-y-4">
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-700 ml-1">Full Name (शेतकऱ्याचे नाव)</label>
                     <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500 transition-all" placeholder="Enter Full Name" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-700 ml-1">Mobile Number (मोबाईल)</label>
                     <input type="tel" pattern="[0-9]{10}" required value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full border p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500 transition-all" placeholder="10 Digit Mobile" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-700 ml-1">Village (गाव)</label>
                     <input type="text" required value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} className="w-full border p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500 transition-all" placeholder="Village Name" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-700 ml-1">Aadhaar Number (Last 4 Digits)</label>
                     <input type="text" pattern="[0-9]{4}" maxLength={4} required value={formData.aadhaar} onChange={e => setFormData({...formData, aadhaar: e.target.value})} className="w-full border p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500 transition-all" placeholder="XXXX" />
                  </div>
                  
                  <button type="submit" className="w-full bg-orange-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 transition-transform active:scale-[0.98] mt-2">
                     Generate ID Card
                  </button>
               </form>
           </div>
        </div>
      )}

      {/* --- SCHEMES GRID (Interactive Cards) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {schemes.map((scheme) => (
          <div 
            key={scheme.id}
            onClick={() => setSelectedScheme(scheme)}
            className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 cursor-pointer group relative overflow-hidden h-full flex flex-col"
          >
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/0 to-green-50/0 group-hover:from-green-50/30 group-hover:to-transparent transition-all duration-500"></div>

            <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3.5 bg-slate-50 rounded-2xl group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-sm text-slate-700">
                        {/* Clone icon to enforce consistent size */}
                        {React.isValidElement(scheme.icon) ? React.cloneElement(scheme.icon as React.ReactElement<any>, { size: 32 }) : scheme.icon}
                    </div>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-slate-200 group-hover:bg-green-100 group-hover:text-green-800 group-hover:border-green-200 transition-colors">
                        {scheme.category}
                    </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-green-800 transition-colors pr-8">
                    {scheme.title}
                </h3>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                    {scheme.description}
                </p>

                <div className="mt-auto flex items-center text-green-700 font-bold text-sm group/btn">
                    View Details 
                    <ArrowRight size={16} className="ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
                </div>
            </div>
            
            {/* Decorative Icon Watermark */}
             <div className="absolute -bottom-6 -right-6 text-slate-50 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500 opacity-50">
                {React.isValidElement(scheme.icon) ? React.cloneElement(scheme.icon as React.ReactElement<any>, { size: 120, strokeWidth: 1 }) : null}
            </div>
          </div>
        ))}
      </div>

      {/* --- DETAILS MODAL --- */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white/90 backdrop-blur-md p-6 border-b border-slate-100 flex justify-between items-start z-20">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-2xl text-green-700 shadow-sm">
                             {selectedScheme.icon}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 leading-tight">{selectedScheme.title}</h3>
                            <p className="text-slate-500 text-sm font-medium">{selectedScheme.category}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setSelectedScheme(null)}
                        className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                    {/* Description */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                         <p className="text-slate-700 leading-relaxed italic text-lg">
                             "{selectedScheme.description}"
                         </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                         {/* Benefits */}
                        <div>
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                                <CheckCircle className="text-green-600" size={20} />
                                Key Benefits
                            </h4>
                            <ul className="space-y-3">
                                {selectedScheme.benefits.map((benefit, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 bg-green-50/50 p-2 rounded-lg">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"></div>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Documents */}
                        <div>
                             <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                                <FileText className="text-blue-600" size={20} />
                                Required Documents
                            </h4>
                            <ul className="space-y-3">
                                {selectedScheme.documents.map((doc, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 bg-blue-50/50 p-2 rounded-lg">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></div>
                                        {doc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Process */}
                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                        <h4 className="font-bold text-slate-800 mb-6 text-lg">Application Process</h4>
                        <div className="space-y-6 relative pl-2">
                             {/* Line connector */}
                             <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200"></div>
                             
                             {selectedScheme.process.map((step, idx) => (
                                <div key={idx} className="flex gap-4 relative">
                                    <div className="flex-shrink-0 w-8 h-8 bg-white border-2 border-green-600 text-green-700 rounded-full flex items-center justify-center text-sm font-bold z-10 shadow-sm">
                                        {idx + 1}
                                    </div>
                                    <p className="text-slate-700 pt-1 font-medium">{step}</p>
                                </div>
                             ))}
                        </div>
                    </div>
                </div>

                {/* Footer Link */}
                {selectedScheme.link && (
                    <div className="p-6 border-t border-slate-100 bg-slate-50 sticky bottom-0 z-20">
                        <a 
                            href={selectedScheme.link}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-[#2E7D32] text-white py-4 rounded-2xl font-bold hover:bg-green-800 transition-all shadow-lg hover:shadow-green-200 transform hover:-translate-y-0.5"
                        >
                            Visit Official Website <ExternalLink size={18} />
                        </a>
                        <p className="text-xs text-center text-slate-400 mt-3">You will be redirected to the official government portal.</p>
                    </div>
                )}
            </div>
        </div>
      )}
      
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
        <h4 className="font-bold text-yellow-800 mb-2">Need Help Applying?</h4>
        <p className="text-yellow-700 text-sm mb-4">
          Visit Kastkar Krushi Seva Kendra with your documents, and we can guide you to the nearest CSC center or help you understand the process better.
        </p>
        <button 
           onClick={() => window.open('https://wa.me/918999678500', '_blank')}
           className="text-green-700 font-bold hover:underline bg-white px-4 py-2 rounded-lg shadow-sm"
        >
            Contact Owner on WhatsApp
        </button>
      </div>
    </div>
  );
};

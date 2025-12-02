import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, FileText, CheckCircle, ExternalLink, Shield, Tractor, Droplets, Coins } from 'lucide-react';

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

export const Schemes: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
      title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
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
      title: 'Agricultural Mechanization (MahaDBT)',
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
      title: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
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
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
          <BookOpen className="text-green-700" size={36} />
          Government Schemes
        </h2>
        <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
          Information about key agricultural schemes, subsidies, and application processes to help you avail government benefits.
        </p>
      </div>

      <div className="grid gap-6">
        {schemes.map((scheme) => (
          <div 
            key={scheme.id} 
            className={`bg-white rounded-2xl shadow-md border transition-all duration-300 overflow-hidden ${
              expandedId === scheme.id ? 'border-green-500 ring-1 ring-green-100' : 'border-slate-100 hover:shadow-lg'
            }`}
          >
            {/* Header */}
            <div 
              className="p-6 cursor-pointer flex items-start sm:items-center justify-between gap-4"
              onClick={() => toggleExpand(scheme.id)}
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  {scheme.icon}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-800">{scheme.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                      {scheme.category}
                    </span>
                    <span className="text-sm text-slate-500 line-clamp-1 hidden sm:block">
                      {scheme.description}
                    </span>
                  </div>
                </div>
              </div>
              <button className={`p-2 rounded-full transition-transform duration-300 ${expandedId === scheme.id ? 'bg-slate-100 rotate-180' : ''}`}>
                <ChevronDown className="text-slate-400" />
              </button>
            </div>

            {/* Expanded Content */}
            {expandedId === scheme.id && (
              <div className="px-6 pb-6 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="border-t border-slate-100 pt-4 mt-2 grid md:grid-cols-2 gap-8">
                  
                  <div>
                    <p className="text-slate-600 mb-6 italic">{scheme.description}</p>
                    
                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <CheckCircle size={18} className="text-green-600" /> Benefits
                    </h4>
                    <ul className="space-y-2 mb-6">
                      {scheme.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"></span>
                          {benefit}
                        </li>
                      ))}
                    </ul>

                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <FileText size={18} className="text-blue-600" /> Required Documents
                    </h4>
                    <ul className="space-y-2">
                      {scheme.documents.map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></span>
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-5 h-fit">
                    <h4 className="font-bold text-slate-800 mb-4">Application Process</h4>
                    <div className="space-y-4">
                      {scheme.process.map((step, idx) => (
                        <div key={idx} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-green-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <p className="text-sm text-slate-700">{step}</p>
                        </div>
                      ))}
                    </div>

                    {scheme.link && (
                      <div className="mt-8 pt-4 border-t border-slate-200">
                        <a 
                          href={scheme.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-full flex items-center justify-center gap-2 bg-green-700 text-white py-3 rounded-lg font-bold hover:bg-green-800 transition-colors shadow-md"
                        >
                          Visit Official Portal <ExternalLink size={16} />
                        </a>
                        <p className="text-xs text-center text-slate-400 mt-2">
                          Note: You will be redirected to the government website.
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
        <h4 className="font-bold text-yellow-800 mb-2">Need Help Applying?</h4>
        <p className="text-yellow-700 text-sm mb-4">
          Visit Kastkar Krushi Seva Kendra with your documents, and we can guide you to the nearest CSC center or help you understand the process better.
        </p>
        <button 
           onClick={() => window.open('https://wa.me/918999678500', '_blank')}
           className="text-green-700 font-bold hover:underline"
        >
            Contact Owner on WhatsApp
        </button>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { User, MapPin, Phone } from 'lucide-react';
import { Visitor } from '../types';

interface VisitorEntryProps {
  onSubmit: (visitor: Visitor) => void;
  onClose: () => void;
}

export const VisitorEntry: React.FC<VisitorEntryProps> = ({ onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [village, setVillage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && mobile && village) {
      onSubmit({
        id: Date.now().toString(),
        name,
        mobile,
        village,
        date: new Date().toLocaleDateString('en-IN')
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-[#2E7D32] p-6 text-center">
          <h3 className="text-2xl font-bold text-white">Welcome! / स्वागत आहे!</h3>
          <p className="text-green-100 text-sm mt-1">Please enter your details to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <User size={16} /> Full Name / पूर्ण नाव
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-[#2E7D32] outline-none transition-colors"
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Phone size={16} /> Mobile Number / मोबाईल
            </label>
            <input
              type="tel"
              required
              pattern="[0-9]{10}"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-[#2E7D32] outline-none transition-colors"
              placeholder="10 digit number"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <MapPin size={16} /> Village / गाव
            </label>
            <input
              type="text"
              required
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-[#2E7D32] outline-none transition-colors"
              placeholder="Enter village name"
            />
          </div>

          <div className="pt-4 flex gap-3">
             <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl"
            >
              Skip
            </button>
            <button
              type="submit"
              className="flex-[2] bg-[#FBC02D] text-[#1B5E20] py-3 rounded-xl font-bold hover:bg-yellow-400 shadow-lg transition-transform hover:scale-[1.02]"
            >
              Enter App
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

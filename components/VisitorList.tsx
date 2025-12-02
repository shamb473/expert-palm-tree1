
import React from 'react';
import { Visitor } from '../types';
import { Phone, MessageCircle, MapPin, Calendar, Search, User } from 'lucide-react';

interface VisitorListProps {
  visitors: Visitor[];
}

export const VisitorList: React.FC<VisitorListProps> = ({ visitors }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredVisitors = visitors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.mobile.includes(searchTerm)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
           <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <User className="text-[#2E7D32]" size={32} />
            Visitor Log
          </h2>
          <p className="text-slate-500 mt-1">List of farmers who visited the app</p>
        </div>
        
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search name, village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 border rounded-xl w-full md:w-64 focus:ring-2 focus:ring-[#2E7D32] outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredVisitors.length > 0 ? (
          filteredVisitors.map((visitor) => (
            <div key={visitor.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-slate-800">{visitor.name}</h3>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full flex items-center gap-1">
                  <Calendar size={12} /> {visitor.date}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin size={16} className="text-[#FBC02D]" />
                  <span>{visitor.village}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone size={16} className="text-[#2E7D32]" />
                  <span>{visitor.mobile}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-50">
                <a 
                  href={`tel:${visitor.mobile}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-green-100 text-green-700 py-2 rounded-lg font-bold text-sm transition-colors"
                >
                  <Phone size={16} /> Call
                </a>
                <a 
                  href={`https://wa.me/91${visitor.mobile}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-[#2E7D32] py-2 rounded-lg font-bold text-sm transition-colors"
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-slate-400">
            No visitors found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

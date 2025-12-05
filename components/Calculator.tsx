
import React, { useState } from 'react';
import { Calculator as CalcIcon, Sprout, Droplets, ArrowRight, RotateCcw } from 'lucide-react';

export const Calculator: React.FC = () => {
  const [acres, setAcres] = useState<number | ''>('');
  const [crop, setCrop] = useState('Cotton');
  const [result, setResult] = useState<any>(null);

  const calculateRequirements = () => {
    if (!acres || acres <= 0) return;
    const size = Number(acres);

    let data = { seed: '', fertilizer: '' };

    if (crop === 'Cotton') {
      data = {
        seed: `${Math.ceil(size * 2)} Packets (Bt Cotton)`,
        fertilizer: `${Math.ceil(size * 1)} Bag DAP + ${Math.ceil(size * 0.5)} Bag Potash`
      };
    } else if (crop === 'Soybean') {
      data = {
        seed: `${size * 25} - ${size * 30} kg`,
        fertilizer: `${Math.ceil(size * 1)} Bag DAP + ${Math.ceil(size * 10)} kg Sulphur`
      };
    } else if (crop === 'Wheat') {
      data = {
        seed: `${size * 40} kg`,
        fertilizer: `${Math.ceil(size * 1)} Bag NPK 12:32:16 + ${Math.ceil(size * 0.5)} Bag Urea`
      };
    } else if (crop === 'Gram (Chana)') {
      data = {
        seed: `${size * 25} kg`,
        fertilizer: `${Math.ceil(size * 1)} Bag DAP`
      };
    }

    setResult(data);
  };

  const reset = () => {
    setAcres('');
    setResult(null);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <CalcIcon className="text-[#2E7D32]" size={32} />
          Agri Calculator
        </h2>
        <p className="text-slate-500 mt-2">Estimate seeds and fertilizers for your farm.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
        <div className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Land Size (Acres) / जमीन (एकर)</label>
            <input 
              type="number" 
              value={acres}
              onChange={(e) => setAcres(Number(e.target.value))}
              placeholder="e.g. 5"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-800 focus:ring-2 focus:ring-[#2E7D32] outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Select Crop / पीक निवडा</label>
            <select 
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-lg font-medium text-slate-800 focus:ring-2 focus:ring-[#2E7D32] outline-none appearance-none"
            >
              <option value="Cotton">Cotton (कापूस)</option>
              <option value="Soybean">Soybean (सोयाबीन)</option>
              <option value="Wheat">Wheat (गहू)</option>
              <option value="Gram (Chana)">Gram (हरभरा)</option>
            </select>
          </div>

          <button 
            onClick={calculateRequirements}
            className="w-full bg-[#2E7D32] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-green-800 transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            Calculate Requirements <ArrowRight size={20} />
          </button>

          {result && (
            <div className="mt-6 pt-6 border-t border-dashed border-slate-200 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="font-bold text-slate-800 mb-4 text-center">Estimated Requirement</h3>
              
              <div className="grid gap-4">
                <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center gap-4">
                  <div className="bg-green-200 p-3 rounded-full text-green-800">
                    <Sprout size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-green-700 uppercase">Seed Quantity</p>
                    <p className="text-xl font-extrabold text-slate-800">{result.seed}</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-4">
                  <div className="bg-blue-200 p-3 rounded-full text-blue-800">
                    <Droplets size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-700 uppercase">Fertilizer (Basal)</p>
                    <p className="text-lg font-bold text-slate-800 leading-tight">{result.fertilizer}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={reset}
                className="w-full mt-6 text-slate-400 font-bold text-sm hover:text-slate-600 flex items-center justify-center gap-2"
              >
                <RotateCcw size={14} /> Calculate Again
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

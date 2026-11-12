import React, { useState, useEffect } from 'react';
import { Fuel, Gauge, IndianRupee, Save, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function FuelCalculator({ 
  fuelSettings, 
  onSettingsChange, 
  onSaveServer,
  disabled = false 
}) {
  const { isAuthenticated } = useAuth();
  const [localType, setLocalType] = useState(fuelSettings.fuel_type || 'Petrol');
  const [localMileage, setLocalMileage] = useState(fuelSettings.mileage || 15.0);
  const [localPrice, setLocalPrice] = useState(fuelSettings.fuel_price || 102.5);
  const [saveStatus, setSaveStatus] = useState(null);

  // Sync when prop updates
  useEffect(() => {
    if (fuelSettings) {
      setLocalType(fuelSettings.fuel_type || 'Petrol');
      setLocalMileage(fuelSettings.mileage || 15.0);
      setLocalPrice(fuelSettings.fuel_price || 102.5);
    }
  }, [fuelSettings]);

  // Typical state average fuel prices in India for quick selection
  const standardFuelPrices = {
    Petrol: 102.86,
    Diesel: 88.50
  };

  const handleTypeChange = (type) => {
    setLocalType(type);
    const updatedPrice = standardFuelPrices[type] || localPrice;
    setLocalPrice(updatedPrice);
    
    if (onSettingsChange) {
      onSettingsChange({
        fuel_type: type,
        mileage: parseFloat(localMileage),
        fuel_price: parseFloat(updatedPrice)
      });
    }
  };

  const handleMileageChange = (val) => {
    const num = Math.max(0.1, parseFloat(val) || 0);
    setLocalMileage(val);
    if (onSettingsChange && num > 0) {
      onSettingsChange({
        fuel_type: localType,
        mileage: num,
        fuel_price: parseFloat(localPrice) || 102.5
      });
    }
  };

  const handlePriceChange = (val) => {
    const num = Math.max(0.1, parseFloat(val) || 0);
    setLocalPrice(val);
    if (onSettingsChange && num > 0) {
      onSettingsChange({
        fuel_type: localType,
        mileage: parseFloat(localMileage) || 15.0,
        fuel_price: num
      });
    }
  };

  const handleSaveToMySQL = async () => {
    if (!isAuthenticated) return;
    try {
      setSaveStatus('saving');
      if (onSaveServer) {
        await onSaveServer({
          fuel_type: localType,
          mileage: parseFloat(localMileage),
          fuel_price: parseFloat(localPrice)
        });
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div className="bg-navy-900/90 border border-navy-700/80 rounded-xl p-4 shadow-lg text-left">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Fuel className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100">Vehicle Fuel Economics</h4>
            <p className="text-[11px] text-slate-400">Dynamically recalculates all route fuel expenses</p>
          </div>
        </div>

        {isAuthenticated && (
          <button
            type="button"
            onClick={handleSaveToMySQL}
            disabled={disabled || saveStatus === 'saving'}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 transition-colors"
            title="Save as default preferences in MySQL database"
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved to DB!' : 'Save Prefs'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Fuel Type Toggle */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Fuel Type
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-navy-950 rounded-lg border border-navy-800">
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleTypeChange('Petrol')}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                localType === 'Petrol'
                  ? 'bg-emerald-500 text-navy-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Petrol
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleTypeChange('Diesel')}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                localType === 'Diesel'
                  ? 'bg-emerald-500 text-navy-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Diesel
            </button>
          </div>
        </div>

        {/* Mileage Input */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Mileage (km/L)</span>
            <span className="text-[10px] text-slate-500 lowercase">avg 15-20</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <input
              type="number"
              step="0.5"
              min="1"
              max="100"
              disabled={disabled}
              value={localMileage}
              onChange={(e) => handleMileageChange(e.target.value)}
              className="w-full bg-navy-950 border border-navy-700/80 rounded-lg pl-8 pr-3 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Fuel Price Input */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Price (₹/Litre)</span>
            <span className="text-[10px] text-slate-500 font-mono">₹{localType === 'Petrol' ? '102.86' : '88.50'}</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <input
              type="number"
              step="0.5"
              min="10"
              max="500"
              disabled={disabled}
              value={localPrice}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="w-full bg-navy-950 border border-navy-700/80 rounded-lg pl-8 pr-3 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

      </div>

      {/* Formula helper note */}
      <div className="mt-3 pt-2.5 border-t border-navy-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-mono text-[10px] text-emerald-400/90">
          Formula: (Distance / {localMileage} km/L) × ₹{localPrice}/L
        </span>
        <span className="text-[10px] text-slate-500 hidden sm:inline">
          Excludes tolls & parking charges
        </span>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Fuel, Gauge, IndianRupee, Save, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function Settings() {
  const { fuelSettings, updateSettings } = useAuth();

  const [fuelType, setFuelType] = useState(fuelSettings?.fuel_type || 'Petrol');
  const [mileage, setMileage] = useState(fuelSettings?.mileage || 15.0);
  const [fuelPrice, setFuelPrice] = useState(fuelSettings?.fuel_price || 102.5);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const m = parseFloat(mileage);
    const p = parseFloat(fuelPrice);

    if (isNaN(m) || m <= 0 || m > 100) {
      setNotification({ type: 'error', message: 'Please enter a valid vehicle mileage between 1 and 100 km/L' });
      return;
    }

    if (isNaN(p) || p <= 0 || p > 500) {
      setNotification({ type: 'error', message: 'Please enter a valid fuel price between ₹1 and ₹500/L' });
      return;
    }

    try {
      setSaving(true);
      await updateSettings({
        fuel_type: fuelType,
        mileage: m,
        fuel_price: p
      });
      setNotification({
        type: 'success',
        message: 'Fuel preferences saved successfully into MySQL database!'
      });
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to update preferences.'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-navy-800 text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Fuel className="w-6 h-6 text-emerald-400" />
          Vehicle Fuel Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize your vehicle specifications. These settings automatically compute route fuel budgets.
        </p>
      </div>

      {/* Main Settings Card */}
      <form onSubmit={handleSubmit} className="bg-navy-900 border border-navy-700/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 text-left">
        
        {/* Fuel Type */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Vehicle Fuel Type
          </label>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              type="button"
              onClick={() => {
                setFuelType('Petrol');
                if (fuelPrice === 88.50) setFuelPrice(102.86);
              }}
              className={`py-3 px-4 rounded-xl font-bold text-sm border transition-all flex items-center justify-center gap-2 ${
                fuelType === 'Petrol'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-navy-950 text-slate-400 border-navy-800 hover:text-slate-200'
              }`}
            >
              <Fuel className="w-4 h-4" />
              Petrol (₹102.86/L)
            </button>

            <button
              type="button"
              onClick={() => {
                setFuelType('Diesel');
                if (fuelPrice === 102.86) setFuelPrice(88.50);
              }}
              className={`py-3 px-4 rounded-xl font-bold text-sm border transition-all flex items-center justify-center gap-2 ${
                fuelType === 'Diesel'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-navy-950 text-slate-400 border-navy-800 hover:text-slate-200'
              }`}
            >
              <Fuel className="w-4 h-4" />
              Diesel (₹88.50/L)
            </button>
          </div>
        </div>

        {/* Vehicle Mileage */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
            <span>Vehicle Average Mileage (km / Litre)</span>
            <span className="text-slate-400 lowercase font-normal text-[11px]">e.g. 15 km/L for petrol car, 45 km/L for bike</span>
          </label>
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Gauge className="w-4 h-4 text-emerald-400" />
            </div>
            <input
              type="number"
              step="0.1"
              min="1"
              max="100"
              required
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Fuel Price */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
            <span>Current Fuel Price (₹ / Litre)</span>
            <span className="text-slate-400 lowercase font-normal text-[11px]">Enter your local state fuel price</span>
          </label>
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <IndianRupee className="w-4 h-4 text-amber-400" />
            </div>
            <input
              type="number"
              step="0.1"
              min="1"
              max="500"
              required
              value={fuelPrice}
              onChange={(e) => setFuelPrice(e.target.value)}
              className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-navy-800 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-navy-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving to MySQL...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Preferences
              </>
            )}
          </button>
        </div>

      </form>

      {/* Toast Notification */}
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

    </div>
  );
}

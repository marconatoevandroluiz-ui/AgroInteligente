
import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  RefreshCw, 
  Droplets, 
  Wind, 
  Sun, 
  CloudRain, 
  CloudLightning,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Search,
  MapPin,
  Lock
} from 'lucide-react';
import { generateAgriculturalForecast } from '../geminiService';
import { PlanTier } from '../types';

interface WeatherWidgetProps {
  plan: PlanTier;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ plan }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('Sarandi, PR');
  const [searchInput, setSearchInput] = useState('');

  const isBlocked = plan === 'Básico';

  const fetchWeather = async (targetLocation: string = location) => {
    if (isBlocked) return;
    setLoading(true);
    const result = await generateAgriculturalForecast(targetLocation);
    if (result) {
      setData(result);
      setLocation(targetLocation);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isBlocked) {
      fetchWeather();
    }
  }, [plan]);

  const getWeatherIcon = (condition: string, size: number = 20) => {
    const cond = condition?.toLowerCase() || '';
    if (cond.includes('chuva')) return <CloudRain size={size} className="text-blue-500" />;
    if (cond.includes('sol') || cond.includes('limpo')) return <Sun size={size} className="text-amber-500" />;
    if (cond.includes('trovoada')) return <CloudLightning size={size} className="text-purple-500" />;
    return <CloudSun size={size} className="text-slate-500" />;
  };

  if (isBlocked) {
    return (
      <div className="relative group">
        <div className="flex items-center gap-3 bg-slate-100 border border-slate-200 px-4 py-2 rounded-2xl opacity-60">
          <CloudSun size={18} className="text-slate-400" />
          <span className="text-sm font-bold text-slate-400">Clima IA</span>
          <Lock size={12} className="text-amber-500" />
        </div>
        <div className="absolute top-full right-0 mt-3 w-64 bg-slate-900 text-white rounded-2xl shadow-2xl p-6 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-50 pointer-events-none">
           <p className="text-xs font-bold mb-2">Recurso Bloqueado</p>
           <p className="text-[10px] text-slate-400 mb-4 font-medium">O Agente Meteorológico está disponível apenas nos planos Profissional e Premium.</p>
           <div className="text-[10px] font-black text-emerald-400">FAÇA O UPGRADE AGORA →</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Mini View Header */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => fetchWeather()}
          className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-2xl hover:border-emerald-200 transition-all shadow-sm group"
        >
          <div className="flex items-center gap-2">
            {data ? getWeatherIcon(data.current.condition, 18) : <CloudSun size={18} className="text-blue-400" />}
            <span className="text-sm font-bold text-slate-700">
              {data ? `${data.current.temp}°C` : '--°C'}
            </span>
          </div>
          <div className="w-px h-4 bg-slate-200"></div>
          <span className="text-[10px] font-bold text-slate-500 truncate max-w-[80px]">
            {location}
          </span>
          <RefreshCw size={14} className={`text-slate-300 group-hover:text-emerald-500 transition-colors ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Expanded Forecast Panel */}
      <div className="absolute top-full right-0 mt-3 w-[420px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-6 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 z-50">
        
        <div className="mb-6">
          <form onSubmit={(e) => { e.preventDefault(); fetchWeather(searchInput); }} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar cidade..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl">Buscar</button>
          </form>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
            <RefreshCw size={32} className="animate-spin text-emerald-500" />
            <p className="text-sm font-medium">Consultando Clima IA...</p>
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black text-slate-900 leading-tight">{location}</h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{data.current.condition}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-emerald-600">{data.current.temp}°C</p>
                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold justify-end mt-1">
                  <span className="flex items-center gap-1"><Wind size={12} /> {data.current.windSpeed} km/h</span>
                  <span className="flex items-center gap-1"><Droplets size={12} /> {data.current.humidity}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Pulverização</p>
                <span className="text-xs font-black text-slate-700">{data.agriInsights.sprayingStatus}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Pastagem</p>
                <p className="text-xs font-black text-slate-700">{data.agriInsights.harvestWindow}</p>
              </div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 italic text-[11px] text-emerald-800">
              "{data.agriInsights.generalAdvice}"
            </div>

            <div>
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Próximos Dias</h5>
              <div className="flex justify-between gap-2">
                {data.forecast.map((day: any, idx: number) => (
                  <div key={idx} className="flex flex-col items-center gap-1 p-2 rounded-2xl border border-slate-50 flex-1">
                    <span className="text-[9px] font-bold text-slate-500">{day.date.split('/')[0]}</span>
                    {getWeatherIcon(day.condition, 18)}
                    <span className="text-[10px] font-black">{day.max}°</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default WeatherWidget;

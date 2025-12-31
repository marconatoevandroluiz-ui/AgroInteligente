
import React, { useState } from 'react';
import { 
  Activity, 
  Scale, 
  TrendingUp, 
  Plus, 
  Search, 
  ChevronRight, 
  HeartPulse, 
  Calendar,
  Filter,
  ArrowUpRight,
  ClipboardList
} from 'lucide-react';
import { HerdLot, Farm } from '../types';

interface LivestockProps {
  herd: HerdLot[];
  setHerd: React.Dispatch<React.SetStateAction<HerdLot[]>>;
  farms: Farm[];
}

const LivestockModule: React.FC<LivestockProps> = ({ herd, setHerd, farms }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLot, setSelectedLot] = useState<HerdLot | null>(null);

  const filteredHerd = herd.filter(lot => 
    lot.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lot.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Activity className="text-emerald-600" size={32} /> Gestão de Pecuária
          </h2>
          <p className="text-slate-500 font-medium">Controle zootécnico e performance de rebanho</p>
        </div>
        <div className="flex gap-2">
           <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
             <Scale size={18} /> Nova Pesagem
           </button>
           <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
             <Plus size={18} /> Criar Novo Lote
           </button>
        </div>
      </div>

      {/* Mini KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total de Cabeças</p>
          <p className="text-2xl font-black text-slate-900">{herd.reduce((acc, l) => acc + l.quantity, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">GMD Médio Rebanho</p>
          <p className="text-2xl font-black text-emerald-600">0,845 kg</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Peso Médio Atual</p>
          <p className="text-2xl font-black text-slate-900">420 kg</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Eficiência de Pasto</p>
          <p className="text-2xl font-black text-blue-600">1,8 UA/ha</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lots List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-sm">
             <Search size={20} className="text-slate-400 ml-2" />
             <input 
                type="text" 
                placeholder="Buscar por lote ou raça..." 
                className="flex-1 bg-transparent border-none outline-none text-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
             />
             <button className="p-2 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100">
               <Filter size={18} />
             </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredHerd.map(lot => (
              <div 
                key={lot.id} 
                onClick={() => setSelectedLot(lot)}
                className={`bg-white p-5 rounded-[2rem] border-2 transition-all cursor-pointer group flex items-center justify-between ${selectedLot?.id === lot.id ? 'border-emerald-500 shadow-lg' : 'border-slate-100 hover:border-emerald-200 shadow-sm'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 p-4 rounded-2xl text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">{lot.name}</h4>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-tighter">{lot.breed}</span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-tighter">{lot.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-12 text-right">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Cabeças</p>
                    <p className="font-black text-slate-900">{lot.quantity}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Peso Médio</p>
                    <p className="font-black text-slate-900">{lot.averageWeight} kg</p>
                  </div>
                  <div className="text-emerald-600">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase">GMD Exp.</p>
                    <p className="font-black flex items-center gap-1">
                       <TrendingUp size={14} /> {lot.gmdExpected.toFixed(3)}
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Panel / Analytics */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <HeartPulse className="text-rose-400" /> Sanidade e Saúde
            </h3>
            <div className="space-y-4">
               <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
                  <p className="text-[10px] font-bold text-amber-400 uppercase mb-1">Alerta Próximo</p>
                  <p className="text-sm font-bold">Vacinação Aftosa - Lote 01</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-bold">
                    <Calendar size={12} /> Vence em 4 dias
                  </div>
               </div>
               <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Concluído</p>
                  <p className="text-sm font-bold">Vermifugação Bezerros A2</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-bold">
                    <ClipboardList size={12} /> 180 animais tratados
                  </div>
               </div>
            </div>
            <button className="w-full mt-6 py-3 bg-emerald-600 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
              Ver Calendário Sanitário <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <h3 className="text-lg font-bold text-slate-900 mb-4">Manejo de Pastos</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                   <div>
                      <p className="text-sm font-bold text-slate-800">Lotação Média</p>
                      <p className="text-xs text-slate-500"> UA / Hectare</p>
                   </div>
                   <p className="text-xl font-black text-slate-900">1.82</p>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                   <div>
                      <p className="text-sm font-bold text-slate-800">Pastos em Repouso</p>
                      <p className="text-xs text-slate-500">Rotação ativa</p>
                   </div>
                   <p className="text-xl font-black text-blue-600">12</p>
                </div>
                <div className="flex justify-between items-center">
                   <div>
                      <p className="text-sm font-bold text-slate-800">Suplementação</p>
                      <p className="text-xs text-slate-500">Proteinados</p>
                   </div>
                   <p className="text-xl font-black text-emerald-600">Ativa</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivestockModule;

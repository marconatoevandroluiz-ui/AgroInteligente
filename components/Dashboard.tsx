
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Scale, 
  Activity, 
  Sprout, 
  Globe, 
  RefreshCw,
  Clock,
  ExternalLink,
  Lock
} from 'lucide-react';
import { Farm, PlanTier } from '../types';
import { getMarketQuotes } from '../geminiService';

interface DashboardProps {
  farms: Farm[];
  plan: PlanTier;
}

interface Quote {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  source: string;
}

const Dashboard: React.FC<DashboardProps> = ({ farms, plan }) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);

  const fetchQuotes = async () => {
    setLoadingQuotes(true);
    const data = await getMarketQuotes();
    if (data && data.quotes) {
      setQuotes(data.quotes);
    }
    setLoadingQuotes(false);
  };

  useEffect(() => {
    fetchQuotes();
    const interval = setInterval(fetchQuotes, 1800000);
    return () => clearInterval(interval);
  }, []);

  const totalRevenue = farms.reduce((acc, f) => acc + f.revenue, 0);
  const totalHeads = farms.reduce((acc, f) => acc + f.livestockHeadCount, 0);

  const stats = [
    { label: 'Faturamento Total', value: `R$ ${(totalRevenue/1000000).toFixed(1)}M`, change: '+12%', up: true, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Rebanho Ativo', value: `${totalHeads.toLocaleString()} cab`, change: '+150', up: true, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Área em Lavoura', value: '450 ha', change: 'Estável', up: null, icon: Sprout, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'GMD Médio Rebanho', value: '0,845 kg', change: '-2%', up: false, icon: Scale, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard AgroInteligente</h1>
          <p className="text-slate-500 font-medium">Informação de mercado e performance operacional • Plano {plan}</p>
        </div>
        <div className="flex items-center gap-3">
          {plan === 'Básico' && (
            <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
               <div className="text-left">
                  <p className="text-[10px] font-black text-amber-700 uppercase">Uso de Fazendas</p>
                  <div className="w-24 h-1.5 bg-amber-200 rounded-full mt-1">
                     <div className="w-full h-full bg-amber-500 rounded-full"></div>
                  </div>
               </div>
               <span className="text-xs font-black text-amber-700">1 / 1</span>
            </div>
          )}
          <button 
            onClick={fetchQuotes}
            disabled={loadingQuotes}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={loadingQuotes ? 'animate-spin' : ''} />
            Atualizar Cotações
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                <stat.icon size={24} />
              </div>
              {stat.change && (
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${stat.up === true ? 'bg-emerald-100 text-emerald-700' : stat.up === false ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                  {stat.up === true ? <TrendingUp size={12} /> : stat.up === false ? <TrendingDown size={12} /> : null}
                  {stat.change}
                </div>
              )}
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Real-time Market Quotes Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-600 text-white rounded-lg shadow-lg">
                <Globe size={20} />
             </div>
             <div>
               <h3 className="text-xl font-black text-slate-900">Cotações Online</h3>
               <p className="text-sm text-slate-500 font-medium">Preços de referência em tempo real (CEPEA/B3)</p>
             </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
             <Clock size={12} /> Última atualização: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="p-8">
           {loadingQuotes ? (
             <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                <RefreshCw size={32} className="animate-spin text-blue-500" />
                <p className="text-sm font-bold">Buscando cotações atualizadas...</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {quotes.length > 0 ? quotes.map((quote, idx) => (
                 <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{quote.name}</span>
                       <div className={`p-1.5 rounded-lg ${quote.trend === 'up' ? 'bg-emerald-100 text-emerald-600' : quote.trend === 'down' ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-500'}`}>
                          {quote.trend === 'up' ? <TrendingUp size={16} /> : quote.trend === 'down' ? <TrendingDown size={16} /> : <Activity size={16} />}
                       </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                       <h4 className="text-2xl font-black text-slate-900">{quote.value}</h4>
                       <span className={`text-xs font-bold ${quote.trend === 'up' ? 'text-emerald-600' : quote.trend === 'down' ? 'text-rose-600' : 'text-slate-500'}`}>
                          {quote.change}
                       </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                       <span className="text-[9px] font-bold text-slate-400 uppercase truncate max-w-[120px]">Fonte: {quote.source}</span>
                       <ExternalLink size={12} className="text-slate-300 group-hover:text-blue-500" />
                    </div>
                 </div>
               )) : (
                 <div className="col-span-4 py-10 text-center text-slate-400">
                    Nenhuma cotação encontrada no momento.
                 </div>
               )}
             </div>
           )}
        </div>
      </div>

      {/* Market News / Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            {plan === 'Básico' && (
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                 <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 text-center shadow-2xl">
                    <Lock className="mx-auto mb-3 text-amber-500" size={32} />
                    <p className="font-bold text-sm">Insights de IA disponíveis no Plano Profissional</p>
                    <button className="mt-4 px-6 py-2 bg-emerald-600 rounded-xl text-xs font-black hover:bg-emerald-500 transition-all">FAZER UPGRADE</button>
                 </div>
              </div>
            )}
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
               <Activity className="text-emerald-400" /> Insights de Mercado IA
            </h3>
            <div className="space-y-6">
               <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
                  <p className="text-xs font-bold text-emerald-400 uppercase mb-2">Estratégia Recomendada</p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Com a alta do dólar e estabilidade na arroba, o momento é favorável para travar custos de nutrição e planejar a venda escalonada de lotes prontos.
                  </p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-2xl">
                     <p className="text-[10px] font-bold text-slate-500 uppercase">Paridade Soja/Boi</p>
                     <p className="text-lg font-black text-white">Favorável</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl">
                     <p className="text-[10px] font-bold text-slate-500 uppercase">Relação Troca Milho</p>
                     <p className="text-lg font-black text-white">Alerta</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Agenda do Produtor</h3>
            <div className="space-y-4">
               {[
                 { time: 'Amanhã', event: 'Divulgação Relatório USDA (Grãos)', color: 'bg-blue-500' },
                 { time: 'Quinta', event: 'Fechamento PTAX Semanal', color: 'bg-emerald-500' },
                 { time: '20 Mai', event: 'Vencimento Contrato Futuro Boi (B3)', color: 'bg-rose-500' },
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                    <div className={`w-2 h-12 ${item.color} rounded-full`}></div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.time}</p>
                       <p className="font-bold text-slate-800">{item.event}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;


import React from 'react';
import { 
  Check, 
  Zap, 
  ShieldCheck, 
  Gem, 
  CreditCard, 
  ArrowRight, 
  Star,
  Plus,
  CloudRain,
  FileText,
  DollarSign,
  PieChart,
  Activity
} from 'lucide-react';
import { PlanTier, UserSubscription } from '../types';

interface SubscriptionsProps {
  currentSubscription: UserSubscription;
  setSubscription: React.Dispatch<React.SetStateAction<UserSubscription>>;
}

const PLANS = [
  {
    tier: 'Básico' as PlanTier,
    price: '49',
    description: 'Essencial para pequenos produtores que estão começando a digitalizar a porteira.',
    icon: Zap,
    color: 'bg-slate-100 text-slate-600',
    features: [
      '1 Fazenda Central',
      'Plantio (1 cultura principal)',
      'Gado (1 lote de referência)',
      'Dashboard Financeiro básico',
      'Gestão de Frota e Máquinas',
      'Suporte via E-mail'
    ],
    notIncluded: [
      'IA Meteorológica',
      'Documentação Agro IA',
      'Múltiplas Fazendas',
      'Relatórios PDF Avançados'
    ]
  },
  {
    tier: 'Profissional' as PlanTier,
    price: '99',
    description: 'A solução completa para quem vive do agro e precisa de dados reais de mercado.',
    icon: Star,
    color: 'bg-emerald-100 text-emerald-600',
    highlight: true,
    features: [
      'Fazendas Ilimitadas',
      'Todas as Culturas e Grãos',
      'Gado Completo (Micro SaaS)',
      'IA Previsão do Tempo (Clima)',
      'Dashboard de Performance',
      'Relatórios Gerenciais em PDF',
      'Equipe de Campo (Sem limite)'
    ],
    notIncluded: [
      'IA Documentação Agro',
      'Alertas Automáticos de Risco'
    ]
  },
  {
    tier: 'Premium' as PlanTier,
    price: '199',
    description: 'Gestão 360 com inteligência de ponta para grandes operações e investidores.',
    icon: Gem,
    color: 'bg-blue-100 text-blue-600',
    features: [
      'Tudo do Plano Profissional',
      'IA Documentação Agro (Analítico)',
      'Alertas Automáticos via WhatsApp',
      'Multiusuários (Admin e Peões)',
      'Suporte Prioritário 24/7',
      'API para integração IoT',
      'Conciliação Fiscal Automática'
    ],
    notIncluded: []
  }
];

const ADDONS = [
  { id: 'weather', name: 'IA Clima Avançado', price: '19', icon: CloudRain },
  { id: 'docs', name: 'Documentação Extra', price: '29', icon: FileText },
  { id: 'finance', name: 'Financeiro Pro', price: '19', icon: DollarSign },
  { id: 'accounting', name: 'Relatórios Contábeis', price: '29', icon: PieChart },
];

const Subscriptions: React.FC<SubscriptionsProps> = ({ currentSubscription, setSubscription }) => {

  const handleUpgrade = (tier: PlanTier) => {
    if (confirm(`Deseja alterar seu plano para ${tier}? O valor será atualizado no próximo ciclo.`)) {
      setSubscription(prev => ({
        ...prev,
        plan: tier
      }));
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Escolha o poder da sua gestão</h2>
        <p className="text-slate-500 font-medium text-lg">
          Do plantio à colheita, temos o plano ideal para cada fase do seu crescimento rural.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div 
            key={plan.tier} 
            className={`relative flex flex-col p-8 rounded-[2.5rem] transition-all border-2 ${
              plan.highlight 
                ? 'bg-white border-emerald-500 shadow-2xl scale-105 z-10' 
                : 'bg-white border-slate-100 shadow-sm hover:border-slate-300'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                Mais Vendido
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-2xl ${plan.color}`}>
                <plan.icon size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">{plan.tier}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-slate-400">R$</span>
                  <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                  <span className="text-sm font-bold text-slate-400">/mês</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
              {plan.description}
            </p>

            <div className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 bg-emerald-100 text-emerald-600 rounded-full p-0.5">
                    <Check size={12} strokeWidth={4} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{feature}</span>
                </div>
              ))}
              {plan.notIncluded.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 opacity-40">
                  <div className="mt-1 bg-slate-100 text-slate-400 rounded-full p-0.5">
                    <Plus size={12} className="rotate-45" strokeWidth={4} />
                  </div>
                  <span className="text-sm font-medium text-slate-400">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleUpgrade(plan.tier)}
              disabled={currentSubscription.plan === plan.tier}
              className={`w-full py-5 rounded-[1.5rem] font-black text-lg transition-all shadow-xl flex items-center justify-center gap-2 ${
                currentSubscription.plan === plan.tier 
                  ? 'bg-slate-100 text-slate-400 cursor-default shadow-none' 
                  : plan.highlight 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100' 
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
              }`}
            >
              {currentSubscription.plan === plan.tier ? 'Plano Atual' : 'Contratar Plano'}
              {currentSubscription.plan !== plan.tier && <ArrowRight size={20} />}
            </button>
          </div>
        ))}
      </div>

      {/* Add-ons Section */}
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-5">
           <Zap size={200} />
        </div>
        <div className="relative z-10">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
              <div>
                 <h3 className="text-3xl font-black mb-2 flex items-center gap-3">
                    <Zap className="text-amber-400" /> Módulos Agro (Add-ons)
                 </h3>
                 <p className="text-slate-400 font-medium">Turbine sua gestão com recursos específicos sob demanda.</p>
              </div>
              <div className="bg-slate-800/80 px-6 py-4 rounded-2xl border border-slate-700">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Método de Pagamento</p>
                 <div className="flex items-center gap-3 font-bold">
                    <CreditCard size={18} className="text-emerald-400" /> **** 4492 (Stripe)
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ADDONS.map((addon) => (
                <div key={addon.id} className="bg-slate-800 p-6 rounded-[2rem] border border-slate-700 hover:border-emerald-500 transition-all group">
                   <div className="flex items-center justify-between mb-4">
                      <div className="bg-slate-700 p-3 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                         <addon.icon size={24} />
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] text-slate-500 font-black uppercase">R$</p>
                         <p className="text-xl font-black">{addon.price}<span className="text-[10px] text-slate-500">/mês</span></p>
                      </div>
                   </div>
                   <h4 className="font-bold mb-4">{addon.name}</h4>
                   <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-black text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
                      Contratar Módulo <Plus size={14} />
                   </button>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 pt-8 opacity-60">
         <div className="flex items-center gap-3">
            <ShieldCheck size={32} className="text-slate-400" />
            <div className="text-left">
               <p className="text-xs font-black text-slate-900 uppercase">Segurança Total</p>
               <p className="text-[10px] text-slate-500">Pagamentos processados via Stripe.</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <Activity size={32} className="text-slate-400" />
            <div className="text-left">
               <p className="text-xs font-black text-slate-900 uppercase">Disponibilidade</p>
               <p className="text-[10px] text-slate-500">SLA de 99.9% de uptime rural.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Subscriptions;

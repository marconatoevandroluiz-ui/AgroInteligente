
import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  Smartphone, 
  CreditCard, 
  CheckCircle2, 
  Camera,
  LogOut,
  Mail,
  Lock
} from 'lucide-react';

type SettingsTab = 'profile' | 'company' | 'notifications' | 'security';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [loading, setLoading] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Form states
  const [userName, setUserName] = useState('Evandro Produtor');
  const [userEmail, setUserEmail] = useState('evandro@agrointeligente.com.br');
  const [companyName, setCompanyName] = useState('AgroInteligente Soluções Agrícolas S.A.');
  const [taxId, setTaxId] = useState('12.345.678/0001-99');
  const [stateTaxId, setStateTaxId] = useState('987.654.321.000');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    }, 800);
  };

  const tabs = [
    { id: 'profile', label: 'Meu Perfil', icon: User },
    { id: 'company', label: 'Dados da Empresa', icon: Building2 },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Configurações do App</h2>
        <p className="text-slate-500 font-medium">Gerencie sua conta e preferências de sistema</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full lg:w-72 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm ${
                activeTab === tab.id 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-sm'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-slate-200">
             <button className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-500 font-bold text-sm hover:bg-rose-50 transition-all">
                <LogOut size={20} />
                Sair do Sistema
             </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden relative">
          <form onSubmit={handleSave} className="h-full flex flex-col">
            <div className="p-8 flex-1 overflow-y-auto space-y-8">
              
              {activeTab === 'profile' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                    <div className="relative group">
                       <img src="https://picsum.photos/120/120?random=1" className="w-24 h-24 rounded-3xl object-cover ring-4 ring-emerald-50" />
                       <button type="button" className="absolute -bottom-2 -right-2 p-2 bg-emerald-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                          <Camera size={16} />
                       </button>
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900">Sua Identidade</h3>
                       <p className="text-sm text-slate-500">Foto visível nos relatórios e para sua equipe.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                       <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            value={userName} 
                            onChange={e => setUserName(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail de Acesso</label>
                       <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            value={userEmail} 
                            onChange={e => setUserEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold"
                          />
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'company' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                   <div>
                      <h3 className="text-xl font-black text-slate-900">Informações Fiscais</h3>
                      <p className="text-sm text-slate-500">Estes dados são usados para emissão automática de romaneios e Livro Caixa.</p>
                   </div>
                   <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Razão Social / Nome da Propriedade</label>
                         <input 
                            value={companyName}
                            onChange={e => setCompanyName(e.target.value)}
                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold"
                         />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CNPJ / CPF</label>
                            <input 
                               value={taxId}
                               onChange={e => setTaxId(e.target.value)}
                               className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Inscrição Estadual (IE)</label>
                            <input 
                               value={stateTaxId}
                               onChange={e => setStateTaxId(e.target.value)}
                               className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold"
                            />
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Alertas e Avisos</h3>
                    <p className="text-sm text-slate-500">Escolha o que você quer ser notificado em tempo real.</p>
                  </div>
                  <div className="space-y-4">
                    {[
                      { id: 'weather', label: 'Previsão do Tempo e Pulverização', desc: 'Alertas diários sobre janelas climáticas ideais.' },
                      { id: 'stock', label: 'Estoque Baixo', desc: 'Notificar quando insumos atingirem nível crítico.' },
                      { id: 'docs', label: 'Vencimentos Legais', desc: 'Prazos de ITR, LCDPR e contratos de arrendamento.' },
                      { id: 'machines', label: 'Manutenção de Frota', desc: 'Aviso de horas trabalhadas atingidas para revisão.' }
                    ].map(pref => (
                      <label key={pref.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{pref.label}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{pref.desc}</p>
                        </div>
                        <div className="relative inline-block w-10 h-6">
                          <input type="checkbox" defaultChecked className="opacity-0 w-0 h-0 peer" />
                          <span className="absolute cursor-pointer inset-0 bg-slate-300 peer-checked:bg-emerald-500 rounded-full transition-all duration-300 before:absolute before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-300 peer-checked:before:translate-x-4"></span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Proteção de Dados</h3>
                    <p className="text-sm text-slate-500">Gerencie sua senha e autenticação em duas etapas.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <button type="button" className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col items-start gap-4 hover:bg-slate-800 transition-colors group">
                        <Lock className="text-amber-400 group-hover:scale-110 transition-transform" />
                        <div className="text-left">
                           <p className="font-bold">Alterar Senha</p>
                           <p className="text-[10px] text-slate-400">Recomendado a cada 90 dias.</p>
                        </div>
                     </button>
                     <button type="button" className="p-6 bg-white border-2 border-slate-100 rounded-3xl flex flex-col items-start gap-4 hover:border-emerald-500 transition-colors group">
                        <Smartphone className="text-emerald-600 group-hover:scale-110 transition-transform" />
                        <div className="text-left">
                           <p className="font-bold text-slate-900">Verificação em 2 Etapas</p>
                           <p className="text-[10px] text-slate-500">Ativado para seu celular.</p>
                        </div>
                     </button>
                  </div>
                </div>
              )}

            </div>

            {/* Sticky Footer Save Button */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 {showSaved && (
                   <span className="text-emerald-600 text-xs font-bold flex items-center gap-1 animate-in slide-in-from-left-2 duration-300">
                      <CheckCircle2 size={16} /> Alterações salvas com sucesso!
                   </span>
                 )}
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-black hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? 'Salvando...' : 'Salvar Preferências'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;

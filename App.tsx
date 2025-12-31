
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Package, 
  Users, 
  Truck, 
  FileText, 
  Bot, 
  Search, 
  Bell, 
  Menu,
  ChevronRight,
  Settings as SettingsIcon,
  Activity,
  Sprout,
  CreditCard,
  Lock,
  CloudUpload,
  RefreshCw
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import FarmsList from './components/FarmsList';
import Inventory from './components/Inventory';
import Fleet from './components/Fleet';
import AIHub from './components/AIHub';
import WeatherWidget from './components/WeatherWidget';
import DocumentSection from './components/DocumentSection';
import Collaborators from './components/Collaborators';
import Settings from './components/Settings';
import LivestockModule from './components/LivestockModule';
import Subscriptions from './components/Subscriptions';
import { MOCK_FARMS, MOCK_INVENTORY, MOCK_MACHINES, MOCK_HERD } from './constants';
import { Farm, InventoryItem, Machine, HerdLot, UserSubscription } from './types';
import { supabase } from './supabaseClient';

type Page = 'dashboard' | 'farms' | 'inventory' | 'fleet' | 'hr' | 'docs' | 'ai' | 'settings' | 'livestock' | 'subscription';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [dbLoading, setDbLoading] = useState(false);

  // Estado de Assinatura
  const [subscription, setSubscription] = useState<UserSubscription>({
    plan: 'Premium',
    status: 'Ativo',
    expiresAt: '2030-12-31',
    addOns: ['weather', 'docs', 'finance', 'accounting']
  });

  // Estados de Dados (Iniciam com MOCK, mas serão sobrescritos pelo Supabase)
  const [farms, setFarms] = useState<Farm[]>(MOCK_FARMS);
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [machines, setMachines] = useState<Machine[]>(MOCK_MACHINES);
  const [herd, setHerd] = useState<HerdLot[]>(MOCK_HERD);
  const [collaborators, setCollaborators] = useState<any[]>([
    { id: 'c1', name: 'João Silva', role: 'Tratorista', farm: 'Fazenda Vale do Boi', salary: 3500, status: 'Ativo', avatar: 'https://i.pravatar.cc/150?u=joao' },
    { id: 'c2', name: 'Maria Santos', role: 'Médica Veterinária', farm: 'Estância Pantaneira', salary: 8200, status: 'Ativo', avatar: 'https://i.pravatar.cc/150?u=maria' }
  ]);

  // Função para carregar dados do Supabase
  const fetchData = async () => {
    setDbLoading(true);
    try {
      const { data: farmsData } = await supabase.from('farms').select('*');
      if (farmsData && farmsData.length > 0) setFarms(farmsData);

      const { data: invData } = await supabase.from('inventory').select('*');
      if (invData && invData.length > 0) setInventory(invData);

      const { data: fleetData } = await supabase.from('machines').select('*');
      if (fleetData && fleetData.length > 0) setMachines(fleetData);

      const { data: herdData } = await supabase.from('herd_lots').select('*');
      if (herdData && herdData.length > 0) setHerd(herdData);
    } catch (error) {
      console.error("Erro ao buscar dados do Supabase:", error);
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers para sincronizar alterações com o Supabase
  const syncFarm = async (farm: Farm) => {
    await supabase.from('farms').upsert(farm);
    setFarms(prev => {
      const exists = prev.find(f => f.id === farm.id);
      return exists ? prev.map(f => f.id === farm.id ? farm : f) : [farm, ...prev];
    });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Geral', icon: LayoutDashboard, minPlan: 'Básico' },
    { id: 'farms', label: 'Fazendas / Lavouras', icon: Map, minPlan: 'Básico' },
    { id: 'livestock', label: 'Pecuária (Micro SaaS)', icon: Activity, minPlan: 'Básico' },
    { id: 'inventory', label: 'Almoxarifado', icon: Package, minPlan: 'Básico' },
    { id: 'fleet', label: 'Frota & Máquinas', icon: Truck, minPlan: 'Básico' },
    { id: 'hr', label: 'Equipe de Campo', icon: Users, minPlan: 'Básico' },
    { id: 'docs', label: 'Documentação / Fiscal', icon: FileText, minPlan: 'Premium', premiumOnly: true },
    { id: 'ai', label: 'Especialistas IA', icon: Bot, minPlan: 'Profissional' },
    { id: 'subscription', label: 'Meu Plano / Faturamento', icon: CreditCard, minPlan: 'Básico' },
    { id: 'settings', label: 'Configurações', icon: SettingsIcon, minPlan: 'Básico' },
  ];

  const canAccess = (itemId: string) => {
    if (subscription.plan === 'Premium') return true;
    if (subscription.plan === 'Profissional') return itemId !== 'docs';
    const basicAllowed = ['dashboard', 'farms', 'livestock', 'inventory', 'fleet', 'hr', 'settings', 'subscription'];
    return basicAllowed.includes(itemId);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className={`bg-slate-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'} flex flex-col shadow-xl z-20`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Sprout size={24} className="text-white" />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">AgroInteligente</span>}
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const hasAccess = canAccess(item.id);
            return (
              <button
                key={item.id}
                onClick={() => hasAccess ? setCurrentPage(item.id as Page) : setCurrentPage('subscription')}
                className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all relative ${
                  currentPage === item.id 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                } ${!hasAccess ? 'opacity-60 grayscale' : ''}`}
              >
                <item.icon size={22} />
                {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                {isSidebarOpen && !hasAccess && <Lock size={14} className="ml-auto text-amber-500" />}
                {isSidebarOpen && hasAccess && currentPage === item.id && <ChevronRight size={16} className="ml-auto" />}
              </button>
            );
          })}
        </nav>

        {isSidebarOpen && (
          <div className="m-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
             <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Supabase Cloud</p>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${dbLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                   <span className="text-[10px] font-bold text-slate-300">{dbLoading ? 'Sincronizando...' : 'Conectado'}</span>
                </div>
                <button onClick={fetchData} className="text-slate-500 hover:text-white transition-colors">
                   <RefreshCw size={12} className={dbLoading ? 'animate-spin' : ''} />
                </button>
             </div>
          </div>
        )}

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-3 text-slate-400 hover:text-white w-full p-2"
          >
            <Menu size={20} />
            {isSidebarOpen && <span className="text-sm">Recolher Menu</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto flex flex-col relative">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4 bg-slate-100 rounded-full px-4 py-2 w-96">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar no banco de dados..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-6">
            <WeatherWidget plan={subscription.plan} />
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={22} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">Evandro</p>
                <p className="text-xs text-slate-500">{subscription.plan} • Master Cloud</p>
              </div>
              <img src="https://picsum.photos/40/40?random=1" className="w-10 h-10 rounded-full ring-2 ring-emerald-500 shadow-md" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          {currentPage === 'dashboard' && <Dashboard farms={farms} plan={subscription.plan} />}
          {currentPage === 'farms' && <FarmsList farms={farms} setFarms={syncFarm as any} inventory={inventory} setInventory={setInventory} plan={subscription.plan} />}
          {currentPage === 'livestock' && <LivestockModule herd={herd} setHerd={setHerd} farms={farms} />}
          {currentPage === 'inventory' && <Inventory items={inventory} setItems={setInventory} farms={farms} />}
          {currentPage === 'fleet' && <Fleet machines={machines} setMachines={setMachines} farms={farms} setFarms={setFarms} />}
          {currentPage === 'ai' && <AIHub />}
          {currentPage === 'docs' && <DocumentSection plan={subscription.plan} />}
          {currentPage === 'hr' && <Collaborators collaborators={collaborators} setCollaborators={setCollaborators} farms={farms} setFarms={setFarms} />}
          {currentPage === 'settings' && <Settings />}
          {currentPage === 'subscription' && <Subscriptions currentSubscription={subscription} setSubscription={setSubscription} />}
        </div>
      </main>
    </div>
  );
};

export default App;

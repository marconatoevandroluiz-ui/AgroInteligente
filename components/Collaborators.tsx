
import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  X, 
  CheckCircle2, 
  Briefcase,
  MapPin,
  Edit2,
  Trash2,
  DollarSign,
  Truck,
  ShieldAlert,
  Calendar,
  Wallet,
  Loader2
} from 'lucide-react';
import { Farm } from '../types';

interface CollaboratorsProps {
  collaborators: any[];
  setCollaborators: React.Dispatch<React.SetStateAction<any[]>>;
  farms: Farm[];
  setFarms: React.Dispatch<React.SetStateAction<Farm[]>>;
}

type PaymentType = 'Salário' | 'Diária' | 'EPI';

const Collaborators: React.FC<CollaboratorsProps> = ({ collaborators, setCollaborators, farms, setFarms }) => {
  const [selectedColab, setSelectedColab] = useState<any | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentType>('Salário');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showColabSuccess, setShowColabSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingColab, setEditingColab] = useState<any | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [farmId, setFarmId] = useState('');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState('Ativo');

  // Payment states
  const [paymentValue, setPaymentValue] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  const handleOpenForm = (c?: any) => {
    if (c) {
      setEditingColab(c);
      setName(c.name);
      setRole(c.role);
      const farm = farms.find(f => f.name === c.farm);
      setFarmId(farm?.id || farms[0]?.id || '');
      setSalary(c.salary?.toString() || '');
      setStatus(c.status || 'Ativo');
    } else {
      setEditingColab(null);
      setName('');
      setRole('');
      setFarmId(farms.length > 0 ? farms[0].id : '');
      setSalary('');
      setStatus('Ativo');
    }
    setShowForm(true);
  };

  const handleSaveColab = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const farm = farms.find(f => f.id === farmId);
      const data = {
        id: editingColab?.id || Math.random().toString(36).substr(2, 9),
        name, 
        role, 
        farm: farm?.name || 'Sem Fazenda', 
        salary: parseFloat(salary) || 0, 
        status,
        avatar: editingColab?.avatar || `https://i.pravatar.cc/150?u=${Math.random()}`
      };

      if (editingColab) {
        setCollaborators(prev => prev.map(c => c.id === editingColab.id ? data : c));
      } else {
        setCollaborators(prev => [data, ...prev]);
      }
      
      setLoading(false);
      setShowColabSuccess(true);
      
      setTimeout(() => {
        setShowColabSuccess(false);
        setShowForm(false);
        setEditingColab(null);
      }, 1000);
    }, 600);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este colaborador da base?')) {
      setCollaborators(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleOpenPayment = (colab: any, type: PaymentType) => {
    setSelectedColab(colab);
    setPaymentType(type);
    setPaymentValue(type === 'Salário' ? colab.salary.toString() : '');
    setPaymentDate(new Date().toISOString().split('T')[0]);
  };

  const handleLaunchPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const val = parseFloat(paymentValue);
      const farm = farms.find(f => f.name === selectedColab.farm);
      
      if (farm) {
        setFarms(prev => prev.map(f => 
          f.id === farm.id ? { ...f, expenses: f.expenses + val } : f
        ));
      }

      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedColab(null);
      }, 1200);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Users size={32} className="text-emerald-600" /> Gestão de Equipe
          </h2>
          <p className="text-slate-500 font-medium">Controle de pessoal, pagamentos de salários, diárias e EPIs</p>
        </div>
        <button onClick={() => handleOpenForm()} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-emerald-700 transition-all">
          <Plus size={20} /> Cadastrar Colaborador
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {collaborators.map(colab => (
          <div key={colab.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm group relative hover:shadow-xl transition-all">
            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
               <button onClick={() => handleOpenForm(colab)} className="p-2 bg-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 transition-colors"><Edit2 size={16}/></button>
               <button onClick={(e) => handleDelete(e, colab.id)} className="p-2 bg-rose-50 rounded-xl text-rose-400 hover:text-rose-600 transition-colors"><Trash2 size={16}/></button>
            </div>

            <div className="flex items-center gap-6 mb-8">
              <img src={colab.avatar} className="w-20 h-20 rounded-[1.5rem] object-cover ring-4 ring-slate-50 shadow-md" />
              <div>
                <h4 className="font-black text-slate-900 text-xl leading-tight">{colab.name}</h4>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-bold uppercase tracking-tight">
                  <Briefcase size={12} className="text-emerald-500" /> {colab.role}
                </div>
                <div className="text-[10px] text-blue-600 font-black mt-2 flex items-center gap-1 uppercase bg-blue-50 px-2 py-0.5 rounded-full w-fit">
                  <MapPin size={10}/> {colab.farm}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Situação</p>
                <p className={`text-xs font-black ${colab.status === 'Ativo' ? 'text-emerald-600' : 'text-amber-600'}`}>{colab.status}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Salário Mensal</p>
                <p className="text-xs font-black text-slate-900">R$ {colab.salary?.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => handleOpenPayment(colab, 'Salário')} 
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-50"
              >
                <Wallet size={18} /> Lançar Pagamento Salário
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleOpenPayment(colab, 'Diária')} 
                  className="py-3 bg-blue-50 text-blue-700 border border-blue-100 rounded-2xl font-black text-[10px] flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Truck size={14} /> Pagar Diária
                </button>
                <button 
                  onClick={() => handleOpenPayment(colab, 'EPI')} 
                  className="py-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-2xl font-black text-[10px] flex items-center justify-center gap-2 hover:bg-rose-600 hover:text-white transition-all"
                >
                  <ShieldAlert size={14} /> Gasto com EPI
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Cadastro/Edição de Colaborador */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !loading && setShowForm(false)}></div>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
            {showColabSuccess ? (
              <div className="p-16 text-center flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={56} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mt-4">Dados Salvos!</h3>
              </div>
            ) : (
              <div className="p-10">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{editingColab ? 'Editar Colaborador' : 'Novo Colaborador'}</h3>
                  <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={28}/></button>
                </div>
                <form onSubmit={handleSaveColab} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Nome Completo</label>
                    <input required value={name} onChange={e => setName(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Cargo / Função</label>
                    <input required value={role} onChange={e => setRole(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Fazenda Alocada</label>
                    <select value={farmId} onChange={e => setFarmId(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold">
                      {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Salário Base (R$)</label>
                      <input type="number" required value={salary} onChange={e => setSalary(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Status</label>
                      <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold">
                        <option value="Ativo">Ativo</option>
                        <option value="Férias">Férias</option>
                        <option value="Afastado">Afastado</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={24} /> : (editingColab ? 'Atualizar Colaborador' : 'Salvar no Sistema')}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Lançamento Financeiro (Salário, Diária, EPI) */}
      {selectedColab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !loading && setSelectedColab(null)}></div>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
            {showSuccess ? (
              <div className="p-16 text-center flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 size={56} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Lançamento Efetuado!</h3>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Debitado da conta da: {selectedColab.farm}</p>
              </div>
            ) : (
              <>
                <div className={`p-8 border-b border-slate-100 flex items-center justify-between ${
                  paymentType === 'Salário' ? 'bg-emerald-50' : 
                  paymentType === 'Diária' ? 'bg-blue-50' : 'bg-rose-50'
                }`}>
                  <div className="flex items-center gap-4">
                    <img src={selectedColab.avatar} className="w-16 h-16 rounded-2xl shadow-md ring-2 ring-white" />
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Lançar {paymentType}</h3>
                      <p className="text-xs text-slate-500 font-bold">{selectedColab.name}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedColab(null)} className="p-2 text-slate-400 hover:text-slate-600"><X size={28} /></button>
                </div>
                <form onSubmit={handleLaunchPayment} className="p-10 space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Valor (R$)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                          required 
                          type="number" 
                          step="0.01"
                          value={paymentValue}
                          onChange={e => setPaymentValue(e.target.value)}
                          placeholder="0,00" 
                          className="w-full pl-12 pr-4 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-black text-2xl" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Data</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                          required 
                          type="date" 
                          value={paymentDate}
                          onChange={e => setPaymentDate(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold" 
                        />
                      </div>
                    </div>
                  </div>
                  <button 
                    disabled={loading || !paymentValue}
                    type="submit" 
                    className={`w-full py-5 text-white rounded-[1.5rem] font-black text-lg transition-all shadow-xl shadow-slate-100 ${
                      paymentType === 'Salário' ? 'bg-emerald-600 hover:bg-emerald-700' : 
                      paymentType === 'Diária' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-rose-600 hover:bg-rose-700'
                    }`}
                  >
                    {loading ? 'Processando Lançamento...' : `Confirmar Lançamento`}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Collaborators;

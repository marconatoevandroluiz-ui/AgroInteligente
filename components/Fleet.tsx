
import React, { useState } from 'react';
import { Machine, Farm } from '../types';
import { 
  Fuel, 
  Timer, 
  Activity, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Wrench, 
  DollarSign, 
  CheckCircle2,
  ClipboardCheck,
  Zap,
  Droplets,
  Tractor
} from 'lucide-react';

interface FleetProps {
  machines: Machine[];
  setMachines: React.Dispatch<React.SetStateAction<Machine[]>>;
  farms: Farm[];
  setFarms: React.Dispatch<React.SetStateAction<Farm[]>>;
}

const Fleet: React.FC<FleetProps> = ({ machines, setMachines, farms, setFarms }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  
  // Modal de despesa
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedMachineForExpense, setSelectedMachineForExpense] = useState<Machine | null>(null);
  const [expenseValue, setExpenseValue] = useState('');
  const [expenseType, setExpenseType] = useState('Manutenção');
  const [expenseFarmId, setExpenseFarmId] = useState('');

  // Modal de RUV
  const [showRuvModal, setShowRuvModal] = useState(false);
  const [selectedMachineForRuv, setSelectedMachineForRuv] = useState<Machine | null>(null);
  const [ruvHoursEnd, setRuvHoursEnd] = useState('');
  const [ruvFuelEnd, setRuvFuelEnd] = useState('');
  const [ruvChecks, setRuvChecks] = useState({
    pneus: false,
    oleo: false,
    agua: false,
    limpeza: false,
    eletrica: false,
    implemento: false
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState<Machine['status']>('Operacional');
  const [hours, setHours] = useState('');
  const [fuel, setFuel] = useState('');

  const handleOpenForm = (m?: Machine) => {
    if (m) {
      setEditingMachine(m);
      setName(m.name);
      setType(m.type);
      setStatus(m.status);
      setHours(m.hoursWorked.toString());
      setFuel(m.fuelLevel.toString());
    } else {
      setEditingMachine(null);
      setName('');
      setType('');
      setStatus('Operacional');
      setHours('0');
      setFuel('100');
    }
    setShowForm(true);
  };

  const handleOpenExpense = (m: Machine) => {
    setSelectedMachineForExpense(m);
    setExpenseValue('');
    setExpenseType('Manutenção');
    setExpenseFarmId(farms[0]?.id || '');
    setShowExpenseModal(true);
  };

  const handleOpenRuv = (m: Machine) => {
    setSelectedMachineForRuv(m);
    setRuvHoursEnd((m.hoursWorked + 1).toString());
    setRuvFuelEnd(m.fuelLevel.toString());
    setRuvChecks({
      pneus: false, oleo: false, agua: false, limpeza: false, eletrica: false, implemento: false
    });
    setShowRuvModal(true);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Excluir esta máquina da frota?')) {
      setMachines(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Machine = {
      id: editingMachine?.id || Math.random().toString(36).substr(2, 9),
      name, type, status, hoursWorked: parseFloat(hours), fuelLevel: parseFloat(fuel)
    };
    if (editingMachine) setMachines(prev => prev.map(m => m.id === editingMachine.id ? data : m));
    else setMachines(prev => [data, ...prev]);
    
    setShowForm(false);
    setEditingMachine(null);
  };

  const handleConfirmExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseFarmId || !expenseValue) return;
    setLoading(true);
    setTimeout(() => {
      const val = parseFloat(expenseValue);
      setFarms(prev => prev.map(f => f.id === expenseFarmId ? { ...f, expenses: f.expenses + val } : f));
      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); setShowExpenseModal(false); }, 1000);
    }, 500);
  };

  const handleConfirmRuv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMachineForRuv) return;
    setLoading(true);
    setTimeout(() => {
      const newHours = parseFloat(ruvHoursEnd);
      const newFuel = parseFloat(ruvFuelEnd);
      
      setMachines(prev => prev.map(m => 
        m.id === selectedMachineForRuv.id 
          ? { ...m, hoursWorked: newHours, fuelLevel: newFuel } 
          : m
      ));

      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowRuvModal(false);
        setSelectedMachineForRuv(null);
      }, 1000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Frota de Máquinas</h2>
          <p className="text-sm text-slate-500 font-medium">Gestão de ativos e custos operacionais</p>
        </div>
        <button onClick={() => handleOpenForm()} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-emerald-700 transition-colors">
          <Plus size={20} /> Nova Máquina
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {machines.map((machine) => (
          <div key={machine.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative group hover:shadow-md transition-all">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button onClick={() => handleOpenForm(machine)} className="p-1.5 bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"><Edit2 size={14} /></button>
              <button onClick={(e) => handleDelete(e, machine.id)} className="p-1.5 bg-rose-50 rounded-lg text-rose-400 hover:text-rose-600 transition-colors"><Trash2 size={14} /></button>
            </div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-3 rounded-2xl text-slate-600"><Tractor size={24} /></div>
                <div>
                  <h4 className="font-bold text-slate-900 leading-tight">{machine.name}</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">{machine.type}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight ${
                machine.status === 'Operacional' ? 'bg-emerald-100 text-emerald-700' : 
                machine.status === 'Manutenção' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {machine.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 flex items-center gap-1 font-bold uppercase tracking-tighter"><Timer size={12}/> Horas Acum.</p>
                <p className="text-lg font-black text-slate-800">{machine.hoursWorked}h</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 flex items-center gap-1 font-bold uppercase tracking-tighter"><Fuel size={12}/> Combustível</p>
                <p className="text-lg font-black text-slate-800">{machine.fuelLevel}%</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleOpenRuv(machine)}
                className="py-3 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-100 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <ClipboardCheck size={16} /> RUV / Checklist
              </button>
              <button 
                onClick={() => handleOpenExpense(machine)}
                className="py-3 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-100 hover:border-rose-100 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <DollarSign size={16} /> Lançar Gasto
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal RUV (Checklist) */}
      {showRuvModal && selectedMachineForRuv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => !loading && setShowRuvModal(false)}></div>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden">
            {showSuccess ? (
              <div className="p-20 text-center animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={56} />
                </div>
                <h3 className="text-3xl font-black text-slate-900">RUV Finalizado!</h3>
                <p className="text-slate-500 font-medium">Dados de horas e combustível atualizados com sucesso.</p>
              </div>
            ) : (
              <>
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-600 text-white rounded-2xl"><ClipboardCheck size={28} /></div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">RUV - Relatório de Utilização</h3>
                      <p className="text-sm text-slate-500 font-medium">{selectedMachineForRuv.name}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowRuvModal(false)} className="p-2 text-slate-400 hover:text-slate-600"><X size={28}/></button>
                </div>

                <form onSubmit={handleConfirmRuv} className="p-8 space-y-8 max-h-[75vh] overflow-y-auto">
                  {/* Horímetros e Combustível */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Leituras do Horímetro</h4>
                      <div className="flex gap-4">
                        <div className="flex-1 p-4 bg-slate-100 rounded-2xl border border-slate-200">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Inicial</p>
                          <p className="text-xl font-black text-slate-900">{selectedMachineForRuv.hoursWorked}h</p>
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Final (Atual)</label>
                          <input 
                            required 
                            type="number" 
                            step="0.1"
                            value={ruvHoursEnd} 
                            onChange={e => setRuvHoursEnd(e.target.value)}
                            className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-xl outline-none focus:border-emerald-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nível de Combustível</h4>
                      <div className="relative pt-8">
                        <input 
                          type="range" 
                          min="0" max="100" 
                          value={ruvFuelEnd}
                          onChange={e => setRuvFuelEnd(e.target.value)}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                          <span>VAZIO</span>
                          <span className="text-emerald-600 text-lg font-black">{ruvFuelEnd}%</span>
                          <span>CHEIO</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Checklist Visual */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Checklist de Inspeção Operacional</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.keys(ruvChecks).map((key) => (
                        <label key={key} className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${ruvChecks[key as keyof typeof ruvChecks] ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200'}`}>
                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={ruvChecks[key as keyof typeof ruvChecks]}
                            onChange={() => setRuvChecks(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                          />
                          <div className={`p-2 rounded-lg ${ruvChecks[key as keyof typeof ruvChecks] ? 'bg-emerald-600 text-white' : 'bg-slate-200'}`}>
                            {key === 'pneus' && <Activity size={16} />}
                            {key === 'oleo' && <Droplets size={16} />}
                            {key === 'agua' && <Droplets size={16} />}
                            {key === 'limpeza' && <Sparkles size={16} />}
                            {key === 'eletrica' && <Zap size={16} />}
                            {key === 'implemento' && <Tractor size={16} />}
                          </div>
                          <span className="text-xs font-bold capitalize">{key}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      disabled={loading}
                      type="submit" 
                      className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3"
                    >
                      {loading ? 'Processando Relatório...' : <><ClipboardCheck size={24}/> Finalizar Utilização (RUV)</>}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal Cadastro/Edição de Máquina */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingMachine ? 'Editar Máquina' : 'Nova Máquina'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input required value={name} onChange={e => setName(e.target.value)} placeholder="Nome da Máquina" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" />
              <input value={type} onChange={e => setType(e.target.value)} placeholder="Tipo (Ex: Trator, Colheitadeira)" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" />
              <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full p-4 bg-slate-50 border rounded-2xl outline-none"><option value="Operacional">Operacional</option><option value="Manutenção">Manutenção</option><option value="Parado">Parado</option></select>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" value={hours} onChange={e => setHours(e.target.value)} placeholder="Horas" className="p-4 bg-slate-50 border rounded-2xl outline-none" />
                <input type="number" value={fuel} onChange={e => setFuel(e.target.value)} placeholder="Combustível %" className="p-4 bg-slate-50 border rounded-2xl outline-none" />
              </div>
              <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all">Salvar Alterações</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Despesa */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !loading && setShowExpenseModal(false)}></div>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
            {showSuccess ? (
              <div className="p-16 text-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Despesa Lançada!</h3>
                <p className="text-slate-500">Custo registrado no centro de custo da fazenda.</p>
              </div>
            ) : (
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><DollarSign size={24} /></div>
                    <div>
                      <h3 className="text-xl font-bold">Lançar Gasto</h3>
                      <p className="text-sm text-slate-500">{selectedMachineForExpense?.name}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowExpenseModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
                </div>
                
                <form onSubmit={handleConfirmExpense} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Fazenda (Centro de Custo)</label>
                      <select required value={expenseFarmId} onChange={e => setExpenseFarmId(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold">
                        {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tipo</label>
                        <select value={expenseType} onChange={e => setExpenseType(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none">
                          <option value="Manutenção">Manutenção</option>
                          <option value="Combustível">Combustível</option>
                          <option value="Peças">Peças</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Valor (R$)</label>
                        <input required type="number" step="0.01" value={expenseValue} onChange={e => setExpenseValue(e.target.value)} placeholder="0.00" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-lg" />
                      </div>
                    </div>
                  </div>
                  <button disabled={loading} type="submit" className="w-full py-5 bg-rose-600 text-white rounded-3xl font-bold hover:bg-rose-700 transition-all">Confirmar Lançamento</button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Fleet;

// Ícone faltante no import
const Sparkles: React.FC<{size?: number, className?: string}> = ({size=24, className=""}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="m5 3 1 1"/><path d="m19 17 1 1"/><path d="M3 5l1 1"/><path d="M17 19l1 1"/><path d="m5 21 1-1"/><path d="m19 3 1 1"/><path d="M3 19l1-1"/><path d="M17 5l1-1"/>
  </svg>
);

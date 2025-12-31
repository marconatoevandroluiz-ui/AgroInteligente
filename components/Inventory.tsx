
import React, { useState } from 'react';
import { InventoryItem, Farm } from '../types';
import { AlertCircle, Plus, Edit2, Trash2, X, ArrowDownCircle, CheckCircle2 } from 'lucide-react';

interface InventoryProps {
  items: InventoryItem[];
  setItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  farms: Farm[];
}

const Inventory: React.FC<InventoryProps> = ({ items, setItems, farms }) => {
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryItem['category']>('Insumo');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [minLevel, setMinLevel] = useState('');

  // Usage states
  const [selectedItemForUsage, setSelectedItemForUsage] = useState<InventoryItem | null>(null);
  const [usageQty, setUsageQty] = useState('');
  const [selectedFarmId, setSelectedFarmId] = useState('');

  const handleOpenForm = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item);
      setName(item.name);
      setCategory(item.category);
      setQuantity(item.quantity.toString());
      setUnit(item.unit);
      setMinLevel(item.minLevel.toString());
    } else {
      setEditingItem(null);
      setName('');
      setCategory('Insumo');
      setQuantity('');
      setUnit('kg');
      setMinLevel('');
    }
    setShowForm(true);
  };

  const handleOpenUsage = (item: InventoryItem) => {
    setSelectedItemForUsage(item);
    setUsageQty('');
    setSelectedFarmId(farms[0]?.id || '');
    setShowUsageModal(true);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Excluir este item do estoque?')) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const newItem: InventoryItem = {
        id: editingItem?.id || Math.random().toString(36).substr(2, 9),
        name, category, quantity: parseFloat(quantity), unit, minLevel: parseFloat(minLevel)
      };
      if (editingItem) {
        setItems(prev => prev.map(i => i.id === editingItem.id ? newItem : i));
      } else {
        setItems(prev => [newItem, ...prev]);
      }
      setLoading(false);
      setShowForm(false);
    }, 400);
  };

  const handleConfirmUsage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForUsage) return;
    setLoading(true);

    setTimeout(() => {
      const qty = parseFloat(usageQty);
      setItems(prev => prev.map(item => 
        item.id === selectedItemForUsage.id 
          ? { ...item, quantity: Math.max(0, item.quantity - qty) }
          : item
      ));

      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowUsageModal(false);
        setSelectedItemForUsage(null);
      }, 1000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Estoque</h2>
          <p className="text-sm text-slate-500">Controle total de insumos e grãos</p>
        </div>
        <button onClick={() => handleOpenForm()} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-lg flex items-center gap-2">
          <Plus size={20} /> Novo Item
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase">Item</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase">Categoria</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase">Saldo</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase text-center">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5 font-bold text-slate-900">{item.name}</td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded uppercase tracking-wider text-slate-500">{item.category}</span>
                  </td>
                  <td className="px-6 py-5 font-black text-slate-700">{item.quantity.toLocaleString()} {item.unit}</td>
                  <td className="px-6 py-5 text-center">
                    {item.quantity <= item.minLevel ? (
                      <span className="text-rose-600 text-[10px] font-bold flex items-center justify-center gap-1 bg-rose-50 px-2 py-1 rounded-full border border-rose-100 uppercase tracking-tighter">
                        <AlertCircle size={12}/> Crítico
                      </span>
                    ) : (
                      <span className="text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 uppercase tracking-tighter">Normal</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenUsage(item)} 
                        title="Dar Baixa (Registrar Uso)"
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        <ArrowDownCircle size={18}/>
                      </button>
                      <button onClick={() => handleOpenForm(item)} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Edit2 size={18}/></button>
                      <button onClick={(e) => handleDelete(e, item.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo/Editar Item */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !loading && setShowForm(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingItem ? 'Editar Item' : 'Novo Item'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input required value={name} onChange={e => setName(e.target.value)} placeholder="Nome" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" />
              <div className="grid grid-cols-2 gap-4">
                <select value={category} onChange={e => setCategory(e.target.value as any)} className="p-4 bg-slate-50 border rounded-2xl outline-none"><option value="Insumo">Insumo</option><option value="Grão">Grão</option><option value="Combustível">Combustível</option><option value="Animal">Animal</option></select>
                <input value={unit} onChange={e => setUnit(e.target.value)} placeholder="Unidade (kg, sc...)" className="p-4 bg-slate-50 border rounded-2xl outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Saldo" className="p-4 bg-slate-50 border rounded-2xl outline-none" />
                <input type="number" value={minLevel} onChange={e => setMinLevel(e.target.value)} placeholder="Nível Mínimo" className="p-4 bg-slate-50 border rounded-2xl outline-none" />
              </div>
              <button disabled={loading} type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all">{loading ? 'Salvando...' : 'Salvar Alterações'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Uso (Dar Baixa) */}
      {showUsageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !loading && setShowUsageModal(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
            {showSuccess ? (
              <div className="p-16 text-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Uso Registrado!</h3>
                <p className="text-slate-500">O estoque físico foi atualizado.</p>
              </div>
            ) : (
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold">Dar Baixa no Estoque</h3>
                    <p className="text-sm text-slate-500">Registrar aplicação de insumo ou consumo</p>
                  </div>
                  <button onClick={() => setShowUsageModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
                </div>
                <form onSubmit={handleConfirmUsage} className="space-y-6">
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <p className="text-xs font-bold text-amber-700 uppercase mb-1">Item Selecionado</p>
                    <p className="text-lg font-black text-amber-900">{selectedItemForUsage?.name}</p>
                    <p className="text-xs text-amber-600 font-medium">Saldo Atual: {selectedItemForUsage?.quantity} {selectedItemForUsage?.unit}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Fazenda Destino</label>
                      <select 
                        required 
                        value={selectedFarmId} 
                        onChange={e => setSelectedFarmId(e.target.value)}
                        className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-bold"
                      >
                        {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Quantidade Utilizada</label>
                      <div className="relative">
                        <input 
                          required 
                          type="number" 
                          step="any"
                          value={usageQty} 
                          onChange={e => setUsageQty(e.target.value)} 
                          placeholder="0.00"
                          className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-bold text-lg pr-16"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">{selectedItemForUsage?.unit}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    disabled={loading || !usageQty} 
                    type="submit" 
                    className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-100 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Processando...' : <><ArrowDownCircle size={20}/> Confirmar Baixa</>}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

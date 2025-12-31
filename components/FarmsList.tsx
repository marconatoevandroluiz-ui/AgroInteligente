
import React, { useState, useEffect } from 'react';
import { Farm, FarmType, InventoryItem } from '../types';
import { 
  MapPin, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Edit2, 
  Trash2, 
  Plus 
} from 'lucide-react';

interface FarmsListProps {
  farms: Farm[];
  setFarms: React.Dispatch<React.SetStateAction<Farm[]>>;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

type TransactionType = 'Produção' | 'Despesa' | 'Venda' | 'Cadastro' | 'Nenhum';

const FarmsList: React.FC<FarmsListProps> = ({ farms, setFarms, inventory, setInventory }) => {
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [selectedType, setSelectedType] = useState<TransactionType>('Nenhum');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [farmName, setFarmName] = useState('');
  const [farmType, setFarmType] = useState<FarmType>('Propria');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmArea, setFarmArea] = useState('');
  const [farmCrops, setFarmCrops] = useState('');
  // Missing properties state added to satisfy Farm interface
  const [farmIsLivestockActive, setFarmIsLivestockActive] = useState(true);
  const [farmPiquetesCount, setFarmPiquetesCount] = useState('0');

  const [unitPrice, setUnitPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [totalValue, setTotalValue] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  useEffect(() => {
    if (selectedType === 'Venda' && unitPrice && quantity) {
      const total = parseFloat(unitPrice) * parseFloat(quantity);
      setTotalValue(total.toFixed(2));
    }
  }, [unitPrice, quantity, selectedType]);

  const handleOpenTransaction = (farm: Farm, type: TransactionType) => {
    setSelectedFarm(farm);
    setSelectedType(type);
    setUnitPrice('');
    setQuantity('');
    setTotalValue('');
    setSelectedProduct(farm.mainCrops[0] || '');
  };

  const handleOpenFarmForm = (farm?: Farm) => {
    setSelectedType('Cadastro');
    if (farm) {
      setSelectedFarm(farm);
      setFarmName(farm.name);
      setFarmType(farm.type);
      setFarmLocation(farm.location);
      setFarmArea(farm.productiveArea.toString());
      setFarmCrops(farm.mainCrops.join(', '));
      // Populate added states
      setFarmIsLivestockActive(farm.isLivestockActive);
      setFarmPiquetesCount(farm.piquetesCount.toString());
    } else {
      setSelectedFarm(null);
      setFarmName('');
      setFarmType('Propria');
      setFarmLocation('');
      setFarmArea('');
      setFarmCrops('');
      // Reset added states
      setFarmIsLivestockActive(true);
      setFarmPiquetesCount('0');
    }
  };

  const handleCloseModal = () => {
    setSelectedFarm(null);
    setSelectedType('Nenhum');
    setShowSuccess(false);
    setLoading(false);
  };

  const handleDeleteFarm = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir esta fazenda? Todos os dados vinculados serão perdidos.')) {
      setFarms(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      if (selectedType === 'Cadastro') {
        // Fix: Added missing properties to satisfy the 'Farm' interface
        const farmData: Farm = {
          id: selectedFarm?.id || Math.random().toString(36).substr(2, 9),
          name: farmName,
          type: farmType,
          location: farmLocation,
          productiveArea: parseFloat(farmArea),
          totalArea: parseFloat(farmArea) * 1.2,
          mainCrops: farmCrops.split(',').map(s => s.trim()),
          revenue: selectedFarm?.revenue || 0,
          expenses: selectedFarm?.expenses || 0,
          livestockHeadCount: selectedFarm?.livestockHeadCount || 0,
          piquetesCount: parseInt(farmPiquetesCount) || 0,
          isLivestockActive: farmIsLivestockActive
        };

        if (selectedFarm) {
          setFarms(prev => prev.map(f => f.id === selectedFarm.id ? farmData : f));
        } else {
          setFarms(prev => [farmData, ...prev]);
        }
      } else if (selectedType === 'Venda' && selectedFarm) {
        const val = parseFloat(totalValue);
        const qty = parseFloat(quantity);

        // 1. Atualizar Receita da Fazenda (Entra pro saldo adm central via Dashboard)
        setFarms(prev => prev.map(f => 
          f.id === selectedFarm.id ? { ...f, revenue: f.revenue + val } : f
        ));

        // 2. Dar baixa no estoque se for Milho ou outro grão estocado
        const stockItem = inventory.find(i => i.name.toLowerCase().includes(selectedProduct.toLowerCase()));
        if (stockItem) {
          setInventory(prev => prev.map(item => 
            item.id === stockItem.id 
              ? { ...item, quantity: Math.max(0, item.quantity - qty) }
              : item
          ));
        }
      } else if (selectedType === 'Despesa' && selectedFarm) {
        const val = parseFloat(totalValue || unitPrice);
        setFarms(prev => prev.map(f => 
          f.id === selectedFarm.id ? { ...f, expenses: f.expenses + val } : f
        ));
      }

      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        handleCloseModal();
      }, 1000);
    }, 500);
  };

  const isModalOpen = selectedType !== 'Nenhum';

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Minhas Fazendas</h2>
          <p className="text-sm text-slate-500 font-medium">Gerencie suas propriedades e centros de custo</p>
        </div>
        <button onClick={() => handleOpenFarmForm()} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg flex items-center gap-2">
          <Plus size={18} /> Nova Fazenda
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.map((farm) => (
          <div key={farm.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden group flex flex-col relative">
            <div className="h-44 bg-slate-200 relative overflow-hidden">
              <img src={`https://picsum.photos/600/400?random=${farm.id}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={farm.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={() => handleOpenFarmForm(farm)} className="p-2 bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-slate-900 rounded-xl transition-all"><Edit2 size={16} /></button>
                <button onClick={(e) => handleDeleteFarm(farm.id, e)} className="p-2 bg-rose-50/80 backdrop-blur-md text-white hover:bg-rose-600 rounded-xl transition-all"><Trash2 size={16} /></button>
              </div>

              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full text-white shadow-lg backdrop-blur-md ${farm.type === 'Propria' ? 'bg-emerald-500/80' : 'bg-blue-500/80'}`}>
                  {farm.type}
                </span>
              </div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-xl font-bold text-white mb-0.5">{farm.name}</h3>
                <div className="flex items-center gap-1 text-emerald-50 text-xs font-medium"><MapPin size={12} /><span>{farm.location}</span></div>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100"><p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Área Produtiva</p><p className="text-sm font-bold text-slate-800">{farm.productiveArea} ha</p></div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100"><p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Culturas</p><p className="text-sm font-bold text-slate-800 truncate">{farm.mainCrops.join(', ')}</p></div>
              </div>

              <div className="grid grid-cols-1 gap-2 mb-6">
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => handleOpenTransaction(farm, 'Produção')} className="group/btn py-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-100 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all"><TrendingUp size={16} />Produção</button>
                  <button onClick={() => handleOpenTransaction(farm, 'Despesa')} className="group/btn py-3 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-100 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all"><TrendingDown size={16} />Despesa</button>
                </div>
                <button onClick={() => handleOpenTransaction(farm, 'Venda')} className="group/btn py-3 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-100 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all"><ShoppingCart size={16} />Registrar Venda</button>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-auto flex items-center justify-between">
                <div><p className="text-[10px] text-slate-400 font-bold uppercase">Resultado Est.</p><p className="text-lg font-black text-slate-900 tracking-tight">R$ {((farm.revenue - farm.expenses)/1000).toFixed(0)}k</p></div>
                <button className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-md"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !loading && handleCloseModal()}></div>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
            {showSuccess ? (
              <div className="p-16 text-center flex flex-col items-center gap-4"><div className="w-24 h-24 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600"><CheckCircle2 size={56} /></div><h3 className="text-2xl font-black text-slate-900 mt-4">Sucesso!</h3></div>
            ) : (
              <>
                <div className={`p-8 border-b border-slate-100 flex items-center justify-between ${selectedType === 'Cadastro' ? 'bg-slate-50' : selectedType === 'Produção' ? 'bg-emerald-50/50' : selectedType === 'Despesa' ? 'bg-rose-50/50' : 'bg-blue-50/50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${selectedType === 'Cadastro' ? 'bg-slate-900 text-white' : selectedType === 'Produção' ? 'bg-emerald-600 text-white' : selectedType === 'Despesa' ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'}`}>
                      {selectedType === 'Cadastro' ? <Plus size={28} /> : selectedType === 'Produção' ? <ArrowUpCircle size={28} /> : selectedType === 'Despesa' ? <ArrowDownCircle size={28} /> : <ShoppingCart size={28} />}
                    </div>
                    <div><h3 className="text-xl font-black text-slate-900 tracking-tight">{selectedType === 'Cadastro' ? (selectedFarm ? 'Editar Fazenda' : 'Nova Fazenda') : selectedType === 'Venda' ? 'Registrar Venda' : `Registrar ${selectedType}`}</h3><p className="text-sm text-slate-500 font-medium">Configuração de unidade de custo</p></div>
                  </div>
                  <button onClick={handleCloseModal} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400"><X size={24} /></button>
                </div>
                <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                  {selectedType === 'Cadastro' ? (
                    <div className="space-y-4">
                      <div><label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nome</label><input required value={farmName} onChange={e => setFarmName(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tipo</label><select value={farmType} onChange={e => setFarmType(e.target.value as FarmType)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none"><option value="Propria">Própria</option><option value="Arrendada">Arrendada</option></select></div>
                        <div><label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Área (ha)</label><input required type="number" value={farmArea} onChange={e => setFarmArea(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none" /></div>
                      </div>
                      <div><label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Localização</label><input required value={farmLocation} onChange={e => setFarmLocation(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Qtd Piquetes</label><input required type="number" value={farmPiquetesCount} onChange={e => setFarmPiquetesCount(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none" /></div>
                        <div className="flex flex-col justify-end">
                          <label className="flex items-center gap-3 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl cursor-pointer">
                            <input type="checkbox" checked={farmIsLivestockActive} onChange={e => setFarmIsLivestockActive(e.target.checked)} className="w-5 h-5 accent-emerald-600" />
                            <span className="text-xs font-bold text-slate-700">Pecuária Ativa</span>
                          </label>
                        </div>
                      </div>
                      <div><label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Culturas</label><input required value={farmCrops} onChange={e => setFarmCrops(e.target.value)} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none" placeholder="Soja, Milho..." /></div>
                    </div>
                  ) : selectedType === 'Venda' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Produto</label>
                        <select 
                          value={selectedProduct} 
                          onChange={e => setSelectedProduct(e.target.value)} 
                          className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold"
                        >
                          {selectedFarm?.mainCrops.map(crop => <option key={crop} value={crop}>{crop}</option>)}
                          <option value="Milho Colhido">Milho Colhido (Estoque)</option>
                          <option value="Soja Colhida">Soja Colhida (Estoque)</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Preço Unitário (R$)</label>
                          <input required type="number" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} className="p-4 w-full bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold" placeholder="0.00" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Quantidade</label>
                          <input required type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="p-4 w-full bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold" placeholder="0" />
                        </div>
                      </div>
                      <div className="p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-100 text-center">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Total da Venda</p>
                        <p className="text-2xl font-black text-emerald-700">R$ {parseFloat(totalValue || '0').toLocaleString()}</p>
                        <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold">* Valor entrará para a Administração Central</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <input required type="number" placeholder="Valor (R$)" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold" />
                      <div className="grid grid-cols-2 gap-4"><input required type="number" placeholder="Qtd" className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none" /><input required type="date" className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none" /></div>
                    </div>
                  )}
                  <button disabled={loading} type="submit" className={`w-full py-5 rounded-3xl font-bold text-white transition-all disabled:opacity-50 ${selectedType === 'Cadastro' ? 'bg-slate-900' : selectedType === 'Produção' ? 'bg-emerald-600' : selectedType === 'Despesa' ? 'bg-rose-600' : 'bg-blue-600'}`}>{loading ? 'Processando...' : 'Confirmar'}</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmsList;


import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Search, 
  Bot, 
  FileCheck,
  Briefcase,
  Gavel,
  History,
  ExternalLink,
  Plus,
  DollarSign,
  Landmark,
  ShieldCheck,
  ClipboardCheck,
  Lock,
  ArrowRight
} from 'lucide-react';
import { PlanTier } from '../types';

interface DocumentSectionProps {
  plan: PlanTier;
}

interface DocTemplate {
  id: string;
  title: string;
  category: 'Jurídico' | 'Financeiro' | 'Operacional' | 'Fiscal';
  description: string;
  lastUpdated: string;
}

const TEMPLATES: DocTemplate[] = [
  { id: 'f1', title: 'LCDPR - Livro Caixa Digital', category: 'Fiscal', description: 'Modelo para escrituração do Livro Caixa Digital do Produtor Rural conforme normas da Receita Federal.', lastUpdated: '10/01/2025' },
  { id: 'f2', title: 'ITR - Imposto Territorial Rural', category: 'Fiscal', description: 'Declaração anual para apuração do imposto sobre a propriedade territorial rural.', lastUpdated: '15/03/2024' },
  { id: 'f3', title: 'CAR - Cadastro Ambiental Rural', category: 'Fiscal', description: 'Documentação necessária para o registro ambiental obrigatório do imóvel rural.', lastUpdated: '22/11/2024' },
  { id: 'f4', title: 'ADA - Ato de Declaração Ambiental', category: 'Fiscal', description: 'Formulário para exclusão de áreas de preservação da base de cálculo do ITR.', lastUpdated: '05/02/2025' },
  { id: 'f5', title: 'CCIR - Certificado de Cadastro', category: 'Fiscal', description: 'Certificado que comprova a regularidade do imóvel rural junto ao INCRA.', lastUpdated: '12/12/2024' },
  { id: '1', title: 'Contrato de Arrendamento Rural', category: 'Jurídico', description: 'Modelo padrão para arrendamento de terras produtivas conforme estatuto da terra.', lastUpdated: '12/02/2024' },
  { id: '4', title: 'Termo de Parceria Agrícola', category: 'Jurídico', description: 'Contrato para partilha de riscos e lucros entre proprietário e parceiro.', lastUpdated: '15/02/2024' },
  { id: '2', title: 'Nota de Crédito Rural (NCR)', category: 'Financeiro', description: 'Documento para formalização de crédito junto a instituições ou fornecedores.', lastUpdated: '05/01/2024' },
  { id: '3', title: 'Contrato de Compra e Venda de Safra', category: 'Financeiro', description: 'Acordo de comercialização futura de grãos com fixação de preço.', lastUpdated: '20/03/2024' },
  { id: '5', title: 'Relatório de Manejo e Insumos', category: 'Operacional', description: 'Planilha de controle para prestação de contas de áreas arrendadas.', lastUpdated: '01/03/2024' },
  { id: '6', title: 'Comprovante de Entrega de Grãos', category: 'Operacional', description: 'Recibo oficial de romaneio e balança para descarga em armazém.', lastUpdated: '10/03/2024' },
];

const DocumentSection: React.FC<DocumentSectionProps> = ({ plan }) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'analysis'>('templates');
  const [searchTerm, setSearchTerm] = useState('');

  const isPremium = plan === 'Premium';

  const filteredTemplates = TEMPLATES.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Centro de Documentação</h2>
          <p className="text-slate-500 font-medium">Modelos padrão, obrigações fiscais e análise inteligente</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'templates' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Biblioteca de Modelos
          </button>
          <button 
            onClick={() => setActiveTab('analysis')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all relative ${activeTab === 'analysis' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Análise por IA {!isPremium && <Lock size={12} className="inline ml-1 text-amber-500" />}
          </button>
        </div>
      </div>

      {activeTab === 'templates' ? (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
            <Search className="text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Pesquisar por nome ou categoria fiscal..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <div key={template.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all group flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    template.category === 'Jurídico' ? 'bg-indigo-50 text-indigo-600' :
                    template.category === 'Financeiro' ? 'bg-emerald-50 text-emerald-600' :
                    template.category === 'Fiscal' ? 'bg-amber-50 text-amber-600' :
                    'bg-slate-50 text-slate-600'
                  }`}>
                    {template.category === 'Jurídico' ? <Gavel size={24} /> : 
                     template.category === 'Financeiro' ? <DollarSign size={24} /> : 
                     template.category === 'Fiscal' ? <Landmark size={24} /> :
                     <Briefcase size={24} />}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                    template.category === 'Fiscal' ? 'bg-amber-100 text-amber-700' : 'bg-slate-50 text-slate-400'
                  }`}>
                    {template.category}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{template.title}</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed flex-1">
                  {template.description}
                </p>
                <div className="flex items-center gap-2 mt-auto">
                  <button className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <Plus size={14} /> Preencher
                  </button>
                  <button className="p-2 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 transition-colors">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative">
          {!isPremium && (
            <div className="absolute inset-0 z-10 backdrop-blur-[6px] bg-white/40 flex flex-col items-center justify-center rounded-[2.5rem] p-12 text-center border-2 border-dashed border-slate-200">
               <div className="bg-slate-900 p-6 rounded-full text-amber-400 mb-6 shadow-2xl scale-110">
                  <Lock size={48} />
               </div>
               <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Análise IA Reservada ao Plano Premium</h3>
               <p className="text-slate-600 font-medium max-w-lg mb-8 text-lg">
                  Suba para o plano Premium e tenha a inteligência da AgroInteligente processando seus XMLs e contratos automaticamente para o Livro Caixa Digital.
               </p>
               <button className="bg-blue-600 text-white px-10 py-5 rounded-3xl font-black text-xl hover:bg-blue-700 shadow-2xl shadow-blue-100 flex items-center gap-3 transition-all">
                  Quero ser Premium Agora <ArrowRight size={24} />
               </button>
               <p className="mt-6 text-sm text-slate-400 font-bold uppercase tracking-widest">Inclui análise de risco jurídico e fiscal</p>
            </div>
          )}
          
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${!isPremium ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-emerald-50 border-2 border-dashed border-emerald-200 p-12 rounded-3xl text-center space-y-4">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Upload className="text-emerald-600" size={32} />
                </div>
                <h4 className="text-xl font-bold text-emerald-900">Arraste seus documentos fiscais</h4>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                 <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold flex items-center gap-2">
                    <History size={18} /> Histórico IA
                 </div>
                 <div className="p-12 text-center text-slate-400 font-medium italic">
                    Nenhum documento processado recentemente.
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentSection;

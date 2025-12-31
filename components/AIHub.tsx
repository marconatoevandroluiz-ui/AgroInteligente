
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Brain, ShieldCheck, PieChart, Tractor, Info, Sparkles } from 'lucide-react';
import { AIAgentRole, ChatMessage } from '../types';
import { askAgent } from '../geminiService';

const AGENTS: { role: AIAgentRole, label: string, description: string, icon: any, color: string }[] = [
  { role: 'Financeiro', label: 'Consultor Financeiro', description: 'Otimização de custos e análise de ROI.', icon: ShieldCheck, color: 'text-blue-500' },
  { role: 'Agrônomo', label: 'Engenheiro Agrônomo', description: 'Manejo de lavoura e saúde do solo.', icon: Brain, color: 'text-emerald-500' },
  { role: 'Pecuário', label: 'Especialista Pecuário', description: 'Gado, nutrição e sanidade animal.', icon: Info, color: 'text-amber-500' },
  { role: 'Gestão', label: 'Gerente Operacional', description: 'Logística, pessoas e processos.', icon: Tractor, color: 'text-purple-500' },
  { role: 'Relatórios', label: 'Analista de Dados', description: 'KPIs e resumos estratégicos.', icon: PieChart, color: 'text-rose-500' },
];

const AIHub: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AIAgentRole>('Financeiro');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await askAgent(selectedAgent, input, messages);
    
    setMessages(prev => [...prev, { role: 'model', text: aiResponse, agent: selectedAgent }]);
    setIsLoading(false);
  };

  const currentAgentInfo = AGENTS.find(a => a.role === selectedAgent)!;

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] space-y-6">
      <div className="flex items-center justify-between">
         <div>
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
             <Bot className="text-emerald-600" size={32} /> Central de Agentes IA
           </h2>
           <p className="text-slate-500 font-medium">Seus especialistas virtuais disponíveis 24/7</p>
         </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Sidebar Agents Selection */}
        <div className="w-80 flex flex-col gap-3 overflow-y-auto pr-2">
          {AGENTS.map((agent) => (
            <button
              key={agent.role}
              onClick={() => {
                setSelectedAgent(agent.role);
                setMessages([]);
              }}
              className={`p-4 rounded-2xl text-left transition-all border ${
                selectedAgent === agent.role 
                ? 'bg-emerald-600 border-emerald-500 shadow-lg text-white' 
                : 'bg-white border-slate-200 hover:border-emerald-300 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`${selectedAgent === agent.role ? 'bg-emerald-500 text-white' : 'bg-slate-100 ' + agent.color} p-2 rounded-lg`}>
                   <agent.icon size={20} />
                </div>
                <span className="font-bold text-sm">{agent.label}</span>
              </div>
              <p className={`text-xs ${selectedAgent === agent.role ? 'text-emerald-50' : 'text-slate-500'}`}>
                {agent.description}
              </p>
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-lg flex flex-col min-h-0 relative overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className={`p-2 rounded-full bg-white shadow-sm ${currentAgentInfo.color}`}>
                  <currentAgentInfo.icon size={20} />
               </div>
               <div>
                 <p className="text-sm font-bold text-slate-900">{currentAgentInfo.label}</p>
                 <p className="text-[10px] text-emerald-600 font-bold uppercase flex items-center gap-1">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Online
                 </p>
               </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600 p-2"><Info size={20} /></button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            {messages.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                  <div className="bg-slate-50 p-6 rounded-full">
                    <Sparkles size={48} className="text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Olá! Como posso ajudar hoje?</h4>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">Tire dúvidas sobre {selectedAgent === 'Financeiro' ? 'finanças do agro' : selectedAgent === 'Agrônomo' ? 'lavoura e manejo' : 'sua gestão rural'}.</p>
                  </div>
               </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none border border-slate-200 animate-pulse flex gap-1">
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Pergunte ao ${currentAgentInfo.label}...`}
                className="flex-1 bg-transparent border-none outline-none py-2 text-sm text-slate-900"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`p-2 rounded-xl transition-all ${
                  input.trim() ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300'
                }`}
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-2 uppercase tracking-widest font-bold">Baseado em Gemini 3 AI</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHub;

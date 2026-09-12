import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Terminal, 
  FileText, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useWorkbench } from '../../context/WorkbenchContext';

export const AgentChatView: React.FC = () => {
  const { 
    chatMessages, 
    runAgentSimulation, 
    isSimulatingAgent, 
    setSelectedCitation,
    hitlActions,
    approveHITLAction,
    setIsEvidenceDrawerOpen
  } = useWorkbench();

  const [inputQuery, setInputQuery] = useState('');
  const [expandedThoughtMsgId, setExpandedThoughtMsgId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(true);

  // Speech Recognition (Web Speech API)
  const toggleVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition is supported in modern Chrome / Edge browsers.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // Text to Speech Response Voice Output
  useEffect(() => {
    if (!isVoiceOutputEnabled) return;
    const lastMsg = chatMessages[chatMessages.length - 1];
    if (lastMsg && lastMsg.sender === 'agent') {
      try {
        const synth = window.speechSynthesis;
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance("Sovereign Agent execution complete. Grounded citations and math calculations verified.");
        utterance.rate = 1.0;
        synth.speak(utterance);
      } catch (e) {
        console.error(e);
      }
    }
  }, [chatMessages, isVoiceOutputEnabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isSimulatingAgent) return;
    runAgentSimulation(inputQuery);
    setInputQuery('');
  };

  return (
    <div className="flex flex-col h-full bg-[#07090E] border-r border-[#1E2638]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1E2638] bg-[#0D111A] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-cyan-400" />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Sovereign Multi-Agent Swarm Thread
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Voice Output Toggle */}
          <button
            onClick={() => setIsVoiceOutputEnabled(!isVoiceOutputEnabled)}
            className={`p-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
              isVoiceOutputEnabled ? 'bg-cyan-950 text-cyan-400 border-cyan-500/40' : 'bg-slate-900 text-slate-500 border-slate-700'
            }`}
            title="Toggle Voice Speech Output"
          >
            {isVoiceOutputEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>vLLM Active</span>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isExpandedThought = expandedThoughtMsgId === msg.id;

          return (
            <div key={msg.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              )}

              <div className={`max-w-2xl space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 px-1">
                  <span className="font-bold text-slate-200">{isUser ? 'Operator' : msg.agentName}</span>
                  <span>•</span>
                  <span className="text-[11px]">{msg.timestamp}</span>
                </div>

                <div className={`p-4 rounded-2xl border text-sm leading-relaxed ${
                  isUser ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-100 rounded-tr-none' : 'glass-panel text-slate-200 rounded-tl-none font-sans space-y-4'
                }`}>
                  {msg.thoughtProcess && (
                    <div className="border border-[#1E2638] rounded-xl bg-[#0B0F19] overflow-hidden text-xs font-mono">
                      <button
                        onClick={() => setExpandedThoughtMsgId(isExpandedThought ? null : msg.id)}
                        className="w-full px-3 py-2 bg-[#0D111A] flex items-center justify-between text-cyan-400 font-medium hover:bg-[#121824] cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          <span>View Agent Thought Chain ({msg.thoughtProcess.length} Reasoning Steps)</span>
                        </div>
                        {isExpandedThought ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>

                      {isExpandedThought && (
                        <div className="p-3 space-y-2 text-slate-300 border-t border-[#1E2638]">
                          {msg.thoughtProcess.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>

                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-[#1E2638]">
                      <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                        Tools Executed in Sandbox
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {msg.toolCalls.map((t, i) => (
                          <div key={i} className="p-2.5 rounded-lg bg-[#07090E] border border-[#1E2638] font-mono text-xs space-y-1">
                            <div className="flex items-center justify-between text-cyan-400 font-semibold">
                              <span className="flex items-center gap-1.5">
                                <Terminal className="w-3.5 h-3.5" />
                                {t.toolName}
                              </span>
                              <span className="text-[10px] text-slate-500">{t.executionTimeMs}ms</span>
                            </div>
                            <div className="text-slate-400 text-[11px]">In: <code className="text-slate-200">{t.input}</code></div>
                            <div className="text-emerald-400 text-[11px]">Out: <code>{t.output}</code></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-3 border-t border-[#1E2638] space-y-2">
                      <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        Grounded Source Citations ({msg.citations.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.citations.map((cit) => (
                          <button
                            key={cit.id}
                            onClick={() => {
                              setSelectedCitation(cit);
                              setIsEvidenceDrawerOpen(true);
                            }}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-300 text-xs font-mono border border-cyan-500/30 transition-all cursor-pointer"
                          >
                            <span>📄 p.{cit.pageNumber}</span>
                            <span className="text-slate-400">|</span>
                            <span className="truncate max-w-[160px]">{cit.documentName}</span>
                            <span className="px-1 py-0.2 rounded bg-emerald-950 text-emerald-400 text-[10px]">
                              {(cit.confidenceScore * 100).toFixed(0)}%
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.requiresHITL && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 space-y-2 mt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-rose-300 font-mono text-xs font-bold">
                          <ShieldAlert className="w-4 h-4 text-rose-400" />
                          <span>HUMAN-IN-THE-LOOP OPERATOR APPROVAL REQUIRED</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500 text-white">
                          CRITICAL RISK
                        </span>
                      </div>
                      <p className="text-xs text-rose-200/90 font-sans">
                        Recalibration of mechanical relief valve PRV-204 set-point requires explicit cryptographic signature from Chief Operator Dewesh before execution.
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        {hitlActions.find(a => a.id === msg.hitlActionId)?.status === 'APPROVED' ? (
                          <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            APPROVED & LOGGED TO AUDIT LEDGER
                          </span>
                        ) : (
                          <button
                            onClick={() => msg.hitlActionId && approveHITLAction(msg.hitlActionId)}
                            className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-mono font-bold transition-all cursor-pointer"
                          >
                            APPROVE ACTION & SIGN CRYPTOGRAPHICALLY
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-cyan-400" />
                </div>
              )}
            </div>
          );
        })}

        {isSimulatingAgent && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0D111A] border border-cyan-500/40 animate-pulse">
            <Bot className="w-5 h-5 text-cyan-400 animate-spin" />
            <div className="text-xs font-mono text-cyan-300">
              Sovereign Swarm Agent is evaluating query and executing Python kernel...
            </div>
          </div>
        )}
      </div>

      {/* Input Box with Microphone Voice Button */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-[#1E2638] bg-[#0D111A] flex gap-2">
        {/* Microphone Button */}
        <button
          type="button"
          onClick={toggleVoiceRecording}
          className={`p-2.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
            isListening
              ? 'bg-rose-500 text-white border-rose-400 animate-bounce shadow-rose-glow'
              : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
          }`}
          title="Click to speak (Speech-to-Text)"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-cyan-400" />}
        </button>

        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={isListening ? "Listening to voice input..." : "Ask Sovereign Agent (e.g. Run hoop stress calculation on Separator V-102...)"}
          className="flex-1 bg-[#141B2D] text-xs font-mono text-slate-200 px-4 py-2.5 rounded-xl border border-[#2A364F] focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          disabled={isSimulatingAgent || !inputQuery.trim()}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">SUBMIT</span>
        </button>
      </form>
    </div>
  );
};

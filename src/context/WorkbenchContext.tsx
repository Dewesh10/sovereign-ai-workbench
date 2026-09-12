import React, { createContext, useContext, useState } from 'react';
import { 
  ActiveTab, 
  IndustrialDemoScenario, 
  AgentNode, 
  ChatMessage, 
  GroundedCitation, 
  BoundingBox,
  HITLAction,
  AuditLogItem,
  ModelGatewayStats,
  SystemQualityMetrics,
  IDEFile,
  KnowledgeNode,
  KnowledgeEdge,
  PinAnnotation,
  AssetHealthSpec
} from '../types/workbench';
import { MOCK_DEMO_SCENARIOS, INITIAL_GATEWAY_STATS, INITIAL_QUALITY_METRICS } from '../data/mockDemos';

interface WorkbenchContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  scenarios: IndustrialDemoScenario[];
  activeScenario: IndustrialDemoScenario;
  selectScenario: (id: string) => void;
  agentNodes: AgentNode[];
  setAgentNodes: React.Dispatch<React.SetStateAction<AgentNode[]>>;
  selectedAgentNode: AgentNode | null;
  setSelectedAgentNode: (node: AgentNode | null) => void;
  chatMessages: ChatMessage[];
  selectedCitation: GroundedCitation | null;
  setSelectedCitation: (cit: GroundedCitation | null) => void;
  selectedBoundingBox: BoundingBox | null;
  setSelectedBoundingBox: (box: BoundingBox | null) => void;
  selectedAssetHealth: AssetHealthSpec | null;
  setSelectedAssetHealth: (asset: AssetHealthSpec | null) => void;
  
  // Multi-File IDE
  ideFiles: IDEFile[];
  activeIDEFileId: string;
  setActiveIDEFileId: (id: string) => void;
  updateIDEFileCode: (id: string, newCode: string) => void;
  
  sandboxOutput: string;
  isSandboxRunning: boolean;
  runSandboxCode: () => void;
  
  // Knowledge Graph
  knowledgeNodes: KnowledgeNode[];
  knowledgeEdges: KnowledgeEdge[];
  
  // Pin Annotations
  pinAnnotations: PinAnnotation[];
  addPinAnnotation: (pin: Omit<PinAnnotation, 'id' | 'timestamp'>) => void;

  hitlActions: HITLAction[];
  approveHITLAction: (id: string) => void;
  rejectHITLAction: (id: string) => void;
  auditLogs: AuditLogItem[];
  gatewayStats: ModelGatewayStats;
  toggleSovereignMode: () => void;
  qualityMetrics: SystemQualityMetrics;
  isSimulatingAgent: boolean;
  runAgentSimulation: (customQuery?: string) => void;
  isEvidenceDrawerOpen: boolean;
  setIsEvidenceDrawerOpen: (open: boolean) => void;
}

const WorkbenchContext = createContext<WorkbenchContextType | undefined>(undefined);

export const WorkbenchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('command');
  const [scenarios] = useState<IndustrialDemoScenario[]>(MOCK_DEMO_SCENARIOS);
  const [activeScenario, setActiveScenario] = useState<IndustrialDemoScenario>(MOCK_DEMO_SCENARIOS[0]);
  
  const [agentNodes, setAgentNodes] = useState<AgentNode[]>(MOCK_DEMO_SCENARIOS[0].initialNodes);
  const [selectedAgentNode, setSelectedAgentNode] = useState<AgentNode | null>(null);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_DEMO_SCENARIOS[0].initialChat);
  const [selectedCitation, setSelectedCitation] = useState<GroundedCitation | null>(null);
  const [selectedBoundingBox, setSelectedBoundingBox] = useState<BoundingBox | null>(null);
  const [selectedAssetHealth, setSelectedAssetHealth] = useState<AssetHealthSpec | null>(null);
  
  // Multi-File IDE
  const [ideFiles, setIdeFiles] = useState<IDEFile[]>(MOCK_DEMO_SCENARIOS[0].ideFiles);
  const [activeIDEFileId, setActiveIDEFileId] = useState<string>(MOCK_DEMO_SCENARIOS[0].ideFiles[0]?.id || 'file-1');

  // Knowledge Graph
  const [knowledgeNodes, setKnowledgeNodes] = useState<KnowledgeNode[]>(MOCK_DEMO_SCENARIOS[0].knowledgeNodes);
  const [knowledgeEdges, setKnowledgeEdges] = useState<KnowledgeEdge[]>(MOCK_DEMO_SCENARIOS[0].knowledgeEdges);

  // Pin Annotations
  const [pinAnnotations, setPinAnnotations] = useState<PinAnnotation[]>([
    { id: 'pin-1', x: 22, y: 38, label: 'Lower Seam Corrosion', note: 'UT scan flagged 3.0mm wall loss on lower head seam', author: 'Eng. Dewesh', timestamp: '12:15' }
  ]);

  const [sandboxOutput, setSandboxOutput] = useState<string>(`=== SOVEREIGN KERNEL MAWP ANALYSIS ===\nCalculated MAWP : 79.18 bar\nRecorded Peak   : 87.4 bar\nDelta Margin    : -8.22 bar\nSTATUS: ⚠️ CRITICAL OVERPRESSURE VIOLATION`);
  const [isSandboxRunning, setIsSandboxRunning] = useState<boolean>(false);
  
  const [hitlActions, setHitlActions] = useState<HITLAction[]>([
    {
      id: 'hitl-001',
      actionTitle: 'Recalibrate Pressure Relief Valve PRV-204 Set Point',
      description: 'Agent recommends overriding mechanical valve PRV-204 set point from 78.5 bar to 74.0 bar to prevent catastrophic fatigue rupture.',
      requestedByAgent: 'Compliance Guardrail Agent',
      riskLevel: 'CRITICAL',
      parameters: { valveId: 'PRV-204', targetSetPointBar: 74.0, safetyMarginPercentage: 15 },
      timestamp: '12:40:05',
      status: 'PENDING'
    }
  ]);
  
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    { id: 'log-1', timestamp: '12:40:05', event: 'HITL Gate Triggered: PRV-204 Recalibration', agent: 'Compliance Guardrail', category: 'HITL_APPROVAL', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', ip: '127.0.0.1', airGapStatus: 'SOVEREIGN_LOCAL' },
    { id: 'log-2', timestamp: '12:40:04', event: 'Python Sandbox Code Execution: mawp_calculator.py', agent: 'Python Sandbox Engine', category: 'EXECUTION', hash: 'f7c3bc1d808e04732adf679965ccc34ca7ae3441', ip: '127.0.0.1', airGapStatus: 'SOVEREIGN_LOCAL' },
    { id: 'log-3', timestamp: '12:40:02', event: 'Vector RAG Query: API 510 Overpressure Standard', agent: 'API 510 RAG Grounding', category: 'DATA_ACCESS', hash: '6c51ace2e428b4d8f075d9e5b565a58953158c5a', ip: '127.0.0.1', airGapStatus: 'SOVEREIGN_LOCAL' },
    { id: 'log-4', timestamp: '12:40:00', event: 'Inbound Sovereign Query Ingested', agent: 'Master Task Planner', category: 'SECURITY', hash: '7d1a2f3e4b5c6d7e8f9a0b1c2d3e4f5a', ip: '127.0.0.1', airGapStatus: 'SOVEREIGN_LOCAL' }
  ]);
  
  const [gatewayStats, setGatewayStats] = useState<ModelGatewayStats>(INITIAL_GATEWAY_STATS);
  const [qualityMetrics] = useState<SystemQualityMetrics>(INITIAL_QUALITY_METRICS);
  const [isSimulatingAgent, setIsSimulatingAgent] = useState<boolean>(false);
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState<boolean>(false);

  const selectScenario = (id: string) => {
    const found = scenarios.find(s => s.id === id);
    if (found) {
      setActiveScenario(found);
      setAgentNodes(found.initialNodes);
      setChatMessages(found.initialChat);
      setIdeFiles(found.ideFiles);
      setActiveIDEFileId(found.ideFiles[0]?.id || 'file-1');
      setKnowledgeNodes(found.knowledgeNodes);
      setKnowledgeEdges(found.knowledgeEdges);
      setSelectedCitation(null);
      setSelectedBoundingBox(null);
      setSelectedAssetHealth(null);
    }
  };

  const updateIDEFileCode = (id: string, newCode: string) => {
    setIdeFiles(prev => prev.map(f => f.id === id ? { ...f, code: newCode, modified: true } : f));
  };

  const addPinAnnotation = (pin: Omit<PinAnnotation, 'id' | 'timestamp'>) => {
    const newPin: PinAnnotation = {
      ...pin,
      id: `pin-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setPinAnnotations(prev => [...prev, newPin]);
  };

  const toggleSovereignMode = () => {
    setGatewayStats(prev => ({
      ...prev,
      sovereignMode: !prev.sovereignMode,
      airGapStatus: !prev.sovereignMode ? 'ISOLATED' : 'CONNECTED'
    }));
  };

  const runSandboxCode = () => {
    setIsSandboxRunning(true);
    const activeFile = ideFiles.find(f => f.id === activeIDEFileId);
    const activeCode = activeFile?.code || '';

    setTimeout(() => {
      setIsSandboxRunning(false);
      setSandboxOutput(`=== SOVEREIGN KERNEL EXECUTION COMPLETE ===\nExecuted File: ${activeFile?.name || 'sandbox.py'}\nOutput Stream: STDOUT\nKernel Latency: 138ms\nResult:\nExecution succeeded with zero runtime exceptions.\n${activeCode.includes('calculate_mawp') ? 'Calculated MAWP: 79.18 bar (Safety Factor: 0.906)' : 'Analysis complete. All parameters evaluated.'}`);
    }, 800);
  };

  const approveHITLAction = (id: string) => {
    setHitlActions(prev => prev.map(a => a.id === id ? { ...a, status: 'APPROVED', approvedBy: 'Operator Dewesh (Chief Engineer)' } : a));
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        event: `CRITICAL ACTION APPROVED: Operator sign-off for ${id}`,
        agent: 'Operator Dewesh',
        category: 'HITL_APPROVAL',
        hash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        ip: '127.0.0.1',
        airGapStatus: 'SOVEREIGN_LOCAL'
      },
      ...prev
    ]);
  };

  const rejectHITLAction = (id: string) => {
    setHitlActions(prev => prev.map(a => a.id === id ? { ...a, status: 'REJECTED', approvedBy: 'Operator Dewesh (Overridden)' } : a));
  };

  const runAgentSimulation = (customQuery?: string) => {
    const queryText = customQuery || activeScenario.sampleQuery;
    setIsSimulatingAgent(true);

    setAgentNodes(prev => prev.map((n, i) => ({ ...n, status: i === 0 ? 'running' : 'idle' })));
    
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString()
    };
    setChatMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      setAgentNodes(prev => prev.map(n => n.type === 'planner' ? { ...n, status: 'completed' } : n.type === 'vision_ocr' ? { ...n, status: 'running' } : n));
    }, 1000);

    setTimeout(() => {
      setAgentNodes(prev => prev.map(n => n.type === 'vision_ocr' ? { ...n, status: 'completed' } : n.type === 'python_sandbox' ? { ...n, status: 'running' } : n));
    }, 2200);

    setTimeout(() => {
      setAgentNodes(prev => prev.map(n => n.type === 'python_sandbox' ? { ...n, status: 'completed' } : n.type === 'rag_vector' ? { ...n, status: 'running' } : n));
    }, 3400);

    setTimeout(() => {
      setAgentNodes(prev => prev.map(n => n.type === 'rag_vector' ? { ...n, status: 'completed' } : n.type === 'compliance_verifier' ? { ...n, status: 'running' } : n));
    }, 4500);

    setTimeout(() => {
      setAgentNodes(prev => prev.map(n => ({ ...n, status: 'completed' })));
      setIsSimulatingAgent(false);

      const agentMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        agentName: 'NEXUS Agent Swarm',
        agentRole: 'Sovereign Industrial Orchestrator',
        content: `### 🎯 Autonomous Agent Workflow Complete for: "${queryText}"\n\n- **Multimodal Blueprint Ingestion**: Ingested schematic bounds with 99.1% confidence.\n- **Python Kernel Calculation**: Verified mathematical parameters in local sandbox execution.\n- **Grounding & Evidence**: Cross-referenced 2 mandatory standard directives with zero cloud data egress.\n\nEverything is validated and logged to the immutable audit ledger.`,
        timestamp: new Date().toLocaleTimeString(),
        citations: activeScenario.groundedCitations
      };
      setChatMessages(prev => [...prev, agentMsg]);
    }, 5800);
  };

  return (
    <WorkbenchContext.Provider
      value={{
        activeTab,
        setActiveTab,
        scenarios,
        activeScenario,
        selectScenario,
        agentNodes,
        setAgentNodes,
        selectedAgentNode,
        setSelectedAgentNode,
        chatMessages,
        selectedCitation,
        setSelectedCitation,
        selectedBoundingBox,
        setSelectedBoundingBox,
        selectedAssetHealth,
        setSelectedAssetHealth,
        ideFiles,
        activeIDEFileId,
        setActiveIDEFileId,
        updateIDEFileCode,
        sandboxOutput,
        isSandboxRunning,
        runSandboxCode,
        knowledgeNodes,
        knowledgeEdges,
        pinAnnotations,
        addPinAnnotation,
        hitlActions,
        approveHITLAction,
        rejectHITLAction,
        auditLogs,
        gatewayStats,
        toggleSovereignMode,
        qualityMetrics,
        isSimulatingAgent,
        runAgentSimulation,
        isEvidenceDrawerOpen,
        setIsEvidenceDrawerOpen
      }}
    >
      {children}
    </WorkbenchContext.Provider>
  );
};

export const useWorkbench = () => {
  const context = useContext(WorkbenchContext);
  if (!context) {
    throw new Error('useWorkbench must be used within a WorkbenchProvider');
  }
  return context;
};

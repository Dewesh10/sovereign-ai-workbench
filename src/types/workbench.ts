export type ActiveTab = 
  | 'command' 
  | 'workbench' 
  | 'ingestion' 
  | 'agent-graph' 
  | 'knowledge-graph'
  | 'sandbox' 
  | 'security' 
  | 'quality';

export type AgentNodeStatus = 'idle' | 'running' | 'completed' | 'failed' | 'hitl_waiting';

export interface AgentHyperparameters {
  temperature: number;
  topP: number;
  maxTokens: number;
  contextWindow: number;
  systemPrompt: string;
  allowedTools: string[];
}

export interface AgentNode {
  id: string;
  name: string;
  role: string;
  type: 'planner' | 'vision_ocr' | 'rag_vector' | 'python_sandbox' | 'compliance_verifier' | 'report_writer';
  status: AgentNodeStatus;
  latencyMs: number;
  tokensUsed: number;
  lastOutput?: string;
  iconName: string;
  hyperparameters?: AgentHyperparameters;
}

export interface AssetHealthSpec {
  id: string;
  name: string;
  type: string;
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL_ALERT';
  pressureRatingBar: number;
  currentPressureBar: number;
  temperatureC: number;
  vibrationMms: number;
  lastInspectionDate: string;
  nextInspectionDue: string;
  manufacturer: string;
  serialNumber: string;
  maintenanceHistory: { date: string; action: string; technician: string }[];
  complianceScore: number;
}

export interface BoundingBox {
  id: string;
  label: string;
  confidence: number;
  x: number; // percentage
  y: number; // percentage
  width: number;
  height: number;
  type: 'valve' | 'sensor' | 'violation' | 'equation' | 'table';
  detail: string;
  assetHealth?: AssetHealthSpec;
}

export interface GroundedCitation {
  id: string;
  documentName: string;
  pageNumber: number;
  sectionTitle: string;
  snippet: string;
  confidenceScore: number;
  boundingBox?: BoundingBox;
}

export interface TelemetryDataPoint {
  timestamp: string;
  pressureBar: number;
  temperatureC: number;
  vibrationMms: number;
  flowRateLmin: number;
  anomalyScore: number;
  stressMpa?: number;
}

export interface IDEFile {
  id: string;
  name: string;
  language: 'python' | 'json' | 'sql' | 'markdown';
  code: string;
  modified: boolean;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  category: 'ASSET' | 'REGULATION' | 'SENSOR' | 'METRIC';
  x: number;
  y: number;
  details: string;
  status?: string;
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
}

export interface PinAnnotation {
  id: string;
  x: number;
  y: number;
  label: string;
  note: string;
  timestamp: string;
  author: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  agentName?: string;
  agentRole?: string;
  content: string;
  timestamp: string;
  thoughtProcess?: string[];
  toolCalls?: {
    toolName: string;
    input: string;
    output: string;
    executionTimeMs: number;
  }[];
  citations?: GroundedCitation[];
  codeBlock?: string;
  requiresHITL?: boolean;
  hitlActionId?: string;
  isHITLApproved?: boolean;
}

export interface HITLAction {
  id: string;
  actionTitle: string;
  description: string;
  requestedByAgent: string;
  riskLevel: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  parameters: Record<string, any>;
  timestamp: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  event: string;
  agent: string;
  category: 'SECURITY' | 'EXECUTION' | 'DATA_ACCESS' | 'HITL_APPROVAL';
  hash: string;
  ip: string;
  airGapStatus: 'SOVEREIGN_LOCAL' | 'AIR_GAPPED';
}

export interface IndustrialDemoScenario {
  id: string;
  title: string;
  sector: 'Oil & Gas' | 'Energy Grid' | 'Defense Aerospace';
  organization: 'MRPL / ONGC' | 'NTPC / PowerGrid' | 'ISRO / DRDO';
  description: string;
  blueprintImageUrl: string;
  documents: string[];
  sampleQuery: string;
  telemetry: TelemetryDataPoint[];
  initialNodes: AgentNode[];
  initialChat: ChatMessage[];
  ideFiles: IDEFile[];
  knowledgeNodes: KnowledgeNode[];
  knowledgeEdges: KnowledgeEdge[];
  groundedCitations: GroundedCitation[];
  boundingBoxes: BoundingBox[];
}

export interface ModelGatewayStats {
  activeModel: string;
  sovereignMode: boolean;
  vramUsedGb: number;
  totalVramGb: number;
  tokensPerSec: number;
  latencyAvgMs: number;
  promptInjectionBlocked: number;
  airGapStatus: 'ISOLATED' | 'CONNECTED';
}

export interface SystemQualityMetrics {
  hallucinationPreventionScore: number;
  citationGroundingRate: number;
  retrievalPrecisionScore: number;
  toolExecutionReliability: number;
  totalRunsEvaluated: number;
  avgResponseTimeMs: number;
}

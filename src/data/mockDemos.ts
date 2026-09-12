import { IndustrialDemoScenario, ModelGatewayStats, SystemQualityMetrics } from '../types/workbench';

const MRPL_PID_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" fill="none"><rect width="800" height="500" fill="%23090D16"/><path d="M0 0h800v500H0z" fill="none"/><g stroke="%231E2638" stroke-width="1"><path d="M0 50h800M0 100h800M0 150h800M0 200h800M0 250h800M0 300h800M0 350h800M0 400h800M0 450h800"/><path d="M100 0v500M200 0v500M300 0v500M400 0v500M500 0v500M600 0v500M700 0v500"/></g><rect x="120" y="140" width="160" height="220" rx="30" fill="%230E1726" stroke="%2300F0FF" stroke-width="2"/><text x="160" y="240" fill="%2300F0FF" font-family="monospace" font-size="14" font-weight="bold">V-102 SEPARATOR</text><text x="165" y="260" fill="%2394A3B8" font-family="monospace" font-size="11">P_design: 75.0 bar</text><text x="165" y="278" fill="%23F43F5E" font-family="monospace" font-size="11" font-weight="bold">P_actual: 87.4 bar ⚠️</text><rect x="420" y="160" width="140" height="180" rx="8" fill="%230E1726" stroke="%2310B981" stroke-width="2"/><text x="440" y="240" fill="%2310B981" font-family="monospace" font-size="14" font-weight="bold">E-104 HEAT EXCH</text><path d="M280 250h140" stroke="%2300F0FF" stroke-width="4" stroke-dasharray="4 2"/><circle cx="350" cy="250" r="18" fill="%231E2638" stroke="%23F59E0B" stroke-width="2"/><text x="342" y="255" fill="%23F59E0B" font-family="monospace" font-size="12" font-weight="bold">PRV</text><path d="M350 232v-50h120" stroke="%23F59E0B" stroke-width="2"/><circle cx="470" cy="182" r="8" fill="%23F43F5E"/><path d="M560 250h120v100h-80" stroke="%233B82F6" stroke-width="3"/><rect x="560" y="320" width="80" height="60" fill="%230E1726" stroke="%233B82F6" stroke-width="2"/><text x="570" y="355" fill="%233B82F6" font-family="monospace" font-size="12">P-101B</text><text x="20" y="30" fill="%23F8FAFC" font-family="sans-serif" font-size="16" font-weight="bold">MRPL OFFSHORE PLATFORM CHARLIE - P&amp;ID SCHEMATIC (REV-04)</text><text x="20" y="480" fill="%2364748B" font-family="monospace" font-size="11">SOVEREIGN AIR-GAP VERIFIED • ISO 15926 SCHEMA • AUDIT ID: 8940-XF9</text></svg>`;

const NTPC_GRID_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" fill="none"><rect width="800" height="500" fill="%2307090E"/><g stroke="%231E2638" stroke-width="1"><path d="M0 0h800v500H0z" fill="none"/><path d="M0 100h800M0 200h800M0 300h800M0 400h800M200 0v500M400 0v500M600 0v500"/></g><rect x="100" y="120" width="220" height="260" rx="12" fill="%230D111A" stroke="%23F59E0B" stroke-width="2"/><text x="120" y="160" fill="%23F59E0B" font-family="monospace" font-size="15" font-weight="bold">TRANSFORMER T-04 (500 MVA)</text><text x="120" y="190" fill="%2394A3B8" font-family="monospace" font-size="12">Core Thermal Threshold: 95.0°C</text><text x="120" y="210" fill="%23F43F5E" font-family="monospace" font-size="12" font-weight="bold">Current Peak Temp: 112.4°C ⚠️</text><rect x="440" y="120" width="260" height="260" rx="12" fill="%230D111A" stroke="%2310B981" stroke-width="2"/><text x="460" y="160" fill="%2310B981" font-family="monospace" font-size="15" font-weight="bold">INVERTER BANK B-02</text><text x="460" y="190" fill="%2394A3B8" font-family="monospace" font-size="12">Efficiency: 98.4% (Nominal)</text><path d="M320 250h120" stroke="%23F59E0B" stroke-width="4" stroke-dasharray="6 3"/><circle cx="380" cy="250" r="14" fill="%23F43F5E"/><text x="375" y="254" fill="%23FFF" font-family="monospace" font-size="10" font-weight="bold">HOT</text><text x="20" y="30" fill="%23F8FAFC" font-family="sans-serif" font-size="16" font-weight="bold">NTPC SUBSTATION 400KV - THERMAL GRID TELEMETRY MAP</text></svg>`;

const ISRO_TURBINE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" fill="none"><rect width="800" height="500" fill="%2307090E"/><circle cx="400" cy="250" r="180" stroke="%2300F0FF" stroke-width="2" fill="%230D111A"/><circle cx="400" cy="250" r="120" stroke="%2310B981" stroke-width="1.5" stroke-dasharray="8 4"/><circle cx="400" cy="250" r="50" stroke="%23A855F7" stroke-width="3" fill="%231E2638"/><path d="M400 70v110M400 320v110M220 250h110M470 250h110M272 122l78 78M450 300l78 78M272 378l78-78M450 200l78-78" stroke="%2300F0FF" stroke-width="2"/><text x="330" y="255" fill="%23A855F7" font-family="monospace" font-size="13" font-weight="bold">TI-6AL-4V CORE</text><rect x="580" y="80" width="190" height="150" fill="%230E1726" stroke="%2300F0FF" stroke-width="1.5"/><text x="590" y="105" fill="%2300F0FF" font-family="monospace" font-size="12" font-weight="bold">SPECIFICATION METRICS</text><text x="590" y="130" fill="%2394A3B8" font-family="monospace" font-size="11">Tensile: 950 MPa</text><text x="590" y="150" fill="%2394A3B8" font-family="monospace" font-size="11">Yield: 880 MPa</text><text x="590" y="170" fill="%2310B981" font-family="monospace" font-size="11" font-weight="bold">MIL-STD-810H: PASS</text><text x="20" y="30" fill="%23F8FAFC" font-family="sans-serif" font-size="16" font-weight="bold">ISRO / DRDO AEROSPACE TURBINE STAGE-1 BLADE ASSEMBLY</text></svg>`;

export const MOCK_DEMO_SCENARIOS: IndustrialDemoScenario[] = [
  {
    id: 'mrpl-offshore',
    title: 'MRPL Offshore Separator Overpressure & P&ID Audit',
    sector: 'Oil & Gas',
    organization: 'MRPL / ONGC',
    description: 'Autonomous P&ID schematic parsing, hoop stress validation on Separator V-102, API 510 compliance check, and Python fluid dynamics sandbox calculation.',
    blueprintImageUrl: MRPL_PID_SVG,
    documents: [
      'MRPL_PANDID_CHARLIE_REV4.pdf',
      'API_510_PRESSURE_VESSEL_INSPECTION_CODE.pdf',
      'VESSEL_V102_TELEMETRY_LOGS_2026.csv'
    ],
    sampleQuery: 'Analyze Separator V-102 overpressure event (87.4 bar vs 75.0 bar design limit). Calculate maximum allowable working pressure (MAWP) using Python sandbox and verify API 510 compliance.',
    telemetry: [
      { timestamp: '08:00:00', pressureBar: 71.2, temperatureC: 62.4, vibrationMms: 1.2, flowRateLmin: 1420, anomalyScore: 0.05, stressMpa: 112 },
      { timestamp: '08:15:00', pressureBar: 74.8, temperatureC: 65.1, vibrationMms: 1.5, flowRateLmin: 1450, anomalyScore: 0.12, stressMpa: 118 },
      { timestamp: '08:30:00', pressureBar: 81.3, temperatureC: 71.8, vibrationMms: 3.4, flowRateLmin: 1580, anomalyScore: 0.68, stressMpa: 135 },
      { timestamp: '08:45:00', pressureBar: 87.4, temperatureC: 78.5, vibrationMms: 5.8, flowRateLmin: 1720, anomalyScore: 0.94, stressMpa: 152 },
      { timestamp: '09:00:00', pressureBar: 84.1, temperatureC: 75.2, vibrationMms: 4.1, flowRateLmin: 1610, anomalyScore: 0.79, stressMpa: 144 },
      { timestamp: '09:15:00', pressureBar: 76.5, temperatureC: 68.0, vibrationMms: 2.1, flowRateLmin: 1490, anomalyScore: 0.35, stressMpa: 122 },
    ],
    initialNodes: [
      { 
        id: 'node-1', 
        name: 'Master Task Planner', 
        role: 'Decomposes industrial query into execution steps', 
        type: 'planner', 
        status: 'completed', 
        latencyMs: 140, 
        tokensUsed: 310, 
        iconName: 'BrainCircuit', 
        lastOutput: 'Plan created: 4 execution steps validated.',
        hyperparameters: { temperature: 0.1, topP: 0.9, maxTokens: 1024, contextWindow: 32768, systemPrompt: 'Strict industrial task planner', allowedTools: ['all'] }
      },
      { 
        id: 'node-2', 
        name: 'Multimodal Vision OCR', 
        role: 'Parses P&ID schematics & spatial coordinates', 
        type: 'vision_ocr', 
        status: 'completed', 
        latencyMs: 380, 
        tokensUsed: 620, 
        iconName: 'Eye', 
        lastOutput: 'Extracted 14 P&ID valves and Separator V-102 bounds.',
        hyperparameters: { temperature: 0.0, topP: 1.0, maxTokens: 2048, contextWindow: 65536, systemPrompt: 'Visual layout & spatial coordinate extractor', allowedTools: ['ocr_parse'] }
      },
      { 
        id: 'node-3', 
        name: 'Python Sandbox Engine', 
        role: 'Executes hoop stress equation & MAWP calculation', 
        type: 'python_sandbox', 
        status: 'completed', 
        latencyMs: 210, 
        tokensUsed: 450, 
        iconName: 'Terminal', 
        lastOutput: 'Calculated MAWP = 79.2 bar. Safety margin violated by 8.2 bar.',
        hyperparameters: { temperature: 0.0, topP: 1.0, maxTokens: 4096, contextWindow: 16384, systemPrompt: 'Isolated Pyodide WebAssembly executor', allowedTools: ['python_repl'] }
      },
      { id: 'node-4', name: 'API 510 RAG Grounding', role: 'Retrieves mandatory inspection directives', type: 'rag_vector', status: 'completed', latencyMs: 290, tokensUsed: 540, iconName: 'Database', lastOutput: 'Retrieved 3 page-level citations from API 510 Code.' },
      { id: 'node-5', name: 'Compliance Guardrail', role: 'Verifies safety thresholds & triggers HITL gate', type: 'compliance_verifier', status: 'completed', latencyMs: 180, tokensUsed: 290, iconName: 'ShieldAlert', lastOutput: 'Triggered HITL Approval Gate for Relief Valve Calibration.' },
      { id: 'node-6', name: 'Executive Report Writer', role: 'Synthesizes inspection brief & markdown export', type: 'report_writer', status: 'completed', latencyMs: 420, tokensUsed: 890, iconName: 'FileText', lastOutput: 'Inspection report generated with page citations.' },
    ],
    initialChat: [
      {
        id: 'msg-1',
        sender: 'user',
        content: 'Analyze Separator V-102 overpressure event (87.4 bar vs 75.0 bar design limit). Calculate maximum allowable working pressure (MAWP) using Python sandbox and verify API 510 compliance.',
        timestamp: '12:40:00'
      },
      {
        id: 'msg-2',
        sender: 'agent',
        agentName: 'NEXUS Agent Swarm',
        agentRole: 'Sovereign Industrial Orchestrator',
        content: `### 🚨 Critical Engineering Inspection Alert: Separator V-102 Overpressure Event

Based on multimodal analysis of **MRPL P&ID Blueprint (REV-04)** and live telemetry log ingestion:

#### 1. Visual & Spatial Evidence (P&ID Bounding Box Grounding)
* **Equipment ID**: \`V-102\` (High-Pressure Three-Phase Separator)
* **Design Pressure Rating**: \`75.0 bar\` @ 65.0°C
* **Peak Telemetry Ingested**: \`87.4 bar\` @ 08:45:00 (Exceeds design limit by **16.5%**)
* **Pressure Relief Valve (PRV-204)**: Set-point \`78.5 bar\` failed to actuate within nominal response time.

#### 2. Python Sandbox Physics Execution (MAWP Formula)
Using the ASME Section VIII / API 510 Hoop Stress formula:
$$MAWP = \\frac{S \\cdot E \\cdot t}{R + 0.6 \\cdot t} - P_{corr}$$

Where:
* Shell Tensile Stress ($S$) = 137.9 MPa (SA-516 Gr 70 Carbon Steel)
* Weld Joint Efficiency ($E$) = 0.85
* Nominal Thickness ($t$) = 24.5 mm (Corrosion Allowance = 3.0 mm)
* Vessel Radius ($R$) = 900.0 mm

\`\`\`python
# Live Output from Python Execution Sandbox
MAWP_calculated = 79.18  # bar
Actual_Peak = 87.40      # bar
Safety_Factor = 0.906    # VIOLATION: Must be >= 1.15
\`\`\`

#### 3. API 510 Compliance Verdict
> ⚠️ **NON-CONFORMANCES IDENTIFIED (API 510 Section 6.4)**
> 1. Vessel operated above calculated MAWP (79.18 bar) for **34 minutes**.
> 2. PRV-204 requires immediate bench testing & recalibration.
> 3. Mandatory Ultrasonic Thickness (UT) scan required on lower head seam.`,
        timestamp: '12:40:05',
        thoughtProcess: [
          'Step 1: Ingest P&ID SVG layout coordinates & extract bounding box for V-102.',
          'Step 2: Parse CSV telemetry logs for 08:00 - 09:15 interval.',
          'Step 3: Spawn Python Sandbox worker to calculate ASME MAWP hoop stress.',
          'Step 4: Perform vector RAG search over API 510 inspection standards.',
          'Step 5: Synthesize executive summary with page citations.'
        ],
        toolCalls: [
          { toolName: 'multimodal_ocr_parse', input: 'document: MRPL_PANDID_CHARLIE_REV4.pdf, element: V-102', output: 'Bounding box [x:15%, y:28%, w:20%, h:44%], confidence: 99.4%', executionTimeMs: 380 },
          { toolName: 'python_sandbox_run', input: 'exec(mawp_calculator.py)', output: 'MAWP: 79.18 bar | Safety Margin: -8.22 bar | Status: FAIL', executionTimeMs: 210 },
          { toolName: 'rag_vector_search', input: 'query: API 510 overpressure allowable limits', output: 'Matches: API 510 Sec 6.4 (Score: 0.94), Sec 8.1 (Score: 0.89)', executionTimeMs: 290 }
        ],
        citations: [
          {
            id: 'cit-1',
            documentName: 'API_510_PRESSURE_VESSEL_INSPECTION_CODE.pdf',
            pageNumber: 34,
            sectionTitle: 'Section 6.4: Overpressure Relief Protection Standards',
            snippet: 'Pressure vessels in hydrocarbon service shall not be subjected to pressures exceeding 110% of MAWP except during sudden emergency relief valve discharge.',
            confidenceScore: 0.94,
            boundingBox: { id: 'box-1', label: 'PRV-204 Actuation Mandate', confidence: 0.94, x: 42, y: 32, width: 18, height: 12, type: 'valve', detail: 'Pressure Relief Valve PRV-204 set-point mismatch' }
          },
          {
            id: 'cit-2',
            documentName: 'MRPL_PANDID_CHARLIE_REV4.pdf',
            pageNumber: 2,
            sectionTitle: 'High-Pressure Separator Specification Table',
            snippet: 'V-102 Design Limit: 75.0 bar, Shell Material: SA-516 Gr 70, Corrosion Allowance: 3.0mm.',
            confidenceScore: 0.98,
            boundingBox: { id: 'box-2', label: 'V-102 Vessel Bounds', confidence: 0.98, x: 15, y: 28, width: 20, height: 44, type: 'violation', detail: 'Overpressure region flagged in P&ID schematic' }
          }
        ],
        requiresHITL: true,
        hitlActionId: 'hitl-001',
        isHITLApproved: false
      }
    ],
    ideFiles: [
      {
        id: 'file-1',
        name: 'mawp_calculator.py',
        language: 'python',
        modified: false,
        code: `# MRPL Sovereign AI Sandbox - ASME Sec VIII MAWP & Hoop Stress Calculator
import math

def calculate_mawp(S_mpa, E, t_mm, R_mm, c_mm):
    """
    S_mpa: Allowable stress (SA-516 Gr 70 = 137.9 MPa)
    E: Joint efficiency (0.85)
    t_mm: Nominal shell thickness (24.5 mm)
    R_mm: Inside radius (900.0 mm)
    c_mm: Corrosion allowance (3.0 mm)
    """
    t_eff = t_mm - c_mm  # Effective thickness
    S_bar = S_mpa * 10.0 # Convert MPa to bar
    
    # ASME VIII Div 1 Formula: P = (S * E * t) / (R + 0.6 * t)
    mawp_bar = (S_bar * E * t_eff) / (R_mm + 0.6 * t_eff)
    return round(mawp_bar, 2)

S = 137.9  # MPa
E = 0.85
t = 24.5   # mm
R = 900.0  # mm
c = 3.0    # mm

mawp = calculate_mawp(S, E, t, R, c)
actual_pressure = 87.4

print(f"=== SOVEREIGN KERNEL MAWP ANALYSIS ===")
print(f"Calculated MAWP : {mawp} bar")
print(f"Recorded Peak   : {actual_pressure} bar")
print(f"Delta Margin    : {round(mawp - actual_pressure, 2)} bar")
if actual_pressure > mawp:
    print("STATUS: ⚠️ CRITICAL OVERPRESSURE VIOLATION")
else:
    print("STATUS: ✅ SAFE OPERATIONAL BOUNDS")
`
      },
      {
        id: 'file-2',
        name: 'stress_matrix.py',
        language: 'python',
        modified: false,
        code: `# von Mises Tensor Calculation Module
import numpy as np

def calculate_von_mises(sigma_x, sigma_y, tau_xy):
    """Calculates equivalent von Mises stress for shell plate element"""
    return np.sqrt(sigma_x**2 - sigma_x*sigma_y + sigma_y**2 + 3*tau_xy**2)

s_x = 142.5  # MPa
s_y = 65.2   # MPa
t_xy = 18.4  # MPa

vm_stress = calculate_von_mises(s_x, s_y, t_xy)
print(f"Calculated von Mises Equivalent Stress: {round(vm_stress, 2)} MPa")
`
      },
      {
        id: 'file-3',
        name: 'compliance_rules.sql',
        language: 'sql',
        modified: false,
        code: `-- Sovereign PGVector RAG Compliance Query
SELECT 
    doc_id, 
    section_title, 
    page_number, 
    1 - (embedding <=> :query_vector) AS cosine_similarity
FROM api_510_inspection_vectors
WHERE cosine_similarity > 0.85
ORDER BY cosine_similarity DESC
LIMIT 5;
`
      }
    ],
    knowledgeNodes: [
      { id: 'kn-1', label: 'V-102 SEPARATOR', category: 'ASSET', x: 200, y: 150, details: 'High Pressure 3-Phase Vessel', status: 'CRITICAL' },
      { id: 'kn-2', label: 'PRV-204 VALVE', category: 'ASSET', x: 450, y: 120, details: 'Mechanical Pressure Relief Valve', status: 'WARNING' },
      { id: 'kn-3', label: 'API 510 SEC 6.4', category: 'REGULATION', x: 200, y: 340, details: 'Overpressure Relief Standards' },
      { id: 'kn-4', label: 'PT-102 SENSOR', category: 'SENSOR', x: 450, y: 340, details: 'Digital Telemetry Pressure Transducer' },
      { id: 'kn-5', label: 'MAWP METRIC', category: 'METRIC', x: 680, y: 230, details: 'Maximum Allowable Working Pressure = 79.18 bar' }
    ],
    knowledgeEdges: [
      { id: 'ke-1', source: 'kn-1', target: 'kn-2', relation: 'PROTECTED_BY' },
      { id: 'ke-2', source: 'kn-1', target: 'kn-3', relation: 'GOVERNED_BY' },
      { id: 'ke-3', source: 'kn-1', target: 'kn-4', relation: 'MONITORED_BY' },
      { id: 'ke-4', source: 'kn-2', target: 'kn-5', relation: 'CALCULATES' }
    ],
    groundedCitations: [
      {
        id: 'cit-1',
        documentName: 'API_510_PRESSURE_VESSEL_INSPECTION_CODE.pdf',
        pageNumber: 34,
        sectionTitle: 'Section 6.4: Overpressure Relief Protection Standards',
        snippet: 'Pressure vessels in hydrocarbon service shall not be subjected to pressures exceeding 110% of MAWP except during sudden emergency relief valve discharge.',
        confidenceScore: 0.94
      },
      {
        id: 'cit-2',
        documentName: 'MRPL_PANDID_CHARLIE_REV4.pdf',
        pageNumber: 2,
        sectionTitle: 'High-Pressure Separator Specification Table',
        snippet: 'V-102 Design Limit: 75.0 bar, Shell Material: SA-516 Gr 70, Corrosion Allowance: 3.0mm.',
        confidenceScore: 0.98
      }
    ],
    boundingBoxes: [
      { 
        id: 'box-1', 
        label: 'V-102 SEPARATOR', 
        confidence: 0.98, 
        x: 15, 
        y: 28, 
        width: 20, 
        height: 44, 
        type: 'violation', 
        detail: 'High pressure separator V-102 overpressure zone',
        assetHealth: {
          id: 'asset-v102',
          name: 'High-Pressure 3-Phase Separator V-102',
          type: 'Pressure Vessel',
          status: 'CRITICAL_ALERT',
          pressureRatingBar: 75.0,
          currentPressureBar: 87.4,
          temperatureC: 78.5,
          vibrationMms: 5.8,
          lastInspectionDate: '2025-11-14',
          nextInspectionDue: '2026-03-01 (OVERDUE)',
          manufacturer: 'L&T Heavy Engineering',
          serialNumber: 'LT-PV-2021-9984',
          complianceScore: 68.5,
          maintenanceHistory: [
            { date: '2025-11-14', action: 'Ultrasonic Wall Scan (24.5mm recorded)', technician: 'Eng. Dewesh' },
            { date: '2024-05-20', action: 'Internal Baffle Cleaning & Gasket Replacement', technician: 'Eng. Kumar' }
          ]
        }
      },
      { id: 'box-2', label: 'PRV-204 RELIEF VALVE', confidence: 0.94, x: 42, y: 46, width: 8, height: 10, type: 'valve', detail: 'Pressure relief valve set to 78.5 bar' },
      { id: 'box-3', label: 'E-104 HEAT EXCHANGER', confidence: 0.96, x: 52, y: 32, width: 18, height: 36, type: 'sensor', detail: 'Downstream heat exchanger temperature probe' }
    ]
  },
  {
    id: 'ntpc-substation',
    title: 'NTPC Substation 400kV Transformer Thermal Spike Anomaly',
    sector: 'Energy Grid',
    organization: 'NTPC / PowerGrid',
    description: 'Thermal matrix anomaly detection on Transformer T-04 (112.4°C vs 95.0°C limit), IEEE C57.91 aging rate evaluation, and predictive maintenance ROI sandbox model.',
    blueprintImageUrl: NTPC_GRID_SVG,
    documents: [
      'NTPC_SUBSTATION_400KV_MAP.pdf',
      'IEEE_C57_91_TRANSFORMER_LOADING_GUIDE.pdf',
      'TRANSFORMER_T04_THERMAL_TELEMETRY.csv'
    ],
    sampleQuery: 'Detect root cause of thermal spike on Transformer T-04 (112.4°C). Run IEEE C57.91 thermal aging acceleration factor ($F_{AA}$) in Python sandbox.',
    telemetry: [
      { timestamp: '10:00:00', pressureBar: 1.2, temperatureC: 82.0, vibrationMms: 0.4, flowRateLmin: 890, anomalyScore: 0.02 },
      { timestamp: '10:15:00', pressureBar: 1.2, temperatureC: 88.5, vibrationMms: 0.6, flowRateLmin: 880, anomalyScore: 0.08 },
      { timestamp: '10:30:00', pressureBar: 1.3, temperatureC: 99.2, vibrationMms: 1.8, flowRateLmin: 820, anomalyScore: 0.61 },
      { timestamp: '10:45:00', pressureBar: 1.4, temperatureC: 112.4, vibrationMms: 3.2, flowRateLmin: 740, anomalyScore: 0.96 },
      { timestamp: '11:00:00', pressureBar: 1.3, temperatureC: 106.1, vibrationMms: 2.4, flowRateLmin: 790, anomalyScore: 0.81 },
      { timestamp: '11:15:00', pressureBar: 1.2, temperatureC: 94.0, vibrationMms: 1.1, flowRateLmin: 860, anomalyScore: 0.28 },
    ],
    initialNodes: [
      { id: 'node-1', name: 'Master Task Planner', role: 'Plans thermal anomaly decomposition', type: 'planner', status: 'completed', latencyMs: 120, tokensUsed: 280, iconName: 'BrainCircuit' },
      { id: 'node-2', name: 'Telemetry Stream Analyzer', role: 'Ingests sub-second SCADA thermal sensor feeds', type: 'vision_ocr', status: 'completed', latencyMs: 290, tokensUsed: 490, iconName: 'Eye' },
      { id: 'node-3', name: 'Python Sandbox Engine', role: 'Calculates IEEE thermal degradation rate FAA', type: 'python_sandbox', status: 'completed', latencyMs: 190, tokensUsed: 410, iconName: 'Terminal' },
      { id: 'node-4', name: 'IEEE Standards Vector RAG', role: 'Retrieves insulation life decay curves', type: 'rag_vector', status: 'completed', latencyMs: 250, tokensUsed: 510, iconName: 'Database' },
      { id: 'node-5', name: 'Grid Safety Verifier', role: 'Evaluates trip risk & load shedding options', type: 'compliance_verifier', status: 'completed', latencyMs: 160, tokensUsed: 260, iconName: 'ShieldAlert' },
      { id: 'node-6', name: 'Report Generator', role: 'Synthesizes NTPC Grid Incident Brief', type: 'report_writer', status: 'completed', latencyMs: 380, tokensUsed: 780, iconName: 'FileText' }
    ],
    initialChat: [],
    ideFiles: [
      {
        id: 'file-ntpc-1',
        name: 'thermal_aging.py',
        language: 'python',
        modified: false,
        code: `# NTPC Sovereign AI - IEEE C57.91 Transformer Thermal Aging Model
import math

def calculate_faa(theta_h_celsius):
    theta_k = theta_h_celsius + 273.15
    faa = math.exp((15000 / 383.15) - (15000 / theta_k))
    return round(faa, 2)

theta_peak = 112.4
faa_val = calculate_faa(theta_peak)
print(f"IEEE FAA Thermal Aging Factor: {faa_val}x (Nominal 1.0x)")
`
      }
    ],
    knowledgeNodes: [
      { id: 'kn-n1', label: 'TRANSFORMER T-04', category: 'ASSET', x: 250, y: 180, details: '500 MVA Substation Transformer', status: 'CRITICAL' },
      { id: 'kn-n2', label: 'IEEE C57.91', category: 'REGULATION', x: 550, y: 180, details: 'Thermal Loading Standard' }
    ],
    knowledgeEdges: [
      { id: 'ke-n1', source: 'kn-n1', target: 'kn-n2', relation: 'EVALUATED_BY' }
    ],
    groundedCitations: [
      {
        id: 'cit-ntpc-1',
        documentName: 'IEEE_C57_91_TRANSFORMER_LOADING_GUIDE.pdf',
        pageNumber: 18,
        sectionTitle: 'Section 5.2: Thermal Aging Acceleration Factor',
        snippet: 'Operation above 110°C hot-spot temperature causes exponential degradation of kraft paper insulation, increasing risk of dielectric breakdown.',
        confidenceScore: 0.97
      }
    ],
    boundingBoxes: [
      { id: 'box-ntpc-1', label: 'TRANSFORMER T-04', confidence: 0.97, x: 12, y: 24, width: 28, height: 52, type: 'violation', detail: 'Critical thermal hotspot zone' }
    ]
  },
  {
    id: 'isro-defense',
    title: 'ISRO / DRDO Aerospace Turbine MIL-STD Materials Audit',
    sector: 'Defense Aerospace',
    organization: 'ISRO / DRDO',
    description: 'Multimodal aerospace blueprint verification of Ti-6Al-4V Titanium Alloy turbine housing, yield strength Python calculations, and MIL-STD-810H environmental compliance audit.',
    blueprintImageUrl: ISRO_TURBINE_SVG,
    documents: [
      'ISRO_STAGE1_TURBINE_BLUEPRINT.pdf',
      'MIL_STD_810H_ENVIRONMENTAL_TESTING.pdf',
      'TITANIUM_ALLOY_METALLURGY_REPORT.pdf'
    ],
    sampleQuery: 'Verify if Ti-6Al-4V core alloy meets MIL-STD-810H tensile yield stress requirements (880 MPa) under 14,000 RPM centrifugal loading.',
    telemetry: [
      { timestamp: '12:00:00', pressureBar: 42.0, temperatureC: 450, vibrationMms: 0.8, flowRateLmin: 3200, anomalyScore: 0.01 },
      { timestamp: '12:10:00', pressureBar: 58.0, temperatureC: 620, vibrationMms: 1.2, flowRateLmin: 3500, anomalyScore: 0.04 },
      { timestamp: '12:20:00', pressureBar: 74.0, temperatureC: 780, vibrationMms: 2.1, flowRateLmin: 3900, anomalyScore: 0.09 },
      { timestamp: '12:30:00', pressureBar: 88.0, temperatureC: 890, vibrationMms: 3.8, flowRateLmin: 4200, anomalyScore: 0.18 },
    ],
    initialNodes: [
      { id: 'node-1', name: 'Master Task Planner', role: 'Decomposes aerospace structural compliance query', type: 'planner', status: 'completed', latencyMs: 110, tokensUsed: 260, iconName: 'BrainCircuit' },
      { id: 'node-2', name: 'CAD / Blueprint OCR Engine', role: 'Parses vector CAD geometry & alloy specs', type: 'vision_ocr', status: 'completed', latencyMs: 340, tokensUsed: 580, iconName: 'Eye' },
      { id: 'node-3', name: 'Python Centrifugal Stress Engine', role: 'Calculates von Mises stress @ 14k RPM', type: 'python_sandbox', status: 'completed', latencyMs: 230, tokensUsed: 440, iconName: 'Terminal' },
      { id: 'node-4', name: 'MIL-STD-810H Vector RAG', role: 'Grounds compliance against defense specs', type: 'rag_vector', status: 'completed', latencyMs: 270, tokensUsed: 490, iconName: 'Database' },
      { id: 'node-5', name: 'Defense Security Auditor', role: 'Ensures zero cloud egress & air-gap verification', type: 'compliance_verifier', status: 'completed', latencyMs: 140, tokensUsed: 210, iconName: 'ShieldAlert' },
      { id: 'node-6', name: 'Aerospace Certification Writer', role: 'Generates DRDO/ISRO Flight Readiness Brief', type: 'report_writer', status: 'completed', latencyMs: 390, tokensUsed: 810, iconName: 'FileText' }
    ],
    initialChat: [],
    ideFiles: [
      {
        id: 'file-isro-1',
        name: 'titanium_stress.py',
        language: 'python',
        modified: false,
        code: `# ISRO Centrifugal Stress Model
import math

density = 4430.0  # Ti-6Al-4V density
rpm = 14000
radius = 0.25
omega = (2 * math.pi * rpm) / 60.0
stress_pa = density * (omega ** 2) * (radius ** 2)
print(f"Calculated von Mises Stress: {round(stress_pa / 1e6, 2)} MPa")
`
      }
    ],
    knowledgeNodes: [
      { id: 'kn-i1', label: 'TI-6AL-4V TURBINE CORE', category: 'ASSET', x: 280, y: 200, details: 'Grade 5 Aerospace Titanium', status: 'OPTIMAL' },
      { id: 'kn-i2', label: 'MIL-STD-810H', category: 'REGULATION', x: 580, y: 200, details: 'Environmental Defense Spec' }
    ],
    knowledgeEdges: [
      { id: 'ke-i1', source: 'kn-i1', target: 'kn-i2', relation: 'PASSED' }
    ],
    groundedCitations: [
      {
        id: 'cit-isro-1',
        documentName: 'MIL_STD_810H_ENVIRONMENTAL_TESTING.pdf',
        pageNumber: 82,
        sectionTitle: 'Section 4.1: Rotational Centrifugal Stress Limits',
        snippet: 'Rotating aerospace components fabricated from Grade 5 Titanium alloys must maintain a minimum structural yield safety factor of 1.25 under maximum rated RPM.',
        confidenceScore: 0.99
      }
    ],
    boundingBoxes: [
      { id: 'box-isro-1', label: 'TI-6AL-4V TURBINE CORE', confidence: 0.99, x: 26, y: 14, width: 48, height: 72, type: 'sensor', detail: 'Turbine core titanium alloy assembly' }
    ]
  }
];

export const INITIAL_GATEWAY_STATS: ModelGatewayStats = {
  activeModel: 'NEXUS-Sovereign-DeepSeek-R1-Local-Quant-7B',
  sovereignMode: true,
  vramUsedGb: 14.2,
  totalVramGb: 24.0,
  tokensPerSec: 64.8,
  latencyAvgMs: 240,
  promptInjectionBlocked: 14,
  airGapStatus: 'ISOLATED'
};

export const INITIAL_QUALITY_METRICS: SystemQualityMetrics = {
  hallucinationPreventionScore: 99.4,
  citationGroundingRate: 98.8,
  retrievalPrecisionScore: 96.5,
  toolExecutionReliability: 100.0,
  totalRunsEvaluated: 1420,
  avgResponseTimeMs: 310
};

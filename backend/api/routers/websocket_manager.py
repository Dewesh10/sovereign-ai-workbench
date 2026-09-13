"""
NEXUS Sovereign AI - WebSocket Trace Broadcast Manager
Manages WebSocket connections and streams live agent execution traces token-by-token.
"""

from typing import List
from fastapi import WebSocket

class WebSocketTraceManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast_event(self, event_data: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(event_data)
            except Exception:
                pass

ws_trace_manager = WebSocketTraceManager()

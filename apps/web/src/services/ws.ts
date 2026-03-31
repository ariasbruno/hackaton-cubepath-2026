type EventListener = (payload: any) => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private readonly baseUrl: string;
  private listeners: Map<string, Set<EventListener>> = new Map();

  constructor() {
    this.baseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
  }

  public connect(roomId: string, playerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.disconnect();
      }

      const url = new URL(this.baseUrl);
      url.searchParams.set('roomId', roomId);
      url.searchParams.set('playerId', playerId);

      this.ws = new WebSocket(url.toString());

      let isIntentional = false;

      this.ws.onopen = () => {
        console.log('[WS] Connected to:', url.toString());
        resolve();
      };

      this.ws.onerror = (error) => {
        if (!isIntentional) {
          console.error('[WS] Error:', error);
          reject(error);
        }
      };

      this.ws.onmessage = (message) => {
        try {
          const data = JSON.parse(message.data);
          console.debug('[WS] Message:', data.type, data.payload);
          this.emitLocal(data.type, data.payload);
        } catch (err) {
          console.error('Failed to parse WS message', err);
        }
      };

      this.ws.onclose = (event) => {
        console.warn('[WS] Closed:', event.code, event.reason, isIntentional ? '(Intentional)' : '');
        if (!isIntentional) {
          this.emitLocal('DISCONNECTED', null);
          reject(new Error(`WS Closed: ${event.code}`));
        }
      };

      // Add a way to mark as intentional
      (this.ws as any)._markIntentional = () => {
        isIntentional = true;
      };
    });
  }

  public disconnect() {
    if (this.ws) {
      if ((this.ws as any)._markIntentional) {
        (this.ws as any)._markIntentional();
      }
      this.ws.close();
      this.ws = null;
    }
  }

  public leave() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.send('LEAVE_ROOM', {});
      if ((this.ws as any)._markIntentional) {
        (this.ws as any)._markIntentional();
      }
      // Server will close the socket
    }
  }

  public send(type: string, payload: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('Tried to send message but WS is not open', { type, payload });
    }
  }

  public on(event: string, callback: EventListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  public off(event: string, callback: EventListener) {
    this.listeners.get(event)?.delete(callback);
  }

  private emitLocal(event: string, payload: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(payload));
    }
  }
}

export const wsClient = new WebSocketClient();

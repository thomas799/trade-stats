import { useRef, useState } from 'react';

export function useWebSocket({ onMessage, onStatusChange, url }) {
  const [isConnected, setIsConnected] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const wsRef = useRef(null);
  const localCountRef = useRef(0);

  const connect = () => {
    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setIsConnected(true);
        if (onStatusChange) onStatusChange('Connected to WebSocket');
        localCountRef.current = 0;
        setMessageCount(0);
      };

      ws.onmessage = (event) => {
        try {
          if (onMessage) onMessage(event.data);
          localCountRef.current += 1;
          setMessageCount((prev) => prev + 1);
        } catch (error) {
          // Skip malformed messages
        }
      };

      ws.onerror = () => {
        if (onStatusChange) onStatusChange('WebSocket Error');
      };

      ws.onclose = () => {
        setIsConnected(false);
        if (onStatusChange) onStatusChange('Connection closed');
      };

      wsRef.current = ws;
    } catch (error) {
      if (onStatusChange) onStatusChange('Connection error: ' + error.message);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    if (onStatusChange) onStatusChange('Connection closed');
  };

  return { connect, disconnect, isConnected, messageCount };
}

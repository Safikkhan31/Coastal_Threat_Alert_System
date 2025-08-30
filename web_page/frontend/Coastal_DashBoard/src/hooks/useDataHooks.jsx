import { useState, useEffect, useCallback } from 'react';
import apiService from './apiService';

// Hook for managing real-time sensor data
export const useSensorData = (refreshInterval = 30000) => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.fetchSensorData();
      if (data) {
        setSensorData(data);
        setLastUpdated(new Date());
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return { sensorData, loading, error, lastUpdated, refetch: fetchData };
};

// Hook for managing threat predictions
export const useThreatPredictions = (refreshInterval = 60000) => {
  const [threats, setThreats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchThreats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.fetchThreatPredictions();
      if (data) {
        setThreats(data);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThreats();
    const interval = setInterval(fetchThreats, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchThreats, refreshInterval]);

  return { threats, loading, error, refetch: fetchThreats };
};

// Hook for managing system status
export const useSystemStatus = (refreshInterval = 15000) => {
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.fetchSystemStatus();
      if (data) {
        setSystemStatus(data);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchStatus, refreshInterval]);

  return { systemStatus, loading, error, refetch: fetchStatus };
};

// Hook for WebSocket real-time updates
export const useRealTimeData = () => {
  const [realTimeData, setRealTimeData] = useState(null);
  const [connected, setConnected] = useState(false);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const handleDataReceived = (data) => {
      setRealTimeData(data);
    };

    const websocket = apiService.setupWebSocket(handleDataReceived);
    setWs(websocket);

    websocket.onopen = () => setConnected(true);
    websocket.onclose = () => setConnected(false);

    return () => {
      websocket.close();
    };
  }, []);

    const sendMessage = useCallback((message) => {
      if (ws && connected) {
        ws.send(JSON.stringify(message));
      }
    }, [ws, connected]);
  
    return { realTimeData, connected, sendMessage };
  };
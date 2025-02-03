import { useEffect, useState } from "react";
interface SensorData {
  Humidity: number;
  Temperature: number;
  lightLevel: number;
  soilMoisture: number;
  soilNutrients: number;
  waterLevel: number;
  Signal_Strength: number;
}

const useWebSocketSensorData = (wsUrl: string) => {
  // const [sensorData, setSensorData] = useState(null);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectInterval: NodeJS.Timeout;
    let retryCount = 0;
    const maxRetries = 5;

    const connectWebSocket = () => {
      ws = new WebSocket(wsUrl);
      if (retryCount >= maxRetries) {
        setError("Max reconnection attempts reached. Please refresh the page.");
        return;
      }

      ws.onopen = () => {
        console.log("WebSocket connected.");
        setLoading(false);
        setError(null);
        retryCount = 0; // Reset retry count on successful connection
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected. Reconnecting in 3 seconds...");
        retryCount++;
        reconnectInterval = setTimeout(connectWebSocket, 3000);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (!data.message) {
            throw new Error("Invalid data format: 'message' property missing");
          }

         const parsedData = JSON.parse(data.message);
          setSensorData((prevData) => ({ ...prevData, ...parsedData }));
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
          setError("Failed to parse WebSocket data.");
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        setError("WebSocket connection error.");
      };
    };

    connectWebSocket();

    return () => {
      clearTimeout(reconnectInterval);
      ws.close();
    };
  }, [wsUrl]);

  return { sensorData, loading, error };
};

export default useWebSocketSensorData;

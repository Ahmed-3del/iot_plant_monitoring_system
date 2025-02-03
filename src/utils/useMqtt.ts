import { useEffect, useState } from "react";
import mqtt from "mqtt";
 
interface SensorData {
  Humidity: number;
  Temperature: number;
  lightLevel: number;
  soilMoisture: number;
  soilNutrients: number;
  waterLevel: number;
  Signal_Strength: number;
}

const MQTT_BROKER_URL = "ws://test.mosquitto.org:8080"; 
const MQTT_SENSOR_TOPIC = "sensor/status"; 

const useMqttSensorData = () => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER_URL);

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      setLoading(false);
      setError(null);
      client.subscribe(MQTT_SENSOR_TOPIC, (err) => {
        if (err) {
          console.error("Failed to subscribe:", err);
          setError("Failed to subscribe to MQTT topic.");
        } else {
          console.log(`Subscribed to topic: ${MQTT_SENSOR_TOPIC}`);
        }
      });
    });

    client.on("message", (topic, message) => {
      if (topic === MQTT_SENSOR_TOPIC) {
        try {
          const data = JSON.parse(message.toString());
          setSensorData((prevData) => ({ ...prevData, ...data }));
        } catch (err) {
          console.error("Error parsing MQTT message:", err);
          setError("Failed to parse MQTT data.");
        }
      }
    });

    client.on("error", (err) => {
      console.error("MQTT error:", err);
      setError("MQTT connection error.");
    });

    client.on("close", () => {
      console.log("MQTT connection closed.");
      setError("MQTT connection closed. Attempting to reconnect...");
      setLoading(true);
    });

    return () => {
      client.end();
    };
  }, []);

  return { sensorData, loading, error };
};

export default useMqttSensorData;
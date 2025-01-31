import mqtt from "mqtt";

const MQTT_BROKER_URL = "mqtt://test.mosquitto.org"; // Replace with your MQTT broker URL
const MQTT_SENSOR_TOPIC = "sensor/data"; // Topic to receive data from ESP32

// Create an MQTT client
const mqttClient = mqtt.connect(MQTT_BROKER_URL);

// Handle connection errors
mqttClient.on("error", (err) => {
  console.error("MQTT error:", err);
});

// Handle connection
mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe(MQTT_SENSOR_TOPIC, (err) => {
    if (err) {
      console.error("Failed to subscribe:", err);
    } else {
      console.log(`Subscribed to topic: ${MQTT_SENSOR_TOPIC}`);
    }
  });
});

// Export the MQTT client and a function to handle incoming messages
export const setupMqtt = (onMessageReceived: (arg0: string) => void) => {
  mqttClient.on("message", (topic, message) => {
    if (topic === MQTT_SENSOR_TOPIC) {
      const data = message.toString();
      console.log(`Received sensor data: ${data}`);
      onMessageReceived(data); // Call the callback function with the received data
    }
  });
};

export default mqttClient;
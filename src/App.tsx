import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Droplets,
  Thermometer,
  Send,
  TreesIcon as Plant,
  Wifi,
  Sun,
  FlaskRound,
} from "lucide-react";
import { Progress } from "./components/ui/progress";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Button } from "./componenets/ui/Button";
import { Settings } from "./componenets/settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./componenets/ui/Card";
// import { setupMqtt } from "./utils/mqttClient";

// Plant health thresholds (low, optimal, high) for each sensor
const THRESHOLDS = {
  humidity: { low: 30, optimal: 50, high: 80 }, // % RH (Relative Humidity)
  temperature: { low: 18, optimal: 23, high: 28 },
  light: { low: 30, optimal: 60, high: 85 },
  soilNutrients: { low: 40, optimal: 70, high: 90 },
};

interface SensorData {
  humidity: number;
  temperature: number;
  lightLevel: number;
  soilMoisture: number;
  soilNutrients: number;
  waterLevel: number;
}

interface Alert {
  type: "warning" | "error" | "info";
  title: string;
  description: string;
  action?: () => void;
  actionLabel?: string;
}

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData | null>({
    humidity: 0,
    temperature: 0,
    lightLevel: 0,
    soilMoisture: 0,
    soilNutrients: 0,
    waterLevel: 0,
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [plantHealth, setPlantHealth] = useState("Good");
  const [deviceHealth] = useState({
    batteryLevel: 80,
    signalStrength: 75,
    lastUpdate: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch sensor data from the backend API
  const fetchSensorData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/sensors", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch sensor data");
      }
      const data = await response.json();
      setSensorData(JSON.parse(data.data));
      setError(null);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      setError("Failed to fetch sensor data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }; 
  console.log(sensorData,"sensorData");
  console.log(typeof sensorData,"typeof sensorData");
  const evaluatePlantHealth = (data: SensorData) => {
    const issues: string[] = [];
    const criticalIssues: string[] = [];

    // Check humidity
    if (data.humidity < THRESHOLDS.humidity.low) {
      criticalIssues.push("Critical: Low Humidity");
    } else if (data.humidity > THRESHOLDS.humidity.high) {
      issues.push("High Humidity");
    }

    // Check temperature
    if (data.temperature < THRESHOLDS.temperature.low) {
      issues.push("Low Temperature");
    } else if (data.temperature > THRESHOLDS.temperature.high) {
      criticalIssues.push("Critical: High Temperature");
    }

    // Check light levels
    if (data.lightLevel < THRESHOLDS.light.low) {
      issues.push("Low Light Level");
    } else if (data.lightLevel > THRESHOLDS.light.high) {
      issues.push("High Light Level");
    }

    // Check soil nutrients
    if (data.soilNutrients < THRESHOLDS.soilNutrients.low) {
      criticalIssues.push("Critical: Low Nutrients");
    }

    // Generate alerts based on issues
    const newAlerts: Alert[] = [];

    criticalIssues.forEach((issue) => {
      newAlerts.push({
        type: "error",
        title: issue,
        description: `Immediate action required: ${issue.toLowerCase()}`,
        action: () => handleIssue(issue),
        actionLabel: "Fix Issue",
      });
    });

    issues.forEach((issue) => {
      newAlerts.push({
        type: "warning",
        title: issue,
        description: `Warning: ${issue.toLowerCase()} detected`,
        action: () => handleIssue(issue),
        actionLabel: "Review",
      });
    });

    setAlerts(newAlerts);

    // Update overall plant health status
    if (criticalIssues.length > 0) return "Poor";
    if (issues.length > 0) return "Fair";
    return "Good";
  };

  const handleIssue = (issue: string) => {
    switch (issue) {
      case "Critical: Low Humidity":
        sendDataToESP("increase_humidity");
        break;
      case "Critical: High Temperature":
        sendDataToESP("activate_cooling");
        break;
      case "Critical: Low Nutrients":
        sendDataToESP("add_nutrients");
        break;
      default:
        console.log(`Handling issue: ${issue}`);
    }
  };

  // Fetch sensor data on component mount
  useEffect(() => { 
    fetchSensorData(); 
  }, []);

  // Update plant health when sensor data changes
  useEffect(() => {
    if (sensorData) {
      const health = evaluatePlantHealth(sensorData);
      setPlantHealth(health);
    }
  }, [sensorData]);


  const sendDataToESP = (action: string) => {
    console.log(`Sending action to ESP32: ${action}`);
  };

  const onApplySettings = () => {
    sendDataToESP("update_settings");
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  // if (error) {
  //   return <div>{error}</div>;
  // }

  if (!sensorData) { 
    return <div>No sensor data available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Smart Farm Monitor</h1>
        <Avatar>
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback>SF</AvatarFallback>
        </Avatar>
      </header>
      <Tabs defaultValue="dashboard">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SensorCard
              title="Humidity"
              value={sensorData.humidity}
              unit="%"
              icon={<Droplets className="h-6 w-6" />}
              onSendData={() => sendDataToESP("humidity_data")}
              threshold={{
                low: THRESHOLDS.humidity.low,
                high: THRESHOLDS.humidity.high,
              }}
            />
            <SensorCard
              title="Temperature"
              value={sensorData.temperature}
              unit="°C"
              icon={<Thermometer className="h-6 w-6" />}
              onSendData={() => sendDataToESP("temperature_data")}
              threshold={{
                low: THRESHOLDS.temperature.low,
                high: THRESHOLDS.temperature.high,
              }}
            />
            <SensorCard
              title="Light Level"
              value={sensorData.lightLevel}
              unit="%"
              icon={<Sun className="h-6 w-6" />}
              onSendData={() => sendDataToESP("light_data")}
              threshold={{
                low: THRESHOLDS.light.low,
                high: THRESHOLDS.light.high,
              }}
            />
            <SensorCard
              title="Soil Moisture"
              value={sensorData.soilMoisture}
              unit="%"
              icon={<Droplets className="h-6 w-6" />}
              onSendData={() => sendDataToESP("soil_moisture_data")}
            />
            <SensorCard
              title="Soil Nutrients"
              value={sensorData.soilNutrients}
              unit="%"
              icon={<FlaskRound className="h-6 w-6" />}
              onSendData={() => sendDataToESP("nutrients_data")}
              threshold={{
                low: THRESHOLDS.soilNutrients.low,
                high: THRESHOLDS.soilNutrients.high,
              }}
            />
            <PlantHealthCard health={plantHealth} />
            <DeviceHealthCard health={deviceHealth} />
          </div>
          {alerts.map((alert, index) => (
            <Alert
              key={index}
              variant={alert.type === "error" ? "destructive" : "default"}
              className="mt-6"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
              {alert.action && (
                <div className="flex gap-2 mt-2">
                  <Button onClick={alert.action}>{alert.actionLabel || "Take Action"}</Button>
                </div>
              )}
            </Alert>
          ))}
        </TabsContent>
        <TabsContent value="settings">
          <Settings
            onApplySettings={onApplySettings}
            onResetAlarms={() => setAlerts([])}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  onSendData: () => void;
  threshold?: {
    low: number;
    high: number;
  };
}

function SensorCard({ title, value, unit, icon, onSendData, threshold }: SensorCardProps) {
  // Handle undefined or null value
  if (value === undefined || value === null) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-gray-500">N/A</div>
              <CardDescription>No data available</CardDescription>
            </div>
            <Button size="icon" variant="outline" onClick={onSendData}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = () => {
    if (!threshold) return "text-foreground";
    if (value < threshold.low) return "text-red-500";
    if (value > threshold.high) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <div className={`text-2xl font-bold ${getStatusColor()}`}>
              {value.toFixed(1)}
              {unit}
            </div>
            <CardDescription>Live reading from sensor</CardDescription>
          </div>
          <Button size="icon" variant="outline" onClick={onSendData}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {threshold && (
          <div className="mt-2 text-xs text-muted-foreground">
            Optimal range: {threshold.low}-{threshold.high}
            {unit}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PlantHealthCard({ health }: { health: string }) {
  const healthColor =
    health === "Good" ? "text-green-500" : health === "Fair" ? "text-yellow-500" : "text-red-500";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Plant Health</CardTitle>
        <Plant className="h-6 w-6" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${healthColor}`}>{health}</div>
        <CardDescription>Overall system status</CardDescription>
      </CardContent>
    </Card>
  );
}

function DeviceHealthCard({
  health,
}: {
  health: { batteryLevel: number; signalStrength: number; lastUpdate: string };
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Device Health</CardTitle>
        <Wifi className="h-6 w-6" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Signal Strength</span>
            <Wifi className="h-4 w-4" />
          </div>
          <Progress value={health.signalStrength} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1">{health.signalStrength.toFixed(1)}%</div>
        </div>
        <div className="text-xs text-muted-foreground">
          Last Update: {new Date(health.lastUpdate).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Droplets, Thermometer, Send, TreesIcon as Plant, Wifi, Battery } from "lucide-react"
import { Button } from "./componenets/ui/Button"
import { Settings } from "./componenets/settings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./componenets/ui/Card"
import { Progress } from "./components/ui/progress"

export default function Dashboard() {
  const [humidity, setHumidity] = useState(60)
  const [temperature, setTemperature] = useState(25)
  const [showAlert, setShowAlert] = useState(false)
  const [plantHealth, setPlantHealth] = useState("Good")
  const [deviceHealth, setDeviceHealth] = useState({
    batteryLevel: 80,
    signalStrength: 75,
    lastUpdate: new Date().toISOString(),
  })

  useEffect(() => {
    // Simulate sensor data updates
    const interval = setInterval(() => {
      setHumidity((prev) => {
        // prev + (Math.random() - 0.5) * 2
        const newValue = prev + (Math.random() - 0.5) * 2
        return Math.min(Math.max(newValue, 0), 100)
      })
      setTemperature((prev) => {
        const newValue = prev + (Math.random() - 0.5)
        return Math.round(newValue * 10) / 10
      })
      setDeviceHealth((prev) => ({
        ...prev,
        batteryLevel: Math.max(prev.batteryLevel - 0.1, 0),
        signalStrength: Math.min(Math.max(prev.signalStrength + (Math.random() - 0.5) * 5, 0), 100),
        lastUpdate: new Date().toISOString(),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setShowAlert(humidity < 30)
    setPlantHealth(humidity < 30 ? "Poor" : humidity < 50 ? "Fair" : "Good")
  }, [humidity])

  const handleAddWater = () => {
    setHumidity((prev) => Math.min(prev + 10, 100))
    setShowAlert(false)
    sendDataToESP("add_water")
  }

  const sendDataToESP = (action: string) => {
    // Simulate sending data to ESP32
    console.log(`Sending action to ESP32: ${action}`)
    // In a real scenario, this would be an API call or MQTT publish
  }

  const handleCloseAlarm = () => {
    setShowAlert(false)
    sendDataToESP("close_alarm")
  }
  
 
//       const Alarm = () => {
//     return (
//         <Alert variant="destructive" className="mt-6">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Low Humidity Alert</AlertTitle>
//             <AlertDescription>The humidity level is critically low. Please add water to the system.</AlertDescription>
//             <div className="flex gap-2 mt-2">
//                 <Button onClick={handleAddWater}>Add Water</Button>
//                 <Button variant="outline" onClick={handleCloseAlarm}>
//                     Close Alarm
//                 </Button>
//             </div>
//         </Alert>
//     )
// }

  const handleFeedPlants = () => {
    sendDataToESP("feed_plants")
    // You might want to update some state here to reflect that plants have been fed
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">IoT Plant Monitor</h1>
        <Avatar>
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback>UN</AvatarFallback>
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
              value={humidity}
              unit="%"
              icon={<Droplets className="h-6 w-6" />}
              onSendData={() => sendDataToESP("humidity_data")}
            />
            <SensorCard
              title="Temperature"
              value={temperature}
              unit="°C"
              icon={<Thermometer className="h-6 w-6" />}
              onSendData={() => sendDataToESP("temperature_data")}
            />
            <PlantHealthCard health={plantHealth} />
            <DeviceHealthCard health={deviceHealth} />
          </div>
          {showAlert && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Low Humidity Alert</AlertTitle>
              <AlertDescription>The humidity level is critically low. Please add water to the system.</AlertDescription>
              <div className="flex gap-2 mt-2">
                <Button onClick={handleAddWater}>Add Water</Button>
                <Button variant="outline" onClick={handleCloseAlarm}>
                  Close Alarm
                </Button>
              </div>
            </Alert>
          )}
        </TabsContent>
        <TabsContent value="settings">
          <Settings onFeedPlants={handleFeedPlants} onCloseAlarm={handleCloseAlarm} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SensorCard({ title, value, unit, icon, onSendData }:{
  title:string, 
  value:number,
  unit:string,
  icon:React.ReactNode, 
  onSendData: () => void
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-2xl font-bold">
              {value.toFixed(1)}
              {unit}
            </div>
            <CardDescription>Live reading from sensor</CardDescription>
          </div>
          <Button size="icon" variant="outline" onClick={onSendData}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function PlantHealthCard({ health }: { health: string }) {
  const healthColor = health === "Good" ? "text-green-500" : health === "Fair" ? "text-yellow-500" : "text-red-500"

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Soil Health</CardTitle>
        <Plant className="h-6 w-6" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${healthColor}`}>{health}</div>
        <CardDescription>Based on humidity levels</CardDescription>
      </CardContent>
    </Card>
  )
}

function DeviceHealthCard({ health } :{
   health: { batteryLevel: number, signalStrength: number, lastUpdate: string }
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
            <span className="text-sm font-medium">Battery</span>
            <Battery className="h-4 w-4" />
          </div>
          <Progress value={health.batteryLevel} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1">{health.batteryLevel.toFixed(1)}%</div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Signal Strength</span>
            <Wifi className="h-4 w-4" />
          </div>
          <Progress value={health.signalStrength} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1">{health.signalStrength.toFixed(1)}%</div>
        </div>
        <div className="text-xs text-muted-foreground">Last Update: {new Date(health.lastUpdate).toLocaleString()}</div>
      </CardContent>
    </Card>
  )
}


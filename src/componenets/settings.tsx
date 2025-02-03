import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import { Button } from "./ui/Button"
// import { Input } from "./ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card"


import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  SunMedium,
  Droplets,
  Thermometer,
  FlaskRound as Flask,
  Fan,
  Sprout,
  Timer,
  AlertTriangle,
  MoonIcon
} from "lucide-react"
interface SettingsProps {
  onApplySettings: () => void
  onResetAlarms: () => void
  sendDataToESP?: (data: string) => void
}

export function Settings({ onResetAlarms }: SettingsProps) {
  // System controls
  const [autoMode, setAutoMode] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [pestControlEnabled, setPestControlEnabled] = useState(true)
  const [pestControlSchedule, setPestControlSchedule] = useState("bi-weekly")

  const sendDataToESP32 = async (action: string) => {
    console.log(`Sending action to ESP32: ${action}`);
    await fetch(`http://localhost:8080/api/sensors/control`, {
      method: "POST",
      body: JSON.stringify({ action }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Timer className="h-5 w-5" />
            <CardTitle>System Control</CardTitle>
          </div>
          <CardDescription>Manage your smart farm automation settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-mode">Automatic Mode</Label>
            <Switch id="auto-mode" checked={autoMode} onCheckedChange={
              (checked) => {
                setAutoMode(checked)
                sendDataToESP32(checked ? "AUTOMODE_ON" : "AUTOMODE_OFF")
              }
            } />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Enable Alerts</Label>
            <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={
              (checked) => {
                setNotificationsEnabled(checked)
                sendDataToESP32(checked ? "ALARM_ON" : "ALARM_OFF")
              }

            } />
          </div>
          <Button variant="outline" className="w-full" onClick={
            () => {
              onResetAlarms()
              sendDataToESP32("ALARM_OFF")
            }
          }>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Reset All Alarms
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Thermometer className="h-5 w-5" />
            <CardTitle>Climate Control</CardTitle>
          </div>
          <CardDescription>Manage temperature, humidity, and ventilation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() =>
              sendDataToESP32("DECREASE_TEMPERATURE")
            }>
              <Thermometer className="mr-2 h-4 w-4" />
              Decrease Temp
            </Button>
            <Button onClick={() =>
              sendDataToESP32("INCREASE_TEMPERATURE")
            }>
              <Thermometer className="mr-2 h-4 w-4" />
              Increase Temp
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() =>
              sendDataToESP32("DECREASE_HUMIDITY")
            }>
              <Droplets className="mr-2 h-4 w-4" />
              Decrease Humidity
            </Button>
            <Button onClick={() =>
              sendDataToESP32("INCREASE_HUMIDITY")
            }>
              <Droplets className="mr-2 h-4 w-4" />
              Increase Humidity
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() =>
              sendDataToESP32("FAN_SPEED_LOW")
            }>
              <Fan className="mr-2 h-4 w-4" />
              Fan Speed Low
            </Button>
            <Button onClick={() =>
              sendDataToESP32("FAN_SPEED_HIGH")
            }>
              <Fan className="mr-2 h-4 w-4" />
              Fan Speed High
            </Button>
          </div>

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Droplets className="h-5 w-5" />
            <CardTitle>Irrigation Control</CardTitle>
          </div>
          <CardDescription>Manage water levels and irrigation schedules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() =>
              sendDataToESP32("START_IRRIGATION")
            }>
              <Droplets className="mr-2 h-4 w-4" />
              Start Irrigation
            </Button>
            <Button onClick={() =>
              sendDataToESP32("STOP_IRRIGATION")
            }>
              <Droplets className="mr-2 h-4 w-4" />
              Stop Irrigation
            </Button>
          </div>
          {/* <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="irrigation-time">Irrigation Time</Label>
              <Input
              id="irrigation-time"
              type="time"
              value={irrigationSchedule}
              onChange={(e) => setIrrigationSchedule(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="irrigation-duration">Duration (min)</Label>
              <Input
              id="irrigation-duration"
              type="number"
              min={1}
              max={60}
              value={1}
              onChange={(e) => setIrrigationDuration(Number(e.target.value))}
              />
            </div>
            </div>
            <Button onClick={() => {
            const now = new Date()
            const [hours, minutes] = irrigationSchedule.split(":").map(Number)
            const irrigationTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)
            const timeUntilIrrigation = irrigationTime.getTime() - now.getTime() - 60000 // 1 minute before irrigation

            if (timeUntilIrrigation > 0) {
              setTimeout(() => {
              sendDataToESP32("START_IRRIGATION")
              setTimeout(() => {
                sendDataToESP32("STOP_IRRIGATION")
              }, irrigationDuration * 60000) 
              }, timeUntilIrrigation)
            }
            }}>
            Set Irrigation Timer
            </Button> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <SunMedium className="h-5 w-5" />
            <CardTitle>Lighting Control</CardTitle>
          </div>
          <CardDescription>Manage grow lights and schedules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="light-mode">Light Mode</Label>

          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => console.log("Decrease light intensity")}>
              <SunMedium className="mr-2 h-4 w-4" />
              Light on
            </Button>
            <Button onClick={() => console.log("Increase light intensity")}>
              <MoonIcon className="mr-2 h-4 w-4" />
              Light off
            </Button>
          </div>
          {/* <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="light-start">Lights On</Label>
              <Input
                id="light-start"
                type="time"
                value={lightScheduleStart}
                onChange={(e) => {
                  setLightScheduleStart(e.target.value)
                  const now = new Date()
                  const [hours, minutes] = e.target.value.split(":").map(Number)
                  const lightOnTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)
                  const timeUntilLightOn = lightOnTime.getTime() - now.getTime()

                  if (timeUntilLightOn > 0) {
                    setTimeout(() => {
                      sendDataToESP32("LIGHT_ON")
                      const [endHours, endMinutes] = lightScheduleEnd.split(":").map(Number)
                      const lightOffTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHours, endMinutes)
                      const duration = lightOffTime.getTime() - lightOnTime.getTime()
                      setTimeout(() => {
                        sendDataToESP32("LIGHT_OFF")
                      }, duration)
                    }, timeUntilLightOn)
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="light-end">Lights Off</Label>
              <Input
                id="light-end"
                type="time"
                value={lightScheduleEnd}
                onChange={(e) => setLightScheduleEnd(e.target.value)}
              />
            </div>
          </div> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Sprout className="h-5 w-5" />
            <CardTitle>Nutrient & Pest Control</CardTitle>
          </div>
          <CardDescription>Manage fertilizer and pesticide distribution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() =>
              sendDataToESP32("START_FERTILIZING")
            }>
              <Flask className="mr-2 h-4 w-4" />
              Start Fertilizing
            </Button>
            <Button onClick={() =>
              sendDataToESP32("STOP_FERTILIZING")
            }>
              <Flask className="mr-2 h-4 w-4" />
              Stop Fertilizing
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="pest-control">Automatic Pest Control</Label>
              <Switch id="pest-control" checked={pestControlEnabled} onCheckedChange={(checked) => {
                setPestControlEnabled(checked)
                sendDataToESP32(checked ? "PESTCONTROL_ON" : "PESTCONTROL_OFF")
              }} />
            </div>
            {pestControlEnabled && (
              <div className="space-y-2">
                <Label htmlFor="pest-schedule">Treatment Schedule</Label>
                <Select value={pestControlSchedule} onValueChange={(value) => {
                  setPestControlSchedule(value)
                  const now = new Date()
                  let nextTreatmentTime

                  switch (value) {
                    case "weekly":
                      nextTreatmentTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, now.getHours(), now.getMinutes())
                      break
                    case "monthly":
                      nextTreatmentTime = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes())
                      break
                    default:
                      nextTreatmentTime = now
                  }

                  const timeUntilNextTreatment = nextTreatmentTime.getTime() - now.getTime()

                  if (timeUntilNextTreatment > 0) {
                    setTimeout(() => {
                      sendDataToESP32("PESTCONTROL_ON")
                      setTimeout(() => {
                        sendDataToESP32("PESTCONTROL_OFF")
                      }, 60000) // Assuming 1 minute duration for pest control
                    }, timeUntilNextTreatment)
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          {/* <Button className="w-full" onClick={onApplySettings}>
            Apply All Settings
          </Button> */}
        </CardContent>
      </Card>
    </div>
  )
}
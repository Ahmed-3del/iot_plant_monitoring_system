import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
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
}

export function Settings({ onApplySettings, onResetAlarms }: SettingsProps) {
  // System controls
  const [autoMode, setAutoMode] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  // Climate controls

  // Irrigation controls
  const [irrigationSchedule, setIrrigationSchedule] = useState("06:00")
  const [irrigationDuration, setIrrigationDuration] = useState(15)

  // Lighting controls
  const [lightScheduleStart, setLightScheduleStart] = useState("06:00")
  const [lightScheduleEnd, setLightScheduleEnd] = useState("18:00")
  // const [lightMode, setLightMode] = useState("auto")

  // Nutrient and pesticide controls
  const [fertilizeSchedule, setFertilizeSchedule] = useState("weekly")
  const [pestControlEnabled, setPestControlEnabled] = useState(true)
  const [pestControlSchedule, setPestControlSchedule] = useState("bi-weekly")

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
            <Switch id="auto-mode" checked={autoMode} onCheckedChange={setAutoMode} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Enable Alerts</Label>
            <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>
          <Button variant="outline" className="w-full" onClick={onResetAlarms}>
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
            <Button onClick={() => console.log("Decrease temperature")}>
              <Thermometer className="mr-2 h-4 w-4" />
              Decrease Temp
            </Button>
            <Button onClick={() => console.log("Increase temperature")}>
              <Thermometer className="mr-2 h-4 w-4" />
              Increase Temp
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => console.log("Decrease humidity")}>
              <Droplets className="mr-2 h-4 w-4" />
              Decrease Humidity
            </Button>
            <Button onClick={() => console.log("Increase humidity")}>
              <Droplets className="mr-2 h-4 w-4" />
              Increase Humidity
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => console.log("Fan speed low")}>
              <Fan className="mr-2 h-4 w-4" />
              Fan Speed Low
            </Button>
            <Button onClick={() => console.log("Fan speed high")}>
              <Fan className="mr-2 h-4 w-4" />
              Fan Speed High
            </Button>
          </div>
          {/* <div className="flex items-center justify-between">
            <Label htmlFor="ventilation">Automatic Ventilation</Label>
            <Switch id="ventilation" checked={ventilation} onCheckedChange={setVentilation} />
          </div> */}
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
            <Button onClick={() => console.log("Start irrigation")}>
              <Droplets className="mr-2 h-4 w-4" />
              Start Irrigation
            </Button>
            <Button onClick={() => console.log("Stop irrigation")}>
              <Droplets className="mr-2 h-4 w-4" />
              Stop Irrigation
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
                value={irrigationDuration}
                onChange={(e) => setIrrigationDuration(Number(e.target.value))}
              />
            </div>
          </div>
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
            {/* <Select value={lightMode} onValueChange={setLightMode}>
              <SelectTrigger>
                <SelectValue placeholder="Select light mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Automatic</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="schedule">Scheduled</SelectItem>
              </SelectContent>
            </Select> */}
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="light-start">Lights On</Label>
              <Input
                id="light-start"
                type="time"
                value={lightScheduleStart}
                onChange={(e) => setLightScheduleStart(e.target.value)}
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
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="fertilize-schedule">Fertilizer Schedule</Label>
            <Select value={fertilizeSchedule} onValueChange={setFertilizeSchedule}>
              <SelectTrigger>
                <SelectValue placeholder="Select schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                {/* <SelectItem value="bi-weekly">Bi-weekly</SelectItem> */}
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => console.log("Start fertilizing")}>
              <Flask className="mr-2 h-4 w-4" />
              Start Fertilizing
            </Button>
            <Button onClick={() => console.log("Stop fertilizing")}>
              <Flask className="mr-2 h-4 w-4" />
              Stop Fertilizing
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="pest-control">Automatic Pest Control</Label>
              <Switch id="pest-control" checked={pestControlEnabled} onCheckedChange={setPestControlEnabled} />
            </div>
            {pestControlEnabled && (
              <div className="space-y-2">
                <Label htmlFor="pest-schedule">Treatment Schedule</Label>
                <Select value={pestControlSchedule} onValueChange={setPestControlSchedule}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    {/* <SelectItem value="bi-weekly">Bi-weekly</SelectItem> */}
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <Button className="w-full" onClick={onApplySettings}>
            Apply All Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
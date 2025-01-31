import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"


interface SettingsProps {
  onFeedPlants: () => void
  onCloseAlarm: () => void
}

export function Settings({ onFeedPlants, onCloseAlarm }: SettingsProps) {
  const [autoWater, setAutoWater] = useState(false)
  const [feedingSchedule, setFeedingSchedule] = useState(7)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Plant Care</CardTitle>
          <CardDescription>Manage your plant feeding and watering settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-water">Automatic Watering</Label>
            <Switch id="auto-water" checked={autoWater} onCheckedChange={setAutoWater} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="feeding-schedule">Feeding Schedule (days)</Label>
            <div className="flex items-center space-x-2">
              <Slider
                id="feeding-schedule"
                min={1}
                max={30}
                step={1}
                value={[feedingSchedule]}
                onValueChange={(value) => setFeedingSchedule(value[0])}
              />
              <span className="w-12 text-center">{feedingSchedule}</span>
            </div>
          </div>
          <Button onClick={onFeedPlants}>Feed Plants Now</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Enable Notifications</Label>
            <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>
          <Button variant="outline" onClick={onCloseAlarm}>
            Close Active Alarms
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Device Settings</CardTitle>
          <CardDescription>Configure your IoT device</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="device-name">Device Name</Label>
            <Input id="device-name" placeholder="My Plant Monitor" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="update-frequency">Update Frequency (minutes)</Label>
            <Input id="update-frequency" type="number" placeholder="5" min="1" max="60" />
          </div>
          <Button variant="secondary">Save Device Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
}


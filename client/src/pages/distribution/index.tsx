import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function handleOfferSubmit(event) {
  event.preventDefault();
  // Add your offer submission logic here
  console.log("Offer submitted!");
}

function handlePoolSubmit(event) {
  event.preventDefault();
  // Add your pool submission logic here
  console.log("Pool submitted!");
}

export default function Distribution() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-4xl font-bold mb-6">Distribution Management</h1>

      <Tabs defaultValue="offers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="staking">Staking Pools</TabsTrigger>
          <TabsTrigger value="rewards">Rewards Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="offers">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleOfferSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="exclusive">Exclusive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rewardAmount">Reward Amount (XLC)</Label>
                  <Input id="rewardAmount" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input id="duration" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input id="maxParticipants" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" required />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="active" />
                  <Label htmlFor="active">Active</Label>
                </div>
                <Button type="submit">Create Offer</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staking">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handlePoolSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="poolName">Pool Name</Label>
                  <Input id="poolName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apy">APY (%)</Label>
                  <Input id="apy" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStake">Minimum Stake Amount (XLC)</Label>
                  <Input id="minStake" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockPeriod">Lock Period (days)</Label>
                  <Input id="lockPeriod" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" required />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="active" />
                  <Label htmlFor="active">Active</Label>
                </div>
                <Button type="submit">Create Pool</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards">
          <Card>
            <CardContent className="pt-6">
              <div>Rewards overview content will go here</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
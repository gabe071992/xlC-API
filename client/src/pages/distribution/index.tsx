
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

const offerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["standard", "premium", "exclusive"]),
  description: z.string().min(1, "Description is required"),
  rewardAmount: z.string().min(1, "Reward amount is required"),
  duration: z.string().min(1, "Duration is required"),
  maxParticipants: z.string().min(1, "Max participants is required"),
  active: z.boolean().default(false),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  requirements: z.array(z.string()).default([])
})

const stakingPoolSchema = z.object({
  name: z.string().min(1, "Pool name is required"),
  apy: z.string().min(1, "APY is required"),
  minStakeAmount: z.string().min(1, "Minimum stake amount is required"),
  lockPeriod: z.string().min(1, "Lock period is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  active: z.boolean().default(false)
})

export default function Distribution() {
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false)
  const [isSubmittingPool, setIsSubmittingPool] = useState(false)

  const offerForm = useForm({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: "",
      type: "standard",
      description: "",
      rewardAmount: "",
      duration: "",
      maxParticipants: "",
      active: false,
      startDate: "",
      endDate: "",
      requirements: []
    }
  })

  const stakingForm = useForm({
    resolver: zodResolver(stakingPoolSchema),
    defaultValues: {
      name: "",
      apy: "",
      minStakeAmount: "",
      lockPeriod: "",
      startDate: "",
      endDate: "",
      active: false
    }
  })

  async function handleOfferSubmit(data) {
    try {
      setIsSubmittingOffer(true)
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Failed to create offer')
      offerForm.reset()
    } catch (error) {
      console.error('Error creating offer:', error)
    } finally {
      setIsSubmittingOffer(false)
    }
  }

  async function handlePoolSubmit(data) {
    try {
      setIsSubmittingPool(true)
      const response = await fetch('/api/stakingPools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Failed to create staking pool')
      stakingForm.reset()
    } catch (error) {
      console.error('Error creating staking pool:', error)
    } finally {
      setIsSubmittingPool(false)
    }
  }

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
              <Form {...offerForm}>
                <form onSubmit={offerForm.handleSubmit(handleOfferSubmit)} className="space-y-4">
                  <FormField
                    control={offerForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={offerForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="exclusive">Exclusive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Remaining offer form fields following same pattern */}
                  
                  <Button type="submit" disabled={isSubmittingOffer}>
                    {isSubmittingOffer ? "Creating..." : "Create Offer"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staking">
          <Card>
            <CardContent className="pt-6">
              <Form {...stakingForm}>
                <form onSubmit={stakingForm.handleSubmit(handlePoolSubmit)} className="space-y-4">
                  <FormField
                    control={stakingForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pool Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Remaining staking pool form fields following same pattern */}

                  <Button type="submit" disabled={isSubmittingPool}>
                    {isSubmittingPool ? "Creating..." : "Create Pool"}
                  </Button>
                </form>
              </Form>
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

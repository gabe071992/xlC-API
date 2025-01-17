
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ref, set } from "firebase/database"
import { database } from "@/lib/firebase"
import { v4 as uuidv4 } from "uuid"
import { Alert, AlertDescription } from "@/components/ui/alert"
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

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleOfferSubmit(data) {
    try {
      setError("")
      setSuccess("")
      setIsSubmittingOffer(true)
      
      // Validate dates
      const startDate = new Date(data.startDate)
      const endDate = new Date(data.endDate)
      if (endDate <= startDate) {
        throw new Error("End date must be after start date")
      }

      const offerRef = ref(database, 'offers/' + uuidv4())
      await set(offerRef, {
        ...data,
        rewardAmount: String(data.rewardAmount),
        duration: String(data.duration),
        maxParticipants: String(data.maxParticipants)
      })

      setSuccess("Offer created successfully")
      offerForm.reset()
    } catch (error) {
      console.error('Error creating offer:', error)
      setError(error.message || "Failed to create offer")
    } finally {
      setIsSubmittingOffer(false)
    }
  }

  async function handlePoolSubmit(data) {
    try {
      setError("")
      setSuccess("")
      setIsSubmittingPool(true)
      
      // Validate dates
      const startDate = new Date(data.startDate)
      const endDate = new Date(data.endDate)
      if (endDate <= startDate) {
        throw new Error("End date must be after start date")
      }

      const poolRef = ref(database, 'stakingPools/' + uuidv4())
      await set(poolRef, {
        ...data,
        id: uuidv4(),
        totalStaked: 0,
        apy: Number(data.apy),
        minStakeAmount: Number(data.minStakeAmount),
        lockPeriod: Number(data.lockPeriod)
      })

      setSuccess("Staking pool created successfully")
      stakingForm.reset()
    } catch (error) {
      console.error('Error creating staking pool:', error)
      setError(error.message || "Failed to create staking pool")
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

                  <FormField
                    control={offerForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={offerForm.control}
                    name="rewardAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reward Amount (XLC)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={offerForm.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (days)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={offerForm.control}
                    name="maxParticipants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Participants</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={offerForm.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={offerForm.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={offerForm.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Active</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={offerForm.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requirements (comma-separated)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            value={field.value.join(',')} 
                            onChange={(e) => field.onChange(e.target.value.split(','))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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

                  <FormField
                    control={stakingForm.control}
                    name="apy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>APY (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={stakingForm.control}
                    name="minStakeAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Stake Amount (XLC)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={stakingForm.control}
                    name="lockPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lock Period (days)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={stakingForm.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={stakingForm.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={stakingForm.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Active</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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

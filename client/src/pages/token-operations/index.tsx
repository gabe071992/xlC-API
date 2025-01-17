import { useState, useEffect } from "react";
import { ref, get, set, push } from "firebase/database";
import { database } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from 'uuid';

interface Metric {
  id: string;
  name: string;
  description: string;
  category: string;
  minValue: number;
  maxValue: number;
}

const priceFormSchema = z.object({
  price: z.string().min(1, "Price is required"),
});

const transferFormSchema = z.object({
  to: z.string().min(1, "Address is required"),
  amount: z.string().min(1, "Amount is required"),
});

const rateFormSchema = z.object({
  baselineRate: z.string().min(1, "Baseline rate is required"),
});

const metricFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  minValue: z.string().min(1, "Minimum value is required"),
  maxValue: z.string().min(1, "Maximum value is required"),
});

const weightFormSchema = z.object({
  metricId: z.string().min(1, "Metric is required"),
  value: z.string().min(1, "Weight value is required"),
});

const approveFormSchema = z.object({
  spender: z.string().min(1, "Spender address is required"),
  amount: z.string().min(1, "Amount is required"),
});

const transferFromFormSchema = z.object({
  from: z.string().min(1, "From address is required"),
  to: z.string().min(1, "To address is required"),
  amount: z.string().min(1, "Amount is required"),
});

const ownershipFormSchema = z.object({
  newOwner: z.string().min(1, "New owner address is required"),
});


export default function TokenOperations() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [metrics, setMetrics] = useState<Metric[]>([]);

  const priceForm = useForm({
    resolver: zodResolver(priceFormSchema),
    defaultValues: { price: "" },
  });

  const transferForm = useForm({
    resolver: zodResolver(transferFormSchema),
    defaultValues: { to: "", amount: "" },
  });

  const rateForm = useForm({
    resolver: zodResolver(rateFormSchema),
    defaultValues: { baselineRate: "" },
  });

  const metricForm = useForm({
    resolver: zodResolver(metricFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      minValue: "",
      maxValue: "",
    },
  });

  const weightForm = useForm({
    resolver: zodResolver(weightFormSchema),
    defaultValues: {
      metricId: "",
      value: "",
    },
  });

  const approveForm = useForm({
    resolver: zodResolver(approveFormSchema),
    defaultValues: { spender: "", amount: "" },
  });

  const transferFromForm = useForm({
    resolver: zodResolver(transferFromFormSchema),
    defaultValues: { from: "", to: "", amount: "" },
  });

  const ownershipForm = useForm({
    resolver: zodResolver(ownershipFormSchema),
    defaultValues: { newOwner: "" },
  });

  // Fetch metrics on component mount
  useEffect(() => {
    const fetchMetrics = async () => {
      const metricsRef = ref(database, 'ratesAndWeights/metrics');
      const snapshot = await get(metricsRef);
      if (snapshot.exists()) {
        const metricsData = snapshot.val();
        const metricsArray = Object.values(metricsData) as Metric[];
        setMetrics(metricsArray);
      }
    };
    fetchMetrics();
  }, []);

  const handlePriceSubmit = async (values: z.infer<typeof priceFormSchema>) => {
    try {
      setIsSubmitting(true);
      await set(ref(database, 'xlc/price'), Number(values.price));
      priceForm.reset();
    } catch (error) {
      console.error('Error updating price:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransfer = async (values: z.infer<typeof transferFormSchema>) => {
    try {
      setIsSubmitting(true);
      // Web3 transfer implementation will go here
      transferForm.reset();
    } catch (error) {
      console.error('Error transferring tokens:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRateSubmit = async (values: z.infer<typeof rateFormSchema>) => {
    try {
      setIsSubmitting(true);
      await set(ref(database, 'ratesAndWeights/baselineRate'), Number(values.baselineRate));
      rateForm.reset();
    } catch (error) {
      console.error('Error updating baseline rate:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMetricSubmit = async (values: z.infer<typeof metricFormSchema>) => {
    try {
      setIsSubmitting(true);
      const metricId = uuidv4();
      const metricData = {
        id: metricId,
        name: values.name,
        description: values.description,
        category: values.category,
        minValue: Number(values.minValue),
        maxValue: Number(values.maxValue),
      };
      await set(ref(database, `ratesAndWeights/metrics/${metricId}`), metricData);
      metricForm.reset();
      // Refresh metrics list
      setMetrics([...metrics, metricData]);
    } catch (error) {
      console.error('Error adding metric:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWeightSubmit = async (values: z.infer<typeof weightFormSchema>) => {
    try {
      setIsSubmitting(true);
      const weightId = uuidv4();
      await set(ref(database, `ratesAndWeights/weights/${weightId}`), {
        id: weightId,
        metricId: values.metricId,
        value: Number(values.value),
      });
      weightForm.reset();
    } catch (error) {
      console.error('Error adding weight:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (values: z.infer<typeof approveFormSchema>) => {
    try {
      setIsSubmitting(true);
      // Web3 approve implementation will go here
      approveForm.reset();
    } catch (error) {
      console.error('Error approving tokens:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransferFrom = async (values: z.infer<typeof transferFromFormSchema>) => {
    try {
      setIsSubmitting(true);
      // Web3 transferFrom implementation will go here
      transferFromForm.reset();
    } catch (error) {
      console.error('Error transferring tokens from:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransferOwnership = async (values: z.infer<typeof ownershipFormSchema>) => {
    try {
      setIsSubmitting(true);
      // Web3 transferOwnership implementation will go here
      ownershipForm.reset();
    } catch (error) {
      console.error('Error transferring ownership:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRenounceOwnership = async () => {
    try {
      setIsSubmitting(true);
      // Web3 renounceOwnership implementation will go here
    } catch (error) {
      console.error('Error renouncing ownership:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Token Operations</h1>

      <Tabs defaultValue="operations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="operations">Token Operations</TabsTrigger>
          <TabsTrigger value="rates">Rates & Weights</TabsTrigger>
        </TabsList>

        <TabsContent value="operations">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Set Token Price</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...priceForm}>
                  <form onSubmit={priceForm.handleSubmit(handlePriceSubmit)} className="space-y-4">
                    <FormField
                      control={priceForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.000001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Updating..." : "Update Price"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transfer Tokens</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...transferForm}>
                  <form onSubmit={transferForm.handleSubmit(handleTransfer)} className="space-y-4">
                    <FormField
                      control={transferForm.control}
                      name="to"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={transferForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.000001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Transferring..." : "Transfer"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approve Tokens</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...approveForm}>
                  <form onSubmit={approveForm.handleSubmit(handleApprove)} className="space-y-4">
                    <FormField
                      control={approveForm.control}
                      name="spender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spender Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={approveForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.000001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Approving..." : "Approve"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transfer From</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...transferFromForm}>
                  <form onSubmit={transferFromForm.handleSubmit(handleTransferFrom)} className="space-y-4">
                    <FormField
                      control={transferFromForm.control}
                      name="from"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={transferFromForm.control}
                      name="to"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={transferFromForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.000001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Transferring..." : "Transfer From"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Owner Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Form {...ownershipForm}>
                    <form onSubmit={ownershipForm.handleSubmit(handleTransferOwnership)} className="space-y-4">
                      <FormField
                        control={ownershipForm.control}
                        name="newOwner"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Owner Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Transferring..." : "Transfer Ownership"}
                      </Button>
                    </form>
                  </Form>

                  <div>
                    <Button
                      onClick={handleRenounceOwnership}
                      disabled={isSubmitting}
                      variant="destructive"
                      className="w-full"
                    >
                      {isSubmitting ? "Renouncing..." : "Renounce Ownership"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rates">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Baseline Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...rateForm}>
                  <form onSubmit={rateForm.handleSubmit(handleRateSubmit)} className="space-y-4">
                    <FormField
                      control={rateForm.control}
                      name="baselineRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Baseline Rate</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Updating..." : "Update Rate"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Metric</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...metricForm}>
                  <form onSubmit={metricForm.handleSubmit(handleMetricSubmit)} className="space-y-4">
                    <FormField
                      control={metricForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={metricForm.control}
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
                      control={metricForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={metricForm.control}
                      name="minValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Value</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={metricForm.control}
                      name="maxValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Value</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Adding..." : "Add Metric"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Weight</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...weightForm}>
                  <form onSubmit={weightForm.handleSubmit(handleWeightSubmit)} className="space-y-4">
                    <FormField
                      control={weightForm.control}
                      name="metricId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Metric</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a metric" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {metrics.map((metric) => (
                                <SelectItem key={metric.id} value={metric.id}>
                                  {metric.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={weightForm.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight Value</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Adding..." : "Add Weight"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
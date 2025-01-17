
import { useState } from "react";
import { ref, get, set } from "firebase/database";
import { database } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

export default function TokenOperations() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priceForm = useForm({
    resolver: zodResolver(priceFormSchema),
    defaultValues: {
      price: "",
    },
  });

  const transferForm = useForm({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      to: "",
      amount: "",
    },
  });

  const rateForm = useForm({
    resolver: zodResolver(rateFormSchema),
    defaultValues: {
      baselineRate: "",
    },
  });

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
          </div>
        </TabsContent>

        <TabsContent value="rates">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

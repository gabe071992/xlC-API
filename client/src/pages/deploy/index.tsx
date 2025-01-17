
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const tokenFormSchema = z.object({
  name: z.string().min(1, "Token name required"),
  symbol: z.string().min(1, "Token symbol required"),
  decimals: z.string().min(1, "Decimals required"),
  totalSupply: z.string().min(1, "Total supply required"),
  distribution: z.object({
    team: z.string(),
    advisors: z.string(),
    publicSale: z.string(),
    liquidity: z.string(),
    marketing: z.string()
  }),
  features: z.object({
    burnable: z.boolean(),
    mintable: z.boolean(),
    pausable: z.boolean(),
    upgradeable: z.boolean(),
    taxable: z.boolean(),
    deflation: z.boolean(),
    blacklist: z.boolean(),
    maxWallet: z.boolean(),
    antiBot: z.boolean()
  }),
  advanced: z.object({
    maxTransactionAmount: z.string().optional(),
    maxWalletAmount: z.string().optional(),
    buyTax: z.string().optional(),
    sellTax: z.string().optional(),
    transferTax: z.string().optional(),
    deflationRate: z.string().optional(),
    liquidityFee: z.string().optional(),
    marketingFee: z.string().optional(),
    rewardsFee: z.string().optional()
  })
});

export default function ContractDeploy() {
  const form = useForm({
    resolver: zodResolver(tokenFormSchema),
    defaultValues: {
      name: "",
      symbol: "",
      decimals: "18",
      totalSupply: "",
      distribution: {
        team: "15",
        advisors: "10",
        publicSale: "40",
        liquidity: "25",
        marketing: "10"
      },
      features: {
        burnable: false,
        mintable: false,
        pausable: false,
        upgradeable: false,
        taxable: false,
        deflation: false,
        blacklist: false,
        maxWallet: false,
        antiBot: false
      },
      advanced: {
        maxTransactionAmount: "",
        maxWalletAmount: "",
        buyTax: "",
        sellTax: "",
        transferTax: "",
        deflationRate: "",
        liquidityFee: "",
        marketingFee: "",
        rewardsFee: ""
      }
    }
  });

  const onSubmit = async (data: z.infer<typeof tokenFormSchema>) => {
    try {
      // API call to deploy token will go here
      console.log("Deploying token:", data);
    } catch (error) {
      console.error("Error deploying token:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Contract Deployment</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Token Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="symbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Symbol</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="decimals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Decimals</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalSupply"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Supply</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Token Features</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="features.burnable"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Burnable</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="features.mintable"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Mintable</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="features.pausable"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Pausable</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="features.upgradeable"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Upgradeable</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="features.taxable"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Taxable</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="features.deflation"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Deflation</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="features.blacklist"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Blacklist</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="features.maxWallet"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Max Wallet</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="features.antiBot"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Anti-Bot</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Advanced Configuration</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {form.watch("features.maxWallet") && (
                      <FormField
                        control={form.control}
                        name="advanced.maxWalletAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Wallet Amount (%)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    {form.watch("features.taxable") && (
                      <>
                        <FormField
                          control={form.control}
                          name="advanced.buyTax"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Buy Tax (%)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="advanced.sellTax"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sell Tax (%)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="advanced.transferTax"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Transfer Tax (%)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                    {form.watch("features.deflation") && (
                      <FormField
                        control={form.control}
                        name="advanced.deflationRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Deflation Rate (%)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Distribution Configuration</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="distribution.team"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Allocation (%)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="distribution.advisors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Advisors Allocation (%)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="distribution.publicSale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Public Sale (%)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="distribution.liquidity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Liquidity (%)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="distribution.marketing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marketing (%)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button type="submit">Deploy Token</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}

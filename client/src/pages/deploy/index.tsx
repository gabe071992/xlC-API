import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContractDeployment } from "@/lib/hooks/useContractDeployment";
import { ContractFactory } from "@/lib/contracts/ContractFactory";
import { ethers } from "ethers";
import type { ContractTemplate } from "@/lib/contracts/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ContractDashboard from "./components/ContractDashboard";
import SecurityControls from "./components/SecurityControls";
import ContractRegistry from "./components/ContractRegistry";
// Added components
import TemplateManager from "./components/TemplateManager";
import TemplateBuilder from "./components/TemplateBuilder";
import { useWeb3 } from "@/lib/hooks/useWeb3";


const tokenFormSchema = z.object({
  name: z.string().min(1, "Token name required"),
  symbol: z.string().min(1, "Token symbol required"),
  decimals: z.string().min(1, "Decimals required"),
  totalSupply: z.string().min(1, "Total supply required"),
  contractType: z.enum(["standard", "burn", "dividend", "fee", "custom"]),
  baseURI: z.string().optional(),
  distribution: z.object({
    team: z.string(),
    advisors: z.string(),
    publicSale: z.string(),
    liquidity: z.string(),
    marketing: z.string(),
    development: z.string()
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
    antiBot: z.boolean(),
    reflections: z.boolean(),
    autoLiquidity: z.boolean(),
    dividends: z.boolean()
  }),
  fees: z.object({
    developerFee: z.string(),
    reflectionFee: z.string(),
    liquidityFee: z.string(),
    marketingFee: z.string(),
    buybackFee: z.string()
  }),
  security: z.object({
    antiSnipe: z.boolean(),
    tradingDelay: z.string(),
    maxTxAmount: z.string(),
    maxWalletAmount: z.string()
  }),
  advanced: z.object({
    buyTax: z.string().optional(),
    sellTax: z.string().optional(),
    transferTax: z.string().optional(),
    deflationRate: z.string().optional(),
    rewardToken: z.string().optional(),
    rewardsThreshold: z.string().optional(),
    autoLP: z.string().optional(),
    swapThreshold: z.string().optional()
  })
});

export default function ContractDeploy() {
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const loadedTemplates = await getTemplates();
        setTemplates(loadedTemplates || []);
      } catch (error) {
        console.error('Error loading templates:', error);
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };
    loadTemplates();
  }, []);

  const form = useForm({
    resolver: zodResolver(tokenFormSchema),
    defaultValues: {
      name: "",
      symbol: "",
      decimals: "18",
      totalSupply: "",
      contractType: "standard",
      baseURI: "",
      distribution: {
        team: "15",
        advisors: "10",
        publicSale: "40",
        liquidity: "25",
        marketing: "5",
        development: "5"
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
        antiBot: false,
        reflections: false,
        autoLiquidity: false,
        dividends: false
      },
      fees: {
        developerFee: "0",
        reflectionFee: "0",
        liquidityFee: "0",
        marketingFee: "0",
        buybackFee: "0"
      },
      security: {
        antiSnipe: false,
        tradingDelay: "0",
        maxTxAmount: "0",
        maxWalletAmount: "0"
      },
      advanced: {
        buyTax: "0",
        sellTax: "0",
        transferTax: "0",
        deflationRate: "0",
        rewardToken: "",
        rewardsThreshold: "0",
        autoLP: "0",
        swapThreshold: "0"
      }
    }
  });

  const { deploymentState, deploy } = useContractDeployment();
  const { provider: web3Provider, isConnected } = useWeb3();
  const [deploymentError, setDeploymentError] = useState<string | null>(null);

  const onSubmit = async (data: z.infer<typeof tokenFormSchema>) => {
    try {
      setDeploymentError(null);
      setIsSubmitting(true);

      if (!isConnected || !web3Provider) {
        throw new Error("Please connect your wallet");
      }

      const signer = await web3Provider.getSigner();

      const address = await signer.getAddress();
      const factory = new ContractFactory(web3Provider, signer);

      // Get gas estimate before deployment
      const gasEstimate = await factory.estimateGas(
        data.name,
        data.symbol,
        Number(data.decimals),
        data.totalSupply,
        address
      );

      const totalSupplyWithDecimals = ethers.utils.parseUnits(
        data.totalSupply,
        Number(data.decimals)
      );

      await deploy(
        data.name,
        data.symbol,
        Number(data.decimals),
        totalSupplyWithDecimals.toString(),
        address
      );

    } catch (error) {
      console.error("Error deploying token:", error);
      setDeploymentError(error instanceof Error ? error.message : "Failed to deploy token");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Contract Management</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="builder">Template Builder</TabsTrigger>
          <TabsTrigger value="deploy">Deploy Contract</TabsTrigger>
          <TabsTrigger value="security">Security Controls</TabsTrigger>
          <TabsTrigger value="registry">Contract Registry</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <ContractDashboard />
        </TabsContent>

        <TabsContent value="templates">
          <TemplateManager 
            templates={templates} 
            onSelectTemplate={(template) => {
              console.log("Selected template:", template);
              // Handle template selection
              if (template.category === 'token') {
                setActiveTab('deploy');
              }
            }} 
          />
        </TabsContent>

        <TabsContent value="builder">
          <TemplateBuilder />
        </TabsContent>

        <TabsContent value="deploy">
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
                        name="contractType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contract Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select contract type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="standard">Standard Token</SelectItem>
                                <SelectItem value="burn">Burn Token</SelectItem>
                                <SelectItem value="dividend">Dividend Token</SelectItem>
                                <SelectItem value="fee">Fee Token</SelectItem>
                                <SelectItem value="custom">Custom Token</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

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

                      <FormField
                        control={form.control}
                        name="baseURI"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Base URI</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="ipfs://..." />
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
                        {Object.entries(form.watch("features")).map(([key, value]) => (
                          <FormField
                            key={key}
                            control={form.control}
                            name={`features.${key}` as any}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Switch 
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="capitalize">{key}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Fee Configuration</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {Object.entries(form.watch("fees")).map(([key]) => (
                          <FormField
                            key={key}
                            control={form.control}
                            name={`fees.${key}` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Security Settings</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="security.antiSnipe"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Switch 
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel>Anti-Snipe Protection</FormLabel>
                            </FormItem>
                          )}
                        />
                        {Object.entries(form.watch("security"))
                          .filter(([key]) => key !== "antiSnipe")
                          .map(([key]) => (
                            <FormField
                              key={key}
                              control={form.control}
                              name={`security.${key}` as any}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</FormLabel>
                                  <FormControl>
                                    <Input type="number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Distribution Configuration</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {Object.entries(form.watch("distribution")).map(([key]) => (
                          <FormField
                            key={key}
                            control={form.control}
                            name={`distribution.${key}` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="capitalize">{key} Allocation (%)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    {form.watch("contractType") === "custom" && (
                      <>
                        <Separator />
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Advanced Configuration</h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            {Object.entries(form.watch("advanced")).map(([key]) => (
                              <FormField
                                key={key}
                                control={form.control}
                                name={`advanced.${key}` as any}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="mt-6 space-y-4">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Deploying..." : "Deploy Token"}
                    </Button>

                    {deploymentState.status !== "PENDING" && (
                      <div className="text-sm">
                        {deploymentState.status === "DEPLOYING" && (
                          <p className="text-yellow-500">Deploying contract...</p>
                        )}
                        {deploymentState.status === "SUCCESS" && (
                          <p className="text-green-500">
                            Contract deployed at: {deploymentState.contractAddress}
                          </p>
                        )}
                        {deploymentState.status === "FAILED" && (
                          <p className="text-red-500">
                            {deploymentState.error || "Deployment failed"}
                          </p>
                        )}
                        {deploymentState.status === "VERIFYING" && (
                          <p className="text-yellow-500">Verifying contract...</p>
                        )}
                        {deploymentState.status === "VERIFIED" && (
                          <p className="text-green-500">Contract verified!</p>
                        )}
                      </div>
                    )}

                    {deploymentError && (
                      <div className="text-red-500 text-sm">
                        {deploymentError}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="security">
          <SecurityControls />
        </TabsContent>

        <TabsContent value="registry">
          <ContractRegistry />
        </TabsContent>
      </Tabs>
    </div>
  );
}
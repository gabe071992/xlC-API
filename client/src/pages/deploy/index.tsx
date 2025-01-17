
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

export default function ContractDeploy() {
  const tokenForm = useForm({
    defaultValues: {
      name: "",
      symbol: "",
      teamAllocation: "",
      advisorsAllocation: "",
      publicSale: "",
      liquidity: ""
    }
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Contract Deployment</h1>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Contract Dashboard</TabsTrigger>
          <TabsTrigger value="xlc">XLC Integration</TabsTrigger>
          <TabsTrigger value="token">Token Deployment</TabsTrigger>
          <TabsTrigger value="registry">Contract Registry</TabsTrigger>
          <TabsTrigger value="security">Security Controls</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Template Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Contract Template</Label>
                  <ScrollArea className="h-72 rounded-md border p-4">
                    {/* Template list will go here */}
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Parameter Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Parameter fields will go here */}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="token">
          <Card>
            <CardHeader>
              <CardTitle>Token Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...tokenForm}>
                <form className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={tokenForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="symbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Symbol</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Token Features</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="burnable" />
                      <Label htmlFor="burnable">Burnable</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="mintable" />
                      <Label htmlFor="mintable">Mintable</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="pausable" />
                      <Label htmlFor="pausable">Pausable</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="upgradeable" />
                      <Label htmlFor="upgradeable">Upgradeable</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Distribution Configuration</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      name="teamAllocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Allocation (15%)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="advisorsAllocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Advisors Allocation (10%)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="publicSale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Public Sale (40%)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="liquidity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Liquidity (25%)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registry">
          <Card>
            <CardHeader>
              <CardTitle>Contract Registry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input placeholder="Search contracts..." className="max-w-sm" />
                </div>
                <ScrollArea className="h-[500px] rounded-md border">
                  <div className="p-4">
                    {/* Contract list will go here */}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Access Control</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="multiSig" />
                    <Label htmlFor="multiSig">Multi-Signature Approval</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="emergencyPause" />
                    <Label htmlFor="emergencyPause">Emergency Pause</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deployment Audit Log</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] rounded-md border">
                  <div className="p-4">
                    {/* Audit log entries will go here */}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

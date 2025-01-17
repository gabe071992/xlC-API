import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Switch } from "@/components/ui/switch";
import type { ContractTemplate } from "@/lib/contracts/types";
import { saveTemplate } from "@/lib/contracts/templates";
import { generateTokenSource } from "@/lib/contracts/templateHelpers";
import ContractPreview from "./ContractPreview"; // Imported ContractPreview component

const templateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["token", "nft", "defi"]),
  version: z.string().min(1, "Version is required"),
  source: z.string().min(1, "Source code is required"),
  abi: z.array(z.any()).optional(),
  bytecode: z.string().optional(),
  features: z.object({
    burnable: z.boolean().default(false),
    mintable: z.boolean().default(false),
    pausable: z.boolean().default(false),
    reflective: z.boolean().default(false),
    taxable: z.boolean().default(false)
  }).optional(),
  parameters: z.array(z.object({
    name: z.string(),
    type: z.string(),
    defaultValue: z.any().optional(),
    validation: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      pattern: z.string().optional()
    }).optional()
  })).default([])
});

type TemplateFormValues = z.infer<typeof templateSchema>;

export default function TemplateBuilder() {
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "token",
      version: "1.0.0",
      source: "",
      parameters: []
    }
  });

  const onSubmit = async (values: TemplateFormValues) => {
    try {
      const template: ContractTemplate = {
        ...values,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        abi: [],
        bytecode: "",
        parameters: values.parameters || []
      };
      await saveTemplate(template);
      form.reset();
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  const addParameter = () => {
    const currentParams = form.getValues("parameters");
    form.setValue("parameters", [...currentParams, {
      name: "",
      type: "string",
      defaultValue: "",
      validation: { min: 0, max: 100 }
    }]);
  };

  useEffect(() => {
    const features = form.watch('features');
    const category = form.watch('category');
    
    if (features && category === 'token') {
      const generatedSource = generateTokenSource(features);
      form.setValue('source', generatedSource);
    }
  }, [form.watch('features'), form.watch('category')]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Contract Template</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="token">Token</SelectItem>
                        <SelectItem value="nft">NFT</SelectItem>
                        <SelectItem value="defi">DeFi</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-medium">Token Features</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="features.burnable"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Burnable</FormLabel>
                        <div className="text-sm text-gray-500">
                          Token holders can burn their tokens
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="features.mintable"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Mintable</FormLabel>
                        <div className="text-sm text-gray-500">
                          Owner can mint new tokens
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="features.pausable"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Pausable</FormLabel>
                        <div className="text-sm text-gray-500">
                          Owner can pause token transfers
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="features.reflective"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Reflective</FormLabel>
                        <div className="text-sm text-gray-500">
                          Redistribute tokens on each transfer
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Source Code</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="font-mono min-h-[300px]" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Parameters</h3>
                <Button type="button" onClick={addParameter} variant="outline">
                  Add Parameter
                </Button>
              </div>

              {form.watch("parameters").map((_, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded">
                  <FormField
                    control={form.control}
                    name={`parameters.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`parameters.${index}.type`}
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
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                            <SelectItem value="address">Address</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`parameters.${index}.defaultValue`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Value</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <Button type="submit">Save Template</Button>
          </form>
        </Form>
        <ContractPreview source={form.watch('source')}/> {/* Added ContractPreview component */}
      </CardContent>
    </Card>
  );
}
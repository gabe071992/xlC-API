
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { ContractTemplate } from "@/lib/contracts/types";

const templateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["token", "nft", "defi"]),
  version: z.string().min(1, "Version is required"),
  source: z.string().min(1, "Source code is required"),
  abi: z.array(z.any()).optional(),
  bytecode: z.string().optional(),
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
      const template: Partial<ContractTemplate> = {
        ...values,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      console.log("Saving template:", template);
      // Add Firebase save logic here
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
      </CardContent>
    </Card>
  );
}

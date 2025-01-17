
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
import { ContractTemplate, ContractParameter } from "@/lib/contracts/types";

const parameterSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  defaultValue: z.any().optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
  }).optional(),
});

const templateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["token", "nft", "defi"]),
  source: z.string().min(1, "Source code is required"),
  parameters: z.array(parameterSchema),
});

interface TemplateBuilderProps {
  onSave: (template: Partial<ContractTemplate>) => Promise<void>;
  initialTemplate?: Partial<ContractTemplate>;
}

export default function TemplateBuilder({ onSave, initialTemplate }: TemplateBuilderProps) {
  const form = useForm({
    resolver: zodResolver(templateSchema),
    defaultValues: initialTemplate || {
      name: "",
      description: "",
      category: "token",
      source: "",
      parameters: [],
    },
  });

  const handleAddParameter = () => {
    const parameters = form.getValues("parameters") || [];
    form.setValue("parameters", [
      ...parameters,
      { name: "", type: "string", defaultValue: "" },
    ]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Template Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
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
                  <FormLabel>Source Code</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="font-mono" rows={10} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Parameters</h3>
                <Button type="button" onClick={handleAddParameter} variant="outline">
                  Add Parameter
                </Button>
              </div>
              
              {form.watch("parameters")?.map((_, index) => (
                <div key={index} className="grid gap-4 p-4 border rounded-lg">
                  <FormField
                    control={form.control}
                    name={`parameters.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parameter Name</FormLabel>
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
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full">Save Template</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

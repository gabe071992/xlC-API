
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ContractTemplate } from "@/lib/contracts/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TemplateManagerProps {
  templates: ContractTemplate[];
  onSelectTemplate: (template: ContractTemplate) => void;
}

export default function TemplateManager({ templates, onSelectTemplate }: TemplateManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);

  const filteredTemplates = templates.filter(template => {
    const categoryMatch = selectedCategory === 'all' || template.category === selectedCategory;
    const searchMatch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const handleTemplateSelect = (template: ContractTemplate) => {
    setSelectedTemplate(template);
  };

  const handleConfirmSelection = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="token">Token</SelectItem>
                <SelectItem value="nft">NFT</SelectItem>
                <SelectItem value="defi">DeFi</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              placeholder="Search templates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>

          <ScrollArea className="h-[500px]">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredTemplates.map((template) => (
                <Dialog key={template.id}>
                  <DialogTrigger asChild>
                    <Card 
                      className="cursor-pointer hover:bg-secondary/50"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{template.name}</h3>
                            <span className="text-sm text-muted-foreground">v{template.version}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs capitalize bg-secondary px-2 py-1 rounded">
                              {template.category}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{template.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Description</h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      {template.parameters.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Parameters</h4>
                          <div className="space-y-2">
                            {template.parameters.map((param, index) => (
                              <div key={index} className="text-sm">
                                <span className="font-medium">{param.name}</span>
                                <span className="text-muted-foreground"> ({param.type})</span>
                                {param.defaultValue && (
                                  <span className="text-muted-foreground"> - Default: {param.defaultValue}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <Button onClick={handleConfirmSelection} className="w-full">
                        Use Template
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}

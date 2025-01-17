
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContractTemplate } from "@/lib/contracts/types";

interface TemplateManagerProps {
  templates: ContractTemplate[];
  onSelectTemplate: (template: ContractTemplate) => void;
}

export default function TemplateManager({ templates, onSelectTemplate }: TemplateManagerProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const filteredTemplates = templates.filter(template => 
    selectedCategory === 'all' || template.category === selectedCategory
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="token">Token</SelectItem>
                <SelectItem value="nft">NFT</SelectItem>
                <SelectItem value="defi">DeFi</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Search templates..." className="flex-1" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:bg-secondary/50" 
                    onClick={() => onSelectTemplate(template)}>
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
                      <Button variant="outline" size="sm">Use Template</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContractPreviewProps {
  source: string;
}

export default function ContractPreview({ source }: ContractPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          <pre className="text-sm font-mono">
            {source}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

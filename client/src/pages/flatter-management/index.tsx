
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from 'axios';

interface TestResult {
  status: 'success' | 'partial' | 'error';
  message: string;
}

const TestButton = ({ endpoint }: { endpoint: any }) => {
  const [testStatus, setTestStatus] = useState<TestResult | null>(null);
  
  const runTest = async () => {
    try {
      const response = await axios({
        method: endpoint.method,
        url: `/api${endpoint.path}`,
        data: endpoint.testData || {},
      });
      
      setTestStatus({
        status: response.status === 200 ? 'success' : 'partial',
        message: response.status === 200 ? 'Test passed' : 'Partial success'
      });
    } catch (error) {
      setTestStatus({
        status: 'error',
        message: 'Test failed'
      });
    }
  };

  const getStatusColor = () => {
    if (!testStatus) return 'bg-gray-500';
    return {
      success: 'bg-green-500',
      partial: 'bg-yellow-500',
      error: 'bg-red-500'
    }[testStatus.status];
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={runTest}
      >
        Test Endpoint
      </Button>
      {testStatus && (
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
          <span className="text-sm">{testStatus.message}</span>
        </div>
      )}
    </div>
  );
};


import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const endpoints = {
  auth: [
    { path: '/auth/login', method: 'POST', status: 'implemented', description: 'Email/password authentication' },
    { path: '/auth/refresh', method: 'POST', status: 'partial', description: 'Token refresh endpoint' },
    { path: '/auth/logout', method: 'POST', status: 'partial', description: 'User logout' },
    { path: '/auth/health', method: 'GET', status: 'implemented', description: 'API health check' }
  ],
  users: [
    { path: '/users', method: 'POST', status: 'implemented', description: 'Create new user' },
    { path: '/users/:userId', method: 'GET', status: 'implemented', description: 'Get user profile' },
    { path: '/users/:userId', method: 'PUT', status: 'implemented', description: 'Update user profile' },
    { path: '/users/:userId', method: 'DELETE', status: 'implemented', description: 'Delete user (Admin only)' }
  ],
  wallets: [
    { path: '/wallets', method: 'POST', status: 'partial', description: 'Create new wallet' },
    { path: '/wallets/:address', method: 'GET', status: 'partial', description: 'Get wallet details' },
    { path: '/wallets/:address/transfer', method: 'POST', status: 'partial', description: 'Transfer funds' }
  ],
  staking: [
    { path: '/staking/pools', method: 'GET', status: 'partial', description: 'List staking pools' },
    { path: '/staking/stakes', method: 'POST', status: 'partial', description: 'Create new stake' },
    { path: '/staking/stakes/:stakeId', method: 'GET', status: 'partial', description: 'Get stake details' },
    { path: '/staking/stakes/:stakeId', method: 'DELETE', status: 'partial', description: 'Unstake funds' }
  ]
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors = {
    implemented: 'bg-green-500',
    partial: 'bg-yellow-500',
    pending: 'bg-red-500'
  };
  
  return (
    <Badge className={status === 'implemented' ? 'bg-green-500' : status === 'partial' ? 'bg-yellow-500' : 'bg-red-500'}>
      {status}
    </Badge>
  );
};

const EndpointCard = ({ endpoint }: { endpoint: any }) => {
  return (
    <Card className="p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{endpoint.method}</Badge>
          <span className="font-mono">{endpoint.path}</span>
        </div>
        <StatusBadge status={endpoint.status} />
      </div>
      <p className="text-sm text-gray-500">{endpoint.description}</p>
      {endpoint.status === 'implemented' && <TestButton endpoint={endpoint} />}
    </Card>
  );
};

export default function FlatterManagement() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Flatter Management</h1>
      </div>
      
      <Tabs defaultValue="auth" className="space-y-4">
        <TabsList>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="staking">Staking</TabsTrigger>
        </TabsList>

        {Object.entries(endpoints).map(([category, eps]) => (
          <TabsContent key={category} value={category}>
            <div className="space-y-4">
              {eps.map((endpoint, index) => (
                <EndpointCard key={index} endpoint={endpoint} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

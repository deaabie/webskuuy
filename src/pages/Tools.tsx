
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator, Terminal, RefreshCw, Server, HardDrive, Cpu } from "lucide-react";
import { Link } from "react-router-dom";

const Tools = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6 gap-4">
          <Link to="/">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Node Tools</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="text-blue-500" size={20} />
                Staking Calculator
              </CardTitle>
              <CardDescription>
                Calculate potential rewards from running a validator node
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our staking calculator helps you estimate returns based on your stake amount, network parameters, and validator performance.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <strong>Features:</strong>
                  <ul className="list-disc list-inside mt-1 text-gray-600 dark:text-gray-300">
                    <li>APR estimation</li>
                    <li>Daily rewards</li>
                    <li>Multi-chain support</li>
                  </ul>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <strong>Supported chains:</strong>
                  <ul className="list-disc list-inside mt-1 text-gray-600 dark:text-gray-300">
                    <li>Cosmos</li>
                    <li>Polkadot</li>
                    <li>Ethereum</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Launch Calculator</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="text-green-500" size={20} />
                Command Generator
              </CardTitle>
              <CardDescription>
                Generate commands for common node operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Simplify your node operation with our command generator tool. Get ready-to-use commands for setup, maintenance, and troubleshooting.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <strong>Command types:</strong>
                  <ul className="list-disc list-inside mt-1 text-gray-600 dark:text-gray-300">
                    <li>Installation</li>
                    <li>Upgrades</li>
                    <li>Backup/Restore</li>
                  </ul>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <strong>Supported OS:</strong>
                  <ul className="list-disc list-inside mt-1 text-gray-600 dark:text-gray-300">
                    <li>Ubuntu</li>
                    <li>Debian</li>
                    <li>CentOS</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Generate Commands</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="text-purple-500" size={20} />
                Status Checker
              </CardTitle>
              <CardDescription>
                Check your node's status and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Monitor your node's health, sync status, and performance metrics with our comprehensive status checker.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <strong>Metrics:</strong>
                  <ul className="list-disc list-inside mt-1 text-gray-600 dark:text-gray-300">
                    <li>Sync status</li>
                    <li>Peer count</li>
                    <li>Resource usage</li>
                  </ul>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <strong>Features:</strong>
                  <ul className="list-disc list-inside mt-1 text-gray-600 dark:text-gray-300">
                    <li>Health alerts</li>
                    <li>Historical data</li>
                    <li>API access</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Check Status</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="text-orange-500" size={20} />
                Node Explorer
              </CardTitle>
              <CardDescription>
                Explore and analyze node data across networks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Advanced explorer tool for detailed analysis of node operations, network statistics, and blockchain data.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <strong>Data views:</strong>
                  <ul className="list-disc list-inside mt-1 text-gray-600 dark:text-gray-300">
                    <li>Validator stats</li>
                    <li>Network health</li>
                    <li>Reward history</li>
                  </ul>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <strong>Supported networks:</strong>
                  <ul className="list-disc list-inside mt-1 text-gray-600 dark:text-gray-300">
                    <li>15+ mainnets</li>
                    <li>25+ testnets</li>
                    <li>Custom networks</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Launch Explorer</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="text-teal-500" size={20} />
                Storage Calculator
              </CardTitle>
              <CardDescription>
                Calculate storage requirements for different nodes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Plan your infrastructure with accurate storage requirement calculations for different blockchain nodes.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <strong>Estimations for:</strong>
                  <ul className="list-disc list-inside mt-1 text-gray-600 dark:text-gray-300">
                    <li>Archive nodes</li>
                    <li>Full nodes</li>
                    <li>Light nodes</li>
                  </ul>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <strong>Features:</strong>
                  <ul className="list-disc list-inside mt-1 text-gray-600 dark:text-gray-300">
                    <li>Growth projections</li>
                    <li>Cost estimates</li>
                    <li>Pruning options</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Calculate Storage</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="text-red-500" size={20} />
                Hardware Advisor
              </CardTitle>
              <CardDescription>
                Get hardware recommendations for your node
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Receive tailored hardware recommendations based on the blockchain network, node type, and your performance goals.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <strong>Recommendations:</strong>
                  <ul className="list-disc list-inside mt-1 text-gray-600 dark:text-gray-300">
                    <li>CPU requirements</li>
                    <li>RAM sizing</li>
                    <li>Disk specifications</li>
                  </ul>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <strong>Options:</strong>
                  <ul className="list-disc list-inside mt-1 text-gray-600 dark:text-gray-300">
                    <li>Cloud providers</li>
                    <li>Bare metal</li>
                    <li>Cost optimization</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Recommendations</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tools;

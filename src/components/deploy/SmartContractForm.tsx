
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSDK, useAddress, useChain } from '@thirdweb-dev/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, 'Contract name is required'),
  contractType: z.string().min(1, 'Contract type is required'),
  contractCode: z.string().optional(),
  abi: z.string().optional(),
  bytecode: z.string().optional(),
  constructorArgs: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SmartContractForm = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState('');
  const [uploadMethod, setUploadMethod] = useState('code');
  
  const address = useAddress();
  const chain = useChain();
  const sdk = useSDK();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      contractType: 'custom',
      contractCode: '',
      abi: '',
      bytecode: '',
      constructorArgs: '',
    },
  });

  const contractTypes = [
    { value: 'custom', label: 'Custom Contract' },
    { value: 'erc20', label: 'ERC-20 Token' },
    { value: 'erc721', label: 'ERC-721 NFT' },
    { value: 'erc1155', label: 'ERC-1155 Multi-Token' },
  ];

  const onSubmit = async (data: FormValues) => {
    if (!sdk || !address) {
      toast.error('Wallet not connected');
      return;
    }

    setIsDeploying(true);
    
    try {
      let contractAddress;
      toast.info('Deploying smart contract...');
      
      // Mock deployment - in a real app, you'd use the ThirdWeb SDK to deploy
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock address
      contractAddress = '0x' + Math.random().toString(16).substr(2, 40);
      
      setDeployedAddress(contractAddress);
      toast.success('Contract deployed successfully!');
    } catch (error) {
      console.error('Deployment error:', error);
      toast.error('Failed to deploy contract');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Deploy Contract</h3>
      
      {deployedAddress ? (
        <div className="p-6 border rounded-lg bg-muted/30 text-center mb-6">
          <h4 className="text-lg font-bold text-green-600 dark:text-green-400 mb-2">
            Contract Deployed Successfully!
          </h4>
          <p className="text-sm mb-2">Contract Address:</p>
          <code className="bg-muted p-2 rounded block mb-4 overflow-x-auto text-xs">
            {deployedAddress}
          </code>
          <Button
            onClick={() => {
              setDeployedAddress('');
              form.reset();
            }}
            className="mt-2"
          >
            Deploy Another Contract
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Name</FormLabel>
                    <FormControl>
                      <Input placeholder="MyToken" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        {contractTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Tabs value={uploadMethod} onValueChange={setUploadMethod}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="code">Solidity Code</TabsTrigger>
                <TabsTrigger value="abi">ABI & Bytecode</TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="pt-4">
                <FormField
                  control={form.control}
                  name="contractCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract Source Code</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract MyContract {
    // Your contract code here
}"
                          className="font-mono min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="abi" className="pt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="abi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract ABI</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"}]'
                          className="font-mono min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bytecode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract Bytecode</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="0x608060405234801561001057600080fd5b50..."
                          className="font-mono min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <FormField
              control={form.control}
              name="constructorArgs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Constructor Arguments (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Comma separated values: 'Hello World', 123, true" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button 
                type="submit" 
                disabled={isDeploying} 
                className="w-full md:w-auto"
                size="lg"
              >
                {isDeploying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isDeploying ? 'Deploying...' : 'Deploy Contract'}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default SmartContractForm;

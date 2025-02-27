
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Star, Shield, Globe, Code, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
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
          <h1 className="text-2xl font-bold">About Us</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
                <CardDescription>
                  Empowering node operators with comprehensive resources and tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We are dedicated to simplifying the process of running blockchain nodes by providing clear, concise installation guides, 
                  troubleshooting resources, and community support. Our platform aims to be the go-to resource for both beginners and experienced 
                  node operators across multiple blockchain ecosystems.
                </p>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Founded in 2021 by a group of blockchain enthusiasts and node operators, our team has expanded to include developers, 
                  technical writers, and community managers who are passionate about decentralization and the future of blockchain technology.
                </p>
                
                <p className="text-gray-600 dark:text-gray-300">
                  We believe that by lowering the barrier to entry for node operation, we contribute to the decentralization and security of 
                  blockchain networks, ultimately strengthening the entire ecosystem.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Our Core Values</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Globe className="text-blue-500 mt-1" size={24} />
                  <div>
                    <h3 className="font-medium text-lg">Decentralization</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      We are committed to promoting a decentralized future through education and resources.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Shield className="text-green-500 mt-1" size={24} />
                  <div>
                    <h3 className="font-medium text-lg">Security</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      We prioritize security best practices in all our guides and recommendations.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Users className="text-purple-500 mt-1" size={24} />
                  <div>
                    <h3 className="font-medium text-lg">Community</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      We foster an inclusive, helpful community of node operators from all backgrounds.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Code className="text-orange-500 mt-1" size={24} />
                  <div>
                    <h3 className="font-medium text-lg">Innovation</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      We continuously adapt and improve our resources to keep pace with the evolving blockchain space.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Our Team</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Users className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium">Alex Johnson</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Founder & Lead Developer</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Code className="text-green-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium">Sarah Chen</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Technical Documentation Lead</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <Heart className="text-purple-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium">Michael Rodriguez</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Community Manager</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <Star className="text-orange-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium">Elena Petrov</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Blockchain Researcher</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>By The Numbers</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-3xl font-bold text-blue-500">50+</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Projects Supported</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-3xl font-bold text-green-500">15k+</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Community Members</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-3xl font-bold text-purple-500">200+</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Installation Guides</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                  <p className="text-3xl font-bold text-orange-500">20+</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Countries Represented</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

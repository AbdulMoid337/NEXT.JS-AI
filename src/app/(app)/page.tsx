'use client';

import { Mail } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <CarouselItem key={`skeleton-${index}`} className="p-4">
                  <Card className="bg-black">
                    <CardHeader>
                      <Skeleton className="h-8 w-[200px] bg-gray-700" />
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Skeleton className="h-8 w-8 bg-gray-700" />
                      <div className="w-full">
                        <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
                        <Skeleton className="h-4 w-3/4 bg-gray-700" />
                        <Skeleton className="h-3 w-20 mt-2 bg-gray-700" />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))
            ) : (
              messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className='bg-black'>
                    <CardHeader>
                      <CardTitle className='text-white'>{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex text-white flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0" />
                      <div>
                        <p>{message.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))
            )}
          </CarouselContent>
        </Carousel>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2023 True Feedback. All rights reserved.
      </footer>
    </>
  );
}

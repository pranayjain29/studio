'use client';

import { useState } from 'react';
import { FlipkartSearchForm, type FlipkartSearchFormData } from '@/components/flipkart-search-form';
import { searchFlipkartProduct } from '../actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertTriangle, ShoppingBag } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function FlipkartScrapperPage() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  const handleSearch = async (data: FlipkartSearchFormData) => {
    setStatus('loading');
    setUserEmail(data.email);
    setMessage(''); 

    try {
      const result = await searchFlipkartProduct(data.fsns, data.email);
      if (result.emailSentTo) {
        setUserEmail(result.emailSentTo); 
      }
      if (result.success) {
        setStatus('success');
        setMessage(`We have started scraping and we will notify you through email at ${result.emailSentTo || data.email}.`);
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
      console.error("Flipkart search failed:", error);
    }
  };

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-8">
      <Card className="w-full max-w-lg shadow-xl rounded-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShoppingBag size={32} strokeWidth={1.5} />
          </div>
          <CardTitle className="text-3xl font-bold">Flipkart FSN Scrapper</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-1">
            Enter FSNs (comma-separated) and your email to scrape Flipkart product prices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6 sm:p-8">
          <FlipkartSearchForm onSearch={handleSearch} isLoading={status === 'loading'} />

          {status === 'loading' && (
            <Alert className="flex items-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary mr-3" />
              <div>
                <AlertTitle className="font-semibold">Scraping Prices...</AlertTitle>
                <AlertDescription>
                  Scraping Flipkart for the provided FSNs. We&apos;ll email the results to {userEmail}.
                </AlertDescription>
              </div>
            </Alert>
          )}

          {status === 'success' && (
            <Alert className="bg-accent text-accent-foreground border-accent rounded-md">
              <CheckCircle className="h-5 w-5 mr-3" />
              <div>
                <AlertTitle className="font-semibold">Success!</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </div>
            </Alert>
          )}

          {status === 'error' && (
            <Alert variant="destructive" className="rounded-md">
              <AlertTriangle className="h-5 w-5 mr-3" />
              <div>
                <AlertTitle className="font-semibold">Error</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>
       <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Keyword Research Tools. All rights reserved.</p>
      </footer>
    </div>
  );
}


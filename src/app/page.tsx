'use client';

import { useState } from 'react';
import { SearchForm, type SearchFormData } from '@/components/search-form';
import { searchAmazonProduct } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertTriangle, ShoppingCart } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function HomePage() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');
  const [searchedKeyword, setSearchedKeyword] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  const handleSearch = async (data: SearchFormData) => {
    setStatus('loading');
    setSearchedKeyword(data.keyword);
    setUserEmail(data.email);
    setMessage(''); // Clear previous messages

    try {
      const result = await searchAmazonProduct(data.keyword, data.email);
      setSearchedKeyword(result.searchedKeyword); // Update with keyword from result for consistency
      if (result.emailSentTo) {
        setUserEmail(result.emailSentTo);
      }
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (error) {
      setStatus('error');
      // Use a generic message for unexpected client-side errors or if action throws without specific structure
      setMessage(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
      console.error("Search failed:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <Card className="w-full max-w-lg shadow-xl rounded-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShoppingCart size={32} strokeWidth={1.5} />
          </div>
          <CardTitle className="text-3xl font-bold">Amazon Keyword Research</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-1">
            Enter a keyword and your email to generate an Amazon product report.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6 sm:p-8">
          <SearchForm onSearch={handleSearch} isLoading={status === 'loading'} />

          {status === 'loading' && (
            <Alert className="flex items-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary mr-3" />
              <div>
                <AlertTitle className="font-semibold">Generating Report...</AlertTitle>
                <AlertDescription>
                  Looking for products related to &quot;{searchedKeyword}&quot; and preparing your report. Please wait.
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
        <p>&copy; {new Date().getFullYear()} Amazon Keyword Research. All rights reserved.</p>
      </footer>
    </main>
  );
}

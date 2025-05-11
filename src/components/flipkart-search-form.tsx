'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import { Textarea } from '@/components/ui/textarea'; // Using Textarea for potentially multiple FSNs
import { List, Loader2, Mail, Search } from 'lucide-react';

const formSchema = z.object({
  fsns: z.string().min(1, {
    message: 'FSNs cannot be empty.',
  }),
  email: z.string().email({ message: 'Please enter a valid email address.' }).min(1, {
    message: 'Email address cannot be empty.',
  }),
});

export type FlipkartSearchFormData = z.infer<typeof formSchema>;

interface FlipkartSearchFormProps {
  onSearch: (data: FlipkartSearchFormData) => Promise<void>;
  isLoading: boolean;
}

export function FlipkartSearchForm({ onSearch, isLoading }: FlipkartSearchFormProps) {
  const form = useForm<FlipkartSearchFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fsns: '',
      email: '',
    },
  });

  async function onSubmit(values: FlipkartSearchFormData) {
    await onSearch(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fsns"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">FSNs</FormLabel>
              <FormControl>
                <div className="relative">
                  <List className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Textarea
                    placeholder="e.g., PROD123XYZ, PROD456ABC (comma-separated)"
                    className="pl-10 text-base min-h-[80px]" // Adjusted padding for Textarea icon
                    {...field}
                    disabled={isLoading}
                    aria-label="FSNs"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Email Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10 text-base"
                    {...field}
                    disabled={isLoading}
                    aria-label="Email Address"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-base" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Scraping...
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Scrape Flipkart Prices
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}


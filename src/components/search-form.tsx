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
import { Search, Loader2, Mail } from 'lucide-react';

const formSchema = z.object({
  keyword: z.string().min(1, {
    message: 'Search keyword cannot be empty.',
  }),
  email: z.string().email({ message: 'Please enter a valid email address.' }).min(1, {
    message: 'Email address cannot be empty.',
  }),
});

export type SearchFormData = z.infer<typeof formSchema>;

interface SearchFormProps {
  onSearch: (data: SearchFormData) => Promise<void>;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const form = useForm<SearchFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: '',
      email: '',
    },
  });

  async function onSubmit(values: SearchFormData) {
    await onSearch(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="keyword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Search Keyword</FormLabel>
              <FormControl>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="e.g., 'wireless headphones'"
                    className="pl-10 text-base"
                    {...field}
                    disabled={isLoading}
                    aria-label="Search Keyword"
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
              Generating...
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Generate Product Report
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

"use client";
import { ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <AdminAuthProvider>
            <Toaster />
            <Sonner />
            {children}
          </AdminAuthProvider>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

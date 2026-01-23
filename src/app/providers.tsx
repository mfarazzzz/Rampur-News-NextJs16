"use client";
import { ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { configureCMS } from "@/services/cms";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const provider = import.meta.env.VITE_CMS_PROVIDER;
    
    if (provider === "wordpress") {
      configureCMS({
        provider: "wordpress",
        baseUrl: import.meta.env.VITE_CMS_URL || "/api/cms/wordpress",
      });
      return;
    }
    
    if (provider === "strapi") {
      configureCMS({
        provider: "strapi",
        baseUrl: import.meta.env.VITE_STRAPI_URL || "http://localhost:1337",
        apiKey: import.meta.env.VITE_STRAPI_TOKEN,
      });
      return;
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

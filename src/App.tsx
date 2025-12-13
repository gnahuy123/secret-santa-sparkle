import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreateRoom from "./pages/CreateRoom";
import RoomCreated from "./pages/RoomCreated";
import RevealAssignment from "./pages/RevealAssignment";
import AdminReveal from "./pages/AdminReveal";
import NotFound from "./pages/NotFound";
import { Layout } from "@/components/Layout";

const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create" element={<CreateRoom />} />
            <Route path="/room/:roomId" element={<RoomCreated />} />
            <Route path="/reveal/:key" element={<RevealAssignment />} />
            <Route path="/admin/:creatorKey" element={<AdminReveal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

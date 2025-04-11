import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NativeRouter, Routes, Route } from "react-router-native";
import Toast from 'react-native-toast-message';
import Index from "./pages/Index";
import NewCase from "./pages/NewCase";
import History from "./pages/History";
import CaseDetails from "./pages/CaseDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toast />
      <NativeRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/new-case" element={<NewCase />} />
          <Route path="/history" element={<History />} />
          <Route path="/case/:id" element={<CaseDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </NativeRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

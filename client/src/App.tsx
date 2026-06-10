import { Toaster } from "@/components/ui/sonner";
import { PasswordGate } from "./components/PasswordGate";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";
import Pricing from "./pages/Pricing";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContractorApply from "./pages/ContractorApply";
import { SpeedInsights } from "@vercel/speed-insights/react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/report/:id" component={Report} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/legal/tos" component={TermsOfService} />
      <Route path="/legal/privacy" component={PrivacyPolicy} />
      <Route path="/contractor-apply" component={ContractorApply} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <PasswordGate>
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <Router />
            <SpeedInsights />
          </TooltipProvider>
        </ThemeProvider>
      </PasswordGate>
    </ErrorBoundary>
  );
}

export default App;

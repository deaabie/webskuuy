
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { HelmetProvider } from 'react-helmet-async';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { THIRDWEB_CLIENT_ID, THIRDWEB_SUPPORTED_CHAINS } from './config/thirdweb-config';

// Pages
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Faq from './pages/Faq';
import Tools from './pages/Tools';
import ProjectDetail from './pages/ProjectDetail';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import Deploy from './pages/Deploy';
import Faucet from './pages/Faucet';
import CosmosExplorer from './pages/CosmosExplorer';
import ChainDashboard from './pages/ChainDashboard';

// Styles
import './App.css';

const App = () => {
  return (
    <ThirdwebProvider 
      clientId={THIRDWEB_CLIENT_ID}
      supportedChains={THIRDWEB_SUPPORTED_CHAINS}
    >
      <HelmetProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/deploy" element={<Deploy />} />
            <Route path="/faucet" element={<Faucet />} />
            <Route path="/cosmos-explorer" element={<CosmosExplorer />} />
            <Route path="/chain/:id" element={<ChainDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </HelmetProvider>
    </ThirdwebProvider>
  );
};

export default App;

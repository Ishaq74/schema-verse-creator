
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { Toaster } from '@/components/ui/toaster';
import AppLayout from '@/components/Layout/AppLayout';
import Home from '@/pages/Home';
import NewProject from '@/pages/NewProject';
import ImprovedDashboard from '@/pages/ImprovedDashboard';
import PresetLibrary from '@/pages/PresetLibrary';
import Analytics from '@/pages/Analytics';
import ProjectDetail from '@/pages/ProjectDetail';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProjectProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new-project" element={<NewProject />} />
              <Route path="/dashboard" element={<ImprovedDashboard />} />
              <Route path="/presets" element={<PresetLibrary />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
          <Toaster />
        </Router>
      </ProjectProvider>
    </QueryClientProvider>
  );
}

export default App;

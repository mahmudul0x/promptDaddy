import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LanguageProvider } from '@/contexts/LanguageContext';

import Index from './pages/Index';
import Demo from './pages/Demo';
import NotFound from './pages/NotFound';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import AiSearch from './pages/dashboard/AiSearch';
import LlmPrompts from './pages/dashboard/LlmPrompts';
import PromptEnhancer from './pages/dashboard/PromptEnhancer';
import ImagePrompts from './pages/dashboard/ImagePrompts';
import ImagePromptEnhancer from './pages/dashboard/ImagePromptEnhancer';
import Tutorials from './pages/dashboard/Tutorials';
import AiStarterKit from './pages/dashboard/AiStarterKit';
import Videos from './pages/dashboard/Videos';
import Fundamentals from './pages/dashboard/Fundamentals';
import Automation from './pages/dashboard/Automation';
import ClaudeSkills from './pages/dashboard/ClaudeSkills';
import ClaudeSkillBundle from './pages/dashboard/ClaudeSkillBundle';
import CustomGpts from './pages/dashboard/CustomGpts';
import Favorites from './pages/dashboard/Favorites';
import AiNews from './pages/dashboard/AiNews';
import AiModelRecommendations from './pages/dashboard/AiModelRecommendations';
import AiNewsDetail from './pages/dashboard/AiNewsDetail';
import Profile from './pages/dashboard/Profile';
import TrendingPrompts from './pages/dashboard/TrendingPrompts';
import GrokImaginePrompts from './pages/dashboard/GrokImaginePrompts';
import SeedancePrompts from './pages/dashboard/SeedancePrompts';
import NanoBananaPrompts from './pages/dashboard/NanoBananaPrompts';
import GptImagePrompts from './pages/dashboard/GptImagePrompts';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDemoPrompts from './pages/admin/AdminDemoPrompts';

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
  <ThemeProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthProvider>
            <FavoritesProvider>
              <LanguageProvider>
                <Routes>
              {/* Public */}
              <Route path="/" element={<Index />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Dashboard (protected via DashboardLayout) */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="search" element={<AiSearch />} />
                <Route path="prompts" element={<LlmPrompts />} />
                <Route path="prompt-enhancer" element={<PromptEnhancer />} />
                <Route path="image-prompts" element={<ImagePrompts />} />
                <Route path="image-enhancer" element={<ImagePromptEnhancer />} />
                <Route path="tutorials" element={<Tutorials />} />
                <Route path="ai-starter-kit" element={<AiStarterKit />} />
                <Route path="videos" element={<Videos />} />
                <Route path="fundamentals" element={<Fundamentals />} />
                <Route path="automation" element={<Automation />} />
                <Route path="claude-skills" element={<ClaudeSkills />} />
                <Route path="claude-skill-bundle" element={<ClaudeSkillBundle />} />
                <Route path="custom-gpts" element={<CustomGpts />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="ai-news" element={<AiNews />} />
                <Route path="ai-news/:articleId" element={<AiNewsDetail />} />
                <Route path="ai-models" element={<AiModelRecommendations />} />
                <Route path="trending" element={<TrendingPrompts />} />
                <Route path="grok-imagine" element={<GrokImaginePrompts />} />
                <Route path="seedance" element={<SeedancePrompts />} />
                <Route path="nano-banana" element={<NanoBananaPrompts />} />
                <Route path="gptimage" element={<GptImagePrompts />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/demo-prompts" element={<AdminDemoPrompts />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
              </LanguageProvider>
            </FavoritesProvider>
          </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
  </ErrorBoundary>
);

export default App;

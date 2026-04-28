import { useEffect, useState } from 'react';
import type { AiModelRecommendation } from '@/data/types';

// Free API sources (no key required for some)
const DATA_SOURCES = [
  // Source 1: Public model registry (GitHub raw)
  'https://raw.githubusercontent.com/awesome-tools/ai-models/main/models.json',

  // Source 2: OpenRouter free tier (requires key for full data)
  // Add VITE_OPENROUTER_API_KEY to your .env
];

export function useFreeAiModels() {
  const [models, setModels] = useState<AiModelRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

   useEffect(() => {
     let mounted = true;

     const fetchModels = async () => {
       setLoading(true);

       try {
         // Source 1: HuggingFace API (completely free, no API key required)
         // Fetches most popular models sorted by downloads
         try {
           const res = await fetch(
             'https://huggingface.co/api/models?sort=downloads&limit=30&full=true',
             {
               headers: {
                 'Accept': 'application/json',
                 'User-Agent': 'PromptLand/1.0',
               },
             }
           );

           if (res.ok) {
             const data = await res.json();
             const transformed = (data || [])
               .filter((m: any) => m.id && !m.id.includes('dataset'))
               .slice(0, 20)
               .map((model: any, idx: number) => ({
                 id: `hf-${model.id}`,
                 task_name: formatTaskName(model.pipeline_tag),
                 model_name: model.modelId || model.id.split('/')[1] || model.id,
                 provider: detectProvider(model.id),
                 description: model.description || model.cardData?.summary || `Popular ${model.pipeline_tag || 'AI'} model hosted on HuggingFace.`,
                 performance_score: estimatePerformance(model.downloads),
                 cost_rating: 'Free' as const,
                 speed_rating: estimateSpeed(model.modelId || model.id),
                 is_featured: idx < 3,
                 model_url: `https://huggingface.co/${model.id}`,
                 sort_order: idx + 1,
               }));

             if (mounted) setModels(transformed);
             setLoading(false);
             return;
           }
         } catch {
           // HuggingFace failed, try next source
         }

         // Source 2: GitHub awesome-ai-models (community maintained)
         try {
           const res = await fetch('https://raw.githubusercontent.com/steven2358/awesome-ai-models/main/models.json');
           if (res.ok) {
             const data = await res.json();
             const transformed = transformGitHubData(data);
             if (mounted) setModels(transformed);
             setLoading(false);
             return;
           }
         } catch {
           // GitHub failed, use static fallback
         }

         // Fallback: Local static JSON
         const staticRes = await fetch('/data/ai_model_recommendations.json');
         if (staticRes.ok) {
           const data = await staticRes.json();
           if (mounted) setModels(Array.isArray(data) ? data : []);
         } else {
           throw new Error('All model sources failed');
         }
       } catch (err) {
         setError(err as Error);
       } finally {
         if (mounted) setLoading(false);
       }
     };

     fetchModels();

     // Refresh every 30 minutes (HuggingFace cache friendly)
     const interval = setInterval(fetchModels, 30 * 60 * 1000);

     return () => {
       clearInterval(interval);
       mounted = false;
     };
   }, []);

  return { models, isLoading: loading, error };
}

function formatTaskName(pipelineTag?: string): string {
  if (!pipelineTag) return 'AI Model';
  return pipelineTag
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper functions
function detectProvider(modelId: string): string {
  const id = modelId.toLowerCase();
  if (id.includes('anthropic') || id.includes('claude')) return 'Anthropic';
  if (id.includes('openai') || id.includes('gpt')) return 'OpenAI';
  if (id.includes('google') || id.includes('gemini')) return 'Google';
  if (id.includes('meta') || id.includes('llama')) return 'Meta';
  if (id.includes('mistral')) return 'Mistral';
  if (id.includes('cohere')) return 'Cohere';
  if (id.includes('huggingface') || id.includes('transformers')) return 'HuggingFace';
  if (id.includes('tgi') || id.includes('text-generation')) return 'Together';
  if (id.includes('deepseek')) return 'DeepSeek';
  return 'Open Source';
}

function estimatePerformance(downloadsOrRating: number): number {
  // If already a score 1-10, return as is
  if (downloadsOrRating <= 10 && downloadsOrRating >= 1) {
    return Math.round(downloadsOrRating);
  }
  // Use downloads as proxy for performance/popularity
  const downloads = downloadsOrRating;
  if (downloads > 10000000) return 10;
  if (downloads > 1000000) return 9;
  if (downloads > 100000) return 8;
  if (downloads > 10000) return 7;
  return 6;
}

function estimateSpeed(modelId: string): string {
  const id = modelId.toLowerCase();
  if (id.includes('tiny') || id.includes('mini') || id.includes('small') || id.includes('lite')) return 'Fast';
  if (id.includes('large') || id.includes('xl') || id.includes('xxl') || id.includes('opus')) return 'Slow';
  return 'Medium';
}

function transformGitHubData(data: any[]): AiModelRecommendation[] {
  return (data || []).slice(0, 20).map((item: any, idx: number) => ({
    id: item.id || `model-${idx}`,
    task_name: item.task || item.category || 'AI Task',
    model_name: item.name || item.model || item.title || 'Unknown Model',
    provider: item.provider || detectProvider(item.id || ''),
    description: item.description || item.summary || 'AI model recommendation.',
    performance_score: item.rating || item.score || 7,
    cost_rating: item.cost_rating || (item.pricing ? 'Medium' : 'Low'),
    speed_rating: item.speed || 'Medium',
    is_featured: idx < 3,
    model_url: item.url || item.link || item.homepage || '#',
    sort_order: idx + 1,
  }));
}

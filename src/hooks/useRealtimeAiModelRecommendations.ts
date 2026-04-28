import { useEffect, useState } from 'react';
import type { AiModelRecommendation } from '@/data/types';

// Free, no-auth data sources
const FREE_DATA_SOURCES = [
  // HuggingFace public models API (no key required, ~1000 models)
  'https://huggingface.co/api/models?sort=downloads&limit=50&full=true',

  // GitHub: Awesome AI Models list (community maintained)
  'https://raw.githubusercontent.com/steven2358/awesome-ai-models/main/models.json',
];

export function useRealtimeAiModelRecommendations() {
  const [models, setModels] = useState<AiModelRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchModels = async () => {
      setLoading(true);
      setError(null);

      try {
        // Try HuggingFace API first (free, no auth)
        try {
          const res = await fetch('https://huggingface.co/api/models?sort=downloads&limit=30&full=true', {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'PromptLand/1.0',
            },
          });

          if (res.ok) {
            const data = await res.json();
            const transformed = transformHuggingFaceData(data);
            if (mounted) {
              setModels(transformed);
              console.log('✅ Loaded models from HuggingFace API:', transformed.length);
            }
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('HuggingFace API failed, trying next source...', err);
        }

        // Fallback: GitHub awesome-ai-models list
        try {
          const res = await fetch('https://raw.githubusercontent.com/steven2358/awesome-ai-models/main/models.json');
          if (res.ok) {
            const data = await res.json();
            const transformed = transformGitHubData(data);
            if (mounted) {
              setModels(transformed);
              console.log('✅ Loaded models from GitHub:', transformed.length);
            }
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('GitHub JSON failed, using static fallback...', err);
        }

        // Final fallback: local static JSON
        const staticRes = await fetch('/data/ai_model_recommendations.json');
        if (staticRes.ok) {
          const data = await staticRes.json();
          if (mounted) setModels(Array.isArray(data) ? data : []);
          console.log('✅ Loaded models from static JSON');
        } else {
          throw new Error('All data sources failed');
        }
      } catch (err) {
        setError(err as Error);
        console.error('Failed to load models:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchModels();

    // Optional: Poll every 30 minutes to keep data fresh (no real-time websockets for free APIs)
    const interval = setInterval(fetchModels, 30 * 60 * 1000); // 30 minutes

    return () => {
      clearInterval(interval);
      mounted = false;
    };
  }, []);

  return { models, isLoading: loading, error };
}

// Transform HuggingFace API response to our format
function transformHuggingFaceData(data: any[]): AiModelRecommendation[] {
  return (data || [])
    .filter((model: any) => model.id && !model.id.includes('dataset'))
    .slice(0, 30)
    .map((model: any, idx: number) => {
      const tags = model.tags || [];
      const pipeline = model.pipeline_tag || 'unknown';
      const downloads = model.downloads || 0;

      // Determine provider from model ID
      const provider = detectProvider(model.id);

      // Determine task name
      const taskName = pipeline
        ? pipeline.charAt(0).toUpperCase() + pipeline.slice(1).replace(/-/g, ' ')
        : 'AI Model';

      // Estimate performance based on downloads and recency
      const performanceScore = estimatePerformance(model);

      // Estimate cost (HuggingFace models are free to run, but infrastructure costs vary)
      const costRating = 'Low'; // Most HF models are free

      // Estimate speed based on model size
      const speedRating = estimateSpeed(model);

      // Featured: top 5 by downloads
      const isFeatured = idx < 5;

      return {
        id: `hf-${model.id}`,
        task_name: taskName,
        model_name: model.modelId || model.id.split('/')[1] || model.id,
        provider,
        description: model.description || model.cardData?.summary || `State-of-the-art ${pipeline} model.`,
        performance_score: performanceScore,
        cost_rating: costRating,
        speed_rating: speedRating,
        is_featured: isFeatured,
        model_url: `https://huggingface.co/${model.id}`,
        sort_order: idx + 1,
      };
    });
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
  return 'Open Source';
}

function estimatePerformance(model: any): number {
  // Use downloads as proxy for performance/popularity
  const downloads = model.downloads || 0;
  if (downloads > 10000000) return 10;
  if (downloads > 1000000) return 9;
  if (downloads > 100000) return 8;
  if (downloads > 10000) return 7;
  return 6;
}

function estimateSpeed(model: any): string {
  // Estimate based on model size if available
  const size = model.modelId || model.id || '';
  if (size.includes('tiny') || size.includes('mini') || size.includes('small')) return 'Fast';
  if (size.includes('large') || size.includes('xl') || size.includes('xxl')) return 'Slow';
  return 'Medium';
}


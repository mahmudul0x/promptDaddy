import { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight, RefreshCw, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { cn } from '@/lib/utils';

const STYLES = [
  { key: 'photorealistic', label: 'Photorealistic', example: 'DSLR, 85mm, f/1.8, golden hour' },
  { key: 'cinematic', label: 'Cinematic', example: 'Film grain, anamorphic, dramatic lighting' },
  { key: 'illustration', label: 'Illustration', example: 'Digital art, concept art, detailed' },
  { key: 'anime', label: 'Anime/Manga', example: 'Anime style, vibrant colors, cel shading' },
  { key: 'minimalist', label: 'Minimalist', example: 'Clean, simple, white space, editorial' },
  { key: 'fantasy', label: 'Fantasy/Sci-fi', example: 'Epic scale, magical, otherworldly' },
];

const MOODS = [
  { key: 'dramatic', label: 'Dramatic' },
  { key: 'serene', label: 'Serene' },
  { key: 'mysterious', label: 'Mysterious' },
  { key: 'joyful', label: 'Joyful' },
  { key: 'melancholic', label: 'Melancholic' },
  { key: 'epic', label: 'Epic' },
];

const TOOLS = [
  { key: 'midjourney', label: 'Midjourney' },
  { key: 'dalle', label: 'DALL·E 3' },
  { key: 'stable', label: 'Stable Diffusion' },
  { key: 'flux', label: 'Flux' },
];

function buildImagePrompt(subject: string, style: string, mood: string, tool: string): string {
  const styleDetails: Record<string, string> = {
    photorealistic: 'ultra-realistic photography, DSLR quality, 85mm lens, shallow depth of field, natural lighting, high dynamic range',
    cinematic: 'cinematic composition, anamorphic lens, dramatic volumetric lighting, film grain, color graded, wide aspect ratio',
    illustration: 'detailed digital illustration, concept art style, intricate details, professional artwork, vibrant colors',
    anime: 'anime art style, vibrant cel-shaded colors, clean linework, studio quality, manga-inspired',
    minimalist: 'minimalist composition, clean lines, editorial design, generous white space, subtle shadows',
    fantasy: 'fantasy concept art, epic scale, magical atmosphere, intricate world-building details, dramatic lighting',
  };

  const moodDetails: Record<string, string> = {
    dramatic: 'high-contrast dramatic lighting, intense atmosphere, powerful composition',
    serene: 'soft diffused light, peaceful atmosphere, harmonious color palette, tranquil',
    mysterious: 'moody shadows, enigmatic atmosphere, fog, mysterious depth',
    joyful: 'warm vibrant colors, bright cheerful lighting, lively and energetic',
    melancholic: 'cool desaturated tones, soft overcast lighting, nostalgic and contemplative',
    epic: 'sweeping panoramic scale, heroic composition, awe-inspiring grandeur',
  };

  const toolNotes: Record<string, string> = {
    midjourney: '-- v6.1, -- ar 16:9, -- style raw, -- q 2',
    dalle: 'high quality, detailed, vibrant',
    stable: 'masterpiece, best quality, detailed, 8k, HDR',
    flux: 'photorealistic, ultra-detailed, professional',
  };

  const parts = [
    subject.trim(),
    styleDetails[style] ?? styleDetails.photorealistic,
    moodDetails[mood] ?? moodDetails.dramatic,
    '8K resolution, masterpiece quality, award-winning composition',
    toolNotes[tool] ?? '',
  ].filter(Boolean);

  return parts.join(', ');
}

export default function ImagePromptEnhancer() {
  const [subject, setSubject] = useState('');
  const [style, setStyle] = useState('photorealistic');
  const [mood, setMood] = useState('dramatic');
  const [tool, setTool] = useState('midjourney');
  const [enhanced, setEnhanced] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleEnhance = async () => {
    if (!subject.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setEnhanced(buildImagePrompt(subject, style, mood, tool));
    setLoading(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(enhanced);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        icon={Sparkles}
        title="Image Prompt Enhancer"
        description="Describe your image idea and get a perfectly structured prompt optimized for any AI image tool."
        iconColor="text-violet-400"
      />

      <div className="space-y-6">
        {/* Subject */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground/80">What do you want to generate?</Label>
          <Textarea
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. A lone astronaut standing on a red alien planet with two moons visible in the sky"
            rows={3}
            className="resize-none bg-secondary/50 border-border/60 focus-visible:ring-primary/40"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {/* Style */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground/80">Visual Style</Label>
            <div className="space-y-1.5">
              {STYLES.map(({ key, label, example }) => (
                <button
                  key={key}
                  onClick={() => setStyle(key)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg border transition-all',
                    style === key
                      ? 'bg-primary/15 text-primary border-primary/40'
                      : 'text-muted-foreground border-border/50 hover:text-foreground hover:border-border'
                  )}
                >
                  <div className="text-sm font-medium">{label}</div>
                  <div className="text-[10px] opacity-70 mt-0.5">{example}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground/80">Mood & Atmosphere</Label>
            <div className="space-y-1.5">
              {MOODS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setMood(key)}
                  className={cn(
                    'w-full text-left px-3 py-2.5 rounded-lg border transition-all text-sm',
                    mood === key
                      ? 'bg-accent/15 text-accent border-accent/40 font-medium'
                      : 'text-muted-foreground border-border/50 hover:text-foreground hover:border-border'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tool */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground/80">AI Tool</Label>
            <div className="space-y-1.5">
              {TOOLS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTool(key)}
                  className={cn(
                    'w-full text-left px-3 py-2.5 rounded-lg border transition-all text-sm',
                    tool === key
                      ? 'bg-violet-400/15 text-violet-400 border-violet-400/40 font-medium'
                      : 'text-muted-foreground border-border/50 hover:text-foreground hover:border-border'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <Button
              onClick={handleEnhance}
              disabled={!subject.trim() || loading}
              className="w-full mt-4 bg-gradient-primary text-primary-foreground hover:opacity-90 gap-2"
            >
              {loading ? (
                <><RefreshCw className="h-4 w-4 animate-spin" /> Building...</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Enhance <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </div>
        </div>

        {/* Output */}
        {enhanced && (
          <div className="space-y-3 p-5 rounded-xl border border-primary/30 bg-primary/5">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-primary flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Enhanced Prompt
              </Label>
              <Button
                onClick={handleCopy}
                size="sm"
                variant="outline"
                className={cn('gap-1.5 text-xs', copied ? 'text-green-400 border-green-400/40' : '')}
              >
                {copied ? <><Check className="h-3.5 w-3.5" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
              </Button>
            </div>
            <p className="text-sm text-foreground/90 font-mono leading-relaxed">{enhanced}</p>
            <p className="text-xs text-muted-foreground">
              Optimized for <strong className="text-foreground">{TOOLS.find((t) => t.key === tool)?.label}</strong> ·{' '}
              {STYLES.find((s) => s.key === style)?.label} style · {MOODS.find((m) => m.key === mood)?.label} mood
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

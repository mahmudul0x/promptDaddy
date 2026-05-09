import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, Sparkles, Zap, Image, Wand2, MessageSquare, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useDemoPrompts } from "@/hooks/useData";
import type { DemoPrompt as DemoPromptType } from "@/data/types";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Email: MessageSquare,
  Content: Zap,
  Image: Image,
  "GPT Image": Wand2,
  "Claude Skill": Bot,
  Social: Sparkles,
};

const Demo = () => {
  const { data: prompts = [], isLoading } = useDemoPrompts();
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = (prompt: DemoPromptType) => {
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(prompt.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleTest = (prompt: DemoPromptType) => {
    window.open(prompt.test_url || "https://chat.openai.com", "_blank");
  };

  const getIcon = (category: string) => {
    return CATEGORY_ICONS[category] || Sparkles;
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      
      <div className="pt-28 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              <span className="text-gradient-primary">Try Before</span> You Buy
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Test these free prompts to see the quality of our prompt library. Copy and paste into ChatGPT, Claude, or any AI tool.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : prompts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p>No demo prompts available yet.</p>
              <Link to="/" className="text-primary hover:underline mt-2 inline-block">
                ← Back to Home
              </Link>
            </div>
          ) : (
            <>
              {/* Prompts Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {prompts.filter(p => p.is_active).map((prompt) => {
                  const Icon = getIcon(prompt.category);
                  
                  return (
                    <div
                      key={prompt.id}
                      className="group relative rounded-2xl border border-border/40 bg-card/60 p-5 transition-all hover:border-border/80"
                    >
                      {prompt.image_url && (
                        <div className="mb-3 rounded-lg overflow-hidden">
                          <img 
                            src={prompt.image_url} 
                            alt={prompt.title}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">{prompt.category}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-sm font-bold mb-2">{prompt.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{prompt.prompt}</p>
                      
                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(prompt)}
                          className="flex-1 text-xs"
                        >
                          {copied === prompt.id ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : (
                            <Copy className="h-3 w-3 mr-1" />
                          )}
                          {copied === prompt.id ? "Copied!" : "Copy"}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleTest(prompt)}
                          className="flex-1 text-xs"
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          Test
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-4">Like what you see?</p>
                <Button asChild size="lg">
                  <Link to="/register">Get Full Access — ৳199/mo</Link>
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  900+ prompts, 50+ Claude Skills, 17,000+ image prompts & more
                </p>
                <Link to="/" className="text-xs text-primary hover:underline mt-4 block">
                  ← Back to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <SiteFooter />
    </main>
  );
};

export default Demo;
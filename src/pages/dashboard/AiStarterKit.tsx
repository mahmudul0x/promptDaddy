import { useMemo, useState } from 'react';
import {
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  SlidersHorizontal,
  Check,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { PromptModal } from '@/components/dashboard/PromptModal';
import { ContentCard } from '@/components/dashboard/ContentCard';
import { useAiStarterKit } from '@/hooks/useData';
import type { AiStarterKitSection, AiStarterKitPrompt, AiStarterKitSkill, AiStarterKitData } from '@/data/types';

type PromptItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  section: string;
  tags: string[];
  content: string;
  imageUrl?: string;
};

type SkillItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  section: string;
  tags: string[];
  content: string;
  imageUrl?: string;
  externalUrl?: string;
};

type CategoryGroup = {
  title: string;
  image_url?: string;
  prompts: PromptItem[];
};

type SectionWithContent = {
  data: AiStarterKitSection;
  categories: CategoryGroup[];
  skills?: SkillItem[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cleanTitle(value: string) {
  return value.replace(/^[0-9]+\.\s*/, '').trim();
}

function buildPromptDescription(prompt: AiStarterKitPrompt) {
  const tags = prompt.tags?.slice(0, 3).join(', ');
  return tags ? `${cleanTitle(prompt.title)} · ${tags}` : cleanTitle(prompt.title);
}

function buildSkillContent(item: AiStarterKitSkill) {
  const tags = item.tags?.length ? item.tags.map((tag) => `#${tag}`).join(' ') : 'No tags listed';
  return [
    `Skill: ${item.name}`,
    `Slug: ${item.slug}`,
    '',
    item.description,
    '',
    `Tags: ${tags}`,
    '',
    'How to use:',
    `1. Open Claude and trigger ${item.slug}`,
    '2. Add your task context or source material',
    '3. Let the skill structure the output for you',
  ].join('\n');
}

function SectionCard({
  item,
  active,
  onClick,
  categoryCount,
  promptCount,
}: {
  item: AiStarterKitSection;
  active: boolean;
  onClick: () => void;
  categoryCount?: number;
  promptCount?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border text-left transition-all duration-200 ${
        active
          ? 'border-primary/35 bg-primary/8 shadow-[0_0_18px_hsl(var(--primary)/0.08)]'
          : 'border-border/40 bg-card/45 hover:border-border/70 hover:bg-card/65'
      }`}
    >
      {/* Image with Overlay Badges */}
      <div className="relative h-28 overflow-hidden bg-secondary/40">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : null}

        {/* Badge overlays on image corners */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {/* Top-left: Prompt count */}
        {promptCount !== undefined && promptCount > 0 && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-lg bg-amber-500/90 backdrop-blur-sm px-2 py-1 text-[10px] font-bold text-amber-50 shadow-lg">
            <Sparkles className="h-3 w-3" />
            <span>{promptCount}</span>
          </div>
        )}

        {/* Top-right: Category count */}
        {categoryCount !== undefined && categoryCount > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 rounded-lg bg-blue-500/90 backdrop-blur-sm px-2 py-1 text-[10px] font-bold text-blue-50 shadow-lg">
            <FolderOpen className="h-3 w-3" />
            <span>{categoryCount}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">{cleanTitle(item.title)}</h3>
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
      </div>
    </button>
  );
}

function CategoryCard({
  category,
  onClick,
}: {
  category: CategoryGroup;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group overflow-hidden rounded-xl border border-border/40 bg-card/45 text-left transition-all duration-200 hover:border-border/70 hover:bg-card/65"
    >
      <div className="h-24 overflow-hidden bg-secondary/40">
        {category.image_url ? (
          <img
            src={category.image_url}
            alt={category.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="p-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">{cleanTitle(category.title)}</h3>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {category.prompts.length} {category.prompts.length === 1 ? 'prompt' : 'prompts'}
        </p>
      </div>
    </button>
  );
}

function SkillCard({
  skill,
  onClick,
}: {
  skill: SkillItem;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group flex flex-col rounded-xl border border-border/40 bg-card/60 overflow-hidden hover:border-primary/30 hover:bg-card/90 hover:shadow-[0_4px_24px_hsl(var(--primary)/0.08)] transition-all duration-200 cursor-pointer"
    >
      <div className="h-24 overflow-hidden bg-secondary/40 flex items-center justify-center">
        {skill.imageUrl ? (
          <img
            src={skill.imageUrl}
            alt={skill.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
            <span className="text-3xl">🤖</span>
          </div>
        )}
      </div>
      <div className="p-3.5 flex-1">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {skill.title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {skill.description}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {skill.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-medium text-cyan-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

type ItemTypeFilter = 'all' | 'prompts' | 'skills';

export default function AiStarterKit() {
  const { data, isLoading } = useAiStarterKit();
  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<PromptItem | SkillItem | null>(null);
  const [itemTypeFilter, setItemTypeFilter] = useState<ItemTypeFilter>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const fullData = data as AiStarterKitData | undefined;
  const sections = fullData?.sections ?? [];
  const prompts = fullData?.prompts ?? [];
  const skills = fullData?.claude_skills ?? [];

  // Group prompts by section, then by category
  const processedSections = useMemo<SectionWithContent[]>(() => {
    return sections.map((section) => {
      const sectionPrompts = prompts.filter(
        (p) => cleanTitle(p.section) === cleanTitle(section.title)
      );

      // Group prompts by category
      const categoryMap = new Map<string, PromptItem[]>();
      sectionPrompts.forEach((prompt) => {
        const catTitle = cleanTitle(prompt.category);
        if (!categoryMap.has(catTitle)) {
          categoryMap.set(catTitle, []);
        }
        categoryMap.get(catTitle)!.push({
          id: `prompt-${section.id}-${slugify(prompt.title)}`,
          title: cleanTitle(prompt.title),
          description: buildPromptDescription(prompt),
          category: catTitle,
          section: cleanTitle(section.title),
          tags: prompt.tags ?? [],
          content: prompt.prompt,
          imageUrl: prompt.image_url,
        });
      });

      const categories: CategoryGroup[] = [];
      categoryMap.forEach((promptList, title) => {
        const imageUrl = promptList[0]?.imageUrl || section.image_url;
        categories.push({
          title,
          image_url: imageUrl,
          prompts: promptList,
        });
      });

      categories.sort((a, b) => a.title.localeCompare(b.title));

      const sectionSkills: SkillItem[] = cleanTitle(section.title).toLowerCase().includes('claude')
        ? skills.map((skill) => ({
            id: `skill-${section.id}-${slugify(skill.slug || skill.name)}`,
            title: skill.name,
            description: skill.description,
            category: 'Claude Skills',
            section: cleanTitle(section.title),
            tags: skill.tags ?? [],
            content: buildSkillContent(skill),
            imageUrl: skill.image_url,
            externalUrl: undefined,
          }))
        : [];

      return {
        data: section,
        categories,
        skills: sectionSkills.length > 0 ? sectionSkills : undefined,
      };
    });
  }, [sections, prompts, skills]);

  // Filter to only sections that have content (prompts or skills)
  const contentSections = useMemo(() => {
    return processedSections.filter(s => s.categories.length > 0 || s.skills?.length);
  }, [processedSections]);

  // Get section data by ID
  const getSectionData = (sectionId: string) => {
    return contentSections.find(s => s.data.id === sectionId);
  };

  // Flatten all prompts for global search
  const allPrompts = useMemo(() => {
    return prompts.map((prompt) => ({
      id: `prompt-${slugify(prompt.title)}`,
      title: cleanTitle(prompt.title),
      description: buildPromptDescription(prompt),
      category: cleanTitle(prompt.category),
      section: cleanTitle(prompt.section),
      tags: prompt.tags ?? [],
      content: prompt.prompt,
      imageUrl: prompt.image_url,
    }));
  }, [prompts]);

  // Flatten all skills for global search
  const allSkills = useMemo<SkillItem[]>(() => {
    return skills.map((skill) => ({
      id: `skill-${slugify(skill.slug || skill.name)}`,
      title: skill.name,
      description: skill.description,
      category: 'Claude Skills',
      section: 'Claude Skills',
      tags: skill.tags ?? [],
      content: buildSkillContent(skill),
      imageUrl: skill.image_url,
      externalUrl: skill.slug ? `https://aiblackmagic.com${skill.slug}` : undefined,
    }));
  }, [skills]);

  // Get currently displayed items based on active section and category
  const displayedItems = useMemo<Array<PromptItem | SkillItem>>(() => {
    if (!activeSection) return [];

    const section = getSectionData(activeSection);
    if (!section) return [];

    if (activeCategory && section.categories) {
      const category = section.categories.find(c => c.title === activeCategory);
      return category?.prompts ?? [];
    }

    // If no category selected but section has categories, return empty (show categories)
    if (section.categories && section.categories.length > 0) {
      return [];
    }

    // If section has skills, return skills
    if (section.skills) {
      return section.skills;
    }

    return [];
  }, [activeSection, activeCategory, contentSections]);

  // Filter items based on search and type
  const filteredItems = useMemo(() => {
    let items = displayedItems;

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        item.content.toLowerCase().includes(q),
      );
    }

    // Apply item type filter (only when viewing all sections, not inside a specific section)
    if (!activeSection && itemTypeFilter !== 'all') {
      items = items.filter((item) => {
        const isPrompt = 'content' in item && !('externalUrl' in item);
        return itemTypeFilter === 'prompts' ? isPrompt : !isPrompt;
      });
    }

    return items;
  }, [displayedItems, search, itemTypeFilter, activeSection]);

  const selectedSection = contentSections.find(s => s.data.id === activeSection);
  const sectionMeta = selectedSection?.data;

  // Count total prompts and skills
  const totalPrompts = allPrompts.length;
  const totalSkills = allSkills.length;

  // Global search across all content
  const globalItems = useMemo(() => [...allPrompts, ...allSkills], [allPrompts, allSkills]);
  const globalFiltered = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return globalItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        item.content.toLowerCase().includes(q);

      const isPrompt = 'content' in item && !('externalUrl' in item);
      const matchesType =
        itemTypeFilter === 'all' ||
        (itemTypeFilter === 'prompts' && isPrompt) ||
        (itemTypeFilter === 'skills' && !isPrompt);

      return matchesSearch && matchesType;
    });
  }, [globalItems, search, itemTypeFilter]);

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        icon={Sparkles}
        title="AI Starter Kit"
        description={
          activeSection
            ? sectionMeta?.description
            : 'A structured starter library for solopreneurs with section guides, ready-to-use prompts, and Claude skills.'
        }
        count={
          activeSection
            ? filteredItems.length
            : search.trim()
            ? globalFiltered.length
            : totalPrompts + totalSkills
        }
        iconColor="text-amber-400"
      />

      {/* Search and Filter Bar */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-lg">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeSection
                ? `Search in ${activeCategory || activeSection}...`
                : 'Search prompts, tags, or skills...'
            }
            className="w-full h-10 pl-4 pr-4 rounded-xl border border-border/35 bg-white/[0.03] text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all"
          />
        </div>

        {!activeSection && (
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex h-10 items-center gap-2 rounded-xl border border-border/35 bg-white/[0.03] px-3.5 text-sm font-medium text-foreground hover:border-border/70 hover:bg-white/[0.05] transition-all"
            >
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <span className="hidden sm:inline">
                {itemTypeFilter === 'all' ? 'All' : itemTypeFilter === 'prompts' ? 'Prompts' : 'Skills'}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {showFilterDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowFilterDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-50 w-36 rounded-lg border border-border/60 bg-card/95 shadow-xl backdrop-blur-sm overflow-hidden">
                  <button
                    onClick={() => {
                      setItemTypeFilter('all');
                      setShowFilterDropdown(false);
                    }}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-xs hover:bg-secondary/50 transition-colors ${
                      itemTypeFilter === 'all' ? 'text-foreground bg-secondary/30' : 'text-muted-foreground'
                    }`}
                  >
                    All
                    {itemTypeFilter === 'all' && <Check className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      setItemTypeFilter('prompts');
                      setShowFilterDropdown(false);
                    }}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-xs hover:bg-secondary/50 transition-colors ${
                      itemTypeFilter === 'prompts' ? 'text-foreground bg-secondary/30' : 'text-muted-foreground'
                    }`}
                  >
                    Prompts
                    {itemTypeFilter === 'prompts' && <Check className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      setItemTypeFilter('skills');
                      setShowFilterDropdown(false);
                    }}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-xs hover:bg-secondary/50 transition-colors ${
                      itemTypeFilter === 'skills' ? 'text-foreground bg-secondary/30' : 'text-muted-foreground'
                    }`}
                  >
                    Skills
                    {itemTypeFilter === 'skills' && <Check className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Back Navigation */}
      {activeSection && (
        <button
          onClick={() => {
            setActiveSection(null);
            setActiveCategory(null);
            setSearch('');
          }}
          className="mb-4 flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowUpRight className="h-4 w-4 rotate-180" />
          Back to all sections
        </button>
      )}

      {activeSection && activeCategory && (
        <button
          onClick={() => {
            setActiveCategory(null);
            setSearch('');
          }}
          className="mb-4 ml-6 flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowUpRight className="h-4 w-4 rotate-180" />
          Back to {activeSection}
        </button>
      )}

      {/* Section Cards - Show when no section selected */}
      {!activeSection && !search.trim() && (
        <div className="mb-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {contentSections.map((sectionWrapper) => (
              <SectionCard
                key={sectionWrapper.data.id}
                item={sectionWrapper.data}
                active={false}
                onClick={() => {
                  setActiveSection(sectionWrapper.data.id);
                  setActiveCategory(null);
                }}
                categoryCount={
                  sectionWrapper.categories.length ||
                  (sectionWrapper.skills ? 1 : undefined)
                }
                promptCount={
                  sectionWrapper.categories.reduce((sum, cat) => sum + cat.prompts.length, 0) ||
                  (sectionWrapper.skills ? sectionWrapper.skills.length : undefined)
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Category Cards - Show when section selected but no category */}
      {activeSection && !activeCategory && !search.trim() && selectedSection?.categories && selectedSection.categories.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Categories in {cleanTitle(selectedSection.data.title)}</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {selectedSection.categories.map((category) => (
              <CategoryCard
                key={category.title}
                category={category}
                onClick={() => setActiveCategory(category.title)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Skills Grid - Show when Claude Skills section selected */}
      {activeSection && !activeCategory && !search.trim() && selectedSection?.skills && selectedSection.skills.length > 0 && (
        <div className="mb-6">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-foreground">Claude Skills</h3>
            <p className="text-xs text-muted-foreground">Ready-to-use slash commands that automate business tasks.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {selectedSection.skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onClick={() => setSelected(skill)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Prompts Grid - Show when category selected or search active in section */}
      {(activeSection && (activeCategory || search.trim())) && (
        <>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-52 rounded-xl bg-secondary/30 animate-pulse" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-20 text-center">
              <Sparkles className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
              <h3 className="font-semibold text-foreground">
                {search.trim() ? 'No results found' : 'No prompts in this category'}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {search.trim() ? 'Try a different search term.' : 'This category is coming soon.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => {
                const isPrompt = 'content' in item && !('externalUrl' in item);
                return (
                  <ContentCard
                    key={item.id}
                    id={item.id}
                    type={isPrompt ? 'prompt' : 'claude_skill'}
                    title={item.title}
                    description={item.description}
                    category={item.category}
                    is_premium={false}
                    copyText={item.content}
                    thumbnail={item.imageUrl}
                    badge={item.section}
                    onClick={() => setSelected(item)}
                  />
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Global Search Results - Show when searching without section selected */}
      {!activeSection && search.trim() && (
        <>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Search Results ({globalFiltered.length})
            </h3>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-52 rounded-xl bg-secondary/30 animate-pulse" />
              ))}
            </div>
          ) : globalFiltered.length === 0 ? (
            <div className="py-20 text-center">
              <Sparkles className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
              <h3 className="font-semibold text-foreground">No results found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try a different search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {globalFiltered.map((item) => {
                const isPrompt = 'content' in item && !('externalUrl' in item);
                return (
                  <ContentCard
                    key={item.id}
                    id={item.id}
                    type={isPrompt ? 'prompt' : 'claude_skill'}
                    title={item.title}
                    description={item.description}
                    category={item.category}
                    is_premium={false}
                    copyText={item.content}
                    thumbnail={item.imageUrl}
                    badge={item.section}
                    onClick={() => setSelected(item)}
                  />
                );
              })}
            </div>
          )}
        </>
      )}

      {selected && 'content' in selected && !('externalUrl' in selected) && (
        <PromptModal
          open
          onClose={() => setSelected(null)}
          id={selected.id}
          type="prompt"
          title={selected.title}
          description={selected.description}
          category={selected.category}
          content={selected.content}
          is_premium={false}
          thumbnail={selected.imageUrl}
          extraBadge={selected.section}
        />
      )}

      {selected && 'externalUrl' in selected && (
        <PromptModal
          open
          onClose={() => setSelected(null)}
          id={selected.id}
          type="claude_skill"
          title={selected.title}
          description={selected.description}
          category={selected.category}
          content={selected.content}
          is_premium={false}
          externalUrl={selected.externalUrl}
          extraBadge={selected.section}
        />
      )}
    </div>
  );
}

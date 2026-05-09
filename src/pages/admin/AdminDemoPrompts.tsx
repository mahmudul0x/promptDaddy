import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Loader2, Image, ExternalLink } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoPrompts } from "@/hooks/useData";
import type { DemoPrompt } from "@/data/types";

const dataSupabase = createClient(
  import.meta.env.VITE_DATA_SUPABASE_URL as string,
  import.meta.env.VITE_DATA_SUPABASE_ANON_KEY as string
);

const CATEGORIES = ["Email", "Content", "Image", "GPT Image", "Claude Skill", "Social", "Video", "Automation"];

export default function AdminDemoPrompts() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: prompts = [], isLoading, refetch } = useDemoPrompts();
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<DemoPrompt | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    prompt: "",
    category: "Email",
    image_url: "",
    test_url: "https://chat.openai.com",
    sort_order: 0,
    is_active: true,
  });

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p>Please log in to access admin panel.</p>
        <Button onClick={() => navigate("/login")} className="mt-4">
          Go to Login
        </Button>
      </div>
    );
  }

  const handleOpen = (prompt?: DemoPrompt) => {
    if (prompt) {
      setEditingPrompt(prompt);
      setForm({
        title: prompt.title,
        prompt: prompt.prompt,
        category: prompt.category,
        image_url: prompt.image_url || "",
        test_url: prompt.test_url,
        sort_order: prompt.sort_order,
        is_active: prompt.is_active,
      });
    } else {
      setEditingPrompt(null);
      setForm({
        title: "",
        prompt: "",
        category: "Email",
        image_url: "",
        test_url: "https://chat.openai.com",
        sort_order: (prompts?.length || 0) + 1,
        is_active: true,
      });
    }
    setIsOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `demo-${Date.now()}-${file.name}`;
      const { data: uploadData, error } = await dataSupabase.storage
        .from("editor-content")
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = dataSupabase.storage
        .from("editor-content")
        .getPublicUrl(uploadData.path);

      setForm(prev => ({ ...prev, image_url: publicUrl }));
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.prompt) return;

    setSaving(true);
    try {
      if (editingPrompt) {
        await dataSupabase
          .from("demo_prompts")
          .update({
            title: form.title,
            prompt: form.prompt,
            category: form.category,
            image_url: form.image_url || null,
            test_url: form.test_url,
            sort_order: form.sort_order,
            is_active: form.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingPrompt.id);
      } else {
        await dataSupabase.from("demo_prompts").insert({
          title: form.title,
          prompt: form.prompt,
          category: form.category,
          image_url: form.image_url || null,
          test_url: form.test_url,
          sort_order: form.sort_order,
          is_active: form.is_active,
        });
      }

      setIsOpen(false);
      refetch();
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this prompt?")) return;

    try {
      await dataSupabase.from("demo_prompts").delete().eq("id", id);
      refetch();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Demo Prompts</h1>
          <p className="text-muted-foreground">Manage demo page prompts</p>
        </div>
        <Button onClick={() => handleOpen()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Prompt
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Order</th>
                <th className="text-left p-3 text-sm font-medium">Title</th>
                <th className="text-left p-3 text-sm font-medium">Category</th>
                <th className="text-left p-3 text-sm font-medium">Image</th>
                <th className="text-left p-3 text-sm font-medium">Status</th>
                <th className="text-right p-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!prompts || prompts.length === 0) ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No prompts yet. Click "Add Prompt" to create one.
                  </td>
                </tr>
              ) : (
                prompts.map((prompt) => (
                  <tr key={prompt.id} className="border-t">
                    <td className="p-3">{prompt.sort_order}</td>
                    <td className="p-3 font-medium">{prompt.title}</td>
                    <td className="p-3">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {prompt.category}
                      </span>
                    </td>
                    <td className="p-3">
                      {prompt.image_url ? (
                        <img 
                          src={prompt.image_url} 
                          alt="" 
                          className="h-10 w-10 object-cover rounded"
                        />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        prompt.is_active 
                          ? "bg-green-500/10 text-green-500" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {prompt.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(prompt.test_url, "_blank")}
                          disabled={!prompt.test_url}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpen(prompt)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(prompt.id)}
                          className="text-red-500 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingPrompt ? "Edit Prompt" : "Add New Prompt"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Write Professional Email"
              />
            </div>

            <div>
              <Label>Category</Label>
              <select
                value={form.category}
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Prompt</Label>
              <Textarea
                value={form.prompt}
                onChange={(e) => setForm(prev => ({ ...prev, prompt: e.target.value }))}
                placeholder="Write your prompt here..."
                rows={4}
              />
            </div>

            <div>
              <Label>Image (Optional)</Label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer hover:bg-muted/50">
                  <Image className="h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {form.image_url && (
                  <img 
                    src={form.image_url} 
                    alt="" 
                    className="h-10 w-10 object-cover rounded"
                  />
                )}
              </div>
            </div>

            <div>
              <Label>Test URL</Label>
              <Input
                value={form.test_url}
                onChange={(e) => setForm(prev => ({ ...prev, test_url: e.target.value }))}
                placeholder="https://chat.openai.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="h-4 w-4"
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                  Active
                </Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving || !form.title || !form.prompt}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
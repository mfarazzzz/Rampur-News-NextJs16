import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploader from './ImageUploader';
import { toast } from 'sonner';

interface ContentEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: string;
  data: Record<string, any> | null;
  onSave: (data: Record<string, any>) => Promise<void>;
}

const ContentEditDialog = ({ 
  open, 
  onOpenChange, 
  type, 
  data, 
  onSave 
}: ContentEditDialogProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  useEffect(() => {
    if (data) {
      setFormData({ ...data });
    } else {
      setFormData({});
    }
  }, [data]);
  
  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      toast.success(data ? 'सफलतापूर्वक अपडेट किया गया' : 'सफलतापूर्वक जोड़ा गया');
      onOpenChange(false);
    } catch {
      toast.error('त्रुटि हुई');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderFormFields = () => {
    switch (type) {
      case 'education-news':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="basic">मूल जानकारी</TabsTrigger>
              <TabsTrigger value="content">सामग्री</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="settings">सेटिंग्स</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>शीर्षक (हिंदी) *</Label>
                  <Input 
                    value={formData.titleHindi || ''} 
                    onChange={(e) => updateField('titleHindi', e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title (English) *</Label>
                  <Input 
                    value={formData.title || ''} 
                    onChange={(e) => updateField('title', e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>श्रेणी *</Label>
                  <Select value={formData.category || ''} onValueChange={(v) => updateField('category', v)}>
                    <SelectTrigger><SelectValue placeholder="चुनें" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="board-news">बोर्ड समाचार</SelectItem>
                      <SelectItem value="exam-news">परीक्षा समाचार</SelectItem>
                      <SelectItem value="result-news">परिणाम समाचार</SelectItem>
                      <SelectItem value="admission-news">प्रवेश समाचार</SelectItem>
                      <SelectItem value="scholarship">छात्रवृत्ति</SelectItem>
                      <SelectItem value="government-order">सरकारी आदेश</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>स्रोत</Label>
                  <Input 
                    value={formData.source || ''} 
                    onChange={(e) => updateField('source', e.target.value)} 
                  />
                </div>
              </div>
              
              <ImageUploader
                value={formData.image}
                onChange={(v) => updateField('image', v)}
                label="फीचर इमेज"
              />
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <Label>सारांश (हिंदी) *</Label>
                <Textarea 
                  value={formData.excerptHindi || ''} 
                  onChange={(e) => updateField('excerptHindi', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Excerpt (English)</Label>
                <Textarea 
                  value={formData.excerpt || ''} 
                  onChange={(e) => updateField('excerpt', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>मुख्य सामग्री (हिंदी) *</Label>
                <Textarea 
                  value={formData.contentHindi || ''} 
                  onChange={(e) => updateField('contentHindi', e.target.value)}
                  rows={8}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Content (English)</Label>
                <Textarea 
                  value={formData.content || ''} 
                  onChange={(e) => updateField('content', e.target.value)}
                  rows={8}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-4">
              <div className="space-y-2">
                <Label>SEO Title</Label>
                <Input 
                  value={formData.seoTitle || ''} 
                  onChange={(e) => updateField('seoTitle', e.target.value)} 
                  placeholder="60 अक्षरों से कम"
                />
              </div>
              
              <div className="space-y-2">
                <Label>SEO Description</Label>
                <Textarea 
                  value={formData.seoDescription || ''} 
                  onChange={(e) => updateField('seoDescription', e.target.value)}
                  placeholder="160 अक्षरों से कम"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tags (कॉमा से अलग)</Label>
                <Input 
                  value={formData.tags?.join(', ') || ''} 
                  onChange={(e) => updateField('tags', e.target.value.split(',').map(t => t.trim()))} 
                  placeholder="परीक्षा, बोर्ड, CBSE"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>ब्रेकिंग न्यूज़</Label>
                  <p className="text-sm text-muted-foreground">टिकर में दिखाएं</p>
                </div>
                <Switch 
                  checked={formData.isBreaking || false}
                  onCheckedChange={(v) => updateField('isBreaking', v)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>महत्वपूर्ण</Label>
                  <p className="text-sm text-muted-foreground">हाइलाइट करें</p>
                </div>
                <Switch 
                  checked={formData.isImportant || false}
                  onCheckedChange={(v) => updateField('isImportant', v)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>फीचर्ड</Label>
                  <p className="text-sm text-muted-foreground">होम पेज पर दिखाएं</p>
                </div>
                <Switch 
                  checked={formData.isFeatured || false}
                  onCheckedChange={(v) => updateField('isFeatured', v)}
                />
              </div>
              
              <div className="pt-4 border-t">
                <Label className="text-base font-semibold">ऑटो शेयर</Label>
                <p className="text-sm text-muted-foreground mb-3">प्रकाशन पर सोशल मीडिया पर शेयर करें</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={formData.autoShareWhatsapp || false}
                      onCheckedChange={(v) => updateField('autoShareWhatsapp', v)}
                    />
                    <Label>WhatsApp चैनल</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={formData.autoShareTelegram || false}
                      onCheckedChange={(v) => updateField('autoShareTelegram', v)}
                    />
                    <Label>Telegram चैनल</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={formData.autoShareFacebook || false}
                      onCheckedChange={(v) => updateField('autoShareFacebook', v)}
                    />
                    <Label>Facebook पेज</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        );
        
      default:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>नाम/शीर्षक (हिंदी)</Label>
                <Input 
                  value={formData.nameHindi || formData.titleHindi || ''} 
                  onChange={(e) => updateField(formData.titleHindi !== undefined ? 'titleHindi' : 'nameHindi', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Name/Title (English)</Label>
                <Input 
                  value={formData.name || formData.title || ''} 
                  onChange={(e) => updateField(formData.title !== undefined ? 'title' : 'name', e.target.value)} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>विवरण (हिंदी)</Label>
              <Textarea 
                value={formData.descriptionHindi || ''} 
                onChange={(e) => updateField('descriptionHindi', e.target.value)}
                rows={4}
              />
            </div>
            
            <ImageUploader
              value={formData.image}
              onChange={(v) => updateField('image', v)}
              label="मुख्य इमेज"
            />
            
            <ImageUploader
              value={formData.gallery}
              onChange={(v) => updateField('gallery', v)}
              label="गैलरी इमेज"
              multiple
              maxImages={10}
            />
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={formData.isFeatured || false}
                  onCheckedChange={(v) => updateField('isFeatured', v)}
                />
                <Label>फीचर्ड</Label>
              </div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {data ? 'एडिट करें' : 'नया जोड़ें'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          {renderFormFields()}
          
          <div className="flex justify-end gap-2 pt-6 mt-6 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              रद्द करें
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'सेव हो रहा है...' : (data ? 'अपडेट करें' : 'जोड़ें')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContentEditDialog;

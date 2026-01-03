import { useState, useEffect } from 'react';
import { useCMSSettings, useUpdateSettings } from '@/hooks/useCMS';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Loader2, Globe, Share2, Mail, Database } from 'lucide-react';
import { toast } from 'sonner';
import type { CMSSettings } from '@/services/cms';

const SettingsPage = () => {
  const { data: settings, isLoading } = useCMSSettings();
  const updateSettings = useUpdateSettings();
  
  const [formData, setFormData] = useState<Partial<CMSSettings>>({
    siteName: '',
    siteNameHindi: '',
    tagline: '',
    logo: '',
    favicon: '',
    socialLinks: {},
    contactEmail: '',
    contactPhone: '',
    address: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await updateSettings.mutateAsync(formData);
      toast.success('सेटिंग्स सहेजी गईं');
    } catch (error) {
      toast.error('सहेजने में त्रुटि');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSocialLink = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">सेटिंग्स</h1>
          <p className="text-muted-foreground">साइट कॉन्फ़िगरेशन और वरीयताएँ</p>
        </div>
        <Button onClick={handleSubmit} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          सहेजें
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Globe className="w-4 h-4" />
            सामान्य
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Share2 className="w-4 h-4" />
            सोशल मीडिया
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <Mail className="w-4 h-4" />
            संपर्क
          </TabsTrigger>
          <TabsTrigger value="cms" className="gap-2">
            <Database className="w-4 h-4" />
            CMS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>साइट जानकारी</CardTitle>
              <CardDescription>
                आपकी वेबसाइट की मूलभूत जानकारी
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name (English)</Label>
                  <Input
                    id="siteName"
                    value={formData.siteName}
                    onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
                    placeholder="Rampur News"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteNameHindi">साइट का नाम (हिंदी)</Label>
                  <Input
                    id="siteNameHindi"
                    value={formData.siteNameHindi}
                    onChange={(e) => setFormData(prev => ({ ...prev, siteNameHindi: e.target.value }))}
                    placeholder="रामपुर न्यूज़"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">टैगलाइन</Label>
                <Textarea
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                  placeholder="रामपुर की सबसे विश्वसनीय हिंदी समाचार वेबसाइट"
                  rows={2}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">लोगो URL</Label>
                  <Input
                    id="logo"
                    value={formData.logo}
                    onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <Input
                    id="favicon"
                    value={formData.favicon}
                    onChange={(e) => setFormData(prev => ({ ...prev, favicon: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>सोशल मीडिया लिंक</CardTitle>
              <CardDescription>
                अपने सोशल मीडिया प्रोफाइल जोड़ें
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={formData.socialLinks?.facebook || ''}
                    onChange={(e) => updateSocialLink('facebook', e.target.value)}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter / X</Label>
                  <Input
                    id="twitter"
                    value={formData.socialLinks?.twitter || ''}
                    onChange={(e) => updateSocialLink('twitter', e.target.value)}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={formData.socialLinks?.youtube || ''}
                    onChange={(e) => updateSocialLink('youtube', e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.socialLinks?.instagram || ''}
                    onChange={(e) => updateSocialLink('instagram', e.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={formData.socialLinks?.whatsapp || ''}
                    onChange={(e) => updateSocialLink('whatsapp', e.target.value)}
                    placeholder="+91..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>संपर्क जानकारी</CardTitle>
              <CardDescription>
                संपर्क विवरण जो साइट पर दिखाए जाएंगे
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">ईमेल</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="contact@rampurnews.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">फोन</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">पता</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="कार्यालय का पता..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cms">
          <Card>
            <CardHeader>
              <CardTitle>CMS कॉन्फ़िगरेशन</CardTitle>
              <CardDescription>
                बाहरी CMS से कनेक्ट करने के लिए सेटिंग्स
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">वर्तमान प्रदाता: Mock (Demo)</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  यह डेमो मोड है। डेटा localStorage में सहेजा जाता है।
                </p>
                <div className="grid gap-2 text-sm">
                  <p className="font-medium">उपलब्ध प्रदाता:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>WordPress REST API</li>
                    <li>Strapi</li>
                    <li>Sanity</li>
                    <li>Custom API</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                बाहरी CMS से कनेक्ट करने के लिए, <code className="bg-muted px-1 rounded">src/services/cms/index.ts</code> में 
                <code className="bg-muted px-1 rounded">configureCMS()</code> फ़ंक्शन का उपयोग करें।
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

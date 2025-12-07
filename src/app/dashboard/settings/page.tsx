'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SiteSettings } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    id: 'general', // We uses a single document with ID 'general'
    privacy_policy_ar: '',
    terms_conditions_ar: '',
    about_us_ar: '',
    contact_email: '',
    contact_phone: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'general');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings({
          id: 'general',
          privacy_policy_ar: data.privacy_policy_ar || '',
          terms_conditions_ar: data.terms_conditions_ar || '',
          about_us_ar: data.about_us_ar || '',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('فشل تحميل الإعدادات');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'general'), {
        ...settings,
        last_updated: serverTimestamp(),
      });
      toast.success('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('فشل حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">إعدادات الموقع</h1>
        <p className="text-gray-600 mt-1">إدارة النصوص والمحتوى الثابت للموقع</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="privacy">الخصوصية</TabsTrigger>
          <TabsTrigger value="terms">الشروط</TabsTrigger>
          <TabsTrigger value="about">من نحن</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>بيانات التواصل</CardTitle>
              <CardDescription>
                معلومات التواصل التي تظهر في تذييل الموقع (Footer).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني للدعم</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => setSettings(prev => ({ ...prev, contact_email: e.target.value }))}
                  placeholder="support@example.com"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف (اختياري)</Label>
                <Input
                  id="phone"
                  value={settings.contact_phone}
                  onChange={(e) => setSettings(prev => ({ ...prev, contact_phone: e.target.value }))}
                  placeholder="+966..."
                  dir="ltr"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Policy */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>سياسة الخصوصية</CardTitle>
              <CardDescription>
                النص الكامل لسياسة الخصوصية. يمكنك استخدام تنسيق بسيط.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={settings.privacy_policy_ar}
                onChange={(e) => setSettings(prev => ({ ...prev, privacy_policy_ar: e.target.value }))}
                rows={15}
                placeholder="اكتب سياسة الخصوصية هنا..."
                className="font-sans"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Terms & Conditions */}
        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <CardTitle>الشروط والأحكام</CardTitle>
              <CardDescription>
                النص الكامل للشروط والأحكام.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={settings.terms_conditions_ar}
                onChange={(e) => setSettings(prev => ({ ...prev, terms_conditions_ar: e.target.value }))}
                rows={15}
                placeholder="اكتب الشروط والأحكام هنا..."
                className="font-sans"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Us */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>من نحن</CardTitle>
              <CardDescription>
                النص التعريفي الذي يظهر في الصفحة الرئيسية وقسم من نحن.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={settings.about_us_ar}
                onChange={(e) => setSettings(prev => ({ ...prev, about_us_ar: e.target.value }))}
                rows={10}
                placeholder="نبذة عن التطبيق وفريق العمل..."
                className="font-sans"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-pink-600 hover:bg-pink-700 min-w-[150px]"
        >
          <Save className="ml-2 h-4 w-4" />
          {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
        </Button>
      </div>
    </div>
  );
}

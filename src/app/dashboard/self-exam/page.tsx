'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadToS3 } from '@/lib/aws';
import { SelfExamStep } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Upload, Image, Video } from 'lucide-react';
import { toast } from 'sonner';

export default function SelfExamPage() {
  const [steps, setSteps] = useState<SelfExamStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<SelfExamStep | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    step_number: 1,
    title_ar: '',
    description_ar: '',
    image_url: '',
    video_url: '',
  });

  useEffect(() => {
    fetchSteps();
  }, []);

  const fetchSteps = async () => {
    try {
      const q = query(collection(db, 'self_exam_steps'), orderBy('step_number', 'asc'));
      const snapshot = await getDocs(q);
      const stepsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SelfExamStep[];
      setSteps(stepsData);
    } catch (error) {
      console.error('Error fetching steps:', error);
      toast.error('فشل تحميل خطوات الفحص');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadToS3(file, 'self-exam');
      if (type === 'image') {
        setFormData(prev => ({ ...prev, image_url: result.url }));
      } else {
        setFormData(prev => ({ ...prev, video_url: result.url }));
      }
      toast.success('تم رفع الملف بنجاح');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('فشل رفع الملف');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        image_url: formData.image_url || undefined,
        video_url: formData.video_url || undefined,
      };

      if (editingStep) {
        await updateDoc(doc(db, 'self_exam_steps', editingStep.id), data);
        toast.success('تم تحديث الخطوة بنجاح');
      } else {
        await addDoc(collection(db, 'self_exam_steps'), data);
        toast.success('تم إضافة الخطوة بنجاح');
      }

      setDialogOpen(false);
      resetForm();
      fetchSteps();
    } catch (error) {
      console.error('Error saving step:', error);
      toast.error('فشل حفظ الخطوة');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخطوة؟')) return;

    try {
      await deleteDoc(doc(db, 'self_exam_steps', id));
      toast.success('تم حذف الخطوة بنجاح');
      fetchSteps();
    } catch (error) {
      console.error('Error deleting step:', error);
      toast.error('فشل حذف الخطوة');
    }
  };

  const openEditDialog = (step: SelfExamStep) => {
    setEditingStep(step);
    setFormData({
      step_number: step.step_number,
      title_ar: step.title_ar,
      description_ar: step.description_ar,
      image_url: step.image_url || '',
      video_url: step.video_url || '',
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingStep(null);
    const nextStepNumber = steps.length > 0 
      ? Math.max(...steps.map(s => s.step_number)) + 1 
      : 1;
    setFormData({
      step_number: nextStepNumber,
      title_ar: '',
      description_ar: '',
      image_url: '',
      video_url: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">خطوات الفحص الذاتي</h1>
          <p className="text-gray-600 mt-1">إدارة خطوات الفحص الذاتي للثدي</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Plus className="ml-2 h-4 w-4" />
              إضافة خطوة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStep ? 'تعديل خطوة' : 'إضافة خطوة جديدة'}</DialogTitle>
              <DialogDescription>
                {editingStep ? 'قم بتعديل بيانات الخطوة' : 'أدخل بيانات الخطوة الجديدة'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="step_number">رقم الخطوة</Label>
                <Input
                  id="step_number"
                  type="number"
                  min="1"
                  value={formData.step_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, step_number: parseInt(e.target.value) }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">عنوان الخطوة</Label>
                <Input
                  id="title"
                  value={formData.title_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">وصف الخطوة</Label>
                <Textarea
                  id="description"
                  value={formData.description_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">صورة توضيحية (اختياري)</Label>
                <div className="flex gap-2">
                  <Input
                    id="image"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://..."
                  />
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'image')}
                      className="hidden"
                      id="image-upload"
                      disabled={uploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      disabled={uploading}
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video">فيديو توضيحي (اختياري)</Label>
                <div className="flex gap-2">
                  <Input
                    id="video"
                    value={formData.video_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                    placeholder="https://..."
                  />
                  <div className="relative">
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, 'video')}
                      className="hidden"
                      id="video-upload"
                      disabled={uploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('video-upload')?.click()}
                      disabled={uploading}
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {uploading && <p className="text-sm text-gray-600">جاري الرفع...</p>}
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                  {editingStep ? 'حفظ التعديلات' : 'إضافة'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      ) : steps.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-600">لا توجد خطوات بعد</p>
          <Button 
            className="mt-4 bg-pink-600 hover:bg-pink-700"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="ml-2 h-4 w-4" />
            إضافة أول خطوة
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الرقم</TableHead>
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="text-right">الوسائط</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {steps.map((step) => (
                <TableRow key={step.id}>
                  <TableCell className="font-bold text-lg">{step.step_number}</TableCell>
                  <TableCell className="font-medium">{step.title_ar}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {step.image_url && <Image className="h-4 w-4 text-blue-600" />}
                      {step.video_url && <Video className="h-4 w-4 text-purple-600" />}
                      {!step.image_url && !step.video_url && <span className="text-gray-400">-</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(step)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(step.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

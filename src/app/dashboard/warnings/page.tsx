'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadToS3 } from '@/lib/aws';
import { WarningSign } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function WarningsPage() {
  const [warnings, setWarnings] = useState<WarningSign[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWarning, setEditingWarning] = useState<WarningSign | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title_ar: '',
    description_ar: '',
    category: 'normal' as 'normal' | 'abnormal',
    image_url: '',
  });

  useEffect(() => {
    fetchWarnings();
  }, []);

  const fetchWarnings = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'warning_signs'));
      const warningsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WarningSign[];
      setWarnings(warningsData);
    } catch (error) {
      console.error('Error fetching warnings:', error);
      toast.error('فشل تحميل العلامات التحذيرية');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadToS3(file, 'warnings');
      setFormData(prev => ({ ...prev, image_url: result.url }));
      toast.success('تم رفع الصورة بنجاح');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('فشل رفع الصورة');
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
      };

      if (editingWarning) {
        await updateDoc(doc(db, 'warning_signs', editingWarning.id), data);
        toast.success('تم تحديث العلامة بنجاح');
      } else {
        await addDoc(collection(db, 'warning_signs'), data);
        toast.success('تم إضافة العلامة بنجاح');
      }

      setDialogOpen(false);
      resetForm();
      fetchWarnings();
    } catch (error) {
      console.error('Error saving warning:', error);
      toast.error('فشل حفظ العلامة');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه العلامة؟')) return;

    try {
      await deleteDoc(doc(db, 'warning_signs', id));
      toast.success('تم حذف العلامة بنجاح');
      fetchWarnings();
    } catch (error) {
      console.error('Error deleting warning:', error);
      toast.error('فشل حذف العلامة');
    }
  };

  const openEditDialog = (warning: WarningSign) => {
    setEditingWarning(warning);
    setFormData({
      title_ar: warning.title_ar,
      description_ar: warning.description_ar,
      category: warning.category,
      image_url: warning.image_url || '',
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingWarning(null);
    setFormData({
      title_ar: '',
      description_ar: '',
      category: 'normal',
      image_url: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">العلامات التحذيرية</h1>
          <p className="text-gray-600 mt-1">إدارة العلامات الطبيعية والتحذيرية للثدي</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Plus className="ml-2 h-4 w-4" />
              إضافة علامة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingWarning ? 'تعديل علامة' : 'إضافة علامة جديدة'}</DialogTitle>
              <DialogDescription>
                {editingWarning ? 'قم بتعديل بيانات العلامة' : 'أدخل بيانات العلامة الجديدة'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">نوع العلامة</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: 'normal' | 'abnormal') => 
                    setFormData(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">علامة طبيعية</SelectItem>
                    <SelectItem value="abnormal">علامة تحذيرية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">عنوان العلامة</Label>
                <Input
                  id="title"
                  value={formData.title_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">وصف العلامة</Label>
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
                      onChange={handleFileUpload}
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
                      <Upload className="h-4 w-4" />
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
                  {editingWarning ? 'حفظ التعديلات' : 'إضافة'}
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
      ) : warnings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-600">لا توجد علامات بعد</p>
          <Button 
            className="mt-4 bg-pink-600 hover:bg-pink-700"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="ml-2 h-4 w-4" />
            إضافة أول علامة
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">صورة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warnings.map((warning) => (
                <TableRow key={warning.id}>
                  <TableCell className="font-medium">{warning.title_ar}</TableCell>
                  <TableCell>
                    <Badge variant={warning.category === 'abnormal' ? 'destructive' : 'default'}>
                      {warning.category === 'abnormal' ? 'تحذيرية' : 'طبيعية'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {warning.image_url ? (
                      <ImageIcon className="h-4 w-4 text-blue-600" />
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(warning)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(warning.id)}
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

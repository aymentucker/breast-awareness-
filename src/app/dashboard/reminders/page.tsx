'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ReminderTemplate } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Bell, BellOff } from 'lucide-react';
import { toast } from 'sonner';

export default function RemindersPage() {
  const [reminders, setReminders] = useState<ReminderTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<ReminderTemplate | null>(null);

  const [formData, setFormData] = useState({
    title_ar: '',
    message_ar: '',
    default_interval_days: 30,
    is_active: true,
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const q = query(collection(db, 'reminder_templates'), orderBy('title_ar', 'asc'));
      const snapshot = await getDocs(q);
      const remindersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ReminderTemplate[];
      setReminders(remindersData);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast.error('فشل تحميل قوالب التذكير');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingReminder) {
        await updateDoc(doc(db, 'reminder_templates', editingReminder.id), formData);
        toast.success('تم تحديث القالب بنجاح');
      } else {
        await addDoc(collection(db, 'reminder_templates'), formData);
        toast.success('تم إضافة القالب بنجاح');
      }

      setDialogOpen(false);
      resetForm();
      fetchReminders();
    } catch (error) {
      console.error('Error saving reminder:', error);
      toast.error('فشل حفظ القالب');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القالب؟')) return;

    try {
      await deleteDoc(doc(db, 'reminder_templates', id));
      toast.success('تم حذف القالب بنجاح');
      fetchReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast.error('فشل حذف القالب');
    }
  };

  const openEditDialog = (reminder: ReminderTemplate) => {
    setEditingReminder(reminder);
    setFormData({
      title_ar: reminder.title_ar,
      message_ar: reminder.message_ar,
      default_interval_days: reminder.default_interval_days,
      is_active: reminder.is_active,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingReminder(null);
    setFormData({
      title_ar: '',
      message_ar: '',
      default_interval_days: 30,
      is_active: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">قوالب التذكير</h1>
          <p className="text-gray-600 mt-1">إدارة قوالب التذكيرات للمستخدمين</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Plus className="ml-2 h-4 w-4" />
              إضافة قالب
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingReminder ? 'تعديل قالب' : 'إضافة قالب جديد'}</DialogTitle>
              <DialogDescription>
                {editingReminder ? 'قم بتعديل بيانات القالب' : 'أدخل بيانات القالب الجديد'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان التذكير</Label>
                <Input
                  id="title"
                  value={formData.title_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">نص التذكير</Label>
                <Textarea
                  id="message"
                  value={formData.message_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, message_ar: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interval">الفترة الزمنية (بالأيام)</Label>
                <Input
                  id="interval"
                  type="number"
                  min="1"
                  value={formData.default_interval_days}
                  onChange={(e) => setFormData(prev => ({ ...prev, default_interval_days: parseInt(e.target.value) }))}
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="active">تفعيل القالب</Label>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                  {editingReminder ? 'حفظ التعديلات' : 'إضافة'}
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
      ) : reminders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-600">لا توجد قوالب تذكير بعد</p>
          <Button 
            className="mt-4 bg-pink-600 hover:bg-pink-700"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="ml-2 h-4 w-4" />
            إضافة أول قالب
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="text-right">الفترة الزمنية</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reminders.map((reminder) => (
                <TableRow key={reminder.id}>
                  <TableCell className="font-medium">{reminder.title_ar}</TableCell>
                  <TableCell>كل {reminder.default_interval_days} يوم</TableCell>
                  <TableCell>
                    <Badge variant={reminder.is_active ? 'default' : 'secondary'}>
                      {reminder.is_active ? (
                        <><Bell className="ml-1 h-3 w-3" /> نشط</>
                      ) : (
                        <><BellOff className="ml-1 h-3 w-3" /> غير نشط</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(reminder)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(reminder.id)}
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

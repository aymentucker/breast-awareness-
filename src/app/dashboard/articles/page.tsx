'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadToS3 } from '@/lib/aws';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash, faEye, faEyeSlash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title_ar: '',
    body_ar: '',
    media_url: '',
    media_type: 'image' as 'image' | 'video',
    display_order: 0,
    is_published: true,
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const q = query(collection(db, 'articles'));
      const snapshot = await getDocs(q);
      const articlesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Article[];
      // Sort in memory
      articlesData.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      setArticles(articlesData);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('فشل تحميل المقالات');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadToS3(file, 'articles');
      setFormData(prev => ({ ...prev, media_url: result.url }));
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
      if (editingArticle) {
        // Update existing article
        await updateDoc(doc(db, 'articles', editingArticle.id), formData);
        toast.success('تم تحديث المقال بنجاح');
      } else {
        // Create new article
        await addDoc(collection(db, 'articles'), {
          ...formData,
          created_at: new Date(),
        });
        toast.success('تم إضافة المقال بنجاح');
      }

      setDialogOpen(false);
      resetForm();
      fetchArticles();
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('فشل حفظ المقال');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;

    try {
      await deleteDoc(doc(db, 'articles', id));
      toast.success('تم حذف المقال بنجاح');
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('فشل حذف المقال');
    }
  };

  const openEditDialog = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title_ar: article.title_ar,
      body_ar: article.body_ar,
      media_url: article.media_url || '',
      media_type: article.media_type,
      display_order: article.display_order || 0,
      is_published: article.is_published,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingArticle(null);
    const maxOrder = articles.length > 0 
      ? Math.max(...articles.map(a => a.display_order || 0))
      : 0;
    setFormData({
      title_ar: '',
      body_ar: '',
      media_url: '',
      media_type: 'image',
      display_order: maxOrder + 1,
      is_published: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">المقالات التوعوية</h1>
          <p className="text-gray-600 mt-1">إدارة المقالات والمحتوى التوعوي</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <FontAwesomeIcon icon={faPlus} className="ml-2 h-4 w-4" />
              إضافة مقال
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingArticle ? 'تعديل مقال' : 'إضافة مقال جديد'}</DialogTitle>
              <DialogDescription>
                {editingArticle ? 'قم بتعديل بيانات المقال' : 'أدخل بيانات المقال الجديد'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <div className="space-y-2 flex-grow">
                  <Label htmlFor="title">عنوان المقال</Label>
                  <Input
                    id="title"
                    value={formData.title_ar}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2 w-24">
                  <Label htmlFor="order">الترتيب</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">محتوى المقال</Label>
                <Textarea
                  id="body"
                  value={formData.body_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, body_ar: e.target.value }))}
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="media_type">نوع الوسيط</Label>
                <Select
                  value={formData.media_type}
                  onValueChange={(value: 'image' | 'video') => 
                    setFormData(prev => ({ ...prev, media_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">صورة</SelectItem>
                    <SelectItem value="video">فيديو</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="media">رابط الوسيط أو رفع ملف</Label>
                <div className="flex gap-2">
                  <Input
                    id="media"
                    value={formData.media_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, media_url: e.target.value }))}
                    placeholder="https://..."
                  />
                  <div className="relative">
                    <Input
                      type="file"
                      accept={formData.media_type === 'image' ? 'image/*' : 'video/*'}
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      disabled={uploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={uploading}
                    >
                      <FontAwesomeIcon icon={faUpload} className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {uploading && <p className="text-sm text-gray-600">جاري الرفع...</p>}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="published">نشر المقال</Label>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                  {editingArticle ? 'حفظ التعديلات' : 'إضافة'}
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
      ) : articles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-600">لا توجد مقالات بعد</p>
          <Button 
            className="mt-4 bg-pink-600 hover:bg-pink-700"
            onClick={() => setDialogOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="ml-2 h-4 w-4" />
            إضافة أول مقال
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الترتيب</TableHead>
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">نوع الوسيط</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>{article.display_order}</TableCell>
                  <TableCell className="font-medium">{article.title_ar}</TableCell>
                  <TableCell>
                    <Badge variant={article.is_published ? 'default' : 'secondary'}>
                      {article.is_published ? (
                        <><FontAwesomeIcon icon={faEye} className="ml-1 h-3 w-3" /> منشور</>
                      ) : (
                        <><FontAwesomeIcon icon={faEyeSlash} className="ml-1 h-3 w-3" /> مسودة</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>{article.media_type === 'image' ? 'صورة' : 'فيديو'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                       <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(article)}
                      >
                        <FontAwesomeIcon icon={faPen} className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(article.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
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

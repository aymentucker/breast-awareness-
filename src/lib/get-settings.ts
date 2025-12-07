import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SiteSettings } from '@/types';

export async function getSettings() {
  try {
    const docRef = doc(db, 'settings', 'general');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as SiteSettings;
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
  }
  return null;
}

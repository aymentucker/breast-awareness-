import { Timestamp } from 'firebase/firestore';

export interface Article {
  id: string;
  section_id?: number;
  title_ar: string;
  body_ar: string;
  media_url?: string;
  media_type: 'image' | 'video';
  is_published: boolean;
  display_order: number;
  created_at?: Timestamp | Date;
}

export interface ReminderTemplate {
  id: string;
  title_ar: string;
  message_ar: string;
  default_interval_days: number;
  is_active: boolean;
}

export interface ScreeningSchedule {
  id: string;
  gender: 'female' | 'male';
  exam_type: 'self' | 'clinical' | 'mammogram';
  start_age: number;
  frequency_text_ar: string;
  notes_ar?: string;
}

export interface SelfExamStep {
  id: string;
  step_number: number;
  title_ar: string;
  description_ar: string;
  image_url?: string;
  video_url?: string;
}

export interface WarningSign {
  id: string;
  title_ar: string;
  description_ar: string;
  category: 'normal' | 'abnormal';
  image_url?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'student';
  display_name?: string;
  created_at?: Timestamp | Date;
}

export interface SiteSettings {
  id: string;
  privacy_policy_ar: string;
  terms_conditions_ar: string;
  about_us_ar: string;
  contact_email: string;
  contact_phone: string;
  last_updated?: Timestamp | Date;
}

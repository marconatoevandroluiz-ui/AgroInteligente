
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nmpqdpvdyqzludnwakwy.supabase.co';
const supabaseKey = 'sb_publishable_gJpK4va9dUl6WpyoigtedQ_STgE0f0l';

export const supabase = createClient(supabaseUrl, supabaseKey);

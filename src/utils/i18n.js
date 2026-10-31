/**
 * i18n — Bilingual String Manager (Persian + English)
 *
 * Provides a simple key-based translation system with RTL/LTR direction support.
 * All strings are hardcoded mock data — no external translation API.
 */

export const LOCALES = {
  FA: 'fa',
  EN: 'en',
};

const DIRECTIONS = {
  [LOCALES.FA]: 'rtl',
  [LOCALES.EN]: 'ltr',
};

const STRINGS = {
  [LOCALES.FA]: {
    // Common
    app_name: 'آرنا iOS ۲۷',
    save: 'ذخیره',
    cancel: 'لغو',
    delete: 'حذف',
    edit: 'ویرایش',
    add: 'افزودن',
    search: 'جستجو...',
    loading: 'در حال بارگذاری...',
    no_data: 'داده‌ای یافت نشد.',
    back: 'بازگشت',
    close: 'بستن',
    ok: 'تایید',
    yes: 'بله',
    no: 'خیر',

    // Navigation
    nav_dashboard: 'داشبورد',
    nav_blog: 'وبلاگ',
    nav_users: 'کاربران',
    nav_files: 'فایل‌ها',
    nav_settings: 'تنظیمات',
    nav_agents: 'آğaent‌ها',

    // Dashboard
    dashboard_title: 'داشبورد',
    dashboard_welcome: 'خوش آمدید به پنل مدیریت',
    dashboard_stats_users: 'کاربران فعال',
    dashboard_stats_posts: 'مطالب منتشر شده',
    dashboard_stats_files: 'فایل‌های ذخیره‌شده',
    dashboard_stats_agents: 'آ агенت‌های فعال',
    dashboard_quick_actions: 'دستورات سریع',
    dashboard_new_post: 'مطلب جدید',
    dashboard_new_user: 'کاربر جدید',
    dashboard_new_folder: 'پوشه جدید',
    dashboard_new_agent: 'محادثه جدید',
    dashboard_recent_activity: 'فعالیت‌های اخیر',
    dashboard_activity_no_items: 'هنوز فعالیت‌ای ثبت نشده است.',

    // Blog
    blog_title: 'مدیریت وبلاگ',
    blog_posts: 'مطالب',
    blog_create_post: 'ایجاد مطلب جدید',
    blog_edit_post: 'ویرایش مطلب',
    blog_delete_confirm: 'آیا از حذف این مطلب اطمینان دارید؟',
    blog_deleted: 'مطلب با موفقیت حذف شد.',
    blog_saved: 'مطلب با موفقیت ذخیره شد.',
    blog_title_label: 'عنوان',
    blog_content_label: 'محتوای مطلب',
    blog_author_label: 'نویسنده',
    blog_category_label: 'دسته‌بندی',
    blog_status_label: 'وضعیت',
    blog_status_draft: 'پیش‌نویس',
    blog_status_published: 'منتشر شده',
    blog_search_placeholder: 'جستجو در مطالب...',
    blog_filter_all: 'همه',
    blog_filter_draft: 'پیش‌نویس',
    blog_filter_published: 'منتشر شده',
    blog_no_posts: 'هیچ مطلبی یافت نشد.',
    blog_editor_toolbar_bold: 'فیلفه',
    blog_editor_toolbar_italic: 'میلی',
    blog_editor_toolbar_underline: 'زیرخط',
    blog_editor_toolbar_heading: 'سرنویس',
    blog_editor_toolbar_list_ul: 'لیست đánhли',
    blog_editor_toolbar_list_ol: 'لیست شماره‌ای',
    blog_editor_toolbar_color: 'رنگ فونت',
    blog_editor_toolbar_size: 'اندازه فونت',
    blog_editor_upload: 'آپلود فایل چندرسانه‌ای',
    blog_editor_ai_assistant: 'دستیار نویسندگی',

    // Users & RBAC
    users_title: 'مدیریت کاربران',
    users_add_user: 'افزودن کاربر',
    users_edit_user: 'ویرایش کاربر',
    users_delete_confirm: 'آیا از حذف این کاربر اطمینان دارید؟',
    users_deleted: 'کاربر با موفقیت حذف شد.',
    users_saved: 'کاربر با موفقیت ذخیره شد.',
    users_first_name: 'نام',
    users_last_name: 'نام خانوادگی',
    users_username: 'نام کاربری',
    users_role: 'نقش',
    users_password: 'رمز عبور',
    users_status: 'وضعیت',
    users_status_active: 'فعال',
    users_status_inactive: 'غیرفعال',
    users_no_users: 'هیچ کاربری یافت نشد.',
    users_rbac_title: 'مدیریت نقش‌ها و دسترسی‌ها',
    users_rbac_role: 'نقش',
    users_rbac_permissions: 'دسترسی‌ها',
    users_rbac_delete_role_warning:
      'این نقش به یک یا nhiều کاربر وابسته است. قبل از حذف نقش، لطفاً کاربران را به نقشی دیگر منتقل کنید.',
    users_rbac_delete_confirm: 'آیا مطمئن هستید که می‌خواهید این نقش را حذف کنید؟',

    // Files
    files_title: 'مدیریت فایل',
    files_buckets: 'سالهای ذخیره‌سازی (Buckets)',
    files_add_bucket: 'افزودن باکت',
    files_delete_bucket: 'حذف باکت',
    files_bucket_empty: 'این باکت خالی است.',
    files_upload: 'آپلود فایل',
    files_download: 'دانلود',
    files_delete_file: 'حذف فایل',
    files_preview: 'پیش‌نمایش',
    files_no_buckets: 'هیچ باکت-effective ای_find_add-addadd_add_add.',
    files_connected: 'متصل',
    files_disconnected: 'قطع شده',

    // Settings
    settings_title: 'تنظیمات',
    settings_profile: 'پروفایل',
    settings_profile_name: 'نام و نام خانوادگی',
    settings_profile_email: 'ایمیل',
    settings_profile_avatar: 'تصویر پروفایل',
    settings_theme: 'ظاهر / نام',
    settings_theme_label: 'پوسته',
    settings_theme_light: 'روشن',
    settings_theme_dark: 'تاریک',
    settings_theme_auto: 'خودکار',
    settings_glass: 'تنظیمات شیشه‌ای',
    settings_glass_blur: 'میزان blur شیشه',
    settings_glass_tint: 'رنگ شیشه',
    settings_about: 'درباره برنامه',
    settings_version: 'نسخه',
    settings_language: 'زبان',

    // Agents
    agents_title: 'آгенت‌ها',
    agents_new_chat: 'محادثه جدید',
    agents_select_agent: 'یک آ겐ت را انتخاب کنید',
    agents_no_agents: 'هیچ آ겐ت-effective ای_find_add-addadd_add_add.',
    agents_chat_title: 'محادثه با',
    agents_message_placeholder: 'پیام خود را بنویسید...',
    agents_send: 'ارسال',

    // Notifications
    toast_saved: 'با موفقیت ذخیره شد.',
    toast_deleted: 'با موفقیت حذف شد.',
    toast_error: 'خطایی رخ داد.',
    toast_copied: 'در پClipboard کپی شد.',
  },

  [LOCALES.EN]: {
    // Common
    app_name: 'Arena iOS 27',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search...',
    loading: 'Loading...',
    no_data: 'No data found.',
    back: 'Back',
    close: 'Close',
    ok: 'OK',
    yes: 'Yes',
    no: 'No',

    // Navigation
    nav_dashboard: 'Dashboard',
    nav_blog: 'Blog',
    nav_users: 'Users',
    nav_files: 'Files',
    nav_settings: 'Settings',
    nav_agents: 'Agents',

    // Dashboard
    dashboard_title: 'Dashboard',
    dashboard_welcome: 'Welcome to the management panel',
    dashboard_stats_users: 'Active Users',
    dashboard_stats_posts: 'Published Posts',
    dashboard_stats_files: 'Stored Files',
    dashboard_stats_agents: 'Active Agents',
    dashboard_quick_actions: 'Quick Actions',
    dashboard_new_post: 'New Post',
    dashboard_new_user: 'New User',
    dashboard_new_folder: 'New Folder',
    dashboard_new_agent: 'New Conversation',
    dashboard_recent_activity: 'Recent Activity',
    dashboard_activity_no_items: 'No recent activity recorded.',

    // Blog
    blog_title: 'Blog Management',
    blog_posts: 'Posts',
    blog_create_post: 'Create New Post',
    blog_edit_post: 'Edit Post',
    blog_delete_confirm: 'Are you sure you want to delete this post?',
    blog_deleted: 'Post deleted successfully.',
    blog_saved: 'Post saved successfully.',
    blog_title_label: 'Title',
    blog_content_label: 'Content',
    blog_author_label: 'Author',
    blog_category_label: 'Category',
    blog_status_label: 'Status',
    blog_status_draft: 'Draft',
    blog_status_published: 'Published',
    blog_search_placeholder: 'Search posts...',
    blog_filter_all: 'All',
    blog_filter_draft: 'Draft',
    blog_filter_published: 'Published',
    blog_no_posts: 'No posts found.',
    blog_editor_toolbar_bold: 'Bold',
    blog_editor_toolbar_italic: 'Italic',
    blog_editor_toolbar_underline: 'Underline',
    blog_editor_toolbar_heading: 'Heading',
    blog_editor_toolbar_list_ul: 'Bullet List',
    blog_editor_toolbar_list_ol: 'Numbered List',
    blog_editor_toolbar_color: 'Font Color',
    blog_editor_toolbar_size: 'Font Size',
    blog_editor_upload: 'Upload Media',
    blog_editor_ai_assistant: 'Writing Assistant',

    // Users & RBAC
    users_title: 'Users & RBAC',
    users_add_user: 'Add User',
    users_edit_user: 'Edit User',
    users_delete_confirm: 'Are you sure you want to delete this user?',
    users_deleted: 'User deleted successfully.',
    users_saved: 'User saved successfully.',
    users_first_name: 'First Name',
    users_last_name: 'Last Name',
    users_username: 'Username',
    users_role: 'Role',
    users_password: 'Password',
    users_status: 'Status',
    users_status_active: 'Active',
    users_status_inactive: 'Inactive',
    users_no_users: 'No users found.',
    users_rbac_title: 'Role & Permission Management',
    users_rbac_role: 'Role',
    users_rbac_permissions: 'Permissions',
    users_rbac_delete_role_warning:
      'This role is assigned to one or more users. Please reassign users before deleting the role.',
    users_rbac_delete_confirm: 'Are you sure you want to delete this role?',

    // Files
    files_title: 'File Management',
    files_buckets: 'S3 Buckets',
    files_add_bucket: 'Add Bucket',
    files_delete_bucket: 'Delete Bucket',
    files_bucket_empty: 'This bucket is empty.',
    files_upload: 'Upload File',
    files_download: 'Download',
    files_delete_file: 'Delete File',
    files_preview: 'Preview',
    files_no_buckets: 'No buckets connected.',
    files_connected: 'Connected',
    files_disconnected: 'Disconnected',

    // Settings
    settings_title: 'Settings',
    settings_profile: 'Profile',
    settings_profile_name: 'Full Name',
    settings_profile_email: 'Email',
    settings_profile_avatar: 'Profile Picture',
    settings_theme: 'Appearance',
    settings_theme_label: 'Theme',
    settings_theme_light: 'Light',
    settings_theme_dark: 'Dark',
    settings_theme_auto: 'Auto',
    settings_glass: 'Glass Settings',
    settings_glass_blur: 'Glass Blur',
    settings_glass_tint: 'Glass Tint',
    settings_about: 'About',
    settings_version: 'Version',
    settings_language: 'Language',

    // Agents
    agents_title: 'Agents',
    agents_new_chat: 'New Chat',
    agents_select_agent: 'Select an agent',
    agents_no_agents: 'No agents available.',
    agents_chat_title: 'Chat with',
    agents_message_placeholder: 'Type a message...',
    agents_send: 'Send',

    // Notifications
    toast_saved: 'Saved successfully.',
    toast_deleted: 'Deleted successfully.',
    toast_error: 'An error occurred.',
    toast_copied: 'Copied to clipboard.',
  },
};

/**
 * i18n instance — singleton translation manager
 */
export class I18n {
  constructor() {
    this._locale = LOCALES.FA;
    this._callbacks = new Set();
  }

  /** Current locale code ('fa' | 'en') */
  get locale() {
    return this._locale;
  }

  /** Current text direction ('rtl' | 'ltr') */
  get direction() {
    return DIRECTIONS[this._locale];
  }

  /** Set locale and notify subscribers */
  setLocale(locale) {
    if (!Object.values(LOCALES).includes(locale)) {
      console.warn(`[i18n] Unsupported locale: ${locale}`);
      return;
    }
    this._locale = locale;
    document.documentElement.lang = locale;
    document.documentElement.dir = this.direction;
    this._notify();
  }

  /** Translate a key to current locale */
  t(key, fallback = null) {
    const strings = STRINGS[this._locale];
    return strings && strings[key] !== undefined
      ? strings[key]
      : fallback || key;
  }

  /** Subscribe to locale changes */
  onChange(callback) {
    this._callbacks.add(callback);
    return () => this._callbacks.delete(callback);
  }

  _notify() {
    this._callbacks.forEach((cb) => cb(this._locale));
  }
}

export const i18n = new I18n();

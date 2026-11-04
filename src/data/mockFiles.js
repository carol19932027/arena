/**
 * Mock Data — File Explorer (S3 Buckets)
 * All data is client-side mock data. No backend or API calls.
 */

export const buckets = [
  {
    id: '1',
    name: 'personal-photos',
    displayName: 'تصاویر شخصی',
    displayNameEn: 'Personal Photos',
    fileCount: 142,
    size: '12.4 GB',
    status: 'connected',
    region: 'us-east-1',
  },
  {
    id: '2',
    name: 'work-documents',
    displayName: 'مستندات کاری',
    displayNameEn: 'Work Documents',
    fileCount: 89,
    size: '3.2 GB',
    status: 'connected',
    region: 'eu-west-1',
  },
  {
    id: '3',
    name: 'archive-backup',
    displayName: 'بک‌اپ بایگانی',
    displayNameEn: 'Archive Backup',
    fileCount: 567,
    size: '45.1 GB',
    status: 'connected',
    region: 'ap-southeast-1',
  },
  {
    id: '4',
    name: 'media-library',
    displayName: 'کتابخانه رسانه‌ای',
    displayNameEn: 'Media Library',
    fileCount: 23,
    size: '2.1 GB',
    status: 'disconnected',
    region: 'us-west-2',
  },
];

export const files = {
  '1': [
    {
      id: 'f1',
      name: 'vacation-2026.jpg',
      type: 'image',
      size: '2.4 MB',
      modified: '2026-10-20',
      icon: '🖼️',
    },
    {
      id: 'f2',
      name: 'family-dinner.png',
      type: 'image',
      size: '1.8 MB',
      modified: '2026-10-18',
      icon: '🖼️',
    },
    {
      id: 'f3',
      name: 'mountain-trip.mp4',
      type: 'video',
      size: '45.2 MB',
      modified: '2026-10-15',
      icon: '🎬',
    },
  ],
  '2': [
    {
      id: 'f4',
      name: 'project-proposal.pdf',
      type: 'document',
      size: '1.2 MB',
      modified: '2026-10-22',
      icon: '📄',
    },
    {
      id: 'f5',
      name: 'budget-spreadsheet.xlsx',
      type: 'spreadsheet',
      size: '856 KB',
      modified: '2026-10-21',
      icon: '📊',
    },
  ],
  '3': [
    {
      id: 'f6',
      name: 'backup-2026-01.tar.gz',
      type: 'archive',
      size: '12.4 GB',
      modified: '2026-01-15',
      icon: '🗄️',
    },
    {
      id: 'f7',
      name: 'backup-2026-02.tar.gz',
      type: 'archive',
      size: '11.8 GB',
      modified: '2026-02-15',
      icon: '🗄️',
    },
  ],
  '4': [],
};

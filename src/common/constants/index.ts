export const QueueName = {
  DOCUMENT_QUEUE: 'DOCUMENT_QUEUE',
  EMAIL_QUEUE: 'EMAIL_QUEUE',
  NOTIFICATION_QUEUE: 'NOTIFICATION_QUEUE',
} as const;

export const ALLOWED_FILE_TYPES = [
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

  // Text
  'text/plain',
  'text/markdown',

  // Presentation
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',

  // Spreadsheet
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
];

export const FILE_TYPES = {
  PDF: 'application/pdf',

  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

  TXT: 'text/plain',
  MARKDOWN: 'text/markdown',

  PPT: 'application/vnd.ms-powerpoint',
  PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

  XLS: 'application/vnd.ms-excel',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

  CSV: 'text/csv',
} as const;

export const ALLOWED_MIME_TYPES = [
  FILE_TYPES.PDF,

  FILE_TYPES.DOC,
  FILE_TYPES.DOCX,

  FILE_TYPES.TXT,
  FILE_TYPES.MARKDOWN,

  FILE_TYPES.PPT,
  FILE_TYPES.PPTX,

  FILE_TYPES.XLS,
  FILE_TYPES.XLSX,
  FILE_TYPES.CSV,
];

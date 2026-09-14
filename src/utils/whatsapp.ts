export const FUTURE_MINDS_PHONE = '9618283987';
export const WHATSAPP_COUNTRY_CODE = '91'; // India
export const WHATSAPP_FULL_NUMBER = `${WHATSAPP_COUNTRY_CODE}${FUTURE_MINDS_PHONE}`;

export const DEFAULT_WHATSAPP_MESSAGE = 
  'Hi Future Minds, I would like to inquire about Robotics, AI & Coding admissions for school students (Grades 1–10) at your Ananth Nagar campus. Please share program details and demo availability.';

/**
 * Creates a direct WhatsApp click-to-chat URL
 */
export function getWhatsAppDirectUrl(customMessage?: string): string {
  const message = customMessage || DEFAULT_WHATSAPP_MESSAGE;
  return `https://wa.me/${WHATSAPP_FULL_NUMBER}?text=${encodeURIComponent(message)}`;
}

export interface EnrollmentInquiryDetails {
  parentName: string;
  parentPhone?: string;
  studentName?: string;
  studentGradeOrAge?: string;
  studentAge?: string | number;
  courseInterest?: string;
  preferredSlot?: string;
  preferredMode?: string;
  notes?: string;
}

/**
 * Creates a WhatsApp URL with comprehensive enrollment details
 */
export function getEnrollmentWhatsAppUrl(details: EnrollmentInquiryDetails): string {
  const lines: string[] = [
    '🚀 *FUTURE MINDS — NEW ENROLLMENT & DEMO ENQUIRY*',
    '',
    `👤 *Parent Name:* ${details.parentName?.trim() || 'Parent'}`,
  ];

  if (details.parentPhone && details.parentPhone.trim()) {
    lines.push(`📞 *Contact Number:* ${details.parentPhone.trim()}`);
  }

  if (details.studentName && details.studentName.trim()) {
    lines.push(`👦 *Student Name:* ${details.studentName.trim()}`);
  }

  const gradeOrAge = details.studentGradeOrAge?.trim() || (details.studentAge ? `${details.studentAge} years` : '');
  if (gradeOrAge) {
    lines.push(`🎓 *Grade / Age:* ${gradeOrAge}`);
  }

  if (details.courseInterest && details.courseInterest.trim()) {
    lines.push(`🔬 *Program Track:* ${details.courseInterest.trim()}`);
  }

  if (details.preferredSlot && details.preferredSlot.trim()) {
    lines.push(`⏰ *Preferred Timing:* ${details.preferredSlot.trim()}`);
  }

  lines.push(
    `📍 *Campus:* ${
      details.preferredMode === 'online_interactive'
        ? 'Live Online Interactive (1-on-1)'
        : 'Ananth Nagar STEM Lab (1121, 5th Cross, Phase II, Bengaluru)'
    }`
  );

  if (details.notes && details.notes.trim()) {
    lines.push(`📝 *Notes / Questions:* ${details.notes.trim()}`);
  }

  lines.push(
    '',
    'Hello Future Minds team, I have filled out the inquiry form on your website. Please confirm availability for a free demo session for my child!'
  );

  const fullText = lines.join('\n');
  return `https://wa.me/${WHATSAPP_FULL_NUMBER}?text=${encodeURIComponent(fullText)}`;
}

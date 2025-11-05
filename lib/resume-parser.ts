// Dynamic imports for client-side only
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pdfjsLib: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mammoth: any = null;

// Initialize libraries on client side
if (typeof window !== 'undefined') {
  (async () => {
    pdfjsLib = await import('pdfjs-dist');
    mammoth = (await import('mammoth')).default;
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
  })();
}

export interface ExtractedData {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  portfolio?: string;
  rawText: string;
}

// Regular expressions for extracting information
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
const PHONE_REGEX = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g;
const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+/gi;
const PORTFOLIO_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:portfolio|github|behance)\.(?:com|io|org)\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+/gi;

// Common location patterns (city, state format)
// Multiple patterns to capture various location formats
const LOCATION_PATTERNS = [
  // City, State ZIP (e.g., "San Francisco, CA 94102")
  /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),\s*([A-Z]{2})\s+\d{5}(?:-\d{4})?\b/g,
  // City, State abbreviation (e.g., "San Francisco, CA")
  /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),\s*([A-Z]{2})\b/g,
  // City, State name (e.g., "San Francisco, California")
  /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),\s*([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\b/g,
];

// US State abbreviations for validation
const US_STATES = new Set([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
]);

// Helper function to extract and clean location data
function extractLocation(text: string): string | undefined {
  if (!text) return undefined;
  
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  // Try each pattern in order of specificity
  for (const pattern of LOCATION_PATTERNS) {
    const matches = Array.from(cleanText.matchAll(pattern));
    
    for (const match of matches) {
      const city = match[1]?.trim();
      const state = match[2]?.trim();
      
      if (!city || !state) continue;
      
      // Validate state if it's an abbreviation
      if (state.length === 2 && !US_STATES.has(state)) continue;
      
      // Filter out common false positives
      const lowerCity = city.toLowerCase();
      const invalidCities = ['dear', 'phone', 'email', 'address', 'linkedin', 'summary', 'objective', 'experience', 'education', 'skills'];
      if (invalidCities.includes(lowerCity)) continue;
      
      // Return city and state (remove ZIP if present)
      return `${city}, ${state}`;
    }
  }
  
  return undefined;
}

// Name extraction - typically first few lines, capitalized words
const NAME_PATTERNS = [
  // Full name on single line (common pattern)
  /^([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/m,
  // Name at beginning with possible middle initial
  /^([A-Z][a-z]+\s+[A-Z]\.?\s+[A-Z][a-z]+)/m,
  // Simple first last name
  /^([A-Z][a-z]+\s+[A-Z][a-z]+)/m,
];

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Dynamically import pdfjs-dist if not already loaded
    if (!pdfjsLib) {
      pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: { str: string }) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF file');
  }
}

export async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    // Dynamically import mammoth if not already loaded
    if (!mammoth) {
      mammoth = (await import('mammoth')).default;
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from DOCX file');
  }
}

export function extractDataFromText(text: string): ExtractedData {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const cleanText = text.replace(/\s+/g, ' ').trim();

  // Extract email
  const emailMatches = cleanText.match(EMAIL_REGEX);
  const email = emailMatches?.[0];

  // Extract phone
  const phoneMatches = cleanText.match(PHONE_REGEX);
  const phone = phoneMatches?.[0];

  // Extract LinkedIn
  const linkedInMatches = cleanText.match(LINKEDIN_REGEX);
  const linkedIn = linkedInMatches?.[0];

  // Extract portfolio/website
  const portfolioMatches = cleanText.match(PORTFOLIO_REGEX);
  const portfolio = portfolioMatches?.[0];

  // Extract location using improved patterns
  const location = extractLocation(text);

  // Extract name - try multiple patterns
  let fullName = '';
  for (const pattern of NAME_PATTERNS) {
    const match = text.match(pattern);
    if (match && match[1]) {
      fullName = match[1].trim();
      break;
    }
  }

  // Fallback: try first line if it looks like a name
  if (!fullName && lines[0]) {
    const firstLine = lines[0].trim();
    // Check if first line has 2-4 words, all capitalized (likely a name)
    const words = firstLine.split(/\s+/);
    if (words.length >= 2 && words.length <= 4 && 
        words.every(word => /^[A-Z][a-z]*$/.test(word))) {
      fullName = firstLine;
    }
  }

  return {
    fullName: fullName || undefined,
    email: email || undefined,
    phone: phone || undefined,
    location: location || undefined,
    linkedIn: linkedIn || undefined,
    portfolio: portfolio || undefined,
    rawText: text,
  };
}

export async function parseResume(file: File): Promise<ExtractedData> {
  let text = '';

  if (file.type === 'application/pdf') {
    text = await extractTextFromPDF(file);
  } else if (
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.type === 'application/msword'
  ) {
    text = await extractTextFromDOCX(file);
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
  }

  return extractDataFromText(text);
}
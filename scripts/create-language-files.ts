import fs from 'fs';
import path from 'path';
import { i18nConfig } from '../config';

// Base directory where the messages will be stored
const MESSAGES_DIR = path.join(process.cwd(), 'messages');

// Ensure the messages directory exists
if (!fs.existsSync(MESSAGES_DIR)) {
  fs.mkdirSync(MESSAGES_DIR, { recursive: true });
}

// Get the English messages as a base
const enMessages = JSON.parse(fs.readFileSync(path.join(MESSAGES_DIR, 'en.json'), 'utf8'));

// Function to create a new language file
function createLanguageFile(locale: string, localeName: string) {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);

  // Check if the file already exists
  if (fs.existsSync(filePath)) {
    console.log(`Language file for ${localeName} (${locale}) already exists.`);
    return;
  }

  // Create the new language file with the same structure as English
  fs.writeFileSync(filePath, JSON.stringify(enMessages, null, 2));

  console.log(`Created language file for ${localeName} (${locale})`);
}

// Log the start of the script
console.log('Creating language files...');

// Create language files for each locale in the config
Object.entries(i18nConfig.localeNames).forEach(([locale, name]) => {
  if (locale !== 'en') { // Skip English as it's our base
    createLanguageFile(locale, name);
  }
});

console.log('Language files creation completed.');

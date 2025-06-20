export const brand = {
  title: "DSA Pattern Master",
  domain: "com",
};
export const brandName = `dsapatternmaster.${brand.domain}`;

// app
export const appSlogan = "Master DSA Patterns, Ace Interviews";
export const appTitle = `${brand.title} | ${appSlogan}`;
export const appDescription =
  "Master Data Structures and Algorithms through AI-powered pattern learning. Learn the 8 essential patterns that unlock 90% of coding interviews with your personal Socratic mentor.";
export const appUrl = "https://dsapatternmaster.com";
export const appLocale = "en_US";

// blog
export const blogTitle = "DSA Learning Blog";
export const blogDescription = `Algorithm patterns, interview tips, and learning strategies from the ${brand.title} team.`;
export const blogUrl = appUrl + "/blog";
export const defaultAuthor = "DSA Pattern Master Team";

// pagination
export const paginationConfig = {
  postsPerPage: 20, // Number of posts to display per page
  maxPagesShown: 7, // Maximum number of page numbers to show in pagination
  authorPostsPerPage: 3, // Number of posts per page on author pages
};

// date formatting
export const dateConfig = {
  locale: "en", // Locale for date-fns (id = Indonesian)
  format: "dd-MM-yyyy", // Default date format
  formatWithMonth: "MMM d, yyyy", // Format with month name
};

// i18n configuration
export const i18nConfig = {
  defaultLocale: "en",
  locales: ["en"],
  localeNames: {
    en: "English",
  },
  timeZone: "Asia/Jakarta", // Default timezone for internationalization
};

export const analyticsConfig = {
  googleAnalytics: {
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XXXXXXXXXX", // Replace with your Google Analytics measurement ID
    enabled: true, // Set to false to disable Google Analytics
  },
};

// Newsletter configuration
export const newsletterConfig = {
  brevo: {
    enabled: true,
  },
};

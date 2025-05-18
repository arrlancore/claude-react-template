export const brand = {
  title: "Brand",
  domain: "ai",
};
export const brandName = `${brand.title}.${brand.domain}`;

// app
export const appSlogan = "Build Better, Ship Faster";
export const appTitle = `${appSlogan} | ${brandName}`;
export const appDescription =
  "The complete development platform for building and scaling your next project. Trusted by over 20,000 developers worldwide.";
export const appUrl = "https://brand.ai";
export const appLocale = "en_US";

// blog
export const blogTitle = "Blog";
export const blogDescription = `Latest news, insights, and tutorials from the ${brand.title}.${brand.domain} team.`;
export const blogUrl = appUrl + "blog";
export const defaultAuthor = "Editor Team";

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
    enabled: process.env.BREVO_API_KEY ? true : false, // Automatically enables if API key is present
    listId: process.env.BREVO_LIST_ID || "", // Brevo list ID for newsletter subscribers
  },
};

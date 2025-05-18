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
};

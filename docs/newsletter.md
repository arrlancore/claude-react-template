# Newsletter Subscription with Brevo

This template includes a newsletter subscription feature powered by [Brevo](https://www.brevo.com/) (formerly Sendinblue).

## Features

- Easy integration with Brevo API
- Newsletter form component with multiple variants
- Configurable via environment variables
- Localized error and success messages
- Automatic form state handling
- Toast notifications

## Setup

### 1. Create a Brevo Account

1. Sign up for a free account at [Brevo](https://www.brevo.com/)
2. Navigate to "Contacts" in the main menu
3. Create a new list for your newsletter subscribers
4. Note down the List ID

### 2. Get Your API Key

1. Go to "SMTP & API" in the main menu
2. Click on "API Keys"
3. Create a new API key with appropriate permissions
4. Copy the generated API key

### 3. Configure Environment Variables

Add the following variables to your `.env.local` file:

```env
BREVO_API_KEY=your_brevo_api_key_here
BREVO_LIST_ID=your_list_id_here
```

The newsletter feature will automatically be enabled when these variables are present.

## Usage

The `NewsletterForm` component can be imported and used in any page:

```tsx
import NewsletterForm from "@/components/newsletter-form";

// Default style
<NewsletterForm />

// Inline style
<NewsletterForm variant="inline" />

// Card style
<NewsletterForm variant="card" />

// With custom class
<NewsletterForm className="my-custom-class" />
```

### Variants

The component provides three display variants:

1. `default` - Full form with title and description
2. `inline` - Compact form with input and button in one line (on larger screens)
3. `card` - Form wrapped in a Card component

## Customization

### Text & Translations

All text in the component is localized. You can modify the content by editing the `newsletter` section in the language files:

```
/messages/en.json
```

### Styling

The component uses Tailwind CSS for styling. You can customize the appearance by:

1. Passing a custom `className` prop
2. Editing the component file directly
3. Using CSS overrides in your stylesheets

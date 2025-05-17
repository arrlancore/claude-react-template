// Helper function to create slugs from heading content
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

const components = {
  h1: ({ children }: { children: React.ReactNode }) => {
    const slug = slugify(children as string);
    return (
      <h1 id={slug} className="text-3xl font-bold mb-4 scroll-mt-24">
        <a href={`#${slug}`} className="no-underline hover:no-underline">
          {children}
        </a>
      </h1>
    );
  },
  h2: ({ children }: { children: React.ReactNode }) => {
    const slug = slugify(children as string);
    return (
      <h2 id={slug} className="text-2xl font-bold mb-3 mt-8 scroll-mt-24">
        <a href={`#${slug}`} className="no-underline hover:no-underline">
          {children}
        </a>
      </h2>
    );
  },
  h3: ({ children }: { children: React.ReactNode }) => {
    const slug = slugify(children as string);
    return (
      <h3 id={slug} className="text-xl font-bold mb-2 mt-6 scroll-mt-24">
        <a href={`#${slug}`} className="no-underline hover:no-underline">
          {children}
        </a>
      </h3>
    );
  },
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="mb-4 leading-relaxed">{children}</p>
  ),
  code: ({ children }: { children: React.ReactNode }) => (
    <code className="bg-gray-100 dark:bg-gray-800 rounded px-1">
      {children}
    </code>
  ),
  pre: ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4">
      {children}
    </pre>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="mb-1">{children}</li>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-4">
      {children}
    </blockquote>
  ),
  a: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a
      href={href}
      className="text-primary hover:text-primary/80 underline decoration-1 underline-offset-2"
      target={href.startsWith('http') ? "_blank" : undefined}
      rel={href.startsWith('http') ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
};

export { components };

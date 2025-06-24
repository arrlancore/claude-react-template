"use client";

import { useMDXComponent } from "@/lib/hooks/useMDXComponent";

export default function MDXViewer({ source }: { source: string }) {
  const Content = useMDXComponent(source, {
    // h1: (props) => <h1 className="text-2xl font-bold" {...props} />,
    // Add more custom components here
  });

  return Content ? <Content /> : <p>Loading...</p>;
}

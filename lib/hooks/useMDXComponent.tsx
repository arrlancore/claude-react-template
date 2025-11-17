"use client";

import * as React from "react";
import { useMemo } from "react";
import { MDXProvider } from "@mdx-js/react";
import { useState, useEffect } from "react";

export function useMDXComponent(source: string, components: any = {}) {
  const [Content, setContent] = useState<React.FC | null>(null);

  useEffect(() => {
    async function compile() {
      const { compile } = await import("@mdx-js/mdx");
      const runtime = await import("react/jsx-runtime");

      const compiled = await compile(source, {
        outputFormat: "function-body",
        useDynamicImport: false,
        providerImportSource: "@mdx-js/react",
      });

      const fn = new Function(String(compiled));
      const MDXContent = fn({ ...runtime, React });

      setContent(() => () => (
        <MDXProvider components={components}>
          <MDXContent />
        </MDXProvider>
      ));
    }

    compile();
  }, [source, components]);

  return Content;
}

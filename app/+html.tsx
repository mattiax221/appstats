import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * Web-only root HTML for static rendering (SDK 58+).
 * Must render headNodes/bodyNodes or Metro JS never injects → black screen.
 */
export default function Root({ children }: PropsWithChildren) {
  const { headNodes, bodyNodes, htmlAttributes, bodyAttributes } =
    useServerDocumentContext();

  return (
    <html lang="it" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <ScrollViewStyleReset />
        {/* Pitch background so first paint matches the app (not pure #000). */}
        <style dangerouslySetInnerHTML={{ __html: rootBackground }} />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}

const rootBackground = `
html, body, #root {
  height: 100%;
}
body {
  background-color: #050A08;
  margin: 0;
}
/* Desktop: matchday night around the phone column */
#root {
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(31, 107, 62, 0.35), transparent 55%),
    #050A08;
}
`;

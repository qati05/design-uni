export const metadata = { title: "Auto Speedy Spike", robots: "noindex" };
export default function RootLayout({ children }) {
  return (
    <html lang="de-CH">
      <head>
        <link rel="stylesheet" href="/css/main.css" />
        <link rel="stylesheet" href="/css/zusatz.css" />
        <link rel="preload" href="/schriften/bigshoulders-800.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>{children}<script src="/js/main.js" defer /></body>
    </html>
  );
}

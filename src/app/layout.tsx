import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import NavigationComponent from '@/components/NavigationComponent';
import { cookies } from 'next/headers';
import ThemeProvider from '@/components/ThemeProvider'; // client provider

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'IOC App',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get('theme')?.value ?? 'light';
  const htmlClass = cookieTheme === 'dark' ? 'dark' : '';

  // inject initial theme so client can hydrate without flash
  const setInitialThemeScript = `window.__INITIAL_THEME = "${cookieTheme}";`;

  return (
    <html lang='en' className={htmlClass}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Inline script to expose the server-chosen theme for hydration */}
        <script dangerouslySetInnerHTML={{ __html: setInitialThemeScript }} />

        {/* Provide theme context to Navigation and the rest of the app */}
        <ThemeProvider>
          <NavigationComponent />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}

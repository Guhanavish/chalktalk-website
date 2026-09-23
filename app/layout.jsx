import './globals.css';
import SiteNav from '@/components/SiteNav';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'ChalkTalk — Smart Classroom Board',
  description: 'Touch-first smart whiteboard for schools. Write on slides, PDF and PowerPoint. Download the app and the shared class library.'
};

export const viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SiteNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

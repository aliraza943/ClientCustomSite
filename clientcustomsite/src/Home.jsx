import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Footer from './Footer';
import Header from './Header';
import HeroImage from './HeroImage';
import TextWithImageSection from './TextWithImageSecttion';

export default function Home() {
  const { siteUrl } = useParams();
  const [websiteData, setWebsiteData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebsiteData = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/website/get-website/${siteUrl}`);
        const payload = await res.json();
        if (res.ok && payload.website) {
          setWebsiteData(payload.website);
        } else {
          console.warn(payload.message || 'Website not found');
        }
      } catch (error) {
        console.error('Failed to fetch website data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWebsiteData();
  }, [siteUrl]);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (!websiteData) return <div className="text-center p-8 text-red-500">Website not found</div>;

  const logoUrl = websiteData.logoFileName
    ? `http://localhost:8080/uploads/${websiteData.logoFileName}`
    : '';

  const galleryUrls = (websiteData.galleryImages || []).map(img =>
    `http://localhost:8080/uploads/${img.fileName || img.filename || img.path}`
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header
        logoSrc={logoUrl}
        logoAlt={websiteData.siteName || 'Logo'}
        navLinks={[
          { href: '/', text: 'Home' },
          { href: '/services', text: 'Services' },
          { href: '/blog', text: 'Meet Our Team' },
          { href: '/contact', text: 'Bookings' },
        ]}
        socialLinks={websiteData.socialLinks || {}}
        fontClass={websiteData.headerSettings?.fontClass || ''}
        customBgColor={websiteData.headerSettings?.headerBgColor || '#ffffff'}
        customTextColor={websiteData.headerSettings?.headerTextColor || '#000000'}
      />

      {/* Hero Image Gallery */}
      <HeroImage
        images={galleryUrls}
        overlayTexts={websiteData.overlayTexts || []}
      />

      {/* Text + Image Section */}
      <TextWithImageSection
        heading={websiteData.textSection?.heading || 'About Us'}
        text={websiteData.textSection?.text || ''}
        imageSrc={websiteData.textSection?.image || ''}
        mapCoords={websiteData.textSection?.mapCoords || ''}
        mapLabel={websiteData.textSection?.mapLabel || ''}
      />

      {/* Footer */}
      <Footer
        siteName={websiteData.siteName || ''}
        location={websiteData.textSection?.mapLabel || ''}
        state={websiteData.textSection?.state || 'Toronto'}
        socialLinks={websiteData.socialLinks || {}}
        backgroundColor="bg-black"
        fontColor="text-gray-300"
        fontFamily={websiteData.headerSettings?.fontClass || ''}
      />
    </div>
  );
}

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Header from './Header';
import Footer from './Footer';
import ServicesList from './ServicesList';

export default function Services() {
  const { siteUrl } = useParams();

  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState('');

  const [websiteData, setWebsiteData] = useState(null);
  const [siteLoading, setSiteLoading] = useState(true);

  // Fetch services by siteUrl
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/website/get-services/${siteUrl}`
        );
        if (data.success) {
          setServices(data.services);
        } else {
          setServicesError('No services returned from server.');
        }
      } catch (err) {
        setServicesError('Failed to load services.');
      } finally {
        setServicesLoading(false);
      }
    };

    if (siteUrl) fetchServices();
  }, [siteUrl]);

  // Fetch website data (logo, siteName, header/footer settings)
  useEffect(() => {
    const fetchWebsiteData = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/website/get-website/${siteUrl}`
        );
        const payload = await res.json();
        if (res.ok && payload.website) {
          setWebsiteData(payload.website);
        } else {
          console.warn(payload.message || 'Website not found');
        }
      } catch (error) {
        console.error('Failed to fetch website data:', error);
      } finally {
        setSiteLoading(false);
      }
    };

    fetchWebsiteData();
  }, [siteUrl]);

  const logoUrl = websiteData?.logoFileName
    ? `http://localhost:8080/uploads/${websiteData.logoFileName}`
    : '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header
        logoSrc={logoUrl}
        logoAlt={websiteData?.siteName || 'Logo'}
        socialLinks={websiteData?.socialLinks || {}}
        fontClass={websiteData?.headerSettings?.fontClass || ''}
        customBgColor={websiteData?.headerSettings?.headerBgColor || '#ffffff'}
        customTextColor={websiteData?.headerSettings?.headerTextColor || '#000000'}
        navLinks={[
          { href: `/${siteUrl}`, text: 'Home' },
          { href: `/${siteUrl}/services`, text: 'Services' },
          { href: `/${siteUrl}/meetourteam`, text: 'Meet Our Team' },
          { href: `/${siteUrl}/contact`, text: 'Bookings' },
        ]}
      />

      {/* Main Content */}
      <main className="p-8 flex-grow">
        <p className="text-lg mb-4">
          Our Services
        </p>

        <ServicesList
          services={services}
          servicesLoading={servicesLoading}
          servicesError={servicesError}
        />
      </main>

      {/* Footer */}
      <Footer
        siteName={websiteData?.siteName || ''}
        location={websiteData?.textSection?.mapLabel || ''}
        state={websiteData?.textSection?.state || 'Toronto'}
        socialLinks={websiteData?.socialLinks || {}}
        backgroundColor="bg-black"
        fontColor="text-gray-300"
        fontFamily={websiteData?.headerSettings?.fontClass || ''}
      />
    </div>
  );
}

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Header from './Header';
import Footer from './Footer';

export default function Services() {
  const { siteUrl } = useParams();

  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState('');

  const [websiteData, setWebsiteData] = useState(null);
  const [siteLoading, setSiteLoading] = useState(true);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/website/get-meetourTeam/${siteUrl}`
        );
        if (data.success) {
          setServices(data.cards);
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

  // Fetch website data (logo, site name, header/footer settings)
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
          { href: `/${siteUrl}/bookings`, text: 'Bookings' },
        ]}
      />

      {/* Main Content */}
      <main className="p-8 flex-grow">
        
        <p className="text-lg mb-4">
        Meet Our Team of Professionals<span className="font-semibold"></span>
        </p>

        {servicesLoading ? (
          <p>Loading services...</p>
        ) : servicesError ? (
          <p className="text-red-500">{servicesError}</p>
        ) : services.length === 0 ? (
          <p>No services found.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <li key={service._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-5">
              <div className="mb-4">
                <img
                  src={`http://localhost:8080${service.image}`}
                  alt={service.description}
                  className="rounded-lg w-full h-48 object-cover"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {service.staffId?.name || 'Unnamed Staff'}
              </h2>
              <p className="text-gray-600">{service.description}</p>
            </li>
          ))}
        </ul>
        
        )}
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

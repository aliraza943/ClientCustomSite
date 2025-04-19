export default function Footer({
    siteName,
    location,
    state,
    socialLinks,
    backgroundColor = 'bg-gray-900',
    fontColor = 'text-white',
    fontFamily = 'font-sans' // you can pass 'font-serif', 'font-mono', or custom
  }) {
    return (
      <footer className={`${backgroundColor} ${fontColor} ${fontFamily} py-6 mt-auto`}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-xl font-semibold">{siteName}</h2>
          <p className="text-sm">{location}, {state}</p>
          
          <div className="flex justify-center space-x-4 mt-2">
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Facebook
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Instagram
              </a>
            )}
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Twitter
              </a>
            )}
          </div>
  
          <p className="text-xs mt-4">© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </div>
      </footer>
    );
  }
  
export default function TextWithImageSection({ heading, text, imageSrc, mapCoords, mapLabel, mapZoom = 15 }) {
  const mapSrc = `https://www.google.com/maps?q=${mapCoords}&z=${mapZoom}&output=embed`;

  return (
    <>
      {/* Text & Image Section */}
      <section className="bg-[#f4efe9] py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-12">
          {/* Text Section */}
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">{heading}</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{text}</p>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-1/2">
            <img
              src={`http://localhost:8080/uploads/${imageSrc}`}
              alt={heading}
              className="rounded-2xl shadow-xl w-full object-cover h-auto max-h-[500px]"
              onError={(e) => {
                console.error("Image failed to load:", imageSrc);
                e.target.style.display = "none";
              }}
            />
          </div>
        </div>
      </section>

      {/* Map Section (full-width aligned with above section) */}
      <div className="bg-[#f4efe9] pb-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-xl border border-gray-300">
            <iframe
              title="Custom Location"
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Location Label */}
          <p className="mt-4 text-gray-700 font-medium text-center">{mapLabel}</p>
        </div>
      </div>
    </>
  );
}

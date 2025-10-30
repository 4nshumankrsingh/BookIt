import Link from 'next/link';
import Image from 'next/image';

const ExperienceCard = ({ experience }) => {
  const lowestPrice = Math.min(...experience.slots.map(slot => slot.price));
  const totalSpots = experience.slots.reduce((sum, slot) => sum + slot.maxParticipants, 0);
  const bookedSpots = experience.slots.reduce((sum, slot) => sum + slot.bookedParticipants, 0);
  const availableSpots = totalSpots - bookedSpots;
  
  const getAvailabilityText = () => {
    if (availableSpots === 0) return { text: 'Sold Out', color: 'text-red-600', bg: 'bg-red-100' };
    if (availableSpots <= 3) return { text: 'Few Spots Left', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { text: 'Available', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const availability = getAvailabilityText();

  return (
    <div className="experience-card bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:border-blue-200">
      {/* Image Container */}
      <div className="relative h-64 w-full group">
        <Image
          src={experience.image}
          alt={experience.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white bg-opacity-90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            {experience.category}
          </span>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          <span className={`${availability.bg} ${availability.color} px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm`}>
            {availability.text}
          </span>
        </div>

        {/* Rating */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500">★</span>
              <span className="font-semibold text-gray-900">{experience.rating}</span>
              <span className="text-gray-600">({experience.reviewCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Location */}
        <div className="flex items-center text-gray-500 mb-3">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">{experience.location}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {experience.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {experience.description}
        </p>

        {/* Details */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {experience.duration}
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {availableSpots} spots left
            </div>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">${lowestPrice}</div>
            <div className="text-sm text-gray-500">per person</div>
          </div>
          
          <Link 
            href={`/experiences/${experience._id}`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center space-x-2"
          >
            <span>View Details</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
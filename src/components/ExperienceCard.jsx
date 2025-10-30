import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Clock, Users, ArrowRight, Heart } from 'lucide-react';

const ExperienceCard = ({ experience }) => {
  const lowestPrice = Math.min(...experience.slots.map(slot => slot.price));
  const totalSpots = experience.slots.reduce((sum, slot) => sum + slot.maxParticipants, 0);
  const bookedSpots = experience.slots.reduce((sum, slot) => sum + slot.bookedParticipants, 0);
  const availableSpots = totalSpots - bookedSpots;
  
  const getAvailabilityStatus = () => {
    if (availableSpots === 0) return { text: 'Sold Out', color: 'text-red-600', bg: 'bg-red-50' };
    if (availableSpots <= 2) return { text: 'Few Spots', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { text: 'Available', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const availability = getAvailabilityStatus();

  return (
    <div className="card-hover bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:border-blue-300 relative">
      {/* Wishlist Button */}
      <button className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 smooth-transition">
        <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
      </button>

      {/* Image Container */}
      <div className="relative h-56 w-full group overflow-hidden">
        <Image
          src={experience.image}
          alt={experience.title}
          fill
          className="object-cover group-hover:scale-105 smooth-transition"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium">
            {experience.category}
          </span>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-4 left-4 transform translate-x-24">
          <span className={`${availability.bg} ${availability.color} px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm`}>
            {availability.text}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Rating and Reviews */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold text-gray-900">{experience.rating}</span>
            </div>
            <span className="text-sm text-gray-500">({experience.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight hover:text-blue-600 smooth-transition">
          {experience.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{experience.location}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {experience.description}
        </p>

        {/* Details */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {experience.duration}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {availableSpots} spots left
            </div>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <div className="text-2xl font-bold text-gray-900">${lowestPrice}</div>
            <div className="text-sm text-gray-500">per person</div>
          </div>
          
          <Link 
            href={`/experiences/${experience._id}`}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 smooth-transition font-semibold flex items-center space-x-2 group"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 smooth-transition" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
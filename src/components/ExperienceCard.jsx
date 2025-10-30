import Link from 'next/link';
import Image from 'next/image';

const ExperienceCard = ({ experience }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={experience.image}
          alt={experience.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {experience.title}
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {experience.category}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {experience.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-gray-700">
              {experience.rating} ({experience.reviewCount} reviews)
            </span>
          </div>
          <span className="text-gray-500 text-sm">{experience.duration}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-gray-500 text-sm">{experience.location}</span>
          <span className="text-lg font-bold text-gray-900">
            From ${Math.min(...experience.slots.map(slot => slot.price))}
          </span>
        </div>
        <Link 
          href={`/experiences/${experience._id}`}
          className="mt-4 block w-full bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ExperienceCard;
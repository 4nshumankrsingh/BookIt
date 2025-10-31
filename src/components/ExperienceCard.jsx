import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Clock, Users, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ExperienceCard = ({ experience }) => {
  const lowestPrice = Math.min(...experience.slots.map(slot => slot.price));
  const totalSpots = experience.slots.reduce((sum, slot) => sum + slot.maxParticipants, 0);
  const bookedSpots = experience.slots.reduce((sum, slot) => sum + slot.bookedParticipants, 0);
  const availableSpots = totalSpots - bookedSpots;
  
  const getAvailabilityStatus = () => {
    if (availableSpots === 0) return { text: 'Sold Out', variant: 'destructive' };
    if (availableSpots <= 2) return { text: 'Few Spots', variant: 'secondary' };
    return { text: 'Available', variant: 'default' };
  };

  const availability = getAvailabilityStatus();

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-blue-300 h-full flex flex-col">
      {/* Wishlist Button */}
      <Button 
        variant="ghost" 
        size="icon"
        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white hover:shadow-md transition-all duration-200"
      >
        <Heart className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
      </Button>

      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={experience.image}
          alt={experience.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        {/* Category and Availability Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-800 font-medium">
            {experience.category}
          </Badge>
          <Badge variant={availability.variant} className="backdrop-blur-sm font-medium">
            {availability.text}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3 flex-1">
        {/* Rating and Reviews */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold text-gray-900">{experience.rating}</span>
            </div>
            <CardDescription className="text-sm">
              ({experience.reviewCount} reviews)
            </CardDescription>
          </div>
        </div>

        {/* Title */}
        <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-200 mb-2">
          {experience.title}
        </CardTitle>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-2" />
          <CardDescription className="text-sm">{experience.location}</CardDescription>
        </div>

        {/* Description */}
        <CardDescription className="text-sm line-clamp-2 leading-relaxed mb-4">
          {experience.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-4 pt-0">
        {/* Details */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-500">
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
      </CardContent>

      <CardFooter className="pt-0 mt-auto">
        {/* Price and CTA */}
        <div className="flex items-center justify-between w-full pt-4 border-t border-gray-200">
          <div>
            <div className="text-2xl font-bold text-gray-900">${lowestPrice}</div>
            <CardDescription>per person</CardDescription>
          </div>
          
          <Button asChild className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 group/btn">
            <Link href={`/experiences/${experience._id}`}>
              <span>View Details</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ExperienceCard;
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Clock, Users, Heart, ArrowRight } from 'lucide-react';
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

  // Use high-quality images from Unsplash for global landmarks
  const getImageUrl = (title) => {
    const imageMap = {
      'Taj Mahal Tour': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      'Eiffel Tower Experience': 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2001&q=80',
      'Colosseum Adventure': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2096&q=80',
      'Angkor Wat Exploration': 'https://images.unsplash.com/photo-1589810635657-232948472d98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    };
    return imageMap[title] || experience.image || '/placeholder-image.jpg';
  };

  return (
    <Card className="bookit-experience-card bookit-hover-lift group h-full flex flex-col overflow-hidden">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={getImageUrl(experience.title)}
          alt={experience.title}
          fill
          className="bookit-experience-image object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Wishlist Button */}
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-background hover:shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <Heart className="w-4 h-4 text-muted-foreground group-hover:text-red-500 transition-colors duration-200" />
        </Button>

        {/* Category and Availability Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className="bookit-badge-primary backdrop-blur-sm font-medium">
            {experience.category}
          </Badge>
          <Badge variant={availability.variant} className="backdrop-blur-sm font-medium">
            {availability.text}
          </Badge>
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-background/90 backdrop-blur-sm text-foreground font-medium">
            <Star className="w-3 h-3 text-amber-500 fill-current mr-1" />
            {experience.rating}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3 flex-1">
        {/* Title */}
        <CardTitle className="bookit-heading-sm line-clamp-2 leading-tight group-hover:text-bookit-600 transition-colors duration-200 mb-2">
          {experience.title}
        </CardTitle>

        {/* Location */}
        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 mr-2" />
          <CardDescription className="bookit-body-sm">{experience.location}</CardDescription>
        </div>

        {/* Description */}
        <CardDescription className="bookit-body-sm line-clamp-2 leading-relaxed mb-4">
          {experience.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-4 pt-0">
        {/* Details */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 bookit-body-sm text-muted-foreground">
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
        <div className="flex items-center justify-between w-full pt-4 border-t border-border">
          <div>
            <div className="bookit-price-tag">${lowestPrice}</div>
            <CardDescription className="bookit-caption">per person</CardDescription>
          </div>
          
          <Button asChild className="bookit-btn-primary group/btn">
            <Link href={`/experiences/${experience._id}`} className="flex items-center">
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
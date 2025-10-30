'use client';
import { Clock, Users, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TimeSlot = ({ slot, isSelected, onSelect }) => {
  const availableSpots = slot.availableSpots;
  const isAvailable = availableSpots > 0;

  const getAvailabilityColor = (spots) => {
    if (spots === 0) return 'text-red-600';
    if (spots <= 2) return 'text-orange-600';
    return 'text-green-600';
  };

  const getAvailabilityText = (spots) => {
    if (spots === 0) return 'Sold out';
    if (spots <= 2) return `Only ${spots} left`;
    return `${spots} spots available`;
  };

  return (
    <Button
      onClick={() => isAvailable && onSelect(slot)}
      disabled={!isAvailable}
      variant={isSelected ? "default" : "outline"}
      className="w-full p-4 h-auto justify-start text-left"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-background">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="font-semibold text-lg">
              {slot.startTime} - {slot.endTime}
            </div>
            <div className={`text-sm font-medium ${getAvailabilityColor(availableSpots)}`}>
              {getAvailabilityText(availableSpots)}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold">
            ${slot.price}
          </div>
          <div className="text-sm opacity-70">per person</div>
          {isSelected && (
            <Badge variant="secondary" className="mt-1">
              <Check className="w-3 h-3 mr-1" />
              Selected
            </Badge>
          )}
        </div>
      </div>
      
      {!isAvailable && (
        <Card className="mt-2 absolute inset-x-4 bottom-4">
          <CardContent className="p-2 text-center">
            <p className="text-red-800 text-sm font-medium">Fully Booked</p>
          </CardContent>
        </Card>
      )}
    </Button>
  );
};

export default TimeSlot;
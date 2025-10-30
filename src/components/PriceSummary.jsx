'use client';
import { Calendar, Clock, MapPin, Users, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const PriceSummary = ({ 
  experience, 
  selectedSlot, 
  participants, 
  promoApplied, 
  basePrice, 
  discount, 
  finalPrice 
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Experience Details */}
        <div>
          <CardTitle className="text-lg mb-3">{experience.title}</CardTitle>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{experience.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{experience.duration}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Booking Details */}
        <div className="space-y-4">
          {selectedSlot && (
            <>
              <div className="flex justify-between items-start">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Date</span>
                </div>
                <span className="text-gray-900 font-medium text-right">
                  {formatDate(selectedSlot.date)}
                </span>
              </div>
              
              <div className="flex justify-between items-start">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Time</span>
                </div>
                <span className="text-gray-900 font-medium">
                  {selectedSlot.startTime} - {selectedSlot.endTime}
                </span>
              </div>
            </>
          )}
          
          <div className="flex justify-between items-start">
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              <span>Participants</span>
            </div>
            <span className="text-gray-900 font-medium">
              {participants} {participants === 1 ? 'person' : 'people'}
            </span>
          </div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Base Price</span>
            <span>${basePrice}</span>
          </div>
          
          {promoApplied && (
            <>
              <div className="flex justify-between text-green-600">
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  <span>Discount ({promoApplied.promo.code})</span>
                </div>
                <span>-${discount}</span>
              </div>
              {promoApplied.promo.description && (
                <CardDescription className="text-green-600 bg-green-50 p-2 rounded-lg text-xs">
                  {promoApplied.promo.description}
                </CardDescription>
              )}
            </>
          )}
          
          <Separator />
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>${finalPrice}</span>
          </div>
        </div>

        {/* Additional Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <CardTitle className="text-blue-900 text-sm mb-2">What's included:</CardTitle>
            <ul className="text-sm text-blue-800 space-y-1">
              {experience.included && experience.included.slice(0, 3).map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
              {experience.included && experience.included.length > 3 && (
                <li className="text-blue-600">+ {experience.included.length - 3} more inclusions</li>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Meeting Point */}
        {experience.meetingPoint && (
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <CardTitle className="text-gray-900 text-sm mb-2">Meeting Point:</CardTitle>
              <CardDescription className="text-gray-700">{experience.meetingPoint}</CardDescription>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceSummary;
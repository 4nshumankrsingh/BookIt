'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Clock, Users, Calendar, Check, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import LoadingSpinner from '@/components/LoadingSpinner';
import DatePicker from '@/components/DatePicker';
import TimeSlot from '@/components/TimeSlot';

export default function ExperienceDetail() {
  const params = useParams();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchExperience();
    }
  }, [params.id]);

  const fetchExperience = async () => {
    try {
      const response = await axios.get(`/api/experiences/${params.id}`);
      setExperience(response.data);
      
      // Set first available date as default
      const dates = Object.keys(response.data.slotsByDate);
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      }
    } catch (err) {
      setError('Failed to load experience details');
      console.error('Error fetching experience:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Reset slot when date changes
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" text="Loading experience details..." />
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <CardTitle className="text-2xl mb-4">Experience Not Found</CardTitle>
            <CardDescription className="mb-8">
              {error || 'The experience you are looking for does not exist or is no longer available.'}
            </CardDescription>
            <Button asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Experiences
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Button asChild variant="ghost">
              <Link href="/" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Experiences
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-semibold">{experience.rating}</span>
              <span className="text-gray-500">({experience.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Experience Details */}
          <div className="lg:col-span-2">
            {/* Image */}
            <Card className="rounded-2xl overflow-hidden mb-8">
              <div className="relative h-96 w-full">
                <Image
                  src={experience.image}
                  alt={experience.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Card>

            {/* Experience Info */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <CardTitle className="text-4xl mb-4">
                    {experience.title}
                  </CardTitle>
                  <Badge variant="secondary" className="text-sm">
                    {experience.category}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{experience.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>{experience.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-2" />
                    <span>Small groups</span>
                  </div>
                </div>

                <CardDescription className="text-lg leading-relaxed">
                  {experience.description}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Highlights & Included */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Highlights */}
              {experience.highlights && experience.highlights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Experience Highlights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {experience.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <Check className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* What's Included */}
              {experience.included && experience.included.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>What's Included</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {experience.included.map((item, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <Check className="w-5 h-5 text-blue-500 mr-3 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Meeting Point */}
            {experience.meetingPoint && (
              <Card>
                <CardHeader>
                  <CardTitle>Meeting Point</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{experience.meetingPoint}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      ${experience.basePrice}
                    </div>
                    <CardDescription>per person</CardDescription>
                  </div>

                  <Separator className="my-6" />

                  {/* Date Selection */}
                  <div className="mb-6">
                    <CardTitle className="text-lg mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Select Date
                    </CardTitle>
                    <DatePicker
                      availableDates={Object.keys(experience.slotsByDate)}
                      selectedDate={selectedDate}
                      onDateSelect={handleDateSelect}
                    />
                  </div>

                  {/* Time Slots */}
                  {selectedDate && experience.slotsByDate[selectedDate] && (
                    <div className="mb-6">
                      <CardTitle className="text-lg mb-4">Available Times</CardTitle>
                      <div className="space-y-3">
                        {experience.slotsByDate[selectedDate].map((slot) => (
                          <TimeSlot
                            key={slot._id}
                            slot={slot}
                            isSelected={selectedSlot?._id === slot._id}
                            onSelect={handleSlotSelect}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Book Button */}
                  {selectedSlot ? (
                    <Button asChild className="w-full text-lg py-6">
                      <Link
                        href={{
                          pathname: '/checkout',
                          query: {
                            experienceId: experience._id,
                            slotId: selectedSlot._id,
                            participants: 1
                          }
                        }}
                      >
                        Book Now - ${selectedSlot.price}
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled className="w-full text-lg py-6">
                      Select a Time
                    </Button>
                  )}

                  {/* Availability Notice */}
                  {!experience.hasAvailableSlots && (
                    <Card className="mt-4 border-red-200">
                      <CardContent className="p-4 text-center">
                        <p className="text-red-800 font-medium">Fully Booked</p>
                        <CardDescription className="text-red-600">
                          Check back later for new dates
                        </CardDescription>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Shield className="w-5 h-5 text-green-500 mr-3" />
                      <span>Secure booking with SSL encryption</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Check className="w-5 h-5 text-blue-500 mr-3" />
                      <span>Instant confirmation</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-5 h-5 text-purple-500 mr-3" />
                      <span>24/7 customer support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
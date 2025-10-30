'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ExperienceDetail() {
  const params = useParams();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    } catch (err) {
      setError('Failed to load experience details');
      console.error('Error fetching experience:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAvailableSpots = (slot) => {
    return slot.maxParticipants - slot.bookedParticipants;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Experience not found'}</p>
          <Link 
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Experiences
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          ← Back to Experiences
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96 w-full">
            <Image
              src={experience.image}
              alt={experience.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {experience.title}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <span className="flex items-center">
                    📍 {experience.location}
                  </span>
                  <span className="flex items-center">
                    ⏱️ {experience.duration}
                  </span>
                  <span className="flex items-center">
                    ⭐ {experience.rating} ({experience.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {experience.category}
              </span>
            </div>

            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              {experience.description}
            </p>

            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Available Slots
              </h2>
              
              <div className="space-y-4">
                {experience.slots.map((slot) => {
                  const availableSpots = getAvailableSpots(slot);
                  const isAvailable = availableSpots > 0;
                  
                  return (
                    <div
                      key={slot._id}
                      className={`border rounded-lg p-4 ${
                        selectedSlot?._id === slot._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      } ${!isAvailable ? 'opacity-50' : 'cursor-pointer hover:border-blue-300'}`}
                      onClick={() => isAvailable && setSelectedSlot(slot)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {formatDate(slot.date)}
                          </h3>
                          <p className="text-gray-600">
                            {slot.startTime} - {slot.endTime}
                          </p>
                          <p className={`text-sm ${
                            isAvailable ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {isAvailable 
                              ? `${availableSpots} spots available` 
                              : 'Sold out'
                            }
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            ${slot.price}
                          </p>
                          <p className="text-sm text-gray-600">per person</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedSlot && (
                <div className="mt-8 flex justify-end">
                  <Link
                    href={{
                      pathname: '/checkout',
                      query: {
                        experienceId: experience._id,
                        slotId: selectedSlot._id,
                        participants: 1
                      }
                    }}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold text-lg"
                  >
                    Book Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
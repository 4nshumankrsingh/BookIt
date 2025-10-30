'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ExperienceCard from '@/components/ExperienceCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await axios.get('/api/experiences');
      setExperiences(response.data);
    } catch (err) {
      setError('Failed to load experiences');
      console.error('Error fetching experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchExperiences}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Experiences
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Book unique activities and create unforgettable memories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((experience) => (
            <ExperienceCard key={experience._id} experience={experience} />
          ))}
        </div>

        {experiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No experiences found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
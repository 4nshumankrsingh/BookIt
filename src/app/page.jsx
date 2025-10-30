'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Star, MapPin, Clock, Users, ArrowRight, Shield, Award, Globe, Search } from 'lucide-react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import ExperienceCard from '@/components/ExperienceCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Experiences', icon: Globe },
    { id: 'Sailing', name: 'Sailing & Boating' },
    { id: 'Hiking', name: 'Hiking & Trekking' },
    { id: 'Food & Drink', name: 'Food & Drink' },
    { id: 'Adventure', name: 'Adventure Sports' },
    { id: 'Cultural', name: 'Cultural Tours' }
  ];

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/experiences');
      setExperiences(response.data);
    } catch (err) {
      setError('Failed to load experiences. Please try again later.');
      console.error('Error fetching experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExperiences = experiences.filter(experience => {
    const matchesSearch = experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         experience.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || experience.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="large" text="Loading amazing experiences..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section with Search */}
      <section className="hero-gradient text-white pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover Amazing
              <br />
              <span className="text-blue-100">Travel Experiences</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Book unique activities, adventures, and tours with trusted local operators worldwide
            </p>
          </div>
          
          <SearchBar />
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-4 pb-2 hide-scrollbar">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-shrink-0 px-6 py-3 rounded-xl font-semibold smooth-transition flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Featured Experiences
              </h2>
              <p className="text-gray-600 text-lg">
                Curated selection of top-rated activities and tours
              </p>
            </div>
            <button className="hidden lg:flex items-center space-x-2 text-blue-600 font-semibold hover:text-blue-700 smooth-transition">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
                <p className="text-red-800 mb-4">{error}</p>
                <button 
                  onClick={fetchExperiences}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 smooth-transition font-semibold"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Experiences Grid */}
          {!error && (
            <>
              {filteredExperiences.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredExperiences.map((experience) => (
                    <ExperienceCard key={experience._id} experience={experience} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No experiences found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm || selectedCategory !== 'all' 
                        ? 'Try adjusting your search criteria or browse different categories'
                        : 'New experiences are being added regularly. Check back soon!'
                      }
                    </p>
                    {(searchTerm || selectedCategory !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                        }}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 smooth-transition font-semibold"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose BookIt?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Booking</h3>
              <p className="text-gray-600">
                Your payments are secure and your data is protected with industry-standard encryption
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Best Price Guarantee</h3>
              <p className="text-gray-600">
                Found a lower price? We'll match it and give you additional discounts
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Our customer support team is available around the clock to assist you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 secondary-gradient text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Create Unforgettable Memories?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust BookIt for their adventure bookings
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 smooth-transition font-semibold text-lg"
            >
              Explore All Experiences
            </Link>
            <button className="border border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 smooth-transition font-semibold text-lg">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="text-xl font-bold">BookIt</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your trusted partner for amazing travel experiences and adventure bookings worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button className="hover:text-white smooth-transition">About Us</button></li>
                <li><button className="hover:text-white smooth-transition">Careers</button></li>
                <li><button className="hover:text-white smooth-transition">Blog</button></li>
                <li><button className="hover:text-white smooth-transition">Press</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button className="hover:text-white smooth-transition">Help Center</button></li>
                <li><button className="hover:text-white smooth-transition">Contact Us</button></li>
                <li><button className="hover:text-white smooth-transition">Privacy Policy</button></li>
                <li><button className="hover:text-white smooth-transition">Terms of Service</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Destinations</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button className="hover:text-white smooth-transition">Europe</button></li>
                <li><button className="hover:text-white smooth-transition">Asia</button></li>
                <li><button className="hover:text-white smooth-transition">North America</button></li>
                <li><button className="hover:text-white smooth-transition">Australia</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 BookIt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
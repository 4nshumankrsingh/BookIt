'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Star, MapPin, Clock, Users, ArrowRight, Shield, Award, Globe, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import ExperienceCard from '@/components/ExperienceCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pagination, setPagination] = useState({});

  const categories = [
    { id: 'all', name: 'All Experiences', icon: Globe },
    { id: 'Sailing', name: 'Sailing & Boating' },
    { id: 'Hiking', name: 'Hiking & Trekking' },
    { id: 'Food & Drink', name: 'Food & Drink' },
    { id: 'City Tour', name: 'City Tours' }
  ];

  useEffect(() => {
    fetchExperiences();
  }, [searchTerm, selectedCategory]);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      
      const response = await axios.get(`/api/experiences?${params}`);
      setExperiences(response.data.experiences);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to load experiences. Please try again later.');
      console.error('Error fetching experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  if (loading && experiences.length === 0) {
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
      
      {/* Hero Section */}
      <section className="bg-linear-to-br from-blue-600 to-purple-700 text-white pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              Discover
              <br />
              <span className="text-yellow-300">Extraordinary</span>
              <br />
              Experiences
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-12">
              Book unique adventures, guided tours, and unforgettable activities with trusted local experts
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <Card className="rounded-2xl shadow-2xl border-0">
                <CardContent className="p-2">
                  <div className="flex items-center">
                    <div className="flex-1 flex items-center px-4">
                      <Search className="w-6 h-6 text-gray-400 mr-3" />
                      <Input
                        type="text"
                        placeholder="Search experiences, locations, activities..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full py-4 text-gray-800 placeholder-gray-500 bg-transparent border-0 focus:outline-none focus:ring-0 text-lg shadow-none"
                      />
                    </div>
                    <Button 
                      onClick={fetchExperiences}
                      className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg"
                    >
                      Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-8 bg-white border-b -mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-4 pb-2 hide-scrollbar">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={`shrink-0 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? 'transform scale-105'
                      : ''
                  }`}
                >
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                  <span>{category.name}</span>
                </Button>
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
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Featured Experiences
              </h2>
              <p className="text-gray-600 text-lg">
                Curated selection of top-rated activities and tours
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-lg py-2 px-4">
                {experiences.length} of {pagination.totalExperiences || 0} experiences
              </Badge>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <Card className="max-w-md mx-auto border-red-200">
                <CardContent className="p-8">
                  <p className="text-red-800 mb-4">{error}</p>
                  <Button 
                    onClick={fetchExperiences}
                    variant="destructive"
                    className="w-full"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Experiences Grid */}
          {!error && (
            <>
              {experiences.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {experiences.map((experience) => (
                    <ExperienceCard key={experience._id} experience={experience} />
                  ))}
                </div>
              ) : (
                <Card className="max-w-md mx-auto">
                  <CardContent className="text-center py-16">
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
                      <Button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                        }}
                        className="w-full"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Loading More */}
          {loading && experiences.length > 0 && (
            <div className="flex justify-center mt-8">
              <LoadingSpinner size="medium" text="Loading more experiences..." />
            </div>
          )}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose BookIt?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing you with the best booking experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-10 h-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl mb-4">Secure Booking</CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  Your payments are protected with bank-level security and your personal data is always safe with us.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-10 h-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl mb-4">Best Price Guarantee</CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  Found a lower price elsewhere? We'll match it and give you an additional 10% discount.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-purple-600" />
                </div>
                <CardTitle className="text-2xl mb-4">24/7 Support</CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  Our dedicated support team is available around the clock to help with any questions or issues.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold mb-6">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of travelers who trust BookIt for unforgettable experiences and seamless bookings
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" className="px-8 py-4 text-lg">
              <Link href="/">
                Explore All Experiences
              </Link>
            </Button>
            <Button variant="outline" className="px-8 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-blue-600">
              Contact Our Team
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="text-2xl font-bold">BookIt</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed">
                Your trusted partner for amazing travel experiences and adventure bookings worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-6">Company</h4>
              <ul className="space-y-3 text-gray-400 text-lg">
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">About Us</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">Careers</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">Blog</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">Press</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-6">Support</h4>
              <ul className="space-y-3 text-gray-400 text-lg">
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">Help Center</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">Contact Us</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">Privacy Policy</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">Terms of Service</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-6">Destinations</h4>
              <ul className="space-y-3 text-gray-400 text-lg">
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">Europe</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">Asia</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">North America</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">Australia</Button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-lg">
            <p>&copy; 2024 BookIt. All rights reserved. Made with ❤️ for travelers worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
'use client';
import { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { Star, MapPin, Clock, Users, ArrowRight, Shield, Award, HeadphonesIcon, Search, Zap, Plane, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import ExperienceCard from '@/components/ExperienceCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import FlightSearch from '@/components/FlightSearch';
import UniversalSearch from '@/components/UniversalSearch';

export default function Home() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Experiences', count: 12 },
    { id: 'Adventure', name: 'Adventure', count: 8 },
    { id: 'Cultural', name: 'Cultural', count: 15 },
    { id: 'Food & Drink', name: 'Food & Drink', count: 6 },
    { id: 'City Tour', name: 'City Tours', count: 10 },
    { id: 'Nature', name: 'Nature', count: 7 },
  ];

  const featuredDestinations = [
    {
      name: 'Colosseum',
      country: 'Italy',
      image: '/rome.jpg',
      experiences: 8
    },
    {
      name: 'Taj Mahal',
      country: 'India',
      image: '/agra.jpg',
      experiences: 15
    },
    {
      name: 'Angkor Wat',
      country: 'Cambodia',
      image: '/cambodia.jpg',
      experiences: 12
    },
    {
      name: 'Santorini',
      country: 'Greece',
      image: '/greece.jpg',
      experiences: 6
    },
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
      setExperiences(response.data.experiences || []);
    } catch (err) {
      setError('Failed to load experiences. Please try again later.');
      console.error('Error fetching experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchExperiences();
  };

  if (loading && experiences.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="large" text="Loading amazing experiences..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/amsterdam.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        <div className="relative nexis-container z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 mb-6 px-4 py-2 text-sm">
              <Zap className="w-3 h-3 mr-1" />
              Discover Amazing Experiences & Flights
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Explore the
              <span className="block bg-linear-to-r from-white to-blue-100 bg-clip-text text-transparent"> World's Wonders</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
              Book unforgettable experiences and flights to iconic destinations worldwide with Nexis
            </p>
          </div>

          {/* Universal Search Component */}
          <div className="mt-12">
            <UniversalSearch />
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent"></div>
      </section>

      {/* Quick Categories */}
      <section className="py-8 bg-background -mt-20 relative z-10">
        <div className="nexis-container">
          <div className="flex overflow-x-auto space-x-3 pb-2 hide-scrollbar">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`shrink-0 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'hover:border-blue-600 hover:text-blue-600'
                }`}
              >
                <span>{category.name}</span>
                <Badge variant="secondary" className="ml-2 bg-white/20 text-current">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 bg-background">
        <div className="nexis-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Destinations</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover iconic landmarks and hidden gems across the globe with Nexis
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((destination) => (
              <Card key={destination.name} className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold">{destination.name}</h3>
                    <p className="text-white/80">{destination.country}</p>
                  </div>
                  <Badge className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white border-0">
                    {destination.experiences} tours
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/destinations">
                Explore All Destinations
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Flight Search */}
      <section className="py-16 bg-gray-50">
        <div className="nexis-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect Flight</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Search and compare flights from all major airlines
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <FlightSearch />
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/flights">
                Advanced Flight Search
                <Plane className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-16 bg-background">
        <div className="nexis-container">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Featured Experiences
              </h2>
              <p className="text-xl text-muted-foreground">
                Curated selection of top-rated activities and tours by Nexis
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-lg py-2 px-4 bg-white">
                {experiences.length} experiences
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {experiences.map((experience) => (
                    <ExperienceCard key={experience._id} experience={experience} />
                  ))}
                </div>
              ) : (
                <Card className="max-w-md mx-auto">
                  <CardContent className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">No experiences found</h3>
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
                        className="w-full bg-blue-600 text-white"
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
      <section className="py-16 bg-gray-50">
        <div className="nexis-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Travelers Choose Nexis
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing you with the best travel experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl mb-4">Secure Booking</CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  Your payments are protected with bank-level security and your personal data is always safe with Nexis.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-yellow-600" />
                </div>
                <CardTitle className="text-2xl mb-4">Best Price Guarantee</CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  Found a lower price elsewhere? We'll match it and give you an additional 10% discount.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HeadphonesIcon className="w-8 h-8 text-blue-600" />
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
        <div className="nexis-container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of travelers who trust Nexis for unforgettable experiences and seamless bookings
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/experiences">
                Explore All Experiences
              </Link>
            </Button>
            <Button asChild variant="outline" className="px-8 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/flights">
                Search Flights
              </Link>
            </Button>
            <Button asChild variant="outline" className="px-8 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/destinations">
                Browse Destinations
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="nexis-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Compass className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold">Nexis</span>
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
            <p>&copy; 2024 Nexis. All rights reserved. Made with ❤️ for travelers worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
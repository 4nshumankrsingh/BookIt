'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Star, MapPin, Clock, Users, ArrowRight, Shield, Award, Globe, Search, Heart, Zap } from 'lucide-react';
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
    { id: 'all', name: 'All Experiences', icon: Globe, count: 12 },
    { id: 'Sailing', name: 'Sailing & Boating', icon: Globe, count: 8 },
    { id: 'Hiking', name: 'Hiking & Trekking', icon: Globe, count: 15 },
    { id: 'Food & Drink', name: 'Food & Drink', icon: Globe, count: 6 },
    { id: 'City Tour', name: 'City Tours', icon: Globe, count: 10 },
    { id: 'Adventure', name: 'Adventure', icon: Globe, count: 7 },
  ];

  const featuredDestinations = [
    {
      name: 'Taj Mahal',
      country: 'India',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      experiences: 15
    },
    {
      name: 'Eiffel Tower',
      country: 'France',
      image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      experiences: 12
    },
    {
      name: 'Colosseum',
      country: 'Italy',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
      experiences: 8
    },
    {
      name: 'Angkor Wat',
      country: 'Cambodia',
      image: 'https://images.unsplash.com/photo-1589810635657-232948472d98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
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
      <section className="relative bookit-section-lg bg-linear-to-br from-bookit-500/10 via-bookit-50 to-blue-50 overflow-hidden">
        <div className="bookit-container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bookit-badge-primary mb-6 bookit-fade-in">
              <Zap className="w-3 h-3 mr-1" />
              Discover Amazing Experiences
            </Badge>
            
            <h1 className="bookit-display-lg mb-6 bookit-fade-in">
              Explore the World's
              <span className="bookit-text-gradient"> Greatest </span>
              Landmarks
            </h1>
            
            <p className="bookit-body-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed bookit-fade-in">
              Book unforgettable experiences at iconic destinations worldwide. From ancient wonders to modern marvels, create memories that last a lifetime.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bookit-fade-in">
              <Card className="bookit-card-lg shadow-bookit-card-hover border-bookit-200">
                <CardContent className="p-2">
                  <div className="flex items-center">
                    <div className="flex-1 flex items-center px-4">
                      <Search className="w-5 h-5 text-muted-foreground mr-3" />
                      <Input
                        type="text"
                        placeholder="Search experiences, locations, activities..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="bookit-input border-0 text-lg shadow-none focus-visible:ring-0"
                      />
                    </div>
                    <Button 
                      onClick={fetchExperiences}
                      className="bookit-btn-primary px-8 py-4 text-lg font-semibold"
                    >
                      Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-bookit-500 to-transparent"></div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="bookit-section-sm bg-background border-b">
        <div className="bookit-container">
          <div className="flex overflow-x-auto bookit-space-x-sm pb-2 hide-scrollbar">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={`bookit-btn shrink-0 px-6 py-3 font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? 'bookit-btn-primary scale-105'
                      : 'bookit-btn-outline'
                  }`}
                >
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="bookit-section bg-background">
        <div className="bookit-container">
          <div className="text-center mb-12">
            <h2 className="bookit-heading-lg mb-4">Featured Destinations</h2>
            <p className="bookit-body-lg text-muted-foreground max-w-2xl mx-auto">
              Explore iconic landmarks and hidden gems across the globe
            </p>
          </div>

          <div className="bookit-grid bookit-grid-cols-2 lg:bookit-grid-cols-4 gap-6">
            {featuredDestinations.map((destination, index) => (
              <Card key={destination.name} className="bookit-experience-card bookit-hover-lift group overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="bookit-heading-sm font-semibold">{destination.name}</h3>
                    <p className="bookit-caption text-white/80">{destination.country}</p>
                  </div>
                  <Badge className="absolute top-3 right-3 bookit-badge-primary">
                    {destination.experiences} tours
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="bookit-section bg-muted/30">
        <div className="bookit-container">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-4">
            <div>
              <h2 className="bookit-heading-lg mb-3">
                Featured Experiences
              </h2>
              <p className="bookit-body-lg text-muted-foreground">
                Curated selection of top-rated activities and tours
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bookit-badge-secondary text-lg py-2 px-4">
                {experiences.length} of {pagination.totalExperiences || 0} experiences
              </Badge>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <Card className="max-w-md mx-auto border-error-200">
                <CardContent className="p-8">
                  <p className="text-error-800 mb-4">{error}</p>
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
                <div className="bookit-grid bookit-grid-cols-1 md:bookit-grid-cols-2 lg:bookit-grid-cols-3 xl:bookit-grid-cols-4 gap-6">
                  {experiences.map((experience) => (
                    <ExperienceCard key={experience._id} experience={experience} />
                  ))}
                </div>
              ) : (
                <Card className="max-w-md mx-auto bookit-card-md">
                  <CardContent className="text-center py-12">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="bookit-heading-sm mb-3">No experiences found</h3>
                    <p className="bookit-body-md text-muted-foreground mb-6">
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
                        className="w-full bookit-btn-primary"
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
      <section className="bookit-section bg-background">
        <div className="bookit-container">
          <div className="text-center mb-12">
            <h2 className="bookit-heading-lg mb-4">
              Why Travelers Choose BookIt
            </h2>
            <p className="bookit-body-lg text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing you with the best booking experience
            </p>
          </div>
          
          <div className="bookit-grid bookit-grid-cols-1 md:bookit-grid-cols-3 gap-8">
            <Card className="bookit-card-md text-center bookit-hover-lift">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-success-600" />
                </div>
                <CardTitle className="bookit-heading-sm mb-4">Secure Booking</CardTitle>
                <CardDescription className="bookit-body-md leading-relaxed">
                  Your payments are protected with bank-level security and your personal data is always safe with us.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="bookit-card-md text-center bookit-hover-lift">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-warning-600" />
                </div>
                <CardTitle className="bookit-heading-sm mb-4">Best Price Guarantee</CardTitle>
                <CardDescription className="bookit-body-md leading-relaxed">
                  Found a lower price elsewhere? We'll match it and give you an additional 10% discount.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="bookit-card-md text-center bookit-hover-lift">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-bookit-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-bookit-600" />
                </div>
                <CardTitle className="bookit-heading-sm mb-4">24/7 Support</CardTitle>
                <CardDescription className="bookit-body-md leading-relaxed">
                  Our dedicated support team is available around the clock to help with any questions or issues.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bookit-section bookit-gradient-primary text-white">
        <div className="bookit-container text-center">
          <h2 className="bookit-display-sm mb-6">
            Ready for Your Next Adventure?
          </h2>
          <p className="bookit-body-lg text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of travelers who trust BookIt for unforgettable experiences and seamless bookings
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" className="bookit-btn-lg">
              <Link href="/experiences">
                Explore All Experiences
              </Link>
            </Button>
            <Button variant="outline" className="bookit-btn-lg border-2 border-white text-white hover:bg-white hover:text-bookit-600">
              Contact Our Team
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-16 border-t">
        <div className="bookit-container">
          <div className="bookit-grid bookit-grid-cols-1 md:bookit-grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bookit-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="bookit-heading-sm bookit-text-gradient">BookIt</span>
              </div>
              <p className="bookit-body-md text-muted-foreground leading-relaxed">
                Your trusted partner for amazing travel experiences and adventure bookings worldwide.
              </p>
            </div>
            <div>
              <h4 className="bookit-heading-sm mb-6">Company</h4>
              <ul className="bookit-space-y-3 bookit-body-md text-muted-foreground">
                <li><Button variant="link" className="text-muted-foreground hover:text-foreground p-0 h-auto">About Us</Button></li>
                <li><Button variant="link" className="text-muted-foreground hover:text-foreground p-0 h-auto">Careers</Button></li>
                <li><Button variant="link" className="text-muted-foreground hover:text-foreground p-0 h-auto">Blog</Button></li>
                <li><Button variant="link" className="text-muted-foreground hover:text-foreground p-0 h-auto">Press</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="bookit-heading-sm mb-6">Support</h4>
              <ul className="bookit-space-y-3 bookit-body-md text-muted-foreground">
                <li><Button variant="link" className="text-muted-foreground hover:text-foreground p-0 h-auto">Help Center</Button></li>
                <li><Button variant="link" className="text-muted-foreground hover:text-foreground p-0 h-auto">Contact Us</Button></li>
                <li><Button variant="link" className="text-muted-foreground hover:text-foreground p-0 h-auto">Privacy Policy</Button></li>
                <li><Button variant="link" className="text-muted-foreground hover:text-foreground p-0 h-auto">Terms of Service</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="bookit-heading-sm mb-6">Destinations</h4>
              <ul className="bookit-space-y-3 bookit-body-md text-muted-foreground">
                <li><Button variant="link" className="text-muted-foreground hover:text-foreground p-0 h-auto">Europe</Button></li>
                <li><Button variant="link" className="text-muted-foreground hover:text-foreground p-0 h-auto">Asia</Button></li>
                <li><Button variant="link" className="text-muted-foreground hover:text-foreground p-0 h-auto">North America</Button></li>
                <li><Button variant="link" className="text-muted-foreground hover:text-foreground p-0 h-auto">Australia</Button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 text-center bookit-body-md text-muted-foreground">
            <p>&copy; 2024 BookIt. All rights reserved. Made with ❤️ for travelers worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
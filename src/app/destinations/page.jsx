'use client';
import { useState, useEffect } from 'react';
import { Search, MapPin, Plane, Star, Users, Calendar, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const continents = [
    { id: 'all', name: 'All Continents' },
    { id: 'asia', name: 'Asia' },
    { id: 'europe', name: 'Europe' },
    { id: 'north-america', name: 'North America' },
    { id: 'south-america', name: 'South America' },
    { id: 'africa', name: 'Africa' },
    { id: 'oceania', name: 'Oceania' },
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'beach', name: 'Beach', icon: '🏖️' },
    { id: 'mountain', name: 'Mountain', icon: '⛰️' },
    { id: 'city', name: 'City', icon: '🏙️' },
    { id: 'historical', name: 'Historical', icon: '🏛️' },
    { id: 'adventure', name: 'Adventure', icon: '🧗' },
    { id: 'cultural', name: 'Cultural', icon: '🎎' },
  ];

  const popularDestinations = [
    {
      id: 1,
      name: 'Bali',
      country: 'Indonesia',
      continent: 'asia',
      category: 'beach',
      image: '/bali.jpg',
      rating: 4.8,
      reviews: 12450,
      description: 'Island paradise known for its volcanic mountains, iconic rice paddies, beaches and coral reefs.',
      price: '₹25,999',
      bestTime: 'Apr-Oct',
      experiences: 45
    },
    {
      id: 2,
      name: 'Paris',
      country: 'France',
      continent: 'europe',
      category: 'city',
      image: '/paris.jpg',
      rating: 4.7,
      reviews: 18920,
      description: 'The City of Light, famous for its art, fashion, gastronomy and culture.',
      price: '₹45,999',
      bestTime: 'Jun-Aug',
      experiences: 62
    },
    {
      id: 3,
      name: 'Tokyo',
      country: 'Japan',
      continent: 'asia',
      category: 'city',
      image: '/tokyo.jpg',
      rating: 4.9,
      reviews: 15680,
      description: 'Ultra-modern meets traditional in this vibrant, populous capital.',
      price: '₹38,999',
      bestTime: 'Mar-May',
      experiences: 58
    },
    {
      id: 4,
      name: 'Swiss Alps',
      country: 'Switzerland',
      continent: 'europe',
      category: 'mountain',
      image: '/swiss-alps.jpg',
      rating: 4.8,
      reviews: 8920,
      description: 'Majestic mountains, crystal-clear lakes, and charming villages.',
      price: '₹52,999',
      bestTime: 'Dec-Mar',
      experiences: 34
    },
    {
      id: 5,
      name: 'Santorini',
      country: 'Greece',
      continent: 'europe',
      category: 'beach',
      image: '/santorini.jpg',
      rating: 4.7,
      reviews: 11230,
      description: 'Stunning sunsets, white-washed buildings, and crystal-clear waters.',
      price: '₹41,999',
      bestTime: 'Jun-Sep',
      experiences: 28
    },
    {
      id: 6,
      name: 'Machu Picchu',
      country: 'Peru',
      continent: 'south-america',
      category: 'historical',
      image: '/machu-picchu.jpg',
      rating: 4.9,
      reviews: 7830,
      description: 'Ancient Incan citadel set high in the Andes Mountains.',
      price: '₹35,999',
      bestTime: 'May-Sep',
      experiences: 22
    },
    {
      id: 7,
      name: 'New York',
      country: 'USA',
      continent: 'north-america',
      category: 'city',
      image: '/new-york.jpg',
      rating: 4.6,
      reviews: 21450,
      description: 'The city that never sleeps, with iconic landmarks and vibrant culture.',
      price: '₹67,999',
      bestTime: 'Apr-Jun',
      experiences: 75
    },
    {
      id: 8,
      name: 'Maldives',
      country: 'Maldives',
      continent: 'asia',
      category: 'beach',
      image: '/maldives.jpg',
      rating: 4.8,
      reviews: 9450,
      description: 'Tropical paradise with overwater bungalows and pristine beaches.',
      price: '₹58,999',
      bestTime: 'Nov-Apr',
      experiences: 31
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadDestinations = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDestinations(popularDestinations);
      setFilteredDestinations(popularDestinations);
      setLoading(false);
    };

    loadDestinations();
  }, []);

  useEffect(() => {
    filterDestinations();
  }, [searchTerm, selectedContinent, selectedCategory, destinations]);

  const filterDestinations = () => {
    let filtered = destinations;

    if (searchTerm) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedContinent !== 'all') {
      filtered = filtered.filter(dest => dest.continent === selectedContinent);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(dest => dest.category === selectedCategory);
    }

    setFilteredDestinations(filtered);
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.icon || '📍';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="large" text="Loading amazing destinations..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-linear-to-r from-green-600 to-blue-700 text-white py-20">
        <div className="nexis-container text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Your Next Adventure
          </h1>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Explore breathtaking destinations around the world and create unforgettable memories
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search destinations, countries, or experiences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-lg border-0 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="nexis-container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Continent Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Continent</label>
                  <Select value={selectedContinent} onValueChange={setSelectedContinent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select continent" />
                    </SelectTrigger>
                    <SelectContent>
                      {continents.map(continent => (
                        <SelectItem key={continent.id} value={continent.id}>
                          {continent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center">
                            <span className="mr-2">{category.icon}</span>
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Results Count */}
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-800 text-center">
                    <strong>{filteredDestinations.length}</strong> destinations found
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Travel Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Destinations</span>
                  <Badge variant="secondary">50+</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Countries</span>
                  <Badge variant="secondary">35+</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Experiences</span>
                  <Badge variant="secondary">500+</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Happy Travelers</span>
                  <Badge variant="secondary">10K+</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Popular Destinations
                </h2>
                <p className="text-gray-600">
                  Discover amazing places to visit around the world
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <Select defaultValue="popular">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Destinations Grid */}
            {filteredDestinations.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <CardTitle className="text-xl mb-2">No Destinations Found</CardTitle>
                  <CardDescription>
                    Try adjusting your search criteria or browse different categories.
                  </CardDescription>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDestinations.map(destination => (
                  <Card key={destination.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-0">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <div className="w-full h-full bg-linear-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                          <span className="text-white text-lg font-semibold">{destination.name}</span>
                        </div>
                        <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800">
                          {getCategoryIcon(destination.category)} {destination.category}
                        </Badge>
                        <Badge className="absolute top-3 right-3 bg-black/70 text-white border-0">
                          {destination.price}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <CardTitle className="text-xl mb-1">{destination.name}</CardTitle>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">{destination.country}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-sm text-gray-600">
                              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                              <span>{destination.rating}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              ({destination.reviews.toLocaleString()})
                            </div>
                          </div>
                        </div>

                        <CardDescription className="mb-4 line-clamp-2">
                          {destination.description}
                        </CardDescription>

                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Best: {destination.bestTime}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {destination.experiences} experiences
                          </div>
                        </div>

                        <Button className="w-full group-hover:bg-blue-600 transition-colors">
                          <Plane className="w-4 h-4 mr-2" />
                          Explore Destination
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Load More */}
            {filteredDestinations.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Destinations
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
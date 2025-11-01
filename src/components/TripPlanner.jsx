'use client';
import { useState, useEffect } from 'react';
import { Plus, MapPin, Calendar, Users, Plane, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FlightSearch from './FlightSearch';
import FlightResults from './FlightResults';

export default function TripPlanner({ onTripCreated }) {
  const [tripData, setTripData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: [{ name: '', email: '', phone: '' }],
    notes: ''
  });

  const [selectedFlights, setSelectedFlights] = useState({
    outgoing: null,
    returning: null
  });

  const [selectedExperiences, setSelectedExperiences] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setTripData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTravelerChange = (index, field, value) => {
    const updatedTravelers = [...tripData.travelers];
    updatedTravelers[index][field] = value;
    setTripData(prev => ({
      ...prev,
      travelers: updatedTravelers
    }));
  };

  const addTraveler = () => {
    setTripData(prev => ({
      ...prev,
      travelers: [...prev.travelers, { name: '', email: '', phone: '' }]
    }));
  };

  const removeTraveler = (index) => {
    if (tripData.travelers.length > 1) {
      const updatedTravelers = tripData.travelers.filter((_, i) => i !== index);
      setTripData(prev => ({
        ...prev,
        travelers: updatedTravelers
      }));
    }
  };

  const handleFlightSelect = (flight, type) => {
    setSelectedFlights(prev => ({
      ...prev,
      [type]: flight
    }));
  };

  const calculateTotalCost = () => {
    const flightCost = (selectedFlights.outgoing?.price || 0) + (selectedFlights.returning?.price || 0);
    const experiencesCost = selectedExperiences.reduce((total, exp) => total + exp.finalPrice, 0);
    return flightCost + experiencesCost;
  };

  const handleCreateTrip = async () => {
    if (!tripData.title || !tripData.destination || !tripData.startDate || !tripData.endDate) {
      alert('Please fill in all required trip details');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...tripData,
          flights: selectedFlights,
          experiences: selectedExperiences,
          totalCost: calculateTotalCost()
        })
      });

      if (response.ok) {
        const newTrip = await response.json();
        if (onTripCreated) {
          onTripCreated(newTrip);
        }
        // Reset form
        setTripData({
          title: '',
          destination: '',
          startDate: '',
          endDate: '',
          travelers: [{ name: '', email: '', phone: '' }],
          notes: ''
        });
        setSelectedFlights({ outgoing: null, returning: null });
        setSelectedExperiences([]);
        setCurrentStep(1);
      } else {
        throw new Error('Failed to create trip');
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Trip Details', icon: MapPin },
    { number: 2, title: 'Flights', icon: Plane },
    { number: 3, title: 'Experiences', icon: Calendar },
    { number: 4, title: 'Review', icon: Users }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className={`ml-2 font-medium ${
                    currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <CardTitle>Trip Details</CardTitle>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Trip Title *</Label>
                  <Input
                    id="title"
                    value={tripData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Summer Vacation 2024"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination *</Label>
                  <Input
                    id="destination"
                    value={tripData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                    placeholder="e.g., Paris, France"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={tripData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={tripData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    min={tripData.startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Travelers</Label>
                  <Button type="button" variant="outline" onClick={addTraveler}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Traveler
                  </Button>
                </div>
                
                {tripData.travelers.map((traveler, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-between md:col-span-3 mb-2">
                      <span className="font-medium">Traveler {index + 1}</span>
                      {tripData.travelers.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTraveler(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input
                        value={traveler.name}
                        onChange={(e) => handleTravelerChange(index, 'name', e.target.value)}
                        placeholder="Full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={traveler.email}
                        onChange={(e) => handleTravelerChange(index, 'email', e.target.value)}
                        placeholder="Email address"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={traveler.phone}
                        onChange={(e) => handleTravelerChange(index, 'phone', e.target.value)}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Trip Notes</Label>
                <textarea
                  id="notes"
                  value={tripData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any special requirements or notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <Button onClick={() => setCurrentStep(2)} className="w-full">
                Continue to Flights
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <CardTitle>Flight Booking</CardTitle>
              
              <FlightSearch 
                onFlightSelect={(flight, type) => handleFlightSelect(flight, type)}
                selectedFlights={selectedFlights}
              />

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setCurrentStep(3)} className="flex-1">
                  Continue to Experiences
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <CardTitle>Add Experiences</CardTitle>
              
              <CardDescription>
                You can add experiences later from the destination page. 
                For now, let's review your trip details.
              </CardDescription>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Back
                </Button>
                <Button onClick={() => setCurrentStep(4)} className="flex-1">
                  Review Trip
                </Button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <CardTitle>Review Your Trip</CardTitle>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trip Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Trip Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <strong>Title:</strong> {tripData.title}
                    </div>
                    <div>
                      <strong>Destination:</strong> {tripData.destination}
                    </div>
                    <div>
                      <strong>Dates:</strong> {tripData.startDate} to {tripData.endDate}
                    </div>
                    <div>
                      <strong>Travelers:</strong> {tripData.travelers.length}
                    </div>
                  </CardContent>
                </Card>

                {/* Cost Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cost Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Flights:</span>
                      <span>₹{((selectedFlights.outgoing?.price || 0) + (selectedFlights.returning?.price || 0)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Experiences:</span>
                      <span>₹{selectedExperiences.reduce((total, exp) => total + exp.finalPrice, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>₹{calculateTotalCost().toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>
                  Back
                </Button>
                <Button 
                  onClick={handleCreateTrip} 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Creating Trip...' : 'Create Trip Plan'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
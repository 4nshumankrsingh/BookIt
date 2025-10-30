'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { ArrowLeft, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import LoadingSpinner from '@/components/LoadingSpinner';
import PriceSummary from '@/components/PriceSummary';
import PromoCodeInput from '@/components/PromoCodeInput';

export default function Checkout() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [experience, setExperience] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [promoApplied, setPromoApplied] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    participants: 1
  });

  const [errors, setErrors] = useState({});

  const experienceId = searchParams.get('experienceId');
  const slotId = searchParams.get('slotId');
  const initialParticipants = parseInt(searchParams.get('participants')) || 1;

  useEffect(() => {
    if (experienceId && slotId) {
      fetchExperience();
    } else {
      router.push('/');
    }
  }, [experienceId, slotId, router]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, participants: initialParticipants }));
  }, [initialParticipants]);

  const fetchExperience = async () => {
    try {
      const response = await axios.get(`/api/experiences/${experienceId}`);
      const exp = response.data;
      setExperience(exp);
      
      // Find the selected slot from all available slots
      const allSlots = Object.values(exp.slotsByDate).flat();
      const slot = allSlots.find(s => s._id === slotId);
      
      if (slot) {
        setSelectedSlot(slot);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching experience:', error);
      router.push('/');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePromoApply = (promoData) => {
    setPromoApplied(promoData);
  };

  const handlePromoRemove = () => {
    setPromoApplied(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/bookings', {
        experienceId,
        slotId,
        userInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        participants: formData.participants,
        promoCode: promoApplied ? promoApplied.promo.code : null
      });

      if (response.data.success) {
        // Store booking data for the result page
        localStorage.setItem(`booking_${response.data.booking.id}`, JSON.stringify(response.data.booking));
        router.push(`/bookings/${response.data.booking.id}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create booking. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!selectedSlot) return { base: 0, discount: 0, final: 0 };
    
    const basePrice = selectedSlot.price * formData.participants;
    const discount = promoApplied ? promoApplied.discount : 0;
    const finalPrice = Math.max(0, basePrice - discount);

    return { base: basePrice, discount, final: finalPrice };
  };

  const { base, discount, final } = calculatePrice();
  const availableSpots = selectedSlot ? selectedSlot.availableSpots : 0;

  if (!experience || !selectedSlot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" text="Loading checkout..." />
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
              <Link href={`/experiences/${experienceId}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Experience
              </Link>
            </Button>
            <div className="flex items-center space-x-2 text-gray-600">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="font-medium">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8 border-0 shadow-none bg-transparent">
          <CardContent className="p-0">
            <CardTitle className="text-3xl mb-2">Complete Your Booking</CardTitle>
            <CardDescription>Enter your details to secure your spot</CardDescription>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <CardTitle className="text-xl mb-4">Personal Information</CardTitle>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                          <CardDescription className="text-red-600">{errors.name}</CardDescription>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                          <CardDescription className="text-red-600">{errors.email}</CardDescription>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && (
                          <CardDescription className="text-red-600">{errors.phone}</CardDescription>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Booking Details */}
                  <div>
                    <CardTitle className="text-xl mb-4">Booking Details</CardTitle>
                    
                    <div className="space-y-2">
                      <Label htmlFor="participants">Number of Participants *</Label>
                      <select
                        id="participants"
                        name="participants"
                        value={formData.participants}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        {[...Array(Math.min(availableSpots, 10))].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i + 1 === 1 ? 'person' : 'people'}
                          </option>
                        ))}
                      </select>
                      <CardDescription>
                        {availableSpots} spots available for this time slot
                      </CardDescription>
                    </div>
                  </div>

                  <Separator />

                  {/* Promo Code */}
                  <div>
                    <CardTitle className="text-xl mb-4">Promo Code</CardTitle>
                    <PromoCodeInput
                      baseAmount={base}
                      onPromoApply={handlePromoApply}
                      onPromoRemove={handlePromoRemove}
                      appliedPromo={promoApplied}
                    />
                  </div>

                  <Separator />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full text-lg py-6"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="small" />
                        <span className="ml-2">Processing...</span>
                      </div>
                    ) : (
                      `Complete Booking - $${final}`
                    )}
                  </Button>

                  {/* Security Notice */}
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <Shield className="w-4 h-4 mr-2 text-green-500" />
                    Your information is secure and encrypted
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <PriceSummary
                experience={experience}
                selectedSlot={selectedSlot}
                participants={formData.participants}
                promoApplied={promoApplied}
                basePrice={base}
                discount={discount}
                finalPrice={final}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
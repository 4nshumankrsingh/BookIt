'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Checkout() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const [experience, setExperience] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    participants: 1
  });

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
      
      const slot = exp.slots.id(slotId);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePromoApply = async () => {
    if (!promoCode.trim()) return;

    setPromoLoading(true);
    setPromoError('');

    try {
      const basePrice = selectedSlot.price * formData.participants;
      const response = await axios.post('/api/promo/validate', {
        code: promoCode,
        amount: basePrice
      });

      if (response.data.valid) {
        setPromoApplied(response.data);
        setPromoError('');
      } else {
        setPromoApplied(null);
        setPromoError(response.data.error);
      }
    } catch (error) {
      setPromoApplied(null);
      setPromoError('Failed to validate promo code');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        promoCode: promoApplied ? promoCode : null
      });

      if (response.data.success) {
        router.push(`/bookings/${response.data.bookingId}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!selectedSlot) return { base: 0, discount: 0, final: 0 };
    
    const basePrice = selectedSlot.price * formData.participants;
    const discount = promoApplied ? promoApplied.discount : 0;
    const finalPrice = basePrice - discount;

    return { base: basePrice, discount, final: finalPrice };
  };

  const { base, discount, final } = calculatePrice();
  const availableSpots = selectedSlot ? selectedSlot.maxParticipants - selectedSlot.bookedParticipants : 0;

  if (!experience || !selectedSlot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Booking Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Participants
                </label>
                <select
                  name="participants"
                  value={formData.participants}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[...Array(availableSpots)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i + 1 === 1 ? 'person' : 'people'}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  {availableSpots} spots available
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter promo code"
                  />
                  <button
                    type="button"
                    onClick={handlePromoApply}
                    disabled={promoLoading}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
                  >
                    {promoLoading ? 'Applying...' : 'Apply'}
                  </button>
                </div>
                {promoError && (
                  <p className="text-red-600 text-sm mt-1">{promoError}</p>
                )}
                {promoApplied && (
                  <p className="text-green-600 text-sm mt-1">
                    Promo code applied! ${promoApplied.discount} discount
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 font-semibold"
              >
                {loading ? 'Processing...' : `Complete Booking - $${final}`}
              </button>
            </form>
          </div>

          {/* Right Column - Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
            <h2 className="text-xl font-semibold mb-6">Booking Summary</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">{experience.title}</h3>
                <p className="text-gray-600 text-sm">{experience.location}</p>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Date:</span>
                  <span>{new Date(selectedSlot.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Time:</span>
                  <span>{selectedSlot.startTime} - {selectedSlot.endTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Participants:</span>
                  <span>{formData.participants}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>${base}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-${discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>Total:</span>
                  <span>${final}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
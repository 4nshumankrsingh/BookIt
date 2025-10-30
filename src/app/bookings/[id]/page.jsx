'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { Check, Calendar, Clock, MapPin, Users, Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function BookingResult() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchBookingDetails();
    }
  }, [params.id]);

  const fetchBookingDetails = async () => {
    try {
      // Since we don't have a direct GET booking by ID endpoint yet,
      // we'll simulate the data structure based on the booking creation response
      // In a real application, you'd call: await axios.get(`/api/bookings/${params.id}`)
      
      // For now, we'll store booking data in localStorage during the booking process
      // and retrieve it here, or you can implement a proper API endpoint
      const storedBooking = localStorage.getItem(`booking_${params.id}`);
      
      if (storedBooking) {
        setBooking(JSON.parse(storedBooking));
      } else {
        // Fallback: redirect to home if booking not found
        router.push('/');
      }
    } catch (err) {
      setError('Failed to load booking details');
      console.error('Error fetching booking:', err);
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

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    alert('Receipt download functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" text="Loading booking details..." />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <CardTitle className="text-2xl mb-4">Booking Not Found</CardTitle>
            <CardDescription className="mb-8">
              {error || 'The booking you are looking for does not exist or has been cancelled.'}
            </CardDescription>
            <Button asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Experiences
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Button asChild variant="ghost">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <CardDescription>
              Booking Reference: {booking.bookingReference}
            </CardDescription>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="overflow-hidden">
          {/* Success Header */}
          <div className="bg-linear-to-r from-green-500 to-emerald-600 text-white p-8 text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10" />
            </div>
            <CardTitle className="text-4xl mb-4 text-white">Booking Confirmed!</CardTitle>
            <CardDescription className="text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
              Thank you for your booking. Your reservation has been confirmed and all details have been sent to your email.
            </CardDescription>
          </div>

          <CardContent className="p-8">
            {/* Booking Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <CardTitle className="text-2xl mb-6">Booking Information</CardTitle>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 shrink-0">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Date & Time</CardTitle>
                      <CardDescription>{formatDate(booking.experience.date)}</CardDescription>
                      <CardDescription>{booking.experience.startTime}</CardDescription>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 shrink-0">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Meeting Point</CardTitle>
                      <CardDescription>{booking.experience.meetingPoint}</CardDescription>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 shrink-0">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Participants</CardTitle>
                      <CardDescription>
                        {booking.participants} {booking.participants === 1 ? 'person' : 'people'}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <CardTitle className="text-2xl mb-6">Price Summary</CardTitle>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-600">
                        <span>Base Price:</span>
                        <span>${booking.totalPrice}</span>
                      </div>
                      {booking.discountApplied > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-${booking.discountApplied}</span>
                        </div>
                      )}
                      {booking.promoCode && (
                        <div className="flex justify-between text-gray-600 text-sm">
                          <span>Promo Code:</span>
                          <span>{booking.promoCode.code}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total Paid:</span>
                        <span>${booking.finalPrice}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center text-green-800">
                      <Check className="w-5 h-5 mr-2" />
                      <CardTitle className="text-lg">Payment Successful</CardTitle>
                    </div>
                    <CardDescription className="text-green-700">
                      Your payment has been processed successfully.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Customer Information */}
            <div className="pt-8">
              <CardTitle className="text-2xl mb-6">Customer Information</CardTitle>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <CardTitle className="text-lg mb-2">Contact Details</CardTitle>
                  <CardDescription>{booking.userInfo.name}</CardDescription>
                  <CardDescription>{booking.userInfo.email}</CardDescription>
                  <CardDescription>{booking.userInfo.phone}</CardDescription>
                </div>
                <div>
                  <CardTitle className="text-lg mb-2">Booking Status</CardTitle>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <Check className="w-4 h-4 mr-1" />
                    Confirmed
                  </Badge>
                  <CardDescription className="mt-2">
                    Booking ID: {booking.id}
                  </CardDescription>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8 py-4 text-lg">
                <Link href="/">
                  Book Another Experience
                </Link>
              </Button>
              <Button 
                onClick={handleDownloadReceipt}
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Receipt
              </Button>
            </div>

            {/* Help Section */}
            <Card className="mt-8">
              <CardContent className="text-center p-6">
                <CardTitle className="text-lg mb-4">Need Help?</CardTitle>
                <CardDescription className="mb-4">
                  If you have any questions about your booking, our support team is here to help.
                </CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="link" className="text-blue-600">Contact Support</Button>
                  <Button variant="link" className="text-blue-600">View FAQ</Button>
                  <Button variant="link" className="text-blue-600">Modify Booking</Button>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
'use client';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const DatePicker = ({ availableDates, selectedDate, onDateSelect }) => {
  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-3">
      {availableDates.map((date) => (
        <Button
          key={date}
          onClick={() => onDateSelect(date)}
          variant={selectedDate === date ? "default" : "outline"}
          className="w-full p-4 h-auto justify-start text-left"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-3" />
              <div>
                <div className="font-semibold">
                  {formatDisplayDate(date)}
                </div>
                <div className="text-sm opacity-70">
                  {formatFullDate(date)}
                </div>
              </div>
            </div>
            {selectedDate === date && (
              <div className="w-3 h-3 bg-white rounded-full"></div>
            )}
          </div>
        </Button>
      ))}
      
      {availableDates.length === 0 && (
        <Card>
          <CardContent className="text-center py-6">
            <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No available dates</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DatePicker;
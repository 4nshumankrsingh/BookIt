'use client';
import { useState } from 'react';
import axios from 'axios';
import { Tag, Check, X, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

const PromoCodeInput = ({ baseAmount, onPromoApply, onPromoRemove, appliedPromo }) => {
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    if (!promoCode.trim()) {
      setError('Please enter a promo code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/promo/validate', {
        code: promoCode,
        amount: baseAmount
      });

      if (response.data.valid) {
        onPromoApply(response.data);
        setError('');
      } else {
        setError(response.data.error);
        onPromoRemove();
      }
    } catch (err) {
      setError('Failed to validate promo code');
      onPromoRemove();
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setPromoCode('');
    setError('');
    onPromoRemove();
  };

  const handleInputChange = (e) => {
    setPromoCode(e.target.value.toUpperCase());
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  return (
    <div className="space-y-3">
      {appliedPromo ? (
        /* Applied Promo State */
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-green-800">
                    Promo code applied!
                  </div>
                  <div className="text-sm text-green-700">
                    {appliedPromo.promo.code} - ${appliedPromo.discount} discount
                  </div>
                </div>
              </div>
              <Button
                onClick={handleRemove}
                variant="ghost"
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            {appliedPromo.promo.description && (
              <div className="mt-2 text-sm text-green-700">
                {appliedPromo.promo.description}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Input State */
        <div className="space-y-2">
          <Label htmlFor="promo-code">Promo Code</Label>
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="promo-code"
                type="text"
                value={promoCode}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter promo code"
                disabled={loading}
                className="pl-10"
              />
            </div>
            <Button
              onClick={handleApply}
              disabled={loading || !promoCode.trim()}
              variant="secondary"
              className="min-w-20"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                'Apply'
              )}
            </Button>
          </div>
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-3">
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Available Promo Codes Hint */}
      {!appliedPromo && !error && (
        <div className="text-sm text-gray-500">
          Try codes: <span className="font-mono text-blue-600">SAVE10</span>,{' '}
          <span className="font-mono text-blue-600">FLAT100</span>
        </div>
      )}
    </div>
  );
};

export default PromoCodeInput;
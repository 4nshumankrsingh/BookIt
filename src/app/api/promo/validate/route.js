import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PromoCode from '@/models/PromoCode';

export async function POST(request) {
  try {
    await connectDB();
    const { code, amount, category } = await request.json();

    if (!code || amount === undefined) {
      return NextResponse.json(
        { error: 'Promo code and amount are required' },
        { status: 400 }
      );
    }

    const promo = await PromoCode.findOne({ 
      code: code.toUpperCase().trim(),
      isActive: true
    });

    if (!promo) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid promo code'
      });
    }

    // Check validity period
    const now = new Date();
    if (now < promo.validFrom || now > promo.validUntil) {
      return NextResponse.json({
        valid: false,
        error: 'Promo code has expired'
      });
    }

    // Check usage limit
    if (promo.usedCount >= promo.usageLimit) {
      return NextResponse.json({
        valid: false,
        error: 'Promo code usage limit reached'
      });
    }

    // Check minimum amount
    if (amount < promo.minAmount) {
      return NextResponse.json({
        valid: false,
        error: `Minimum amount of $${promo.minAmount} required to use this promo`
      });
    }

    // Check category restrictions if applicable
    if (category && promo.applicableCategories && promo.applicableCategories.length > 0) {
      if (!promo.applicableCategories.includes(category)) {
        return NextResponse.json({
          valid: false,
          error: 'This promo code is not applicable for the selected category'
        });
      }
    }

    // Calculate discount
    let discount = 0;
    if (promo.discountType === 'percentage') {
      discount = (amount * promo.discountValue) / 100;
      if (promo.maxDiscount && discount > promo.maxDiscount) {
        discount = promo.maxDiscount;
      }
    } else {
      discount = Math.min(promo.discountValue, amount); // Fixed discount, but can't exceed total amount
    }

    const finalAmount = Math.max(0, amount - discount);

    return NextResponse.json({
      valid: true,
      discount: Math.round(discount * 100) / 100, // Round to 2 decimal places
      finalAmount: Math.round(finalAmount * 100) / 100,
      promo: {
        code: promo.code,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        description: promo.description,
        minAmount: promo.minAmount,
        maxDiscount: promo.maxDiscount
      }
    });
  } catch (error) {
    console.error('Promo validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate promo code' },
      { status: 500 }
    );
  }
}
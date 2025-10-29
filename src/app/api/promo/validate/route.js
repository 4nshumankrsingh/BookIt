import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PromoCode from '@/models/PromoCode';

export async function POST(request) {
  try {
    await connectDB();
    const { code, amount } = await request.json();

    if (!code || !amount) {
      return NextResponse.json(
        { error: 'Code and amount are required' },
        { status: 400 }
      );
    }

    const promo = await PromoCode.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    });

    if (!promo) {
      return NextResponse.json(
        { valid: false, error: 'Invalid or expired promo code' }
      );
    }

    if (promo.usedCount >= promo.usageLimit) {
      return NextResponse.json(
        { valid: false, error: 'Promo code usage limit reached' }
      );
    }

    if (amount < promo.minAmount) {
      return NextResponse.json(
        { valid: false, error: `Minimum amount of $${promo.minAmount} required` }
      );
    }

    let discount = 0;
    if (promo.discountType === 'percentage') {
      discount = (amount * promo.discountValue) / 100;
      if (promo.maxDiscount && discount > promo.maxDiscount) {
        discount = promo.maxDiscount;
      }
    } else {
      discount = promo.discountValue;
    }

    return NextResponse.json({
      valid: true,
      discount,
      finalAmount: amount - discount,
      promo: {
        code: promo.code,
        discountType: promo.discountType,
        discountValue: promo.discountValue
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to validate promo code' },
      { status: 500 }
    );
  }
}
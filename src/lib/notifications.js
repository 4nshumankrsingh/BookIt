import { Resend } from 'resend';
import axios from 'axios';

const resend = new Resend(process.env.RESEND_API_KEY);

// Notification types
export const NOTIFICATION_TYPES = {
  PRICE_ALERT: 'price_alert',
  FLIGHT_STATUS: 'flight_status',
  TRIP_REMINDER: 'trip_reminder',
  BOOKING_CONFIRMATION: 'booking_confirmation',
  CHECKIN_REMINDER: 'checkin_reminder',
  GATE_CHANGE: 'gate_change',
  DELAY_ALERT: 'delay_alert'
};

// Notification channels
export const NOTIFICATION_CHANNELS = {
  EMAIL: 'email',
  PUSH: 'push',
  SMS: 'sms'
};

class NotificationService {
  constructor() {
    this.providers = {
      email: this.sendEmail.bind(this),
      push: this.sendPushNotification.bind(this),
      sms: this.sendSMS.bind(this)
    };
  }

  // Send notification via multiple channels
  async sendNotification(user, type, data, channels = ['email']) {
    const results = [];
    
    for (const channel of channels) {
      try {
        if (this.providers[channel]) {
          const result = await this.providers[channel](user, type, data);
          results.push({
            channel,
            success: true,
            result
          });
          
          // Log notification
          await this.logNotification(user, type, channel, data);
        }
      } catch (error) {
        console.error(`Notification failed for channel ${channel}:`, error);
        results.push({
          channel,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  // Email notification
  async sendEmail(user, type, data) {
    const emailConfig = this.getEmailConfig(type, data);
    
    const { data: result, error } = await resend.emails.send({
      from: 'Nexis Travel <notifications@nexis.travel>',
      to: user.email,
      subject: emailConfig.subject,
      html: this.renderEmailTemplate(type, data),
      text: this.renderTextTemplate(type, data)
    });

    if (error) {
      throw new Error(`Email failed: ${error.message}`);
    }

    return result;
  }

  // Push notification (using web push or service workers)
  async sendPushNotification(user, type, data) {
    // This would integrate with a push notification service
    // For now, we'll simulate the behavior
    console.log(`Push notification sent to ${user.name}:`, {
      type,
      title: this.getPushTitle(type, data),
      body: this.getPushBody(type, data),
      data
    });

    return { status: 'sent', channel: 'push' };
  }

  // SMS notification
  async sendSMS(user, type, data) {
    // This would integrate with an SMS provider like Twilio
    // For now, we'll simulate the behavior
    console.log(`SMS sent to ${user.phone}:`, {
      type,
      message: this.getSMSMessage(type, data)
    });

    return { status: 'sent', channel: 'sms' };
  }

  // Price alert specific notification
  async sendPriceAlert(alert, currentPrice, oldPrice) {
    const user = await this.getUser(alert.userId);
    const savings = alert.calculateSavings(currentPrice);
    const percentage = ((oldPrice - currentPrice) / oldPrice * 100).toFixed(1);

    const data = {
      alert,
      currentPrice,
      oldPrice,
      savings,
      percentage,
      route: alert.flightRoute,
      dates: alert.dates
    };

    return this.sendNotification(
      user,
      NOTIFICATION_TYPES.PRICE_ALERT,
      data,
      alert.alertConfig.notificationMethods
    );
  }

  // Flight status notification
  async sendFlightStatus(user, flight, statusUpdate) {
    const data = {
      flight,
      status: statusUpdate,
      user
    };

    return this.sendNotification(
      user,
      NOTIFICATION_TYPES.FLIGHT_STATUS,
      data,
      ['push', 'email'] // Default channels for flight status
    );
  }

  // Trip reminder notification
  async sendTripReminder(user, trip, daysUntil) {
    const data = {
      trip,
      daysUntil,
      user
    };

    return this.sendNotification(
      user,
      NOTIFICATION_TYPES.TRIP_REMINDER,
      data,
      ['email', 'push']
    );
  }

  // Email template configuration
  getEmailConfig(type, data) {
    const configs = {
      [NOTIFICATION_TYPES.PRICE_ALERT]: {
        subject: `💰 Price Drop Alert! Save ${data.percentage}% on your flight`
      },
      [NOTIFICATION_TYPES.FLIGHT_STATUS]: {
        subject: `✈️ Flight ${data.flight.flightNumber} Status Update`
      },
      [NOTIFICATION_TYPES.TRIP_REMINDER]: {
        subject: `📅 Your trip to ${data.trip.destination} is coming up!`
      },
      [NOTIFICATION_TYPES.BOOKING_CONFIRMATION]: {
        subject: `✅ Booking Confirmed - ${data.booking.reference}`
      }
    };

    return configs[type] || { subject: 'Notification from Nexis Travel' };
  }

  // Email template renderer
  renderEmailTemplate(type, data) {
    const templates = {
      [NOTIFICATION_TYPES.PRICE_ALERT]: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Great News! Flight Prices Have Dropped</h2>
          <p>We found better prices for your flight route:</p>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>${data.alert.flightRoute.fromName} → ${data.alert.flightRoute.toName}</h3>
            <p><strong>Departure:</strong> ${new Date(data.alert.dates.departure).toLocaleDateString()}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 15px 0;">
              <span style="text-decoration: line-through; color: #666;">₹${data.oldPrice}</span>
              <span style="font-size: 24px; font-weight: bold; color: #059669;">₹${data.currentPrice}</span>
            </div>
            <p style="color: #059669; font-weight: bold;">You save ₹${data.savings} (${data.percentage}%)!</p>
          </div>
          <a href="${process.env.NEXIS_URL}/flights?from=${data.alert.flightRoute.from}&to=${data.alert.flightRoute.to}&date=${data.alert.dates.departure}" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Book Now
          </a>
        </div>
      `,
      [NOTIFICATION_TYPES.FLIGHT_STATUS]: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Flight Status Update</h2>
          <p>Your flight ${data.flight.airline} ${data.flight.flightNumber} has been updated:</p>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>${data.flight.departure.airport} → ${data.flight.arrival.airport}</h3>
            <p><strong>Status:</strong> ${data.status.status}</p>
            <p><strong>Updated Time:</strong> ${new Date(data.status.timestamp).toLocaleString()}</p>
            ${data.status.message ? `<p><strong>Message:</strong> ${data.status.message}</p>` : ''}
          </div>
        </div>
      `
    };

    return templates[type] || '<p>Notification from Nexis Travel</p>';
  }

  // Text template for SMS and fallback
  renderTextTemplate(type, data) {
    const templates = {
      [NOTIFICATION_TYPES.PRICE_ALERT]: 
        `Price drop alert! ${data.alert.flightRoute.from} to ${data.alert.flightRoute.to}: ₹${data.oldPrice} → ₹${data.currentPrice}. Save ${data.percentage}%!`,
      [NOTIFICATION_TYPES.FLIGHT_STATUS]:
        `Flight ${data.flight.flightNumber} status: ${data.status.status}. ${data.status.message || ''}`
    };

    return templates[type] || 'Notification from Nexis Travel';
  }

  // Push notification titles
  getPushTitle(type, data) {
    const titles = {
      [NOTIFICATION_TYPES.PRICE_ALERT]: '💰 Flight Price Drop!',
      [NOTIFICATION_TYPES.FLIGHT_STATUS]: '✈️ Flight Status Update'
    };
    return titles[type] || 'Nexis Travel';
  }

  getPushBody(type, data) {
    const bodies = {
      [NOTIFICATION_TYPES.PRICE_ALERT]: 
        `Save ${data.percentage}% on ${data.alert.flightRoute.from} to ${data.alert.flightRoute.to}`,
      [NOTIFICATION_TYPES.FLIGHT_STATUS]:
        `${data.flight.flightNumber}: ${data.status.status}`
    };
    return bodies[type] || 'You have a new notification';
  }

  getSMSMessage(type, data) {
    return this.renderTextTemplate(type, data);
  }

  // Log notification to database (simplified)
  async logNotification(user, type, channel, data) {
    // In a real implementation, this would save to a notifications collection
    console.log('Notification logged:', {
      userId: user._id,
      type,
      channel,
      timestamp: new Date(),
      data: JSON.stringify(data)
    });
  }

  // Get user data (simplified - would come from your user service)
  async getUser(userId) {
    // This would typically fetch from your User model
    return { 
      _id: userId, 
      email: 'user@example.com', 
      name: 'User',
      phone: '+1234567890'
    };
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;
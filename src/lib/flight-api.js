import redisCache, { cacheKeys, CACHE_TTL } from './redis';

const RAPIDAPI_HOST = 'aerodatabox.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

// Common headers for all API requests
const getHeaders = () => ({
  'x-rapidapi-host': RAPIDAPI_HOST,
  'x-rapidapi-key': RAPIDAPI_KEY,
});

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${response.status} - ${error}`);
  }
  return response.json();
};

// Flight API Service with Redis Caching
export const flightAPI = {
  // Get airport departures and arrivals with caching
  async getAirportFlights(airportCode, options = {}) {
    const cacheKey = cacheKeys.flightSearch(
      airportCode, 
      options.direction || 'Both',
      new Date().toISOString().split('T')[0]
    );

    return redisCache.withCache(
      cacheKey,
      async () => {
        const {
          offsetMinutes = -120,
          durationMinutes = 720,
          direction = 'Both',
          withCancelled = false,
          withCodeshared = true,
          withCargo = true,
          withPrivate = true
        } = options;

        const params = new URLSearchParams({
          offsetMinutes: offsetMinutes.toString(),
          durationMinutes: durationMinutes.toString(),
          withLeg: 'true',
          direction,
          withCancelled: withCancelled.toString(),
          withCodeshared: withCodeshared.toString(),
          withCargo: withCargo.toString(),
          withPrivate: withPrivate.toString(),
          withLocation: 'false'
        });

        const response = await fetch(
          `https://${RAPIDAPI_HOST}/flights/airports/iata/${airportCode}?${params}`,
          {
            method: 'GET',
            headers: getHeaders(),
          }
        );

        return handleResponse(response);
      },
      CACHE_TTL.FLIGHT_SEARCH
    );
  },

  // Get airport details by IATA code with caching
  async getAirportByCode(iataCode) {
    return redisCache.withCache(
      cacheKeys.airportDetails(iataCode),
      async () => {
        const response = await fetch(
          `https://${RAPIDAPI_HOST}/airports/iata/${iataCode}`,
          {
            method: 'GET',
            headers: getHeaders(),
          }
        );

        return handleResponse(response);
      },
      CACHE_TTL.AIRPORT_DETAILS
    );
  },

  // Search airports by location with caching
  async searchAirportsByLocation(lat, lon, options = {}) {
    const {
      radiusKm = 50,
      limit = 10,
      withFlightInfoOnly = false
    } = options;

    const cacheKey = cacheKeys.airportSearchByLocation(lat, lon, radiusKm);

    return redisCache.withCache(
      cacheKey,
      async () => {
        const params = new URLSearchParams({
          lat: lat.toString(),
          lon: lon.toString(),
          radiusKm: radiusKm.toString(),
          limit: limit.toString(),
          withFlightInfoOnly: withFlightInfoOnly.toString()
        });

        const response = await fetch(
          `https://${RAPIDAPI_HOST}/airports/search/location?${params}`,
          {
            method: 'GET',
            headers: getHeaders(),
          }
        );

        return handleResponse(response);
      },
      CACHE_TTL.NEARBY_AIRPORTS
    );
  },

  // Get flight status by flight number and date with caching
  async getFlightStatus(flightNumber, date, options = {}) {
    const cacheKey = cacheKeys.flightStatus(flightNumber, date);

    return redisCache.withCache(
      cacheKey,
      async () => {
        const {
          withAircraftImage = false,
          withLocation = false,
          dateLocalRole = 'Both'
        } = options;

        const params = new URLSearchParams({
          withAircraftImage: withAircraftImage.toString(),
          withLocation: withLocation.toString(),
          dateLocalRole
        });

        const formattedDate = new Date(date).toISOString().split('T')[0];
        
        const response = await fetch(
          `https://${RAPIDAPI_HOST}/flights/number/${flightNumber}/${formattedDate}?${params}`,
          {
            method: 'GET',
            headers: getHeaders(),
          }
        );

        return handleResponse(response);
      },
      CACHE_TTL.FLIGHT_STATUS
    );
  },

  // Search flights between two airports on a specific date with caching
  async searchFlights(from, to, date) {
    const cacheKey = cacheKeys.flightSearch(from, to, date);

    return redisCache.withCache(
      cacheKey,
      async () => {
        try {
          // Get departures from origin airport
          const departures = await this.getAirportFlights(from, {
            direction: 'Departure',
            durationMinutes: 1440 // 24 hours
          });

          // Get arrivals at destination airport
          const arrivals = await this.getAirportFlights(to, {
            direction: 'Arrival',
            durationMinutes: 1440
          });

          // Filter and match flights (simplified logic)
          const matchingFlights = this.matchFlights(departures, arrivals, date);
          
          return matchingFlights;
        } catch (error) {
          console.error('Flight search error:', error);
          throw error;
        }
      },
      CACHE_TTL.FLIGHT_SEARCH
    );
  },

  // Helper function to match departures and arrivals
  matchFlights(departures, arrivals, targetDate) {
    const targetDateObj = new Date(targetDate);
    const matching = [];

    // Simple matching logic - in a real app, this would be more sophisticated
    departures.departures?.forEach(departure => {
      const departureTime = new Date(departure.departure.scheduledTimeUtc);
      
      if (departureTime.toDateString() === targetDateObj.toDateString()) {
        // Find potential matching arrivals
        const potentialArrivals = arrivals.arrivals?.filter(arrival => {
          const arrivalTime = new Date(arrival.arrival.scheduledTimeUtc);
          return arrivalTime > departureTime;
        });

        if (potentialArrivals && potentialArrivals.length > 0) {
          matching.push({
            departure,
            arrival: potentialArrivals[0],
            duration: this.calculateFlightDuration(departureTime, new Date(potentialArrivals[0].arrival.scheduledTimeUtc))
          });
        }
      }
    });

    return matching;
  },

  // Calculate flight duration in hours and minutes
  calculateFlightDuration(departureTime, arrivalTime) {
    const durationMs = arrivalTime - departureTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes, totalMinutes: hours * 60 + minutes };
  },

  // Format flight time for display
  formatFlightTime(dateTime) {
    return new Date(dateTime).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  },

  // Format flight duration for display
  formatDuration(duration) {
    if (duration.hours === 0) {
      return `${duration.minutes}m`;
    } else if (duration.minutes === 0) {
      return `${duration.hours}h`;
    } else {
      return `${duration.hours}h ${duration.minutes}m`;
    }
  },

  // Get Redis cache statistics
  async getCacheStats() {
    return redisCache.health();
  },

  // Clear flight search cache
  async clearFlightCache(from, to, date) {
    const cacheKey = cacheKeys.flightSearch(from, to, date);
    return redisCache.del(cacheKey);
  }
};

export default flightAPI;
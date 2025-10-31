
export const authConfig = {
  // Required configuration
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  
  // Database configuration
  database: {
    type: "mongodb",
    url: process.env.MONGODB_URI,
  },
  
  // Email and password configuration
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true when you add email service
  },
  
  // Social providers - Only Google
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }
    }),
  },
  
  // User configuration
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
      },
      preferences: {
        type: "object",
        required: false,
        default: {
          categories: [],
          notifications: {
            email: true,
            sms: false
          }
        }
      }
    }
  },
  
  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
  },
  
  // Rate limiting
  rateLimit: {
    enabled: true,
    window: 60, // 1 minute
    max: 10, // 10 requests per minute
  },
  
  // CORS configuration for Indian domains
  trustHost: true,
  cors: {
    origin: [
      "http://localhost:3000",
      "https://bookit.in",
      "https://www.bookit.in",
      "https://staging.bookit.in"
    ],
    credentials: true,
  }
};

// ... (rest of the helper functions remain the same)
// [Previous helper functions: isAuthenticated, getCurrentUser, signUp, signIn, etc.]
// They remain unchanged from the previous version

export default authConfig;
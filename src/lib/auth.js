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
        scope: ["email", "profile"],
        authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenUrl: "https://oauth2.googleapis.com/token",
        userInfoUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
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

// Helper function to check if user is authenticated
export async function isAuthenticated(request) {
  // This would typically check the session cookie or token
  // For now, we'll return a mock implementation
  return new Promise((resolve) => {
    resolve({ isAuthenticated: false, user: null });
  });
}

// Helper function to get current user
export async function getCurrentUser(request) {
  // This would typically get user from session
  // For now, we'll return a mock implementation
  return new Promise((resolve) => {
    resolve(null);
  });
}

// Sign up function
export async function signUp(email, password, name) {
  // This would integrate with Better Auth
  // For now, we'll return a mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, user: { id: '1', email, name } });
    }, 1000);
  });
}

// Sign in function
export async function signIn(email, password) {
  // This would integrate with Better Auth
  // For now, we'll return a mock implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        resolve({ success: true, user: { id: '1', email, name: email.split('@')[0] } });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
}

// Sign out function
export async function signOut() {
  // This would clear the session
  // For now, we'll return a mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
}

export default authConfig;
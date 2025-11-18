import { rateLimit } from 'express-rate-limit' // sets a limit for how many times an ip address can try a route

// The generel rateLimit 
export const genralLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
});

// The authentication (log in) rateLimit
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
	limit: 10, // limits the authorization to 10 requests
	message: { success: false, message: "Too many login attempts. Try again in 15 minutes." },
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
	ipv6Subnet: 56, 
});


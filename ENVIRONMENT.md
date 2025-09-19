# Environment Configuration Guide

## Overview

This application uses environment variables for configuration management to support different deployment environments (development, staging, production) and to keep sensitive information secure.

## Environment Files Structure

### Available Environment Files

- `.env.example` - Template with all available environment variables and documentation
- `.env.development` - Development-specific configuration
- `.env.production` - Production-specific configuration
- `.env.local` - Local overrides (ignored by git, create manually)

### Git Handling

- `.env.example` and `.env.development` are tracked in git for team consistency
- `.env.production`, `.env.staging`, and `.env*.local` files are ignored by git for security

## Quick Setup

### 1. For Development

```bash
# Copy the development environment file to .env.local
cp .env.development .env.local

# Or start with the example template
cp .env.example .env.local
```

### 2. Configure Your Values

Edit `.env.local` with your specific configuration:

```env
# Required Variables
NEXT_PUBLIC_API_URL=https://api.jeepedia.in/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Add your analytics IDs
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id-here
```

### 3. Start Development

```bash
npm run dev
```

## Environment Variables Reference

### 🚀 Deployment Configuration

| Variable              | Description                | Default       | Required |
| --------------------- | -------------------------- | ------------- | -------- |
| `NODE_ENV`            | Node environment           | `development` | No       |
| `NEXT_PUBLIC_APP_ENV` | App environment identifier | `development` | No       |

### 🌐 API Configuration

| Variable                 | Description       | Default                      | Required |
| ------------------------ | ----------------- | ---------------------------- | -------- |
| `NEXT_PUBLIC_API_URL`    | Main API endpoint | -                            | **Yes**  |
| `NEXT_PUBLIC_CDN_URL`    | CDN base URL      | `https://res.cloudinary.com` | No       |
| `NEXT_PUBLIC_ASSETS_URL` | Assets base URL   | `https://assets.jeepedia.in` | No       |

### 🏠 Website Configuration

| Variable                     | Description            | Default                 | Required |
| ---------------------------- | ---------------------- | ----------------------- | -------- |
| `NEXT_PUBLIC_SITE_URL`       | Main website URL       | -                       | **Yes**  |
| `NEXT_PUBLIC_DEV_TUNNEL_URL` | Development tunnel URL | -                       | No       |
| `NEXT_PUBLIC_CONTACT_EMAIL`  | Contact email          | `jeepedia.in@gmail.com` | No       |

### 📱 Social Media

| Variable                    | Description         | Default                                 | Required |
| --------------------------- | ------------------- | --------------------------------------- | -------- |
| `NEXT_PUBLIC_DISCORD_URL`   | Discord server link | `https://discord.gg/Z8s9JECw4C`         | No       |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Instagram profile   | `https://www.instagram.com/jeepedia.in` | No       |
| `NEXT_PUBLIC_GITHUB_URL`    | GitHub organization | `https://github.com/J2J-App`            | No       |

### 📊 Analytics & Tracking

| Variable                        | Description                 | Default                            | Required |
| ------------------------------- | --------------------------- | ---------------------------------- | -------- |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID`  | Umami analytics website ID  | -                                  | No       |
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL`  | Umami script URL            | `https://cloud.umami.is/script.js` | No       |
| `NEXT_PUBLIC_GOOGLE_ADSENSE_ID` | Google AdSense publisher ID | -                                  | No       |

### 🎛️ Feature Flags

| Variable                          | Description              | Default | Required |
| --------------------------------- | ------------------------ | ------- | -------- |
| `NEXT_PUBLIC_ENABLE_ANALYTICS`    | Enable/disable analytics | `true`  | No       |
| `NEXT_PUBLIC_ENABLE_CONSOLE_LOGS` | Enable debug logging     | `false` | No       |
| `NEXT_PUBLIC_MAINTENANCE_MODE`    | Enable maintenance mode  | `false` | No       |

### ⚡ Performance

| Variable                  | Description              | Default | Required |
| ------------------------- | ------------------------ | ------- | -------- |
| `NEXT_PUBLIC_API_TIMEOUT` | API request timeout (ms) | `10000` | No       |
| `NEXT_PUBLIC_MAX_RETRIES` | Max API retry attempts   | `3`     | No       |

## Environment-Specific Configuration

### Development Environment

- Analytics disabled by default
- Console logging enabled
- Localhost site URL
- Extended API timeout for debugging

### Production Environment

- Analytics enabled
- Console logging disabled
- Production site URL
- Optimized performance settings

## Configuration Usage in Code

### Importing Configuration

```typescript
import { API_URL, SOCIAL_LINKS, FEATURES } from "@/config";
```

### Using Configuration

```typescript
// API calls
const response = await fetch(`${API_URL}/v2/users`);

// Social media links
<a href={SOCIAL_LINKS.discord}>Join Discord</a>;

// Feature flags
{
  FEATURES.enableAnalytics && <AnalyticsComponent />;
}
```

### Environment Information

```typescript
import { ENV } from "@/config";

if (ENV.isDevelopment) {
  console.log("Development mode");
}
```

## Troubleshooting

### Common Issues

#### ❌ "Missing required environment variables" error

```
Missing required environment variables: API_URL, SITE_URL
```

**Solution:** Ensure `.env.local` contains the required variables:

```env
NEXT_PUBLIC_API_URL=https://api.jeepedia.in/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### ❌ Environment variables not loading

1. Check file naming (must start with `.env`)
2. Ensure variables start with `NEXT_PUBLIC_` for client-side access
3. Restart development server after changes
4. Verify file is in project root directory

#### ❌ Analytics not working

1. Check `NEXT_PUBLIC_ENABLE_ANALYTICS=true`
2. Verify analytics IDs are set correctly
3. Check browser console for script loading errors

### Debugging Environment Configuration

```typescript
import { ENV, devLog } from "@/config";

// Check current environment
devLog("Current environment:", ENV.appEnv);
devLog("Is development:", ENV.isDevelopment);

// Log all config values (development only)
if (ENV.isDevelopment) {
  console.log("Configuration loaded:", {
    API_URL,
    SITE_URL,
    FEATURES,
    // ... other config values
  });
}
```

## Security Best Practices

### ✅ Do:

- Use `NEXT_PUBLIC_` prefix only for client-side variables
- Keep sensitive keys in server-side environment variables
- Use different values for different environments
- Document all environment variables in `.env.example`

### ❌ Don't:

- Commit `.env.local` or `.env.production` files
- Put sensitive API keys in `NEXT_PUBLIC_` variables
- Use production values in development environment
- Hardcode URLs or configuration in components

## Deployment

### Vercel

Environment variables are automatically loaded from `.env.production` in production builds.

### Custom Deployment

1. Set environment variables in your hosting platform
2. Ensure all required variables are present
3. Use production-optimized values
4. Test configuration before going live

## Migration from Hardcoded Values

If migrating from hardcoded configuration:

1. **Identify hardcoded values** in your codebase
2. **Add to environment files** with appropriate defaults
3. **Update imports** to use new config structure
4. **Test thoroughly** in development environment
5. **Deploy incrementally** to avoid breaking changes

---

For additional help or questions about environment configuration, refer to the [Next.js Environment Variables documentation](https://nextjs.org/docs/basic-features/environment-variables).

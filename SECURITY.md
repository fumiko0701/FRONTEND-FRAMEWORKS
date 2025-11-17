# Security Recommendations

## CodeQL Findings

### Missing Rate Limiting
**Status**: Documented (Not Fixed)
**Severity**: Low
**Location**: server.js:25-27

**Description**: 
The route handler that serves static files in production mode is not rate-limited. This could potentially be exploited for DoS attacks.

**Recommendation**:
For production deployments, consider adding rate limiting middleware such as `express-rate-limit`:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

**Why Not Fixed**:
This is a simple starter template. Rate limiting requirements vary greatly depending on the specific application needs. Users should implement appropriate rate limiting based on their specific use case when deploying to production.

## Other Security Considerations

1. **Environment Variables**: Use environment variables for sensitive data (API keys, database credentials, etc.)
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: The current CORS configuration allows all origins. Restrict this in production:
   ```javascript
   app.use(cors({
     origin: 'https://your-domain.com'
   }));
   ```
4. **Dependencies**: Regularly update dependencies and run `npm audit` to check for vulnerabilities
5. **Input Validation**: Always validate and sanitize user inputs
6. **Authentication**: Implement proper authentication/authorization for protected routes

## Dependency Security

All installed dependencies (cors, express, concurrently) have been checked against the GitHub Advisory Database and are currently free of known vulnerabilities.

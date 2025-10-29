# CrossFlow Access Keys

## Valid Access Keys for Testing

The following access keys are valid for the CrossFlow application. **Each key can only be used once.**

### Available Access Keys:

1. `CFK-2024-A1B2C3D4` → User: temp1-11
2. `CFK-2024-E5F6G7H8` → User: temp4-2
3. `CFK-2024-I9J0K1L2` → User: temp2
4. `CFK-2024-M3N4O5P6` → User: user-demo
5. `CFK-2024-Q7R8S9T0` → User: test-user

## How It Works

1. **One-Time Use**: Each access key can only be used once. Once used, the key becomes invalid.
2. **Persistent Authentication**: After successful authentication, the user remains logged in across browser sessions.
3. **No Logout**: Users cannot log out. Authentication persists until browser data is cleared.
4. **Secure Storage**: Authentication data is stored in localStorage with validation.

## For Administrators

### Adding New Access Keys

To add new access keys, edit `src/utils/auth.js` and add entries to the `VALID_ACCESS_KEYS` object:

```javascript
const VALID_ACCESS_KEYS = {
  'CFK-2024-A1B2C3D4': 'temp1-11',
  'CFK-2024-NEWKEY123': 'new-user-id',
  // Add more keys here
}
```

### Resetting Used Keys (For Testing)

To reset the list of used keys during development, open the browser console and run:

```javascript
localStorage.removeItem('crossflow_used_keys')
localStorage.removeItem('crossflow_auth')
localStorage.removeItem('crossflow_user')
```

Then refresh the page.

### Generating New Access Keys

Access keys follow the format: `CFK-2024-XXXXXXXX`

- `CFK` = CrossFlow Key
- `2024` = Year
- `XXXXXXXX` = 8 random alphanumeric characters

You can use the helper function in the browser console:

```javascript
import { generateAccessKey } from './src/utils/auth'
console.log(generateAccessKey())
```

## Security Considerations

### Current Implementation (Frontend-Only)

⚠️ **This is a frontend-only implementation for demonstration purposes.** 

In production, you should:

1. **Backend Validation**: Validate access keys on a secure backend server
2. **Database Storage**: Store keys in a secure database, not in frontend code
3. **JWT Tokens**: Use JWT tokens for session management instead of localStorage
4. **Key Expiration**: Implement key expiration dates
5. **Audit Logging**: Log all authentication attempts
6. **Rate Limiting**: Prevent brute-force attacks
7. **HTTPS Only**: Ensure all communication is over HTTPS

### Production Implementation Checklist

- [ ] Move access key validation to backend API
- [ ] Implement JWT-based authentication
- [ ] Add access key expiration dates
- [ ] Implement audit logging
- [ ] Add rate limiting for login attempts
- [ ] Use environment variables for sensitive data
- [ ] Implement proper session management
- [ ] Add multi-factor authentication (optional)

## API Endpoints (Future Backend Implementation)

```
POST /api/auth/validate
Body: { accessKey: "CFK-2024-XXXXXXXX" }
Response: { success: true, token: "jwt-token", userId: "user-id" }

GET /api/auth/verify
Headers: { Authorization: "Bearer jwt-token" }
Response: { authenticated: true, userId: "user-id" }
```

## Usage Instructions for End Users

1. Obtain your unique access key from your administrator
2. Visit the CrossFlow application
3. Enter your access key in the login form
4. Click "Access Application"
5. You will be automatically logged in and can access all features
6. Your session will persist even after closing the browser

**Important**: Keep your access key secure. Once used, it cannot be used again.

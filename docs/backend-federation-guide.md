# Backend Federation Implementation Guide

This document explains how to implement the backend federation service that works with the React frontend's Google OAuth integration.

## Overview

The frontend sends Google ID tokens to your backend, which validates them and issues your own application tokens. This provides an additional security layer and allows you to control user access.

## Node.js/Express Implementation

### 1. Dependencies

```bash
npm install express google-auth-library jsonwebtoken cors helmet
npm install -D @types/express @types/jsonwebtoken
```

### 2. Server Setup (server.js)

```javascript
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Verify Google ID Token and create application token
app.post('/auth/google/federate', async (req, res) => {
  try {
    const { googleCredential } = req.body;

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: googleCredential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userId = payload['sub'];
    const email = payload['email'];
    const name = payload['name'];
    const picture = payload['picture'];

    // Check if user is authorized (implement your business logic)
    const isAuthorized = await checkUserAuthorization(email);
    if (!isAuthorized) {
      return res.status(403).json({ error: 'User not authorized' });
    }

    // Create your application's access token
    const accessToken = jwt.sign(
      {
        userId,
        email,
        name,
        role: 'clinician', // or determine from your database
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Return user info and access token
    res.json({
      accessToken,
      user: {
        id: userId,
        email,
        name,
        picture,
        givenName: payload['given_name'],
        familyName: payload['family_name'],
      }
    });
  } catch (error) {
    console.error('Federation error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

// Verify application token
app.get('/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Middleware to verify JWT tokens
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Example authorization check
async function checkUserAuthorization(email) {
  // Implement your authorization logic here
  // This could check against a database, specific email domains, etc.
  
  // Example: Allow only specific domains
  const allowedDomains = process.env.ALLOWED_EMAIL_DOMAINS?.split(',') || [];
  if (allowedDomains.length > 0) {
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
  }
  
  // Example: Check against user database
  // const user = await getUserByEmail(email);
  // return user && user.role === 'clinician';
  
  return true; // Allow all for demo
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 3. Environment Variables (.env)

```bash
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:3000
ALLOWED_EMAIL_DOMAINS=yourhospital.com,yourclinic.org
PORT=3001
```

## Azure Functions Implementation

### 1. Function App Structure

```javascript
// GoogleFederation/index.js
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

module.exports = async function (context, req) {
    context.log('Google federation function processed a request.');

    if (req.method !== 'POST') {
        context.res = {
            status: 405,
            body: { error: 'Method not allowed' }
        };
        return;
    }

    try {
        const { googleCredential } = req.body;
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        // Verify Google ID token
        const ticket = await client.verifyIdToken({
            idToken: googleCredential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        
        // Create application token
        const accessToken = jwt.sign(
            {
                userId: payload.sub,
                email: payload.email,
                name: payload.name,
                role: 'clinician'
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        context.res = {
            status: 200,
            body: {
                accessToken,
                user: {
                    id: payload.sub,
                    email: payload.email,
                    name: payload.name,
                    picture: payload.picture,
                    givenName: payload.given_name,
                    familyName: payload.family_name,
                }
            }
        };
    } catch (error) {
        context.log.error('Federation error:', error);
        context.res = {
            status: 401,
            body: { error: 'Invalid Google token' }
        };
    }
};
```

## API Endpoints

### Patient Data Endpoints (with authentication)

```javascript
// Protected patient routes
app.get('/api/patients/search', authenticateToken, async (req, res) => {
  const { firstName, lastName } = req.query;
  
  // Implement patient search logic
  const patients = await searchPatients(firstName, lastName, req.user);
  res.json(patients);
});

app.get('/api/patients/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  // Check if user has access to this patient
  const hasAccess = await checkPatientAccess(req.user.userId, id);
  if (!hasAccess) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const patient = await getPatientById(id);
  res.json(patient);
});

app.put('/api/patients/:id/demographics', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  // Validate and update patient demographics
  const updatedPatient = await updatePatientDemographics(id, updates, req.user);
  res.json(updatedPatient);
});
```

## Security Considerations

1. **Token Validation**: Always verify Google ID tokens server-side
2. **User Authorization**: Implement proper role-based access control
3. **Token Expiration**: Use reasonable expiration times for your JWT tokens
4. **HTTPS Only**: Ensure all communication uses HTTPS in production
5. **Environment Variables**: Never hardcode secrets in your code
6. **Logging**: Log authentication attempts for security monitoring
7. **Rate Limiting**: Implement rate limiting to prevent abuse

## Deployment on Azure

### 1. Azure App Service

```bash
# Deploy with Azure CLI
az webapp up --name clinician-api --resource-group clinician-rg --runtime "node|18-lts"

# Set environment variables
az webapp config appsettings set --name clinician-api --resource-group clinician-rg --settings GOOGLE_CLIENT_ID=your-client-id JWT_SECRET=your-secret
```

### 2. Azure Functions

```bash
# Deploy functions
func azure functionapp publish clinician-functions
```

## Frontend Integration

Update your frontend environment variables:

```bash
REACT_APP_BACKEND_URL=https://your-api.azurewebsites.net
```

The frontend AuthContext will automatically use this backend URL for federation when a user signs in with Google.

## Testing

1. **Unit Tests**: Test token validation and user authorization logic
2. **Integration Tests**: Test the complete authentication flow
3. **Security Tests**: Test for common vulnerabilities

This implementation provides a secure, scalable foundation for Google OAuth federation in your healthcare application.

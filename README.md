# Clinician AI Assistant

A secure, modern React Single Page Application (SPA) for healthcare professionals to manage patient information. Built with Azure Active Directory authentication and Material-UI components.

## Features

### 🔐 Security & Authentication
- **Google OAuth 2.0 Integration**: Secure authentication using Google Identity Services
- **Federated Authentication**: Backend federation for enterprise security
- **Session Management**: Secure session handling with JWT tokens

### 👥 Patient Management
- **Patient Search**: Search patients by first name, last name, or both
- **Comprehensive Patient Data**: View and edit patient information across multiple categories

### 📊 Patient Information Categories

1. **Demographics**
   - Personal information (name, DOB, gender, contact details)
   - Address and emergency contact information
   - Insurance details
   - Editable fields with validation

2. **Medical History**
   - Surgery records
   - Hospitalizations
   - Chronic conditions
   - Family and social history
   - Provider information and notes

3. **Diagnoses**
   - ICD-10 codes
   - Diagnosis descriptions and dates
   - Status tracking (Active, Resolved, Chronic, Suspected)
   - Severity levels
   - Diagnosing provider information

4. **Treatments**
   - Medications with dosage and frequency
   - Procedures and surgeries
   - Therapy plans
   - Treatment status and timeline
   - Prescribing provider details

5. **Laboratory Results**
   - Test names and codes
   - Results with reference ranges
   - Status indicators (Normal, Abnormal, Critical)
   - Order and result dates
   - Lab facility information

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Authentication**: Google OAuth 2.0 with Identity Services
- **Routing**: React Router v6
- **State Management**: React Query for server state
- **Styling**: Emotion (MUI's CSS-in-JS solution)
- **Build Tool**: Create React App

## Prerequisites

- Node.js 16 or later
- npm or yarn
- Google Cloud Console account
- Google OAuth 2.0 application credentials

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd clinician-ai-assistant
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Google OAuth Configuration

#### Create Google OAuth Application
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing project
3. Navigate to APIs & Services > Credentials
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen first if prompted
6. Select "Web application" as application type
7. Add authorized JavaScript origins: `http://localhost:3000` (for development)
8. Add authorized redirect URIs: `http://localhost:3000` (for development)
9. Save and note the Client ID

#### Configure OAuth Consent Screen
1. Go to OAuth consent screen in Google Cloud Console
2. Choose "External" user type (or "Internal" if using Google Workspace)
3. Fill in application information:
   - App name: "Clinician AI Assistant"
   - User support email: your email
   - Developer contact information: your email
4. Add scopes: `../auth/userinfo.email`, `../auth/userinfo.profile`, `openid`
5. Add test users if using "External" type during development

### 4. Environment Configuration
1. Copy `.env.example` to `.env`
```bash
cp .env.example .env
```

2. Update the environment variables:
```bash
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
REACT_APP_GOOGLE_HOSTED_DOMAIN=your-organization-domain.com
REACT_APP_REDIRECT_URI=http://localhost:3000
REACT_APP_BACKEND_URL=https://your-backend-api.azurewebsites.net
REACT_APP_API_SCOPE=patient:read
```

### 5. Start the Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

## Usage

### Authentication
1. Navigate to the application
2. Click "Sign In with Google" or use the Google Sign-In button
3. Choose your Google account and grant permissions
4. You'll be automatically signed in and redirected to the dashboard

### Patient Search
1. Go to "Patient Search" from the navigation
2. Enter first name, last name, or both
3. Click "Search" to find matching patients
4. Click "View Details" to see complete patient information

### Patient Information Management
1. Select a patient from search results
2. Use the tabs to navigate between different information categories:
   - Demographics: Personal and contact information
   - History: Medical history entries
   - Diagnoses: Current and past diagnoses
   - Treatments: Medications and procedures
   - Labs: Laboratory test results
3. Edit demographics by clicking the "Edit" button
4. Add new entries using "Add" buttons in each section

## Security Features

- **Google OAuth 2.0**: Industry-standard OAuth 2.0/OpenID Connect authentication
- **JWT Token Management**: Secure token handling and automatic refresh
- **Session Security**: Browser session storage with secure handling
- **HTTPS Enforcement**: Secure communication (in production)
- **Federated Backend**: Enterprise-grade backend federation for additional security layers

## Development

### Project Structure
```
src/
├── components/
│   ├── Auth/           # Authentication components
│   ├── Common/         # Shared/utility components
│   ├── Dashboard/      # Dashboard page
│   ├── Layout/         # Layout components (Header, etc.)
│   └── Patient/        # Patient-related components
├── config/             # Configuration files
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

### Key Components

- **Login.tsx**: Google OAuth authentication interface
- **Header.tsx**: Navigation and user menu
- **Dashboard.tsx**: Main dashboard with statistics and quick actions
- **PatientSearch.tsx**: Patient search functionality
- **PatientDetails.tsx**: Comprehensive patient information display and editing

### Adding New Features

1. **New Patient Information Category**:
   - Add type definitions in `src/types/patient.ts`
   - Create new tab in `PatientDetails.tsx`
   - Implement display and edit functionality

2. **Additional Search Criteria**:
   - Modify `PatientSearch.tsx`
   - Update search interface and API calls

3. **New Authentication Providers**:
   - Update `authConfig.ts`
   - Modify authentication flow in `AuthContext.tsx`

## Deployment

### Build for Production
```bash
npm run build
```

### Azure Static Web Apps
1. Create Azure Static Web App resource
2. Connect to your GitHub repository
3. Configure build settings:
   - App location: `/`
   - Build location: `build`
   - API location: (leave empty if no API)

### Environment Variables for Production
Update your production environment with:
- `REACT_APP_GOOGLE_CLIENT_ID`
- `REACT_APP_GOOGLE_HOSTED_DOMAIN` (optional)
- `REACT_APP_REDIRECT_URI` (production URL)
- `REACT_APP_BACKEND_URL`
- `REACT_APP_API_SCOPE`

## API Integration

The application is designed to work with a RESTful API that handles Google OAuth federation. Mock data is currently used for development. To integrate with a real API:

1. Implement backend Google OAuth federation endpoint
2. Update API calls in patient components to use federated tokens
3. Replace mock data with actual HTTP requests
4. Implement error handling and loading states
5. Add API authentication using federated JWT tokens

### Expected API Endpoints
- `GET /api/patients/search` - Patient search
- `GET /api/patients/{id}` - Get patient details
- `PUT /api/patients/{id}/demographics` - Update demographics
- `POST /api/patients/{id}/history` - Add history entry
- `POST /api/patients/{id}/diagnoses` - Add diagnosis
- `POST /api/patients/{id}/treatments` - Add treatment
- `POST /api/patients/{id}/labs` - Add lab result

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Review Google OAuth 2.0 documentation for authentication issues
- Check Google Cloud Console for application configuration

## Compliance

This application is designed with healthcare data in mind. Ensure compliance with:
- HIPAA (Health Insurance Portability and Accountability Act)
- Local healthcare data protection regulations
- Your organization's security policies

**Note**: This is a demonstration application. Ensure proper security reviews and compliance validation before using with real patient data.

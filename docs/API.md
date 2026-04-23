# API Documentation

## Base URL
`http://localhost:5000/api` (Development)

## Endpoints

### Health Check
- **URL**: `/health`
- **Method**: `GET`
- **Response**: `{ "status": "healthy", "uptime": 123.45 }`

### Analyze Patient Data (Gemini Integration)
- **URL**: `/analyze`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `image` (File): Optional image of injury.
  - `data` (String/JSON): Patient symptoms and vitals.
- **Response**: Returns structured triage advice.

### Patients
- **URL**: `/patients`
- **Method**: `GET`
- **Response**: Returns list of all patients.

### Alerts
- **URL**: `/alerts`
- **Method**: `GET` | `POST`
- **Description**: Manage emergency alerts.

### History
- **URL**: `/history`
- **Method**: `GET`
- **Description**: Get triage history logs.

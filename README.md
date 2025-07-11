# PCB Netlist Visualizer Validator

A full-stack web application for visualizing and validating PCB (Printed Circuit Board) netlists. This tool helps engineers and designers to visualize connections between components, validate their designs against common PCB design rules, and manage their netlist projects.

## Features

- **Interactive Visualization**: Visualize PCB netlists using D3.js with interactive graph components
- **Validation Engine**: Validate netlists against common PCB design rules
- **User Authentication**: Secure user accounts with JWT authentication
- **Netlist Management**: Dashboard to manage and organize multiple netlists
- **Data Persistence**: MongoDB integration for storing netlists and user data
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend

- React with TypeScript
- D3.js for visualization
- JWT for authentication

### Backend

- Node.js with Express
- MongoDB for data storage
- RESTful API architecture

### Deployment

- Docker and Docker Compose for containerization
- Nginx for serving the client application
- Development and production configurations

### Manual Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd PCB-Netlist-Visualizer-Validator
   ```

2. For development:

   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

3. For production:
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

## Project Structure

```
PCB-Netlist-Visualizer-Validator/
├── client/                 # React frontend
│   ├── public/             # Static files
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── Dockerfile          # Production Docker config
│   └── Dockerfile.dev      # Development Docker config
├── server/                 # Node.js backend
│   ├── src/                # Source code
│   │   ├── controllers/    # API controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   ├── Dockerfile          # Production Docker config
│   └── Dockerfile.dev      # Development Docker config
├── docker-compose.yml      # Production Docker Compose
├── docker-compose.dev.yml  # Development Docker Compose
├── docker-start.bat        # Script to start containers
├── docker-stop.bat         # Script to stop containers
└── docker-cleanup.bat      # Script to clean up Docker resources
```

## Usage

1. **Register/Login**: Create an account or log in to access the dashboard
2. **Upload Netlist**: Upload a JSON netlist file with components, pins, and connections
3. **Visualize**: View an interactive graph representation of your netlist
4. **Validate**: Run validation checks against common PCB design rules
5. **Manage**: Save, edit, and organize your netlists

## Netlist Format

The application accepts JSON netlists in the following format:

```json
{
  "components": [
    {
      "id": "C1",
      "type": "capacitor",
      "pins": ["1", "2"]
    },
    {
      "id": "R1",
      "type": "resistor",
      "pins": ["1", "2"]
    }
  ],
  "connections": [
    {
      "from": { "component": "C1", "pin": "1" },
      "to": { "component": "R1", "pin": "1" }
    }
  ]
}
```

## Development

### Local Development without Docker

If you prefer to develop without Docker:

1. Start MongoDB locally or use a cloud instance
2. Configure the server:

   ```bash
   cd server
   npm install
   # Create .env file with MongoDB connection string
   npm run dev
   ```

3. Configure the client:
   ```bash
   cd client
   npm install
   npm start
   ```

### Environment Variables

Create `.env` files in both client and server directories:

**Server (.env)**:

```
MONGODB_URI=mongodb://username:password@mongodb:27017/netlist
JWT_SECRET=your_jwt_secret
PORT=5000
```

**Client (.env)**:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Deployment to AWS

For detailed instructions on deploying to AWS, refer to the AWS deployment guide included in the project.

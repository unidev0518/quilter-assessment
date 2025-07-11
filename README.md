# Quilter Assessment: PCB Netlist Visualizer & Validator

A full-stack web application for visualizing and validating PCB (Printed Circuit Board) netlists. This tool helps engineers and designers visualize connections between components, validate their designs against common PCB design rules, and manage netlist projects.

---

## Features

- **Interactive Visualization**: Visualize PCB netlists using D3.js with interactive, circuit-inspired graphics.
- **Validation Engine**: Validate netlists against common PCB design rules.
- **User Authentication**: Secure user accounts with JWT authentication.
- **Netlist Management**: Dashboard to manage and organize multiple netlists.
- **Data Persistence**: MongoDB integration for storing netlists and user data.
- **Responsive Design**: Works on desktop and mobile devices.

---

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

---

## Project Structure

```
quilter-assessment/
├── client/                 # React frontend
│   ├── public/             # Static files
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript types
│   │   └── assets/         # Images and static assets
│   ├── Dockerfile          # Production Docker config
│   ├── Dockerfile.prod     # Production Docker config
│   └── nginx.conf          # Nginx config for production
├── server/                 # Node.js backend
│   ├── src/                # Source code
│   │   ├── controllers/    # API controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── services/       # Business logic/services
│   ├── Dockerfile          # Production Docker config
│   ├── Dockerfile.prod     # Production Docker config
├── docker-compose.yml      # Docker Compose for development
├── docker-compose.prod.yml # Docker Compose for production
├── sample-netlist.json     # Example netlist file
└── README.md               # Project documentation
```

---

## Usage

1. **Register/Login**: Create an account or log in to access the dashboard.
2. **Upload Netlist**: Upload a JSON netlist file with components, pins, and connections.
3. **Visualize**: View an interactive graph representation of your netlist.
4. **Validate**: Run validation checks against common PCB design rules.
5. **Manage**: Save, edit, and organize your netlists.

---

## Netlist Format

The application accepts JSON netlists in the following format:

```json
{
  "components": [
    {
      "id": "C1",
      "name": "Capacitor 1",
      "type": "capacitor",
      "pins": [
        { "id": "1", "name": "Pin 1", "type": "input" },
        { "id": "2", "name": "Pin 2", "type": "output" }
      ]
    }
  ],
  "nets": [
    {
      "id": "N1",
      "name": "Net 1",
      "connections": [
        { "componentId": "C1", "pinId": "1" }
      ]
    }
  ]
}
```

---

## Development

### Local Development (without Docker)

1. **Start MongoDB** locally or use a cloud instance.
2. **Configure and run the server:**
   ```bash
   cd server
   npm install
   # Create .env file with MongoDB connection string and JWT secret
   npm run dev
   ```
3. **Configure and run the client:**
   ```bash
   cd client
   npm install
   npm start
   ```

### Environment Variables

Create `.env` files in both `client` and `server` directories.

**Server (`server/.env`):**
```
MONGO_URI=mongodb://localhost:27017/pcb-netlist-visualizer-validator
JWT_SECRET=your_jwt_secret
PORT=5000
```

**Client (`client/.env`):**
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Dockerized Development

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```
2. The client will be available at [http://localhost:3000](http://localhost:3000)  
   The server API will be available at [http://localhost:5000/api](http://localhost:5000/api)

### Production

1. **Build and start production containers:**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build
   ```

---

## Sample Data

A sample netlist is provided in `sample-netlist.json` for testing and demonstration.

---

## License

This project is for assessment and educational purposes.

---

## Contact

For questions or feedback, please contact the project maintainer.

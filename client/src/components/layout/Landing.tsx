import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Landing: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">PCB Netlist Visualizer & Validator</h1>
          <p className="lead">
            Upload, visualize, and validate PCB netlists with an interactive graph-based interface
          </p>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary btn-lg mr-2">
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-light btn-lg">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

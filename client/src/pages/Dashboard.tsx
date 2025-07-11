import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

interface Netlist {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  validationResults: {
    rule: string;
    status: 'pass' | 'fail';
    message: string;
  }[];
}

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [netlists, setNetlists] = useState<Netlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNetlists = async () => {
      try {
        const res = await axios.get('/netlists');
        setNetlists(res.data);
        setLoading(false);
      } catch (err: any) {
        setError('Error fetching netlists');
        setLoading(false);
      }
    };

    fetchNetlists();
  }, []);

  const deleteNetlist = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this netlist?')) {
      try {
        await axios.delete(`/netlists/${id}`);
        setNetlists(netlists.filter(netlist => netlist._id !== id));
      } catch (err: any) {
        setError('Error deleting netlist');
      }
    }
  };

  const getValidationStatus = (netlist: Netlist) => {
    if (!netlist.validationResults || netlist.validationResults.length === 0) {
      return 'Not Validated';
    }

    const failCount = netlist.validationResults.filter(result => result.status === 'fail').length;
    if (failCount === 0) {
      return 'All Passed';
    } else {
      return `${failCount} Issues Found`;
    }
  };

  const getStatusBadgeClass = (netlist: Netlist) => {
    if (!netlist.validationResults || netlist.validationResults.length === 0) {
      return 'badge-secondary';
    }

    const failCount = netlist.validationResults.filter(result => result.status === 'fail').length;
    if (failCount === 0) {
      return 'badge-success';
    } else {
      return 'badge-danger';
    }
  };

  return (
    <div className="dashboard">
      <h1 className="mb-4">Dashboard</h1>

      {user && (
        <div className="lead mb-4">
          Welcome, {user.name}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Your Netlists</h2>
        <Link to="/upload" className="btn btn-primary">
          <i className="fas fa-plus"></i> Upload New Netlist
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : netlists.length === 0 ? (
        <div className="alert alert-info">
          You haven't uploaded any netlists yet. Click the button above to upload your first netlist.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Created</th>
                <th>Validation Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {netlists.map(netlist => (
                <tr key={netlist._id}>
                  <td>
                    <Link to={`/netlists/${netlist._id}`}>
                      {netlist.name}
                    </Link>
                  </td>
                  <td>{netlist.description || 'No description'}</td>
                  <td>{new Date(netlist.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(netlist)}`}>
                      {getValidationStatus(netlist)}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <Link 
                        to={`/netlists/${netlist._id}`} 
                        className="btn btn-sm btn-info mr-1"
                        title="View"
                      >
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Link 
                        to={`/netlists/${netlist._id}/edit`} 
                        className="btn btn-sm btn-warning mr-1"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button 
                        onClick={() => deleteNetlist(netlist._id)} 
                        className="btn btn-sm btn-danger"
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditNetlist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [netlistData, setNetlistData] = useState<any | null>(null);
  const [jsonContent, setJsonContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const { name, description } = formData;

  useEffect(() => {
    const fetchNetlist = async () => {
      try {
        const res = await axios.get(`/netlists/${id}`);
        const netlist = res.data;

        setFormData({
          name: netlist.name,
          description: netlist.description || "",
        });

        const netlistDataForEdit = {
          components: netlist.components,
          nets: netlist.nets,
        };

        setNetlistData(netlistDataForEdit);
        setJsonContent(JSON.stringify(netlistDataForEdit, null, 2));
        setLoading(false);
      } catch (err: any) {
        setError("Error fetching netlist");
        setLoading(false);
      }
    };

    fetchNetlist();
  }, [id]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonContent(e.target.value);

    try {
      const parsedData = JSON.parse(e.target.value);
      setNetlistData(parsedData);
      setJsonError(null);
    } catch (err) {
      setJsonError("Invalid JSON format");
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (jsonError) {
      setError("Please fix JSON errors before saving");
      return;
    }

    if (!netlistData) {
      setError("Invalid netlist data");
      return;
    }

    if (!netlistData.components || !Array.isArray(netlistData.components)) {
      setError("Netlist must include components array");
      return;
    }

    if (!netlistData.nets || !Array.isArray(netlistData.nets)) {
      setError("Netlist must include nets array");
      return;
    }

    setSaving(true);

    try {

      const netlistUpdateData = {
        name,
        description,
        components: netlistData.components,
        nets: netlistData.nets,
      };

      await axios.put(`/netlists/${id}`, netlistUpdateData);

      navigate(`/netlists/${id}`);
    } catch (err: any) {
      setSaving(false);
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError("Error updating netlist");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-netlist">
      <h1 className="mb-4">Edit Netlist</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="name">Netlist Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={name}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                value={description}
                onChange={onChange}
                rows={3}
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="jsonContent">Netlist Data (JSON) *</label>
              {jsonError && (
                <div className="alert alert-danger">{jsonError}</div>
              )}
              <textarea
                id="jsonContent"
                name="jsonContent"
                className={`form-control ${jsonError ? "is-invalid" : ""}`}
                value={jsonContent}
                onChange={onJsonChange}
                rows={20}
                style={{ fontFamily: "monospace" }}
                required
              ></textarea>
              <small className="form-text text-muted">
                Edit the JSON data for components and nets
              </small>
            </div>

            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(`/netlists/${id}`)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving || !!jsonError}
              >
                {saving ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm mr-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditNetlist;

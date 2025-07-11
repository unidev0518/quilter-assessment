import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import * as d3 from "d3";
import Netlist from "../types";

const NetlistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [netlist, setNetlist] = useState<Netlist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"visualization" | "validation">(
    "visualization"
  );
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const fetchNetlist = async () => {
      try {
        const res = await axios.get(`/netlists/${id}`);
        setNetlist(res.data);
        setLoading(false);
      } catch (err: any) {
        setError("Error fetching netlist");
        setLoading(false);
      }
    };
    fetchNetlist();
  }, [id]);
  useEffect(() => {
    if (netlist && svgRef.current && activeTab === "visualization") {
      createVisualization();
    }
  }, [netlist, activeTab]);
  const createVisualization = () => {
    if (!netlist || !svgRef.current) return;
    d3.select(svgRef.current).selectAll("*").remove();
    const width = 800;
    const height = 600;
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3
          .forceLink()
          .id((d: any) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const nodes: any[] = [];
    const links: any[] = [];
    netlist.components.forEach((component) => {
      nodes.push({
        id: component.id,
        name: component.name,
        type: component.type,
        nodeType: "component",
      });
      component.pins.forEach((pin) => {
        nodes.push({
          id: `${component.id}-${pin.id}`,
          name: pin.name,
          type: pin.type,
          parentId: component.id,
          nodeType: "pin",
        });
      });
    });
    netlist.nets.forEach((net) => {
      nodes.push({
        id: net.id,
        name: net.name,
        nodeType: "net",
      });
      net.connections.forEach((connection) => {
        links.push({
          source: net.id,
          target: `${connection.componentId}-${connection.pinId}`,
          netName: net.name,
        });
      });
    });
    netlist.components.forEach((component) => {
      component.pins.forEach((pin) => {
        links.push({
          source: component.id,
          target: `${component.id}-${pin.id}`,
          pinName: pin.name,
        });
      });
    });
    const link = svg
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke-width", 1.5)
      .attr("stroke", (d: any) => (d.netName ? "#007bff" : "#999"));

    const node = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .call(
        d3
          .drag<SVGGElement, any>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    // SHAPE & COLOR LOGIC
    node.each(function (d: any) {
      if (d.nodeType === "component") {
        // Rectangle for component
        d3.select(this)
          .append("rect")
          .attr("x", -15)
          .attr("y", -15)
          .attr("width", 30)
          .attr("height", 30)
          .attr("fill", "#28a745");
      } else if (d.nodeType === "pin") {
        // Triangle for pin
        d3.select(this)
          .append("path")
          .attr(
            "d",
            d3
              .symbol()
              .type(d3.symbolTriangle)
              .size(120)()
          )
          .attr("fill", "#ffc107");
      } else if (d.nodeType === "net") {
        // Diamond for net
        d3.select(this)
          .append("path")
          .attr(
            "d",
            d3
              .symbol()
              .type(d3.symbolDiamond)
              .size(100)()
          )
          .attr("fill", "#007bff");
      }
    });

    node
      .append("text")
      .attr("dx", 18)
      .attr("dy", ".35em")
      .text((d: any) => d.name);

    simulation.nodes(nodes).on("tick", ticked);
    (simulation.force("link") as d3.ForceLink<any, any>).links(links);

    function ticked() {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    }
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }
    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };
  const getStatusBadgeClass = (status: "pass" | "fail") => {
    return status === "pass" ? "badge-success" : "badge-danger";
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
  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }
  if (!netlist) {
    return <div className="alert alert-warning mt-5">Netlist not found</div>;
  }
  return (
    <div className="netlist-detail">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{netlist.name}</h1>
        <div>
          <Link to="/dashboard" className="btn btn-secondary mr-2">
            Back to Dashboard
          </Link>
          <Link to={`/netlists/${id}/edit`} className="btn btn-primary">
            Edit Netlist
          </Link>
        </div>
      </div>
      {netlist.description && (
        <p className="lead mb-4">{netlist.description}</p>
      )}
      <div className="card mb-4">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activeTab === "visualization" ? "active" : ""
                }`}
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("visualization");
                }}
              >
                Visualization
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activeTab === "validation" ? "active" : ""
                }`}
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("validation");
                }}
              >
                Validation Results
                {netlist.validationResults.some(
                  (result) => result.status === "fail"
                ) && (
                  <span className="badge badge-danger ml-2">
                    {
                      netlist.validationResults.filter(
                        (result) => result.status === "fail"
                      ).length
                    }
                  </span>
                )}
              </a>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {activeTab === "visualization" ? (
            <div className="visualization-container">
              <svg ref={svgRef} className="netlist-visualization"></svg>
            </div>
          ) : (
            <div className="validation-results">
              <h3 className="mb-3">Validation Results</h3>
              {netlist.validationResults.length === 0 ? (
                <div className="alert alert-info">
                  No validation results available
                </div>
              ) : (
                <div className="list-group">
                  {netlist.validationResults.map((result, index) => (
                    <div
                      key={index}
                      className={`list-group-item list-group-item-${
                        result.status === "pass" ? "success" : "danger"
                      }`}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-1">{result.rule}</h5>
                        <span
                          className={`badge ${getStatusBadgeClass(
                            result.status
                          )}`}
                        >
                          {result.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="mb-1">{result.message}</p>
                      {result.componentIds &&
                        result.componentIds.length > 0 && (
                          <small className="text-muted">
                            Affected Components:{" "}
                            {result.componentIds.join(", ")}
                          </small>
                        )}
                      {result.netIds && result.netIds.length > 0 && (
                        <small className="text-muted">
                          Affected Nets: {result.netIds.join(", ")}
                        </small>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h3 className="mb-0">Components ({netlist.components.length})</h3>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Pins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {netlist.components.map((component) => (
                      <tr key={component.id}>
                        <td>{component.id}</td>
                        <td>{component.name}</td>
                        <td>{component.type}</td>
                        <td>{component.pins.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h3 className="mb-0">Nets ({netlist.nets.length})</h3>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Connections</th>
                    </tr>
                  </thead>
                  <tbody>
                    {netlist.nets.map((net) => (
                      <tr key={net.id}>
                        <td>{net.id}</td>
                        <td>{net.name}</td>
                        <td>{net.connections.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NetlistDetail;

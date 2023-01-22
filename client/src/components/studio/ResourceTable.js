import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

const ResourceDataList = ({ resourceItem, projectId }) => {
  return (
    <tr>
      <td>
        <Link to={`/project/${projectId}/${resourceItem.id}`}>
          {resourceItem.id}
        </Link>
      </td>

      <td>{moment(resourceItem.resource_time).fromNow()}</td>

      <td>{resourceItem.location}</td>

      <td>{resourceItem.state}</td>

      <td>{resourceItem.coordinates}</td>

      <td>{resourceItem.image_1_date}</td>
      <td>{resourceItem.image_2_date}</td>
      <td>
        <Link to={`/uploadimage/${projectId}/${resourceItem.id}`}>
          Upload Images{" "}
        </Link>
      </td>
      <td>
        <Link>Delete Resource</Link>
      </td>
    </tr>
  );
};

const ResourceTable = ({ resources, projectId }) => {
  return (
    <div className="bx--row" style={{ marginBottom: "1rem" }}>
      <div className="bx--col-lg-12" style={{ padding: "0" }}>
        <section className="bx--data-table_inner-container">
          <table className="bx--data-table">
            <thead>
              <tr>
                <th>
                  <span className="bx--table-header-label">Resource ID</span>
                </th>
                <th>
                  <span className="bx--table-header-label">Resource Date</span>
                </th>
                <th>
                  <span className="bx--table-header-label">Location</span>
                </th>
                <th>
                  <span className="bx--table-header-label">State</span>
                </th>
                <th>
                  <span className="bx--table-header-label">Coordinates</span>
                </th>
                <th>
                  <span className="bx--table-header-label">Image 1 Period</span>
                </th>
                <th>
                  <span className="bx--table-header-label">Image 2 Period</span>
                </th>
                <th>
                  <span className="bx--table-header-label">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => {
                return (
                  <ResourceDataList
                    key={resource.id}
                    resourceItem={resource}
                    projectId={projectId}
                  />
                );
              })}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default ResourceTable;

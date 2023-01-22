import React, { useContext } from "react";
import "../../styles/style-sheet/project-styles.scss";
import { AuthContext } from "../../context/auth";
import moment from "moment";
import { Link } from "react-router-dom";

const ProjectDataList = ({ projectItem }) => {
  const { user } = useContext(AuthContext);

  return (
    <tr>
      <td>
        <Link to={`/project/${projectItem.id}`}>
          {" "}
          {projectItem.project_name}
        </Link>
      </td>
      <td>{projectItem.id}</td>
      <td>{projectItem.project_description}</td>
      <td>
        {user.first_name} {user.last_name}
      </td>
      <td>{projectItem.project_status}</td>
      <td>{moment(projectItem.project_time).fromNow()}</td>
      <td>Delete Project</td>
    </tr>
  );
};

const ProjectsTable = ({ projects }) => {
  return (
    <div className="bx--row" style={{ marginBottom: "1rem" }}>
      <div className="bx--col-lg-12" style={{ padding: "0" }}>
        <section className="bx--data-table_inner-container">
          <table className="bx--data-table ">
            <thead>
              <tr>
                <th>
                  <span className="bx--table-header-label">Project Name</span>
                </th>
                <th>
                  <span className="bx--table-header-label">Project ID</span>
                </th>
                <th>
                  <span className="bx--table-header-label">
                    Project Description
                  </span>
                </th>
                <th>
                  <span className="bx--table-header-label">Project Owner</span>
                </th>
                <th>
                  <span className="bx--table-header-label">Project Status</span>
                </th>

                <th>
                  <span className="bx--table-header-label">Project Date</span>
                </th>
                <th>
                  <span className="bx--table-header-label">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((projectItem) => {
                return (
                  <ProjectDataList
                    key={projectItem.id}
                    projectItem={projectItem}
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

export default ProjectsTable;

import React, { useContext } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  DataTableSkeleton,
  InlineLoading,
} from "carbon-components-react";
import { Add32 } from "@carbon/icons-react";
import "../../styles/style-sheet/resource-styles.scss";
import "../../styles/style-sheet/project-styles.scss";
import SettingsNav from "../../components/utils/SettingsNav";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { GET_PROJECT } from "../../utils/graphql";
import { AuthContext } from "../../context/auth";
import { Redirect } from "react-router-dom";
import ResourceTable from "../../components/studio/ResourceTable";

const Project = (props) => {
  const { user } = useContext(AuthContext);

  const project_id = props.match.params.project_id;

  const { loading, error, data } = useQuery(GET_PROJECT, {
    variables: {
      project_id: project_id,
    },
  });

  if (!user) {
    alert("User session token has expired, redirecting to login");
    return <Redirect to="/login" />;
  }

  if (error) {
    alert("Project not found, redirecting to projects");
    return <Redirect to="/projects" />;
  }

  let resourceRender;
  let projectName;

  if (loading) {
    resourceRender = <DataTableSkeleton />;
  } else if (data.getProject.resources.length === 0) {
    projectName = data.getProject.project_name;
    resourceRender = (
      <div>
        <div className="bx--col-lg-12" style={{ marginTop: "10rem" }}>
          <div style={{ display: "grid" }}>
            <h4 style={{ textAlign: "center" }}>
              {projectName} project has no resources,{" "}
              <Link to={`/newresource/${project_id}`}>Add resource</Link> to
              this project
            </h4>
          </div>
        </div>
      </div>
    );
  } else {
    projectName = data.getProject.project_name;
    resourceRender = (
      <ResourceTable
        resources={data.getProject.resources}
        projectId={project_id}
      />
    );
  }

  return (
    <div className="bx--grid projectBackground ">
      <div className="bx--row breadCrumb" style={{ marginTop: "4vh" }}>
        <Breadcrumb noTrailingSlash>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/login">Login</BreadcrumbItem>
          <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage href="/project">
            Project
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="bx--row welcomeHeader">
        <div className="bx--col-lg-8" style={{ paddingLeft: "0" }}>
          <h3>{projectName}</h3>
        </div>
        <div className="bx--col-lg-4">
          <SettingsNav />
        </div>
      </div>
      <div className="bx--row" style={{ marginBottom: "1rem" }}>
        <div className="bx--col-lg-10" style={{ padding: "0" }}>
          <h4>
            {projectName ? (
              `${projectName} - Resources`
            ) : (
              <InlineLoading description="Loading Resources" />
            )}
          </h4>
          <small>Add and remove resources from your project </small>
        </div>

        <div className="bx--col-lg-2">
          <Button
            renderIcon={Add32}
            iconDescription="NewResource"
            kind="ghost"
            as={Link}
            to={`/newresource/${project_id}`}
          >
            Add New Resource
          </Button>
        </div>
      </div>
      <div className="bx--row" style={{ marginBottom: "1rem" }}>
        <div className="bx--col-lg-12" style={{ padding: "0" }}></div>
      </div>

      {resourceRender}
    </div>
  );
};

export default Project;

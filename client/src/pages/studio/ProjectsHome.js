import React, { useContext } from "react";
import "../../styles/style-sheet/project-styles.scss";
import {
  Breadcrumb,
  BreadcrumbItem,
  DataTableSkeleton,
  Button,
  InlineLoading,
} from "carbon-components-react";
import { Add32 } from "@carbon/icons-react";
import { Link } from "react-router-dom";

import ProjectsTable from "../../components/studio/ProjectsTable";
import SettingsNav from "../../components/utils/SettingsNav";
import { useQuery } from "@apollo/client";
import { AuthContext } from "../../context/auth";
import { GET_PROJECTS } from "../../utils/graphql";
import { Redirect } from "react-router-dom";

const ProjectsHome = () => {
  const { user } = useContext(AuthContext);

  const { loading, data } = useQuery(GET_PROJECTS, {});

  let tableRender;
  let projectCount;

  if (loading) {
    tableRender = <DataTableSkeleton />;
  } else if (data.getProjects.length === 0) {
    projectCount = data.getProjects.length;
    tableRender = (
      <div>
        <ProjectsTable projects={data.getProjects} user={user} />
        <div className="bx--col-lg-12" style={{ marginTop: "5rem" }}>
          <h4 style={{ textAlign: "center" }}>
            You have no active projects, Create a new project
          </h4>
        </div>
      </div>
    );
  } else {
    projectCount = data.getProjects.length;
    tableRender = <ProjectsTable projects={data.getProjects} user={user} />;
  }

  if (!user) {
    return <Redirect to="/login" />;
  } else {
    return (
      <div className="bx--grid projectBackground">
        <div className="bx--row breadCrumb" style={{ marginTop: "4vh" }}>
          <Breadcrumb noTrailingSlash>
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/login">Login</BreadcrumbItem>
            <BreadcrumbItem isCurrentPage href="/">
              Projects
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div className="bx--row welcomeHeader">
          <div className="bx--col-lg-5" style={{ paddingLeft: "0" }}>
            <h3>
              {user ? (
                `Welcome, ${user.first_name} ${user.last_name}`
              ) : (
                <InlineLoading description="Loading user" />
              )}
            </h3>
          </div>
          <div className="bx--col-lg-1"></div>
          <div className="bx--col-lg-2"></div>
          <div className="bx--col-lg-4">
            <SettingsNav />
          </div>
        </div>
        <div className="bx--row" style={{ marginBottom: "1rem" }}>
          <div className="bx--col-lg-10" style={{ padding: "0" }}>
            <h4>Recent Projects</h4>
            <small style={{ color: "green" }}>
              {projectCount >= 0 ? (
                `${projectCount} project(s)`
              ) : (
                <InlineLoading description="Loading projects" />
              )}
            </small>
          </div>

          <div className="bx--col-lg-2">
            <Button
              renderIcon={Add32}
              iconDescription="NewProject"
              kind="ghost"
              as={Link}
              to={"/newproject"}
            >
              Create New Project
            </Button>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--col-lg-12">{tableRender}</div>
        </div>
      </div>
    );
  }
};

export default ProjectsHome;

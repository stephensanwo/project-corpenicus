import React, { Fragment, useState, useContext } from "react";
import "../../styles/style-sheet/project-styles.scss";
import "../../styles/style-sheet/form-styles.scss";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Form,
  InlineLoading,
} from "carbon-components-react";
import { ArrowRight32 } from "@carbon/icons-react";
import { Link } from "react-router-dom";
import SettingsNav from "../../components/utils/SettingsNav";
import { AuthContext } from "../../context/auth";
import { Redirect } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { CREATE_PROJECT } from "../../utils/graphql";

const NewProject = (props) => {
  const { user } = useContext(AuthContext);

  const [errors, setErrors] = useState({});

  const [values, setValues] = useState({
    project_name: "",
    project_description: "",
    project_owner: "",
  });

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const [newProject, { loading }] = useMutation(CREATE_PROJECT, {
    update(_, { data: { createProject: projectData } }) {
      props.history.push(`/project/${projectData.id}`);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: {
      project_name: values.project_name,
      project_description: values.project_description,
      project_owner: values.project_owner,
    },
  });

  if (!user) {
    alert("User session token has expired, redirecting to login");
    return <Redirect to="/login" />;
  } else {
    const onSubmit = (event) => {
      event.preventDefault();
      if (!user) {
        alert("User session token has expired, redirecting to login");
        return <Redirect to="/login" />;
      } else {
        newProject();
      }
    };

    // Handle Loading States

    let loadingState;

    if (!loading && Object.keys(errors).length === 0) {
      loadingState = <Fragment />;
    } else if (!loading && Object.keys(errors).length > 0) {
      loadingState = (
        <InlineLoading description="New Project Error" status="error" />
      );
    } else if (loading) {
      loadingState = (
        <InlineLoading description="Creating Project..." status="active" />
      );
    } else {
      loadingState = (
        <InlineLoading description="Project Created" status="finished" />
      );
    }

    return (
      <div className="bx--grid projectBackground">
        <div className="bx--row breadCrumb" style={{ marginTop: "4vh" }}>
          <Breadcrumb noTrailingSlash>
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/login">Login</BreadcrumbItem>
            <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
            <BreadcrumbItem isCurrentPage href="/newproject">
              New Project
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div className="bx--row welcomeHeader">
          <div className="bx--col-lg-3" style={{ paddingLeft: "0" }}>
            <h3>Create New Project</h3>
          </div>
          <div className="bx--col-lg-3"></div>
          <div className="bx--col-lg-2"></div>
          <div className="bx--col-lg-4">
            <SettingsNav />
          </div>
        </div>
        <div className="bx--row" style={{ marginBottom: "1rem" }}>
          <div className="bx--col-lg-2" style={{ padding: "0" }}>
            <h4>Project Metadata</h4>
            <small>Provide details about the project</small>
          </div>
          <div className="bx--col-lg-2"></div>
          <div
            className="bx--col-lg-2"
            style={{
              padding: "0",
              marginTop: "1rem",
            }}
          >
            <div>{loadingState}</div>
          </div>
        </div>
        <div className="bx--row">
          <div className="bx--col-lg-6" style={{ paddingLeft: "0" }}>
            <Form onSubmit={onSubmit} noValidate>
              <div className="bx--form-item" style={{ marginTop: "2rem" }}>
                <label htmlFor="project_name" className="bx--label">
                  Unique Project Name
                </label>
                <input
                  id="project_name"
                  placeholder="Input a unique project name i.e. project-070809"
                  type="text"
                  className={
                    Object.keys(errors).length > 0 &&
                    Object.keys(errors).includes("project_name")
                      ? "bx--text-input bx--text-input--invalid"
                      : "bx--text-input"
                  }
                  name="project_name"
                  value={values.project_name}
                  onChange={onChange}
                  autoComplete=""
                  error={errors.project_name ? true : false}
                ></input>
                {Object.keys(errors).length > 0 &&
                Object.keys(errors).includes("project_name") ? (
                  <small
                    className="invalid-input"
                    style={{ marginTop: "0.5rem" }}
                  >
                    {
                      Object.values(errors)[
                        Object.keys(errors).indexOf("project_name")
                      ]
                    }
                  </small>
                ) : (
                  <Fragment />
                )}
              </div>
              <div className="bx--htmlform-item" style={{ marginTop: "2rem" }}>
                <label htmlFor="project_owner" className="bx--label">
                  Project Owner
                </label>
                <input
                  id="project_owner"
                  placeholder={user.email}
                  className="bx--text-input"
                  type="text"
                  name="project_owner"
                  value={user.email}
                  autoComplete=""
                  disabled
                ></input>
              </div>
              <div className="bx--form-item" style={{ marginTop: "2rem" }}>
                <label for="project_description" className="bx--label">
                  Project Description
                </label>
                <input
                  id="project_description"
                  placeholder="Provide a description of your project"
                  type="text"
                  className={
                    Object.keys(errors).length > 0 &&
                    Object.keys(errors).includes("project_description")
                      ? "bx--text-input bx--text-input--invalid"
                      : "bx--text-input"
                  }
                  name="project_description"
                  value={values.project_description}
                  onChange={onChange}
                  autoComplete=""
                  error={errors.project_description ? true : false}
                ></input>
                {Object.keys(errors).length > 0 &&
                Object.keys(errors).includes("project_description") ? (
                  <small
                    className="invalid-input"
                    style={{ marginTop: "0.5rem" }}
                  >
                    {
                      Object.values(errors)[
                        Object.keys(errors).indexOf("project_description")
                      ]
                    }
                  </small>
                ) : (
                  <Fragment />
                )}
              </div>
              <div
                style={{
                  marginTop: "4rem",
                  display: "grid",
                  gridTemplateColumns: "1fr 4fr 2fr",
                }}
              >
                <Button kind="secondary" as={Link} to="/projects">
                  Back
                </Button>
                <div></div>
                <Button type="submit" renderIcon={ArrowRight32}>
                  Create Project
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
};

export default NewProject;

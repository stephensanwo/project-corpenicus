import React, { Fragment, useState, useContext } from "react";
import "../../styles/style-sheet/project-styles.scss";
import "../../styles/style-sheet/form-styles.scss";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  InlineLoading,
  Form,
} from "carbon-components-react";
import { ArrowRight32 } from "@carbon/icons-react";
import { Link } from "react-router-dom";
import SettingsNav from "../../components/utils/SettingsNav";
import { AuthContext } from "../../context/auth";
import { Redirect } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { CREATE_RESOURCE } from "../../utils/graphql";

const NewResource = (props) => {
  const { user } = useContext(AuthContext);

  const project_id = props.match.params.project_id;

  const [errors, setErrors] = useState({});

  const [values, setValues] = useState({
    location: "",
    state: "",
    country: "",
    coordinates: "",
    image_1_description: "",
    image_2_description: "",
    image_1_source: "",
    image_2_source: "",
    image_1_date: "",
    image_2_date: "",
  });

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const [newResource, { loading }] = useMutation(CREATE_RESOURCE, {
    update(_, { data: { createResource: resourceData } }) {
      props.history.push(`/project/${project_id}`);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: {
      project_id: project_id,
      location: values.location,
      state: values.state,
      country: values.country,
      coordinates: values.coordinates,
      image_1_description: values.image_1_description,
      image_2_description: values.image_2_description,
      image_1_source: values.image_1_source,
      image_2_source: values.image_2_source,
      image_1_date: values.image_1_date,
      image_2_date: values.image_2_date,
    },
  });

  if (!user) {
    alert("User session token has expired, redirecting to login");
    return <Redirect to="/login" />;
  } else {
    const onSubmit = (event) => {
      event.preventDefault();
      if (!user) {
        return <Redirect to="/login" />;
      } else {
        newResource();
      }
    };

    // Handle Loading States

    let loadingState;

    if (!loading && Object.keys(errors).length === 0) {
      loadingState = <Fragment />;
    } else if (!loading && Object.keys(errors).length > 0) {
      loadingState = (
        <InlineLoading description="New Resource Error" status="error" />
      );
    } else if (loading) {
      loadingState = (
        <InlineLoading description="Creating Resource..." status="active" />
      );
    } else {
      loadingState = (
        <InlineLoading description="Resource Created" status="finished" />
      );
    }

    return (
      <div className="bx--grid projectBackground">
        <div className="bx--row breadCrumb" style={{ marginTop: "4vh" }}>
          <Breadcrumb noTrailingSlash>
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/login">Login</BreadcrumbItem>
            <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
            <BreadcrumbItem
              href={`/project/${project_id}`}
            >{`Project ID: ${project_id} `}</BreadcrumbItem>
            <BreadcrumbItem isCurrentPage href="/newresource">
              New Resource
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div className="bx--row welcomeHeader">
          <div className="bx--col-lg-3" style={{ paddingLeft: "0" }}>
            <h3>Add New Resource</h3>
          </div>
          <div className="bx--col-lg-3"></div>
          <div className="bx--col-lg-2"></div>
          <div className="bx--col-lg-4">
            <SettingsNav />
          </div>
        </div>
        <div className="bx--row" style={{ marginBottom: "1rem" }}>
          <div className="bx--col-lg-8" style={{ padding: "0" }}>
            <h4>Resource Metadata</h4>
            <small>Provide details about the resource</small>
          </div>
          <div
            className="bx--col-lg-4"
            style={{
              padding: "0",
            }}
          >
            <div>{loadingState}</div>
          </div>
        </div>

        <Form onSubmit={onSubmit} noValidate>
          <div className="bx--row" style={{ marginBottom: "1rem" }}>
            <div
              className="bx--col-lg-5"
              style={{ paddingLeft: "0", paddingRight: "0" }}
            >
              <div className="bx--form-item" style={{ marginTop: "2rem" }}>
                <label htmlfor="location" class="bx--label">
                  Review Location <small style={{ color: "red" }}>*</small>
                </label>
                <input
                  id="location"
                  placeholder="Resource review location i.e. Aboyade Cole Street"
                  type="text"
                  className={
                    Object.keys(errors).length > 0 &&
                    Object.keys(errors).includes("location")
                      ? "bx--text-input bx--text-input--invalid"
                      : "bx--text-input"
                  }
                  name="location"
                  value={values.location}
                  onChange={onChange}
                  autoComplete=""
                  error={errors.location ? true : false}
                ></input>
                {Object.keys(errors).length > 0 &&
                Object.keys(errors).includes("location") ? (
                  <small
                    className="invalid-input"
                    style={{ marginTop: "0.5rem" }}
                  >
                    {
                      Object.values(errors)[
                        Object.keys(errors).indexOf("location")
                      ]
                    }
                  </small>
                ) : (
                  <Fragment />
                )}
              </div>
              <div className="bx--form-item" style={{ marginTop: "2rem" }}>
                <label htmlfor="state" class="bx--label">
                  Review State <small style={{ color: "red" }}>*</small>
                </label>
                <input
                  id="state"
                  placeholder="Resource review state i.e. Lagos State"
                  type="text"
                  className={
                    Object.keys(errors).length > 0 &&
                    Object.keys(errors).includes("state")
                      ? "bx--text-input bx--text-input--invalid"
                      : "bx--text-input"
                  }
                  name="state"
                  value={values.state}
                  onChange={onChange}
                  autoComplete=""
                  error={errors.state ? true : false}
                ></input>
                {Object.keys(errors).length > 0 &&
                Object.keys(errors).includes("state") ? (
                  <small
                    className="invalid-input"
                    style={{ marginTop: "0.5rem" }}
                  >
                    {
                      Object.values(errors)[
                        Object.keys(errors).indexOf("state")
                      ]
                    }
                  </small>
                ) : (
                  <Fragment />
                )}
              </div>
              <div className="bx--form-item" style={{ marginTop: "2rem" }}>
                <label htmlfor="country" class="bx--label">
                  Country <small style={{ color: "red" }}>*</small>
                </label>
                <input
                  id="country"
                  placeholder="Resource review country i.e. Nigeria"
                  type="text"
                  className={
                    Object.keys(errors).length > 0 &&
                    Object.keys(errors).includes("country")
                      ? "bx--text-input bx--text-input--invalid"
                      : "bx--text-input"
                  }
                  name="country"
                  value={values.country}
                  onChange={onChange}
                  autoComplete=""
                  error={errors.country ? true : false}
                ></input>
                {Object.keys(errors).length > 0 &&
                Object.keys(errors).includes("country") ? (
                  <small
                    className="invalid-input"
                    style={{ marginTop: "0.5rem" }}
                  >
                    {
                      Object.values(errors)[
                        Object.keys(errors).indexOf("country")
                      ]
                    }
                  </small>
                ) : (
                  <Fragment />
                )}
              </div>
              <div className="bx--form-item" style={{ marginTop: "2rem" }}>
                <label htmlfor="coordinates" class="bx--label">
                  Location Coordinates <small style={{ color: "red" }}>*</small>
                </label>
                <input
                  id="coordinates"
                  placeholder="Location coordinates, seperated with commas i.e. 3.2432, 4.43523, 5.2434, 1.243534"
                  type="text"
                  className={
                    Object.keys(errors).length > 0 &&
                    Object.keys(errors).includes("coordinates")
                      ? "bx--text-input bx--text-input--invalid"
                      : "bx--text-input"
                  }
                  name="coordinates"
                  value={values.coordinates}
                  onChange={onChange}
                  autoComplete=""
                  error={errors.coordinates ? true : false}
                ></input>
                {Object.keys(errors).length > 0 &&
                Object.keys(errors).includes("coordinates") ? (
                  <small
                    className="invalid-input"
                    style={{ marginTop: "0.5rem" }}
                  >
                    {
                      Object.values(errors)[
                        Object.keys(errors).indexOf("coordinates")
                      ]
                    }
                  </small>
                ) : (
                  <Fragment />
                )}
              </div>
            </div>
            <div className="bx--col-lg-2" style={{ paddingLeft: "0" }}></div>
            <div
              className="bx--col-lg-5"
              style={{ paddingLeft: "0", paddingRight: "0" }}
            >
              <div className="bx--form-item" style={{ marginTop: "2rem" }}>
                <label htmlfor="image_1_description" class="bx--label">
                  Old Satellite Image Description{" "}
                  <small style={{ color: "red" }}>*</small>
                </label>
                <input
                  id="image_1_description"
                  placeholder="Enter a description for the old satellite image"
                  type="text"
                  className={
                    Object.keys(errors).length > 0 &&
                    Object.keys(errors).includes("image_1_description")
                      ? "bx--text-input bx--text-input--invalid"
                      : "bx--text-input"
                  }
                  name="image_1_description"
                  value={values.image_1_description}
                  onChange={onChange}
                  autoComplete=""
                  error={errors.image_1_description ? true : false}
                ></input>
                {Object.keys(errors).length > 0 &&
                Object.keys(errors).includes("image_1_description") ? (
                  <small
                    className="invalid-input"
                    style={{ marginTop: "0.5rem" }}
                  >
                    {
                      Object.values(errors)[
                        Object.keys(errors).indexOf("image_1_description")
                      ]
                    }
                  </small>
                ) : (
                  <Fragment />
                )}
              </div>
              <div className="bx--form-item" style={{ marginTop: "2rem" }}>
                <label htmlfor="image_1_date" class="bx--label">
                  Old Satellite Date <small style={{ color: "red" }}>*</small>
                </label>
                <input
                  id="image_1_date"
                  placeholder="Provide the period for the old satellite image i.e. 20-1-2020"
                  type="text"
                  className={
                    Object.keys(errors).length > 0 &&
                    Object.keys(errors).includes("image_1_date")
                      ? "bx--text-input bx--text-input--invalid"
                      : "bx--text-input"
                  }
                  name="image_1_date"
                  value={values.image_1_date}
                  onChange={onChange}
                  autoComplete=""
                  error={errors.image_1_date ? true : false}
                ></input>
                {Object.keys(errors).length > 0 &&
                Object.keys(errors).includes("image_1_date") ? (
                  <small
                    className="invalid-input"
                    style={{ marginTop: "0.5rem" }}
                  >
                    {
                      Object.values(errors)[
                        Object.keys(errors).indexOf("image_1_date")
                      ]
                    }
                  </small>
                ) : (
                  <Fragment />
                )}
              </div>
              <div className="bx--form-item" style={{ marginTop: "2rem" }}>
                <label htmlfor="image_1_source" class="bx--label">
                  Old Satellite Source
                </label>
                <input
                  id="image_1_source"
                  placeholder="Old satellite image source"
                  type="text"
                  className="bx--text-input"
                  name="image_1_source"
                  value={values.image_1_source}
                  onChange={onChange}
                  autoComplete=""
                ></input>
              </div>
              <div className="bx--form-item" style={{ marginTop: "2rem" }}>
                <label htmlfor="image_2_description" class="bx--label">
                  New Satellite Image Description{" "}
                  <small style={{ color: "red" }}>*</small>
                </label>
                <input
                  id="image_2_description"
                  placeholder="Enter a description for the new satellite image"
                  type="text"
                  className={
                    Object.keys(errors).length > 0 &&
                    Object.keys(errors).includes("image_2_description")
                      ? "bx--text-input bx--text-input--invalid"
                      : "bx--text-input"
                  }
                  name="image_2_description"
                  value={values.image_2_description}
                  onChange={onChange}
                  autoComplete=""
                  error={errors.image_2_description ? true : false}
                ></input>
                {Object.keys(errors).length > 0 &&
                Object.keys(errors).includes("image_2_description") ? (
                  <small
                    className="invalid-input"
                    style={{ marginTop: "0.5rem" }}
                  >
                    {
                      Object.values(errors)[
                        Object.keys(errors).indexOf("image_2_description")
                      ]
                    }
                  </small>
                ) : (
                  <Fragment />
                )}
              </div>
              <div className="bx--form-item" style={{ marginTop: "2rem" }}>
                <label htmlfor="image_2_date" class="bx--label">
                  New Satellite Date <small style={{ color: "red" }}>*</small>
                </label>
                <input
                  id="image_2_date"
                  placeholder="Provide the period for the new satellite image i.e. 20-1-2020"
                  type="text"
                  className={
                    Object.keys(errors).length > 0 &&
                    Object.keys(errors).includes("image_2_date")
                      ? "bx--text-input bx--text-input--invalid"
                      : "bx--text-input"
                  }
                  name="image_2_date"
                  value={values.image_2_date}
                  onChange={onChange}
                  autoComplete=""
                  error={errors.image_2_date ? true : false}
                ></input>
                {Object.keys(errors).length > 0 &&
                Object.keys(errors).includes("image_2_date") ? (
                  <small
                    className="invalid-input"
                    style={{ marginTop: "0.5rem" }}
                  >
                    {
                      Object.values(errors)[
                        Object.keys(errors).indexOf("image_2_date")
                      ]
                    }
                  </small>
                ) : (
                  <Fragment />
                )}
              </div>
              <div className="bx--form-item" style={{ marginTop: "2rem" }}>
                <label htmlfor="image_2_source" class="bx--label">
                  New Satellite Source
                </label>
                <input
                  id="image_2_source"
                  placeholder="New satellite image source"
                  type="text"
                  className="bx--text-input"
                  name="image_2_source"
                  value={values.image_2_source}
                  onChange={onChange}
                  autoComplete=""
                ></input>
              </div>
            </div>
          </div>
          <div
            className="bx--row"
            style={{
              marginTop: "4rem",
            }}
          >
            <div
              className="bx--col-lg-12"
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 8fr 2fr",
                padding: "0",
              }}
            >
              <Button kind="secondary" as={Link} to={`/project/${project_id}`}>
                Back to Resource
              </Button>
              <div></div>
              <Button type="submit" renderIcon={ArrowRight32}>
                Create Resource
              </Button>
            </div>
          </div>
          <div
            className="bx--row"
            style={{
              marginTop: "1rem",
            }}
          ></div>
        </Form>
      </div>
    );
  }
};

export default NewResource;

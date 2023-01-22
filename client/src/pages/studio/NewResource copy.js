import React, { Fragment, useState, useContext } from "react";
import "../../styles/style-sheet/project-styles.scss";
import "../../styles/style-sheet/form-styles.scss";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  TextInput,
  DatePicker,
  DatePickerInput,
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
    image_1_accuracy: "",
    image_2_accuracy: "",
    image_1_resolution: "",
    image_2_resolution: "",
    image_1_date: "",
    image_2_date: "",
  });

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const [newResource, { loading }] = useMutation(CREATE_RESOURCE, {
    update(_, { data: { createResource: resourceData } }) {
      props.history.push("/newresource");
      console.log(resourceData);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: {
      location: values.location,
      state: values.state,
      country: values.country,
      coordinates: values.coordinates,
      image_1_description: values.image_1_description,
      image_2_description: values.image_2_description,
      image_1_source: values.image_1_source,
      image_2_source: values.image_2_source,
      image_1_accuracy: values.image_1_accuracy,
      image_2_accuracy: values.image_2_accuracy,
      image_1_resolution: values.image_1_resolution,
      image_2_resolution: values.image_2_resolution,
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
            <BreadcrumbItem href="/newproject">New Project</BreadcrumbItem>
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
          <div className="bx--col-lg-2" style={{ padding: "0" }}>
            <h4>Resource Metadata</h4>
            <small>Provide details about the resource</small>
          </div>
        </div>
        <div className="bx--row" style={{ marginBottom: "1rem" }}>
          <div
            className="bx--col-lg-5"
            style={{ paddingLeft: "0", paddingRight: "0" }}
          >
            <Form onSubmit={onSubmit} noValidate></Form>
            <div style={{ marginTop: "2rem" }}>
              <TextInput
                id="resource_name"
                labelText="Resource Name"
                invalidText="A valid value is required"
                placeholder="Input a unique project name i.e. project-070809"
              />
            </div>
            <div style={{ marginTop: "2rem" }}>
              <TextInput
                id="country"
                labelText="Country"
                placeholder="Input satellite imagery country"
              />
            </div>
            <div style={{ marginTop: "2rem" }}>
              <TextInput
                id="state"
                labelText="State"
                placeholder="Input satellite imagery state"
              />
            </div>
            <div style={{ marginTop: "2rem" }}>
              <TextInput
                id="location"
                labelText="Location"
                placeholder="Input satellite imagery location"
              />
            </div>
            <div style={{ marginTop: "2rem" }}>
              <TextInput
                id="coordinates"
                labelText="Coordinates"
                placeholder="3.1456,6.4776,1.24554,4.3466"
              />
            </div>
          </div>
          <div className="bx--col-lg-2" style={{ paddingLeft: "0" }}></div>
          <div
            className="bx--col-lg-5"
            style={{ paddingLeft: "0", paddingRight: "0" }}
          >
            <div style={{ marginTop: "2rem" }}>
              <TextInput
                id="image1-name"
                labelText="Image 1 Metadata"
                invalidText="A valid value is required"
                placeholder="Image description"
              />
            </div>
            <div style={{ marginTop: "1rem" }}>
              <TextInput
                id="image1-source"
                placeholder="Satellite image source"
              />
            </div>
            <div style={{ marginTop: "1rem" }}>
              <TextInput
                id="image1-resolution"
                placeholder="Satellite image resolution"
              />
            </div>
            <div style={{ marginTop: "1rem" }}>
              <TextInput
                id="image1-accuracy"
                placeholder="Satellite image accuracy"
              />
            </div>
            <div style={{ marginTop: "1rem" }}>
              <DatePicker dateFormat="m/d/Y" datePickerType="single">
                <DatePickerInput
                  id="date-picker-image-1"
                  placeholder="Image date: mm/dd/yyyy"
                  type="text"
                />
              </DatePicker>
            </div>
            <div style={{ marginTop: "2rem" }}>
              <TextInput
                id="image2-name"
                labelText="Image 2 Metadata"
                invalidText="A valid value is required"
                placeholder="Image description"
              />
            </div>
            <div style={{ marginTop: "1rem" }}>
              <TextInput
                id="image2-source"
                placeholder="Satellite image source"
              />
            </div>
            <div style={{ marginTop: "1rem" }}>
              <TextInput
                id="image2-resolution"
                placeholder="Satellite image resolution"
              />
            </div>
            <div style={{ marginTop: "1rem" }}>
              <TextInput
                id="image2-accuracy"
                placeholder="Satellite image accuracy"
              />
            </div>
            <div style={{ marginTop: "1rem" }}>
              <DatePicker dateFormat="m/d/Y" datePickerType="single">
                <DatePickerInput
                  id="date-picker-image-2"
                  placeholder="Image date: mm/dd/yyyy"
                  type="text"
                />
              </DatePicker>
            </div>
          </div>
        </div>
        <div className="bx--row">
          <div
            className="bx--col-lg-12"
            style={{ paddingLeft: "0", paddingRight: "0" }}
          >
            <div
              style={{
                marginTop: "4rem",
                display: "grid",
                gridTemplateColumns: "2fr 10fr 2fr",
              }}
            >
              <Button kind="secondary" as={Link} to="/project">
                Go to Resources
              </Button>
              <div></div>
              <Button renderIcon={ArrowRight32} as={Link} to="/uploadimage">
                Upload Images
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default NewResource;

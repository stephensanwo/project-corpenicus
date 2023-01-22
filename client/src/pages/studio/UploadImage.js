import React, { Fragment, useState, useContext } from "react";
import { axios } from "../../utils/axios";
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
import { useQuery } from "@apollo/client";
import { Redirect } from "react-router-dom";
import { GET_RESOURCE } from "../../utils/graphql";
import { AuthContext } from "../../context/auth";

const UploadImage = (props) => {
  const { user } = useContext(AuthContext);

  // State for Image uploaded - For the user ---> does not affect the data sent to the API
  const [image1, setImage1] = useState("");
  const [image1Name, setImage1Name] = useState(
    "Drag and drop files here or upload"
  );
  const [image2, setImage2] = useState("");
  const [image2Name, setImage2Name] = useState(
    "Drag and drop files here or upload"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const project_id = props.match.params.project_id;
  const resource_id = props.match.params.resource_id;

  // Request data corresponding to Resource ID in focus

  const { loading, error, data } = useQuery(GET_RESOURCE, {
    variables: {
      project_id: project_id,
      resource_id: resource_id,
    },
  });

  // Redirect to projects if the Resource ID and Project ID is not found i.e. url manipulation by user, Also redirect if user is not signed in

  if (!user) {
    alert("User session token has expired, redirecting to login");
    return <Redirect to="/login" />;
  }

  if (error) {
    alert("Project not found, redirecting to projects");
    return <Redirect to={`/project/${project_id}`} />;
  }

  // Handle data from Query to be passed to the Image API

  let resourceRender;
  let image_1_description;
  let image_2_description;

  if (loading) {
    resourceRender = <p>Loading</p>;
  } else {
    resourceRender = data.getResource;
    image_1_description = resourceRender.image_1_description
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    image_2_description = resourceRender.image_2_description
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
  }

  // Handle Image API Data upload

  const onChange_image_1 = (e) => {
    setImage1(e.target.files[0]);
    setImage1Name(e.target.files[0].name);
  };

  const onChange_image_2 = (e) => {
    setImage2(e.target.files[0]);
    setImage2Name(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("image_1", image1);
    formData.append("image_2", image2);
    formData.append("project_id", project_id);
    formData.append("resource_id", resource_id);
    formData.append("image_1_description", image_1_description);
    formData.append("image_2_description", image_2_description);

    try {
      await axios.post("/upload_satellite_images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsLoading(false);
      setErrors([]);
      // Redirect to project review
      props.history.push(`/project/${project_id}/${resource_id}`);
    } catch (err) {
      setIsLoading(false);
      setErrors(err.response.data.errors);
    }
  };

  // Handling Loading States for API Calls !! Not GraphQL Query

  let loadingState;

  if (!isLoading && Object.keys(errors).length === 0) {
    loadingState = <Fragment />;
  } else if (!isLoading && Object.keys(errors).length > 0) {
    loadingState = (
      <InlineLoading description="Image Upload Error!" status="error" />
    );
  } else if (isLoading) {
    loadingState = (
      <InlineLoading description="Uploading Images..." status="active" />
    );
  } else {
    loadingState = (
      <InlineLoading description="Image Uploaded" status="finished" />
    );
  }

  return (
    <div className="bx--grid projectBackground">
      <div className="bx--row breadCrumb" style={{ marginTop: "4vh" }}>
        <Breadcrumb noTrailingSlash>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/login">Login</BreadcrumbItem>
          <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
          <BreadcrumbItem href={`/project/${project_id}`}>
            {`Project ID: ${project_id} `}
          </BreadcrumbItem>
          <BreadcrumbItem href={`/project/${project_id}`}>
            {`Resource ID: ${resource_id} `}
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage href="/uploadimage">
            Upload Satellite Imagery
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="bx--row welcomeHeader">
        <div className="bx--col-lg-3" style={{ paddingLeft: "0" }}>
          <h3>Upload Satellite Imagery</h3>
        </div>
        <div className="bx--col-lg-3"></div>
        <div className="bx--col-lg-2"></div>
        <div className="bx--col-lg-4">
          <SettingsNav />
        </div>
      </div>
      <div className="bx--row" style={{ marginBottom: "1rem" }}>
        <div className="bx--col-lg-8" style={{ padding: "0" }}>
          <h4>Image Metadata</h4>
          <small>Upload the satellite image 1 and 2</small>
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
              <label
                htmlFor="image_1"
                className="bx--label"
                style={{ marginBottom: "2rem" }}
              >
                Upload Satellite Image 1{" "}
                <small style={{ color: "red" }}>[Old Image]</small>
              </label>

              <input
                id="image_1"
                placeholder={image_1_description}
                type="text"
                className="bx--text-input"
                name="image_1"
                autoComplete=""
                disabled
              ></input>
            </div>
          </div>
          <div className="bx--col-lg-2" style={{ paddingLeft: "0" }}></div>
          <div
            className="bx--col-lg-5"
            style={{ paddingLeft: "0", paddingRight: "0" }}
          >
            <div className="bx--form-item" style={{ marginTop: "2rem" }}>
              <label
                htmlFor="image_2"
                className="bx--label"
                style={{ marginBottom: "2rem" }}
              >
                Upload Satellite Image 2{" "}
                <small style={{ color: "red" }}>[Recent Image]</small>
              </label>

              <input
                id="image_2"
                placeholder={image_2_description}
                type="text"
                className="bx--text-input"
                name="image_2"
                autoComplete=""
                disabled
              ></input>
            </div>
          </div>
        </div>

        <div className="bx--row" style={{ marginTop: "4rem" }}>
          <div
            className="bx--col-lg-5"
            style={{ paddingLeft: "0rem", paddingRight: "0rem" }}
          >
            <div className="bx--form-item">
              <p className="bx--label-description">
                Only .jpg and .png files. 500kb max file size.
              </p>
              <div className="bx--file" data-file data-file-demo-state-manager>
                <label
                  htmlFor="file-1-uploader"
                  className="bx--file-browse-btn"
                  role="button"
                  style={{ display: "inline" }}
                >
                  <div
                    data-file-drop-container
                    className="bx--file__drop-container"
                  >
                    {image1Name}
                    <input
                      type="file"
                      className="bx--file-input"
                      id="file-1-uploader"
                      data-file-uploader
                      data-target="[data-file-container]"
                      onChange={onChange_image_1}
                    />
                  </div>
                </label>
                <div data-file-container className="bx--file-container">
                  {errors.length > 0 &&
                  Object.keys(errors["0"]).includes("image_1") ? (
                    <small
                      className="invalid-input"
                      style={{ marginTop: "0.5rem" }}
                    >
                      {errors["0"]["image_1"]}
                    </small>
                  ) : (
                    <Fragment />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bx--col-lg-2"></div>
          <div
            className="bx--col-lg-5"
            style={{ paddingLeft: "0rem", paddingRight: "0rem" }}
          >
            <div className="bx--form-item">
              <p className="bx--label-description">
                Only .jpg and .png files. 500kb max file size.
              </p>
              <div className="bx--file" data-file data-file-demo-state-manager>
                <label
                  htmlFor="file-2-uploader"
                  className="bx--file-browse-btn"
                  role="button"
                  style={{ display: "inline" }}
                >
                  <div
                    data-file-drop-container
                    className="bx--file__drop-container"
                  >
                    {image2Name}
                    <input
                      type="file"
                      className="bx--file-input"
                      id="file-2-uploader"
                      data-file-uploader
                      data-target="[data-file-container]"
                      onChange={onChange_image_2}
                    />
                  </div>
                </label>
                <div data-file-container className="bx--file-container">
                  {errors.length > 0 &&
                  Object.keys(errors["0"]).includes("image_2") ? (
                    <small
                      className="invalid-input"
                      style={{ marginTop: "0.5rem" }}
                    >
                      {errors["0"]["image_2"]}
                    </small>
                  ) : (
                    <Fragment />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bx--row" style={{ marginBottom: "1rem" }}>
          <div
            className="bx--col-lg-12"
            style={{ paddingLeft: "0rem", paddingRight: "0rem" }}
          >
            <div
              style={{
                marginTop: "4rem",
                display: "grid",
                gridTemplateColumns: "3fr 10fr 3fr",
              }}
            >
              <Button kind="secondary" as={Link} to={`/project/${project_id}`}>
                Back to Resources
              </Button>
              <div></div>
              <Button type="submit" renderIcon={ArrowRight32}>
                Upload and Review
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UploadImage;

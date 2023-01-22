import React from "react";
import "../../styles/style-sheet/project-styles.scss";
import "../../styles/style-sheet/form-styles.scss";
import {
  Breadcrumb,
  BreadcrumbItem,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListCell,
  StructuredListRow,
  StructuredListBody,
} from "carbon-components-react";

import SettingsNav from "../../components/utils/SettingsNav";

const ReviewProject = () => {
  return (
    <div className="bx--grid projectBackground">
      <div className="bx--row breadCrumb" style={{ marginTop: "4vh" }}>
        <Breadcrumb noTrailingSlash>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/login">Login</BreadcrumbItem>
          <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
          <BreadcrumbItem href="/newproject">New Project</BreadcrumbItem>
          <BreadcrumbItem href="/newresource">New Resource</BreadcrumbItem>
          <BreadcrumbItem href="/uploadimage">Upload Image</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage href="/reviewproject">
            Review Project Data
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="bx--row welcomeHeader">
        <div className="bx--col-lg-3" style={{ paddingLeft: "0" }}>
          <h3>Review Project Data</h3>
        </div>
        <div className="bx--col-lg-3"></div>
        <div className="bx--col-lg-2"></div>
        <div className="bx--col-lg-4">
          <SettingsNav />
        </div>
      </div>
      <div className="bx--row" style={{ marginBottom: "1rem" }}>
        <div className="bx--col-lg-2" style={{ padding: "0" }}>
          <h4>Project and Resource Data</h4>
          <small>Review the project and Resource data</small>
        </div>
      </div>
      <div className="bx--row">
        <div className="bx--col-lg-8" style={{ backgroundColor: "#f4f4f4" }}>
          <StructuredListWrapper ariaLabel="Structured list">
            <StructuredListHead>
              <StructuredListRow head tabIndex={0}>
                <StructuredListCell head>Data</StructuredListCell>
                <StructuredListCell head>Value</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              <StructuredListRow tabIndex={0}>
                <StructuredListCell>Project Name</StructuredListCell>
                <StructuredListCell>Test-Project-124934</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow tabIndex={1}>
                <StructuredListCell>Resource Description</StructuredListCell>
                <StructuredListCell>Ibeju-Lekki Review</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow tabIndex={2}>
                <StructuredListCell>Location</StructuredListCell>
                <StructuredListCell>Ibeju-Lekki</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow tabIndex={3}>
                <StructuredListCell>Coordinates</StructuredListCell>
                <StructuredListCell>
                  3.1456, 6.4776, 1.24554, 4.3466
                </StructuredListCell>
              </StructuredListRow>
              <StructuredListRow tabIndex={4}>
                <StructuredListCell>Image 1 Description</StructuredListCell>
                <StructuredListCell>
                  Ibeju-Lekki 2020 January
                </StructuredListCell>
              </StructuredListRow>
              <StructuredListRow tabIndex={5}>
                <StructuredListCell>Image 1 Date</StructuredListCell>
                <StructuredListCell>2020-1-30</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow tabIndex={6}>
                <StructuredListCell>Image 2 Description</StructuredListCell>
                <StructuredListCell>Ibeju-Lekki 2020 March</StructuredListCell>
              </StructuredListRow>

              <StructuredListRow tabIndex={7}>
                <StructuredListCell>Image 2 Date</StructuredListCell>
                <StructuredListCell>2020-3-30</StructuredListCell>
              </StructuredListRow>
            </StructuredListBody>
          </StructuredListWrapper>
        </div>
      </div>
    </div>
  );
};

export default ReviewProject;

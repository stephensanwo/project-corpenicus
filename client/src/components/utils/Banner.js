import React from "react";
import { Button } from "carbon-components-react";
import { ArrowRight32 } from "@carbon/icons-react";
import "../../styles/style-sheet/banner-styles.scss";
import { Link } from "react-router-dom";

function Banner() {
  return (
    <div
      className="bx--grid bx--grid--full-width bannerBackground"
      style={{
        paddingTop: "100px",
        paddingBottom: "100px",
        backgroundColor: "#161616",
        paddingLeft: "50px",
        paddingRight: "50px",
      }}
    >
      <div className="bx--row">
        <div className="bx--col-lg-1"></div>
        <div className="bx--col-lg-14">
          <h1 style={{ paddingTop: "3rem" }}>Project Corpenicus</h1>
          <p
            style={{
              marginTop: "2rem",
              color: "#fff",
              lineHeight: "1.5rem",
              fontWeight: 600,
            }}
          >
            This project aims to naievely estimate urban development index (UDI)
            for target areas of interest (AOI) over time,
            <br />
            using satellite imagery and computer vision algorithms (Open CV).
            <br />
            The project is targeted at improving the inefficiencies in local
            government agencies in tracking, and analyzing
            <br />
            Urban Development Index within geolocations
            <br />
            <br />
            Created by: Stephen Sanwo (
            <a href="www.stephensanwo.dev">www.stephensanwo.dev</a>)
          </p>

          <div
            style={{
              gap: "20px",
              marginTop: "2rem",
            }}
          >
            <p
              style={{
                fontWeight: 600,
                color: "yellow",
                fontSize: "12px",
              }}
            >
              Note: This application is a development build for testing purposes
              only.
              <br />
              It is not intended for production use, nor does it guarantee
              accuracy of the result.
            </p>
          </div>

          <div
            className="bx--row"
            style={{ marginTop: "4rem", marginLeft: "0rem" }}
          >
            <div className="bx--col-lg-2" style={{ paddingLeft: "0rem" }}>
              <Button renderIcon={ArrowRight32} as={Link} to="/login">
                Login
              </Button>
            </div>

            <div className="bx--col-lg-10"></div>
          </div>
        </div>
        <div className="bx--col-lg-1"></div>
      </div>
    </div>
  );
}

export default Banner;

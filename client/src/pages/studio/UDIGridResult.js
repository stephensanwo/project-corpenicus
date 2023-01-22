import React, { useContext, useState, useEffect } from "react";
import { InlineLoading, Button, Loading } from "carbon-components-react";
import { Redo32 } from "@carbon/icons-react";
import { Link } from "react-router-dom";
import "../../styles/style-sheet/resource-styles.scss";
import "../../styles/style-sheet/project-styles.scss";
import { AuthContext } from "../../context/auth";
import { GET_RESOURCE } from "../../utils/graphql";
import { useQuery } from "@apollo/client";
import { Redirect } from "react-router-dom";
import { axios } from "../../utils/axios";
import GridSatelliteImages from "../../components/utils/GridSatelliteImages";

const UDIGridResult = (props) => {
  const [UDIResult, setUDIResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useContext(AuthContext);

  const project_id = props.match.params.project_id;
  const resource_id = props.match.params.resource_id;

  const { loading, error, data } = useQuery(GET_RESOURCE, {
    variables: {
      project_id: project_id,
      resource_id: resource_id,
    },
  });

  // Initialize Use Effect to Run on Page Load

  useEffect(() => {
    const runUDI = async () => {
      const params = {
        project_id: project_id,
        resource_id: resource_id,
      };

      const result = await axios.post(
        "/image_differencing_algorithm_grid",
        params,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setUDIResult(result);
      setIsLoading(false);
    };
    // Run the UDI Analysis on page load - useEffect
    runUDI();
  }, [project_id, resource_id]);

  // Check User Login

  if (!user) {
    alert("User session token has expired, redirecting to login");
    return <Redirect to="/login" />;
  }

  // Get Details for specific Resource

  if (error) {
    alert("Project not found, redirecting to projects");
    return <Redirect to={`/project/${project_id}`} />;
  }

  let resourceRender;

  if (loading) {
    resourceRender = <InlineLoading />;
  } else {
    resourceRender = data.getResource;
  }

  if (isLoading) {
    return (
      <Loading
        description="Running Urban Development Index Algorithm"
        withOverlay={true}
      />
    );
  } else {
    return (
      <div className="bx--grid projectBackground" style={{ marginTop: "5vh" }}>
        <div className="bx--row">
          <div className="bx--col-lg-10" style={{ padding: "0rem" }}>
            <h4>Urban Development Index Grid Result</h4>
          </div>
        </div>

        <div className="bx--row" style={{ marginBottom: "1rem" }}>
          <div className="bx--col-lg-4" style={{ padding: "0rem" }}>
            <div>
              <small style={{ color: "green" }}> {resource_id}</small>
            </div>
            <div>
              <small style={{ color: "green" }}>
                Location: {resourceRender.location}, {resourceRender.state}
              </small>
            </div>
            <div>
              <small style={{ color: "green" }}>
                coordinates: {resourceRender.coordinates}
              </small>
            </div>
          </div>
          <div
            className="bx--col-lg-8"
            style={{
              display: "grid",
              gridTemplateColumns: "4fr 2fr 2fr",
              paddingLeft: "0rem",
              paddingRight: "0rem",
            }}
          >
            <div></div>
            <Button
              kind="secondary"
              style={{ marginRight: "1rem" }}
              renderIcon={Redo32}
              as={Link}
              to={`/project/${project_id}`}
            >
              Back to Resources
            </Button>

            <div></div>
          </div>
        </div>
        <div
          className="bx--row"
          style={{ marginTop: "2vh", maxHeight: "50vh" }}
        >
          <GridSatelliteImages result={UDIResult} />
        </div>
      </div>
    );
  }
};

export default UDIGridResult;

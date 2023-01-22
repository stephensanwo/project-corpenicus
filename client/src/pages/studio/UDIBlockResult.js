import React, { useContext, useState, useEffect } from "react";
import {
  InlineLoading,
  Button,
  Tooltip,
  Loading,
} from "carbon-components-react";
import { Renew32, Redo32 } from "@carbon/icons-react";
import { Link } from "react-router-dom";
import "../../styles/style-sheet/resource-styles.scss";
import "../../styles/style-sheet/project-styles.scss";
import { AuthContext } from "../../context/auth";
import { GET_RESOURCE } from "../../utils/graphql";
import { useQuery } from "@apollo/client";
import { Redirect } from "react-router-dom";
import BlockSatelliteImages from "../../components/utils/BlockSatelliteImages";
import { axios } from "../../utils/axios";

const UDIBlockResult = (props) => {
  const [filter, setFilter] = useState("default");
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
        "/image_differencing_algorithm_block",
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

  const filterView = (e) => {
    if (e.target.id === "new") {
      setFilter("new");
    } else if (e.target.id === "negative") {
      setFilter("negative");
    } else if (e.target.id === "default") {
      setFilter("default");
    }
  };

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
          <div className="bx--col-lg-10" style={{ padding: "0" }}>
            <h4>
              Urban Development Index Score:{" "}
              <strong style={{ color: "red" }}>
                {UDIResult.data.data.urban_development_index}%
              </strong>
            </h4>
          </div>
        </div>

        <div className="bx--row" style={{ marginBottom: "1rem" }}>
          <div className="bx--col-lg-4" style={{ padding: "0" }}>
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
            <Tooltip direction="bottom" triggerText="Filter Image Result">
              <div>
                <Button
                  size="small"
                  kind="ghost"
                  onClick={filterView}
                  id="default"
                >
                  Old-Image/Old-Diff View (Default)
                </Button>
              </div>
              <div>
                <Button size="small" kind="ghost" onClick={filterView} id="new">
                  Old-Image/New-Diff View
                </Button>
              </div>
              <div>
                <Button
                  size="small"
                  kind="ghost"
                  onClick={filterView}
                  id="negative"
                >
                  Old-Image/Negative View
                </Button>
              </div>
            </Tooltip>

            <Button
              kind="secondary"
              style={{ marginRight: "1rem" }}
              renderIcon={Redo32}
              as={Link}
              to={`/project/${project_id}`}
            >
              Back to Resources
            </Button>

            <Button
              kind="danger"
              renderIcon={Renew32}
              type="button"
              as={Link}
              to={`/UDIgridresult/${project_id}/${resource_id}`}
            >
              Run UDI Grid Analysis
            </Button>
          </div>
        </div>
        <div
          className="bx--row"
          style={{ marginTop: "2vh", maxHeight: "50vh" }}
        >
          <BlockSatelliteImages UDIResult={UDIResult} filter={filter} />
        </div>
      </div>
    );
  }
};

export default UDIBlockResult;

import React, { useContext } from "react";
import { InlineLoading, Button, Tooltip } from "carbon-components-react";
import { Renew32, Redo32 } from "@carbon/icons-react";
import { Link } from "react-router-dom";
import "../../styles/style-sheet/resource-styles.scss";
import "../../styles/style-sheet/project-styles.scss";
import { AuthContext } from "../../context/auth";
import { GET_RESOURCE } from "../../utils/graphql";
import { useQuery } from "@apollo/client";
import { Redirect } from "react-router-dom";
import SatelliteImages from "../../components/utils/SatelliteImages";

const Resource = (props) => {
  const { user } = useContext(AuthContext);

  const project_id = props.match.params.project_id;
  const resource_id = props.match.params.resource_id;

  const { loading, error, data } = useQuery(GET_RESOURCE, {
    variables: {
      project_id: project_id,
      resource_id: resource_id,
    },
  });

  if (!user) {
    alert("User session token has expired, redirecting to login");
    return <Redirect to="/login" />;
  }

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

  const runUDI = async (e) => {
    // Redirect to project review
    props.history.push(`/UDIblockresult/${project_id}/${resource_id}`);
  };

  return (
    <div className="bx--grid projectBackground" style={{ marginTop: "5vh" }}>
      <div className="bx--row">
        <div className="bx--col-lg-10" style={{ padding: "0" }}>
          <h4>Preview Satellite Images</h4>
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
          <Tooltip direction="bottom" triggerText="Important Notice">
            <p>
              The accuracy of the satellite imagery analysis depends on the type
              and quality of the image uploaded. Ensure that you have properly
              checked the image before you proceed.
            </p>
            <div className="bx--tooltip__footer">
              <Link href="#" to={""}>
                Learn more
              </Link>
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
            onClick={runUDI}
          >
            Run UDI Analysis
          </Button>
        </div>
      </div>
      <div className="bx--row" style={{ marginTop: "2vh", maxHeight: "50vh" }}>
        <SatelliteImages projectID={project_id} resourceID={resource_id} />
      </div>
    </div>
  );
};

export default Resource;

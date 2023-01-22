import React, { Fragment, useState, useEffect } from "react";
import { Loading } from "carbon-components-react";
import ReactCompareImage from "react-compare-image";
import { axios } from "../../utils/axios";
import { Link } from "react-router-dom";

const SatelliteImages = ({ projectID, resourceID }) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setError] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const params = {
        project_id: projectID,
        resource_id: resourceID,
      };
      const result = await axios.post("/get_satellite_images", params);
      setError(result.data.errors);
      setImages(result);
      setIsLoading(false);
    };
    fetchImages();
  }, [projectID, resourceID]);

  if (errors.length !== 0) {
    return (
      <div className="bx--grid">
        <div
          className="bx--row"
          style={{ marginTop: "20vh", marginBottom: "1rem" }}
        >
          <div className="bx--col-lg-12" style={{ marginTop: "5rem" }}>
            <h4 style={{ textAlign: "center" }}>
              Add satellite imagery to your resource before you can run analysis
            </h4>
            <h4 style={{ textAlign: "center", marginTop: "1rem" }}>
              <Link to={`/uploadimage/${projectID}/${resourceID}`}>
                Upload Satellite Imagery
              </Link>
            </h4>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <Loading description="Fetching Resource Images" withOverlay={true} />
    );
  } else {
    return (
      <Fragment>
        <ReactCompareImage
          leftImage={`${images.config.baseURL}${images.data.data.image_2_url}`}
          rightImage={`${images.config.baseURL}${images.data.data.image_1_url}`}
          leftImageCss={{
            objectPosition: "center",
          }}
          rightImageCss={{
            objectPosition: "center",
          }}
          skeleton={<Loading />}
        />
      </Fragment>
    );
  }
};

export default SatelliteImages;

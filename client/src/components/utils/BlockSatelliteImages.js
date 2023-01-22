import React, { Fragment } from "react";
import { Loading } from "carbon-components-react";
import ReactCompareImage from "react-compare-image";

const BlockSatelliteImages = ({ UDIResult, filter }) => {
  if (filter === "default") {
    return (
      <Fragment>
        <ReactCompareImage
          leftImage={`${UDIResult.config.baseURL}${UDIResult.data.data.image_2_url}`}
          rightImage={`${UDIResult.config.baseURL}${UDIResult.data.data.diff_image_2_url}`}
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
  } else if (filter === "new") {
    return (
      <Fragment>
        <ReactCompareImage
          leftImage={`${UDIResult.config.baseURL}${UDIResult.data.data.image_2_url}`}
          rightImage={`${UDIResult.config.baseURL}${UDIResult.data.data.diff_image_1_url}`}
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
  } else if (filter === "negative") {
    return (
      <Fragment>
        <ReactCompareImage
          leftImage={`${UDIResult.config.baseURL}${UDIResult.data.data.image_2_url}`}
          rightImage={`${UDIResult.config.baseURL}${UDIResult.data.data.image_diff_url}`}
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

export default BlockSatelliteImages;

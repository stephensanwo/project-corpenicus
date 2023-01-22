import React from "react";
import "../../styles/style-sheet/image-grid.scss";

const GridSatelliteImages = ({ result }) => {
  const ImageUrl = result.config.baseURL;
  const ImageGrid = result.data.data.image_grid;
  const HighUDI = 10;
  return (
    <div className="bx--grid" style={{ padding: "0rem", marginLeft: "1rem" }}>
      <div className="bx--row">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
            rowGap: "0.2rem",
            columnGap: "0.2rem",
          }}
        >
          {ImageGrid.map((image, index) => {
            return (
              <div key={index} className="image-container">
                <img
                  src={`${ImageUrl}${image.diff_image_2_url}`}
                  alt="Grid"
                  style={{ maxWidth: "250px" }}
                />
                <div className="after">
                  <h4>Urban Development Index</h4>
                  <h1
                    className={
                      image.urban_development_index > HighUDI
                        ? "HighUDI"
                        : "MedUDI"
                    }
                  >
                    {image.urban_development_index}%
                  </h1>
                  <p>0.5 Km * 0.5 Km</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GridSatelliteImages;

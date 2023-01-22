module.exports.validateResourceInput = (
  location,
  country,
  state,
  coordinates,
  image_1_description,
  image_2_description,
  image_1_date,
  image_2_date
) => {
  const errors = {};
  if (location.trim() === "") {
    errors.location = "Location cannot be empty";
  }
  if (country.trim() === "") {
    errors.country = "Country cannot be empty";
  }
  if (state.trim() === "") {
    errors.state = "State cannot be empty";
  }
  if (coordinates.trim() === "") {
    errors.coordinates = "Coordinates cannot be empty";
  }
  if (image_1_description.trim() === "") {
    errors.image_1_description = "Image 1 description cannot be empty";
  }
  if (image_2_description.trim() === "") {
    errors.image_2_description = "Image 2 description cannot be empty";
  }
  if (image_1_date.trim() === "") {
    errors.image_1_date = "Image 1 date cannot be empty";
  }
  if (image_2_date.trim() === "") {
    errors.image_2_date = "Image 2 date cannot be empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

var utils = require("users/aazuspan/geeSharpening:utils");

// Calculate the MSE between an assesment image and a reference image.
// Images should have same number of bands, same resolution, and same extent.
// See Hagag et al 2013, equation 5. If not perBand, the mean MSE of all bands
// is returned.
// Note: MSE is relative to image intensity.
exports.calculate = function (referenceImage, assessmentImage, perBand) {
  // Default to returning image average
  if (utils.isMissing(perBand)) {
    perBand = false;
  }

  var mse = referenceImage
    .subtract(assessmentImage)
    .pow(2)
    .reduceRegion({ reducer: ee.Reducer.mean() })
    .values();

  // If not per band, average all bands
  if (perBand === false) {
    mse = ee.Number(mse.reduce(ee.Reducer.mean()));
  }

  return mse;
};

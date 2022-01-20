var utils = require("users/aazuspan/geeSharp:utils.js");

/**
 * Calculate difference in variance (DIV) between a reference image and a
 * modified image. Values near 0 represent high similarity between images.
 * @param {ee.Image} referenceImage An unmodified image.
 * @param {ee.Image} assessmentImage A version of the reference image that has
 *  been modified, such as through compression or pan-sharpening. DIV will be
 *  calculated between this image and the reference image.
 * @param {ee.Geometry, default null} geometry The region to calculate DIV
 *  for.
 * @param {ee.Number, default null} scale The scale, in projection units, to
 *  calculate DIV at.
 * @param {ee.Number, default 1000000000000} maxPixels The maximum number of
 *  pixels to sample.
 * @return {ee.Dictionary} Per-band DIV for the image
 */
exports.calculate = function (
  referenceImage,
  assessmentImage,
  geometry,
  scale,
  maxPixels
) {
  if (utils.isMissing(maxPixels)) {
    maxPixels = 1e12;
  }

  var xVar = ee.Array(
    referenceImage
      .reduceRegion({
        reducer: ee.Reducer.variance(),
        geometry: geometry,
        scale: scale,
        maxPixels: maxPixels,
      })
      .values()
  );

  var yVar = ee.Array(
    assessmentImage
      .reduceRegion({
        reducer: ee.Reducer.variance(),
        geometry: geometry,
        scale: scale,
        maxPixels: maxPixels,
      })
      .values()
  );

  var DIV = yVar.divide(xVar).multiply(-1).add(1);
  return ee.Dictionary.fromLists(referenceImage.bandNames(), DIV.toList());
};

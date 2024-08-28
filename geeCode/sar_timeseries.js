// Define study period 
var start = '2020-09-01';
var end = '2020-11-30';

// Pull image collection with filters and select VV and VH bands
var s1_collection = ee.ImageCollection("COPERNICUS/S1_GRD")
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .filterMetadata('resolution_meters', 'equals', 10)
  .filterBounds(geometry)
  .filterDate(start, end)
  .select('VV', 'VH');

print(s1_collection)

var first = s1_collection.first()

Map.addLayer(s1_collection,  {min:-25, max:0}, "first image");
  
// Separate image colleciton for ascending and descending
var asc_collection = s1_collection.filter((ee.Filter.eq('orbitProperties_pass', 'ASCENDING')));
var desc_collection = s1_collection.filter((ee.Filter.eq('orbitProperties_pass', 'DESCENDING')));


var first1 = desc_collection.first()

Map.addLayer(first1,  {min:-25, max:0}, "first image1");
print(asc_collection, 'repeats')
print(desc_collection, 'desc')

var distinctDates = asc_collection
    .map(function(image) {
      return ee.Feature(null, {'date': image.date().format('YYYY-MM-dd')})
    })
    .distinct('date')
    .aggregate_array('date')
print('Dates with images under threshold:', distinctDates);

var createMosaic = function(date) {
  var filtered1 = asc_collection.filterDate(date, date.advance(1, 'day'));
  var mosaic = filtered1.mosaic();
  // Set all original properties to the mosaic image
  return mosaic.set('system:time_start', date);
};

var mosaicCollection = ee.ImageCollection.fromImages(
  distinctDates.map(function(date) {
    return createMosaic(ee.Date(date));
  })
);

print(mosaicCollection)

var SMOOTHING_RADIUS = 50;

// Create a function which clips, filters speckles, computes the means for the VV and VH bands 
var clip_filter = function(image) {
  // clip image to the river 
  var clipped_image = image.clip(geometry);
  
  // remove speckles 
  var filtered = clipped_image.focal_mean(SMOOTHING_RADIUS, 'circle', 'meters');
 
  // find the mean of the vv band
  var vv_mean = filtered.select('VV').reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: geometry,
    scale: 10 // Adjust the scale as per your requirement
  }).get('VV');
  
  // find the mean of the vh band 
  var vh_mean = filtered.select('VH').reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: geometry,
    scale: 10 // Adjust the scale as per your requirement
  }).get('VH');
  
  // add the mean values as properties of the image 
  filtered = filtered.set('VV_mean', vv_mean)
  filtered = filtered.set('VH_mean', vh_mean)
  
  var date = ee.Date(filtered.get('system:time_start'));
  filtered = filtered.set('image_date', date);


  return filtered
}

// Create new collections which the function has been applied to for ascending and descending
var filtered_collection_asc = mosaicCollection.map(clip_filter);
var filtered_collection_desc = desc_collection.map(clip_filter);

// Map.addLayer(filtered_collection_asc, {min:-25, max:0}, "filtered collection")

// Create a feature collection for plotting VH mean for both ascending and descending image collections
var combinedVHFeatureCollectionAsc = filtered_collection_asc.map(function (image) {
  return ee.Feature(null, {
    'date': ee.Date(image.get('image_date')),
    'VH_mean': image.get('VH_mean'),
    'orbit': 'Ascending'
  });
});

var combinedVHFeatureCollectionDesc = filtered_collection_desc.map(function (image) {
  return ee.Feature(null, {
    'date': ee.Date(image.get('image_date')),
    'VH_mean': image.get('VH_mean'),
    'orbit': 'Descending'
  });
});

// Plot the combined feature collection for VH mean (ascending)
var chartCombinedVHAsc = ui.Chart.feature.byFeature(combinedVHFeatureCollectionAsc, 'date', ['VH_mean'])
  .setChartType('ScatterChart')
  .setOptions({
    title: 'VH Mean Over Time (Ascending)',
    hAxis: {
      title: 'Date',
      format: 'MM-dd-yyyy',
    },
    vAxis: {
      title: 'VH Mean',
      viewWindow: {  
        min: -34,      
        max: -18       
      }
    },
    pointSize: 3,
    colors: ['blue'],
    trendlines: {
      0: {
        type: 'polynomial',
        color: 'blue',
        lineWidth: 2,
        opacity: 0.8,
        showR2: true,
      }
    }
  });



Map.centerObject(geometry);
Map.addLayer(geometry);

var startDate = '2017-10-14';
var endDate = '2017-10-19';

var collection = ee.ImageCollection('COPERNICUS/S2')
                  .filterBounds(geometry)
                  .filterDate(startDate, endDate);
                  
print("Number of images = ", collection.size());

var sentinelImage = 
    collection.sort('CLOUDY_PIXEL_PERCENTAGE')
    .first()
    .clip(geometry);
    
print("Sentinel image taken at = ", sentinelImage.date());


Map.addLayer(
    sentinelImage,
    {min: 0, max: 2000, bands: ['B4', 'B3', 'B2']},
    'RGB');

var ndwi =
    sentinelImage.normalizedDifference(['B3', 'B8']).rename('NDWI');
    
Map.addLayer(
    ndwi,
    {palette: ['red', 'yellow', 'green', 'cyan', 'blue']},
    'NDWI');
  
var sentinelPixels = ndwi.sampleRegions(collection);
Export.table.toDrive(sentinelPixels, 'ndwiPixels')

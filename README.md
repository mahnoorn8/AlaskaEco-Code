# AlaskaEcoCode

Google Earth Engine API is available here: https://github.com/google/earthengine-api 

## Repository Contents

- **NDWI Calculation:**
  - **`ndwi_calc.js`**: Calculates the Normalized Difference Water Index (NDWI) from Sentinel-2 imagery. This script filters Sentinel-2 images based on date and geographic bounds, selects the image with the least cloud coverage, computes the NDWI using the Green (B3) and Near-Infrared (B8) bands, and exports the NDWI values for further analysis.

- **Cloud Masking:**
  - **`cloud_masking.js`**: Contains a function to mask clouds in Sentinel-2 imagery using the QA60 band. The script filters Sentinel-2 images based on date and cloud cover percentage, applies the cloud masking function, and visualizes the images. It is designed to reduce cloud interference for more accurate analysis and visualization.

- **SAR Data Processing:**
  - **`sar_processing.js`**: Processes Sentinel-1 Synthetic Aperture Radar (SAR) data. This script filters Sentinel-1 images by date, orbit direction, and polarization bands (VV and VH). It creates mosaics for each distinct date, computes the mean values of VV and VH bands, and prepares the data for visualization and analysis. It also includes functionality for plotting VH mean values over time.

## Getting Started

### Prerequisites

- **Google Earth Engine Account:** Ensure you have an active Google Earth Engine account. [Sign up here](https://signup.earthengine.google.com/).
- **Basic Understanding of GEE:** Familiarity with the Google Earth Engine JavaScript API will help in running and modifying the scripts.

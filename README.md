# AlaskaEcoCode

Google Earth Engine API is available here: https://github.com/google/earthengine-api 

## Repository Contents

- **Sentinel-1 Data Processing:**
  - **`sentinel1_processing.js`**: Filters and analyzes Sentinel-1 SAR data. This script performs cloud masking, image mosaicking, and statistical analysis of VV and VH polarization bands. It separates images by orbit direction, creates mosaics for each date, and calculates mean values for specific bands.

- **Sentinel-2 Data Processing:**
  - **`sentinel2_processing.js`**: Masks clouds in Sentinel-2 images using the QA60 band and visualizes RGB composites. This script filters images based on cloud cover and geographic bounds, applies a cloud masking function, and sets up the images for visualization.

- **Utilities and Functions:**
  - **`utils.js`**: Contains custom functions used for data preprocessing and analysis, such as cloud masking functions for Sentinel-2 imagery.

## Getting Started

### Prerequisites

- **Google Earth Engine Account:** Ensure you have an active Google Earth Engine account. [Sign up here](https://signup.earthengine.google.com/).
- **Basic Understanding of GEE:** Familiarity with the Google Earth Engine JavaScript API will help in running and modifying the scripts.

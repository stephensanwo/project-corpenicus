# Project Corpenicus - UDI Tracking with Satellite Imagery and Computer Vision Algorithms

This project naively estimates urban development index (UDI) for target areas of interest (AOI) over time, using satellite imagery and computer vision algorithms (Open CV). The project is targeted at improving the inefficiencies in local government agencies in tracking and analyzing Urban Development Index within geolocations

## About this project

Project corpenicus was part of a prototyping effort to use OpenCV to find the difference between two satellite images over-time, and compute the pixel differences, as a rough representation of the development index of that geolocation. This prototype lacks advanced considerations such as image segmentation techniques to accurately identify structures which are markers of urban development, such as highways, buildings, etc. Please feel free to reach out to me should you have ideas on improving this prototype

## Application Architecture

The application has three microservices; The User Interface, built in ReactJs. The Users Backend built with NodeJs and GraphQL - This was my first experimentation with a GraphQL backend, and I can perhaps conclude that GraphQL is not for me. The Image Differencing Microservice - This is the OpenCV service that stores the images and computes the differences; built in Python and Flask.

#### Login Screen

![Login Screen](https://imagedelivery.net/QvztslYf_CbfgwmRjfn0OA/46610e10-d90f-4f33-2f10-31dc98b44a00/public)

####

Projects Overview
Projects help organize different geolocations as distinct projects. Create a new project for a new geo-location

![Projects Overview](https://imagedelivery.net/QvztslYf_CbfgwmRjfn0OA/7498a582-607d-4559-83cb-fda0e1e65400/public)

#### Project Resources

Add new resources to your project.

![Resources](https://imagedelivery.net/QvztslYf_CbfgwmRjfn0OA/e5c7af64-31bb-45d4-3550-40a7f4c7b900/public)

#### Create New Resource

Define the resource parameters

![Create New Resource](https://imagedelivery.net/QvztslYf_CbfgwmRjfn0OA/39dc96d1-ebba-4aa8-43dd-51bfaafecc00/public)

#### Satelite Image Upload

Upload the current and old images within period of review (Images from planet.com)

![Upload New Imagery](https://imagedelivery.net/QvztslYf_CbfgwmRjfn0OA/74b39aa3-4a7e-4a02-33ed-000334f82e00/public)

#### Image Split View

Use the slider to view both images overlayed. Click RunUDI Analysis to run the differencing algorithm

![Image Split View](https://imagedelivery.net/QvztslYf_CbfgwmRjfn0OA/024d9b75-ef7f-43d1-28b0-244f915ef700/public)

#### Image Differencing View

The differencing algorithm highlights the changes. Click RUN UDI Grid Analysis to split the grids and compute UDI per 0.5km

![Image Differencing View](https://imagedelivery.net/QvztslYf_CbfgwmRjfn0OA/8dd0a7b7-eef0-487f-bcf6-a8ca5eeb7b00/public)

#### Urban Development Index Grid

Computed UDI per 0.5km

![UDI Grid](https://imagedelivery.net/QvztslYf_CbfgwmRjfn0OA/29e00c29-38c0-47e0-06c4-f94667dc2300/public)

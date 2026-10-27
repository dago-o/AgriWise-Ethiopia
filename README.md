# 🌱 AgriWise-Ethiopia

**AgriWise-Ethiopia** is a web-based agricultural decision-support and
farm-management platform developed for the Ethiopian context. It brings
farm and crop management, crop-health and risk records, weather
information, agricultural market prices, learning resources, analytics,
and AI-powered agricultural assistance into one application.

📽️ **Project Presentation Video:** [Watch the presentation](https://drive.google.com/file/d/1558QI0XMWCZ9XMpP3asdxTrdXPXJzDih/view?usp=sharing)\
📄 **Project Documentation:** [View the project documentation (PDF)](https://drive.google.com/file/d/1jp9Bj9eR3Koyr93pYIYg2BqrDOszg43b/view?usp=sharing)\
> 🟢 **[Live Demo](https://agriwise-ethiopia.pages.dev)**


> 🟢 **Project Status:** Deployed web application  
> 🎓 **Project Type:** INSA Summer Talent Camp graduation project  
> 👨‍💻 **Developer:** Degefa Lemma Gadisa  
> 🆔 **Student ID:** CTC-623-26  
> 🌍 **Target Context:** Ethiopia  
> 🏗️ **Architecture:** React frontend + Node.js/Express REST API + MongoDB

## Table of contents

-   [Overview](#overview)
-   [Problem and objectives](#problem-and-objectives)
-   [User roles](#user-roles)
-   [Implemented features](#implemented-features)
-   [Technology stack](#technology-stack)
-   [System architecture](#system-architecture)
-   [Repository structure](#repository-structure)
-   [API modules](#api-modules)
-   [Security](#security)
-   [Deployment](#deployment)
-   [Run locally](#run-locally)
-   [Environment configuration](#environment-configuration)
-   [Testing and verification](#testing-and-verification)
-   [Future improvements](#future-improvements)
-   [Developer](#developer)
-   [License](#license)

## Overview

Agriculture is central to the livelihoods of many people in Ethiopia.
Farmers make decisions about crops, weather, crop conditions, and farm
operations, but relevant information can be spread across different
sources.

AgriWise-Ethiopia provides a centralized application where farmers can
manage farm information and access agricultural information and digital
decision support. Administrators can maintain selected platform content
and information.

AgriWise is intended to **support agricultural decision-making**, not
replace qualified agricultural professionals. AI-generated guidance
should be treated as preliminary information and checked with an
agricultural expert when needed.

## Problem and objectives

The project aims to:

-   Provide digital farm, field, and crop management.
-   Let farmers record crop-health observations and crop-risk
    information.
-   Present weather information and forecasts relevant to farm planning.
-   Provide agricultural market-price information.
-   Make agricultural learning resources available in one place.
-   Present relevant summaries and analytics.
-   Provide AI-assisted agricultural guidance using available context.
-   Give administrators tools to manage selected content and platform
    information.

## User roles

### Farmer

Depending on the feature, a farmer can manage farm-related records, view
weather information, record crop-health information, view crop-risk
information, access market prices and learning resources, and use the AI
assistant.

### Admin

The `admin` role is used for authorized administrative functions,
including management of agricultural learning resources and market-price
information and access to administrative analytics.

Registration and authorization rules are enforced by the backend.
Administrative access should not be assumed to be available through
public registration.

## Implemented features

### Farm, field, and crop management

-   Manage farm records and associated fields and crops.
-   Keep farm information organized for use by other application
    features.

### Crop health and crop risk

-   Record crop-health information.
-   Access crop-risk functionality for agricultural decision support.
-   Treat digital guidance as preliminary rather than a professional
    diagnosis.

### Weather and forecasts

-   Retrieve weather information associated with a farm.
-   Access forecast information and weather-alert functionality where
    supported by available data and service responses.
-   Weather and location results depend on the external services and the
    quality of the supplied location.

### Economics and market prices

-   Access agricultural economic information supported by the
    application.
-   View market/reference-price information.
-   Authorized administrators can manage market-price records.

### Agricultural learning resources

-   Provide agricultural educational content, including supported
    resource types such as articles, readings, and videos.
-   Authorized administrators can create and manage resources; farmers
    can access available resources.

### Analytics and administration

-   Provide dashboard analytics and reports for administrative or
    agricultural-information monitoring.
-   Available figures depend on the records stored in the application.

### AI agricultural assistant

-   Integrate Google's Gemini model for AI-powered agricultural
    assistance.
-   The backend can use relevant available agricultural context,
    including weather context where supplied, to improve the usefulness
    of responses.
-   AI responses can be inaccurate or incomplete and should be treated
    as decision support, not authoritative diagnosis.

## Technology stack

  -----------------------------------------------------------------------
  Area                                Technologies
  ----------------------------------- -----------------------------------
  Frontend                            React, Vite, JavaScript, Tailwind
                                      CSS

  Frontend organization               Feature-oriented modules, shared
                                      components, context, hooks, and
                                      library utilities

  Backend                             Node.js, Express.js

  Database                            MongoDB with Mongoose

  Authentication                      JSON Web Tokens (JWT), password
                                      hashing, role-based authorization

  API communication                   REST endpoints using JSON

  AI integration                      Google Gemini API

  External information                Weather and geocoding services, as
                                      configured
  -----------------------------------------------------------------------

The table describes the technologies used by the project. Exact package
versions are available in the respective `package.json` files.

## System architecture

AgriWise uses a separate frontend and backend. The frontend sends HTTP
requests to the backend REST API. The backend validates requests,
applies authentication and authorization where required, performs
application logic, accesses MongoDB, and communicates with configured
external services.

``` text
Farmer / Admin
      |
      v
React + Vite frontend
      |
      | HTTP requests / JSON
      v
Node.js + Express REST API
      |
      +---------------------> MongoDB
      |
      +---------------------> Weather / geocoding services
      |
      +---------------------> Gemini API
```

The frontend and backend can be deployed independently. Production URLs
and secrets are configured through the hosting platforms and environment
variables.

## Repository structure

The repository contains separate `Frontend` and `Backend` applications.
The frontend source is organized into folders for application setup,
reusable components, context, feature modules, hooks, shared libraries,
and styles.

``` text
AgriWise-Ethiopia/
├── Backend/
│   ├── src/
│   ├── App.js
│   ├── server.js
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── styles/
│   └── package.json
└── README.md
```

This is a high-level overview. Refer to the actual folders and files in
the current `dev` branch for the complete structure.

## API modules

The backend exposes REST API functionality under the `/api` prefix.
Implemented modules include:

  -----------------------------------------------------------------------
  Module                              Purpose
  ----------------------------------- -----------------------------------
  Authentication                      Registration, login, and
                                      authenticated access

  Farms, fields, and crops            Manage agricultural records

  Crop health                         Store and retrieve crop-health
                                      records

  Crop risk                           Access crop-risk records and
                                      functionality

  Weather                             Farm weather, forecasts, and
                                      weather alerts

  Economics and market prices         Agricultural economic and
                                      reference-price information

  Agricultural resources              Manage and access educational
                                      resources

  Analytics                           Dashboard analytics and reports

  AI assistant                        AI-powered agricultural assistance
  -----------------------------------------------------------------------

Known route groups from the implementation include `/api/farm`,
`/api/field`, `/api/crop`, `/api/crop-health`, and `/api/crop-risk`.
Weather routes include farm-specific weather, forecast, and alert
functionality. Check the current backend route files for the exact HTTP
methods, parameters, and complete endpoint list; do not rely on this
summary as a substitute for the route definitions.

## Security

Security-related implementation includes:

-   JWT-based authentication for protected requests.
-   Password hashing.
-   Role-based authorization for restricted functionality.
-   CORS configuration for frontend/backend communication.
-   Environment-based configuration for secrets and service credentials.

Keep real `.env` files, database credentials, JWT secrets, and external
API keys out of Git. Only share placeholder values in documentation.
Production security also depends on correct hosting configuration and
secret management.

## Deployment

The application has been deployed with the frontend and backend hosted
separately. The frontend communicates with the deployed backend API, and
the backend connects to the configured MongoDB database and external
services.

Deployment configuration is managed by the hosting platforms and
repository branch settings. The current deployment branch is `dev`;
pushing changes to that branch may trigger an automatic deployment
depending on the configured build/deploy rules.

For production deployment: 1. Configure the backend environment
variables in the backend hosting service. 2. Configure the MongoDB
connection string and external service credentials securely. 3. Set the
frontend's API configuration to the deployed backend URL or use the
configured API proxy approach. 4. Confirm the backend's CORS settings
allow the deployed frontend origin. 5. Test registration/login and the
main feature workflows after deployment.

Do not place production secrets or private connection strings in this
README.

## Run locally

### Prerequisites

-   Node.js and npm
-   Git
-   A MongoDB database (local MongoDB or MongoDB Atlas)
-   Required credentials for external services used by enabled features

Check your versions:

``` bash
node --version
npm --version
git --version
```

### 1. Clone the repository

``` bash
git clone https://github.com/dago-o/AgriWise-Ethiopia.git
cd AgriWise-Ethiopia
```

### 2. Configure and start the backend

Open a terminal:

``` bash
cd Backend
npm install
```

Create a local `.env` file using the project's environment-variable
example, if present, and provide the required values. Then start the
backend using the script defined in `Backend/package.json` (the
development script has been used as `npm run dev`).

The backend has been configured to use port `7000` by default in the
development setup. Check the current backend configuration if your local
settings differ.

### 3. Configure and start the frontend

Open a second terminal from the repository root:

``` bash
cd Frontend
npm install
npm run dev
```

Vite normally serves the development frontend at
`http://localhost:5173`. Follow the API URL/proxy configuration in the
current frontend source and environment examples so requests reach your
local backend.

### 4. Verify the application

-   Open the local frontend URL shown by Vite.
-   Register or log in with a test account.
-   Verify access to features appropriate for the test account's role.
-   Check the browser console and backend terminal if a request fails.

The exact npm scripts and required environment variables are defined in
the current `package.json` files and environment examples.

## Environment configuration

Environment-variable names can change with the implementation. Before
running the project, check:

-   `Backend/.env.example`, if present, for backend configuration.
-   `Frontend/.env.example`, if present, for frontend configuration.
-   The backend configuration files for database, JWT,
    weather/geocoding, and Gemini settings.
-   The frontend API client and Vite configuration for local proxy or
    production API URL settings.

Typical values include a backend port, MongoDB connection string, JWT
secret, and credentials for external services. Use the exact variable
names expected by the code; do not copy placeholder names blindly. Never
commit real secrets.

## Testing and verification

The backend feature modules were developed and tested individually
during implementation. Before a presentation or future release, verify
the complete deployed workflows, especially:

-   Authentication and role-based access.
-   Farm, field, and crop management.
-   Crop-health and crop-risk functionality.
-   Weather and forecast requests.
-   Market-price viewing and administrative management.
-   Agricultural learning resources.
-   Analytics and AI assistance.

External API responses can vary with network availability, credentials,
location resolution, and service limits.

## Future improvements

Potential future enhancements include:

-   Broader Afaan Oromo and Amharic language support.
-   More robust location resolution and regional agricultural data.
-   Expanded offline/mobile usability.
-   Additional crop monitoring and data visualization.
-   Further evaluation and validation of AI-generated guidance.
-   More comprehensive automated testing and monitoring.

These are potential future enhancements, not claims that they are
already implemented.

## Developer

**Degefa Lemma**\
BSc in Information Systems, Addis Ababa University

AgriWise-Ethiopia was developed as an individual graduation project in
the INSA Summer Talent Camp.

## License

This repository is an academic and portfolio project. No formal
open-source license is specified here. Unless a license is added to the
repository, reuse and redistribution are subject to applicable copyright
law.

------------------------------------------------------------------------

> 🌱 **AgriWise-Ethiopia --- Smarter farming decisions through connected
> data, useful insights, and personalized digital assistance.**

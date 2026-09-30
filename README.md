# 🌱 AgriWise Ethiopia

**AgriWise Ethiopia** is a web-based agricultural decision-support and farm management platform designed to help Ethiopian farmers manage their farming activities, monitor crop conditions, understand weather-related risks, track farm finances, and receive personalized AI-powered agricultural guidance.

The platform combines **farm management, crop monitoring, weather information, smart alerts, agricultural finance tracking, and a personalized AI assistant** in a single system.

> 🚧 **Project Status:** In Development
> 🎓 **Project Type:** INSA Graduation Project
> 🌍 **Target Context:** Ethiopia
> 🏗️ **Architecture:** MERN Stack — MongoDB, Express.js, React, Node.js

---

## 📌 Table of Contents

* [Overview](#-overview)
* [Problem Statement](#-problem-statement)
* [Project Objectives](#-project-objectives)
* [Target Users](#-target-users)
* [Core Features](#-core-features)
* [System Workflow](#-system-workflow)
* [AI Assistant](#-ai-assistant)
* [Technology Stack](#-technology-stack)
* [System Architecture](#-system-architecture)
* [Project Structure](#-project-structure)
* [Database Overview](#-database-overview)
* [Authentication and Security](#-authentication-and-security)
* [API Architecture](#-api-architecture)
* [Frontend Structure](#-frontend-structure)
* [Git and Branching Strategy](#-git-and-branching-strategy)
* [Installation and Setup](#-installation-and-setup)
* [Environment Variables](#-environment-variables)
* [Development Workflow](#-development-workflow)
* [Future Improvements](#-future-improvements)
* [Project Goals](#-project-goals)
* [License](#-license)

---

# 🌾 Overview

Agriculture is an important part of Ethiopia's economy and the livelihood of a large portion of its population. However, farmers often need to make decisions about crops, weather, crop health, farm activities, and financial resources with limited access to timely digital information.

**AgriWise Ethiopia** aims to provide a simple digital platform where farmers can record their farming activities and receive useful, personalized information based on their own farm data.

Instead of building many disconnected systems, AgriWise brings the main information a farmer needs into one platform.

The system is designed around five main areas:

1. 🌱 Farm and Crop Management
2. 🩺 Crop Health and Risk Support
3. 🌦️ Weather and Smart Alerts
4. 💰 Farm Economics and Market Information
5. 🤖 Personalized AI Agricultural Assistant

The system also provides an **Administrator interface** for managing users, agricultural resources, market information, and system-level information.

---

# ❗ Problem Statement

Farmers may need to make decisions involving:

* Which crops they are currently growing
* What activities need to be performed
* How weather conditions may affect their farms
* Whether a crop is showing signs of a potential problem
* How much money has been spent on farming
* How much income has been generated
* What agricultural information is relevant to their situation

These types of information are often separated across different sources.

AgriWise Ethiopia addresses this problem by providing a centralized digital platform that connects:

```text
Farmer Data
     ↓
Farm & Crop Information
     ↓
Weather Information
     ↓
Crop Health Information
     ↓
Financial Information
     ↓
Personalized Recommendations
```

The goal is not to replace agricultural professionals. Instead, the platform provides **decision-support information** and can recommend that farmers seek assistance from nearby agricultural experts when physical professional support is appropriate.

---

# 🎯 Project Objectives

The main objectives of AgriWise Ethiopia are to:

* Provide farmers with a simple digital farm management system.
* Allow farmers to manage their farms, fields, crops, and farming activities.
* Provide weather information relevant to agricultural decision-making.
* Generate useful alerts and reminders.
* Help farmers record and understand crop health conditions.
* Provide preliminary AI-powered agricultural guidance.
* Track farming expenses and income.
* Provide market/reference price information.
* Provide personalized AI recommendations based on farmer and farm data.
* Provide administrators with tools to manage relevant system information.
* Demonstrate how modern web technologies and AI can support agricultural decision-making in Ethiopia.

---

# 👥 Target Users

AgriWise Ethiopia has **two main user roles**.

## 👨‍🌾 1. Farmer

The farmer is the primary user of the platform.

Farmers can:

* Create an account
* Manage their farms
* Manage fields and crops
* Record farming activities
* Record crop health information
* View weather information
* Receive alerts and reminders
* Track farming expenses
* Record farm income
* View financial summaries
* View market/reference prices
* Interact with the AI agricultural assistant
* Receive personalized recommendations

---

## 👨‍💼 2. Administrator

The administrator manages system-level information.

Administrators can:

* Manage registered users
* Manage agricultural resources
* Manage market/reference price information
* Monitor system activity
* Manage relevant alerts or information
* Maintain platform content

The system does **not** require agricultural experts to create accounts in the initial version.

When a farmer needs professional physical assistance, the system can recommend contacting a nearby agricultural expert.

---

# 🚀 Core Features

AgriWise Ethiopia focuses on **five core feature groups**.

---

## 1. 🌱 Farm & Crop Management

Farmers can digitally manage their agricultural activities.

### Main capabilities

* Create and manage farms
* Manage fields
* Record crop information
* Record planting dates
* Record farming activities
* Record inputs and activities
* Record harvest information
* Track crop progress

Example:

```text
Farm
 ├── Field 1
 │    └── Maize
 │
 ├── Field 2
 │    └── Wheat
 │
 └── Field 3
      └── Teff
```

This information becomes the foundation for other AgriWise features.

---

# 2. 🩺 Crop Health & Risk Support

Farmers can record potential crop health problems and receive preliminary digital guidance.

A farmer may provide:

* Crop
* Symptoms
* Observations
* Optional crop image
* Growth stage
* Additional notes

The system can then provide:

* Possible explanations
* General management suggestions
* Preventive recommendations
* Risk information
* Guidance on when professional assistance may be appropriate

The AI guidance is intended as **decision support**, not as a replacement for professional agricultural diagnosis.

If the situation requires physical assistance, the system can recommend contacting a nearby agricultural expert.

---

# 3. 🌦️ Weather & Smart Alerts

Weather information is important for agricultural planning.

AgriWise integrates weather information to help farmers understand current and upcoming conditions.

### Weather information may include:

* Current temperature
* Weather condition
* Humidity
* Rain information
* Wind information
* Forecast information

### Smart alerts may include:

* 🌧️ Rain-related alerts
* ☀️ Dry-condition alerts
* 🌡️ Temperature-related alerts
* 🌱 Crop-related reminders
* 🚜 Farming activity reminders
* ⚠️ Potential crop-risk notifications

The goal is to transform raw weather information into useful information for the farmer.

---

# 4. 💰 Farm Economics & Market Information

Farmers can record the financial side of their agricultural activities.

### Expense tracking

Examples:

* Seeds
* Fertilizer
* Pesticides
* Labor
* Transportation
* Irrigation
* Equipment
* Other farming costs

### Income tracking

Farmers can record:

* Harvest sales
* Product quantity
* Selling price
* Total income

The system can calculate:

```text
Total Income
     -
Total Expenses
     =
Estimated Profit
```

Farmers can view financial summaries and understand how their farming activities are performing economically.

### Market information

The administrator can manage reference market-price information that farmers can view through the platform.

---

# 5. 🤖 Personalized AI Agricultural Assistant

The AI assistant is one of the main intelligent features of AgriWise.

Instead of providing completely generic answers, the AI can use relevant information from the farmer's profile and farm records to provide more personalized guidance.

For example, the assistant may consider:

```text
Farmer
   +
Location
   +
Farm
   +
Crop
   +
Crop Growth Stage
   +
Weather
   +
Crop Health Records
   +
Financial Information
   ↓
Personalized Agricultural Guidance
```

### AI assistant capabilities

The AI assistant can support several tasks, including:

### 🌱 Agricultural Questions

Farmers can ask general agricultural questions.

Example:

> "What should I consider when growing maize?"

---

### 🩺 Crop Health Guidance

The farmer can describe symptoms and ask for preliminary guidance.

Example:

> "The leaves of my maize are turning yellow. What could be the possible causes?"

---

### 🌦️ Weather-Based Guidance

The AI can use available weather information to provide contextual suggestions.

Example:

> "It is expected to rain tomorrow. Which farming activities should I consider?"

---

### 📊 Farm Performance Analysis

The AI can summarize relevant farm information.

Example:

> "How is my farm performing this season?"

---

### 💰 Financial Analysis

The assistant can analyze recorded farm expenses and income.

Example:

> "What are my biggest farming expenses?"

---

### 📅 Personalized Recommendations

The AI can suggest useful activities based on available farm information.

Example:

> "What should I focus on this week?"

---

### Important AI Principle

The AI assistant is designed as a **decision-support tool**.

It should:

* Explain recommendations clearly.
* Avoid presenting uncertain information as fact.
* Encourage professional agricultural assistance when appropriate.
* Use available farmer data to improve relevance.
* Avoid replacing qualified agricultural professionals.

---

# 🔄 System Workflow

The overall system can be represented as:

```text
                    Farmer
                       │
                       ▼
                Create Account
                       │
                       ▼
                 Create Farm
                       │
                       ▼
                Add Field/Crop
                       │
                       ▼
             Record Farm Activities
                       │
            ┌──────────┼──────────┐
            ▼          ▼          ▼
        Weather     Crop Health  Economics
            │          │          │
            └──────────┼──────────┘
                       ▼
                AgriWise Data
                       │
                       ▼
             Personalized AI
                       │
                       ▼
          Recommendations & Alerts
```

---

# 🛠️ Technology Stack

## Frontend

| Technology   | Purpose                          |
| ------------ | -------------------------------- |
| React.js     | User interface                   |
| Vite         | Frontend development/build tool  |
| JavaScript   | Application logic                |
| React Router | Client-side routing              |
| Axios        | API communication                |
| CSS          | Styling and responsive interface |

---

## Backend

| Technology         | Purpose                    |
| ------------------ | -------------------------- |
| Node.js            | Runtime environment        |
| Express.js         | REST API framework         |
| Mongoose           | MongoDB object modeling    |
| JWT                | Authentication             |
| bcrypt             | Password hashing           |
| Helmet             | HTTP security              |
| CORS               | Cross-origin configuration |
| express-rate-limit | API rate limiting          |

---

## Database

**MongoDB**

MongoDB stores:

* Users
* Farms
* Fields
* Crops
* Crop activities
* Crop health records
* Expenses
* Income
* Market prices
* Notifications
* AI conversation/context data

---

## External Services

Depending on implementation and availability, the system may integrate with:

* 🌦️ Weather API
* 🤖 AI API
* 🗺️ Location/geographic services where necessary

External API keys are stored securely in environment variables.

---

# 🏗️ System Architecture

AgriWise follows a layered MERN architecture.

```text
┌──────────────────────────────────────────────┐
│                  FRONTEND                    │
│                                              │
│       React + Vite + React Router            │
│                                              │
└──────────────────────┬───────────────────────┘
                       │
                  REST API / JSON
                       │
┌──────────────────────▼───────────────────────┐
│                  BACKEND                     │
│                                              │
│              Node.js + Express               │
│                                              │
│  Routes → Controllers → Services → Models    │
│                                              │
└───────────────┬───────────────┬──────────────┘
                │               │
                ▼               ▼
        ┌──────────────┐   ┌──────────────┐
        │   MongoDB    │   │ External APIs│
        │              │   │              │
        │ Farm Data    │   │ Weather      │
        │ User Data    │   │ AI           │
        │ Finance      │   │ Other APIs   │
        └──────────────┘   └──────────────┘
```

---

# 📁 Project Structure

```text
AgriWise-Ethiopia/
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── controllers/
│   │   │
│   │   ├── middleware/
│   │   │
│   │   ├── models/
│   │   │
│   │   ├── routes/
│   │   │
│   │   ├── services/
│   │   │
│   │   ├── utils/
│   │   │
│   │   └── server.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   └── database.md
│
├── .gitignore
├── README.md
└── package.json
```

---

# 🗄️ Database Overview

The database will use MongoDB with Mongoose.

The initial data model is organized around the following entities:

```text
User
 │
 ├── Farm
 │     │
 │     ├── Field
 │     │     └── Crop
 │     │
 │     └── CropActivity
 │
 ├── CropHealthRecord
 │
 ├── Expense
 │
 ├── Income
 │
 └── AIConversation
```

System-level information includes:

```text
MarketPrice
Notification
AgriculturalResource
WeatherRecord
```

The exact schema will evolve during implementation as each feature is developed and tested.

---

# 🔐 Authentication and Security

AgriWise uses standard web security practices.

### Authentication

* User registration
* User login
* Password hashing
* JWT-based authentication
* Protected API routes
* Role-based authorization

### User roles

```text
FARMER
ADMIN
```

### Security measures

The backend will use:

* Helmet
* CORS configuration
* Rate limiting
* Environment variables
* Password hashing
* Input validation
* Authentication middleware
* Authorization middleware
* Centralized error handling

Sensitive information such as database credentials, JWT secrets, and API keys will never be committed to GitHub.

---

# 🔌 API Architecture

The backend follows a RESTful API architecture.

Example API structure:

```text
/api
│
├── /auth
│   ├── POST /register
│   ├── POST /login
│   └── GET  /me
│
├── /farms
├── /fields
├── /crops
├── /activities
├── /crop-health
├── /weather
├── /notifications
├── /expenses
├── /income
├── /market-prices
├── /ai
└── /admin
```

The API will be documented using Swagger/OpenAPI during backend development.

---

# 🎨 Frontend Structure

The frontend will provide separate experiences for farmers and administrators.

## Farmer Dashboard

The farmer dashboard will provide access to:

```text
Dashboard
│
├── My Farms
├── Crops
├── Activities
├── Crop Health
├── Weather
├── Notifications
├── Economics
├── Market Prices
└── AI Assistant
```

## Administrator Dashboard

```text
Admin Dashboard
│
├── Users
├── Market Prices
├── Agricultural Resources
├── Notifications
└── System Overview
```

The interface will be responsive and designed primarily with mobile usability in mind.

---

# 🌿 Design Principles

AgriWise follows several design principles.

### Simplicity

The system should remain easy to understand and use.

### Farmer-Centered Design

Features should focus on real agricultural tasks rather than unnecessary technical complexity.

### Personalization

Information should become more useful as the system learns about the farmer's farm data.

### Decision Support

The system provides information and recommendations rather than attempting to replace agricultural professionals.

### Modularity

Each major feature is developed as an independent module so that the system can be expanded later.

### Security

User information and application secrets must be protected throughout development and deployment.

---

# 🌍 Ethiopian Context

AgriWise is designed with the Ethiopian agricultural context in mind.

The platform can support agricultural information such as:

* Local farming practices
* Ethiopian crops
* Regional weather conditions
* Farm-level financial information
* Local market/reference prices
* Agricultural resources relevant to Ethiopian farmers

The system is designed so that additional Ethiopian regions, crops, languages, and agricultural information can be incorporated in future versions.

---

# 🔀 Git and Branching Strategy

The project follows a professional Git workflow.

## Main branches

```text
main
dev
```

### Feature branches

Feature development uses dedicated branches:

```text
feature/project-setup
feature/authentication
feature/farm-management
feature/crop-management
feature/weather
feature/alerts
feature/crop-health
feature/economics
feature/ai-assistant
feature/admin
```

### Development workflow

```text
Feature Branch
      │
      ▼
   Commit
      │
      ▼
    Push
      │
      ▼
 Pull Request
      │
      ▼
     dev
      │
      ▼
 Testing & Integration
      │
      ▼
    main
```

This approach keeps the main branch stable and provides a clear development history.

---

# ⚙️ Installation and Setup

## Prerequisites

Before running the project, install:

* Node.js
* npm
* Git
* MongoDB or MongoDB Atlas
* A modern web browser

Check Node.js and npm:

```bash
node --version
npm --version
```

Check Git:

```bash
git --version
```

---

# 📥 Clone the Repository

```bash
git clone https://github.com/dago-o/AgriWise-Ethiopia.git
```

Navigate into the project:

```bash
cd AgriWise-Ethiopia
```

---

# 🔧 Backend Setup

Navigate to the backend:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```text
.env
```

Copy the structure from:

```text
.env.example
```

Configure the required environment variables.

Start the backend development server:

```bash
npm run dev
```

The backend will run on the configured port, for example:

```text
http://localhost:5000
```

---

# 💻 Frontend Setup

Open another terminal and navigate to:

```bash
cd AgriWise-Ethiopia/Frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
.env
```

Configure the frontend environment variables.

Start the development server:

```bash
npm run dev
```

The Vite development server will normally be available at:

```text
http://localhost:5173
```

---

# 🔑 Environment Variables

## Backend

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

WEATHER_API_KEY=your_weather_api_key

AI_API_KEY=your_ai_api_key
```

## Frontend

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

> **Never commit `.env` files containing real secrets to GitHub.**

---

# 🧪 Testing

Testing will be introduced progressively during development.

The project will include testing for important areas such as:

* Authentication
* API endpoints
* Validation
* Database operations
* Authorization
* Core business logic
* Frontend functionality

Manual testing will also be performed across the main user workflows.

---

# 📚 API Documentation

The backend API will be documented using **Swagger/OpenAPI**.

During development, API documentation will provide information about:

* Endpoints
* HTTP methods
* Request parameters
* Request bodies
* Authentication requirements
* Response formats
* Error responses

Example:

```text
Authentication
     ↓
POST /api/auth/login
     ↓
JWT Token
     ↓
Protected API Requests
```

---

# 🚀 Development Roadmap

The project will be developed incrementally.

### Phase 1 — Foundation

* [x] Repository creation
* [ ] Backend initialization
* [ ] Frontend initialization
* [ ] Environment configuration
* [ ] MongoDB connection
* [ ] Express server
* [ ] Swagger setup

### Phase 2 — Authentication

* [ ] User registration
* [ ] User login
* [ ] JWT authentication
* [ ] Password hashing
* [ ] Role-based authorization
* [ ] Farmer/Admin roles

### Phase 3 — Farm Management

* [ ] Farm creation
* [ ] Field management
* [ ] Crop management
* [ ] Farming activities
* [ ] Harvest records

### Phase 4 — Weather & Alerts

* [ ] Weather API integration
* [ ] Forecast display
* [ ] Weather alerts
* [ ] Activity reminders
* [ ] Notification system

### Phase 5 — Crop Health

* [ ] Crop health records
* [ ] Symptom recording
* [ ] Image upload
* [ ] AI preliminary guidance
* [ ] Professional-assistance recommendation

### Phase 6 — Economics

* [ ] Expense management
* [ ] Income management
* [ ] Profit calculation
* [ ] Financial dashboard
* [ ] Market/reference prices

### Phase 7 — AI Assistant

* [ ] AI API integration
* [ ] Chat interface
* [ ] Farm context
* [ ] Crop context
* [ ] Weather context
* [ ] Financial context
* [ ] Personalized recommendations

### Phase 8 — Administration

* [ ] Admin dashboard
* [ ] User management
* [ ] Market-price management
* [ ] Agricultural resources
* [ ] System monitoring

### Phase 9 — Finalization

* [ ] Validation
* [ ] Security review
* [ ] Error handling
* [ ] Responsive design
* [ ] Testing
* [ ] Documentation
* [ ] Deployment

---

# 🔮 Future Improvements

The initial version intentionally keeps the system manageable.

Possible future versions could introduce:

* 🌐 Multilingual support, including Afaan Oromo and Amharic
* 📱 Progressive Web App/mobile application
* 🗺️ Advanced geographic and farm mapping
* 📡 IoT-based agricultural sensors
* 🌱 Soil monitoring
* 🛰️ Satellite-based crop monitoring
* 📷 More advanced crop disease image analysis
* 📈 Advanced agricultural analytics
* 🛒 Agricultural marketplace
* 🚜 Agricultural equipment management
* 👨‍🌾 Agricultural expert network
* 🔔 More advanced predictive alerts
* 🧠 More sophisticated agricultural AI models

These features are outside the initial MVP scope and can be considered after the core platform is completed.

---

# 🎓 Academic and Practical Purpose

AgriWise Ethiopia is designed as a practical software engineering project that demonstrates the application of modern technologies to an agricultural problem.

The project demonstrates skills in:

* Full-stack web development
* REST API development
* Database design
* Authentication and authorization
* React application development
* Backend architecture
* API integration
* AI integration
* Data management
* Software security
* Git/GitHub workflow
* System documentation
* Responsive web design

---

# 📈 Project Goals

The primary goal of AgriWise Ethiopia is to demonstrate how a modern web application can bring together:

```text
                 AGRICULTURAL DATA
                        │
          ┌─────────────┼─────────────┐
          │             │             │
        FARM          WEATHER       HEALTH
        DATA           DATA          DATA
          │             │             │
          └─────────────┼─────────────┘
                        │
                     AI ENGINE
                        │
          ┌─────────────┼─────────────┐
          │             │             │
      GUIDANCE       ALERTS       ANALYTICS
          │             │             │
          └─────────────┼─────────────┘
                        │
                   FARMER DECISIONS
```

The project focuses on creating a **simple, practical, extensible, and professionally engineered agricultural platform** rather than attempting to solve every agricultural problem in a single application.

---

# 👨‍💻 Developer

**Degefa Lemma**

BSc in Information Systems
Addis Ababa University

### Areas of Interest

* MERN Stack Development
* Full-Stack Web Development
* Software Engineering
* Artificial Intelligence Integration
* Information Systems
* Cybersecurity

---

# 📄 License

This project is currently developed as an academic and portfolio project.

A formal open-source license may be added in a future release.

---

## 🌱 AgriWise Ethiopia

> **Smarter farming decisions through connected data, useful insights, and personalized digital assistance.**

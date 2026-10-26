# GameVault - Distributed Database Management System
> **STADVDB MCO2 (Advanced Database Systems)**  
> Distributed Database Web Application featuring Horizontal Partitioning, Concurrency Control, and Fault Tolerance.

---

## 📖 Project Overview

**GameVault** is a full-stack distributed database application built for managing and querying a large-scale video game catalog. Designed and implemented for **STADVDB (Advanced Database Systems) Major Course Output 2 (MCO2)**, the project demonstrates key principles in distributed relational database systems:

- **Horizontal Data Fragmentation**: Partitioning datasets across multiple database instances based on chronological release criteria.
- **High Availability & Concurrency Control**: Maintaining ACID guarantees using `REPEATABLE READ` transaction isolation and centralized master write management.
- **Fault Tolerance & Resilience**: Automatic detection of node outages, write-prohibition on master failure (read-only fallback), transaction queuing, and automated background retry/replication upon node recovery.
- **Interactive Web Interface**: A React-powered dashboard enabling record management (CRUD), node switching, fault simulation, and multi-dimensional analytical reporting.

---

## 🏗️ System Architecture & Node Topology

The system distributes the video game dataset across three MySQL database nodes hosted on DLSU CCS Cloud:

```
                          ┌──────────────────────────┐
                          │     React Web App UI     │
                          │   (Port 3000 / Netlify)  │
                          └─────────────┬────────────┘
                                        │ HTTP / REST
                                        ▼
                          ┌──────────────────────────┐
                          │    Express API Server    │
                          │   (Port 5000 / Render)   │
                          └──────┬────────────┬──────┘
                                 │            │
            ┌────────────────────┼────────────┴───────────────────┐
            │ Write / Read       │ Replicate / Read               │ Replicate / Read
            ▼                    ▼                                ▼
┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
│        Node 1         │ │        Node 2         │ │        Node 3         │
│     Central Master    │ │ Horizontal Fragment 1 │ │ Horizontal Fragment 2 │
│      (Port 20302)     │ │      (Port 20312)     │ │      (Port 20322)     │
│   Full `games` Table  │ │ `games_before_2010`   │ │`games_2010_and_after` │
└───────────────────────┘ └───────────────────────┘ └───────────────────────┘
```

### 1. Data Fragmentation Strategy
- **Node 1 (Central / Master)**: Holds the complete dataset in table `games`. It serves as the primary coordinator for write transactions (INSERT, UPDATE, DELETE).
- **Node 2 (Fragment 1)**: Horizontally partitioned range containing games released before 2010 (`release_year < 2010`) in table `games_before_2010`.
- **Node 3 (Fragment 2)**: Horizontally partitioned range containing games released in or after 2010 (`release_year >= 2010`) in table `games_2010_and_after`.

### 2. Concurrency & Replication Mechanics
- **Transaction Isolation Level**: `REPEATABLE READ` enforced on all active database sessions to prevent dirty and non-repeatable reads.
- **Write-Locking Protection**: When the Central Node (`node1`) is down or unreachable, the system automatically transitions into a **read-only state** (`HTTP 503`), preventing data divergence.
- **Transaction Queue & Replication Retry**: Failed replication updates to slave fragments are recorded in an in-memory transaction queue. Periodic background cron jobs and recovery hooks retry replication as soon as connectivity is restored.

---

## ✨ Features

- **Distributed Querying**: Dynamic table interpolation `{TABLE}` that directs queries to the appropriate fragment or master node.
- **Node Switching**: Manual node selection via UI to inspect data fragments and observe horizontal partitioning in real time.
- **Failure & Recovery Simulation**: Ability to simulate node failure and recovery directly via API/UI to test system resilience.
- **Comprehensive CRUD Operations**:
  - **Create**: Add new game records with automated ID sequencing.
  - **Read**: Search and filter by game title, release year, price, and metrics.
  - **Update**: Edit game details with synchronized partition updates.
  - **Delete**: Remove records with affected-row validation and cascade checks.
- **Analytical Reports**:
  - **Report 1 (Playtime & Engagement)**: Analyze forever playtime, recent 2-week engagement, and median player statistics.
  - **Report 2 (User & Critic Sentiment)**: Compare positive vs. negative reviews, user scores, and Metacritic ratings.
  - **Report 3 (Pricing & Release Trends)**: Price distribution and chronological release overview.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, React Router v7, Bootstrap 5, Axios |
| **Backend** | Node.js, Express.js, `mysql2`, `node-cron`, `shelljs`, Python / Flask (prototype) |
| **Database** | MySQL 8.0 (Distributed across 3 cluster nodes) |
| **Testing** | Jest, Supertest, Babel |
| **Deployment** | Netlify (Frontend), Render (Backend), DLSU CCS Cloud (Databases) |

---

## 📁 Repository Structure

```
STADVDB-MCO2-WebApp/
├── __tests__/                  # Integration and concurrency test suite
│   └── mco.test.js             # Automated Jest tests for transactions and replication
├── backend/                    # Express.js REST API & replication services
│   ├── app.py                  # Python / Flask prototype query router
│   ├── requirements.txt        # Python dependencies
│   ├── server.js               # Basic single-connection API server
│   ├── server2.js              # Full distributed coordinator (health checks, cron, queue)
│   └── testApp.js              # Dedicated test backend instance for Jest
├── frontend/                   # React Single-Page Application
│   ├── public/                 # Static assets and HTML template
│   ├── src/
│   │   ├── assets/             # Images and report icons
│   │   ├── components/         # Reusable React UI components (Table, SearchInputs, Dropdown, etc.)
│   │   ├── pages/              # Views (HomePage, AddPage, UpdatePage, DeletePage, Reports 1-3)
│   │   ├── services/           # Axios HTTP client and API integration (`api.js`)
│   │   ├── styles/             # CSS styling stylesheets
│   │   ├── App.js              # Application routing definition
│   │   └── index.js            # React root renderer
│   ├── package.json            # Frontend npm dependencies
│   └── netlify.toml            # Netlify deployment configuration
├── .gitignore                  # Git ignore rules for node_modules, builds, and logs
├── package.json                # Root package configuration (scripts and testing)
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (v8 or higher)
- Access to the MySQL database instances (or local MySQL setup)

### 1. Backend Installation & Startup
```bash
# From the project root
npm install

# Start the distributed backend server
node backend/server2.js
```
The server will start on `http://localhost:5000`.

### 2. Frontend Installation & Startup
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```
The client app will open automatically at `http://localhost:3000`.

### 3. Running Automated Tests
```bash
# From the project root
npm test
```

---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/query` | Execute raw dynamic query with `{TABLE}` placeholder mapping |
| `POST` | `/add-record` | Insert a new game record (requires Node 1 active) |
| `PUT` | `/update-record` | Update an existing game record by ID |
| `DELETE` | `/delete-record` | Delete a game record by ID (body or param) |
| `POST` | `/switch-node` | Switch the active querying node (`node1`, `node2`, `node3`) |
| `POST` | `/simulate-failure` | Mark a specified node as failed |
| `POST` | `/simulate-recovery` | Test connectivity, recover node, and process pending queues |
| `GET` | `/active-node` | Retrieve current active node configuration |
| `GET` | `/check-node1` | Verify whether the Central Node is up and writable |
| `GET` | `/redirect-node` | Report any currently failing or degraded nodes |

---

## 👥 Course & Team Information

- **Course**: STADVDB - Advanced Database Systems
- **Term**: Term 1, Academic Year 2024–2025
- **Institution**: De La Salle University (DLSU) - College of Computer Studies

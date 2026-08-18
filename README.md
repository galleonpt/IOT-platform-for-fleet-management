# Atlantic Ventures - IoT Fleet Management Platform

A full-stack IoT platform for fleet management and asset tracking, implementing real-time sensor data ingestion, validation, and persistence with time-series analytics.

## Overview

This project implements an IoT platform designed to handle:

- Real-time vehicle and asset tracking
- Multi-sensor data collection (GPS, telemetry, environmental)
- Geofencing capabilities for fleet management
- Time-series data persistence and analytics
- RESTful APIs for fleet operations

The implemented solution follows the logic of each vehicle having a single IOT device that collects data from multiple sensors and sends it all together.

**To use this project with it's full potential you should follow the steps bellow:**

1. Create an area
2. Create a vehicle
3. Add telemetry data for the created vehicle
4. Check if the vehicle is inside the area that you have created(Functionality with the Haversine algorithm)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL and TimescaleDB (PostgreSQL extension for time-series data)
- **Language**: TypeScript
- **Containerization**: Docker

## Project Structure

```
src/
├── clients/                   # Clients
│   ├── postgres.client.ts     # Postgres client
│   ├── timescale.client.ts    # TimescaleDB client
│   └── mqtt.client.ts         # MQTT broker client
├── entities/                  # Data models
│   ├── area.model.ts          # Area schema
│   ├── vehicle.model.ts       # Vehicle schema
│   └── telemetry.model.ts     # Sensor telemetry schema
├── modules/
│   ├── areas/                 # Area/geofence management
│   ├── vehicles/              # Vehicle fleet management
│   └── ingestion/             # Data ingestion pipeline
├── migrations/                # Database migrations
│   ├── postgres/
│   └── timescale/
├── utils/                     # Helper functions
└── router.ts                  # API routes
```

## Key Features

### Part B: Geofencing and Data Ingestion Implementation

- **Data Validation**: Validates incoming telemetry data against schema
- **Data Normalization**: Standardizes data formats and units
- **Time-Series Storage**: Persists data in TimescaleDB for efficient querying

## Setup & Installation

### Prerequisites

- Node.js >= 22
- Docker & Docker Compose

### Local Development

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start the app inside docker containers
docker compose down && docker compose up --build
```

## API Documentation

All endpoints follow RESTful conventions and are prefixed with `/v1`.

### Areas Management

#### List all areas

**GET** `/v1/areas`

Response: `200 OK`

```json
[
  {
    "id": 1,
    "name": "Braga Center",
    "latitude": 41.5538,
    "longitude": -8.4269,
    "radius": 1000
  }
]
```

#### Create a new area

**POST** `/v1/areas`

Request body:

```json
{
  "name": "Braga",
  "latitude": 41.5538,
  "longitude": -8.4269,
  "radius": 1000
}
```

Response: `201 Created`

```json
{
  "id": 1,
  "name": "Braga",
  "latitude": 41.5538,
  "longitude": -8.4269,
  "radius": 1000
}
```

### Vehicles Management

#### List all vehicles

**GET** `/v1/vehicles`

Response: `200 OK`

```json
[
  {
    "id": 1,
    "name": "Vehicle-001"
  }
]
```

#### Create a new vehicle

**POST** `/v1/vehicles`

Request body:

```json
{
  "name": "Vehicle-001"
}
```

Response: `201 Created`

```json
{
  "id": 1,
  "name": "Vehicle-001"
}
```

#### Check if vehicle is inside a geofence area

**GET** `/v1/vehicles/:vehicleId/areas/:areaId`

Response: `200 OK` - Vehicle is inside area

```json
{
  "isInsideArea": true,
  "vehicle": {
    "id": 1,
    "name": "Vehicle-001"
  },
  "area": {
    "id": 1,
    "name": "Braga",
    "latitude": 41.5538,
    "longitude": -8.4269,
    "radius": 1000
  }
}
```

Error responses:

- `404 Not Found` - Vehicle or Area not found
- `404 Not Found` - No telemetry data found for the vehicle

### Telemetry Ingestion

#### Add telemetry data

**POST** `/v1/ingestion`

The endpoint accepts multiple telemetry records in a single request. Data is automatically normalized:

- Speed: Miles → km/h
- Fuel: Gallons → Liters
- Engine Temperature: Fahrenheit → Celsius

Request body:

```json
{
  "vehicle_id": 1,
  "data": [
    {
      "recorded_at": "2026-08-16T10:30:00Z",
      "location": {
        "latitude": 41.5538,
        "longitude": -8.4269
      },
      "fuel": {
        "value": 85,
        "unit": "liters"
      },
      "speed": {
        "value": 65,
        "unit": "km/h"
      },
      "engine_temperature": {
        "value": 95,
        "unit": "celsius"
      }
    }
  ]
}
```

Response: `201 Created` (empty body)

### MQTT Ingestion

**Topic**: `vehicles/{vehicleId}/telemetry`

A app subscreve o tópico com o wildcard `vehicles/+/telemetry`, aceitando uma **única leitura de telemetria por mensagem** (não um batch como no REST). O payload JSON tem a mesma forma de um elemento do array `data` do endpoint REST, sem wrapper.

**Publish (via Postman MQTT client ou similar)**:

```json
{
  "recorded_at": "2026-08-17T10:30:00Z",
  "location": {
    "latitude": 41.5538,
    "longitude": -8.4269
  },
  "fuel": {
    "value": 85,
    "unit": "liters"
  },
  "speed": {
    "value": 65,
    "unit": "kilometers"
  },
  "engine_temperature": {
    "value": 95,
    "unit": "C"
  }
}
```

Mensagens inválidas (JSON malformado, campos em falta, unidades desconhecidas, etc.) são registadas e descartadas — nunca causam erro na aplicação.

Para testar localmente: broker está em `localhost:1883` (sem autenticação/TLS). Ver `DOCKER_SETUP.md` para um guia passo-a-passo com o Postman.

**Supported Units:**

- **Fuel**: `liters`, `gallons`
- **Speed**: `km/h`, `miles`
- **Engine Temperature**: `celsius`, `fahrenheit`

**Validation:**

- `vehicle_id` must be a positive number
- `data` must be a non-empty array
- All location fields must be valid coordinates
- `recorded_at` must be a valid ISO 8601 timestamp
- All sensor values must be numbers

## Database Schema

### Telemetry (Hypertable)

Time-series data for vehicle sensor readings, automatically partitioned by `recorded_at`:

| Column | Type | Description |
| --- | --- | --- |
| `id` | int (unsigned) | Primary key |
| `recorded_at` | timestamp | Time partition key for time-series queries |
| `vehicle_id` | int (unsigned) | Reference to an entity in vehicles table |
| `fuel` | double precision | Fuel level (percentage 0-100) |
| `speed` | double precision | Current speed in km/h |
| `engine_temperature` | double precision | Engine temperature in °C |
| `latitude` | decimal(10,8) | GPS latitude coordinate |
| `longitude` | decimal(11,8) | GPS longitude coordinate |

### Areas

Geofence definitions for fleet management:

| Column | Type | Description |
| --- | --- | --- |
| `id` | int (unsigned) | Primary key |
| `name` | varchar | Area/zone identifier |
| `latitude` | decimal(10,8) | Center point latitude |
| `longitude` | decimal(11,8) | Center point longitude |
| `radius` | integer | Geofence radius in meters |

### Vehicles

Fleet vehicle registry:

| Column | Type | Description |
| --- | --- | --- |
| `id` | int (unsigned) | Primary key |
| `name` | varchar | Vehicle identifier/name |

**Geofencing Algorithm**: Uses Haversine distance formula to check if vehicle coordinates fall within area radius

## Next Steps

1. Add a service layer to manage the business logic
2. Add authentication using MTLS protocol
3. Add error handling
4. Improve observability with tools like sentry datadog, grafana, etc
5. Add openApi docs
6. Add tests
7. ~~Implement MQTT protocol~~ ✓ Complete
8. Deploy to Kubernetes (optional feature)
9. CI/CD

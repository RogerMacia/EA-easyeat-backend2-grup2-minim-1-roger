# Express API — Mongoose + TypeScript In Depth

REST API built with **Node.js**, **Express**, **TypeScript**, and **Mongoose** that manages two main entities: `Organization` and `User`.

---
## AI

  ChatGPT: users: Types.ObjectId[];
           users: [{ type: Schema.Types.ObjectId, ref: 'User' }]

  Gemini:
  const getOrganizationWithUsers = async (organizationId: string): Promise<IOrganizationModel | null> => {
  return await Organization.findById(organizationId).populate('users', '-organization -password');
  };

  const getOrganizationWithUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
  const organization = await OrganizationService.getOrganizationWithUsers(req.params.id);
  if (!organization) {
  return res.status(404).json({ message: 'Organization not found' });
  }
  return res.status(200).json(organization);
  }
  catch (error) {
  return res.status(500).json({ error });
  }
  };

[//]: # ()
[//]: # (  /**)

[//]: # (  * @openapi)

[//]: # (    * /organizations/{id}/users:)

[//]: # (    *   get:)

[//]: # (    *     summary: Gets a single organization with populated users)

[//]: # (    *     tags: [Organizations])

[//]: # (    *     parameters:)

[//]: # (    *       - in: path)

[//]: # (    *         name: id)

[//]: # (    *         required: true)

[//]: # (    *         schema:)

[//]: # (    *           type: string)

[//]: # (    *         description: The organization's ObjectId)

[//]: # (    *     responses:)

[//]: # (    *       200:)

[//]: # (    *         description: Returns the organization with populated users)

[//]: # (    *         content:)

[//]: # (    *           application/json:)

[//]: # (    *             schema:)

[//]: # (    *               $ref: '#/components/schemas/Organization')

[//]: # (    *       404:)

[//]: # (    *         description: Organization not found)

[//]: # (  */)

[//]: # (  router.get&#40;'/:id/users', controller.getOrganizationWithUsers&#41;;)

---

## Technologies

| Package | Version | Usage |
|---|---|---|
| express | ^4.17.3 | HTTP Framework |
| mongoose | ^6.13.9 | ODM for MongoDB |
| joi | ^17.6.0 | Schema validation in requests |
| dotenv | ^16.0.0 | Environment variables |
| cors | ^2.8.6 | Cross-origin access policy |
| chalk | ^4.1.2 | Color logging in console |
| typescript | ^4.5.5 | Static typing (devDependency) |

---

## Project Structure

```
src/
├── config/
│   └── config.ts           # Environment variable configuration (Mongo + port)
├── controllers/
│   └── restaurant.ts
│   └── customer.ts
│   └── review.ts
│   └── reward.ts
│   └── visit.ts
├── data/
│   └── badges.json
│   └── customers.json
│   └── dishes.json
│   └── employees.json
│   └── pointsWallets.json
│   └── restaurants.json
│   └── reviews.json
│   └── rewardRedemptions.json
│   └── rewards.json
│   └── statistics.json
│   └── visits.json
├── middleware/
│   └── joi.ts                  # Payload validation with Joi + schemas for each entity
├── models/
│   └── badges.ts               # Mongoose Schema/Model for Badge
│   └── customers.ts            # Mongoose Schema/Model for Customer
│   └── dishes.ts               # Mongoose Schema/Model for Dish
│   └── employees.ts            # Mongoose Schema/Model for Employee
│   └── pointsWallets.ts        # Mongoose Schema/Model for PointsWallet
│   └── restaurants.ts          # Mongoose Schema/Model for Restaurant
│   └── reviews.ts              # Mongoose Schema/Model for Review
│   └── rewardRedemptions.ts    # Mongoose Schema/Model for RewardRedemption
│   └── rewards.ts              # Mongoose Schema/Model for Reward
│   └── statistics.ts           # Mongoose Schema/Model for Statistic
│   └── visits.ts               # Mongoose Schema/Model for Visit
├── server.ts                   # Entry point: Mongo connection and server start
├── swagger.ts                  # Swagger configuration
├── library/
│   └── logging.ts              # Logging utility with colors (INFO / WARN / ERROR)
├── routes/
│   └── restaurant.ts            # Express routes for Restaurant
│   └── customer.ts              # Express routes for Customer
│   └── review.ts                # Express routes for Review
│   └── reward.ts                # Express routes for Reward
│   └── visit.ts                 # Express routes for Visit
├── services/
│   └── restaurant.ts            # Business logic for Restaurant (DB calls)
│   └── customer.ts              # Business logic for Customer (DB calls)
│   └── review.ts                # Business logic for Review (DB calls)
│   └── reward.ts                # Business logic for Reward (DB calls)
│   └── visit.ts                 # Business logic for Visit (DB calls)
├── utils/
│   └── dataSeeder.ts            # Utility to load JSON data into MongoDB
│   └── recomendation.ts         # Utility to generate restaurant recommendations based on user visits and reviews
│   └── servicePeriod.ts         #             

```

---

## File Descriptions

### `src/server.ts`
Application entry point. It is responsible for:
1. Connecting to MongoDB using Mongoose.
2. If the connection is successful, it starts the HTTP server.
3. Registers global middlewares: request/response logging, CORS, body parsers.
4. Mounts routes under the prefixes `/organizations` and `/users`.
5. Exposes a healthcheck at `GET /ping`.
6. Manages 404 responses for non-existent routes.

---

### `src/config/config.ts`
Reads environment variables using `dotenv` and exports the `config` object with two sections:
- `mongo.url` — MongoDB connection URI.
- `server.port` — HTTP server port (default `1337`).

---

### `src/library/logging.ts`
Static class `Logging` with three console output methods, each with a different color thanks to `chalk`:
| Method | Color | Usage |
|---|---|---|
| `Logging.info()` | Blue | General information |
| `Logging.warning()` | Yellow | Warnings |
| `Logging.error()` | Red | Errors |

---

### `src/middleware/joi.ts`
Contains two exports:

- **`ValidateJoi(schema)`** — Higher-order middleware that receives a Joi schema, validates `req.body`, and, if it fails, returns `422 Unprocessable Entity`.
- **`Schemas`** — Object with validation schemas for each entity:
  - `Schemas.organization.create` / `.update` → validates `{ name: string }`.
  - `Schemas.user.create` / `.update` → validates `{ name: string, email: string, password: string (min 6), organization: ObjectId (24 hex) }`.

---

### `src/models/restaurant.ts`
Defines the Mongoose model `Organization` with the following structure:

| Field | Type | Required |
|---|---|---|
| `_id` | ObjectId | Yes (auto) |
| `name` | String | Yes |

Exported TypeScript interfaces: `IOrganization`, `IOrganizationModel`.

---

### `src/models/user.ts`
Defines the Mongoose model `User` with the following structure:

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | Yes (auto) | |
| `name` | String | Yes | |
| `email` | String | Yes | Unique |
| `password` | String | Yes | |
| `organization` | ObjectId | Yes | Reference to `Organization` |
| `createdAt` | Date | Auto | Generated by `timestamps: true` |
| `updatedAt` | Date | Auto | Generated by `timestamps: true` |

Exported TypeScript interfaces: `IUser`, `IUserModel`.

---

### `src/services/restaurant.ts` and `src/services/user.ts`
Contain the **business logic** and direct calls to Mongoose. This is the layer responsible for interacting with data persistence.

---

### `src/controllers/restaurant.ts` and `src/controllers/user.ts`
Manage the HTTP protocol. They receive data from the `Request`, call the corresponding **Service** layer, and return the response in the `Response` with the appropriate status code. They do not know the implementation details of the database.

---

### `src/routes/restaurant.ts` and `src/routes/user.ts`
Register the endpoints for each resource with their corresponding Joi validation middlewares and delegate the logic to the controller.

---

## MongoDB Configuration

Create a `.env` file in the project root with the following content:

```env
MONGO_URI="mongodb://localhost:27017/sem1"
SERVER_PORT="1337"
```

The critical variable is `MONGO_URI`. The database used by default is **`sem1`**.

---

## API Endpoints

The server runs at `http://localhost:1337` by default. Interactive documentation is available at `/api`.

### General

| Method | URL | Description |
|---|---|---|
| `GET` | `/ping` | Healthcheck — returns `{ "hello": "world" }` |

---

### Organizations — `/organizations`

| Method | URL | Body (JSON) | Validation | Description | Success Response |
|---|---|---|---|---|---|
| `POST` | `/` | `{ "name": "string" }` | Joi required | Creates a new organization | `201` |
| `GET` | `/` | — | — | Lists all organizations | `200` |
| `GET` | `/:organizationId` | — | — | Gets an organization by ID | `200` |
| `PUT` | `/:organizationId` | `{ "name": "string" }` | Joi required | Updates an organization's name | `201` |
| `DELETE` | `/:organizationId` | — | — | Deletes an organization by ID | `201` |

---

### Users — `/users`

| Method | URL | Body (JSON) | Validation | Description | Success Response |
|---|---|---|---|---|---|
| `POST` | `/` | `{ "name": string, "email": string, "password": password, "organization": "ObjectId" }` | Joi required | Creates a new user | `201` |
| `GET` | `/` | — | — | Lists all users | `200` |
| `GET` | `/:userId` | — | — | Gets a user by ID (with organization populate) | `200` |
| `PUT` | `/:userId` | `{ "name": string, ... }` | Joi required | Updates a user's data | `201` |
| `DELETE` | `/:userId` | — | — | Deletes a user by ID | `201` |

---

## 🎓 Seminar Exercise

In the `seminar-exercise/` folder, you will find educational material on how to implement relationships between models in Mongoose (Manual vs Virtuals).

---

## Installation and Execution

```bash
# Install dependencies
npm install

# Start the server
npm start
```

To compile manually:
```bash
npx tsc
```

const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "vagabond pulse API",
    version: "1.0.0",
    description: "complete API documented with swagger",
  },
  servers: [{ url: "http://localhost:3001", description: "local server" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Memory: {
        type: "object",
        properties: {
          id: { type: "integer", example: 123 },
          description: { type: "string", example: "Summer vacation 2024" },
          fileUrl: { type: "string", example: "https://…/abc.jpg" },
          userId: { type: "integer", example: 42 },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Event: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1,
          },
          title: {
            type: "string",
            example: "Quarterly Planning Meeting",
          },
          description: {
            type: "string",
            example: "Discuss goals and roadmap for Q3",
          },
          startDate: {
            type: "string",
            format: "date-time",
            example: "2025-07-01T10:00:00Z",
          },
          endDate: {
            type: "string",
            format: "date-time",
            example: "2025-07-01T12:00:00Z",
          },
          location: {
            type: "string",
            example: "Conference Room A",
          },
          createdBy: {
            type: "integer",
            example: 42,
            description: "User ID of the event creator",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2025-06-25T09:30:00Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2025-06-26T14:15:00Z",
          },
        },
        required: ["id", "title", "startDate", "endDate"],
      },

      EventCreate: {
        type: "object",
        properties: {
          title: {
            type: "string",
            example: "Quarterly Planning Meeting",
          },
          description: {
            type: "string",
            example: "Discuss goals and roadmap for Q3",
          },
          startDate: {
            type: "string",
            format: "date-time",
            example: "2025-07-01T10:00:00Z",
          },
          endDate: {
            type: "string",
            format: "date-time",
            example: "2025-07-01T12:00:00Z",
          },
          location: {
            type: "string",
            example: "Conference Room A",
          },
        },
        required: ["title", "startDate", "endDate"],
      },

      EventUpdate: {
        type: "object",
        properties: {
          title: {
            type: "string",
            example: "Updated Meeting Title",
          },
          description: {
            type: "string",
            example: "Updated description text",
          },
          startDate: {
            type: "string",
            format: "date-time",
            example: "2025-07-01T11:00:00Z",
          },
          endDate: {
            type: "string",
            format: "date-time",
            example: "2025-07-01T13:00:00Z",
          },
          location: {
            type: "string",
            example: "Main Hall",
          },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…",
          },
          user: {
            $ref: "#/components/schemas/User",
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Alice" },
          email: { type: "string", example: "alice@example.com" },
          // …etc
        },
      },
      UserUpdate: {
        type: "object",
        properties: {
          name: { type: "string", example: "Alice Smith" },
          email: { type: "string", example: "alice.smith@example.com" },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: "Authentication token is missing or invalid",
      },
      Forbidden: {
        description: "Not enough permissions to perform this action",
      },
      NotFound: {
        description: "Resource not found",
      },
      BadRequest: {
        description: "Invalid request parameters",
      },
    },
  },
};
const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, "routes", "*.js")],
};
const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;

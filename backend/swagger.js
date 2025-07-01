const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Vagabond Pulse",
    version: "1.0.0",
    description:
      "API complète pour l'application Vagabond Pulse - Gestion d'événements et de souvenirs",
  },
  servers: [
    {
      url: "http://localhost:3001/api",
      description: "Serveur local de développement",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      AuthResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "connexion réussie",
          },
          token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…",
          },
          user: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              pseudo: { type: "string", example: "Alice" },
              role: { type: "string", example: "user" },
            },
          },
        },
      },

      Memory: {
        type: "object",
        properties: {
          id: { type: "integer", example: 123 },
          description: { type: "string", example: "Vacances d'été 2024" },
          photoUrl: {
            type: "string",
            example: "/uploads/memories/mem_1234567890.jpg",
          },
          userId: { type: "integer", example: 42 },
          createdAt: { type: "string", format: "date-time" },
          owner: { type: "string", example: "Alice" },
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
            example: "Réunion de planification trimestrielle",
          },
          description: {
            type: "string",
            example:
              "Discuter des objectifs et de la feuille de route pour le Q3",
          },
          date: {
            type: "string",
            format: "date-time",
            example: "2025-07-01T10:00:00Z",
          },
          location: {
            type: "string",
            example: "Salle de conférence A",
          },
          userId: {
            type: "integer",
            example: 42,
            description: "ID de l'utilisateur créateur de l'événement",
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
          owner: {
            type: "object",
            properties: {
              pseudo: { type: "string", example: "Alice" },
            },
          },
        },
        required: ["id", "title", "date"],
      },

      NewEvent: {
        type: "object",
        properties: {
          title: {
            type: "string",
            example: "Réunion de planification trimestrielle",
          },
          description: {
            type: "string",
            example:
              "Discuter des objectifs et de la feuille de route pour le Q3",
          },
          date: {
            type: "string",
            format: "date-time",
            example: "2025-07-01T10:00:00Z",
          },
          location: {
            type: "string",
            example: "Salle de conférence A",
          },
        },
        required: ["title", "date"],
      },

      UpdateEvent: {
        type: "object",
        properties: {
          title: {
            type: "string",
            example: "Titre de réunion mis à jour",
          },
          description: {
            type: "string",
            example: "Description mise à jour",
          },
          date: {
            type: "string",
            format: "date-time",
            example: "2025-07-01T11:00:00Z",
          },
          location: {
            type: "string",
            example: "Grand Hall",
          },
        },
      },

      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          email: { type: "string", example: "alice@example.com" },
          pseudo: { type: "string", example: "Alice" },
          role: { type: "string", example: "user" },
        },
      },

      UserUpdate: {
        type: "object",
        properties: {
          email: { type: "string", example: "alice.smith@example.com" },
          pseudo: { type: "string", example: "AliceSmith" },
          role: { type: "string", example: "user" },
          password: { type: "string", example: "nouveaumotdepasse123" },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: "Le token d'authentification est manquant ou invalide",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "string",
                  example: "Token manquant.",
                },
              },
            },
          },
        },
      },
      Forbidden: {
        description: "Permissions insuffisantes pour effectuer cette action",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "string",
                  example: "Accès refusé: admin only",
                },
              },
            },
          },
        },
      },
      NotFound: {
        description: "Ressource introuvable",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "string",
                  example: "Introuvable",
                },
              },
            },
          },
        },
      },
      BadRequest: {
        description: "Paramètres de requête invalides",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "string",
                  example: "Données invalides",
                },
              },
            },
          },
        },
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

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AstroReha API',
      version: '1.1.5',
      description: 'REST API for Astrology Calculations (Birth Chart, Navamsa, Compatibility)',
      contact: {
        name: 'Developer',
      },
    },
    servers: [
      {
        url: 'http://localhost:1300',
        description: 'Local development server',
      },
    ],
    paths: {
      '/api/birth-chart': {
        post: {
          summary: 'Get Birth Chart',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    dateString: { type: 'string', example: '1989-06-10' },
                    timeString: { type: 'string', example: '03:03:00' },
                    lat: { type: 'number', example: 11.664325 },
                    lng: { type: 'number', example: 78.146011 },
                    timezone: { type: 'number', example: 5.5 }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'OK' }
          }
        }
      },
      '/api/getBirthNavamsaChart': {
        post: {
          summary: 'Get Birth and Navamsa Chart',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    dateString: { type: 'string', example: '1989-06-10' },
                    timeString: { type: 'string', example: '03:03:00' },
                    lat: { type: 'number', example: 11.664325 },
                    lng: { type: 'number', example: 78.146011 },
                    timezone: { type: 'number', example: 5.5 }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'OK' }
          }
        }
      },
      '/api/navamsa-chart': {
        post: {
          summary: 'Get Navamsa Chart from Birth Chart',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { type: 'object' }
              }
            }
          },
          responses: {
            200: { description: 'OK' }
          }
        }
      },
      '/api/compatibility': {
        post: {
          summary: 'Check Compatibility',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    person1: { type: 'object' },
                    person2: { type: 'object' },
                    threshold: { type: 'number', example: 0.4 }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'OK' }
          }
        }
      },
      '/api/planets': {
        get: {
          summary: 'Get Planetary Positions',
          parameters: [
            { name: 'dateString', in: 'query', required: true, schema: { type: 'string' }, example: '1989-06-10' },
            { name: 'lat', in: 'query', required: true, schema: { type: 'number' }, example: 11.664325 },
            { name: 'lng', in: 'query', required: true, schema: { type: 'number' }, example: 78.146011 }
          ],
          responses: {
            200: { description: 'OK' }
          }
        }
      }
    }
  },
  apis: [], // No longer using JSDoc as it was unreliable
};

const specs = swaggerJsdoc(options);
console.log('Swagger Paths:', Object.keys(specs.paths));

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

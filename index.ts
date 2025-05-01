import { FastifyInstance } from 'fastify'
import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { authRoutes } from './src/routes/auth.routes'
import { userRoutes } from './src/routes/user.routes'
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: number
      email: string
    }
    user: {
      id: number
      email: string
    }
  }
}

const app: FastifyInstance = fastify({ logger: true })
app.register(stateHandler, {
  development: process.env.STATE === '1',
  watchPaths: [
    'routes/**/*.ts',
    'controllers/**/*.ts',
    'models/**/*.ts'
  ]
})

app.register(cors, {
  origin: true
})

app.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key'
})


declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: number
      email: string
    }
  }
}

const swaggerOptions = {
  swagger: {
    info: {
      title: "eweek_api ",
      description: "eweek_api  Documentation",
      version: "1.0.0",
    },
    host: "localhost",
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [{ name: "Default", description: "Default" }],
  },
};

const swaggerUiOptions = {
  routePrefix: "/docs",
  exposeRoute: true,
};

app.register(fastifySwagger, swaggerOptions);
app.register(fastifySwaggerUi, swaggerUiOptions);
app.register((app, options, done) => {
  app.get("/", {
    schema: {
      tags: ["Default"],
      response: {
        200: {
          type: "object",
          properties: {
            anything: { type: "string" },
          },
        },
      },
    },
    handler: (req, res) => {
      res.send({ message: "Hello, be welcome! Go to /docs to see eweek_api API documentation. This is Mário ladies and gentleman!" });
    },
  });
  app.register(authRoutes, { prefix: '/api/auth' })
  app.register(userRoutes, { prefix: '/api' })
  done();
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000; // Render define PORT

const start = async () => {
  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`🚀 Server ready at: http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};


start();

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});
function stateHandler(
  instance: FastifyInstance,
  opts: { development: boolean; watchPaths: string[] },
  done: (err?: Error) => void
): void {
  if (opts.development) {
    instance.log.info("State handler ativo no modo de desenvolvimento.");
  }
  done(); // Indica que o plugin foi carregado corretamente
}


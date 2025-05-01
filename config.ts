export const config = {
    port: Number(process.env.PORT) || 3000,
    host: process.env.HOST || "0.0.0.0",
    jwtSecret: process.env.JWT_SECRET || "your-secret-key",
    isDevelopment: process.env.STATE === "1",
  };
  
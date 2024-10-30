module.exports = {
  log: {
    level: "info",
    disabled: false,
  },
  cors: {
    origins: ["http://localhost:5173"],
    maxAge: 3 * 60 * 60,
  },
  port: 9000,
  database: {
    client: "mysql2",
    host: "MacBook-Pro-5.local",
    port: 3306,
    name: "LiMax",
    username: "root",
    password: "DATABASE_PASSWORD",
    ssl: {
      rejectUnauthorized: false,
    },
  },
  auth: {
    argon: {
      saltLength: 16,
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
    jwt: {
      secret:
        "eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked",
      expirationInterval: 60 * 60 * 1000, // ms (1 hour)
      issuer: "limax.be",
      audience: "limax.be",
    },
  },
};

module.exports = {
  log: {
    level: 'silly',
    disabled: true,
  },
  cors: {
    origins: ['http://localhost:5173'],
    maxAge: 3 * 60 * 60,
  },
  port: 9000,
  database: {
    client: 'mysql2',
    host: 'aws.connect.psdb.cloud',
    port: 3306,
    name: 'limax_test',
    username: 'rochffflr5oov0bilie4',
    password: 'DATABASE_PASSWORD',
    ssl: {
      rejectUnAuthorized: false,
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
        'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
      expirationInterval: 60 * 60 * 1000, // ms (1 hour)
      issuer: 'limax.be',
      audience: 'limax.be',
    },
  },
};

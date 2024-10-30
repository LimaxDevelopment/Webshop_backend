## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)

## Opstarten

### Create a .env file which include:

```typescript
NODE_ENV = development;
DATABASE_PASSWORD = "ZELF AAN TE VULLEN VAN EIGEN DATABANK";
```

### Install all dependencies using the following command:

```typescript
yarn install
```

### Run the following command to start the application:

```typescript
yarn start
```

## Testen

### Create a .env.test which include:

```typescript
NODE_ENV = test;
DATABASE_PASSWORD = ZELF AAN TE VULLEN VAN EIGEN DATABANK;
```

### To test the application, run the following command:

```typescript
yarn test
```

### To test the application with coverage, run the following command:

```typescript
yarn test:coverage
```

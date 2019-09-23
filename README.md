# sam-wise-news

This is an api that hosts a small database of news articles, with users and comments.

[API Main Page](https://sam-wise-news.herokuapp.com/api)

## Installation

### 1. Clone the repo

```bash
git clone https://github.com/smetca/sam-wise-news.git
```
### 2. Install the dependencies

```bash
npm install
```

### 3. Seeding the database

```bash
npm run setup-db
npm run seed
```

### 4. Create your knexfile

Create a file called knexfile.js

```javascript
const { DB_URL } = process.env;

const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  production: {
    connection: `${DB_URL}?ssl=true`
  },
  development: {
    connection: {
      database: 'nc_news',
      //username
      //password
    }
  },
  test: {
    connection: {
      database: 'nc_news_test',
      //username
      //password
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
```

### 5. Run tests
```bash
npm test
```

## Requirements

Node: verseion 10 and up,

Postgres: version 10.10
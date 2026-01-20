# Strapi v4 Permissions Configuration

## Roles Setup

### 1. Admin Role (Full Access)

```javascript
// Settings → Users & Permissions → Roles → Admin
{
  "article": { "create": true, "read": true, "update": true, "delete": true, "publish": true },
  "category": { "create": true, "read": true, "update": true, "delete": true },
  "author": { "create": true, "read": true, "update": true, "delete": true },
  "tag": { "create": true, "read": true, "update": true, "delete": true },
  "exam": { "create": true, "read": true, "update": true, "delete": true, "publish": true },
  "result": { "create": true, "read": true, "update": true, "delete": true, "publish": true },
  "institution": { "create": true, "read": true, "update": true, "delete": true, "publish": true },
  "restaurant": { "create": true, "read": true, "update": true, "delete": true, "publish": true },
  "event": { "create": true, "read": true, "update": true, "delete": true, "publish": true },
  "place": { "create": true, "read": true, "update": true, "delete": true, "publish": true },
  "holiday": { "create": true, "read": true, "update": true, "delete": true },
  "site-setting": { "read": true, "update": true }
}
```

### 2. Editor Role (Content Management)

```javascript
// Settings → Users & Permissions → Roles → Editor
{
  "article": { "create": true, "read": true, "update": true, "delete": false, "publish": true },
  "category": { "create": false, "read": true, "update": false, "delete": false },
  "author": { "create": false, "read": true, "update": false, "delete": false },
  "tag": { "create": true, "read": true, "update": true, "delete": false },
  "exam": { "create": true, "read": true, "update": true, "delete": false, "publish": true },
  "result": { "create": true, "read": true, "update": true, "delete": false, "publish": true },
  "institution": { "create": true, "read": true, "update": true, "delete": false, "publish": true },
  "restaurant": { "create": true, "read": true, "update": true, "delete": false, "publish": true },
  "event": { "create": true, "read": true, "update": true, "delete": false, "publish": true },
  "place": { "create": true, "read": true, "update": true, "delete": false, "publish": true },
  "holiday": { "create": true, "read": true, "update": true, "delete": false },
  "site-setting": { "read": true, "update": false }
}
```

### 3. Public Role (Read-Only API Access)

```javascript
// Settings → Users & Permissions → Roles → Public
{
  "article": { "find": true, "findOne": true },
  "category": { "find": true, "findOne": true },
  "author": { "find": true, "findOne": true },
  "tag": { "find": true, "findOne": true },
  "exam": { "find": true, "findOne": true },
  "result": { "find": true, "findOne": true },
  "institution": { "find": true, "findOne": true },
  "restaurant": { "find": true, "findOne": true },
  "event": { "find": true, "findOne": true },
  "place": { "find": true, "findOne": true },
  "holiday": { "find": true, "findOne": true },
  "site-setting": { "find": true }
}
```

## API Token Setup

### For Frontend (Public Content)
- **Name:** `frontend-readonly`
- **Type:** Read-only
- **Permissions:** All content types - find, findOne

### For Admin UI (Full Access)
- **Name:** `admin-ui-full`
- **Type:** Full access
- **Permissions:** All actions on all content types

### For Editor UI (Limited)
- **Name:** `editor-ui`
- **Type:** Custom
- **Permissions:** As per Editor role above

## Environment Variables

```env
# Strapi Admin
ADMIN_JWT_SECRET=your-admin-jwt-secret
API_TOKEN_SALT=your-api-token-salt
JWT_SECRET=your-jwt-secret

# Database (PostgreSQL recommended for production)
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=rampur_news_cms
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your-db-password

# Security
APP_KEYS=key1,key2,key3,key4
```

## CORS Configuration

For your Next.js frontend, add to `config/middlewares.js`:

```javascript
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https://picsum.photos'],
          'media-src': ["'self'", 'data:', 'blob:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'http://localhost:3000',
        'https://rampurnews.lovable.app',
        'https://rampurnews.com'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

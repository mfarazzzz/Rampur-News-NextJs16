# Strapi v4 Backend Schemas for Rampur News CMS

## Overview

These schemas are designed to work as a **headless backend** for your existing React/Next.js CMS Admin UI. Strapi Admin UI is not required in production.

## Content Types

### Core News Module
| Type | File | Draft/Publish |
|------|------|---------------|
| **Article** | `src/api/article/content-types/article/schema.json` | ✅ Yes |
| **Category** | `src/api/category/content-types/category/schema.json` | ❌ No |
| **Author** | `src/api/author/content-types/author/schema.json` | ❌ No |
| **Tag** | `src/api/tag/content-types/tag/schema.json` | ❌ No |

### Education Module
| Type | File | Draft/Publish |
|------|------|---------------|
| **Exam** | `src/api/exam/content-types/exam/schema.json` | ✅ Yes |
| **Result** | `src/api/result/content-types/result/schema.json` | ✅ Yes |
| **Institution** | `src/api/institution/content-types/institution/schema.json` | ✅ Yes |

### Lifestyle Module
| Type | File | Draft/Publish |
|------|------|---------------|
| **Restaurant** | `src/api/restaurant/content-types/restaurant/schema.json` | ✅ Yes |
| **Event** | `src/api/event/content-types/event/schema.json` | ✅ Yes |
| **Place** | `src/api/place/content-types/place/schema.json` | ✅ Yes |
| **Holiday** | `src/api/holiday/content-types/holiday/schema.json` | ❌ No |

### Settings
| Type | File | Description |
|------|------|-------------|
| **Site Settings** | `src/api/site-setting/content-types/site-setting/schema.json` | Single Type |

## Shared Components

Located in `src/components/shared/`:

- **seo.json** - SEO metadata (title, description, OG image)
- **social-links.json** - Social media profile URLs
- **address.json** - Physical address with bilingual support
- **contact.json** - Contact information

## Relations

```
Article ─┬─► Category (many-to-one)
         ├─► Author (many-to-one)
         └─► Tags (many-to-many)

Category ─► Category (self-referential parent/children)

Institution ─► Address (component)
            ─► Contact (component)
```

## Roles & Permissions

### Admin Role
- **Full access** to all content types
- Can manage users and roles
- Access to settings

### Editor Role
- **Create/Edit/Publish** articles, exams, results, events
- **View** categories, authors, settings
- Cannot delete content types
- Cannot manage users

### Public Role (API Access)
- **Read-only** access to published content:
  - Articles (published only)
  - Categories
  - Authors (name, avatar, bio only - no email)
  - Exams, Results, Institutions (published)
  - Events, Places, Restaurants (published)
  - Holidays
  - Site Settings (partial)
- **No access** to:
  - Draft content
  - User emails
  - Internal fields

## Installation

1. **Copy schemas to your Strapi project:**
   ```bash
   cp -r strapi-schemas/src/* /path/to/strapi/src/
   ```

2. **Restart Strapi:**
   ```bash
   npm run develop
   ```

3. **Configure permissions:**
   - Go to Settings → Users & Permissions → Roles
   - Set up Admin, Editor, and Public roles as described above

4. **Create API tokens:**
   - Settings → API Tokens
   - Create tokens for your frontend with appropriate permissions

## API Endpoints

After installation, your API will expose:

```
GET /api/articles?populate=*
GET /api/articles/:id?populate=*
GET /api/categories?populate=children
GET /api/authors
GET /api/exams?filters[status]=upcoming
GET /api/results?filters[isFeatured]=true
GET /api/restaurants?filters[type]=restaurant
GET /api/events?filters[status]=upcoming
GET /api/site-setting
```

## Bilingual Support

All content types support Hindi (primary) and English fields:
- `titleHindi` / `title` or `titleEnglish`
- `descriptionHindi` / `description`
- `nameHindi` / `name`

Your frontend should display the Hindi fields by default with English as fallback.

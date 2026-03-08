# Dakara Catalog System

Product catalog system for spare parts.

## Architecture

Backend:

* Laravel API

Frontend:

* React + Vite admin panel

Database:

* MySQL catalog schema

Main features:

* Product management
* Brands and categories
* Attributes
* Cross references
* Part number normalization
* Product aliases
* Product images

## Development Setup

Backend:

```
cd backend-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Frontend:

```
cd frontend
npm install
npm run dev
```

API base URL:

```
http://localhost:8000/api
```


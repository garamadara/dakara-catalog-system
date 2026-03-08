Dakara Catalog System Architecture

Components:

1. PHPPOS
   master product database

2. Laravel Backend API
   exposes product API
   handles quote requests
   syncs PHPPOS data

3. Catalog Database
   optimized for public catalog browsing

4. PickBazar Frontend
   React/Next.js catalog interface

5. DigitalOcean Spaces
   image CDN

Flow:

PHPPOS
   ↓
sync service
   ↓
catalog database
   ↓
Laravel API
   ↓
PickBazar frontend
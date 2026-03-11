# Dakara Catalog System — Roadmap

Goal: Replace WooCommerce with a fast industrial parts catalog focused on
search, attributes, cross-references, and admin productivity.

Legend:
- [ ] Not started
- [~] In progress
- [x] Completed

---

## Phase 1 — Core Catalog Backend

### Products
- [x] Products table migration
- [x] Product model with fillable fields
- [x] ProductController CRUD (store/update/destroy)
- [x] Slug generation from product name
- [x] Duplicate slug handling
- [x] Part number normalization
- [x] Store `normalized_part_number`
- [ ] Optional: soft deletes

### Categories
- [x] Categories table migration
- [x] Category model with parent relation
- [x] Category API (index/store)
- [x] Create category UI
- [ ] Category tree retrieval endpoint
- [ ] Multiple categories per product (pivot)

### Brands
- [x] Brands table migration
- [x] Brand model
- [x] Brand API (index/store)
- [x] Create brand UI
- [ ] Brand logo upload

### Attributes
- [x] Attributes table migration
- [x] Attribute model
- [x] Attribute types (text/number/boolean/select)
- [x] Attribute options JSON
- [x] Create attribute UI
- [x] Attach attributes to product
- [ ] Edit attribute UI
- [ ] Attribute option editing

### Product Images
- [x] product_images table migration
- [x] ProductImage model
- [x] Upload image API
- [~] Gallery upload UI
- [ ] Delete image endpoint
- [ ] Delete image button in UI
- [ ] Image sort_order column
- [ ] Reorder images API
- [ ] Drag-reorder UI
- [ ] Primary image flag

---

## Phase 2 — Product Admin Panel

### Create Product
- [x] Basic info section
- [x] Pricing section
- [x] Description section
- [x] Attribute selector UI
- [~] Image upload preview
- [x] Alias input
- [x] Cross-reference input

### Edit Product
- [ ] EditProduct route
- [ ] Load product data
- [ ] Populate form
- [ ] Display existing attributes
- [ ] Display existing images
- [ ] Update product fields
- [ ] Update attributes
- [ ] Upload additional images
- [ ] Delete images

### Product Listing
- [ ] Products table page
- [ ] Fetch product list API
- [ ] Display columns (name/brand/category/price)
- [ ] Pagination API
- [ ] Pagination UI
- [ ] Edit button
- [ ] Delete button

---

## Phase 3 — Catalog Search

### Backend
- [ ] Search endpoint
- [ ] Name search
- [ ] Part number search
- [ ] Normalized part number search
- [ ] Alias search join
- [ ] Paginated search results

### Frontend
- [ ] Search input component
- [ ] Debounced search
- [ ] Display search results
- [ ] Highlight matched part numbers

### Filters
- [ ] Filter by category
- [ ] Filter by brand
- [ ] Filter by attributes

---

## Phase 4 — Public Catalog

### Product Listing Page
- [ ] Public catalog route
- [ ] Product grid layout
- [ ] Fetch products from API
- [ ] Product cards
- [ ] Pagination
- [ ] Category filter
- [ ] Brand filter

### Product Detail Page
- [ ] Product detail route
- [ ] Fetch product data
- [ ] Image gallery
- [ ] Product info section
- [ ] Attributes table
- [ ] Cross references display
- [ ] Alias display
- [ ] Related products

---

## Phase 5 — Cross References

- [x] cross_references table
- [x] CrossReference API
- [ ] Reverse lookup query
- [ ] Display equivalent parts
- [ ] Search cross references

---

## Phase 6 — Alias System

- [x] product_aliases table
- [x] Alias API
- [ ] Alias search indexing
- [ ] Display aliases on product page

---

## Phase 7 — Image Optimization (Optional)

- [ ] Resize uploaded images
- [ ] Generate thumbnails
- [ ] Convert to WebP
- [ ] Optional CDN integration

---

## Phase 8 — Performance

- [ ] Full-text search index
- [ ] Cache search queries
- [ ] Optimize product queries
- [ ] Lazy load galleries

---

## Phase 9 — WooCommerce Migration

### Export
- [ ] Export WooCommerce products
- [ ] Export attributes
- [ ] Export images

### Import
- [ ] Build import script
- [ ] Map Woo fields to catalog fields
- [ ] Regenerate slugs
- [ ] Download Woo images
- [ ] Upload images to storage
- [ ] Link images to products

---

## Current Focus

1. Finish product image upload flow  
2. Implement image delete  
3. Implement image reorder  
4. Build Edit Product page  
5. Build Product List page  

Once these are complete, the system becomes **usable as a catalog replacement for WooCommerce**.

---

## Progress Estimate

- Core Backend: ~80%
- Admin Panel: ~55%
- Search: ~10%
- Public Catalog: 0%

Overall: **~50% complete**

---

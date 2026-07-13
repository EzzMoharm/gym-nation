"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ProductCard } from "@/components/shop/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X, ArrowUpDown, Tag, BadgePercent, ShieldAlert } from "lucide-react";
import type { Product } from "@/types";

interface ShopListingProps {
  products: Product[];
}

export function ShopListing({ products }: ShopListingProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categoryParam = searchParams.get("category");

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("featured");

  // Helper functions to get category and brand name from a product typesafely
  const getCategoryName = (p: any): string => {
    if (!p.category) return "";
    return typeof p.category === "string" ? p.category : p.category.name || "";
  };

  const getBrandName = (p: any): string => {
    if (!p.brand) return "";
    return typeof p.brand === "string" ? p.brand : p.brand.name || "";
  };

  const selectedCategory = useMemo(() => {
    if (!categoryParam) return null;
    const cleanParam = categoryParam.toLowerCase().trim();
    return products.map(getCategoryName).find(
      (catName) => catName.toLowerCase() === cleanParam
    ) || null;
  }, [categoryParam, products]);

  const handleCategorySelect = (cat: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "All" || !cat) {
      params.delete("category");
    } else {
      params.set("category", cat.toLowerCase());
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Dynamically extract unique categories and brands from product list
  const categories = useMemo(() => {
    const list = products.map(getCategoryName).filter(Boolean);
    return ["All", ...new Set(list)] as string[];
  }, [products]);

  const brands = useMemo(() => {
    const list = products.map(getBrandName).filter(Boolean);
    return [...new Set(list)] as string[];
  }, [products]);

  // Handle Brand check toggle
  const toggleBrand = (brandName: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(100);
    setSortBy("featured");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const pBrand = getBrandName(product);
        const pCategory = getCategoryName(product);

        // Search filter
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          product.name.toLowerCase().includes(query) ||
          (product.short_description && product.short_description.toLowerCase().includes(query)) ||
          pBrand.toLowerCase().includes(query);

        // Category filter
        const matchesCategory =
          !selectedCategory ||
          selectedCategory === "All" ||
          pCategory === selectedCategory;

        // Brand filter
        const matchesBrand =
          selectedBrands.length === 0 ||
          selectedBrands.includes(pBrand);

        // Price filter
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

        return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") {
          return a.price - b.price;
        }
        if (sortBy === "price-high") {
          return b.price - a.price;
        }
        if (sortBy === "name-asc") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "discount") {
          const discountA = a.compare_at_price ? a.compare_at_price - a.price : 0;
          const discountB = b.compare_at_price ? b.compare_at_price - b.price : 0;
          return discountB - discountA;
        }
        // Default to featured (featured first, then newest)
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return 0; // maintain relative order
      });
  }, [products, searchQuery, selectedCategory, selectedBrands, minPrice, maxPrice, sortBy]);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
      {/* Sidebar Filters */}
      <div className="space-y-8 pr-4">
        {/* Search Input for Mobile/Desktop */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Search className="h-4 w-4 text-brand" /> Search
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl bg-card border-border focus-visible:ring-brand"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Tag className="h-4 w-4 text-brand" /> Categories
          </h3>
          <ul className="space-y-1.5 text-sm">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat || (cat === "All" && !selectedCategory);
              return (
                <li
                  key={cat}
                  onClick={() => handleCategorySelect(cat === "All" ? null : cat)}
                  className={`px-3 py-2 rounded-lg cursor-pointer transition-all ${
                    isActive
                      ? "bg-brand/10 text-brand font-bold border-l-4 border-brand pl-2.5"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Brands */}
        {brands.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Filter className="h-4 w-4 text-brand" /> Brands
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {brands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-all text-sm text-muted-foreground hover:text-foreground"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="rounded border-border bg-card text-brand focus:ring-brand h-4 w-4 transition-all"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Price Filter */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <BadgePercent className="h-4 w-4 text-brand" /> Price Range
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <span className="text-xs text-muted-foreground">Min ($)</span>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="rounded-lg h-9 bg-card border-border"
                />
              </div>
              <div className="flex-1">
                <span className="text-xs text-muted-foreground">Max ($)</span>
                <Input
                  type="number"
                  min="0"
                  max="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="rounded-lg h-9 bg-card border-border"
                />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Active Filters Summary & Reset */}
        {(selectedCategory || selectedBrands.length > 0 || searchQuery || minPrice > 0 || maxPrice < 100) && (
          <Button
            variant="outline"
            onClick={resetFilters}
            className="w-full rounded-xl border-dashed border-muted-foreground/30 hover:border-brand hover:text-brand gap-2 h-10 text-xs font-semibold"
          >
            <X className="h-3.5 w-3.5" />
            Clear All Filters
          </Button>
        )}
      </div>

      {/* Product Grid & Sorting */}
      <div className="md:col-span-3 space-y-6">
        {/* Bar displaying stats and Sort */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border">
          <span className="text-sm text-muted-foreground font-medium">
            Showing <span className="text-foreground font-semibold">{filteredProducts.length}</span> of{" "}
            <span className="text-foreground font-semibold">{products.length}</span> products
          </span>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-card text-foreground border border-border rounded-xl px-3 py-1.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand cursor-pointer transition-all"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
              <option value="discount">Biggest Savings</option>
            </select>
          </div>
        </div>

        {/* Grid List */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-16 text-center flex flex-col items-center justify-center">
            <ShieldAlert className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No matching products found</h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-sm">
              We couldn&apos;t find any items matching your filters. Try checking different categories or resetting the filter parameters.
            </p>
            <Button
              variant="outline"
              onClick={resetFilters}
              className="mt-6 rounded-xl bg-brand text-brand-foreground hover:bg-brand-light"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import ProductCard from '@/components/ProductCard';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { getFilters, getProducts } from '@/services/apiService';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const Search = () => {
  const searchParams = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    category: 'all',
    priceRange: { min: 0, max: 50000 },
    brand: 'all',
    discount: 0,
    organic: false,
    inStock: true,
    fastDelivery: false
  });

  // Dynamic data state
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [brandOptions, setBrandOptions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // Sort options (static)
  const sortOptions = [
    { id: 'name', name: 'Name (A-Z)' },
    { id: 'name-desc', name: 'Name (Z-A)' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'popular', name: 'Most Popular' },
    { id: 'newest', name: 'Newest First' },
  ];

  // Load filters from API
  const loadFilters = async () => {
    try {
      setLoading(true);
      const response = await getFilters();

      if (response.success && response.data) {
        // Map categories with "All" option
        const categories = [
          { id: 'all', name: 'All', count: response.data.total_products || 0 }
        ];

        if (response.data.categories) {
          response.data.categories.forEach(cat => {
            categories.push({
              id: cat.id.toString(),
              name: cat.category,
              count: cat.count || 0
            });
          });
        }

        setMainCategories(categories);

        // Map subcategories grouped by category
        const subcatsObj = {};
        if (response.data.subcategories) {
          response.data.subcategories.forEach(subcat => {
            const catId = subcat.cat_id.toString();
            if (!subcatsObj[catId]) {
              subcatsObj[catId] = [];
            }
            subcatsObj[catId].push({
              id: subcat.id.toString(),
              name: subcat.subcategory,
              count: subcat.count || 0
            });
          });
        }

        setSubcategories(subcatsObj);

        // Map brands with "All Brands" option
        const brands = [{ id: 'all', name: 'All Brands' }];

        if (response.data.brands) {
          response.data.brands.forEach(brand => {
            brands.push({
              id: brand.id.toString(),
              name: brand.brand,
              count: brand.count || 0
            });
          });
        }

        setBrandOptions(brands);

        console.log('✅ Filters loaded successfully');
      } else {
        console.error('❌ Failed to load filters:', response.error);
      }
    } catch (error) {
      console.error('❌ Error loading filters:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load products from API
  const loadProducts = useCallback(async (filters = {}) => {
    try {
      setProductsLoading(true);

      const apiFilters = {
        status: 'active',
        ...filters
      };

      const response = await getProducts(apiFilters);

      if (response.success && response.data && Array.isArray(response.data)) {
        // Map products to match UI structure
        const products = response.data.map(prod => ({
          id: parseInt(prod.id),
          name: prod.name,
          description: prod.description || '',
          unit: prod.unit || prod.weight || '1 unit',
          weight: prod.weight || '',
          quantity: prod.quantity || '',
          mrp: parseFloat(prod.mrp) || 0,
          sale_price: parseFloat(prod.sale_price) || 0,
          sellingPrice: parseFloat(prod.sale_price) || 0,
          image: prod.image,
          sub_images: prod.sub_images || [],
          cat_id: prod.cat_id,
          sub_id: prod.sub_id,
          brand_id: prod.brand_id,
          category: prod.category || '',
          subcategory: prod.subcategory || '',
          brand: prod.brand || '',
          tag: prod.tag || '',
          featured: prod.featured === 'yes',
          status: prod.status || '',
          feature_title1: prod.feature_title1 || '',
          feature_description1: prod.feature_description1 || '',
          feature_title2: prod.feature_title2 || '',
          feature_description2: prod.feature_description2 || '',
          feature_title3: prod.feature_title3 || '',
          feature_description3: prod.feature_description3 || '',
          feature_title4: prod.feature_title4 || '',
          feature_description4: prod.feature_description4 || '',
          feature_title5: prod.feature_title5 || '',
          feature_description5: prod.feature_description5 || ''
        }));

        setAllProducts(products);
        console.log('✅ Products loaded:', products.length);
      } else {
        // No products found or error
        console.log('ℹ️ No products found for current filters');
        setAllProducts([]);
      }
    } catch (error) {
      console.error('❌ Error loading products:', error);
      setAllProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }, []); // Empty dependency array since it doesn't depend on any state

  // Load filters when component mounts
  useFocusEffect(
    useCallback(() => {
      loadFilters();
      loadProducts();
    }, [loadProducts])
  );

  // Initialize search based on navigation params - ONLY ONCE
  useEffect(() => {
    if (searchParams.cat_id) {
      setSelectedFilter(searchParams.cat_id);
      setShowCategories(false);
    } else {
      setShowCategories(true);
    }

    if (searchParams.brand_id) {
      setFilterOptions(prev => ({
        ...prev,
        brand: searchParams.brand_id
      }));
    }
  }, [searchParams.cat_id, searchParams.brand_id]); // Only depend on specific params

  // Reload products when filters change
  useEffect(() => {
    const filters = {};

    if (selectedFilter !== 'all') {
      filters.cat_id = selectedFilter;
    }

    if (selectedSubcategory !== 'all') {
      filters.sub_id = selectedSubcategory;
    }

    if (filterOptions.brand !== 'all') {
      filters.brand_id = filterOptions.brand;
    }

    loadProducts(filters);
  }, [selectedFilter, selectedSubcategory, filterOptions.brand, loadProducts]);

  // Filter and sort products
  const filteredAndSortedProducts = allProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedFilter === 'all' || product.cat_id.toString() === selectedFilter;
      const matchesSubcategory = selectedSubcategory === 'all' || product.sub_id.toString() === selectedSubcategory;
      const matchesPriceRange = product.sellingPrice >= filterOptions.priceRange.min && product.sellingPrice <= filterOptions.priceRange.max;
      const matchesFilterBrand = filterOptions.brand === 'all' || product.brand_id.toString() === filterOptions.brand;

      return matchesSearch && matchesCategory && matchesSubcategory && matchesPriceRange && matchesFilterBrand;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-low':
          return a.sellingPrice - b.sellingPrice;
        case 'price-high':
          return b.sellingPrice - a.sellingPrice;
        case 'popular':
          return b.id - a.id;
        case 'newest':
          return b.id - a.id;
        default:
          return 0;
      }
    });

  const handleCategoryPress = (filter) => {
    setSelectedFilter(filter.id);
    setSelectedSubcategory('all');
    setShowCategories(false);
  };

  const applyFilters = () => {
    setShowFilterModal(false);
  };

  const resetFilters = () => {
    setFilterOptions({
      category: 'all',
      priceRange: { min: 0, max: 50000 },
      brand: 'all',
      discount: 0,
      organic: false,
      inStock: true,
      fastDelivery: false
    });
    setSelectedFilter('all');
    setSelectedSubcategory('all');
    setSearchQuery('');
    setSortBy('name');
    setShowCategories(true);
  };

  const handleProductPress = (item) => {
    router.push(`/product/${item.id}`);
  };

  const handleSortPress = () => {
    setShowSortModal(true);
  };

  const handleSortSelect = (option) => {
    setSortBy(option.id);
    setShowSortModal(false);
  };

  // Get current subcategories based on selected filter
  const getCurrentSubcategories = () => {
    if (selectedFilter === 'all') return [];
    return subcategories[selectedFilter] || [];
  };

  // Handle filter press to show categories
  const handleFilterPress = () => {
    setShowCategories(true);
    setShowFilterModal(true);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterItem,
        selectedFilter === item.id && styles.selectedFilter
      ]}
      onPress={() => handleCategoryPress(item)}
    >
      <Text style={[
        styles.filterText,
        selectedFilter === item.id && styles.selectedFilterText
      ]}>
        {item.name} ({item.count})
      </Text>
    </TouchableOpacity>
  );

  const renderSubcategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.subcategoryItem,
        selectedSubcategory === item.id && styles.selectedSubcategoryItem
      ]}
      onPress={() => setSelectedSubcategory(item.id)}
    >
      <Text style={[
        styles.subcategoryText,
        selectedSubcategory === item.id && styles.selectedSubcategoryText
      ]}>
        {item.name} ({item.count})
      </Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item, index }) => (
    <View style={[styles.productContainer, index % 2 === 1 && styles.rightProduct]}>
      <ProductCard item={item} onPress={handleProductPress} />
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <SafeAreaWrapper>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Find Products</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary.main} />
            <Text style={styles.loadingText}>Loading filters...</Text>
          </View>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Find Products</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={20}
              color={theme.colors.text.secondary}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Store"
              placeholderTextColor={theme.colors.text.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Sort and Filter Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.sortButton} onPress={handleSortPress}>
            <Ionicons name="swap-vertical" size={18} color={theme.colors.text.primary} />
            <Text style={styles.sortButtonText}>Sort</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterToggleButton} onPress={handleFilterPress}>
            <Ionicons name="filter" size={18} color={theme.colors.text.primary} />
            <Text style={styles.filterToggleText}>Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Main Categories - Only show if not coming from category selection */}
        {showCategories && (
          <View style={styles.filtersContainer}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <FlatList
              data={mainCategories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersList}
            />
          </View>
        )}

        {/* Subcategories - Show when a specific category is selected */}
        {!showCategories && getCurrentSubcategories().length > 0 && (
          <View style={styles.subcategoriesContainer}>
            <View style={styles.subcategoryHeader}>
              <Text style={styles.sectionTitle}>Subcategories</Text>
              <TouchableOpacity onPress={() => setShowCategories(true)}>
                <Text style={styles.backToCategoriesText}>All Categories</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={[{ id: 'all', name: 'All', count: allProducts.filter(p => p.cat_id.toString() === selectedFilter).length }, ...getCurrentSubcategories()]}
              renderItem={renderSubcategoryItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersList}
            />
          </View>
        )}

        {/* Results */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredAndSortedProducts.length} products found
          </Text>

          {productsLoading ? (
            <View style={styles.productsLoadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary.main} />
              <Text style={styles.loadingText}>Loading products...</Text>
            </View>
          ) : filteredAndSortedProducts.length > 0 ? (
            <FlatList
              data={filteredAndSortedProducts}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.productsList}
              columnWrapperStyle={styles.row}
            />
          ) : (
            <View style={styles.noResults}>
              <Ionicons
                name="search-outline"
                size={60}
                color={theme.colors.text.tertiary}
              />
              <Text style={styles.noResultsTitle}>No products found</Text>
              <Text style={styles.noResultsSubtitle}>
                Try searching with different keywords
              </Text>
            </View>
          )}
        </View>

        {/* Sort Modal */}
        {showSortModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.sortModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Sort by</Text>
                <TouchableOpacity onPress={() => setShowSortModal(false)}>
                  <Ionicons name="close" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
              </View>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.sortOption,
                    sortBy === option.id && styles.selectedSortOption
                  ]}
                  onPress={() => handleSortSelect(option)}
                >
                  <Text style={[
                    styles.sortOptionText,
                    sortBy === option.id && styles.selectedSortOptionText
                  ]}>
                    {option.name}
                  </Text>
                  {sortBy === option.id && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={theme.colors.primary.main}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Filter Modal */}
        <Modal
          visible={showFilterModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaWrapper>
            <View style={styles.filterModalContainer}>
              <View style={styles.filterModalHeader}>
                <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                  <Ionicons name="close" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.filterModalTitle}>Filters</Text>
                <TouchableOpacity onPress={resetFilters}>
                  <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.filterModalContent}>
                {/* Price Range */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Price Range</Text>
                  <View style={styles.priceRangeContainer}>
                    <Text style={styles.priceLabel}>£{filterOptions.priceRange.min} - £{filterOptions.priceRange.max}</Text>

                    <View style={styles.sliderContainer}>
                      <Text style={styles.sliderLabel}>Min: £{filterOptions.priceRange.min}</Text>
                      <View style={styles.sliderRow}>
                        <TouchableOpacity
                          style={styles.sliderButton}
                          onPress={() => setFilterOptions({
                            ...filterOptions,
                            priceRange: {...filterOptions.priceRange, min: Math.max(0, filterOptions.priceRange.min - 100)}
                          })}
                        >
                          <Text style={styles.sliderButtonText}>-</Text>
                        </TouchableOpacity>
                        <View style={styles.sliderTrack}>
                          <View
                            style={[
                              styles.sliderProgress,
                              { width: `${(filterOptions.priceRange.min / 50000) * 100}%` }
                            ]}
                          />
                        </View>
                        <TouchableOpacity
                          style={styles.sliderButton}
                          onPress={() => setFilterOptions({
                            ...filterOptions,
                            priceRange: {...filterOptions.priceRange, min: Math.min(50000, filterOptions.priceRange.min + 100)}
                          })}
                        >
                          <Text style={styles.sliderButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.sliderContainer}>
                      <Text style={styles.sliderLabel}>Max: £{filterOptions.priceRange.max}</Text>
                      <View style={styles.sliderRow}>
                        <TouchableOpacity
                          style={styles.sliderButton}
                          onPress={() => setFilterOptions({
                            ...filterOptions,
                            priceRange: {...filterOptions.priceRange, max: Math.max(0, filterOptions.priceRange.max - 100)}
                          })}
                        >
                          <Text style={styles.sliderButtonText}>-</Text>
                        </TouchableOpacity>
                        <View style={styles.sliderTrack}>
                          <View
                            style={[
                              styles.sliderProgress,
                              { width: `${(filterOptions.priceRange.max / 50000) * 100}%` }
                            ]}
                          />
                        </View>
                        <TouchableOpacity
                          style={styles.sliderButton}
                          onPress={() => setFilterOptions({
                            ...filterOptions,
                            priceRange: {...filterOptions.priceRange, max: Math.min(50000, filterOptions.priceRange.max + 100)}
                          })}
                        >
                          <Text style={styles.sliderButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Brand */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Brand</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.brandOptionsContainer}>
                      {brandOptions.map((brand) => (
                        <TouchableOpacity
                          key={brand.id}
                          style={[
                            styles.brandOption,
                            filterOptions.brand === brand.id && styles.selectedBrandOption
                          ]}
                          onPress={() => setFilterOptions({...filterOptions, brand: brand.id})}
                        >
                          <Text style={[
                            styles.brandOptionText,
                            filterOptions.brand === brand.id && styles.selectedBrandOptionText
                          ]}>
                            {brand.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                {/* Discount */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Discount</Text>
                  <View style={styles.discountContainer}>
                    {[50, 40, 30, 20, 10].map((discount) => (
                      <TouchableOpacity
                        key={discount}
                        style={[
                          styles.discountOption,
                          filterOptions.discount === discount && styles.selectedDiscountOption
                        ]}
                        onPress={() => setFilterOptions({...filterOptions, discount})}
                      >
                        <Text style={[
                          styles.discountText,
                          filterOptions.discount === discount && styles.selectedDiscountText
                        ]}>
                          {discount}% & above
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Special Features */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Special Features</Text>

                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setFilterOptions({...filterOptions, organic: !filterOptions.organic})}
                  >
                    <View style={[styles.checkbox, filterOptions.organic && styles.checkedBox]}>
                      {filterOptions.organic && (
                        <Ionicons name="checkmark" size={16} color={theme.colors.text.white} />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>Organic Products</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setFilterOptions({...filterOptions, inStock: !filterOptions.inStock})}
                  >
                    <View style={[styles.checkbox, filterOptions.inStock && styles.checkedBox]}>
                      {filterOptions.inStock && (
                        <Ionicons name="checkmark" size={16} color={theme.colors.text.white} />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>In Stock Only</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setFilterOptions({...filterOptions, fastDelivery: !filterOptions.fastDelivery})}
                  >
                    <View style={[styles.checkbox, filterOptions.fastDelivery && styles.checkedBox]}>
                      {filterOptions.fastDelivery && (
                        <Ionicons name="checkmark" size={16} color={theme.colors.text.white} />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>Fast Delivery (Same Day)</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>

              <View style={styles.filterModalFooter}>
                <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaWrapper>
        </Modal>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  loadingText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.lg,
  },
  productsLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing['4xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.input,
    borderRadius: theme.components.searchBar.borderRadius,
    paddingHorizontal: theme.spacing.lg,
    height: theme.components.searchBar.height,
    borderWidth: 1,
    borderColor: theme.colors.secondary.main,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  clearButton: {
    padding: theme.spacing.xs,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.card,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  sortButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
  },
  filterToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.card,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  filterToggleText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
    marginRight: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.lg,
  },
  filtersContainer: {
    marginBottom: theme.spacing.lg,
  },
  subcategoriesContainer: {
    marginBottom: theme.spacing.lg,
  },
  subcategoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  backToCategoriesText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.primary.main,
  },
  filtersList: {
    paddingLeft: theme.spacing.lg,
  },
  filterItem: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  selectedFilter: {
    backgroundColor: theme.colors.secondary.main,
    borderColor: theme.colors.secondary.main,
  },
  filterText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.primary,
  },
  selectedFilterText: {
    color: theme.colors.text.white,
  },
  subcategoryItem: {
    backgroundColor: theme.colors.surface.light,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  selectedSubcategoryItem: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  subcategoryText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.secondary,
  },
  selectedSubcategoryText: {
    color: theme.colors.text.white,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  resultsText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },
  productsList: {
    paddingBottom: theme.spacing['6xl'],
  },
  row: {
    justifyContent: 'space-between',
  },
  productContainer: {
    width: '48%',
    marginBottom: theme.spacing.lg,
  },
  rightProduct: {
    marginLeft: '4%',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing['4xl'],
  },
  noResultsTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  noResultsSubtitle: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sortModal: {
    backgroundColor: theme.colors.background.primary,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingBottom: theme.spacing['4xl'],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.border,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.divider,
  },
  selectedSortOption: {
    backgroundColor: theme.colors.primary[50],
  },
  sortOptionText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.primary,
  },
  selectedSortOptionText: {
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.secondary.main,
  },
  filterModalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  filterModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.border,
  },
  filterModalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
  },
  resetText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.secondary.main,
  },
  filterModalContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  filterModalFooter: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface.border,
  },
  applyButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.white,
  },
  filterSection: {
    marginBottom: theme.spacing['2xl'],
  },
  filterSectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  priceRangeContainer: {
    backgroundColor: theme.colors.surface.input,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  priceLabel: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  sliderContainer: {
    marginBottom: theme.spacing.md,
  },
  sliderLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  sliderButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.white,
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.surface.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderProgress: {
    height: '100%',
    backgroundColor: theme.colors.primary.main,
    borderRadius: 3,
  },
  brandOptionsContainer: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.sm,
  },
  brandOption: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  selectedBrandOption: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  brandOptionText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.primary,
  },
  selectedBrandOptionText: {
    color: theme.colors.text.white,
  },
  discountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  discountOption: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  selectedDiscountOption: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  discountText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: 'Outfit-Medium',
    color: theme.colors.text.primary,
  },
  selectedDiscountText: {
    color: theme.colors.text.white,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: theme.colors.surface.border,
    borderRadius: theme.borderRadius.xs,
    marginRight: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: theme.colors.secondary.main,
    borderColor: theme.colors.secondary.main,
  },
  checkboxLabel: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-Regular',
    color: theme.colors.text.primary,
    flex: 1,
  },
});

export default Search;
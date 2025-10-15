import ProductCard from '@/components/ProductCard';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import theme from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
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
    priceRange: { min: 0, max: 50 },
    brand: 'all',
    discount: 0,
    organic: false,
    inStock: true,
    fastDelivery: false
  });

  // Main categories
  const mainCategories = [
    { id: 'all', name: 'All', count: 24 },
    { id: 'fruits_vegetables', name: 'Fruits & Vegetables', count: 20 },
    { id: 'cooking_oil_ghee', name: 'Cooking Oil & Ghee', count: 8 },
    { id: 'meat_fish', name: 'Meat & Fish', count: 6 },
    { id: 'bakery_snacks', name: 'Bakery & Snacks', count: 15 },
    { id: 'dairy_eggs', name: 'Dairy & Eggs', count: 10 },
    { id: 'beverages', name: 'Beverages', count: 12 },
    { id: 'personal_care', name: 'Personal Care', count: 18 },
  ];

  // Subcategories
  const subcategories = {
    fruits_vegetables: [
      { id: 'fresh_fruits', name: 'Fresh Fruits', count: 12 },
      { id: 'vegetables', name: 'Fresh Vegetables', count: 8 },
      { id: 'herbs', name: 'Herbs & Seasonings', count: 5 },
      { id: 'exotic', name: 'Exotic Fruits', count: 3 }
    ],
    cooking_oil_ghee: [
      { id: 'cooking_oil', name: 'Cooking Oils', count: 6 },
      { id: 'ghee', name: 'Ghee & Butter', count: 4 },
      { id: 'specialty_oil', name: 'Specialty Oils', count: 2 }
    ],
    meat_fish: [
      { id: 'chicken', name: 'Chicken', count: 8 },
      { id: 'mutton', name: 'Mutton', count: 4 },
      { id: 'fish', name: 'Fresh Fish', count: 6 },
      { id: 'seafood', name: 'Seafood', count: 3 }
    ],
    bakery_snacks: [
      { id: 'bread', name: 'Bread & Bakery', count: 8 },
      { id: 'biscuits', name: 'Biscuits & Cookies', count: 12 },
      { id: 'chips', name: 'Chips & Namkeen', count: 10 },
      { id: 'sweets', name: 'Sweets', count: 6 }
    ],
    dairy_eggs: [
      { id: 'milk', name: 'Milk', count: 5 },
      { id: 'curd_paneer', name: 'Curd & Paneer', count: 8 },
      { id: 'cheese', name: 'Cheese', count: 6 },
      { id: 'eggs', name: 'Eggs', count: 3 }
    ],
    beverages: [
      { id: 'tea_coffee', name: 'Tea & Coffee', count: 8 },
      { id: 'cold_drinks', name: 'Cold Drinks', count: 10 },
      { id: 'juices', name: 'Juices', count: 7 },
      { id: 'energy_drinks', name: 'Energy Drinks', count: 4 }
    ],
    personal_care: [
      { id: 'oral_care', name: 'Oral Care', count: 6 },
      { id: 'hair_care', name: 'Hair Care', count: 8 },
      { id: 'skin_care', name: 'Skin Care', count: 10 },
      { id: 'hygiene', name: 'Hygiene', count: 5 }
    ]
  };

  // Brand options
  const brandOptions = [
    { id: 'all', name: 'All Brands' },
    { id: 'amul', name: 'Amul' },
    { id: 'britannia', name: 'Britannia' },
    { id: 'nestle', name: 'Nestle' },
    { id: 'patanjali', name: 'Patanjali' },
    { id: 'tata', name: 'Tata' },
    { id: 'hindustan_unilever', name: 'Hindustan Unilever' },
    { id: 'itc', name: 'ITC' },
    { id: 'parle', name: 'Parle' }
  ];

  // Sort options
  const sortOptions = [
    { id: 'name', name: 'Name (A-Z)' },
    { id: 'name-desc', name: 'Name (Z-A)' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'popular', name: 'Most Popular' },
    { id: 'newest', name: 'Newest First' },
  ];

  // Expanded product data for all categories and subcategories
  const allProducts = [
    // Fruits & Vegetables - Fresh Fruits
    {
      id: 1,
      name: "Organic Bananas",
      unit: "7pcs, Price per kg",
      mrp: 5.99,
      sellingPrice: 4.99,
      image: require("../../assets/images/products/large/01.png"),
      category: "fruits_vegetables",
      subcategory: "fresh_fruits",
      brand: "fresh farm"
    },
    {
      id: 2,
      name: "Red Apple",
      unit: "1kg, Price per kg",
      mrp: 6.49,
      sellingPrice: 4.99,
      image: require("../../assets/images/products/large/02.png"),
      category: "fruits_vegetables",
      subcategory: "fresh_fruits",
      brand: "organic plus"
    },
    {
      id: 23,
      name: "Fresh Oranges",
      unit: "1kg, Price per kg",
      mrp: 6.99,
      sellingPrice: 5.99,
      image: require("../../assets/images/products/large/01.png"),
      category: "fruits_vegetables",
      subcategory: "fresh_fruits",
      brand: "golden harvest"
    },

    // Fruits & Vegetables - Vegetables
    {
      id: 3,
      name: "Bell Pepper Red",
      unit: "1kg, Price per kg",
      mrp: 6.99,
      sellingPrice: 4.99,
      image: require("../../assets/images/products/large/03.png"),
      category: "fruits_vegetables",
      subcategory: "vegetables",
      brand: "green valley"
    },
    {
      id: 4,
      name: "Ginger",
      unit: "250gm, Price per 250g",
      mrp: 5.49,
      sellingPrice: 3.99,
      image: require("../../assets/images/products/large/04.png"),
      category: "fruits_vegetables",
      subcategory: "vegetables",
      brand: "pure nature"
    },
    {
      id: 5,
      name: "Fresh Carrots",
      unit: "1kg, Price per kg",
      mrp: 4.99,
      sellingPrice: 3.49,
      image: require("../../assets/images/products/large/05.png"),
      category: "fruits_vegetables",
      subcategory: "vegetables",
      brand: "fresh farm"
    },
    {
      id: 6,
      name: "Organic Tomatoes",
      unit: "1kg, Price per kg",
      mrp: 7.99,
      sellingPrice: 6.99,
      image: require("../../assets/images/products/large/06.png"),
      category: "fruits_vegetables",
      subcategory: "vegetables",
      brand: "organic plus"
    },

    // Fruits & Vegetables - Herbs
    {
      id: 24,
      name: "Fresh Cilantro",
      unit: "100g, Price per bunch",
      mrp: 2.49,
      sellingPrice: 1.99,
      image: require("../../assets/images/products/large/07.png"),
      category: "fruits_vegetables",
      subcategory: "herbs",
      brand: "fresh farm"
    },
    {
      id: 25,
      name: "Fresh Mint",
      unit: "50g, Price per bunch",
      mrp: 1.99,
      sellingPrice: 1.49,
      image: require("../../assets/images/products/large/08.png"),
      category: "fruits_vegetables",
      subcategory: "herbs",
      brand: "organic plus"
    },

    // Fruits & Vegetables - Exotic Fruits
    {
      id: 26,
      name: "Dragon Fruit",
      unit: "1pc, Price per piece",
      mrp: 8.99,
      sellingPrice: 7.99,
      image: require("../../assets/images/products/large/09.png"),
      category: "fruits_vegetables",
      subcategory: "exotic",
      brand: "pure nature"
    },
    {
      id: 27,
      name: "Avocado",
      unit: "2pcs, Price per pack",
      mrp: 9.99,
      sellingPrice: 8.49,
      image: require("../../assets/images/products/large/10.png"),
      category: "fruits_vegetables",
      subcategory: "exotic",
      brand: "golden harvest"
    },

    // Cooking Oil & Ghee - Cooking Oil
    {
      id: 13,
      name: "Sunflower Oil",
      unit: "1L, Price per liter",
      mrp: 7.99,
      sellingPrice: 6.99,
      image: require("../../assets/images/products/large/01.png"),
      category: "cooking_oil_ghee",
      subcategory: "cooking_oil",
      brand: "tata"
    },
    {
      id: 28,
      name: "Olive Oil",
      unit: "500ml, Price per bottle",
      mrp: 12.99,
      sellingPrice: 11.49,
      image: require("../../assets/images/products/large/02.png"),
      category: "cooking_oil_ghee",
      subcategory: "cooking_oil",
      brand: "britannia"
    },

    // Cooking Oil & Ghee - Ghee
    {
      id: 14,
      name: "Pure Ghee",
      unit: "500g, Price per pack",
      mrp: 12.99,
      sellingPrice: 11.49,
      image: require("../../assets/images/products/large/02.png"),
      category: "cooking_oil_ghee",
      subcategory: "ghee",
      brand: "amul"
    },
    {
      id: 29,
      name: "Cow Ghee",
      unit: "250g, Price per jar",
      mrp: 8.99,
      sellingPrice: 7.99,
      image: require("../../assets/images/products/large/03.png"),
      category: "cooking_oil_ghee",
      subcategory: "ghee",
      brand: "patanjali"
    },

    // Cooking Oil & Ghee - Specialty Oil
    {
      id: 30,
      name: "Coconut Oil",
      unit: "200ml, Price per bottle",
      mrp: 5.99,
      sellingPrice: 4.99,
      image: require("../../assets/images/products/large/04.png"),
      category: "cooking_oil_ghee",
      subcategory: "specialty_oil",
      brand: "tata"
    },

    // Meat & Fish - Chicken
    {
      id: 8,
      name: "Broiler Chicken",
      unit: "1kg, Price per kg",
      mrp: 8.99,
      sellingPrice: 6.99,
      image: require("../../assets/images/products/large/08.png"),
      category: "meat_fish",
      subcategory: "chicken",
      brand: "local mart"
    },
    {
      id: 31,
      name: "Chicken Breast",
      unit: "500g, Price per pack",
      mrp: 7.99,
      sellingPrice: 6.49,
      image: require("../../assets/images/products/large/09.png"),
      category: "meat_fish",
      subcategory: "chicken",
      brand: "golden harvest"
    },

    // Meat & Fish - Mutton
    {
      id: 9,
      name: "Fresh Mutton",
      unit: "1kg, Price per kg",
      mrp: 15.99,
      sellingPrice: 13.99,
      image: require("../../assets/images/products/large/09.png"),
      category: "meat_fish",
      subcategory: "mutton",
      brand: "golden harvest"
    },
    {
      id: 32,
      name: "Goat Curry Cut",
      unit: "500g, Price per pack",
      mrp: 9.99,
      sellingPrice: 8.49,
      image: require("../../assets/images/products/large/10.png"),
      category: "meat_fish",
      subcategory: "mutton",
      brand: "local mart"
    },

    // Meat & Fish - Fish
    {
      id: 10,
      name: "Fresh Fish",
      unit: "1kg, Price per kg",
      mrp: 11.99,
      sellingPrice: 9.99,
      image: require("../../assets/images/products/large/10.png"),
      category: "meat_fish",
      subcategory: "fish",
      brand: "local mart"
    },
    {
      id: 33,
      name: "Salmon Fillet",
      unit: "300g, Price per pack",
      mrp: 14.99,
      sellingPrice: 12.99,
      image: require("../../assets/images/products/large/11.png"),
      category: "meat_fish",
      subcategory: "fish",
      brand: "golden harvest"
    },

    // Meat & Fish - Seafood
    {
      id: 34,
      name: "Fresh Prawns",
      unit: "250g, Price per pack",
      mrp: 12.99,
      sellingPrice: 10.99,
      image: require("../../assets/images/products/large/12.png"),
      category: "meat_fish",
      subcategory: "seafood",
      brand: "local mart"
    },

    // Bakery & Snacks - Bread
    {
      id: 12,
      name: "Brown Bread",
      unit: "400g, Price per pack",
      mrp: 2.99,
      sellingPrice: 2.49,
      image: require("../../assets/images/products/large/12.png"),
      category: "bakery_snacks",
      subcategory: "bread",
      brand: "britannia"
    },
    {
      id: 35,
      name: "White Bread",
      unit: "400g, Price per loaf",
      mrp: 2.49,
      sellingPrice: 1.99,
      image: require("../../assets/images/products/large/01.png"),
      category: "bakery_snacks",
      subcategory: "bread",
      brand: "britannia"
    },

    // Bakery & Snacks - Biscuits
    {
      id: 18,
      name: "Biscuits",
      unit: "200g, Price per pack",
      mrp: 2.99,
      sellingPrice: 2.49,
      image: require("../../assets/images/products/large/06.png"),
      category: "bakery_snacks",
      subcategory: "biscuits",
      brand: "britannia"
    },
    {
      id: 36,
      name: "Digestive Cookies",
      unit: "150g, Price per pack",
      mrp: 3.49,
      sellingPrice: 2.99,
      image: require("../../assets/images/products/large/02.png"),
      category: "bakery_snacks",
      subcategory: "biscuits",
      brand: "parle"
    },

    // Bakery & Snacks - Chips
    {
      id: 17,
      name: "Potato Chips",
      unit: "150g, Price per pack",
      mrp: 3.49,
      sellingPrice: 2.99,
      image: require("../../assets/images/products/large/05.png"),
      category: "bakery_snacks",
      subcategory: "chips",
      brand: "parle"
    },
    {
      id: 37,
      name: "Corn Chips",
      unit: "100g, Price per pack",
      mrp: 2.99,
      sellingPrice: 2.49,
      image: require("../../assets/images/products/large/03.png"),
      category: "bakery_snacks",
      subcategory: "chips",
      brand: "itc"
    },

    // Bakery & Snacks - Sweets
    {
      id: 38,
      name: "Gulab Jamun",
      unit: "500g, Price per box",
      mrp: 6.99,
      sellingPrice: 5.99,
      image: require("../../assets/images/products/large/04.png"),
      category: "bakery_snacks",
      subcategory: "sweets",
      brand: "local mart"
    },

    // Dairy & Eggs - Milk
    {
      id: 11,
      name: "Fresh Milk",
      unit: "1L, Price per liter",
      mrp: 3.99,
      sellingPrice: 3.49,
      image: require("../../assets/images/products/large/11.png"),
      category: "dairy_eggs",
      subcategory: "milk",
      brand: "amul"
    },
    {
      id: 39,
      name: "Toned Milk",
      unit: "500ml, Price per pack",
      mrp: 2.49,
      sellingPrice: 1.99,
      image: require("../../assets/images/products/large/05.png"),
      category: "dairy_eggs",
      subcategory: "milk",
      brand: "amul"
    },

    // Dairy & Eggs - Curd & Paneer
    {
      id: 40,
      name: "Fresh Curd",
      unit: "400g, Price per cup",
      mrp: 3.49,
      sellingPrice: 2.99,
      image: require("../../assets/images/products/large/06.png"),
      category: "dairy_eggs",
      subcategory: "curd_paneer",
      brand: "amul"
    },
    {
      id: 41,
      name: "Paneer",
      unit: "200g, Price per pack",
      mrp: 4.99,
      sellingPrice: 4.49,
      image: require("../../assets/images/products/large/07.png"),
      category: "dairy_eggs",
      subcategory: "curd_paneer",
      brand: "amul"
    },

    // Dairy & Eggs - Cheese
    {
      id: 42,
      name: "Cheddar Cheese",
      unit: "100g, Price per slice",
      mrp: 3.99,
      sellingPrice: 3.49,
      image: require("../../assets/images/products/large/08.png"),
      category: "dairy_eggs",
      subcategory: "cheese",
      brand: "amul"
    },

    // Dairy & Eggs - Eggs
    {
      id: 43,
      name: "Farm Fresh Eggs",
      unit: "12pcs, Price per dozen",
      mrp: 4.99,
      sellingPrice: 4.49,
      image: require("../../assets/images/products/large/09.png"),
      category: "dairy_eggs",
      subcategory: "eggs",
      brand: "fresh farm"
    },

    // Beverages - Tea & Coffee
    {
      id: 15,
      name: "Green Tea",
      unit: "100g, Price per pack",
      mrp: 4.99,
      sellingPrice: 3.99,
      image: require("../../assets/images/products/large/03.png"),
      category: "beverages",
      subcategory: "tea_coffee",
      brand: "tata"
    },
    {
      id: 44,
      name: "Black Coffee",
      unit: "200g, Price per jar",
      mrp: 8.99,
      sellingPrice: 7.49,
      image: require("../../assets/images/products/large/10.png"),
      category: "beverages",
      subcategory: "tea_coffee",
      brand: "nestle"
    },

    // Beverages - Cold Drinks
    {
      id: 45,
      name: "Cola",
      unit: "500ml, Price per bottle",
      mrp: 2.49,
      sellingPrice: 1.99,
      image: require("../../assets/images/products/large/11.png"),
      category: "beverages",
      subcategory: "cold_drinks",
      brand: "local mart"
    },

    // Beverages - Juices
    {
      id: 16,
      name: "Fresh Orange Juice",
      unit: "1L, Price per bottle",
      mrp: 5.99,
      sellingPrice: 4.99,
      image: require("../../assets/images/products/large/04.png"),
      category: "beverages",
      subcategory: "juices",
      brand: "nestle"
    },
    {
      id: 46,
      name: "Apple Juice",
      unit: "500ml, Price per bottle",
      mrp: 3.99,
      sellingPrice: 3.49,
      image: require("../../assets/images/products/large/12.png"),
      category: "beverages",
      subcategory: "juices",
      brand: "nestle"
    },

    // Beverages - Energy Drinks
    {
      id: 47,
      name: "Energy Drink",
      unit: "250ml, Price per can",
      mrp: 3.49,
      sellingPrice: 2.99,
      image: require("../../assets/images/products/large/01.png"),
      category: "beverages",
      subcategory: "energy_drinks",
      brand: "local mart"
    },

    // Personal Care - Oral Care
    {
      id: 20,
      name: "Toothpaste",
      unit: "200g, Price per tube",
      mrp: 4.99,
      sellingPrice: 3.99,
      image: require("../../assets/images/products/large/08.png"),
      category: "personal_care",
      subcategory: "oral_care",
      brand: "hindustan unilever"
    },
    {
      id: 48,
      name: "Mouthwash",
      unit: "250ml, Price per bottle",
      mrp: 6.99,
      sellingPrice: 5.99,
      image: require("../../assets/images/products/large/02.png"),
      category: "personal_care",
      subcategory: "oral_care",
      brand: "hindustan unilever"
    },

    // Personal Care - Hair Care
    {
      id: 19,
      name: "Shampoo",
      unit: "400ml, Price per bottle",
      mrp: 8.99,
      sellingPrice: 7.49,
      image: require("../../assets/images/products/large/07.png"),
      category: "personal_care",
      subcategory: "hair_care",
      brand: "hindustan unilever"
    },
    {
      id: 49,
      name: "Conditioner",
      unit: "200ml, Price per bottle",
      mrp: 7.99,
      sellingPrice: 6.49,
      image: require("../../assets/images/products/large/03.png"),
      category: "personal_care",
      subcategory: "hair_care",
      brand: "hindustan unilever"
    },

    // Personal Care - Skin Care
    {
      id: 50,
      name: "Face Wash",
      unit: "100g, Price per tube",
      mrp: 5.99,
      sellingPrice: 4.99,
      image: require("../../assets/images/products/large/04.png"),
      category: "personal_care",
      subcategory: "skin_care",
      brand: "hindustan unilever"
    },
    {
      id: 51,
      name: "Body Lotion",
      unit: "200ml, Price per bottle",
      mrp: 6.99,
      sellingPrice: 5.49,
      image: require("../../assets/images/products/large/05.png"),
      category: "personal_care",
      subcategory: "skin_care",
      brand: "hindustan unilever"
    },

    // Personal Care - Hygiene
    {
      id: 52,
      name: "Hand Sanitizer",
      unit: "100ml, Price per bottle",
      mrp: 3.99,
      sellingPrice: 3.49,
      image: require("../../assets/images/products/large/06.png"),
      category: "personal_care",
      subcategory: "hygiene",
      brand: "patanjali"
    }
  ];

  // Filter and sort products
  const filteredAndSortedProducts = allProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedFilter === 'all' || product.category === selectedFilter;
      const matchesSubcategory = selectedSubcategory === 'all' || product.subcategory === selectedSubcategory;
      const matchesBrand = !searchParams.brand || product.brand.toLowerCase() === searchParams.brand.toLowerCase();
      const matchesPriceRange = product.sellingPrice >= filterOptions.priceRange.min && product.sellingPrice <= filterOptions.priceRange.max;
      const matchesFilterBrand = filterOptions.brand === 'all' || product.brand.toLowerCase() === filterOptions.brand.toLowerCase();

      return matchesSearch && matchesCategory && matchesSubcategory && matchesBrand && matchesPriceRange && matchesFilterBrand;
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
          return b.id - a.id; // Simulate popularity
        case 'newest':
          return b.id - a.id;
        default:
          return 0;
      }
    });

  const handleCategoryPress = (filter) => {
    setSelectedFilter(filter.id);
    setSelectedSubcategory('all'); // Reset subcategory when main category changes
    setShowCategories(false); // Hide categories after selection
  };

  const applyFilters = () => {
    setShowFilterModal(false);
  };

  const resetFilters = () => {
    setFilterOptions({
      category: 'all',
      priceRange: { min: 0, max: 50 },
      brand: 'all',
      discount: 0,
      organic: false,
      inStock: true,
      fastDelivery: false
    });
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

  // Initialize search based on navigation params
  useEffect(() => {
    if (searchParams.cat_id) {
      setSelectedFilter(searchParams.cat_id);
      setShowCategories(false); // Hide categories when coming from category selection
    } else {
      setShowCategories(true); // Show categories for general search
    }

    if (searchParams.brand) {
      setFilterOptions(prev => ({
        ...prev,
        brand: searchParams.brand.toLowerCase()
      }));
    }
  }, [searchParams]);

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
              data={[{ id: 'all', name: 'All', count: allProducts.filter(p => p.category === selectedFilter).length }, ...getCurrentSubcategories()]}
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

          {filteredAndSortedProducts.length > 0 ? (
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
                            priceRange: {...filterOptions.priceRange, min: Math.max(0, filterOptions.priceRange.min - 1)}
                          })}
                        >
                          <Text style={styles.sliderButtonText}>-</Text>
                        </TouchableOpacity>
                        <View style={styles.sliderTrack}>
                          <View
                            style={[
                              styles.sliderProgress,
                              { width: `${(filterOptions.priceRange.min / 50) * 100}%` }
                            ]}
                          />
                        </View>
                        <TouchableOpacity
                          style={styles.sliderButton}
                          onPress={() => setFilterOptions({
                            ...filterOptions,
                            priceRange: {...filterOptions.priceRange, min: Math.min(50, filterOptions.priceRange.min + 1)}
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
                            priceRange: {...filterOptions.priceRange, max: Math.max(0, filterOptions.priceRange.max - 1)}
                          })}
                        >
                          <Text style={styles.sliderButtonText}>-</Text>
                        </TouchableOpacity>
                        <View style={styles.sliderTrack}>
                          <View
                            style={[
                              styles.sliderProgress,
                              { width: `${(filterOptions.priceRange.max / 50) * 100}%` }
                            ]}
                          />
                        </View>
                        <TouchableOpacity
                          style={styles.sliderButton}
                          onPress={() => setFilterOptions({
                            ...filterOptions,
                            priceRange: {...filterOptions.priceRange, max: Math.min(50, filterOptions.priceRange.max + 1)}
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

  // Header Styles
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

  // Search Styles
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

  // Controls Styles
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

  // Section Styles
  sectionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.lg,
  },

  // Filter Styles
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

  // Subcategory Styles
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

  // Results Styles
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

  // No Results Styles
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

  // Modal Styles
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

  // Filter Modal Styles
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

  // Filter Section Styles
  filterSection: {
    marginBottom: theme.spacing['2xl'],
  },
  filterSectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: 'Outfit-SemiBold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },

  // Price Range Styles
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

  // Brand Options Styles
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


  // Discount Styles
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

  // Checkbox Styles
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
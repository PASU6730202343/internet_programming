import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Import ฟังก์ชัน apiCall จากไฟล์ services ที่สร้างไว้
import { apiCall } from '@/services/api';

export default function ProductsScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');

  // ดึงข้อมูลสินค้าจาก API เมื่อเปิดหน้าจอขึ้นมา
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setErrorMessage(null);
      // ดึงข้อมูลจาก Express API (/api/products)
      const data = await apiCall('/products');
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (error: any) {
      console.warn('⚠️ Fetch products failed:', error?.message || error);
      setErrorMessage('ไม่สามารถเชื่อมต่อ API Server ได้ โปรดเปิดใช้งาน node server.js');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
  };

  // กรองสินค้าตามคำค้นหา (รองรับทั้ง item_name, name, product_name)
  const filteredProducts = products.filter((item) => {
    const productName = item.item_name || item.name || item.product_name || '';
    return productName.toLowerCase().includes(search.toLowerCase());
  });

  const getValidImageUrl = (url?: string, itemId?: number | string) => {
    if (url && !url.includes('example.com')) {
      return url;
    }
    const defaultImages: { [key: string]: string } = {
      '4': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&auto=format&fit=crop&q=60',
      '5': 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format&fit=crop&q=60',
      '6': 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop&q=60',
    };
    return defaultImages[String(itemId)] || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&auto=format&fit=crop&q=60';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* --- ส่วนหัว / Header --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconButton}>
          <Ionicons name="menu" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Products</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity style={styles.headerIconButton} onPress={onRefresh}>
            <Ionicons name="refresh-outline" size={20} color="#A855F7" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileCircle}>
            <Ionicons name="person" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- แถบค้นหา และ ปุ่มกด / Search & Action Bar --- */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={18} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#8E8E93"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Product</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Filter</Text>
          <Ionicons name="caret-down" size={12} color="#A855F7" />
        </TouchableOpacity>
      </View>

      {/* --- รายการสินค้าจาก API / Products List --- */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A855F7" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : errorMessage && products.length === 0 ? (
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline-outline" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>ไม่สามารถเชื่อมต่อ API ได้</Text>
          <Text style={styles.errorSubtitle}>{errorMessage}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
            <Ionicons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.retryButtonText}>ลองใหม่อีกครั้ง</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.listContainer} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#A855F7']} tintColor="#A855F7" />
          }
        >
          {filteredProducts.map((item) => (
            <View key={item.item_id || item.id} style={styles.productCard}>
              
              {/* รูปภาพสินค้า (ใช้ image_url จาก Database) */}
              <Image 
                source={{ uri: getValidImageUrl(item.image_url || item.imageUrl, item.item_id || item.id) }} 
                style={styles.productImage} 
                resizeMode="cover"
              />

              {/* รายละเอียดสินค้า */}
              <View style={styles.productDetails}>
                <Text style={styles.stockText}>Stock: {item.stock_quantity ?? item.stock ?? 0} in stock</Text>
                <Text style={styles.infoText}>Brand: {item.brand || item.category || 'N/A'}</Text>
                <Text style={styles.infoText}>Price: ฿{item.price ?? 0}</Text>
                <Text style={styles.productName}>{item.item_name || item.name}</Text>
              </View>

              {/* ปุ่มสถานะ Active และลูกศร */}
              <View style={styles.rightActions}>
                <View style={styles.activeBadge}>
                  <Text style={styles.activeText}>Active</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#A855F7" style={styles.arrowIcon} />
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* --- แถบเมนูด้านล่าง / Bottom Tab Navigation --- */}
      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="home-outline" size={20} color="#8E8E93" />
          <Text style={[styles.tabLabel, { color: '#8E8E93' }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="add-outline" size={22} color="#8E8E93" />
          <Text style={[styles.tabLabel, { color: '#8E8E93' }]}>Add</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <MaterialCommunityIcons name="package-variant-closed" size={20} color="#A855F7" />
          <Text style={[styles.tabLabel, { color: '#A855F7' }]}>Products</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="folder-outline" size={20} color="#8E8E93" />
          <Text style={[styles.tabLabel, { color: '#8E8E93' }]}>Categories</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  headerIconButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#A855F7',
  },
  profileCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    padding: 0, 
  },
  addButton: {
    backgroundColor: '#A855F7',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 4,
  },
  filterButtonText: {
    color: '#A855F7',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#8E8E93',
    marginTop: 10,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorTitle: {
    color: '#F87171',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
  },
  errorSubtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A855F7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  productCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#262626',
  },
  productImage: {
    width: 68,
    height: 68,
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
    gap: 2,
    justifyContent: 'center',
  },
  stockText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  infoText: {
    color: '#6B7280',
    fontSize: 12,
  },
  productName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  rightActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 68,
    paddingVertical: 2,
  },
  activeBadge: {
    backgroundColor: '#A855F7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  activeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  arrowIcon: {
    marginTop: 'auto',
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#121212',
    borderTopWidth: 1,
    borderTopColor: '#1F1F1F',
    paddingVertical: 12,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
  },
});
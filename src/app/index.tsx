import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { apiCall } from '@/services/api';
import { ProductCard } from '../components/ProductCard';
import { AddModal, EditModal, ProductForm } from '../components/ProductModals';
import styles from '../styles/popArt.styles';
import { injectGlobalWebStyles } from '../utils/injectWebStyles';

// Inject CSS on web
injectGlobalWebStyles();

// ─── Default form state ───────────────────────────────────────────────────────
const EMPTY_FORM: ProductForm = {
  item_name: '',
  price: '',
  stock_quantity: '',
  brand: '',
  image_url: '',
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProductsScreen() {
  const { width: screenWidth } = useWindowDimensions();

  // Responsive columns: 1 col mobile, 2 tablet, 3 medium, 4 large
  const cardColumns =
    screenWidth < 480 ? 1 : screenWidth < 900 ? 2 : screenWidth < 1300 ? 3 : 4;
  const cardWidth = (screenWidth - 40 - (cardColumns - 1) * 20) / cardColumns;

  // ── Product state ──────────────────────────────────────────────────────────
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [failedImages, setFailedImages] = useState<{ [key: string]: boolean }>({});

  // ── Edit modal state ───────────────────────────────────────────────────────
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<ProductForm>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // ── Add modal state ────────────────────────────────────────────────────────
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [addForm, setAddForm] = useState<ProductForm>(EMPTY_FORM);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // ── Fetch products ─────────────────────────────────────────────────────────
  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setErrorMessage(null);
      const data = await apiCall('/products');
      setProducts(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.warn('⚠️ Fetch products failed:', error?.message || error);
      setErrorMessage('ไม่สามารถเชื่อมต่อ API Server ได้ โปรดเปิดใช้งาน node server.js');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => { setRefreshing(true); await fetchProducts(); };

  // ── Add handlers ───────────────────────────────────────────────────────────
  const openAddModal = () => { setAddForm(EMPTY_FORM); setIsAddModalOpen(true); };
  const closeAddModal = () => { setIsAddModalOpen(false); setIsAdding(false); };

  const handleSaveAdd = async () => {
    if (!addForm.item_name.trim()) { Alert.alert('ข้อผิดพลาด', 'กรุณาระบุชื่อสินค้า'); return; }
    try {
      setIsAdding(true);
      await apiCall('/products', {
        method: 'POST',
        body: JSON.stringify({
          item_name: addForm.item_name.trim(),
          price: parseFloat(addForm.price) || 0,
          stock_quantity: parseInt(addForm.stock_quantity, 10) || 0,
          brand: addForm.brand.trim(),
          image_url: addForm.image_url.trim(),
        }),
      });
      Alert.alert('สำเร็จ! 💥', 'เพิ่มสินค้าใหม่ลงในฐานข้อมูล MySQL เรียบร้อยแล้ว');
      closeAddModal();
      fetchProducts();
    } catch (error: any) {
      Alert.alert('เกิดข้อผิดพลาด', error?.message || 'ไม่สามารถเพิ่มสินค้าได้');
    } finally {
      setIsAdding(false);
    }
  };

  // ── Edit handlers ──────────────────────────────────────────────────────────
  const openEditModal = (item: any) => {
    setEditingItem(item);
    setEditForm({
      item_name: item.item_name || item.name || '',
      price: String(item.price ?? 0),
      stock_quantity: String(item.stock_quantity ?? item.stock ?? 0),
      brand: item.brand || item.category || '',
      image_url: item.image_url || item.imageUrl || '',
    });
  };
  const closeEditModal = () => { setEditingItem(null); setIsSaving(false); };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    const productId = editingItem.item_id || editingItem.id;
    if (!editForm.item_name.trim()) {
      const msg = 'กรุณาระบุชื่อสินค้า';
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert('ข้อผิดพลาด', msg);
      return;
    }
    try {
      setIsSaving(true);
      await apiCall(`/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({
          item_name: editForm.item_name.trim(),
          price: parseFloat(editForm.price) || 0,
          stock_quantity: parseInt(editForm.stock_quantity, 10) || 0,
          brand: editForm.brand.trim(),
          image_url: editForm.image_url.trim(),
        }),
      });
      closeEditModal();
      await fetchProducts();
    } catch (error: any) {
      const msg = error?.message || 'ไม่สามารถแก้ไขสินค้าได้';
      Platform.OS === 'web' ? window.alert('เกิดข้อผิดพลาด: ' + msg) : Alert.alert('เกิดข้อผิดพลาด', msg);
    } finally {
      setIsSaving(false);
    }
  };

  // ── Delete handler ─────────────────────────────────────────────────────────
  const handleDeleteProduct = (item: any) => {
    const productId = item.item_id || item.id;
    const productName = item.item_name || item.name || 'สินค้า';
    const doDelete = async () => {
      try {
        const res = await apiCall(`/products/${productId}`, { method: 'DELETE' });
        if (res?.success) alert('ลบสินค้าจากฐานข้อมูลเรียบร้อยแล้ว');
        fetchProducts();
      } catch (error: any) {
        alert(error?.message || 'ไม่สามารถลบสินค้าได้');
      }
    };
    if (Platform.OS === 'web') {
      if (window.confirm(`ต้องการลบ "${productName}" หรือไม่?`)) doDelete();
    } else {
      Alert.alert('ยืนยันการลบสินค้า', `ต้องการลบ "${productName}" หรือไม่?`, [
        { text: 'ยกเลิก', style: 'cancel' },
        { text: 'ลบสินค้า', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  // ── Image helpers ──────────────────────────────────────────────────────────
  const handleImageError = (itemId: string | number) =>
    setFailedImages((prev) => ({ ...prev, [String(itemId)]: true }));

  const getValidImageUrl = (url?: string, itemId?: number | string): string => {
    const key = String(itemId);
    const fallback = 'https://placehold.co/500x500/FF007F/FFFFFF.png?text=NO+IMAGE';
    if (failedImages[key]) return fallback;
    if (!url || !url.trim() || url.includes('example.com')) {
      return fallback;
    }
    const trimmed = url.trim();
    if (trimmed.includes('bing.com/images/search') && trimmed.includes('mediaurl=')) {
      const match = trimmed.match(/mediaurl=([^&]+)/i);
      if (match?.[1]) return decodeURIComponent(match[1]);
    }
    if (trimmed.includes('google.com/') && trimmed.includes('imgurl=')) {
      const match = trimmed.match(/imgurl=([^&]+)/i);
      if (match?.[1]) return decodeURIComponent(match[1]);
    }
    return trimmed;
  };

  // ── Filter products ────────────────────────────────────────────────────────
  const filteredProducts = products.filter((item) => {
    const name = (item.item_name || item.name || item.product_name || '').toLowerCase();
    const brand = (item.brand || item.category || '').toLowerCase();
    return name.includes(search.toLowerCase()) || brand.includes(search.toLowerCase());
  });

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFE600" />

      {/* Top Marquee Bar */}
      <View style={styles.topMarqueeBar}>
        <Text style={styles.marqueeText}>
          ⚡ PASU SHOP • 100% INTENSE SCENTS • FREE EXPRESS SHIPPING ON ALL ORDERS! ⚡
        </Text>
      </View>

      {/* Header / Navbar */}
      <ImageBackground
        source={require('../../assets/beach-header.png')}
        style={styles.header}
        resizeMode="cover"
        imageStyle={{ width: '100%', height: '100%' }}
      >
        <View style={styles.brandBadge}>
          <Text style={styles.brandTitle}>PASU</Text>
          <Text style={styles.brandSubtitle}>SHOP</Text>
        </View>

        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color="#000000" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#666666"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={onRefresh}>
            <Ionicons name="refresh" size={20} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addNavBtn} onPress={openAddModal}>
            <Ionicons name="add-circle-sharp" size={20} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.addNavBtnText}>+ ADD PRODUCT</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Main Scroll Content */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Product Grid */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF007F" />
            <Text style={styles.loadingText}>LOADING PRODUCTS FROM MYSQL...</Text>
          </View>
        ) : errorMessage && products.length === 0 ? (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={48} color="#FF007F" />
            <Text style={styles.errorTitle}>DATABASE CONNECTION ISSUE</Text>
            <Text style={styles.errorSubtitle}>{errorMessage}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
              <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.retryButtonText}>RETRY CONNECTION</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.productGrid}>
            {filteredProducts.map((item, index) => (
              <ProductCard
                key={item.item_id || item.id}
                item={item}
                index={index}
                cardWidth={cardWidth}
                getValidImageUrl={getValidImageUrl}
                onImageError={handleImageError}
                onEdit={openEditModal}
                onDelete={handleDeleteProduct}
              />
            ))}
          </View>
        )}

        {/* Creator Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>CREATOR</Text>
          <Text style={styles.sectionSubtitle}>The person behind PASU Shop</Text>
        </View>
        <View style={styles.reviewsGrid}>
          <View style={[styles.speechCard, { backgroundColor: '#FFE600', alignItems: 'center' }]}>
            <Text style={[styles.quoteText, { textAlign: 'center', fontSize: 18, letterSpacing: 2 }]}>
              ✨ CREATED BY ✨
            </Text>
            <View style={styles.userRow}>
              <View style={[styles.userAvatar, { backgroundColor: '#FF007F', width: 56, height: 56, borderRadius: 28 }]}>
                <Text style={[styles.userAvatarText, { fontSize: 20 }]}>PP</Text>
              </View>
              <View>
                <Text style={[styles.userName, { fontSize: 20, fontWeight: '900', color: '#000000' }]}>
                  Pasu Peryruthai
                </Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#333333', letterSpacing: 1 }}>
                  Developer & Designer
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <View style={styles.footerBrand}>
            <Text style={styles.footerTitle}>PASU SHOP</Text>
            <Text style={styles.footerSubtitle}>E-Commerce Powered by React Native & MySQL</Text>
          </View>
          <Text style={styles.footerCopy}>© 2026 PASU SHOP • ALL RIGHTS RESERVED</Text>
        </View>
      </ScrollView>

      {/* Add Modal */}
      <AddModal
        visible={isAddModalOpen}
        form={addForm}
        isLoading={isAdding}
        onClose={closeAddModal}
        onSave={handleSaveAdd}
        onChange={(field, value) => setAddForm((prev) => ({ ...prev, [field]: value }))}
      />

      {/* Edit Modal */}
      <EditModal
        visible={editingItem !== null}
        form={editForm}
        isSaving={isSaving}
        onClose={closeEditModal}
        onSave={handleSaveEdit}
        onChange={(field, value) => setEditForm((prev) => ({ ...prev, [field]: value }))}
      />
    </SafeAreaView>
  );
}
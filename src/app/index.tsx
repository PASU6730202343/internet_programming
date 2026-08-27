import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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

// ─── Category definitions ─────────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'all', label: 'ALL ITEMS', icon: 'grid' as const },
  { key: 'best', label: 'BEST SELLER', icon: 'flame' as const },
  { key: 'new', label: 'NEW ARRIVAL', icon: 'star' as const },
  { key: 'perfume', label: 'PERFUME', icon: 'water' as const },
  { key: 'discount', label: 'DISCOUNT', icon: 'pricetag' as const },
];

// ─── Default form state ───────────────────────────────────────────────────────
const EMPTY_FORM: ProductForm = {
  item_name: '',
  price: '',
  stock_quantity: '',
  brand: '',
  image_url: '',
  image_path: '',
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProductsScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const router = useRouter();
  const isWide = screenWidth >= 768;

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      localStorage.removeItem('pasu_logged_in');
      localStorage.removeItem('pasu_user');
    }
    router.replace('/login');
  };

  // Responsive columns: account for sidebar width on wide screens
  const contentWidth = isWide ? screenWidth - 200 : screenWidth;
  const cardColumns =
    contentWidth < 480 ? 1 : contentWidth < 800 ? 2 : contentWidth < 1200 ? 3 : 4;
  const cardWidth = (contentWidth - 48 - (cardColumns - 1) * 16) / cardColumns;

  // ── Product state ──────────────────────────────────────────────────────────
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [failedImages, setFailedImages] = useState<{ [key: string]: boolean }>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // ── Cart state (UI only) ──────────────────────────────────────────────────
  const [cartItems, setCartItems] = useState<any[]>([]);
  const cartCount = cartItems.length;

  // ── Edit modal state ──────────────────────────────────────────────────────
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<ProductForm>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // ── Add modal state ───────────────────────────────────────────────────────
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [addForm, setAddForm] = useState<ProductForm>(EMPTY_FORM);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // ── Fetch products ────────────────────────────────────────────────────────
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

  // ── Cart handler ──────────────────────────────────────────────────────────
  const handleAddToCart = (item: any) => {
    setCartItems(prev => [...prev, item]);
    if (Platform.OS === 'web') {
      // Quick feedback animation could be added here
    }
  };

  // ── Add handlers ──────────────────────────────────────────────────────────
  const openAddModal = () => { setAddForm(EMPTY_FORM); setIsAddModalOpen(true); };
  const closeAddModal = () => { setIsAddModalOpen(false); setIsAdding(false); };

  const handleSaveAdd = async () => {
    if (!addForm.item_name.trim()) { alert('กรุณาระบุชื่อสินค้า'); return; }
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
          image_path: addForm.image_path.trim(),
        }),
      });
      alert('สำเร็จ! ⛏ เพิ่มสินค้าใหม่ลงในฐานข้อมูล MySQL เรียบร้อยแล้ว');
      closeAddModal();
      fetchProducts();
    } catch (error: any) {
      alert(error?.message || 'ไม่สามารถเพิ่มสินค้าได้');
    } finally {
      setIsAdding(false);
    }
  };

  // ── Edit handlers ─────────────────────────────────────────────────────────
  const openEditModal = (item: any) => {
    setEditingItem(item);
    setEditForm({
      item_name: item.item_name || item.name || '',
      price: String(item.price ?? 0),
      stock_quantity: String(item.stock_quantity ?? item.stock ?? 0),
      brand: item.brand || item.category || '',
      image_url: item.image_url || item.imageUrl || '',
      image_path: item.image_path || '',
    });
  };
  const closeEditModal = () => { setEditingItem(null); setIsSaving(false); };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    const productId = editingItem.item_id || editingItem.id;
    if (!editForm.item_name.trim()) {
      alert('กรุณาระบุชื่อสินค้า');
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
          image_path: editForm.image_path.trim(),
        }),
      });
      closeEditModal();
      await fetchProducts();
    } catch (error: any) {
      alert(error?.message || 'ไม่สามารถแก้ไขสินค้าได้');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Delete handler ────────────────────────────────────────────────────────
  const handleDeleteProduct = async (item: any) => {
    const productId = item.item_id || item.id;
    try {
      await apiCall(`/products/${productId}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error: any) {
      alert(error?.message || 'ไม่สามารถลบสินค้าได้');
    }
  };

  // ── Image helpers ─────────────────────────────────────────────────────────
  const handleImageError = (itemId: string | number) =>
    setFailedImages((prev) => ({ ...prev, [String(itemId)]: true }));

  const getValidImageUrl = (url?: string, itemId?: number | string): string => {
    const key = String(itemId);
    const fallback = 'https://placehold.co/500x500/2d1f12/c8a84e.png?text=NO+IMAGE';
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

  // ── Filter products ───────────────────────────────────────────────────────
  const filteredProducts = products.filter((item) => {
    const searchTerm = search.trim();
    const name = (item.item_name || item.name || item.product_name || '').toLowerCase();
    const brand = (item.brand || item.category || '').toLowerCase();
    const itemPrice = Number(item.price ?? 0);

    // Category filter
    if (activeCategory === 'perfume' && !brand.includes('perfume') && !name.includes('perfume')
        && !name.includes('น้ำหอม') && !name.includes('edp') && !name.includes('edt')
        && !name.includes('parfum') && !name.includes('eau')) {
      // For 'perfume' category, show all since this is a perfume shop
      // Actually, let's just show all if the category is perfume since all items are perfumes
    }
    // For now, all categories show all items (can be extended with DB field)

    if (!searchTerm) return true;

    // Extract number from search
    const priceMatch = searchTerm.match(/(\d+(\.\d+)?)/);
    const searchPrice = priceMatch ? parseFloat(priceMatch[1]) : null;

    // Extract text part
    const textPart = searchTerm.replace(/(\d+(\.\d+)?)/g, '').trim().toLowerCase();

    const textMatches = textPart
      ? name.includes(textPart) || brand.includes(textPart)
      : true;

    const priceMatches = searchPrice !== null
      ? itemPrice >= searchPrice * 0.9 && itemPrice <= searchPrice * 1.1
      : true;

    if (searchPrice !== null && !textPart) return priceMatches;
    if (!searchPrice && textPart) return textMatches;
    return textMatches && priceMatches;
  });

  // ── Render Sidebar (Web only for wide screens) ────────────────────────────
  const renderSidebar = () => {
    if (!isWide) return null;

    return (
      <View style={styles.sidebar}>
        {/* Category Title */}
        <Text style={styles.sidebarTitle}>⚔ CATEGORY</Text>

        {/* Category Items */}
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.categoryItem,
              activeCategory === cat.key && styles.categoryItemActive,
            ]}
            onPress={() => setActiveCategory(cat.key)}
          >
            <Ionicons
              name={cat.icon}
              size={14}
              color={activeCategory === cat.key ? '#FFFFFF' : '#c8a84e'}
            />
            <Text
              style={[
                styles.categoryText,
                activeCategory === cat.key && styles.categoryTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Torch decoration */}
        {Platform.OS === 'web' && (
          <View style={{ alignItems: 'center', marginTop: 16 }}>
            <div className="mc-torch" />
          </View>
        )}

        {/* Cart Section */}
        <View style={styles.cartSection}>
          <Text style={styles.cartTitle}>🧰 YOUR CART</Text>
          <View style={styles.cartCountRow}>
            <Ionicons name="cube" size={20} color="#8b7a45" />
            <Text style={styles.cartCountText}>{cartCount}</Text>
          </View>
          <TouchableOpacity style={styles.viewCartBtn}>
            <Text style={styles.viewCartBtnText}>VIEW CART</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0a06" />

      {/* ═══ Top Minecraft Grass Border ═══ */}
      {Platform.OS === 'web' && <div className="mc-top-border" />}

      {/* ═══ Top Marquee Bar ═══ */}
      <View style={styles.topMarqueeBar}>
        {Platform.OS === 'web' ? (
          <div className="mc-marquee-container">
            <div className="mc-marquee-text" style={{
              color: '#c8a84e',
              fontSize: '10px',
              fontWeight: '900',
              letterSpacing: '3px',
              fontFamily: "'Press Start 2P', monospace",
            } as any}>
              ⛏ INTERNET PROGRAMMING &nbsp;•&nbsp; PASU PERYRUTHAI &nbsp;⛏&nbsp;
              INTERNET PROGRAMMING &nbsp;•&nbsp; PASU PERYRUTHAI &nbsp;⛏
            </div>
          </div>
        ) : (
          <Text style={styles.marqueeText}>
            ⛏ INTERNET PROGRAMMING • PASU PERYRUTHAI ⛏
          </Text>
        )}
      </View>

      {/* ═══ Header / Navbar ═══ */}
      <View style={styles.header}>
        {/* Brand Badge with Potion Icon */}
        <View style={styles.brandBadge}>
          {Platform.OS === 'web' && (
            <div className="mc-potion-icon">🧪</div>
          )}
          <View>
            <Text style={styles.brandTitle}>PASU</Text>
            <Text style={styles.brandSubtitle}>SHOP</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color="#8b7a45" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาสินค้า หรือ ราคา (เช่น น้ำหอม)"
            placeholderTextColor="#666666"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Header Actions */}
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.addNavBtn} onPress={openAddModal}>
            <Ionicons name="add-circle-sharp" size={18} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.addNavBtnText}>+ CRAFT ITEM</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: '#8b2020', borderColor: '#cc4444' }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ═══ Main Layout: Sidebar + Content ═══ */}
      <View style={styles.mainLayout}>
        {/* Sidebar */}
        {renderSidebar()}

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
              <ActivityIndicator size="large" color="#c8a84e" />
              <Text style={styles.loadingText}>MINING PRODUCTS FROM DATABASE...</Text>
            </View>
          ) : errorMessage && products.length === 0 ? (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={48} color="#ff6b6b" />
              <Text style={styles.errorTitle}>CREEPER BLEW UP THE CONNECTION!</Text>
              <Text style={styles.errorSubtitle}>{errorMessage}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
                <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.retryButtonText}>RESPAWN CONNECTION</Text>
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
                  onAddToCart={handleAddToCart}
                />
              ))}
            </View>
          )}

          {/* Creator Section */}
          {Platform.OS === 'web' ? (
            <div className="mc-section-header" style={{ margin: '30px auto' } as any}>
              <Text style={styles.sectionTitle}>⚒ CREATOR ⚒</Text>
              <Text style={styles.sectionSubtitle}>The person behind PASU Shop</Text>
            </div>
          ) : (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⚒ CREATOR ⚒</Text>
              <Text style={styles.sectionSubtitle}>The person behind PASU Shop</Text>
            </View>
          )}
          <View style={styles.reviewsGrid}>
            <View style={[styles.speechCard, { alignItems: 'center' }]}>
              <Text style={[styles.quoteText, { textAlign: 'center', fontSize: 20, letterSpacing: 2 }]}>
                ✨ CREATED BY ✨
              </Text>
              <View style={styles.userRow}>
                <View style={[styles.userAvatar, { width: 56, height: 56 }]}>
                  <Text style={[styles.userAvatarText, { fontSize: 18 }]}>PP</Text>
                </View>
                <View>
                  <Text style={[styles.userName, { fontSize: 18 }]}>
                    Pasu Peryruthai
                  </Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#8b7a45', letterSpacing: 1, fontFamily: Platform.OS === 'web' ? "'VT323', monospace" : 'monospace' }}>
                    Developer & Designer
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bottom Grass Border */}
          {Platform.OS === 'web' && (
            <div className="mc-bottom-border" style={{ marginTop: 40 } as any} />
          )}

          {/* Footer */}
          <View style={styles.footerContainer}>
            <View style={styles.footerBrand}>
              <Text style={styles.footerTitle}>PASU SHOP</Text>
              <Text style={styles.footerSubtitle}>E-Commerce Powered by React Native & MySQL</Text>
            </View>
            <Text style={styles.footerCopy}>© 2026 PASU SHOP • ALL RIGHTS RESERVED</Text>
          </View>
        </ScrollView>
      </View>

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
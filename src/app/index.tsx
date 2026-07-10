import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// ข้อมูลน้ำหอมพร้อมรูปภาพ
const PERFUME_DATA = [
  { 
    id: '1', 
    name: 'Midnight Oud Parfum', 
    stock: 8, 
    category: 'Perfume', 
    locations: 2,
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&auto=format&fit=crop&q=60'
  },
  { 
    id: '2', 
    name: 'Ocean Breeze Eau De Toilette', 
    stock: 15, 
    category: 'Perfume', 
    locations: 3,
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format&fit=crop&q=60'
  },
  { 
    id: '3', 
    name: 'Rose Noir Luxury Edition', 
    stock: 5, 
    category: 'Perfume', 
    locations: 1,
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop&q=60'
  },
];

export default function ProductsScreen() {
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* ตั้งค่าแถบเวลา/แบตเตอรี่ด้านบนสุดของมือถือให้เป็นธีมมืด */}
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* --- ส่วนหัว / Header --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconButton}>
          <Ionicons name="menu" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity style={styles.profileCircle}>
          <Ionicons name="person" size={16} color="#FFFFFF" />
        </TouchableOpacity>
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

      {/* --- รายการสินค้าน้ำหอม / Perfume List --- */}
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {PERFUME_DATA.map((item) => (
          <View key={item.id} style={styles.productCard}>
            
            {/* กล่องใส่รูปน้ำหอม */}
            <Image 
              source={{ uri: item.imageUrl }} 
              style={styles.productImage} 
              resizeMode="cover"
            />

            {/* รายละเอียดข้อความด้านใน */}
            <View style={styles.productDetails}>
              <Text style={styles.stockText}>Stock: {item.stock} in stock</Text>
              <Text style={styles.infoText}>Category: {item.category}</Text>
              <Text style={styles.infoText}>Location: {item.locations} stores</Text>
              <Text style={styles.productName}>{item.name}</Text>
            </View>

            {/* ปุ่มสถานะ Active และลูกศรชี้ขวา */}
            <View style={styles.rightActions}>
              <View style={styles.activeBadge}>
                <Text style={styles.activeText}>Active</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#A855F7" style={styles.arrowIcon} />
            </View>
          </View>
        ))}
      </ScrollView>

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
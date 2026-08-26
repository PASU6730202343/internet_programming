import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles/popArt.styles';

interface ProductCardProps {
  item: any;
  index: number;
  cardWidth: number;
  getValidImageUrl: (url?: string, id?: number | string) => string;
  onImageError: (id: string | number) => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onAddToCart?: (item: any) => void;
}

export function ProductCard({
  item,
  index,
  cardWidth,
  getValidImageUrl,
  onImageError,
  onEdit,
  onDelete,
  onAddToCart,
}: ProductCardProps) {
  const stock = item.stock_quantity ?? item.stock ?? 0;

  // Web-only: wrap card in a div with hover class
  const cardContent = (
    <View style={[styles.productCard, { width: cardWidth }]}>
      {/* Admin Overlay (edit/delete) — visible on hover via CSS */}
      {Platform.OS === 'web' && (
        <div className="card-admin-overlay" style={{
          position: 'absolute', top: 8, right: 8,
          display: 'flex', gap: '4px', zIndex: 5,
        } as any}>
          <TouchableOpacity
            style={styles.adminBtn}
            onPress={() => onEdit(item)}
          >
            <Ionicons name="construct" size={14} color="#c8a84e" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.adminBtn, styles.adminDeleteBtn]}
            onPress={() => onDelete(item)}
          >
            <Ionicons name="trash" size={14} color="#ff6b6b" />
          </TouchableOpacity>
        </div>
      )}

      {/* Product Image */}
      <View style={styles.cardImageWrapper}>
        {Platform.OS === 'web' && (
          <div className="card-image-deco" style={{
            position: 'absolute', inset: 0,
          } as any} />
        )}
        <Image
          source={{ uri: getValidImageUrl(item.image_url || item.imageUrl, item.item_id || item.id) }}
          style={styles.cardImage}
          resizeMode="contain"
          onError={() => onImageError(item.item_id || item.id)}
        />
      </View>

      {/* Card Body */}
      <View style={styles.cardBody}>
        {/* Product Name */}
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.item_name || item.name}
        </Text>

        {/* Brand / Category */}
        <Text style={styles.cardBrandText}>
          {item.brand || 'PASU SHOP'}
        </Text>

        {/* Star rating row */}
        <View style={styles.cardStarRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Ionicons key={s} name="star" size={14} color="#FFD700" />
          ))}
        </View>

        {/* Divider */}
        <View style={styles.cardDivider} />

        {/* Price + Add to Cart Row */}
        <View style={styles.cardBottomRow}>
          <View style={styles.cardPriceSection}>
            <View style={{
              width: 16, height: 16, borderRadius: 8,
              backgroundColor: '#FFD700', borderWidth: 2, borderColor: '#B8860B',
            }} />
            <Text style={styles.cardPriceText}>
              {Number(item.price ?? 0).toLocaleString()}
            </Text>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={() => onAddToCart ? onAddToCart(item) : onEdit(item)}
          >
            <Ionicons name="cart" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Stock badge */}
        <View style={styles.cardStockBadge}>
          <Ionicons name="cube-outline" size={10} color="#8b7a45" />
          <Text style={styles.cardStockText}>STOCK: {stock}</Text>
        </View>
      </View>

      {/* Native: show edit/delete as regular buttons */}
      {Platform.OS !== 'web' && (
        <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: 14, paddingBottom: 14 }}>
          <TouchableOpacity style={[styles.cardActionBtn, { flex: 1, alignItems: 'center' as const }]} onPress={() => onEdit(item)}>
            <Ionicons name="construct" size={14} color="#c8a84e" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.cardActionBtn, styles.cardDeleteBtn, { flex: 1, alignItems: 'center' as const }]} onPress={() => onDelete(item)}>
            <Ionicons name="trash" size={14} color="#ff6b6b" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  // On web, wrap in a div with hover class
  if (Platform.OS === 'web') {
    return (
      <div className="pop-card-hover" style={{ position: 'relative' } as any}>
        {cardContent}
      </div>
    );
  }

  return cardContent;
}

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles/popArt.styles';

interface ProductCardProps {
  item: any;
  index: number;
  cardWidth: number;
  getValidImageUrl: (url?: string, id?: number | string) => string;
  onImageError: (id: string | number) => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}

const CARD_COLORS = ['#FFE600', '#00F0FF', '#FF007F', '#00FF66', '#FF5500'];

export function ProductCard({
  item,
  index,
  cardWidth,
  getValidImageUrl,
  onImageError,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const headerBg = CARD_COLORS[index % CARD_COLORS.length];
  const isDarkHeader = headerBg === '#FF007F' || headerBg === '#FF5500';

  return (
    <View style={[styles.productCard, { width: cardWidth }]}>
      {/* Card Header */}
      <View style={[styles.cardHeader, { backgroundColor: headerBg }]}>
        <Text style={[styles.cardHeaderBrand, isDarkHeader && { color: '#FFFFFF' }]}>
          {item.brand || 'PASU SHOP'}
        </Text>
        <View style={styles.stockBadge}>
          <Text style={styles.stockBadgeText}>STOCK: {item.stock_quantity ?? item.stock ?? 0}</Text>
        </View>
      </View>

      {/* Product Image */}
      <View style={styles.cardImageWrapper}>
        <Image
          source={{ uri: getValidImageUrl(item.image_url || item.imageUrl, item.item_id || item.id) }}
          style={styles.cardImage}
          resizeMode="contain"
          onError={() => onImageError(item.item_id || item.id)}
        />
        <View style={styles.starSticker}>
          <Text style={styles.starStickerText}>PASU</Text>
        </View>
      </View>

      {/* Card Body */}
      <View style={styles.cardBody}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.item_name || item.name}
        </Text>

        <View style={styles.priceRow}>
          <View style={styles.priceTag}>
            <Text style={styles.priceTagText}>฿{Number(item.price ?? 0).toLocaleString()}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.cardActionRow}>
          <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item)}>
            <Ionicons name="pencil" size={14} color="#000000" style={{ marginRight: 4 }} />
            <Text style={styles.editBtnText}>EDIT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item)}>
            <Ionicons name="trash-outline" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.deleteBtnText}>DELETE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

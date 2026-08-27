import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { uploadImage } from '../services/api';
import styles from '../styles/popArt.styles';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProductForm {
  item_name: string;
  price: string;
  stock_quantity: string;
  brand: string;
  image_url: string;
  image_path: string;
}

// ─── Image Field (image_url แบบพิมพ์เอง + image_path แบบอัปโหลดไฟล์จริง) ──────

interface ImageFieldProps {
  urlValue: string;
  onUrlChange: (url: string) => void;
  pathValue: string;
  onPathChange: (path: string) => void;
}

function ImageField({ urlValue, onUrlChange, pathValue, onPathChange }: ImageFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const doUpload = async (file: Blob | { uri: string; name: string; type: string }) => {
    try {
      setIsUploading(true);
      const result = await uploadImage(file);
      onPathChange(result.url);
    } catch (error: any) {
      alert(error?.message || 'ไม่สามารถอัปโหลดรูปภาพได้');
    } finally {
      setIsUploading(false);
    }
  };

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      fileInputRef.current?.click();
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('กรุณาอนุญาตการเข้าถึงรูปภาพเพื่ออัปโหลด');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    const filename = asset.uri.split('/').pop() || `photo-${Date.now()}.jpg`;
    const ext = filename.split('.').pop()?.toLowerCase();
    const type = asset.mimeType || (ext ? `image/${ext === 'jpg' ? 'jpeg' : ext}` : 'image/jpeg');

    await doUpload({ uri: asset.uri, name: filename, type });
  };

  const handleWebFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) doUpload(file);
    e.target.value = '';
  };

  return (
    <>
      <Text style={styles.fieldLabel}>IMAGE URL</Text>
      <TextInput
        style={styles.textInput}
        value={urlValue}
        onChangeText={onUrlChange}
        placeholder="https://images.unsplash.com/..."
        placeholderTextColor="#999999"
      />

      <Text style={styles.fieldLabel}>UPLOAD IMAGE FILE</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <TextInput
          style={[styles.textInput, { flex: 1 }]}
          value={pathValue}
          onChangeText={onPathChange}
          placeholder="เลือกไฟล์รูปภาพจากเครื่อง..."
          placeholderTextColor="#999999"
        />
        <TouchableOpacity
          onPress={pickImage}
          disabled={isUploading}
          style={{
            width: 44,
            height: 44,
            borderRadius: 8,
            backgroundColor: '#3d6b35',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="image" size={20} color="#7fff00" />
          )}
        </TouchableOpacity>
      </View>

      {Platform.OS === 'web' && (
        <input
          ref={fileInputRef as any}
          type="file"
          accept="image/*"
          onChange={handleWebFileChange as any}
          style={{ display: 'none' } as any}
        />
      )}

      {!!(pathValue || urlValue) && (
        <Image
          source={{ uri: pathValue || urlValue }}
          style={{ width: 64, height: 64, borderRadius: 8, marginTop: 8 }}
          resizeMode="cover"
        />
      )}
    </>
  );
}

// ─── Add Product Modal ────────────────────────────────────────────────────────

interface AddModalProps {
  visible: boolean;
  form: ProductForm;
  isLoading: boolean;
  onClose: () => void;
  onSave: () => void;
  onChange: (field: keyof ProductForm, value: string) => void;
}

export function AddModal({ visible, form, isLoading, onClose, onSave, onChange }: AddModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContent}
        >
          <View style={[styles.modalHeader, { backgroundColor: '#3d6b35' }]}>
            <Text style={[styles.modalTitle, { color: '#7fff00' }]}>⛏ CRAFT NEW ITEM</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close-circle" size={28} color="#c8a84e" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.fieldLabel}>PRODUCT NAME *</Text>
            <TextInput
              style={styles.textInput}
              value={form.item_name}
              onChangeText={(t) => onChange('item_name', t)}
              placeholder="e.g. Sauvage Eau de Parfum"
              placeholderTextColor="#999999"
            />

            <View style={styles.formRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>PRICE (THB) *</Text>
                <TextInput
                  style={styles.textInput}
                  value={form.price}
                  onChangeText={(t) => onChange('price', t)}
                  keyboardType="numeric"
                  placeholder="6250"
                  placeholderTextColor="#999999"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>STOCK QTY *</Text>
                <TextInput
                  style={styles.textInput}
                  value={form.stock_quantity}
                  onChangeText={(t) => onChange('stock_quantity', t)}
                  keyboardType="numeric"
                  placeholder="12"
                  placeholderTextColor="#999999"
                />
              </View>
            </View>

            <Text style={styles.fieldLabel}>BRAND / CATEGORY</Text>
            <TextInput
              style={styles.textInput}
              value={form.brand}
              onChangeText={(t) => onChange('brand', t)}
              placeholder="e.g. Dior / Chanel / YSL"
              placeholderTextColor="#999999"
            />

            <ImageField
              urlValue={form.image_url}
              onUrlChange={(url) => onChange('image_url', url)}
              pathValue={form.image_path}
              onPathChange={(path) => onChange('image_path', path)}
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelActionBtn} onPress={onClose}>
              <Text style={styles.cancelActionText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveActionBtn} onPress={onSave} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveActionText}>+ INSERT TO MYSQL</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

// ─── Edit Product Modal ───────────────────────────────────────────────────────

interface EditModalProps {
  visible: boolean;
  form: ProductForm;
  isSaving: boolean;
  onClose: () => void;
  onSave: () => void;
  onChange: (field: keyof ProductForm, value: string) => void;
}

export function EditModal({ visible, form, isSaving, onClose, onSave, onChange }: EditModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContent}
        >
          <View style={[styles.modalHeader, { backgroundColor: '#8b6914' }]}>
            <Text style={styles.modalTitle}>✏ EDIT PRODUCT</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close-circle" size={28} color="#c8a84e" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.fieldLabel}>PRODUCT NAME *</Text>
            <TextInput
              style={styles.textInput}
              value={form.item_name}
              onChangeText={(t) => onChange('item_name', t)}
              placeholder="Product Name"
              placeholderTextColor="#999999"
            />

            <View style={styles.formRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>PRICE (THB) *</Text>
                <TextInput
                  style={styles.textInput}
                  value={form.price}
                  onChangeText={(t) => onChange('price', t)}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#999999"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>STOCK QTY *</Text>
                <TextInput
                  style={styles.textInput}
                  value={form.stock_quantity}
                  onChangeText={(t) => onChange('stock_quantity', t)}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#999999"
                />
              </View>
            </View>

            <Text style={styles.fieldLabel}>BRAND / CATEGORY</Text>
            <TextInput
              style={styles.textInput}
              value={form.brand}
              onChangeText={(t) => onChange('brand', t)}
              placeholder="Brand"
              placeholderTextColor="#999999"
            />

            <ImageField
              urlValue={form.image_url}
              onUrlChange={(url) => onChange('image_url', url)}
              pathValue={form.image_path}
              onPathChange={(path) => onChange('image_path', path)}
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelActionBtn} onPress={onClose}>
              <Text style={styles.cancelActionText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveActionBtn, { backgroundColor: '#00F0FF' }]}
              onPress={onSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <Text style={[styles.saveActionText, { color: '#000000' }]}>UPDATE MYSQL</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../styles/popArt.styles';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProductForm {
  item_name: string;
  price: string;
  stock_quantity: string;
  brand: string;
  image_url: string;
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

            <Text style={styles.fieldLabel}>IMAGE URL</Text>
            <TextInput
              style={styles.textInput}
              value={form.image_url}
              onChangeText={(t) => onChange('image_url', t)}
              placeholder="https://images.unsplash.com/..."
              placeholderTextColor="#999999"
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

            <Text style={styles.fieldLabel}>IMAGE URL</Text>
            <TextInput
              style={styles.textInput}
              value={form.image_url}
              onChangeText={(t) => onChange('image_url', t)}
              placeholder="https://..."
              placeholderTextColor="#999999"
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

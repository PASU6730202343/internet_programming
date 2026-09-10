import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { ElbowChart } from '@/components/charts/ElbowChart';
import { ScatterChart, type ScatterPoint } from '@/components/charts/ScatterChart';
import { CHART, CLUSTER_COLORS, CLUSTER_LABEL_TH } from '@/components/charts/chart-tokens';
import { apiCall } from '@/services/api';
import { styles } from '@/styles/dashboard.styles';

type ClusteredProduct = {
  item_id: number | string;
  item_name: string;
  price: number;
  stock_quantity: number;
  cluster: number;
  cluster_label: string;
};

type ClusterSummary = {
  cluster: number;
  cluster_label: string;
  count: number;
  avg_price: number;
  min_price: number;
  max_price: number;
  avg_stock: number;
};

type ElbowPoint = { k: number; inertia: number };

export default function DashboardScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();

  const [products, setProducts] = useState<ClusteredProduct[]>([]);
  const [summary, setSummary] = useState<ClusterSummary[]>([]);
  const [elbow, setElbow] = useState<ElbowPoint[]>([]);
  const [selectedK, setSelectedK] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchClusters();
  }, []);

  const fetchClusters = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const data = await apiCall('/products/clusters');
      setProducts(Array.isArray(data?.products) ? data.products : []);
      setSummary(Array.isArray(data?.summary) ? data.summary : []);
      setElbow(Array.isArray(data?.elbow) ? data.elbow : []);
      setSelectedK(data?.k || 3);
    } catch (error: any) {
      console.warn('⚠️ Fetch clusters failed:', error?.message || error);
      setErrorMessage('ไม่สามารถเชื่อมต่อ API Server ได้ โปรดเปิดใช้งาน node server.js');
    } finally {
      setLoading(false);
    }
  };

  const chartWidth = Math.min(screenWidth, 1080) - 40 - 40; // page padding + card padding
  const sortedProducts = [...products].sort((a, b) => Number(a.price) - Number(b.price));

  const scatterPoints: ScatterPoint[] = products.map((p) => ({
    id: p.item_id,
    x: Number(p.price),
    y: Number(p.stock_quantity) || 0,
    label: p.item_name,
    cluster: p.cluster_label,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>K-Means Price Dashboard</Text>
          <Text style={styles.headerSubtitle}>จัดกลุ่มสินค้าตามราคาด้วย K-means clustering</Text>
        </View>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/')}>
          <Ionicons name="arrow-back" size={16} color="#0b0b0b" />
          <Text style={styles.backBtnText}>กลับไปหน้าร้าน</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2a78d6" />
            <Text style={styles.loadingText}>กำลังประมวลผล K-means...</Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={40} color="#e34948" />
            <Text style={styles.errorTitle}>เชื่อมต่อ API ไม่สำเร็จ</Text>
            <Text style={styles.errorSubtitle}>{errorMessage}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchClusters}>
              <Ionicons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.retryButtonText}>ลองใหม่</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* KPI summary cards */}
            <View>
              <Text style={styles.sectionTitle}>สรุปแต่ละกลุ่ม</Text>
              <Text style={styles.sectionCaption}>จำนวนสินค้า ราคาเฉลี่ย และช่วงราคาของแต่ละกลุ่ม</Text>
              <View style={styles.summaryRow}>
                {summary.map((s) => {
                  const color = CLUSTER_COLORS[s.cluster_label] || CHART.muted;
                  return (
                    <View key={s.cluster} style={[styles.summaryCard, { borderLeftColor: color }]}>
                      <Text style={[styles.summaryLabel, { color }]}>
                        {CLUSTER_LABEL_TH[s.cluster_label] || s.cluster_label.toUpperCase()}
                      </Text>
                      <Text style={styles.summaryValue}>{s.count} รายการ</Text>
                      <Text style={styles.summaryMeta}>เฉลี่ย {Math.round(s.avg_price).toLocaleString()} บาท</Text>
                      <Text style={styles.summaryMeta}>
                        ช่วงราคา {Math.round(s.min_price).toLocaleString()} - {Math.round(s.max_price).toLocaleString()} บาท
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Elbow method */}
            {elbow.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>Elbow Method</Text>
                <Text style={styles.sectionCaption}>หาจำนวนกลุ่ม (k) ที่เหมาะสมจากจุดที่กราฟเริ่ม "หักศอก"</Text>
                <View style={styles.card}>
                  <ElbowChart data={elbow} selectedK={selectedK} width={chartWidth} />
                </View>
              </View>
            )}

            {/* Scatter plot */}
            <View>
              <Text style={styles.sectionTitle}>การกระจายตัวของสินค้า</Text>
              <Text style={styles.sectionCaption}>
                ตำแหน่งตามราคา (แกน X) และจำนวนสต็อก (แกน Y) — สีแสดงกลุ่มที่ได้จากการจัดกลุ่มตามราคา
              </Text>
              <View style={styles.card}>
                <ScatterChart points={scatterPoints} width={chartWidth} />
              </View>
            </View>

            {/* Cluster characteristics table */}
            <View>
              <Text style={styles.sectionTitle}>ลักษณะของแต่ละกลุ่ม</Text>
              <View style={styles.table}>
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.tableHeaderCell, { flex: 1.4 }]}>กลุ่ม</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1.4 }]}>ช่วงราคา (บาท)</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>ราคาเฉลี่ย</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>สต็อกเฉลี่ย</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 0.7 }]}>จำนวน</Text>
                </View>
                {summary.map((s) => {
                  const color = CLUSTER_COLORS[s.cluster_label] || CHART.muted;
                  return (
                    <View key={s.cluster} style={styles.tableRow}>
                      <View style={{ flex: 1.4 }}>
                        <View style={styles.clusterBadge}>
                          <View style={[styles.clusterDot, { backgroundColor: color }]} />
                          <Text style={[styles.clusterBadgeText, { color }]}>
                            {(CLUSTER_LABEL_TH[s.cluster_label] || s.cluster_label).split(' ')[0]}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.tableCellSecondary, { flex: 1.4 }]}>
                        {Math.round(s.min_price).toLocaleString()} - {Math.round(s.max_price).toLocaleString()}
                      </Text>
                      <Text style={[styles.tableCellSecondary, { flex: 1 }]}>{Math.round(s.avg_price).toLocaleString()}</Text>
                      <Text style={[styles.tableCellSecondary, { flex: 1 }]}>{Math.round(s.avg_stock).toLocaleString()}</Text>
                      <Text style={[styles.tableCellSecondary, { flex: 0.7 }]}>{s.count}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Full data table */}
            <View>
              <Text style={styles.sectionTitle}>ข้อมูลสินค้าทั้งหมด</Text>
              <View style={styles.table}>
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.tableHeaderCell, { flex: 2.2 }]}>สินค้า</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>ราคา</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>สต็อก</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>กลุ่ม</Text>
                </View>
                {sortedProducts.map((item) => {
                  const color = CLUSTER_COLORS[item.cluster_label] || CHART.muted;
                  return (
                    <View key={item.item_id} style={styles.tableRow}>
                      <Text style={[styles.tableCell, { flex: 2.2 }]} numberOfLines={1}>
                        {item.item_name}
                      </Text>
                      <Text style={[styles.tableCellSecondary, { flex: 1 }]}>{Math.round(Number(item.price)).toLocaleString()}</Text>
                      <Text style={[styles.tableCellSecondary, { flex: 1 }]}>{item.stock_quantity ?? '-'}</Text>
                      <View style={{ flex: 1.2 }}>
                        <View style={styles.clusterBadge}>
                          <View style={[styles.clusterDot, { backgroundColor: color }]} />
                          <Text style={[styles.clusterBadgeText, { color }]}>
                            {(CLUSTER_LABEL_TH[item.cluster_label] || item.cluster_label).split(' ')[0]}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

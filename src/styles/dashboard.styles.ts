import { Platform, StyleSheet } from 'react-native';

const SANS = Platform.OS === 'web' ? "system-ui, -apple-system, 'Segoe UI', sans-serif" : undefined;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Platform.OS === 'web' ? ('100vh' as any) : '100%',
    backgroundColor: '#f9f9f7', // page plane
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
    gap: 20,
    maxWidth: 1080,
    width: '100%' as any,
    alignSelf: 'center' as const,
  },

  // ── Header ─────────────────────────────────────────────────
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(11,11,11,0.10)',
    flexWrap: 'wrap' as const,
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#0b0b0b',
    fontFamily: SANS,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#52514e',
    marginTop: 2,
    fontFamily: SANS,
  },
  backBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(11,11,11,0.10)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  backBtnText: {
    color: '#0b0b0b',
    fontSize: 13,
    fontWeight: '600' as const,
    fontFamily: SANS,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: '#0b0b0b',
    fontFamily: SANS,
    marginBottom: 4,
  },
  sectionCaption: {
    fontSize: 13,
    color: '#52514e',
    fontFamily: SANS,
    marginBottom: 14,
  },

  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(11,11,11,0.10)',
    borderRadius: 8,
    padding: 20,
  },

  // ── Summary / stat tiles ───────────────────────────────────
  summaryRow: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 14,
  },
  summaryCard: {
    flex: 1,
    minWidth: 220,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(11,11,11,0.10)',
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 16,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    fontFamily: SANS,
    marginBottom: 10,
    textTransform: 'uppercase' as const,
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: '#0b0b0b',
    fontFamily: SANS,
  },
  summaryMeta: {
    fontSize: 13,
    color: '#52514e',
    fontFamily: SANS,
    marginTop: 4,
  },

  // ── Table ──────────────────────────────────────────────────
  table: {
    borderWidth: 1,
    borderColor: 'rgba(11,11,11,0.10)',
    borderRadius: 8,
    overflow: 'hidden' as const,
  },
  tableHeaderRow: {
    flexDirection: 'row' as const,
    backgroundColor: '#f9f9f7',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#898781',
    fontFamily: SANS,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.4,
  },
  tableRow: {
    flexDirection: 'row' as const,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: '#e1e0d9',
    alignItems: 'center' as const,
  },
  tableCell: {
    fontSize: 13,
    color: '#0b0b0b',
    fontFamily: SANS,
  },
  tableCellSecondary: {
    fontSize: 13,
    color: '#52514e',
    fontFamily: SANS,
    fontVariant: ['tabular-nums'] as any,
  },
  clusterBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    alignSelf: 'flex-start' as const,
  },
  clusterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  clusterBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    fontFamily: SANS,
  },

  // ── Loading / Error ────────────────────────────────────────
  loadingContainer: {
    alignItems: 'center' as const,
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#52514e',
    marginTop: 12,
    fontFamily: SANS,
  },
  errorContainer: {
    alignItems: 'center' as const,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e34948',
    padding: 30,
    borderRadius: 8,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: '#e34948',
    marginTop: 10,
    fontFamily: SANS,
    textAlign: 'center' as const,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#52514e',
    marginVertical: 8,
    textAlign: 'center' as const,
    fontFamily: SANS,
  },
  retryButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#2a78d6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700' as const,
    fontFamily: SANS,
  },
});

export default styles;

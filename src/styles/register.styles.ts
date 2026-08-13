import { Platform, StyleSheet } from 'react-native';

const registerStyles = StyleSheet.create({
  // ─── Layout ────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    height: Platform.OS === 'web' ? ('100vh' as any) : '100%',
  },

  // ─── Top Bar ───────────────────────────────────────────────
  topBar: {
    backgroundColor: '#00A8CC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center' as const,
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
  },
  topBarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900' as const,
    letterSpacing: 2,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 24,
    position: 'relative' as const,
    overflow: 'hidden' as const,
  },

  // ─── Decorative Circles ────────────────────────────────────
  decoCircle1: {
    position: 'absolute' as const,
    top: -50,
    left: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#00A8CC',
    opacity: 0.12,
  },
  decoCircle2: {
    position: 'absolute' as const,
    bottom: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFE600',
    opacity: 0.1,
  },

  // ─── Brand ─────────────────────────────────────────────────
  brandContainer: {
    alignItems: 'center' as const,
    marginBottom: 24,
  },
  logoBadge: {
    backgroundColor: '#00A8CC',
    borderWidth: 4,
    borderColor: '#FFE600',
    paddingHorizontal: 28,
    paddingVertical: 8,
    transform: [{ rotate: '2deg' }],
    marginBottom: 14,
    shadowColor: '#00A8CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: {
    color: '#FFE600',
    fontSize: 32,
    fontWeight: '900' as const,
    letterSpacing: 4,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  logoSubText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900' as const,
    letterSpacing: 6,
    textAlign: 'center' as const,
    marginTop: -2,
  },
  welcomeText: {
    color: '#00F0FF',
    fontSize: 20,
    fontWeight: '900' as const,
    letterSpacing: 3,
    textShadowColor: 'rgba(0,240,255,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  welcomeSub: {
    color: '#AABBCC',
    fontSize: 13,
    fontWeight: '600' as const,
    marginTop: 4,
  },

  // ─── Register Card ─────────────────────────────────────────
  registerCard: {
    width: '100%' as any,
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#000000',
    borderRadius: 16,
    overflow: 'hidden' as const,
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 10,
  },
  cardHeaderStripe: {
    backgroundColor: '#00F0FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#000000',
  },
  cardHeaderText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '900' as const,
    letterSpacing: 2,
    textAlign: 'center' as const,
  },
  cardBody: {
    padding: 22,
  },

  // ─── Error / Success ──────────────────────────────────────
  errorBox: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#FFF0F4',
    borderWidth: 2,
    borderColor: '#FF007F',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    gap: 8,
  },
  errorText: {
    color: '#FF007F',
    fontSize: 13,
    fontWeight: '700' as const,
    flex: 1,
  },
  successBox: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#F0FFF4',
    borderWidth: 2,
    borderColor: '#00CC66',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    gap: 8,
  },
  successText: {
    color: '#00883B',
    fontSize: 13,
    fontWeight: '700' as const,
    flex: 1,
  },

  // ─── Fields ────────────────────────────────────────────────
  fieldLabel: {
    fontSize: 11,
    fontWeight: '900' as const,
    color: '#000000',
    marginBottom: 5,
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#FFFDF0',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'web' ? 10 : 8,
    marginBottom: 14,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#000000',
    outlineStyle: 'none' as any,
  },

  // ─── Register Button ──────────────────────────────────────
  registerBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#00A8CC',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 6,
    marginBottom: 14,
    shadowColor: '#00A8CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  registerBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900' as const,
    letterSpacing: 1,
  },

  // ─── Divider ───────────────────────────────────────────────
  divider: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    color: '#999999',
    fontSize: 12,
    fontWeight: '700' as const,
    marginHorizontal: 12,
  },

  // ─── Login Link ────────────────────────────────────────────
  loginLinkBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#FF007F',
    borderRadius: 10,
    paddingVertical: 12,
  },
  loginLinkText: {
    color: '#FF007F',
    fontSize: 14,
    fontWeight: '900' as const,
    letterSpacing: 0.5,
  },

  // ─── Footer ────────────────────────────────────────────────
  footerText: {
    color: '#556677',
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1,
    marginTop: 24,
    textAlign: 'center' as const,
  },
});

export default registerStyles;

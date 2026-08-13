import { Platform, StyleSheet } from 'react-native';

const loginStyles = StyleSheet.create({
  // ─── Layout ────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    height: Platform.OS === 'web' ? ('100vh' as any) : '100%',
  },

  // ─── Top Bar ───────────────────────────────────────────────
  topBar: {
    backgroundColor: '#FF007F',
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
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FF007F',
    opacity: 0.15,
  },
  decoCircle2: {
    position: 'absolute' as const,
    bottom: -40,
    left: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#00F0FF',
    opacity: 0.12,
  },
  decoCircle3: {
    position: 'absolute' as const,
    top: '40%' as any,
    left: -80,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFE600',
    opacity: 0.1,
  },

  // ─── Brand ─────────────────────────────────────────────────
  brandContainer: {
    alignItems: 'center' as const,
    marginBottom: 32,
  },
  logoBadge: {
    backgroundColor: '#FF007F',
    borderWidth: 4,
    borderColor: '#FFE600',
    paddingHorizontal: 28,
    paddingVertical: 8,
    transform: [{ rotate: '-3deg' }],
    marginBottom: 16,
    shadowColor: '#FF007F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: {
    color: '#FFE600',
    fontSize: 36,
    fontWeight: '900' as const,
    letterSpacing: 4,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  logoSubText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900' as const,
    letterSpacing: 6,
    textAlign: 'center' as const,
    marginTop: -2,
  },
  welcomeText: {
    color: '#FFE600',
    fontSize: 22,
    fontWeight: '900' as const,
    letterSpacing: 3,
    textShadowColor: 'rgba(255,230,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  welcomeSub: {
    color: '#AAAACC',
    fontSize: 14,
    fontWeight: '600' as const,
    marginTop: 4,
  },

  // ─── Login Card ────────────────────────────────────────────
  loginCard: {
    width: '100%' as any,
    maxWidth: 420,
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
    backgroundColor: '#FFE600',
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
    padding: 24,
  },

  // ─── Error ─────────────────────────────────────────────────
  errorBox: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#FFF0F4',
    borderWidth: 2,
    borderColor: '#FF007F',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: '#FF007F',
    fontSize: 13,
    fontWeight: '700' as const,
    flex: 1,
  },

  // ─── Fields ────────────────────────────────────────────────
  fieldLabel: {
    fontSize: 12,
    fontWeight: '900' as const,
    color: '#000000',
    marginBottom: 6,
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
    paddingVertical: Platform.OS === 'web' ? 12 : 10,
    marginBottom: 18,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700' as const,
    color: '#000000',
    outlineStyle: 'none' as any,
  },

  // ─── Login Button ──────────────────────────────────────────
  loginBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#FF007F',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#FF007F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900' as const,
    letterSpacing: 1,
  },

  // ─── Divider ───────────────────────────────────────────────
  divider: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
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

  // ─── Register Button ──────────────────────────────────────
  registerBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#FF007F',
    borderRadius: 10,
    paddingVertical: 12,
  },
  registerBtnText: {
    color: '#FF007F',
    fontSize: 14,
    fontWeight: '900' as const,
    letterSpacing: 0.5,
  },

  // ─── Footer ────────────────────────────────────────────────
  footerText: {
    color: '#555577',
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1,
    marginTop: 28,
    textAlign: 'center' as const,
  },
});

export default loginStyles;


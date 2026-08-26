import { Platform, StyleSheet } from 'react-native';

const MC_FONT = Platform.OS === 'web' ? "'Press Start 2P', monospace" : 'monospace';
const MC_BODY = Platform.OS === 'web' ? "'VT323', monospace" : 'monospace';

const loginStyles = StyleSheet.create({
  // ─── Layout ────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: '#1a120b',
    height: Platform.OS === 'web' ? ('100vh' as any) : '100%',
  },

  // ─── Top Bar ───────────────────────────────────────────────
  topBar: {
    backgroundColor: '#0f0a06',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center' as const,
    borderBottomWidth: 2,
    borderBottomColor: '#8b7a45',
  },
  topBarText: {
    color: '#c8a84e',
    fontSize: 9,
    fontWeight: '900' as const,
    letterSpacing: 2,
    fontFamily: MC_FONT,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 24,
    position: 'relative' as const,
    overflow: 'hidden' as const,
  },

  // ─── Decorative Blocks ─────────────────────────────────────
  decoCircle1: {
    position: 'absolute' as const,
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 0,
    backgroundColor: '#4a8c3f',
    opacity: 0.06,
  },
  decoCircle2: {
    position: 'absolute' as const,
    bottom: -40,
    left: -40,
    width: 140,
    height: 140,
    borderRadius: 0,
    backgroundColor: '#8b7a45',
    opacity: 0.08,
  },
  decoCircle3: {
    position: 'absolute' as const,
    top: '40%' as any,
    left: -60,
    width: 100,
    height: 100,
    borderRadius: 0,
    backgroundColor: '#c8a84e',
    opacity: 0.05,
  },

  // ─── Brand ─────────────────────────────────────────────────
  brandContainer: {
    alignItems: 'center' as const,
    marginBottom: 32,
  },
  logoBadge: {
    backgroundColor: '#2d1f12',
    borderWidth: 3,
    borderColor: '#8b7a45',
    paddingHorizontal: 28,
    paddingVertical: 10,
    transform: [{ rotate: '0deg' }],
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 0,
    elevation: 8,
  },
  logoText: {
    color: '#c8a84e',
    fontSize: 24,
    fontWeight: '900' as const,
    letterSpacing: 4,
    fontFamily: MC_FONT,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  logoSubText: {
    color: '#8b7a45',
    fontSize: 9,
    fontWeight: '900' as const,
    letterSpacing: 6,
    textAlign: 'center' as const,
    marginTop: 2,
    fontFamily: MC_FONT,
  },
  welcomeText: {
    color: '#c8a84e',
    fontSize: 14,
    fontWeight: '900' as const,
    letterSpacing: 3,
    fontFamily: MC_FONT,
    textShadowColor: 'rgba(200,168,78,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
  },
  welcomeSub: {
    color: '#8b7a45',
    fontSize: 16,
    fontWeight: '600' as const,
    marginTop: 6,
    fontFamily: MC_BODY,
  },

  // ─── Login Card ────────────────────────────────────────────
  loginCard: {
    width: '100%' as any,
    maxWidth: 420,
    backgroundColor: '#2d1f12',
    borderWidth: 3,
    borderColor: '#8b7a45',
    borderRadius: 6,
    overflow: 'hidden' as const,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 10,
  },
  cardHeaderStripe: {
    backgroundColor: '#3d2b1a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#5a4a2a',
  },
  cardHeaderText: {
    color: '#c8a84e',
    fontSize: 11,
    fontWeight: '900' as const,
    letterSpacing: 2,
    textAlign: 'center' as const,
    fontFamily: MC_FONT,
  },
  cardBody: {
    padding: 24,
  },

  // ─── Error ─────────────────────────────────────────────────
  errorBox: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#3d1515',
    borderWidth: 2,
    borderColor: '#8b2020',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    fontWeight: '700' as const,
    flex: 1,
    fontFamily: MC_BODY,
  },

  // ─── Fields ────────────────────────────────────────────────
  fieldLabel: {
    fontSize: 9,
    fontWeight: '900' as const,
    color: '#c8a84e',
    marginBottom: 6,
    letterSpacing: 1,
    fontFamily: MC_FONT,
  },
  inputWrapper: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#1a120b',
    borderWidth: 2,
    borderColor: '#5a4a2a',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'web' ? 12 : 10,
    marginBottom: 18,
  },
  textInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#c8a84e',
    fontFamily: MC_BODY,
    outlineStyle: 'none' as any,
  },

  // ─── Login Button ──────────────────────────────────────────
  loginBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#4a8c3f',
    borderWidth: 2,
    borderColor: '#6ab85e',
    borderRadius: 4,
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 6,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900' as const,
    letterSpacing: 2,
    fontFamily: MC_FONT,
  },

  // ─── Divider ───────────────────────────────────────────────
  divider: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#5a4a2a',
  },
  dividerText: {
    color: '#8b7a45',
    fontSize: 14,
    fontWeight: '700' as const,
    marginHorizontal: 12,
    fontFamily: MC_BODY,
  },

  // ─── Register Button ──────────────────────────────────────
  registerBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: '#3d2b1a',
    borderWidth: 2,
    borderColor: '#8b7a45',
    borderRadius: 4,
    paddingVertical: 12,
  },
  registerBtnText: {
    color: '#c8a84e',
    fontSize: 10,
    fontWeight: '900' as const,
    letterSpacing: 1,
    fontFamily: MC_FONT,
  },

  // ─── Footer ────────────────────────────────────────────────
  footerText: {
    color: '#5a4a2a',
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: 1,
    marginTop: 28,
    textAlign: 'center' as const,
    fontFamily: MC_BODY,
  },
});

export default loginStyles;


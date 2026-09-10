import { StyleSheet } from 'react-native';
import { AppColors } from './appColors';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  /* HEADER */
  headerContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  headerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  brandContainer: {
    paddingLeft: 28,
    paddingBottom: 22,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: AppColors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
    marginLeft: 10,
  },
  brandSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 4,
  },

  /* TAB SWITCHER */
  tabOuterPadding: {
    paddingHorizontal: 24,
    marginVertical: 18,
  },
  tabTrack: {
    height: 48,
    padding: 4,
    backgroundColor: 'rgba(238, 242, 249, 0.7)',
    borderRadius: 30,
    flexDirection: 'row',
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 13.5,
  },
  tabLabelActive: {
    fontWeight: '900',
    color: AppColors.primary,
  },
  tabLabelInactive: {
    fontWeight: '700',
    color: AppColors.textMuted,
  },

  /* FORM BODY */
  formContainer: {
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: AppColors.textMuted,
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.cardBg,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: AppColors.border,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: AppColors.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 1,
  },
  iconPrefix: {
    marginRight: 10,
  },
  iconSuffix: {
    padding: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: AppColors.textForeground,
  },
  dropdownText: {
    fontSize: 14,
    color: AppColors.textForeground,
    flex: 1,
  },
  forgotPassBtn: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  forgotPassText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: AppColors.accent,
  },

  /* BUTTONS */
  primaryButton: {
    width: '100%',
    height: 52,
    backgroundColor: AppColors.primary,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: AppColors.border,
  },
  dividerText: {
    paddingHorizontal: 14,
    fontSize: 12,
    color: AppColors.textMuted,
  },
  guestButton: {
    width: '100%',
    height: 50,
    borderWidth: 1.2,
    borderColor: AppColors.border,
    backgroundColor: 'transparent',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.textMuted,
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: AppColors.textForeground,
    marginBottom: 16,
    textAlign: 'center',
  },
  departmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  departmentItemSelected: {
    backgroundColor: AppColors.muted,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  departmentText: {
    fontSize: 14,
    color: AppColors.textForeground,
  },
  departmentTextSelected: {
    fontWeight: '700',
    color: AppColors.primary,
  },
});
import { Alert, Platform } from 'react-native';

/**
 * react-native-web's Alert.alert is a no-op, so destructive confirmations
 * (logout, delete, cancel) would silently do nothing on web. This wraps
 * Alert.alert on native and falls back to window.confirm on web.
 */
export function confirmAction(
  title: string,
  message: string,
  confirmLabel: string,
  onConfirm: () => void,
  options?: { destructive?: boolean },
) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    }
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: confirmLabel, style: options?.destructive ? 'destructive' : 'default', onPress: onConfirm },
  ]);
}

/** Cross-platform replacement for a single-button informational Alert.alert(). */
export function notify(title: string, message?: string) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}

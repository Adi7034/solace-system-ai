import { useState, useEffect, useCallback } from 'react';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('Notification' in window);
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;
    
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!isSupported || permission !== 'granted') return null;
    
    try {
      return new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }, [isSupported, permission]);

  const scheduleReminder = useCallback((title: string, body: string, triggerDate: Date) => {
    const now = new Date();
    const delay = triggerDate.getTime() - now.getTime();
    
    if (delay <= 0) return null;
    
    const timeoutId = setTimeout(() => {
      showNotification(title, { body });
    }, delay);
    
    return timeoutId;
  }, [showNotification]);

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    scheduleReminder,
  };
}

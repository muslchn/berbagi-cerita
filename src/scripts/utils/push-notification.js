/**
 * Push Notification Handler for Web Push API
 * Manages subscription, unsubscription, and notification display
 */

import CONFIG from '../config';

const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

class PushNotificationManager {
  constructor() {
    this.subscription = null;
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  }

  /**
   * Check if push notifications are supported
   * @returns {boolean}
   */
  checkSupport() {
    return this.isSupported;
  }

  /**
   * Request notification permission from user
   * @returns {Promise<string>} Permission status
   */
  async requestPermission() {
    if (!this.isSupported) {
      throw new Error('Push notifications not supported');
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  /**
   * Convert VAPID public key to Uint8Array
   * @param {string} key - Base64 encoded VAPID key
   * @returns {Uint8Array}
   */
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  }

  /**
   * Subscribe to push notifications
   * @returns {Promise<Object>} Subscription object
   */
  async subscribe() {
    if (!this.isSupported) {
      throw new Error('Push notifications not supported');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Silakan login terlebih dahulu untuk mengaktifkan notifikasi');
    }

    const permission = await this.requestPermission();
    
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    const registration = await navigator.serviceWorker.ready;
    const existingSubscription = await registration.pushManager.getSubscription();

    if (existingSubscription) {
      this.subscription = existingSubscription;
      await this.sendSubscriptionToServer(existingSubscription);
      return existingSubscription;
    }
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    this.subscription = subscription;
    
    // Send subscription to server
    try {
      await this.sendSubscriptionToServer(subscription);
    } catch (error) {
      await subscription.unsubscribe();
      this.subscription = null;
      throw error;
    }
    
    return subscription;
  }

  /**
   * Unsubscribe from push notifications
   * @returns {Promise<boolean>}
   */
  async unsubscribe() {
    if (!this.subscription) {
      await this.getSubscription();
    }

    if (!this.subscription) {
      return false;
    }

    const activeSubscription = this.subscription;
    await this.removeSubscriptionFromServer(activeSubscription);
    const result = await activeSubscription.unsubscribe();
    
    if (result) {
      this.subscription = null;
    }
    
    return result;
  }

  /**
   * Get current subscription
   * @returns {Promise<PushSubscription|null>}
   */
  async getSubscription() {
    if (!this.isSupported) {
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    this.subscription = await registration.pushManager.getSubscription();
    
    return this.subscription;
  }

  /**
   * Check if currently subscribed
   * @returns {Promise<boolean>}
   */
  async isSubscribed() {
    const subscription = await this.getSubscription();
    return subscription !== null;
  }

  /**
   * Send subscription to Dicoding Story API
   * @param {PushSubscription} subscription
   */
  async sendSubscriptionToServer(subscription) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Silakan login terlebih dahulu untuk mengaktifkan notifikasi');
    }

    try {
      const subscriptionJson = subscription.toJSON();
      const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          endpoint: subscriptionJson.endpoint,
          keys: {
            p256dh: subscriptionJson.keys.p256dh,
            auth: subscriptionJson.keys.auth,
          },
        })
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe to push notifications');
      }

      return await response.json();
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      throw error;
    }
  }

  /**
   * Remove subscription from Dicoding Story API
   * @param {PushSubscription} subscription
   */
  async removeSubscriptionFromServer(subscription) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint
        })
      });

      if (!response.ok) {
        throw new Error('Failed to unsubscribe from push notifications');
      }

      return await response.json();
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
    }
  }

  /**
   * Display a local notification
   * @param {Object} options - Notification options
   */
  displayNotification(options) {
    if (!this.isSupported || Notification.permission !== 'granted') {
      return;
    }

    const notificationOptions = {
      body: options.body || 'You have a new notification',
      icon: options.icon || `${import.meta.env.BASE_URL}favicon.png`,
      badge: options.badge || `${import.meta.env.BASE_URL}favicon.png`,
      tag: options.tag || 'default',
      renotify: options.renotify || false,
      requireInteraction: options.requireInteraction || false,
      actions: options.actions || [],
      data: options.data || {}
    };

    new Notification(options.title || 'Berbagi Cerita', notificationOptions);
  }

  /**
   * Toggle push notification subscription
   * @returns {Promise<boolean>} New subscription status
   */
  async toggleSubscription() {
    const isCurrentlySubscribed = await this.isSubscribed();
    
    if (isCurrentlySubscribed) {
      await this.unsubscribe();
      return false;
    } else {
      await this.subscribe();
      return true;
    }
  }
}

// Export singleton instance
const pushManager = new PushNotificationManager();
export default pushManager;

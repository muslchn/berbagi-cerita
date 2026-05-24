/**
 * IndexedDB Helper for Offline Data Storage
 * Implements CRUD operations for stories with offline support
 */

class StoryDatabase {
  constructor() {
    this.dbName = 'BerbagiCeritaDB';
    this.dbVersion = 1;
    this.storeName = 'stories';
    this.pendingStoreName = 'pendingStories';
    this.db = null;
  }

  /**
   * Initialize database and create object stores
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create stories store
        if (!db.objectStoreNames.contains(this.storeName)) {
          const storyStore = db.createObjectStore(this.storeName, { keyPath: 'id' });
          storyStore.createIndex('createdAt', 'createdAt', { unique: false });
          storyStore.createIndex('name', 'name', { unique: false });
        }

        // Create pending stories store for offline sync
        if (!db.objectStoreNames.contains(this.pendingStoreName)) {
          const pendingStore = db.createObjectStore(this.pendingStoreName, { 
            keyPath: 'timestamp',
            autoIncrement: true 
          });
          pendingStore.createIndex('status', 'status', { unique: false });
        }
      };
    });
  }

  /**
   * Add or update a story in IndexedDB
   * @param {Object} story - Story object to save
   */
  async addStory(story) {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(story);

      request.onsuccess = () => resolve(story);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all stories from IndexedDB
   * @param {Object} options - Filter and sort options
   * @returns {Array} Array of stories
   */
  async getAllStories(options = {}) {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        let stories = request.result;

        // Apply filters if provided
        if (options.search) {
          const searchTerm = options.search.toLowerCase();
          stories = stories.filter(story => 
            story.name.toLowerCase().includes(searchTerm) ||
            story.description.toLowerCase().includes(searchTerm)
          );
        }

        if (options.sortBy) {
          const field = options.sortBy;
          const order = options.order || 'desc';
          
          stories.sort((a, b) => {
            let valA = a[field];
            let valB = b[field];
            
            if (field === 'createdAt') {
              valA = new Date(valA).getTime();
              valB = new Date(valB).getTime();
            }
            
            return order === 'asc' ? valA - valB : valB - valA;
          });
        }

        resolve(stories);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get a single story by ID
   * @param {string} id - Story ID
   * @returns {Object|null} Story object or null
   */
  async getStoryById(id) {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete a story from IndexedDB
   * @param {string} id - Story ID to delete
   */
  async deleteStory(id) {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all stories from IndexedDB
   */
  async clearAllStories() {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Add pending story for offline sync
   * @param {Object} storyData - Story data to sync when online
   */
  async addPendingStory(storyData) {
    await this.ensureInitialized();
    
    const pendingStory = {
      ...storyData,
      timestamp: Date.now(),
      status: 'pending'
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.pendingStoreName], 'readwrite');
      const store = transaction.objectStore(this.pendingStoreName);
      const request = store.add(pendingStory);

      request.onsuccess = () => resolve(pendingStory);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all pending stories
   * @returns {Array} Array of pending stories
   */
  async getPendingStories() {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.pendingStoreName], 'readonly');
      const store = transaction.objectStore(this.pendingStoreName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Remove pending story after successful sync
   * @param {number} timestamp - Timestamp of the pending story
   */
  async removePendingStory(timestamp) {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.pendingStoreName], 'readwrite');
      const store = transaction.objectStore(this.pendingStoreName);
      const request = store.delete(timestamp);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Check if database is initialized
   */
  async ensureInitialized() {
    if (!this.db) {
      await this.init();
    }
  }

  /**
   * Close database connection
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Export singleton instance
const storyDB = new StoryDatabase();
export default storyDB;

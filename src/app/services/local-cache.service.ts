import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

interface CacheItem<T> {
  ordinal: number;
  value: T;
}

const MAX_CACHED_ITEMS = 10;

@Injectable({
  providedIn: 'root',
})
export class LocalCacheService {
  private _ordinals: { [key: string]: number };

  constructor(private _storageService: LocalStorageService) {
    this._ordinals = {};
  }

  private buildKey(cacheId: string, id: string): string {
    return `${cacheId}.${id}`;
  }

  private getKeyToPrune(cacheId: string): string {
    const keys = this._storageService.getKeys(cacheId);
    if (keys.length <= MAX_CACHED_ITEMS) {
      return null;
    }

    const keyOrdinals = keys.map((k) => {
      const value = this._storageService.retrieve(k, true) as CacheItem<any>;
      return value?.ordinal || 0;
    });

    let min = -1;
    let index = -1;
    for (let i = 0; i < keyOrdinals.length; i++) {
      if (min === -1 || keyOrdinals[i] < min) {
        min = keyOrdinals[i];
        index = i;
      }
    }

    return index === -1 ? null : keys[index];
  }

  private prune(cacheId: string, excludedId: string) {
    const key = this.getKeyToPrune(cacheId);
    if (key && key !== excludedId) {
      this._storageService.remove(key);
    }
  }

  /**
   * Get the specified item from the specified cache.
   *
   * @param cacheId The cache ID.
   * @param id The item's ID.
   * @returns The item or undefined if not found.
   */
  public get<T>(cacheId: string, id: string): T {
    return (this._storageService.retrieve(
      this.buildKey(cacheId, id),
      true
    ) as CacheItem<T>)?.value;
  }

  /**
   * Add the specified item to the specified cache, eventually pruning it.
   *
   * @param cacheId The cache ID.
   * @param id The item's ID.
   * @param value The item to be added.
   */
  public add(cacheId: string, id: string, value: any) {
    // update the ordinal for the item being added
    const key = this.buildKey(cacheId, id);
    const next = 1 + (this._ordinals[key] || 0);
    this._ordinals[key] = next;

    // add the item
    this._storageService.store(
      key,
      {
        ordinal: next,
        value,
      },
      true
    );

    // prune the cache
    this.prune(cacheId, key);
  }
}

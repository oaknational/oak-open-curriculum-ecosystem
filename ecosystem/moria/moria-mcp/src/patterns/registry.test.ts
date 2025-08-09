/**
 * @fileoverview Tests for Registry patterns
 * @module moria/patterns/registry.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import type {
  Registry,
  TypedRegistry,
  NamedRegistry,
  HierarchicalRegistry,
  ObservableRegistry,
  RegistryEntry,
  RegistryFilter,
  RegistryQuery,
} from './registry';

describe('Registry patterns', () => {
  describe('Registry interface', () => {
    it('should register and retrieve items', () => {
      const registry: Registry<string, number> = {
        register: function (key: string, value: number) {
          this.items.set(key, value);
        },
        get: function (key: string) {
          return this.items.get(key);
        },
        has: function (key: string) {
          return this.items.has(key);
        },
        unregister: function (key: string) {
          return this.items.delete(key);
        },
        clear: function () {
          this.items.clear();
        },
        items: new Map(),
      };

      registry.register('one', 1);
      registry.register('two', 2);

      expect(registry.get('one')).toBe(1);
      expect(registry.get('two')).toBe(2);
      expect(registry.has('one')).toBe(true);
      expect(registry.has('three')).toBe(false);
    });

    it('should unregister items', () => {
      const registry: Registry<string, string> = {
        register: function (key: string, value: string) {
          this.items.set(key, value);
        },
        get: function (key: string) {
          return this.items.get(key);
        },
        has: function (key: string) {
          return this.items.has(key);
        },
        unregister: function (key: string) {
          return this.items.delete(key);
        },
        clear: function () {
          this.items.clear();
        },
        items: new Map(),
      };

      registry.register('test', 'value');
      expect(registry.has('test')).toBe(true);

      const removed = registry.unregister('test');
      expect(removed).toBe(true);
      expect(registry.has('test')).toBe(false);
      expect(registry.get('test')).toBeUndefined();
    });

    it('should clear all items', () => {
      const registry: Registry<string, number> = {
        register: function (key: string, value: number) {
          this.items.set(key, value);
        },
        get: function (key: string) {
          return this.items.get(key);
        },
        has: function (key: string) {
          return this.items.has(key);
        },
        unregister: function (key: string) {
          return this.items.delete(key);
        },
        clear: function () {
          this.items.clear();
        },
        items: new Map(),
      };

      registry.register('a', 1);
      registry.register('b', 2);
      registry.register('c', 3);

      registry.clear();
      expect(registry.has('a')).toBe(false);
      expect(registry.has('b')).toBe(false);
      expect(registry.has('c')).toBe(false);
    });
  });

  describe('TypedRegistry interface', () => {
    it('should enforce type constraints', () => {
      interface Handler {
        name: string;
        execute(): void;
      }

      const registry: TypedRegistry<Handler> = {
        register: function (item: Handler) {
          this.items.set(item.name, item);
        },
        get: function (key: string) {
          return this.items.get(key);
        },
        getByType: function <T extends Handler>(type: new () => T): T[] {
          const results: T[] = [];
          for (const item of this.items.values()) {
            if (item.constructor === type) {
              results.push(item as T);
            }
          }
          return results;
        },
        items: new Map(),
      };

      class SpecificHandler implements Handler {
        constructor(public name: string) {}
        execute(): void {}
      }

      const handler1 = new SpecificHandler('handler1');
      const handler2 = new SpecificHandler('handler2');

      registry.register(handler1);
      registry.register(handler2);

      const specific = registry.getByType(SpecificHandler);
      expect(specific).toHaveLength(2);
      expect(specific[0]).toBeInstanceOf(SpecificHandler);
    });
  });

  describe('NamedRegistry interface', () => {
    it('should manage named items', () => {
      interface Component {
        id: string;
        type: string;
      }

      const registry: NamedRegistry<Component> = {
        register: function (name: string, item: Component) {
          this.items.set(name, item);
          if (!this.nameIndex.has(item.type)) {
            this.nameIndex.set(item.type, new Set());
          }
          this.nameIndex.get(item.type)!.add(name);
        },
        getByName: function (name: string) {
          return this.items.get(name);
        },
        getAllNames: function () {
          return Array.from(this.items.keys());
        },
        findByPrefix: function (prefix: string) {
          const results: Component[] = [];
          for (const [name, item] of this.items.entries()) {
            if (name.startsWith(prefix)) {
              results.push(item);
            }
          }
          return results;
        },
        items: new Map(),
        nameIndex: new Map(),
      };

      registry.register('btn-primary', { id: '1', type: 'button' });
      registry.register('btn-secondary', { id: '2', type: 'button' });
      registry.register('input-text', { id: '3', type: 'input' });

      expect(registry.getByName('btn-primary')).toEqual({
        id: '1',
        type: 'button',
      });

      const buttons = registry.findByPrefix('btn-');
      expect(buttons).toHaveLength(2);

      const names = registry.getAllNames();
      expect(names).toContain('btn-primary');
      expect(names).toContain('input-text');
    });
  });

  describe('HierarchicalRegistry interface', () => {
    it('should support parent-child relationships', () => {
      interface Node {
        id: string;
        name: string;
      }

      const createRegistry = (): HierarchicalRegistry<string, Node> => ({
        register: function (key: string, value: Node) {
          this.items.set(key, value);
        },
        get: function (key: string) {
          return this.items.get(key);
        },
        has: function (key: string) {
          return this.items.has(key);
        },
        unregister: function (key: string) {
          return this.items.delete(key);
        },
        clear: function () {
          this.items.clear();
        },
        items: new Map(),
        parent: undefined,
        children: [],
        setParent: function (parent) {
          this.parent = parent;
          if (!parent.children.includes(this)) {
            parent.children.push(this);
          }
        },
        addChild: function (child) {
          if (!this.children.includes(child)) {
            this.children.push(child);
            child.setParent(this);
          }
        },
        lookup: function (key: string): Node | undefined {
          // Check current registry
          const local = this.get(key);
          if (local) return local;

          // Check parent
          if (this.parent) {
            return this.parent.lookup(key);
          }

          return undefined;
        },
      });

      const parent = createRegistry();
      const child = createRegistry();

      parent.register('global', { id: '1', name: 'Global Item' });
      child.setParent(parent);
      child.register('local', { id: '2', name: 'Local Item' });

      // Child can access both local and parent items
      expect(child.lookup('local')).toEqual({ id: '2', name: 'Local Item' });
      expect(child.lookup('global')).toEqual({ id: '1', name: 'Global Item' });

      // Parent cannot access child items
      expect(parent.lookup('local')).toBeUndefined();
    });
  });

  describe('ObservableRegistry interface', () => {
    it('should notify observers of changes', () => {
      const events: string[] = [];

      const registry: ObservableRegistry<string, number> = {
        register: function (key: string, value: number) {
          this.items.set(key, value);
          this.notifyObservers('register', { key, value });
        },
        get: function (key: string) {
          return this.items.get(key);
        },
        has: function (key: string) {
          return this.items.has(key);
        },
        unregister: function (key: string) {
          const existed = this.items.delete(key);
          if (existed) {
            this.notifyObservers('unregister', { key });
          }
          return existed;
        },
        clear: function () {
          this.items.clear();
          this.notifyObservers('clear', {});
        },
        items: new Map(),
        observers: [],
        addObserver: function (observer) {
          this.observers.push(observer);
        },
        removeObserver: function (observer) {
          const index = this.observers.indexOf(observer);
          if (index !== -1) {
            this.observers.splice(index, 1);
          }
        },
        notifyObservers: function (event, data) {
          for (const observer of this.observers) {
            observer(event, data);
          }
        },
      };

      registry.addObserver((event, data) => {
        events.push(`${event}: ${JSON.stringify(data)}`);
      });

      registry.register('test', 42);
      registry.unregister('test');
      registry.clear();

      expect(events).toEqual([
        'register: {"key":"test","value":42}',
        'unregister: {"key":"test"}',
        'clear: {}',
      ]);
    });
  });

  describe('RegistryEntry interface', () => {
    it('should store metadata with entries', () => {
      interface Service {
        name: string;
        version: string;
      }

      const entry: RegistryEntry<Service> = {
        key: 'auth-service',
        value: {
          name: 'Authentication Service',
          version: '1.0.0',
        },
        metadata: {
          createdAt: new Date('2024-01-01'),
          tags: ['auth', 'security'],
          priority: 10,
        },
      };

      expect(entry.key).toBe('auth-service');
      expect(entry.value.name).toBe('Authentication Service');
      expect(entry.metadata?.tags).toContain('auth');
      expect(entry.metadata?.priority).toBe(10);
    });
  });

  describe('RegistryFilter interface', () => {
    it('should filter registry entries', () => {
      const filter: RegistryFilter<{ type: string; active: boolean }> = {
        apply: function (items) {
          return items.filter((item) => item.active && item.type === 'service');
        },
      };

      const items = [
        { type: 'service', active: true },
        { type: 'service', active: false },
        { type: 'component', active: true },
        { type: 'service', active: true },
      ];

      const filtered = filter.apply(items);
      expect(filtered).toHaveLength(2);
      expect(filtered.every((item) => item.type === 'service')).toBe(true);
      expect(filtered.every((item) => item.active)).toBe(true);
    });
  });

  describe('RegistryQuery interface', () => {
    it('should query registry with complex criteria', () => {
      interface Product {
        id: string;
        name: string;
        price: number;
        category: string;
      }

      const query: RegistryQuery<Product> = {
        where: function (predicate) {
          this.predicates.push(predicate);
          return this;
        },
        orderBy: function (key, direction = 'asc') {
          this.ordering = { key, direction };
          return this;
        },
        limit: function (count) {
          this.maxResults = count;
          return this;
        },
        execute: function (items) {
          let results = [...items];

          // Apply predicates
          for (const predicate of this.predicates) {
            results = results.filter(predicate);
          }

          // Apply ordering
          if (this.ordering) {
            const { key, direction } = this.ordering;
            results.sort((a, b) => {
              const aVal = (a as any)[key];
              const bVal = (b as any)[key];
              const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
              return direction === 'asc' ? comparison : -comparison;
            });
          }

          // Apply limit
          if (this.maxResults !== undefined) {
            results = results.slice(0, this.maxResults);
          }

          return results;
        },
        predicates: [],
        ordering: undefined,
        maxResults: undefined,
      };

      const products: Product[] = [
        { id: '1', name: 'Laptop', price: 1200, category: 'Electronics' },
        { id: '2', name: 'Mouse', price: 25, category: 'Electronics' },
        { id: '3', name: 'Desk', price: 400, category: 'Furniture' },
        { id: '4', name: 'Monitor', price: 300, category: 'Electronics' },
      ];

      const results = query
        .where((p) => p.category === 'Electronics')
        .where((p) => p.price < 500)
        .orderBy('price', 'desc')
        .limit(2)
        .execute(products);

      expect(results).toHaveLength(2);
      expect(results[0].name).toBe('Monitor');
      expect(results[1].name).toBe('Mouse');
    });
  });
});

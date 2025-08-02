# Additional Extractable Systems for oak-mcp-core

## 1. Configuration Management System (~200 LoC)

Every MCP server needs robust configuration management with validation.

```typescript
// src/config/config-manager.ts (GENERIC)
export interface ConfigSchema<T> {
  parse(input: unknown): T;
  validate(input: unknown): ValidationResult;
}

export class ConfigManager<T> {
  private config?: T;

  constructor(
    private schema: ConfigSchema<T>,
    private sources: ConfigSource[],
  ) {}

  async load(): Promise<T> {
    const raw = await this.collectConfig();
    const validation = this.schema.validate(raw);

    if (!validation.valid) {
      throw new ConfigurationError('Invalid configuration', validation.errors);
    }

    this.config = this.schema.parse(raw);
    return this.config;
  }

  get(): T {
    if (!this.config) {
      throw new Error('Configuration not loaded');
    }
    return this.config;
  }
}

// Config sources for different environments
export interface ConfigSource {
  name: string;
  priority: number;
  load(): Promise<Record<string, unknown>>;
}

export class EnvironmentConfigSource implements ConfigSource {
  name = 'environment';
  priority = 100;

  constructor(private prefix?: string) {}

  async load(): Promise<Record<string, unknown>> {
    const config: Record<string, unknown> = {};
    const prefix = this.prefix || '';

    for (const [key, value] of Object.entries(process.env)) {
      if (key.startsWith(prefix)) {
        const configKey = key.slice(prefix.length);
        config[configKey] = value;
      }
    }

    return config;
  }
}

// Zod integration for schema validation
export class ZodConfigSchema<T> implements ConfigSchema<T> {
  constructor(private zodSchema: z.ZodSchema<T>) {}

  parse(input: unknown): T {
    return this.zodSchema.parse(input);
  }

  validate(input: unknown): ValidationResult {
    const result = this.zodSchema.safeParse(input);
    return {
      valid: result.success,
      errors: result.success ? undefined : this.formatErrors(result.error),
    };
  }
}
```

## 2. Validation Framework (~150 LoC)

A generic validation system that goes beyond just configuration.

```typescript
// src/validation/validator.ts (GENERIC)
export interface Validator<T> {
  validate(value: unknown): ValidationResult<T>;
  chain(...validators: Validator<any>[]): Validator<T>;
  transform<U>(fn: (value: T) => U): Validator<U>;
}

export class ValidationChain<T> implements Validator<T> {
  constructor(private validators: Array<(value: unknown) => ValidationResult<any>>) {}

  validate(value: unknown): ValidationResult<T> {
    let current = value;

    for (const validator of this.validators) {
      const result = validator(current);
      if (!result.valid) {
        return result;
      }
      current = result.value;
    }

    return { valid: true, value: current as T };
  }

  chain(...validators: Validator<any>[]): Validator<T> {
    return new ValidationChain([...this.validators, ...validators.map((v) => v.validate.bind(v))]);
  }

  transform<U>(fn: (value: T) => U): Validator<U> {
    return new ValidationChain([
      ...this.validators,
      (value: T) => ({ valid: true, value: fn(value) }),
    ]);
  }
}

// Common validators
export const Validators = {
  string(): Validator<string> {
    return new ValidationChain([
      (value) => {
        if (typeof value !== 'string') {
          return { valid: false, errors: ['Value must be a string'] };
        }
        return { valid: true, value };
      },
    ]);
  },

  required(): Validator<any> {
    return new ValidationChain([
      (value) => {
        if (value === null || value === undefined || value === '') {
          return { valid: false, errors: ['Value is required'] };
        }
        return { valid: true, value };
      },
    ]);
  },

  url(): Validator<URL> {
    return new ValidationChain([
      (value) => {
        try {
          const url = new URL(String(value));
          return { valid: true, value: url };
        } catch {
          return { valid: false, errors: ['Invalid URL'] };
        }
      },
    ]);
  },
};
```

## 3. Testing Utilities Framework (~200 LoC)

Generic testing utilities that every MCP server needs.

```typescript
// src/testing/test-server.ts (GENERIC)
export class TestMcpServer<TConfig = any> {
  private server?: McpServerBase<TConfig>;
  private transport: TestTransport;

  constructor(
    private ServerClass: new (config: TConfig) => McpServerBase<TConfig>,
    private config: TConfig,
  ) {
    this.transport = new TestTransport();
  }

  async start(): Promise<void> {
    this.server = new this.ServerClass(this.config);
    await this.server.start(this.transport);
  }

  async sendRequest<T>(method: string, params?: any): Promise<T> {
    return this.transport.sendRequest(method, params);
  }

  async listResources(): Promise<Resource[]> {
    const response = await this.sendRequest('resources/list');
    return response.resources;
  }

  async callTool(name: string, args: any): Promise<any> {
    return this.sendRequest('tools/call', { name, arguments: args });
  }

  getTransport(): TestTransport {
    return this.transport;
  }

  async stop(): Promise<void> {
    await this.server?.stop();
  }
}

// Test transport for in-process testing
export class TestTransport implements Transport {
  private handlers = new Map<string, Function>();
  private messages: any[] = [];

  on(event: string, handler: Function): void {
    this.handlers.set(event, handler);
  }

  async sendRequest(method: string, params?: any): Promise<any> {
    const handler = this.handlers.get('message');
    if (!handler) {
      throw new Error('No message handler registered');
    }

    const request = {
      jsonrpc: '2.0',
      id: Math.random().toString(36),
      method,
      params,
    };

    this.messages.push({ type: 'request', data: request });

    return new Promise((resolve, reject) => {
      handler(request, (response: any) => {
        this.messages.push({ type: 'response', data: response });

        if (response.error) {
          reject(new Error(response.error.message));
        } else {
          resolve(response.result);
        }
      });
    });
  }

  getMessages(): any[] {
    return this.messages;
  }

  async close(): Promise<void> {
    this.handlers.clear();
    this.messages = [];
  }
}

// Test data builders
export class TestDataBuilder {
  static createMockResource(overrides?: Partial<Resource>): Resource {
    return {
      uri: 'test://resource/123',
      name: 'Test Resource',
      description: 'A test resource',
      mimeType: 'application/json',
      ...overrides,
    };
  }

  static createMockTool(overrides?: Partial<Tool>): Tool {
    return {
      name: 'test-tool',
      description: 'A test tool',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      ...overrides,
    };
  }
}
```

## 4. Middleware System (~150 LoC)

A composable middleware system for handlers.

```typescript
// src/middleware/middleware.ts (GENERIC)
export type Next<T = any> = () => Promise<T> | T;
export type Middleware<TContext = any, TResult = any> = (
  context: TContext,
  next: Next<TResult>,
) => Promise<TResult> | TResult;

export class MiddlewareStack<TContext, TResult> {
  private middlewares: Middleware<TContext, TResult>[] = [];

  use(middleware: Middleware<TContext, TResult>): this {
    this.middlewares.push(middleware);
    return this;
  }

  async execute(
    context: TContext,
    handler: (context: TContext) => Promise<TResult> | TResult,
  ): Promise<TResult> {
    let index = -1;

    const dispatch = async (i: number): Promise<TResult> => {
      if (i <= index) {
        throw new Error('next() called multiple times');
      }

      index = i;

      if (i === this.middlewares.length) {
        return handler(context);
      }

      const middleware = this.middlewares[i];
      return middleware(context, () => dispatch(i + 1));
    };

    return dispatch(0);
  }
}

// Common middleware
export const CommonMiddleware = {
  logging(logger: Logger): Middleware {
    return async (context: any, next) => {
      const start = Date.now();
      logger.debug('Request started', { context });

      try {
        const result = await next();
        const duration = Date.now() - start;
        logger.debug('Request completed', { duration, context });
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        logger.error('Request failed', error, { duration, context });
        throw error;
      }
    };
  },

  errorHandling(errorHandler: (error: unknown) => McpError): Middleware {
    return async (context, next) => {
      try {
        return await next();
      } catch (error) {
        throw errorHandler(error);
      }
    };
  },

  validation<T>(validator: Validator<T>): Middleware {
    return async (context: any, next) => {
      const result = validator.validate(context);
      if (!result.valid) {
        throw new ValidationError('Invalid request', result.errors);
      }
      return next();
    };
  },
};
```

## 5. Resource/Tool Registry System (~200 LoC)

A generic registry for MCP resources and tools.

```typescript
// src/registry/registry.ts (GENERIC)
export interface RegistryItem {
  name: string;
  metadata?: Record<string, unknown>;
}

export class Registry<T extends RegistryItem> {
  private items = new Map<string, T>();
  private middleware = new MiddlewareStack<{ item: T; args: any[] }, any>();

  register(item: T): void {
    if (this.items.has(item.name)) {
      throw new Error(`Item "${item.name}" already registered`);
    }
    this.items.set(item.name, item);
  }

  unregister(name: string): boolean {
    return this.items.delete(name);
  }

  get(name: string): T | undefined {
    return this.items.get(name);
  }

  has(name: string): boolean {
    return this.items.has(name);
  }

  list(): T[] {
    return Array.from(this.items.values());
  }

  use(middleware: Middleware): this {
    this.middleware.use(middleware);
    return this;
  }

  async execute<TResult>(
    name: string,
    handler: (item: T, ...args: any[]) => Promise<TResult> | TResult,
    ...args: any[]
  ): Promise<TResult> {
    const item = this.get(name);
    if (!item) {
      throw new Error(`Item "${name}" not found`);
    }

    return this.middleware.execute({ item, args }, () => handler(item, ...args));
  }
}

// Specialized registries
export class ResourceRegistry extends Registry<ResourceHandler> {
  async read(uri: string): Promise<Resource> {
    for (const handler of this.list()) {
      if (handler.canHandle(uri)) {
        return this.execute(handler.name, (h) => h.read(uri));
      }
    }
    throw new Error(`No handler for URI: ${uri}`);
  }
}

export class ToolRegistry extends Registry<ToolHandler> {
  async call(name: string, args: any): Promise<any> {
    return this.execute(name, (tool, args) => tool.execute(args), args);
  }
}
```

## 6. Lifecycle Management System (~100 LoC)

Manage component startup/shutdown sequences.

```typescript
// src/lifecycle/lifecycle.ts (GENERIC)
export interface Lifecycle {
  start(): Promise<void>;
  stop(): Promise<void>;
  isRunning(): boolean;
}

export class LifecycleManager {
  private components: Array<{ name: string; component: Lifecycle }> = [];
  private running = false;

  register(name: string, component: Lifecycle): void {
    this.components.push({ name, component });
  }

  async start(): Promise<void> {
    if (this.running) {
      throw new Error('Already running');
    }

    const started: string[] = [];

    try {
      for (const { name, component } of this.components) {
        await component.start();
        started.push(name);
      }
      this.running = true;
    } catch (error) {
      // Rollback started components
      for (const name of started.reverse()) {
        const component = this.components.find((c) => c.name === name);
        try {
          await component?.component.stop();
        } catch (stopError) {
          console.error(`Failed to stop ${name} during rollback:`, stopError);
        }
      }
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.running) {
      return;
    }

    const errors: Array<{ name: string; error: unknown }> = [];

    // Stop in reverse order
    for (const { name, component } of this.components.slice().reverse()) {
      try {
        await component.stop();
      } catch (error) {
        errors.push({ name, error });
      }
    }

    this.running = false;

    if (errors.length > 0) {
      throw new AggregateError(errors, 'Failed to stop some components');
    }
  }

  isRunning(): boolean {
    return this.running;
  }
}
```

## Summary of Additional Extractable Systems

1. **Configuration Management**: ~200 LoC
2. **Validation Framework**: ~150 LoC
3. **Testing Utilities**: ~200 LoC
4. **Middleware System**: ~150 LoC
5. **Registry System**: ~200 LoC
6. **Lifecycle Management**: ~100 LoC

**Total Additional**: ~1,000 LoC

This brings our grand total to **~3,050 LoC** of extractable code, which would be **over 100% of the current codebase** (3,004 LoC).

This means oak-mcp-core would be a comprehensive framework that provides:

- Logging & Error Handling
- Configuration & Validation
- Server Base & Lifecycle
- Middleware & Registries
- Testing Utilities
- Type Guards & Pagination
- Performance Monitoring
- Edge Runtime Support

Essentially, oak-notion-mcp would become a thin integration layer on top of oak-mcp-core!

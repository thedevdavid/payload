/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  collections: {
    afterOperation: AfterOperation;
    'context-hooks': ContextHook;
    transforms: Transform;
    hooks: Hook;
    'nested-after-read-hooks': NestedAfterReadHook;
    'chaining-hooks': ChainingHook;
    relations: Relation;
    'hooks-users': HooksUser;
    'data-hooks': DataHook;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  globals: {
    'data-hooks-global': DataHooksGlobal;
  };
  locale: null;
  user: HooksUser & {
    collection: 'hooks-users';
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "afterOperation".
 */
export interface AfterOperation {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "context-hooks".
 */
export interface ContextHook {
  id: string;
  value?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "transforms".
 */
export interface Transform {
  id: string;
  /**
   * @minItems 2
   * @maxItems 2
   */
  transform?: [number, number] | null;
  /**
   * @minItems 2
   * @maxItems 2
   */
  localizedTransform?: [number, number] | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "hooks".
 */
export interface Hook {
  id: string;
  fieldBeforeValidate?: boolean | null;
  fieldBeforeChange?: boolean | null;
  fieldAfterChange?: boolean | null;
  fieldAfterRead?: boolean | null;
  collectionBeforeValidate?: boolean | null;
  collectionBeforeChange?: boolean | null;
  collectionAfterChange?: boolean | null;
  collectionBeforeRead?: boolean | null;
  collectionAfterRead?: boolean | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "nested-after-read-hooks".
 */
export interface NestedAfterReadHook {
  id: string;
  text?: string | null;
  group?: {
    array?:
      | {
          input?: string | null;
          afterRead?: string | null;
          shouldPopulate?: (string | null) | Relation;
          id?: string | null;
        }[]
      | null;
    subGroup?: {
      afterRead?: string | null;
      shouldPopulate?: (string | null) | Relation;
    };
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "relations".
 */
export interface Relation {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "chaining-hooks".
 */
export interface ChainingHook {
  id: string;
  text?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "hooks-users".
 */
export interface HooksUser {
  id: string;
  roles: ('admin' | 'user')[];
  afterLoginHook?: boolean | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "data-hooks".
 */
export interface DataHook {
  id: string;
  field_collectionAndField?: string | null;
  collection_beforeOperation_collection?: string | null;
  collection_beforeChange_collection?: string | null;
  collection_afterChange_collection?: string | null;
  collection_beforeRead_collection?: string | null;
  collection_afterRead_collection?: string | null;
  collection_afterOperation_collection?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'hooks-users';
    value: string | HooksUser;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "data-hooks-global".
 */
export interface DataHooksGlobal {
  id: string;
  field_globalAndField?: string | null;
  global_beforeChange_global?: string | null;
  global_afterChange_global?: string | null;
  global_beforeRead_global?: string | null;
  global_afterRead_global?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}


declare module 'payload' {
 // @ts-ignore 
 export interface GeneratedTypes extends Config {}
}
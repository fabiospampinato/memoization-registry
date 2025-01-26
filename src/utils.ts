
/* IMPORT */

import MildMap from 'mild-map';
import type {Node} from './types';

/* MAIN */

const isObject = ( value: unknown ): value is object => {

  if ( value === null ) return false;

  const type = typeof value;

  return type === 'object' || type === 'function';

};

const isUndefined = ( value: unknown ): value is undefined => {

  return value === undefined;

};

const isWeakRef = ( value: unknown ): value is WeakRef<object> => {

  return value instanceof WeakRef;

};

const last = <T> ( values: T[] ): T | undefined => {

  return values[values.length - 1];

};

const traverse = <Keys extends unknown[], Value> ( node: Node<Value>, keys: Keys ): Node<Value>[] => {

  return keys.map ( key => {

    const next = node.get ( key ) || new MildMap ();

    node.set ( key, next );
    node = next;

    return node;

  });

};

const weakize = <T> ( values: T[] ): (T | WeakRef<object>)[] => {

  return values.map ( value => {

    if ( isObject ( value ) ) {

      return new WeakRef ( value );

    } else {

      return value;

    }

  });

};

const unweakize = <T> ( values: (T | WeakRef<object>)[] ): (T | object | undefined)[] => {

  return values.map ( value => {

    if ( isWeakRef ( value ) ) {

      return value.deref ();

    } else {

      return value;

    }

  });

};

/* EXPORT */

export {isObject, isUndefined, last, traverse, weakize, unweakize};

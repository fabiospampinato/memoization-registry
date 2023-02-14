
/* IMPORT */

import MildMap from 'mild-map';
import {isObject, isUndefined, last, traverse, weakize, unweakize} from '~/utils';
import type {Node} from '~/types';

/* MAIN */

class MemoizationRegistry<Keys extends unknown[], Value> {

  /* VARIABLES */

  #root: Node<Value>;
  #finalizationRegistry: FinalizationRegistry<unknown[]>;

  /* CONSTRUCTOR */

  constructor () {

    this.#root = new MildMap ();
    this.#finalizationRegistry = new FinalizationRegistry ( this.unregister );

  }

  /* API */

  register = ( keys: Keys, factory: () => Value ): Value => {

    if ( !keys.length ) throw new Error ( 'Missing required memoization keys' );

    const nodes = traverse ( this.#root, keys );
    const leaf = last ( nodes )!;
    const cached = leaf.ref?.deref ();

    if ( !isUndefined ( cached ) ) return cached;

    const value = factory ();

    if ( isObject ( value ) ) {

      leaf.ref = new WeakRef ( value );
      this.#finalizationRegistry.register ( value, weakize ( keys ) );

    } else {

      leaf.ref = { deref: () => value };

    }

    return value;

  }

  unregister = ( keys: Keys ): void => {

    if ( !keys.length ) throw new Error ( 'Missing required memoization keys' );

    const nodes = traverse ( this.#root, unweakize ( keys ) );
    const leaf = last ( nodes );

    if ( !leaf ) return;

    leaf.ref = undefined;

  }

}

/* EXPORT */

export default MemoizationRegistry;

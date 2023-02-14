
/* IMPORT */

import type MildMap from 'mild-map';

/* MAIN */

type Node<Value> = MildMap<unknown, Node<Value>> & {
  ref?: {
    deref: () => Value | undefined
  }
};

/* EXPORT */

export type {Node};

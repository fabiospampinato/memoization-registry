
/* IMPORT */

import {describe} from 'fava';
import {setTimeout as delay} from 'node:timers/promises';
import MemoizationRegistry from '../dist/index.js';

/* MAIN */

describe ( 'Memoization Registry', it => {

  it ( 'works', async t => {

    /* REGISTRY */

    const registry = new MemoizationRegistry ();

    class Magic {
      constructor ( id ) {
        cached += 1;
        return registry.register ( [new.target, id], () => {
          cached -= 1;
          computed += 1;
          return this;
        });
      }
    }

    /* DIRECT SUBCLASSING */

    let cached = 0;
    let computed = 0;

    class Foo extends Magic {}

    let foo1 = new Foo ( 'some-id' );

    t.is ( cached, 0 );
    t.is ( computed, 1 );

    let foo2 = new Foo ( 'other-id' );

    t.is ( cached, 0 );
    t.is ( computed, 2 );

    let foo3 = new Foo ( 'some-id' );

    t.is ( cached, 1 );
    t.is ( computed, 2 );

    /* CHECKS */

    t.true ( foo1 instanceof Foo );
    t.true ( foo2 instanceof Foo );
    t.true ( foo3 instanceof Foo );

    t.true ( foo1 !== foo2 );
    t.true ( foo2 !== foo3 );
    t.true ( foo1 === foo3 );

    /* INDIRECT SUBCLASSING */

    cached = 0;
    computed = 0;

    class Bar extends Foo {}

    let bar1 = new Bar ( 'some-id' );

    t.is ( cached, 0 );
    t.is ( computed, 1 );

    let bar2 = new Bar ( 'other-id' );

    t.is ( cached, 0 );
    t.is ( computed, 2 );

    let bar3 = new Bar ( 'some-id' );

    t.is ( cached, 1 );
    t.is ( computed, 2 );

    /* CHECKS */

    t.true ( bar1 instanceof Bar );
    t.true ( bar2 instanceof Bar );
    t.true ( bar3 instanceof Bar );

    t.true ( foo1 !== bar1 );
    t.true ( foo2 !== bar2 );
    t.true ( foo3 !== bar3 );

    t.true ( bar1 !== bar2 );
    t.true ( bar2 !== bar3 );
    t.true ( bar1 === bar3 );

    /* VALUE CLEANUP */

    cached = 0;
    computed = 0;

    foo1 = null;
    foo2 = null;
    foo3 = null;

    bar1 = null;
    bar2 = null;
    bar3 = null;

    await delay ( 500 );
    globalThis.gc ();
    await delay ( 500 );

    let foo4 = new Foo ( 'some-id' );
    let bar4 = new Bar ( 'some-id' );

    t.is ( cached, 0 );
    t.is ( computed, 2 );

    /* KEY CLEANUP */

    let deleted = 0;

    const registry2 = new FinalizationRegistry ( () => deleted += 1 );

    class Baz extends Magic {};

    let object = {};

    const baz1 = new Baz ( object );
    const baz2 = new Baz ( object );

    t.true ( baz1 instanceof Baz );
    t.true ( baz2 instanceof Baz );

    t.true ( baz1 === baz2 );

    registry2.register ( object );

    object = null;

    await delay ( 500 );
    globalThis.gc ();
    await delay ( 500 );

    t.is ( deleted, 1 );

  });

});

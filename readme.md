# Memoization Registry

A generalized multi-key memoization solution that does not leak memory.

## Features

- It supports memoizing on multiple arbitrary keys.
- It supports memoizing things other than function calls too.
- It doesn't hold strong references to memoized values nor memoization keys, unless they are primitives.

## Install

```sh
npm install memoization-registry
```

## Usage

Maybe the best way to explain what this allows for is with an example, how would you write a "Magic" class in such a way that all the following assertions succeeded?

```ts
class Foo extends Magic {}

const foo1 = new Foo ( 'some-id' );
const foo2 = new Foo ( 'other-id' );
const foo3 = new Foo ( 'some-id' );

console.assert ( foo1 !== foo2 );
console.assert ( foo2 !== foo3 );
console.assert ( foo1 === foo3 );

class Bar extends Foo {}

const bar1 = new Bar ( 'some-id' );
const bar2 = new Bar ( 'other-id' );
const bar3 = new Bar ( 'some-id' );

console.assert ( foo1 !== bar1 );
console.assert ( foo2 !== bar2 );
console.assert ( foo3 !== bar3 );

console.assert ( bar1 !== bar2 );
console.assert ( bar2 !== bar3 );
console.assert ( bar1 === bar3 );
```

It may seem borderline impossible to simply make that work without any problems -- basically we want to automatically memoize some class instances, but the thing to memoize is not a regular function call, and we don't want to hold strong references to the memoized values, nor the memoization keys, as that will cause a memory leak.

Here's a solution, enabled by this powerful library:

```ts
import MemoizationRegistry from 'memoization-registry';

const registry = new MemoizationRegistry<[Function, string], Magic> ();

class Magic {
  constructor ( id: string ) {
    const keys = [new.target, id];
    const factory = () => this;
    return registry.register ( keys, factory );
  }
}

class Foo extends Magic {}

const foo1 = new Foo ( 'some-id' );
const foo2 = new Foo ( 'other-id' );
const foo3 = new Foo ( 'some-id' );

console.assert ( foo1 !== foo2 );
console.assert ( foo2 !== foo3 );
console.assert ( foo1 === foo3 );

class Bar extends Foo {}

const bar1 = new Bar ( 'some-id' );
const bar2 = new Bar ( 'other-id' );
const bar3 = new Bar ( 'some-id' );

console.assert ( foo1 !== bar1 );
console.assert ( foo2 !== bar2 );
console.assert ( foo3 !== bar3 );

console.assert ( bar1 !== bar2 );
console.assert ( bar2 !== bar3 );
console.assert ( bar1 === bar3 );
```

## License

MIT © Fabio Spampinato

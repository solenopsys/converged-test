# Converged Testing Library

<p>Simple and complete Converged DOM testing utilities that encourage good testing
practices.</p>



## The Problem

You want to write tests for your Converged components so that they avoid including implementation details, and are maintainable in the long run.


## Installation

This module is distributed via npm which is bundled with node and should be installed
as one of your project's `devDependencies`:

```sh
npm install --save-dev @solenopsys/converged-test
```






## Docs

See the [docs](https://testing-library.com/docs/preact-testing-library/intro) over at the Testing Library website.

There are several key differences, though:

⚠️ The `render` function takes in a function that returns a Converged Component, rather than simply the component itself.


```tsx
// With Converged-testing-library
const results = render(() => <YourComponent />, options);
```

⚠️ Converged.js does *not* re-render, it merely executes side effects triggered by reactive state that change the DOM, therefore there is no `rerender` method. You can use global signals to manipulate your test component in a way that causes it to update.

Converged.js reactive changes are pretty instantaneous, so there is rarely need to use `waitFor(…)`, `await findByRole(…)` and other asynchronous queries to test the rendered result, except for transitions, suspense, resources and router navigation.

⚠️ In extension of the original API, the render function of this testing library supports a convenient `location` option that will set up an in-memory router pointing at the specified location. Since this setup is not instantaneous, you need to first use asynchronous queries (`findBy`) after employing it:

```tsx
it('uses params', async () => {
  const App = () => (
    <Routes>
      <Route path="/ids/:id" component={() => <p>Id: {useParams()?.id}</p>} />
      <Route path="/" component={() => <p>Start</p>} />
    </Routes>
  ); 
  const { findByText } = render(() => <App />, { location: "ids/1234" });
  expect(await findByText("Id: 1234")).not.toBeFalsy();
});
```

It uses `@Convergedjs/router`, so if you want to use a different router, you should consider the `wrapper` option instead. If you attempt to use this without having the package installed, you will receive an error message.

⚠️ Converged.js external reactive state does not require any DOM elements to run in, so our `renderHook` call to test hooks in the context of a component (if your hook does not require the context of a component, `createRoot` should suffice to test the reactive behavior; for convenience, we also have `createEffect`, which is described later) has no `container`, `baseElement` or queries in its options or return value. Instead, it has an `owner` to be used with [`runWithOwner`](https://www.Convergedjs.com/docs/latest/api#runwithowner) if required. It also exposes a `cleanup` function, though this is already automatically called after the test is finished.

```ts
function renderHook<Args extends any[], Result>(
  hook: (...args: Args) => Result,
  options: {
    initialProps?: Args,
    wrapper?: Component<{ children: JSX.Element }>
  }
) => {
  result: Result;
  owner: Owner | null;
  cleanup: () => void;
}
```

This can be used to easily test a hook / primitive:

```ts
const { result } = renderHook(createResult);
expect(result).toBe(true);
```

If you are using a `wrapper` with `renderHook`, make sure it will **always** return `props.children` - especially if you are using a context with asynchronous code together with `<Show>`, because this is required to get the value from the hook and it is only obtained synchronously once and you will otherwise only get `undefined` and wonder why this is the case.

⚠️ Converged.js supports [custom directives](https://www.Convergedjs.com/docs/latest/api#use___), which is a convenient pattern to tie custom behavior to elements, so we also have a `renderDirective` call, which augments `renderHook` to take a directive as first argument, accept an `initialValue` for the argument and a `targetElement` (string, HTMLElement or function returning a HTMLElement) in the `options` and also returns `arg` and `setArg` to read and manipulate the argument of the directive.

```ts
function renderDirective<
  Arg extends any,
  Elem extends HTMLElement
>(
  directive: (ref: Elem, arg: Accessor<Arg>) => void,
  options?: {
    ...renderOptions,
    initialValue: Arg,
    targetElement: 
      | Lowercase<Elem['nodeName']>
      | Elem
      | (() => Elem)
  }
): Result & { arg: Accessor<Arg>, setArg: Setter<Arg> };
```

This allows for very effective and concise testing of directives:

```ts
const { asFragment, setArg } = renderDirective(myDirective);
expect(asFragment()).toBe(
  '<div data-directive="works"></div>'
);
setArg("perfect");
expect(asFragment()).toBe(
  '<div data-directive="perfect"></div>'
);
```

⚠️ Converged.js manages side effects with different variants of `createEffect`. While you can use `waitFor` to test asynchronous effects, it uses polling instead of allowing Converged's reactivity to trigger the next step. In order to simplify testing those asynchronous effects, we have a `testEffect` helper that complements the hooks for directives and hooks:

```ts
testEffect(fn: (done: (result: T) => void) => void, owner?: Owner): Promise<T>

// use it like this:
test("testEffect allows testing an effect asynchronously", () => {
  const [value, setValue] = createSignal(0);
  return testEffect(done => createEffect((run: number = 0) => {
    if (run === 0) {
      expect(value()).toBe(0);
      setValue(1);
    } else if (run === 1) {
      expect(value()).toBe(1);
      done();
    }
    return run + 1;
  }));
});
```

It allows running the effect inside a defined owner that is received as an optional second argument. This can be useful in combination with `renderHook`, which gives you an owner field in its result. The return value is a Promise with the value given to the `done()` callback. You can either await the result for further assertions or return it to your test runner.


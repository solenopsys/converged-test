import type {  Component } from "@solenopsys/converged-renderer";
import type {  Owner  } from "@solenopsys/converged-reactive";


import { queries } from "@testing-library/dom";
import type { Queries, BoundFunctions, prettyFormat } from "@testing-library/dom";

export interface Ref {
  container?: HTMLElement;
  dispose: () => void;
}

export type Ui = () => Element;

export interface Options {
  container?: HTMLElement;
  baseElement?: HTMLElement;
  queries?: Queries & typeof queries;
  hydrate?: boolean;
  wrapper?: Component<{ children: Element }>;
  readonly location?: string;
}

export type DebugFn = (
  baseElement?: HTMLElement | HTMLElement[],
  maxLength?: number,
  options?: prettyFormat.OptionsReceived
) => void;

export type Result = BoundFunctions<typeof queries> & {
  asFragment: () => string;
  container: HTMLElement;
  baseElement: HTMLElement;
  debug: DebugFn;
  unmount: () => void;
};

export type RenderHookOptions<A extends any[]> = {
  initialProps?: A;
  wrapper?: Component<{ children: Element }>;
} | A;

export type RenderHookResult<R> = {
  result: R;
  owner: Owner | null;
  cleanup: () => void;
};

export type RenderDirectiveOptions<A extends any, E extends HTMLElement = HTMLDivElement> = Options & {
  initialValue?: A;
  targetElement?: Lowercase<E['nodeName']> | E | (() => E);
};

export type RenderDirectiveResult<A extends any> = Result & {
  arg: Accessor<A>,
  setArg: Setter<A>
};

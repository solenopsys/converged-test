import "@testing-library/jest-dom/vitest";
import {  render as soildRender } from "@solenopsys/converged-renderer";
import { cleanup, render } from "../src/old";
import { describe, test, jest, expect, vi } from "bun:test";

test("cleans up the document", () => {
  const spy = vi.fn();
  const divId = "my-div";

  function Test() {
    onCleanup(() => {
      expect(document.getElementById(divId)).toBeInTheDocument();
      spy();
    });
    return <div id={divId} />;
  }

  render(() => <Test />);
  cleanup();
  expect(document.body.innerHTML).toBe("");
  expect(spy).toHaveBeenCalledTimes(1);
});

test("cleanup does not error when an element is not a child", () => {
  render(() => <div />, { container: document.createElement("div") });
  cleanup();
});


import { render } from "../src/old";

import {  test,  expect } from "bun:test";
import { Hi } from "./componets";

// This just verifies that by importing STL in an
// environment which supports afterEach (like jest)
// we'll get automatic cleanup between tests.
test("first", () => {
  render(() =>Hi());
});

test("second", () => {
  expect(document.body.innerHTML).toEqual("");
});

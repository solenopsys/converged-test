import { beforeEach,afterEach, test, jest, expect, vi } from "bun:test";
import { useResource, If } from "@solenopsys/converged-renderer";
import { screen, render, waitForElementToBeRemoved } from "../src/old";

const fetchAMessage = () =>
  new Promise<{ returnedMessage: string }>(resolve => {
    // we are using random timeout here to simulate a real-time example
    // of an async operation calling a callback at a non-deterministic time
    const randomTimeout = Math.floor(Math.random() * 100);

    setTimeout(() => {
      resolve({ returnedMessage: "Hello World" });
    }, randomTimeout);
  });

function ComponentWithLoader() {
  const data= useResource( fetchAMessage);
  return (
    <If when={!data.loading} fallback={<div>Loading...</div>}>
      <div data-testid="message">Loaded this message: {data()!.returnedMessage}!</div>
    </If>
  );
}

test("it waits for the data to be loaded", async () => {
  render(() => <ComponentWithLoader />);
  const loading = () => screen.getByText("Loading...");
  await waitForElementToBeRemoved(loading);
  expect(screen.getByTestId("message")).toHaveTextContent(/Hello World/);
});

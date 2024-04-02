import $ from "@solenopsys/converged-reactive";
import { render } from "../src/old";
import { Route, useParams } from "@solidjs/router";
import {describe,it, expect } from "bun:test";

describe("location option", () => {
  const App = () => (
    <>
      <Route path="/ids/:id" component={() => <p>Id: {useParams()?.id}</p>} />
      <Route path="/" component={() => <p>Start</p>} />
    </>
  );

  it("can render the main route", async () => {
    const { findByText } = render(() => <App />, { location: "/" });
    expect(await findByText("Start")).not.toBeFalsy();
  });

  it("can render a route with the id", async () => {
    const { findByText } = render(() => <App />, { location: "/ids/1234" });
    expect(await findByText("Id: 1234")).not.toBeFalsy();
  });

  it("does not use a router without the location option", async () => {
    const NoRouter = () => {
      const state = $("loading");
      catchError(
        () => {
          useParams();
          state("router present");
        },
        () => state("no router present")
      );
      return <p>{state()}</p>;
    };
    const { findByText } = render(() => <NoRouter />);
    expect(await findByText("no router present")).not.toBeFalsy();
  });
});

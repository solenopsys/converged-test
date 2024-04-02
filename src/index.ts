import { Options, Result, Ui } from "./old/types";

function render(ui: Ui, options: Options = {}): Result {
    return {
        asFragment: () => "",
        container: null,
        baseElement: null,
        debug: () => {},
        unmount: () => {},
        ...options
    };
}
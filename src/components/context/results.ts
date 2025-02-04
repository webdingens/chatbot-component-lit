import { createContext } from "@lit/context";

export type Result = {
  text: string;
  type: "assistant" | "user";
};

export const resultsContext = createContext<Result[]>("results");

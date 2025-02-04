import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./prompt-form";
import "./results";
import { Result, resultsContext } from "./context/results";
import { ContextProvider } from "@lit/context";

import styles from "./chatbot.css?raw";
import { fetchingContext } from "./context/fetching";
import { getResultFromPrompt } from "./utils/getResultFromPrompt";

/**
 * An example element.
 */
@customElement("cb-chatbot")
export class CbChatbot extends LitElement {
  @property({ type: String })
  endpoint?: string;

  @property({ type: String })
  context?: string;

  private readonly _results = new ContextProvider(this, {
    context: resultsContext,
    initialValue: [
      {
        text: "System: Hi there! Please tell us what you want to know!",
        type: "assistant",
      },
    ],
  });

  private readonly _fetching = new ContextProvider(this, {
    context: fetchingContext,
    initialValue: false,
  });

  render() {
    return html`
      <h2>Chatbot</h2>
      <cb-results></cb-results>
      <cb-prompt-form @newPrompt=${this._handleNewPrompt}></cb-prompt-form>
    `;
  }

  private async _handleNewPrompt(e: CustomEvent<{ prompt: string }>) {
    if (this._fetching.value) return;
    await this.fetchResponse(e.detail.prompt);
  }

  private async fetchResponse(prompt: string) {
    if (!this.canMakeRequest()) return;

    this.setFetchingState(true);

    this.addResult({
      text: `Frage: ${prompt}`,
      type: "user",
    });

    const result = await getResultFromPrompt(
      prompt,
      this.endpoint!,
      this.context
    );
    this.addResult(result);
    this.setFetchingState(false);
  }

  private canMakeRequest(): boolean {
    return typeof this.endpoint != "undefined" && !this._fetching.value;
  }

  private setFetchingState(isFetching: boolean): void {
    this._fetching.setValue(isFetching);
  }

  private addResult(result: Result): void {
    this._results.setValue([...this._results.value, result]);
  }

  static styles = css([styles] as any);
}

declare global {
  interface HTMLElementTagNameMap {
    "cb-chatbot": CbChatbot;
  }
}

import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import styles from "./prompt-form.css?raw";
import { consume } from "@lit/context";
import { fetchingContext } from "./context/fetching";

/**
 * Prompt Form
 * @event newPrompt - Fired when new results are received
 */
@customElement("cb-prompt-form")
export class CbPromptForm extends LitElement {
  @consume({ context: fetchingContext, subscribe: true })
  @property({ attribute: false })
  fetching?: boolean;

  _handleSubmit(e: SubmitEvent) {
    if (!e.currentTarget) return;
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const detail = Object.fromEntries(formData);

    this.dispatchEvent(
      new CustomEvent("newPrompt", {
        detail,
      })
    );
    this._clearForm();
  }

  _clearForm() {
    const input = this.shadowRoot?.getElementById(
      "prompt"
    ) as HTMLInputElement | null;
    if (!input) return;
    input.value = "";
  }

  render() {
    return html`
      <form @submit=${this._handleSubmit}>
        <label>
          <span>Prompt</span>
          <input name="prompt" id="prompt" />
        </label>
        <button type="submit" ?disabled=${this.fetching}>Submit</button>
      </form>
    `;
  }

  static styles = css([styles] as any);
}

declare global {
  interface HTMLElementTagNameMap {
    "cb-prompt-form": CbPromptForm;
  }
}

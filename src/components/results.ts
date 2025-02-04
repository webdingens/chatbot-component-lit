import { consume } from "@lit/context";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Result, resultsContext } from "./context/results";

import styles from "./results.css?raw";

/**
 * Results
 * @property {}
 */
@customElement("cb-results")
export class CbResults extends LitElement {
  @consume({ context: resultsContext, subscribe: true })
  @property({ attribute: false })
  results?: Result[];

  _handleSubmit(e: SubmitEvent) {
    if (!e.target) return;
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    this.dispatchEvent(
      new CustomEvent("newPrompt", {
        detail: Object.fromEntries(formData),
      })
    );
  }

  render() {
    if (!this.results || this.results.length === 0)
      return html` <p>What would you like to know?</p> `;

    return html`
      <ul>
        ${this.results.map((result) => html` <li>${result.text}</li> `)}
      </ul>
    `;
  }

  static styles = css([styles] as any);
}

declare global {
  interface HTMLElementTagNameMap {
    "cb-results": CbResults;
  }
}

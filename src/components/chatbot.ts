import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import './prompt-form'
import './results'
import { resultsContext } from './context/results'
import { ContextProvider } from '@lit/context'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('cb-chatbot')
export class CbChatbot extends LitElement {
  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

  private readonly _results = new ContextProvider(this, {context: resultsContext, initialValue: [{text: 'Hi there! Please tell us what you want to know!', type: 'assistant' }]});

  render() {
    return html`
      <div>Test??</div>
      <slot></slot>
      <cb-results></cb-results>
      <cb-prompt-form @newPrompt=${this._handleNewPrompt}></cb-prompt-form>
    `
  }

  private _handleNewPrompt(e: CustomEvent<{ prompt: string }>) {
    this._results.setValue([...this._results.value, {
      text: e.detail.prompt,
      type: 'user'
    }])
    this.requestUpdate()
  }

  static styles = css`
    :host {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      color: #000;

      border-radius: 5px;
      padding: 1em;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'cb-chatbot': CbChatbot
  }
}

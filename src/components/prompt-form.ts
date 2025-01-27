import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

/**
 * Prompt Form
 * @event newPrompt - Fired when new results are received
 */
@customElement('cb-prompt-form')
export class CbPromptForm extends LitElement {
  _handleSubmit(e: SubmitEvent) {
    if (!e.currentTarget) return
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement);
    const detail = Object.fromEntries(formData)

    this.dispatchEvent(new CustomEvent('newPrompt', {
      detail
    }))
    this._clearForm()
  }

  _clearForm() {
    const input = this.shadowRoot?.getElementById('prompt') as HTMLInputElement | null
    if (!input) return
    input.value = ''
  }

  render() {
    return html`
      <form @submit=${this._handleSubmit}>
        <label>
          Prompt
          <input name="prompt" id="prompt" />
        </label>
        <button type="submit">Submit</button>
      </form>
    `
  }

  static styles = css`
    form {
      outline: 1px solid red;
      background: inherit;
    }

    input {
      border: 1px dashed green;
      background: inherit;
      color: inherit;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'cb-prompt-form': CbPromptForm
  }
}

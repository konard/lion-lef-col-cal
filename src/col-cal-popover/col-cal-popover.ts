import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { colCalPopoverStyles } from "./col-cal-popover.css";

@customElement("col-cal-popover")
export class ColCalPopover extends LitElement {
  static styles = colCalPopoverStyles;

  @property({ type: String }) for: string = "";
  @property({ type: String }) dataTestid: string = "ColCal-Popover";

  @state()
  private _open: boolean = false;

  private _anchorElement: HTMLElement | null = null;
  private _anchorName: string = "";

  connectedCallback(): void {
    super.connectedCallback();
    this._setupAnchor();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._cleanupAnchor();
  }

  private _setupAnchor(): void {
    requestAnimationFrame(() => {
      if (this.for) {
        const root = this.getRootNode() as Document | ShadowRoot;
        this._anchorElement = root.getElementById(this.for);
        if (this._anchorElement) {
          // Create unique anchor name from the element's ID
          this._anchorName = `--anchor-${this.for}`;
          // Set anchor-name on the target element
          this._anchorElement.style.setProperty("anchor-name", this._anchorName);
          this._anchorElement.addEventListener("click", this._handleAnchorClick);
        }
      }
    });
  }

  private _cleanupAnchor(): void {
    if (this._anchorElement) {
      this._anchorElement.removeEventListener("click", this._handleAnchorClick);
      // Remove anchor-name from the element
      this._anchorElement.style.removeProperty("anchor-name");
    }
  }

  private _handleAnchorClick = (): void => {
    this.show();
  };

  public show(): void {
    this._open = true;
    this.dispatchEvent(new CustomEvent("col-cal-show", { bubbles: true, composed: true }));
  }

  public hide(): void {
    this._open = false;
    this.dispatchEvent(new CustomEvent("col-cal-after-hide", { bubbles: true, composed: true }));
  }

  private _handleBackdropClick = (): void => {
    this.hide();
  };

  render() {
    return html`
      ${this._open
        ? html`<div
            class="popover-backdrop"
            @click=${this._handleBackdropClick}
          ></div>`
        : null}
      <div
        class="popover-container"
        ?data-open=${this._open}
        style="--popover-anchor: ${this._anchorName}"
        data-testid="${this.dataTestid}"
      >
        <div class="popover-content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "col-cal-popover": ColCalPopover;
  }
}

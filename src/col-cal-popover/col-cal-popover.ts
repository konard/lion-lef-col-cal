import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { colCalPopoverStyles } from "./col-cal-popover.css";

@customElement("col-cal-popover")
export class ColCalPopover extends LitElement {
  static styles = colCalPopoverStyles;

  @property({ type: String }) for: string = "";
  @property({ type: String }) position: "top" | "bottom" | "left" | "right" = "bottom";
  @property({ type: String }) dataTestid: string = "ColCal-Popover";

  @state()
  private _open: boolean = false;

  @state()
  private _top: number = 0;

  @state()
  private _left: number = 0;

  private _anchorElement: HTMLElement | null = null;

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
          this._anchorElement.addEventListener("click", this._handleAnchorClick);
        }
      }
    });
  }

  private _cleanupAnchor(): void {
    if (this._anchorElement) {
      this._anchorElement.removeEventListener("click", this._handleAnchorClick);
    }
  }

  private _handleAnchorClick = (): void => {
    this.show();
  };

  private _updatePosition(): void {
    if (!this._anchorElement) return;

    const anchorRect = this._anchorElement.getBoundingClientRect();
    const popoverRect = this.getBoundingClientRect();

    switch (this.position) {
      case "bottom":
        this._top = anchorRect.bottom + 4;
        this._left = anchorRect.left + (anchorRect.width / 2) - (popoverRect.width / 2);
        break;
      case "top":
        this._top = anchorRect.top - popoverRect.height - 4;
        this._left = anchorRect.left + (anchorRect.width / 2) - (popoverRect.width / 2);
        break;
      case "left":
        this._top = anchorRect.top + (anchorRect.height / 2) - (popoverRect.height / 2);
        this._left = anchorRect.left - popoverRect.width - 4;
        break;
      case "right":
        this._top = anchorRect.top + (anchorRect.height / 2) - (popoverRect.height / 2);
        this._left = anchorRect.right + 4;
        break;
    }

    // Ensure popover stays within viewport
    const maxLeft = window.innerWidth - popoverRect.width - 8;
    const maxTop = window.innerHeight - popoverRect.height - 8;
    this._left = Math.max(8, Math.min(this._left, maxLeft));
    this._top = Math.max(8, Math.min(this._top, maxTop));
  }

  public show(): void {
    this._open = true;
    requestAnimationFrame(() => {
      this._updatePosition();
    });
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
        style="top: ${this._top}px; left: ${this._left}px;"
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

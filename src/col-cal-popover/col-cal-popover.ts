import { colCalPopoverStyles } from "./col-cal-popover.css";

/**
 * Feature detection for native Popover API support.
 * The Popover API is available in Chrome 114+, Edge 114+, Safari 17+.
 * @returns true if the browser supports the native Popover API
 */
export function supportsPopoverAPI(): boolean {
  return (
    typeof HTMLElement !== "undefined" &&
    "popover" in HTMLElement.prototype &&
    typeof HTMLElement.prototype.showPopover === "function" &&
    typeof HTMLElement.prototype.hidePopover === "function"
  );
}

/**
 * ColCalPopover - A calendar popover component using the native HTML Popover API.
 *
 * This component leverages the browser's native popover functionality for better
 * accessibility, performance, and standards compliance. It uses:
 * - The `popover="auto"` attribute for automatic light-dismiss behavior
 * - The `:popover-open` CSS pseudo-selector for styling open state
 * - CSS anchor positioning for placement relative to trigger elements
 *
 * For browsers that don't support the Popover API, it provides graceful
 * degradation using a JavaScript-based fallback mechanism.
 *
 * @fires col-cal-show - Fired when the popover is shown
 * @fires col-cal-after-hide - Fired when the popover is hidden
 *
 * @example
 * ```html
 * <button id="trigger">Open Calendar</button>
 * <col-cal-popover for="trigger">
 *   <div>Popover content</div>
 * </col-cal-popover>
 * ```
 */
export class ColCalPopover extends HTMLElement {
  private _for: string = "";
  private _dataTestid: string = "ColCal-Popover";
  private _open: boolean = false;
  private _supportsNativePopover: boolean = supportsPopoverAPI();
  private _anchorElement: HTMLElement | null = null;
  private _anchorName: string = "";
  private _popoverElement: HTMLElement | null = null;
  private _backdropElement: HTMLElement | null = null;

  static get observedAttributes(): string[] {
    return ["for", "data-testid"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  /**
   * The ID of the anchor element that triggers this popover.
   * The popover will be positioned relative to this element.
   */
  get for(): string {
    return this._for;
  }

  set for(value: string) {
    this._for = value;
    this.setAttribute("for", value);
  }

  /**
   * Data-testid attribute for testing purposes.
   */
  get dataTestid(): string {
    return this._dataTestid;
  }

  set dataTestid(value: string) {
    this._dataTestid = value;
    this.setAttribute("data-testid", value);
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    switch (name) {
      case "for":
        this._for = newValue ?? "";
        if (this.isConnected) {
          this._setupAnchor();
        }
        break;
      case "data-testid":
        this._dataTestid = newValue ?? "ColCal-Popover";
        this._updateTestId();
        break;
    }
  }

  connectedCallback(): void {
    this._render();
    this._setupAnchor();
  }

  disconnectedCallback(): void {
    this._cleanupAnchor();
  }

  private _updateTestId(): void {
    if (this._popoverElement) {
      this._popoverElement.setAttribute("data-testid", this._dataTestid);
    }
  }

  /**
   * Sets up the anchor element reference and configures the trigger.
   * In native mode, sets up popovertarget attribute on the anchor.
   * In fallback mode, adds click event listener.
   */
  private _setupAnchor(): void {
    requestAnimationFrame(() => {
      if (this._for) {
        const root = this.getRootNode();
        // Check if root has getElementById (Document or ShadowRoot, but not Element)
        if (!("getElementById" in root) || typeof (root as Document | ShadowRoot).getElementById !== "function") {
          return;
        }
        this._anchorElement = (root as Document | ShadowRoot).getElementById(this._for);
        if (this._anchorElement) {
          // Create unique anchor name from the element's ID for CSS anchor positioning
          this._anchorName = `--anchor-${this._for}`;
          // Set anchor-name CSS property on the target element
          this._anchorElement.style.setProperty("anchor-name", this._anchorName);

          // Update popover element's anchor reference
          if (this._popoverElement) {
            this._popoverElement.style.setProperty("--popover-anchor", this._anchorName);
          }

          if (this._supportsNativePopover) {
            // Use native popovertarget attribute for the trigger
            if (this._popoverElement && this._anchorElement) {
              // Generate a unique ID for the popover element if needed
              const popoverId = `popover-${this._for}`;
              this._popoverElement.id = popoverId;
              // Set popovertarget on the anchor element
              this._anchorElement.setAttribute("popovertarget", popoverId);
              this._anchorElement.setAttribute("popovertargetaction", "toggle");
            }
          } else {
            // Fallback: use click listener for browsers without popover support
            this._anchorElement.addEventListener("click", this._handleAnchorClick);
          }
        }
      }
    });
  }

  /**
   * Cleans up event listeners and CSS properties when disconnected.
   */
  private _cleanupAnchor(): void {
    if (this._anchorElement) {
      this._anchorElement.removeEventListener("click", this._handleAnchorClick);
      // Remove anchor-name from the element
      this._anchorElement.style.removeProperty("anchor-name");
      // Remove popovertarget attributes
      this._anchorElement.removeAttribute("popovertarget");
      this._anchorElement.removeAttribute("popovertargetaction");
    }
  }

  /**
   * Handles click on anchor element (fallback mode only).
   */
  private _handleAnchorClick = (): void => {
    this.show();
  };

  /**
   * Shows the popover.
   * Uses native showPopover() API when available, falls back to state toggle.
   */
  public show(): void {
    if (this._supportsNativePopover && this._popoverElement) {
      try {
        this._popoverElement.showPopover();
      } catch {
        // Popover might already be open, ignore error
      }
    }
    this._open = true;
    this._updateOpenState();
    this.dispatchEvent(new CustomEvent("col-cal-show", { bubbles: true, composed: true }));
  }

  /**
   * Hides the popover.
   * Uses native hidePopover() API when available, falls back to state toggle.
   */
  public hide(): void {
    if (this._supportsNativePopover && this._popoverElement) {
      try {
        this._popoverElement.hidePopover();
      } catch {
        // Popover might already be hidden, ignore error
      }
    }
    this._open = false;
    this._updateOpenState();
    this.dispatchEvent(new CustomEvent("col-cal-after-hide", { bubbles: true, composed: true }));
  }

  /**
   * Updates the open state in fallback mode
   */
  private _updateOpenState(): void {
    if (!this._supportsNativePopover) {
      if (this._popoverElement) {
        if (this._open) {
          this._popoverElement.setAttribute("data-open", "");
        } else {
          this._popoverElement.removeAttribute("data-open");
        }
      }
      // Handle backdrop visibility
      if (this._backdropElement) {
        this._backdropElement.style.display = this._open ? "block" : "none";
      }
    }
  }

  /**
   * Handles click on backdrop (fallback mode only).
   * In native mode, the popover auto-dismisses via light-dismiss behavior.
   */
  private _handleBackdropClick = (): void => {
    this.hide();
  };

  /**
   * Handles the native 'toggle' event from the Popover API.
   * This event fires when the popover state changes.
   */
  private _handlePopoverToggle = (event: Event): void => {
    const toggleEvent = event as ToggleEvent;
    if (toggleEvent.newState === "open") {
      this._open = true;
      this.dispatchEvent(new CustomEvent("col-cal-show", { bubbles: true, composed: true }));
    } else if (toggleEvent.newState === "closed") {
      this._open = false;
      this.dispatchEvent(new CustomEvent("col-cal-after-hide", { bubbles: true, composed: true }));
    }
  };

  private _render(): void {
    if (!this.shadowRoot) return;

    // Create style element
    const style = document.createElement("style");
    style.textContent = colCalPopoverStyles;

    // Create content based on native popover support
    if (this._supportsNativePopover) {
      this._renderNativePopover();
    } else {
      this._renderFallbackPopover();
    }

    // Prepend style
    this.shadowRoot.prepend(style);
  }

  /**
   * Renders the popover using native Popover API.
   * Uses popover="auto" for automatic light-dismiss behavior.
   */
  private _renderNativePopover(): void {
    if (!this.shadowRoot) return;

    const container = document.createElement("div");
    container.className = "popover-container";
    container.setAttribute("popover", "auto");
    container.style.setProperty("--popover-anchor", this._anchorName);
    container.setAttribute("data-testid", this._dataTestid);
    container.addEventListener("toggle", this._handlePopoverToggle);

    const content = document.createElement("div");
    content.className = "popover-content";

    const slot = document.createElement("slot");
    content.appendChild(slot);
    container.appendChild(content);

    this._popoverElement = container;
    this.shadowRoot.appendChild(container);
  }

  /**
   * Renders the popover using fallback mechanism for browsers
   * that don't support the native Popover API.
   * Uses a backdrop element for light-dismiss behavior.
   */
  private _renderFallbackPopover(): void {
    if (!this.shadowRoot) return;

    // Create backdrop
    const backdrop = document.createElement("div");
    backdrop.className = "popover-backdrop";
    backdrop.style.display = "none";
    backdrop.addEventListener("click", this._handleBackdropClick);
    this._backdropElement = backdrop;

    // Create container
    const container = document.createElement("div");
    container.className = "popover-container";
    container.style.setProperty("--popover-anchor", this._anchorName);
    container.setAttribute("data-testid", this._dataTestid);

    const content = document.createElement("div");
    content.className = "popover-content";

    const slot = document.createElement("slot");
    content.appendChild(slot);
    container.appendChild(content);

    this._popoverElement = container;

    this.shadowRoot.appendChild(backdrop);
    this.shadowRoot.appendChild(container);
  }
}

// Register the custom element
customElements.define("col-cal-popover", ColCalPopover);

declare global {
  interface HTMLElementTagNameMap {
    "col-cal-popover": ColCalPopover;
  }
}

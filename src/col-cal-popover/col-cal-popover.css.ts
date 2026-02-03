/**
 * Styles for ColCalPopover component.
 *
 * This stylesheet uses the native Popover API's :popover-open pseudo-selector
 * for styling the open state, with fallback styles for browsers that don't
 * support the Popover API.
 *
 * CSS Anchor Positioning is used to position the popover relative to its
 * anchor element (the trigger button).
 */
export const colCalPopoverStyles = `
  :host {
    /* CSS Custom Properties for theming */
    --col-cal-popover-bg: #ffffff;
    --col-cal-popover-radius: 8px;
    --col-cal-popover-shadow: 0px 4px 9.8px 0px #0000000d;
    --col-cal-popover-z-index: 1000;
    --col-cal-popover-gap: 4px;
  }

  /**
   * Native Popover API Styles
   *
   * When using the native popover attribute, the browser handles:
   * - Top layer placement (no z-index needed)
   * - Light-dismiss behavior
   * - Focus management
   * - Accessibility announcements
   *
   * The :popover-open pseudo-selector targets the popover when visible.
   */
  .popover-container[popover] {
    /* Reset browser default popover styles */
    margin: 0;
    padding: 0;
    border: none;
    overflow: visible;
    background: transparent;

    /* Use CSS anchor positioning for placement */
    position-anchor: var(--popover-anchor);

    /* Position below anchor, centered horizontally */
    top: anchor(bottom);
    left: anchor(center);
    translate: -50% 0;
    margin-top: var(--col-cal-popover-gap);

    /* Fallback: flip above if overflows bottom of viewport */
    position-try-fallbacks: flip-block;

    /* Hide if no valid anchor position available */
    position-visibility: anchors-visible;
  }

  /**
   * :popover-open pseudo-selector
   *
   * This selector matches when the popover is in its open state.
   * It's automatically applied by the browser when showPopover() is called
   * or when the popover is triggered via popovertarget.
   */
  .popover-container[popover]:popover-open {
    display: block;
  }

  /**
   * Popover content wrapper
   *
   * Provides the visual styling (background, shadow, border-radius)
   * for both native and fallback modes.
   */
  .popover-content {
    background: var(--col-cal-popover-bg);
    border-radius: var(--col-cal-popover-radius);
    box-shadow: var(--col-cal-popover-shadow);
  }

  /**
   * Fallback Styles
   *
   * For browsers that don't support the native Popover API,
   * these styles provide similar functionality using:
   * - Fixed positioning with CSS anchor positioning
   * - data-open attribute for visibility toggle
   * - Backdrop element for light-dismiss
   */
  .popover-container:not([popover]) {
    position: fixed;
    position-anchor: var(--popover-anchor);
    display: none;
    z-index: var(--col-cal-popover-z-index);

    /* Position below anchor, centered horizontally */
    top: anchor(bottom);
    left: anchor(center);
    translate: -50% 0;
    margin-top: var(--col-cal-popover-gap);

    /* Fallback: flip above if overflows bottom */
    position-try-fallbacks: flip-block;

    /* Hide if no position works */
    position-visibility: anchors-visible;
  }

  /**
   * Fallback open state
   * Uses data-open attribute since :popover-open isn't available
   */
  .popover-container:not([popover])[data-open] {
    display: block;
  }

  /**
   * Backdrop for fallback mode
   *
   * Provides light-dismiss functionality by catching clicks outside
   * the popover content. In native mode, this is handled automatically
   * by the browser when using popover="auto".
   */
  .popover-backdrop {
    position: fixed;
    inset: 0;
    z-index: calc(var(--col-cal-popover-z-index) - 1);
    background: transparent;
  }
`;

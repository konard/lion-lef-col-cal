import { css } from "lit";

export const colCalPopoverStyles = css`
  :host {
    --col-cal-popover-bg: #ffffff;
    --col-cal-popover-radius: 8px;
    --col-cal-popover-shadow: 0px 4px 9.8px 0px #0000000d;
    --col-cal-popover-z-index: 1000;
    --col-cal-popover-gap: 4px;
  }

  .popover-container {
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

  .popover-container[data-open] {
    display: block;
  }

  .popover-content {
    background: var(--col-cal-popover-bg);
    border-radius: var(--col-cal-popover-radius);
    box-shadow: var(--col-cal-popover-shadow);
  }

  .popover-backdrop {
    position: fixed;
    inset: 0;
    z-index: calc(var(--col-cal-popover-z-index) - 1);
    background: transparent;
  }
`;

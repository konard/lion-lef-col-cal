import { css } from "lit";

export const colCalPopoverStyles = css`
  :host {
    --col-cal-popover-bg: #ffffff;
    --col-cal-popover-radius: 8px;
    --col-cal-popover-shadow: 0px 4px 9.8px 0px #0000000d;
    --col-cal-popover-z-index: 1000;
  }

  .popover-container {
    position: fixed;
    display: none;
    z-index: var(--col-cal-popover-z-index);
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

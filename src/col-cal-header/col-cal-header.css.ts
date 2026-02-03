import { css } from "lit";

export const colCalHeaderStyles = css`
  :host {
    --col-cal-header-padding: 0;
    --col-cal-header-days-font-weight: regular;
    --col-cal-header-days-color: #757d8a;
    --col-cal-header-days-font-size: 12px;
    --col-cal-header-button-color-hover: #77a6ff;
    --col-cal-header-buttons-disabled-color: #a6a3ad;
    --col-cal-header-background-color: #ecf3ff;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding: var(--col-cal-header-padding, 0.5rem);
  }
  .header__buttons {
    & button {
      background: none;
      border: none;
      cursor: pointer;
      &:hover {
        color: var(--col-cal-header-button-color-hover);
        background-color: var(--col-cal-header-background-color);
      }
      &:disabled {
        color: var(--col-cal-header-buttons-disabled-color, black);
        &:hover {
          color: var(--col-cal-header-buttons-disabled-color, black);
        }
      }
    }
  }
  .week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: var(--col-cal-text-align, center);
    padding-block: var(--col-cal-header-padding-vertical, 1rem);
  }
  .day-header {
    font-size: var(--col-cal-header-days-font-size, 12px);
    color: var(--col-cal-header-days-color, black);
    font-weight: var(--col-cal-header-days-font-weight, regular);
  }
`;

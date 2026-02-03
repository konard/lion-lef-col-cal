import { css } from "lit";

export const colCalDatesStyles = css`
  :host {
    --col-cal-day-bg: #ffffff;
    --col-cal-day-hover-bg: #77a6ff;
    --col-cal-day-hover-color: #ffffff;
    --col-cal-day-selected-bg: #f2f7ff;
    --col-cal-day-selected-color: #77a6ff;
    --col-cal-day-disable-color: #d5d5d6;
    --col-cal-day-radius: 16px;
    --col-cal-day-padding: 7px 8.7px;
  }

  .week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: var(--col-cal-day-gap);
    margin-bottom: var(--col-cal-day-bottom);
  }

  .day-header {
    text-align: center;
    color: var(--day-header-color);
  }

  .day {
    text-align: center;
    font-size: var(--col-cal-day-font-size, 14px);
    padding: var(--col-cal-day-padding);
    border-radius: var(--col-cal-day-radius, 0);
    appearance: none;
    border: 0;
    outline: 0;
    background: transparent;
    cursor: pointer;
    position: relative;
  }

  .day:hover {
    color: var(--col-cal-day-hover-color, white);
    background: var(--col-cal-day-hover-bg, #f0f0f0);
  }

  .day.selected {
    background: var(--col-cal-day-selected-bg, #007bff);
    color: var(--col-cal-day-selected-color);
  }

  .day.disabled {
    color: var(--col-cal-day-disable-color, #cccccc);
    cursor: default;
    &:hover {
      background-color: var(
        --col-cal-day-disable-background-color,
        transparent
      );
    }
  }
`;

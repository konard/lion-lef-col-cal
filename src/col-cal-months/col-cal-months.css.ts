export const colCalMonthsStyles = `
  :host {
    --col-cal-months-padding: 12px;
    --col-cal-months-gap: 12px;
    --col-cal-months-border-radius: 5px;
    --col-cal-months-cell-padding: 9px 18.5px;
    --col-cal-months-cell-radius: 16px;
    --col-cal-months-cell-selected-color: #77a6ff;
    --col-cal-months-cell-selected: #f2f7ff;
    --col-cal-months-cell-hover: #77a6ff;
    --col-cal-months-border-color: #9cbeff;
  }
  .month-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border-width: var(--col-cal-months-border-width, 1px);
    border-style: solid;
    border-color: var(--col-cal-months-border-color, black);
    border-radius: var(--col-cal-months-border-radius, 0);
    gap: var(--col-cal-months-gap, 1rem);
    padding: var(--col-cal-months-padding, 1rem);
    background: var(--col-cal-bg);
  }

  .month-cell {
    text-align: var(--col-cal-text-align, center);
    font-size: var(--col-cal-months-cell-font-size, 12px);
    line-height: 100%;
    padding: var(--col-cal-months-cell-padding, 15px);
    border-radius: var(--col-cal-months-cell-radius, 5px);
    cursor: pointer;
    &:hover {
      background-color: var(--col-cal-months-cell-hover, cyan);
    }
  }

  .month-cell.selected {
    background-color: var(--col-cal-months-cell-selected, blue);
    color: var(--col-cal-months-cell-selected-color, white);
    font-weight: var(--col-cal-months-cell-font-weight, regular);
  }
  .month-cell.disabled {
    cursor: default;
    &:hover {
      background: var(--col-cal-disabled-color-bg, transparent);
    }
  }
`;

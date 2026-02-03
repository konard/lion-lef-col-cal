export const colCalYearsStyles = `
  :host {
    --col-cal-years-padding: 12px;
    --col-cal-years-border-radius: 5px;
    --col-cal-years-cell-radius: 16px;
    --col-cal-years-cell-padding: 7.5px 13.5px;
    --col-cal-years-cell-selected: #f2f7ff;
    --col-cal-years-cell-selected-color: #77a6ff;
    --col-cal-years-gap: 12px;
    --col-cal-years-cell-hover: #77a6ff;
    --col-cal-years-border-color: #9cbeff;
  }
  .year-grid {
    display: grid;
    border-width: var(--col-cal-years-border-width, 1px);
    border-style: solid;
    border-radius: var(--col-cal-years-border-radius, 0);
    padding: var(--col-cal-years-padding, 1rem);
    border-color: var(--col-cal-years-border-color, black);
    background: var(--col-cal-bg);
  }

  .years {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--col-cal-years-gap, 10px);
  }

  .year-cell {
    padding: var(--col-cal-years-cell-padding, 1rem);
    text-align: center;
    line-height: 100%;
    font-size: var(--col-cal-years-cell-font-size, 12px);
    border-radius: var(--col-cal-years-cell-radius, 5px);
    cursor: pointer;
    &:hover {
      background-color: var(--col-cal-years-cell-hover);
    }
  }

  .year-cell.selected {
    background-color: var(--col-cal-years-cell-selected, black);
    color: var(--col-cal-years-cell-selected-color, white);
    font-weight: normal;
  }

  .year-cell.disabled {
    cursor: default;
    color: var(--col-cal-years-disabled-color);
    background-color: var(--col-years-disabled-bg-color, transparent);
  }

  .navigation {
    display: flex;
    padding: var(--col-cal-years-buttons-padding, 8px);
    gap: var(--col-cal-years-buttons-gap, 0px);
    justify-content: center;
  }

  .navigation button {
    cursor: pointer;
    padding: 0;
    outline: 0;
    background: none;
    border: none;
  }

  .navigation button:disabled {
    background: var(--col-cal-years-buttons-disabled-bg);
    color: var(--col-cal-years-buttons-disabled-color);
    cursor: not-allowed;
  }
`;

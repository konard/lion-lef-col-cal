export const colCalStyles = `
  .calendar {
    --col-cal-bg: #ffffff;
    --col-cal-radius: 10px;
    --col-cal-padding: 12px;
    --col-cal-shadow: 0px 4px 9.8px 0px #0000000d;
    display: inline-block;
    position: relative;
    overflow: hidden;
    background: var(--calendar-bg);
    border-radius: var(--col-cal-radius, 8px);
    box-shadow: var(--col-cal-shadow);
    padding: var(--col-cal-padding, 0.5rem);
  }

  .calendar col-cal-months {
    margin-left: 10px;
  }
  .calendar col-cal-years {
    margin-left: 70px;
  }
  .calendar .calendar__header-date {
    display: flex;
    gap: 15px;
    & button {
      appearance: none;
      background: none;
      outline: 0;
      border: 0;
      color: var(--col-cal-header-button-color);
      font-weight: var(--col-cal-header-font-weight, bold);
    }
  }

  /* Custom popover with CSS anchor positioning */
  .calendar-popover {
    position: fixed;
    display: none;
    z-index: 1000;
    background: var(--col-cal-bg, #ffffff);
    border-radius: var(--col-cal-radius, 8px);
    box-shadow: var(--col-cal-shadow, 0px 4px 9.8px 0px #0000000d);
  }

  .calendar-popover[open] {
    display: block;
  }

  .calendar-popover-backdrop {
    position: fixed;
    inset: 0;
    z-index: 999;
    background: transparent;
  }
`;

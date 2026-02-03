import { html, type TemplateResult } from "lit";
import { formatDate, getWeeks } from "../date.utils";

export function renderColCalHeader(
  _component: unknown,
  date: Date,
  locale: string,
  dataTestid: string,
  handlePrevMonth: () => void,
  handleNextMonth: () => void,
  isMinDisabled: boolean,
  isMaxDisabled: boolean
): TemplateResult {
  return html`
    <div class="header" part="header" data-testid="${dataTestid}">
      <slot
        class="header__date"
        name="header-date"
        part="header-date"
        data-testid="${`${dataTestid}-HeaderDate`}"
      >
        ${formatDate(date, "MMMM yyyy", locale)}
      </slot>
      <div class="header__buttons" data-testid="${`${dataTestid}-Header-Buttons`}">
        <button
          part="left-button"
          class="left-button"
          ?disabled="${isMinDisabled}"
          data-testid="${`${dataTestid}-Header-LeftButton`}"
          @click=${handlePrevMonth}
        >
          <slot
            name="icon-left-button"
            data-testid="${`${dataTestid}-Header-IconLeftButton`}"
          >
            &lt;
          </slot>
        </button>
        <button
          class="right-button"
          part="right-button"
          data-testid="${`${dataTestid}-Header-IconRightButton`}"
          ?disabled="${isMaxDisabled}"
          @click=${handleNextMonth}
        >
          <slot
            name="icon-right-button"
            data-testid="${`${dataTestid}-Header-IconRight`}"
          >
            &gt;
          </slot>
        </button>
      </div>
    </div>

    <div class="week" data-testid="${`${dataTestid}-Header-Week`}">
      ${getWeeks(locale).map(
        (dayWeek) => html`<span
          class="day-header"
          data-testid="${`${dataTestid}-Header-DayHeader`}"
          >${dayWeek}</span
        >`
      )}
    </div>
  `;
}

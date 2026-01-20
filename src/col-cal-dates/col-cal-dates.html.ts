import { html, type TemplateResult } from "lit";
import { formatDate, isSameDay, isSameMonth } from "../date.utils";

export interface DatesTemplateData {
  days: Date[];
  selectedDate: Date | null;
  dataTestid: string;
  locale: string;
  isDateDisabled: (date: Date) => boolean;
  handleDateSelect: (date: Date) => void;
}

export function renderColCalDates(data: DatesTemplateData): TemplateResult {
  const { days, selectedDate, dataTestid, locale, isDateDisabled, handleDateSelect } = data;

  return html`
    <div class="week" data-testid="${dataTestid}">
      ${days.map((date) => {
        const isSelected =
          selectedDate &&
          isSameMonth(date, selectedDate) &&
          isSameDay(date, selectedDate);

        const isDisabled = isDateDisabled(date);
        return html`
          <button
            data-testid="${`${dataTestid}-Day`}"
            class="day ${isSelected && !isDisabled ? "selected" : ""} ${isDisabled ? "disabled" : ""}"
            @click=${() => handleDateSelect(date)}
            aria-label=${formatDate(date, "PPP", locale)}
            role="gridcell"
          >
            ${date.getDate()}
          </button>
        `;
      })}
    </div>
  `;
}

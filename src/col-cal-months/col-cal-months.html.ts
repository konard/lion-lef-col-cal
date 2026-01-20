import { html, type TemplateResult } from "lit";
import { getMonths } from "../date.utils";

export interface MonthsTemplateData {
  locale: string;
  dataTestid: string;
  isSelected: (month: string) => boolean;
  isDisabled: (month: string) => boolean;
  handleMonthSelect: (month: string) => void;
}

export function renderColCalMonths(data: MonthsTemplateData): TemplateResult {
  const { locale, dataTestid, isSelected, isDisabled, handleMonthSelect } = data;

  return html`
    <div class="month-grid" part="months" data-testid="${`${dataTestid}-Months`}">
      ${getMonths(locale).map(
        (month: string) => html`
          <div
            data-testid="${`${dataTestid}-Months-Cell`}"
            part="month"
            class="month-cell ${isSelected(month) ? "selected" : ""} ${isDisabled(month) && !isSelected(month) ? "disabled" : ""}"
            @click=${() => {
              if (!isDisabled(month)) handleMonthSelect(month);
            }}
            aria-selected=${isSelected(month)}
          >
            ${month}
          </div>
        `
      )}
    </div>
  `;
}

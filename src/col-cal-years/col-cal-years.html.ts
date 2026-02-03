import { html, type TemplateResult } from "lit";

export interface YearsTemplateData {
  dataTestid: string;
  years: string[];
  isSelectedYear: (year: string) => boolean;
  isYearDisabled: (year: number) => boolean;
  handlePrev: () => void;
  handleNext: () => void;
  handleYearSelect: (year: number) => void;
}

export function renderColCalYears(data: YearsTemplateData): TemplateResult {
  const {
    dataTestid,
    years,
    isSelectedYear,
    isYearDisabled,
    handlePrev,
    handleNext,
    handleYearSelect,
  } = data;

  return html`
    <div class="year-grid" data-testid="${`${dataTestid}-Grid`}">
      <div class="navigation" data-testid="${`${dataTestid}-Navigation`}">
        <button @click=${handlePrev} data-testid="${`${dataTestid}-Button-Prev`}">
          <slot name="icon-left-button" data-testid="${`${dataTestid}-Button-Left`}">
            &lt;
          </slot>
        </button>

        <button @click=${handleNext} data-testid="${`${dataTestid}-Button-Next`}">
          <slot name="icon-right-button" data-testid="${`${dataTestid}-Button-NextIcon`}">
            &gt;
          </slot>
        </button>
      </div>

      <div class="years" data-testid="${`${dataTestid}`}">
        ${years.map(
          (year) => html`
            <div
              data-testid="${`${dataTestid}-YearCell`}"
              class="year-cell ${isSelectedYear(year) ? "selected" : ""} ${isYearDisabled(Number(year)) && !isSelectedYear(year) ? "disabled" : ""}"
              @click=${() => {
                if (!isYearDisabled(Number(year))) {
                  handleYearSelect(Number(year));
                }
              }}
              part="year ${isYearDisabled(Number(year)) && !isSelectedYear(year) ? "disabled" : ""}"
              aria-selected=${isSelectedYear(year)}
            >
              ${year}
            </div>
          `
        )}
      </div>
    </div>
  `;
}

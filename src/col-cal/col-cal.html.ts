import { html, type TemplateResult } from "lit";
import { ref, type Ref } from "lit/directives/ref.js";
import { getMonths } from "../date.utils";
import type { ColCalPopover } from "../col-cal-popover/col-cal-popover";

export interface ColCalTemplateData {
  dataTestid: string;
  date: Date;
  currentLocale: string;
  minDate: Date | null;
  maxDate: Date | null;
  monthsButtonId: string;
  yearsButtonId: string;
  selectedDate: Date;
  firstDayOfWeek: number;
  disabledDates: Date[];
  events: Array<{ date: Date; title: string }>;
  popoverMonthsRef: Ref<ColCalPopover>;
  popoverYearsRef: Ref<ColCalPopover>;
  handleMonthChange: (detail: Date) => void;
  handleChangeMonth: (e: { detail: { month: number } }) => void;
  handleYearSelected: (e: { detail: { year: number } }) => void;
  handleMonthsChange: () => void;
  handleYearsChange: () => void;
  handleMonthsHideChange: () => void;
  handleYearsHideChange: () => void;
  handleDateSelected: (e: CustomEvent) => void;
}

export function renderColCal(data: ColCalTemplateData): TemplateResult {
  const {
    dataTestid,
    date,
    currentLocale,
    minDate,
    maxDate,
    monthsButtonId,
    yearsButtonId,
    selectedDate,
    firstDayOfWeek,
    disabledDates,
    events,
    popoverMonthsRef,
    popoverYearsRef,
    handleMonthChange,
    handleChangeMonth,
    handleYearSelected,
    handleMonthsChange,
    handleYearsChange,
    handleMonthsHideChange,
    handleYearsHideChange,
    handleDateSelected,
  } = data;

  return html`
    <div class="calendar" data-testid="${dataTestid}">
      <col-cal-header
        .date=${date}
        .locale=${currentLocale}
        .minDate=${minDate}
        .maxDate=${maxDate}
        .dataTestid="${`${dataTestid}-Header`}"
        @change-month=${({ detail }: { detail: Date }) => {
          handleMonthChange(detail);
        }}
      >
        <div
          slot="header-date"
          class="calendar__header-date"
          data-testid="${`${dataTestid}-Header-Date`}"
        >
          <button
            id="${monthsButtonId}"
            class="popup"
            data-testid="${`${dataTestid}-Months`}"
          >
            ${getMonths(currentLocale).at(date.getMonth())}
            <div
              name="months-popup-icon"
              data-testid="${`${dataTestid}-MonthsIcon`}"
            ></div>
          </button>
          <button
            id="${yearsButtonId}"
            class="popup"
            data-testid="${`${dataTestid}-Years`}"
          >
            ${date.getFullYear()}
            <div
              name="years-popup-icon"
              data-testid="${`${dataTestid}-YearsIcon`}"
            ></div>
          </button>
        </div>
        <div
          part="icon-button"
          name="icon-left-button"
          slot="icon-left-button"
          data-testid="${`${dataTestid}-IconsLeftYear`}"
        >
          &lt;
        </div>
        <div
          part="icon-button"
          name="icon-right-button"
          slot="icon-right-button"
          data-testid="${`${dataTestid}-IconsRightYear`}"
        >
          &gt;
        </div>
      </col-cal-header>

      <col-cal-popover
        ${ref(popoverMonthsRef)}
        position="bottom"
        for="${monthsButtonId}"
        data-testid="${`${dataTestid}-Popover-Months`}"
        @col-cal-show="${handleMonthsChange}"
        @col-cal-after-hide="${handleMonthsHideChange}"
      >
        <col-cal-months
          dataTestid="${`${dataTestid}-Months`}"
          .year="${date.getFullYear()}"
          .selectedMonth=${date.getMonth()}
          .minMonth=${minDate}
          .maxMonth=${maxDate}
          .locale=${currentLocale}
          @change-month="${handleChangeMonth}"
        ></col-cal-months>
      </col-cal-popover>

      <col-cal-popover
        ${ref(popoverYearsRef)}
        position="bottom"
        for="${yearsButtonId}"
        data-testid="${`${dataTestid}-Popover-Years`}"
        @col-cal-show="${handleYearsChange}"
        @col-cal-after-hide="${handleYearsHideChange}"
      >
        <col-cal-years
          .dataTestid="${`${dataTestid}-Years`}"
          .selectedYear=${date.getFullYear()}
          .minYear=${minDate?.getFullYear()}
          .maxYear=${maxDate?.getFullYear()}
          @change-year=${handleYearSelected}
        >
          <div
            part="years-arrow-icon"
            slot="icon-left-button"
            name="years-icon-left"
            data-testid="${`${dataTestid}-LeftButton`}"
          >
            &lt;
          </div>
          <div
            part="years-arrow-icon"
            slot="icon-right-button"
            name="years-icon-right"
            data-testid="${`${dataTestid}-RightButton`}"
          >
            &gt;
          </div>
        </col-cal-years>
      </col-cal-popover>

      <col-cal-dates
        .dataTestid="${`${dataTestid}-Dates`}"
        .month=${date}
        .minDate=${minDate}
        .maxDate=${maxDate}
        .selectedDate=${selectedDate}
        .locale=${currentLocale}
        .firstDayOfWeek=${firstDayOfWeek}
        .disabledDates=${disabledDates}
        .events=${events}
        @change-date=${handleDateSelected}
      ></col-cal-dates>
    </div>
  `;
}

import "../col-cal-header/col-cal-header";
import "../col-cal-dates/col-cal-dates";
import "../col-cal-months/col-cal-months";
import "../col-cal-years/col-cal-years";
import "../col-cal-popover/col-cal-popover";
import type { MonthNumber } from "../col-cal.type";
import { createDateFromMonthNumber, getMonths } from "../date.utils";
import type { ColCalPopover } from "../col-cal-popover/col-cal-popover";
import type { ColCalHeader } from "../col-cal-header/col-cal-header";
import type { ColCalDates } from "../col-cal-dates/col-cal-dates";
import type { ColCalMonths } from "../col-cal-months/col-cal-months";
import type { ColCalYears } from "../col-cal-years/col-cal-years";
import { insertSlotsByName } from "../lightdom.utils";
import { colCalStyles } from "./col-cal.css";

export class ColCal extends HTMLElement {
  private _date: Date = new Date();
  private _externalDate: Date = new Date();
  private _minDate: Date | null = null;
  private _maxDate: Date | null = null;
  private _locale: string = "en-US";
  private _dataTestid: string = "ColCal";
  private _firstDayOfWeek: number = 1;
  private _disabledDates: Date[] = [];
  private _events: Array<{ date: Date; title: string }> = [];

  private _monthsButtonId: string = "open-months-popup";
  private _yearsButtonId: string = "open-years-popup";

  private _popoverYearsRef: ColCalPopover | null = null;
  private _popoverMonthsRef: ColCalPopover | null = null;
  private _headerRef: ColCalHeader | null = null;
  private _datesRef: ColCalDates | null = null;
  private _monthsRef: ColCalMonths | null = null;
  private _yearsRef: ColCalYears | null = null;

  static get observedAttributes(): string[] {
    return ["locale", "data-testid", "first-day-of-week"];
  }

  constructor() {
    super();
    // Using light DOM (no shadow root) to match original behavior
  }

  // Property: date
  get date(): Date {
    return this._externalDate;
  }

  set date(value: Date) {
    this._externalDate = value;
    if (value !== null) {
      this._date = value;
    } else {
      this._date = new Date();
    }
    this._updateComponents();
  }

  // Property: minDate
  get minDate(): Date | null {
    return this._minDate;
  }

  set minDate(value: Date | null) {
    this._minDate = value;
    this._updateComponents();
  }

  // Property: maxDate
  get maxDate(): Date | null {
    return this._maxDate;
  }

  set maxDate(value: Date | null) {
    this._maxDate = value;
    this._updateComponents();
  }

  // Property: locale
  get locale(): string {
    return this._locale;
  }

  set locale(value: string) {
    this._locale = value;
    this._render();
  }

  // Property: dataTestid
  get dataTestid(): string {
    return this._dataTestid;
  }

  set dataTestid(value: string) {
    this._dataTestid = value;
    this._render();
  }

  // Property: firstDayOfWeek
  get firstDayOfWeek(): number {
    return this._firstDayOfWeek;
  }

  set firstDayOfWeek(value: number) {
    this._firstDayOfWeek = value;
    this._updateComponents();
  }

  // Property: disabledDates
  get disabledDates(): Date[] {
    return this._disabledDates;
  }

  set disabledDates(value: Date[]) {
    this._disabledDates = value;
    this._updateComponents();
  }

  // Property: events
  get events(): Array<{ date: Date; title: string }> {
    return this._events;
  }

  set events(value: Array<{ date: Date; title: string }>) {
    this._events = value;
    this._updateComponents();
  }

  private get currentLocale(): string {
    return this._locale;
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    switch (name) {
      case "locale":
        this._locale = newValue ?? "en-US";
        this._render();
        break;
      case "data-testid":
        this._dataTestid = newValue ?? "ColCal";
        this._render();
        break;
      case "first-day-of-week":
        this._firstDayOfWeek = Number(newValue) || 1;
        this._updateComponents();
        break;
    }
  }

  private generateUniqueButtonId(prefix: string): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return prefix + crypto.randomUUID().substring(0, 5);
    }

    const randomPart =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    return prefix + randomPart;
  }

  connectedCallback(): void {
    if (this._externalDate !== null) {
      this._date = this._externalDate;
    } else {
      this._date = new Date();
    }

    this._monthsButtonId = this.generateUniqueButtonId(this._monthsButtonId);
    this._yearsButtonId = this.generateUniqueButtonId(this._yearsButtonId);

    this._render();

    requestAnimationFrame(() => {
      insertSlotsByName(this);
    });
  }

  private handleChangeMonth = (e: Event): void => {
    const detail = (e as CustomEvent).detail as { month: MonthNumber };
    this._date = createDateFromMonthNumber(detail.month, this._date.getFullYear());
    if (this._popoverMonthsRef) {
      this._popoverMonthsRef.hide();
    }
    this._updateComponents();
    this._updateMonthYearButtons();
  };

  private handleYearSelected = (e: Event): void => {
    const detail = (e as CustomEvent).detail as { year: number };
    this._date = new Date(this._date.getFullYear(), this._date.getMonth(), 3);
    this._date.setFullYear(detail.year);
    if (this._popoverYearsRef) {
      this._popoverYearsRef.hide();
    }
    this._updateComponents();
    this._updateMonthYearButtons();
  };

  private handleMonthsChange = (): void => {
    this.dispatchEvent(
      new CustomEvent("show-months", {
        bubbles: true,
        composed: true,
      })
    );
  };

  private handleYearsChange = (): void => {
    this.dispatchEvent(
      new CustomEvent("show-years", {
        bubbles: true,
        composed: true,
      })
    );
  };

  private handleYearsHideChange = (): void => {
    this.dispatchEvent(
      new CustomEvent("hide-years", {
        bubbles: true,
        composed: true,
      })
    );
  };

  private handleMonthsHideChange = (): void => {
    this.dispatchEvent(
      new CustomEvent("hide-months", {
        bubbles: true,
        composed: true,
      })
    );
  };

  private handleDateSelected = (e: Event): void => {
    const detail = (e as CustomEvent).detail as Date;
    this._externalDate = detail;
    this.dispatchEvent(
      new CustomEvent("change-date", {
        detail: { date: this._externalDate },
        bubbles: true,
        composed: true,
      })
    );
    this._updateComponents();
  };

  private handleHeaderChangeMonth = (e: Event): void => {
    const detail = (e as CustomEvent).detail as Date;
    this._date = detail;
    this._updateComponents();
    this._updateMonthYearButtons();
  };

  private _updateMonthYearButtons(): void {
    // Update the month and year button text
    const monthButton = this.querySelector(`#${this._monthsButtonId}`) as HTMLButtonElement | null;
    const yearButton = this.querySelector(`#${this._yearsButtonId}`) as HTMLButtonElement | null;

    if (monthButton) {
      const monthText = getMonths(this.currentLocale).at(this._date.getMonth()) ?? "";
      const iconDiv = monthButton.querySelector('[name="months-popup-icon"]');
      monthButton.innerHTML = "";
      monthButton.appendChild(document.createTextNode(monthText));
      if (iconDiv) {
        monthButton.appendChild(iconDiv);
      } else {
        const newIconDiv = document.createElement("div");
        newIconDiv.setAttribute("name", "months-popup-icon");
        newIconDiv.setAttribute("data-testid", `${this._dataTestid}-MonthsIcon`);
        monthButton.appendChild(newIconDiv);
      }
    }

    if (yearButton) {
      const yearText = String(this._date.getFullYear());
      const iconDiv = yearButton.querySelector('[name="years-popup-icon"]');
      yearButton.innerHTML = "";
      yearButton.appendChild(document.createTextNode(yearText));
      if (iconDiv) {
        yearButton.appendChild(iconDiv);
      } else {
        const newIconDiv = document.createElement("div");
        newIconDiv.setAttribute("name", "years-popup-icon");
        newIconDiv.setAttribute("data-testid", `${this._dataTestid}-YearsIcon`);
        yearButton.appendChild(newIconDiv);
      }
    }
  }

  private _updateComponents(): void {
    // Update child components' properties
    if (this._headerRef) {
      this._headerRef.date = this._date;
      this._headerRef.locale = this.currentLocale;
      this._headerRef.minDate = this._minDate;
      this._headerRef.maxDate = this._maxDate;
    }

    if (this._datesRef) {
      this._datesRef.month = this._date;
      this._datesRef.minDate = this._minDate;
      this._datesRef.maxDate = this._maxDate;
      this._datesRef.selectedDate = this._externalDate;
      this._datesRef.locale = this.currentLocale;
      this._datesRef.firstDayOfWeek = this._firstDayOfWeek as 0 | 1 | 2 | 3 | 4 | 5 | 6;
      this._datesRef.disabledDates = this._disabledDates;
      this._datesRef.events = this._events;
    }

    if (this._monthsRef) {
      this._monthsRef.year = this._date.getFullYear();
      this._monthsRef.selectedMonth = this._date.getMonth() as MonthNumber;
      this._monthsRef.minMonth = this._minDate;
      this._monthsRef.maxMonth = this._maxDate;
      this._monthsRef.locale = this.currentLocale;
    }

    if (this._yearsRef) {
      this._yearsRef.selectedYear = this._date.getFullYear();
      this._yearsRef.minYear = this._minDate?.getFullYear() ?? null;
      this._yearsRef.maxYear = this._maxDate?.getFullYear() ?? null;
    }

    requestAnimationFrame(() => {
      insertSlotsByName(this);
    });
  }

  private _render(): void {
    // Clear existing content
    this.innerHTML = "";

    // Add styles
    const style = document.createElement("style");
    style.textContent = colCalStyles;
    this.appendChild(style);

    // Create calendar container
    const calendar = document.createElement("div");
    calendar.className = "calendar";
    calendar.setAttribute("data-testid", this._dataTestid);

    // Create header
    const header = document.createElement("col-cal-header") as ColCalHeader;
    header.date = this._date;
    header.locale = this.currentLocale;
    header.minDate = this._minDate;
    header.maxDate = this._maxDate;
    header.dataTestid = `${this._dataTestid}-Header`;
    header.addEventListener("change-month", this.handleHeaderChangeMonth);
    this._headerRef = header;

    // Create header-date slot content
    const headerDateDiv = document.createElement("div");
    headerDateDiv.setAttribute("slot", "header-date");
    headerDateDiv.className = "calendar__header-date";
    headerDateDiv.setAttribute("data-testid", `${this._dataTestid}-Header-Date`);

    // Months button
    const monthsButton = document.createElement("button");
    monthsButton.id = this._monthsButtonId;
    monthsButton.className = "popup";
    monthsButton.setAttribute("data-testid", `${this._dataTestid}-Months`);
    monthsButton.textContent = getMonths(this.currentLocale).at(this._date.getMonth()) ?? "";

    const monthsIconDiv = document.createElement("div");
    monthsIconDiv.setAttribute("name", "months-popup-icon");
    monthsIconDiv.setAttribute("data-testid", `${this._dataTestid}-MonthsIcon`);
    monthsButton.appendChild(monthsIconDiv);
    headerDateDiv.appendChild(monthsButton);

    // Years button
    const yearsButton = document.createElement("button");
    yearsButton.id = this._yearsButtonId;
    yearsButton.className = "popup";
    yearsButton.setAttribute("data-testid", `${this._dataTestid}-Years`);
    yearsButton.textContent = String(this._date.getFullYear());

    const yearsIconDiv = document.createElement("div");
    yearsIconDiv.setAttribute("name", "years-popup-icon");
    yearsIconDiv.setAttribute("data-testid", `${this._dataTestid}-YearsIcon`);
    yearsButton.appendChild(yearsIconDiv);
    headerDateDiv.appendChild(yearsButton);

    header.appendChild(headerDateDiv);

    // Icon left button for header
    const iconLeftButton = document.createElement("div");
    iconLeftButton.setAttribute("part", "icon-button");
    iconLeftButton.setAttribute("name", "icon-left-button");
    iconLeftButton.setAttribute("slot", "icon-left-button");
    iconLeftButton.setAttribute("data-testid", `${this._dataTestid}-IconsLeftYear`);
    iconLeftButton.innerHTML = "&lt;";
    header.appendChild(iconLeftButton);

    // Icon right button for header
    const iconRightButton = document.createElement("div");
    iconRightButton.setAttribute("part", "icon-button");
    iconRightButton.setAttribute("name", "icon-right-button");
    iconRightButton.setAttribute("slot", "icon-right-button");
    iconRightButton.setAttribute("data-testid", `${this._dataTestid}-IconsRightYear`);
    iconRightButton.innerHTML = "&gt;";
    header.appendChild(iconRightButton);

    calendar.appendChild(header);

    // Create months popover
    const popoverMonths = document.createElement("col-cal-popover") as ColCalPopover;
    popoverMonths.for = this._monthsButtonId;
    popoverMonths.setAttribute("data-testid", `${this._dataTestid}-Popover-Months`);
    popoverMonths.addEventListener("col-cal-show", this.handleMonthsChange);
    popoverMonths.addEventListener("col-cal-after-hide", this.handleMonthsHideChange);
    this._popoverMonthsRef = popoverMonths;

    const months = document.createElement("col-cal-months") as ColCalMonths;
    months.dataTestid = `${this._dataTestid}-Months`;
    months.year = this._date.getFullYear();
    months.selectedMonth = this._date.getMonth() as MonthNumber;
    months.minMonth = this._minDate;
    months.maxMonth = this._maxDate;
    months.locale = this.currentLocale;
    months.addEventListener("change-month", this.handleChangeMonth);
    this._monthsRef = months;

    popoverMonths.appendChild(months);
    calendar.appendChild(popoverMonths);

    // Create years popover
    const popoverYears = document.createElement("col-cal-popover") as ColCalPopover;
    popoverYears.for = this._yearsButtonId;
    popoverYears.setAttribute("data-testid", `${this._dataTestid}-Popover-Years`);
    popoverYears.addEventListener("col-cal-show", this.handleYearsChange);
    popoverYears.addEventListener("col-cal-after-hide", this.handleYearsHideChange);
    this._popoverYearsRef = popoverYears;

    const years = document.createElement("col-cal-years") as ColCalYears;
    years.dataTestid = `${this._dataTestid}-Years`;
    years.selectedYear = this._date.getFullYear();
    years.minYear = this._minDate?.getFullYear() ?? null;
    years.maxYear = this._maxDate?.getFullYear() ?? null;
    years.addEventListener("change-year", this.handleYearSelected);
    this._yearsRef = years;

    // Icon left button for years
    const yearsIconLeft = document.createElement("div");
    yearsIconLeft.setAttribute("part", "years-arrow-icon");
    yearsIconLeft.setAttribute("slot", "icon-left-button");
    yearsIconLeft.setAttribute("name", "years-icon-left");
    yearsIconLeft.setAttribute("data-testid", `${this._dataTestid}-LeftButton`);
    yearsIconLeft.innerHTML = "&lt;";
    years.appendChild(yearsIconLeft);

    // Icon right button for years
    const yearsIconRight = document.createElement("div");
    yearsIconRight.setAttribute("part", "years-arrow-icon");
    yearsIconRight.setAttribute("slot", "icon-right-button");
    yearsIconRight.setAttribute("name", "years-icon-right");
    yearsIconRight.setAttribute("data-testid", `${this._dataTestid}-RightButton`);
    yearsIconRight.innerHTML = "&gt;";
    years.appendChild(yearsIconRight);

    popoverYears.appendChild(years);
    calendar.appendChild(popoverYears);

    // Create dates component
    const dates = document.createElement("col-cal-dates") as ColCalDates;
    dates.dataTestid = `${this._dataTestid}-Dates`;
    dates.month = this._date;
    dates.minDate = this._minDate;
    dates.maxDate = this._maxDate;
    dates.selectedDate = this._externalDate;
    dates.locale = this.currentLocale;
    dates.firstDayOfWeek = this._firstDayOfWeek as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    dates.disabledDates = this._disabledDates;
    dates.events = this._events;
    dates.addEventListener("change-date", this.handleDateSelected);
    this._datesRef = dates;

    calendar.appendChild(dates);
    this.appendChild(calendar);

    requestAnimationFrame(() => {
      insertSlotsByName(this);
    });
  }
}

// Register the custom element
customElements.define("col-cal", ColCal);

declare global {
  interface HTMLElementTagNameMap {
    "col-cal": ColCal;
  }
}

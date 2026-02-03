import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isBefore,
  isAfter,
  addDays,
  subDays,
  getDay,
} from "../date.utils";
import { colCalDatesStyles } from "./col-cal-dates.css";
import { renderColCalDates } from "./col-cal-dates.html";

type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export class ColCalDates extends HTMLElement {
  private _month: Date | null = null;
  private _minDate: Date | null = null;
  private _maxDate: Date | null = null;
  private _selectedDate: Date | null = null;
  private _dataTestid: string = "Dates";
  private _locale: string = "en-US";
  private _firstDayOfWeek: Day = 1;
  private _disabledDates: Date[] = [];
  private _events: Array<{ date: Date; title: string }> = [];

  static get observedAttributes(): string[] {
    return ["data-testid", "locale", "first-day-of-week"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  // Property: month
  get month(): Date | null {
    return this._month;
  }

  set month(value: Date | null) {
    this._month = value;
    this._render();
  }

  // Property: minDate
  get minDate(): Date | null {
    return this._minDate;
  }

  set minDate(value: Date | null) {
    this._minDate = value;
    this._render();
  }

  // Property: maxDate
  get maxDate(): Date | null {
    return this._maxDate;
  }

  set maxDate(value: Date | null) {
    this._maxDate = value;
    this._render();
  }

  // Property: selectedDate
  get selectedDate(): Date | null {
    return this._selectedDate;
  }

  set selectedDate(value: Date | null) {
    this._selectedDate = value;
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

  // Property: locale
  get locale(): string {
    return this._locale;
  }

  set locale(value: string) {
    this._locale = value;
    this._render();
  }

  // Property: firstDayOfWeek
  get firstDayOfWeek(): Day {
    return this._firstDayOfWeek;
  }

  set firstDayOfWeek(value: Day) {
    this._firstDayOfWeek = value;
    this._render();
  }

  // Property: disabledDates
  get disabledDates(): Date[] {
    return this._disabledDates;
  }

  set disabledDates(value: Date[]) {
    this._disabledDates = value;
    this._render();
  }

  // Property: events
  get events(): Array<{ date: Date; title: string }> {
    return this._events;
  }

  set events(value: Array<{ date: Date; title: string }>) {
    this._events = value;
    this._render();
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    switch (name) {
      case "data-testid":
        this._dataTestid = newValue ?? "Dates";
        this._render();
        break;
      case "locale":
        this._locale = newValue ?? "en-US";
        this._render();
        break;
      case "first-day-of-week":
        this._firstDayOfWeek = (Number(newValue) || 1) as Day;
        this._render();
        break;
    }
  }

  connectedCallback(): void {
    this._render();
  }

  private getPrevMonthDays(month: Date): Date[] {
    const start = startOfMonth(month);
    const firstDay = getDay(start);
    const daysBefore = (firstDay - this._firstDayOfWeek + 7) % 7;
    if (daysBefore === 0) {
      return [];
    }
    const prevMonthStart = subDays(start, daysBefore);
    return eachDayOfInterval({
      start: prevMonthStart,
      end: subDays(start, 1),
    });
  }

  private getNextMonthDays(month: Date): Date[] {
    const end = endOfMonth(month);
    const nextMonthStart = addDays(end, 1);
    const firstDayOfNext = getDay(nextMonthStart);

    const daysAfter =
      (7 - ((firstDayOfNext - this._firstDayOfWeek + 7) % 7)) % 7;

    if (daysAfter === 0) {
      return [];
    }

    const nextMonthEnd = addDays(nextMonthStart, daysAfter - 1);

    return eachDayOfInterval({
      start: nextMonthStart,
      end: nextMonthEnd,
    });
  }

  private getMonthDays(): Date[] | null {
    if (!this._month) return null;

    const month = this._month;
    const currentMonthDays = eachDayOfInterval({
      start: startOfMonth(month),
      end: endOfMonth(month),
    });

    this._disabledDates = [
      ...this.getPrevMonthDays(month),
      ...this.getNextMonthDays(month),
    ];

    return [
      ...this.getPrevMonthDays(month),
      ...currentMonthDays,
      ...this.getNextMonthDays(month),
    ];
  }

  private isDateDisabled = (date: Date): boolean => {
    if (this._minDate) {
      const minDateCopy = new Date(this._minDate);
      minDateCopy.setHours(0, 0, 0, 0);
      if (isBefore(date, minDateCopy)) {
        return true;
      }
    }

    if (this._maxDate) {
      const maxDateCopy = new Date(this._maxDate);
      maxDateCopy.setHours(0, 0, 0, 0);
      if (isAfter(date, maxDateCopy)) {
        return true;
      }
    }

    return this._disabledDates.some((d) => isSameDay(date, d));
  };

  private handleDateSelect = (date: Date): void => {
    if (!this.isDateDisabled(date)) {
      this._selectedDate = date;
      this.dispatchEvent(new CustomEvent("change-date", { detail: date }));
      this._render();
    }
  };

  private _render(): void {
    if (!this.shadowRoot) return;

    const days = this.getMonthDays();
    if (!days) {
      this.shadowRoot.innerHTML = "";
      return;
    }

    // Clear existing content
    this.shadowRoot.innerHTML = "";

    // Add styles
    const style = document.createElement("style");
    style.textContent = colCalDatesStyles;
    this.shadowRoot.appendChild(style);

    // Render template
    renderColCalDates(this.shadowRoot, {
      days,
      selectedDate: this._selectedDate,
      dataTestid: this._dataTestid,
      locale: this._locale,
      isDateDisabled: this.isDateDisabled,
      handleDateSelect: this.handleDateSelect,
    });
  }
}

// Register the custom element
customElements.define("col-cal-dates", ColCalDates);

declare global {
  interface HTMLElementTagNameMap {
    "col-cal-dates": ColCalDates;
  }
}

import type { MonthNumber } from "../col-cal.type";
import { getMonths, isAfter, isBefore } from "../date.utils";
import { colCalMonthsStyles } from "./col-cal-months.css";
import { renderColCalMonths } from "./col-cal-months.html";

export class ColCalMonths extends HTMLElement {
  private _selectedMonth: MonthNumber | null = null;
  private _disabledMonths: MonthNumber[] | null = null;
  private _year: number = new Date().getFullYear();
  private _minMonth: Date | null = null;
  private _maxMonth: Date | null = null;
  private _locale: string = "en-US";
  private _dataTestid: string = "ColCal-Months";

  static get observedAttributes(): string[] {
    return ["locale", "data-testid", "year", "selected-month"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  // Property: selectedMonth
  get selectedMonth(): MonthNumber | null {
    return this._selectedMonth;
  }

  set selectedMonth(value: MonthNumber | null) {
    this._selectedMonth = value;
    this._render();
  }

  // Property: disabledMonths
  get disabledMonths(): MonthNumber[] | null {
    return this._disabledMonths;
  }

  set disabledMonths(value: MonthNumber[] | null) {
    this._disabledMonths = value;
    this._render();
  }

  // Property: year
  get year(): number {
    return this._year;
  }

  set year(value: number) {
    this._year = value;
    this._render();
  }

  // Property: minMonth
  get minMonth(): Date | null {
    return this._minMonth;
  }

  set minMonth(value: Date | null) {
    this._minMonth = value;
    this._render();
  }

  // Property: maxMonth
  get maxMonth(): Date | null {
    return this._maxMonth;
  }

  set maxMonth(value: Date | null) {
    this._maxMonth = value;
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

  // Property: dataTestid
  get dataTestid(): string {
    return this._dataTestid;
  }

  set dataTestid(value: string) {
    this._dataTestid = value;
    this._render();
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    switch (name) {
      case "locale":
        this._locale = newValue ?? "en-US";
        this._render();
        break;
      case "data-testid":
        this._dataTestid = newValue ?? "ColCal-Months";
        this._render();
        break;
      case "year":
        this._year = Number(newValue) || new Date().getFullYear();
        this._render();
        break;
      case "selected-month":
        this._selectedMonth = newValue !== null ? (Number(newValue) as MonthNumber) : null;
        this._render();
        break;
    }
  }

  connectedCallback(): void {
    this._render();
  }

  private getFromIndexMonth(month: string): MonthNumber {
    return getMonths(this._locale).indexOf(month) as MonthNumber;
  }

  private isSelected = (month: string): boolean => {
    return this._selectedMonth === this.getFromIndexMonth(month);
  };

  private isDisabled = (month: string): boolean => {
    const monthIndex = this.getFromIndexMonth(month);
    if (this._minMonth) {
      const monthDate = new Date(this._year, monthIndex, this._minMonth.getDay());

      if (isBefore(monthDate, this._minMonth)) {
        return true;
      }
    }

    if (this._maxMonth) {
      const monthDate = new Date(this._year, monthIndex, this._maxMonth.getDay());

      if (isAfter(monthDate, this._maxMonth)) {
        return true;
      }
    }

    return this._disabledMonths?.includes(monthIndex) ?? false;
  };

  private handleMonthSelect = (month: string): void => {
    this.dispatchEvent(
      new CustomEvent("change-month", {
        detail: { month: this.getFromIndexMonth(month) },
        bubbles: true,
        composed: true,
      })
    );
  };

  private _render(): void {
    if (!this.shadowRoot) return;

    // Clear existing content
    this.shadowRoot.innerHTML = "";

    // Add styles
    const style = document.createElement("style");
    style.textContent = colCalMonthsStyles;
    this.shadowRoot.appendChild(style);

    // Render template
    renderColCalMonths(this.shadowRoot, {
      locale: this._locale,
      dataTestid: this._dataTestid,
      isSelected: this.isSelected,
      isDisabled: this.isDisabled,
      handleMonthSelect: this.handleMonthSelect,
    });
  }
}

// Register the custom element
customElements.define("col-cal-months", ColCalMonths);

declare global {
  interface HTMLElementTagNameMap {
    "col-cal-months": ColCalMonths;
  }
}

import { addMonths, isAfter, isBefore, subMonths } from "../date.utils";
import { colCalHeaderStyles } from "./col-cal-header.css";
import { renderColCalHeader } from "./col-cal-header.html";

export class ColCalHeader extends HTMLElement {
  private _locale: string = "en-US";
  private _dataTestid: string = "ColCal-Header";
  private _date: Date = new Date();
  private _minDate: Date | null = null;
  private _maxDate: Date | null = null;
  private _externalDate: Date | null = null;

  static get observedAttributes(): string[] {
    return ["locale", "data-testid"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
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

  // Property: date (external date passed in)
  get date(): Date | null {
    return this._externalDate;
  }

  set date(value: Date | null) {
    this._externalDate = value;
    if (value !== null) {
      this._date = value;
    } else {
      this._date = new Date();
    }
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

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    switch (name) {
      case "locale":
        this._locale = newValue ?? "en-US";
        this._render();
        break;
      case "data-testid":
        this._dataTestid = newValue ?? "ColCal-Header";
        this._render();
        break;
    }
  }

  connectedCallback(): void {
    if (this._externalDate !== null) {
      this._date = this._externalDate;
    } else {
      this._date = new Date();
    }
    this._render();
  }

  private handleChangeMonth(): void {
    this.dispatchEvent(
      new CustomEvent("change-month", {
        detail: this._date,
        bubbles: true,
        composed: true,
      })
    );
  }

  private isDateMinDisabled(date: Date | null): boolean {
    if (date === null) return false;
    if (this._minDate && isBefore(date, this._minDate)) {
      return true;
    }
    return false;
  }

  private isDateMaxDisabled(date: Date | null): boolean {
    if (date === null) return false;
    if (this._maxDate && isAfter(date, this._maxDate)) {
      return true;
    }
    return false;
  }

  private handlePrevMonth = (): void => {
    this._date = subMonths(this._date, 1);
    this.handleChangeMonth();
    this._render();
  };

  private handleNextMonth = (): void => {
    this._date = addMonths(this._date, 1);
    this.handleChangeMonth();
    this._render();
  };

  private _render(): void {
    if (!this.shadowRoot) return;

    // Clear existing content
    this.shadowRoot.innerHTML = "";

    // Add styles
    const style = document.createElement("style");
    style.textContent = colCalHeaderStyles;
    this.shadowRoot.appendChild(style);

    // Render template
    renderColCalHeader(this.shadowRoot, {
      date: this._date,
      locale: this._locale,
      dataTestid: this._dataTestid,
      handlePrevMonth: this.handlePrevMonth,
      handleNextMonth: this.handleNextMonth,
      isMinDisabled: this.isDateMinDisabled(this._externalDate),
      isMaxDisabled: this.isDateMaxDisabled(this._externalDate),
    });
  }
}

// Register the custom element
customElements.define("col-cal-header", ColCalHeader);

declare global {
  interface HTMLElementTagNameMap {
    "col-cal-header": ColCalHeader;
  }
}

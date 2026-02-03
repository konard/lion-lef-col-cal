import { colCalYearsStyles } from "./col-cal-years.css";
import { renderColCalYears } from "./col-cal-years.html";

export class ColCalYears extends HTMLElement {
  private _selectedYear: number | null = null;
  private _minYear: number | null = null;
  private _maxYear: number | null = null;
  private _disabledYears: number[] = [];
  private _dataTestid: string = "ColCal-Years";
  private _startYear: number = 2005;
  private _chunkSize = 12;

  static get observedAttributes(): string[] {
    return ["data-testid", "selected-year", "min-year", "max-year"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  // Property: selectedYear
  get selectedYear(): number | null {
    return this._selectedYear;
  }

  set selectedYear(value: number | null) {
    this._selectedYear = value;
    this._render();
  }

  // Property: minYear
  get minYear(): number | null {
    return this._minYear;
  }

  set minYear(value: number | null) {
    this._minYear = value;
    this._render();
  }

  // Property: maxYear
  get maxYear(): number | null {
    return this._maxYear;
  }

  set maxYear(value: number | null) {
    this._maxYear = value;
    this._render();
  }

  // Property: disabledYears
  get disabledYears(): number[] {
    return this._disabledYears;
  }

  set disabledYears(value: number[]) {
    this._disabledYears = value;
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
      case "data-testid":
        this._dataTestid = newValue ?? "ColCal-Years";
        this._render();
        break;
      case "selected-year":
        this._selectedYear = newValue !== null ? Number(newValue) : null;
        this._render();
        break;
      case "min-year":
        this._minYear = newValue !== null ? Number(newValue) : null;
        this._render();
        break;
      case "max-year":
        this._maxYear = newValue !== null ? Number(newValue) : null;
        this._render();
        break;
    }
  }

  connectedCallback(): void {
    this.initializeStartYear();
    this._render();
  }

  private initializeStartYear(): void {
    let centerYear = 2023;
    if (this._selectedYear && !isNaN(Number(this._selectedYear))) {
      centerYear = Number(this._selectedYear);
    }

    this._startYear = centerYear - 3;
  }

  private get fullYears(): string[] {
    return Array.from({ length: this._chunkSize }, (_, i) =>
      (this._startYear + i).toString()
    );
  }

  private handlePrev = (): void => {
    this._startYear -= this._chunkSize;
    this._render();
  };

  private handleNext = (): void => {
    this._startYear += this._chunkSize;
    this._render();
  };

  private isSelectedYear = (year: string): boolean => {
    return this._selectedYear === Number(year);
  };

  private isYearDisabled = (year: number): boolean => {
    if (this._minYear && year < this._minYear) {
      return true;
    }
    if (this._maxYear && year > this._maxYear) {
      return true;
    }
    return this._disabledYears.includes(year);
  };

  private handleYearSelect = (year: number): void => {
    this._selectedYear = year;
    this.dispatchEvent(
      new CustomEvent("change-year", {
        detail: { year: year },
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
    style.textContent = colCalYearsStyles;
    this.shadowRoot.appendChild(style);

    // Render template
    renderColCalYears(this.shadowRoot, {
      dataTestid: this._dataTestid,
      years: this.fullYears,
      isSelectedYear: this.isSelectedYear,
      isYearDisabled: this.isYearDisabled,
      handlePrev: this.handlePrev,
      handleNext: this.handleNext,
      handleYearSelect: this.handleYearSelect,
    });
  }
}

// Register the custom element
customElements.define("col-cal-years", ColCalYears);

declare global {
  interface HTMLElementTagNameMap {
    "col-cal-years": ColCalYears;
  }
}

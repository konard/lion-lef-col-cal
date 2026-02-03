import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { MonthNumber } from "../col-cal.type";
import { getMonths, isAfter, isBefore } from "../date.utils";
import { colCalMonthsStyles } from "./col-cal-months.css";
import { renderColCalMonths } from "./col-cal-months.html";

@customElement("col-cal-months")
export class ColCalMonths extends LitElement {
  static styles = colCalMonthsStyles;

  @property({ type: Number }) selectedMonth: MonthNumber | null = null;
  @property({ type: Array }) disabledMonths: MonthNumber[] | null = null;
  @property({ type: Number }) year: number = new Date().getFullYear();

  @property({ type: Object }) minMonth: Date | null = null;
  @property({ type: Object }) maxMonth: Date | null = null;

  @property({ type: String }) locale: string = "en-US";
  @property({ type: String }) dataTestid: string = "ColCal-Months";

  private getFromIndexMonth(month: string): MonthNumber {
    return getMonths(this.locale).indexOf(month) as MonthNumber;
  }

  private isSelected = (month: string): boolean => {
    return this.selectedMonth === this.getFromIndexMonth(month);
  };

  private isDisabled = (month: string): boolean => {
    const monthIndex = this.getFromIndexMonth(month);
    if (this.minMonth) {
      const monthDate = new Date(this.year, monthIndex, this.minMonth.getDay());

      if (isBefore(monthDate, this.minMonth)) {
        return true;
      }
    }

    if (this.maxMonth) {
      const monthDate = new Date(this.year, monthIndex, this.maxMonth.getDay());

      if (isAfter(monthDate, this.maxMonth)) {
        return true;
      }
    }

    return this.disabledMonths?.includes(monthIndex) ?? false;
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

  protected render() {
    return renderColCalMonths({
      locale: this.locale,
      dataTestid: this.dataTestid,
      isSelected: this.isSelected,
      isDisabled: this.isDisabled,
      handleMonthSelect: this.handleMonthSelect,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "col-cal-months": ColCalMonths;
  }
}

import { LitElement, html } from "lit";
import { property, customElement } from "lit/decorators.js";
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

@customElement("col-cal-dates")
export class ColCalDates extends LitElement {
  static styles = colCalDatesStyles;

  @property({ type: Date })
  month: Date | null = null;

  @property({ type: Date })
  minDate: Date | null = null;

  @property({ type: Date })
  maxDate: Date | null = null;

  @property({ type: Date })
  selectedDate: Date | null = null;

  @property({ type: String }) dataTestid: string = "Dates";
  @property({ type: String }) locale: string = "en-US";
  @property({ type: Number }) firstDayOfWeek: Day = 1;
  @property({ type: Array }) disabledDates: Date[] = [];
  @property({ type: Array })
  events: Array<{ date: Date; title: string }> = [];

  private getPrevMonthDays(month: Date): Date[] {
    const start = startOfMonth(month);
    const firstDay = getDay(start);
    const daysBefore = (firstDay - this.firstDayOfWeek + 7) % 7;
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
      (7 - ((firstDayOfNext - this.firstDayOfWeek + 7) % 7)) % 7;

    if (daysAfter === 0) {
      return [];
    }

    const nextMonthEnd = addDays(nextMonthStart, daysAfter - 1);

    return eachDayOfInterval({
      start: nextMonthStart,
      end: nextMonthEnd,
    });
  }

  private getMonthDays() {
    if (!this.month) return null;

    const month = this.month;
    const currentMonthDays = eachDayOfInterval({
      start: startOfMonth(month),
      end: endOfMonth(month),
    });

    this.disabledDates = [
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
    if (this.minDate) {
      const minDateCopy = new Date(this.minDate);
      minDateCopy.setHours(0, 0, 0, 0);
      if (isBefore(date, minDateCopy)) {
        return true;
      }
    }

    if (this.maxDate) {
      const maxDateCopy = new Date(this.maxDate);
      maxDateCopy.setHours(0, 0, 0, 0);
      if (isAfter(date, maxDateCopy)) {
        return true;
      }
    }

    return this.disabledDates.some((d) => isSameDay(date, d));
  };

  private handleDateSelect = (date: Date): void => {
    if (!this.isDateDisabled(date)) {
      this.selectedDate = date;
      this.dispatchEvent(new CustomEvent("change-date", { detail: date }));
    }
  };

  render() {
    const days = this.getMonthDays();
    if (!days) {
      return html``;
    }

    return renderColCalDates({
      days,
      selectedDate: this.selectedDate,
      dataTestid: this.dataTestid,
      locale: this.locale,
      isDateDisabled: this.isDateDisabled,
      handleDateSelect: this.handleDateSelect,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "col-cal-date": ColCalDates;
  }
}

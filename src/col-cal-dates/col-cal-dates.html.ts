import { formatDate, isSameDay, isSameMonth } from "../date.utils";

export interface DatesTemplateData {
  days: Date[];
  selectedDate: Date | null;
  dataTestid: string;
  locale: string;
  isDateDisabled: (date: Date) => boolean;
  handleDateSelect: (date: Date) => void;
}

export function renderColCalDates(container: ShadowRoot, data: DatesTemplateData): void {
  const { days, selectedDate, dataTestid, locale, isDateDisabled, handleDateSelect } = data;

  const weekDiv = document.createElement("div");
  weekDiv.className = "week";
  weekDiv.setAttribute("data-testid", dataTestid);

  days.forEach((date) => {
    const isSelected =
      selectedDate &&
      isSameMonth(date, selectedDate) &&
      isSameDay(date, selectedDate);

    const isDisabled = isDateDisabled(date);

    const button = document.createElement("button");
    button.setAttribute("data-testid", `${dataTestid}-Day`);

    const classes = ["day"];
    if (isSelected && !isDisabled) classes.push("selected");
    if (isDisabled) classes.push("disabled");
    button.className = classes.join(" ");

    button.addEventListener("click", () => handleDateSelect(date));
    button.setAttribute("aria-label", formatDate(date, "PPP", locale));
    button.setAttribute("role", "gridcell");
    button.textContent = String(date.getDate());

    weekDiv.appendChild(button);
  });

  container.appendChild(weekDiv);
}

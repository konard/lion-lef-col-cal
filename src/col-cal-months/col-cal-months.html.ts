import { getMonths } from "../date.utils";

export interface MonthsTemplateData {
  locale: string;
  dataTestid: string;
  isSelected: (month: string) => boolean;
  isDisabled: (month: string) => boolean;
  handleMonthSelect: (month: string) => void;
}

export function renderColCalMonths(container: ShadowRoot, data: MonthsTemplateData): void {
  const { locale, dataTestid, isSelected, isDisabled, handleMonthSelect } = data;

  const monthGrid = document.createElement("div");
  monthGrid.className = "month-grid";
  monthGrid.setAttribute("part", "months");
  monthGrid.setAttribute("data-testid", `${dataTestid}-Months`);

  getMonths(locale).forEach((month: string) => {
    const cell = document.createElement("div");
    cell.setAttribute("data-testid", `${dataTestid}-Months-Cell`);
    cell.setAttribute("part", "month");

    const classes = ["month-cell"];
    if (isSelected(month)) classes.push("selected");
    if (isDisabled(month) && !isSelected(month)) classes.push("disabled");
    cell.className = classes.join(" ");

    cell.addEventListener("click", () => {
      if (!isDisabled(month)) handleMonthSelect(month);
    });

    cell.setAttribute("aria-selected", String(isSelected(month)));
    cell.textContent = month;

    monthGrid.appendChild(cell);
  });

  container.appendChild(monthGrid);
}

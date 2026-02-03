import { formatDate, getWeeks } from "../date.utils";

export interface HeaderTemplateData {
  date: Date;
  locale: string;
  dataTestid: string;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  isMinDisabled: boolean;
  isMaxDisabled: boolean;
}

export function renderColCalHeader(
  container: ShadowRoot,
  data: HeaderTemplateData
): void {
  const { date, locale, dataTestid, handlePrevMonth, handleNextMonth, isMinDisabled, isMaxDisabled } = data;

  // Create header section
  const header = document.createElement("div");
  header.className = "header";
  header.setAttribute("part", "header");
  header.setAttribute("data-testid", dataTestid);

  // Create slot for header-date
  const headerDateSlot = document.createElement("slot");
  headerDateSlot.className = "header__date";
  headerDateSlot.name = "header-date";
  headerDateSlot.setAttribute("part", "header-date");
  headerDateSlot.setAttribute("data-testid", `${dataTestid}-HeaderDate`);
  headerDateSlot.textContent = formatDate(date, "MMMM yyyy", locale);
  header.appendChild(headerDateSlot);

  // Create buttons container
  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "header__buttons";
  buttonsDiv.setAttribute("data-testid", `${dataTestid}-Header-Buttons`);

  // Left button
  const leftButton = document.createElement("button");
  leftButton.setAttribute("part", "left-button");
  leftButton.className = "left-button";
  leftButton.disabled = isMinDisabled;
  leftButton.setAttribute("data-testid", `${dataTestid}-Header-LeftButton`);
  leftButton.addEventListener("click", handlePrevMonth);

  const leftSlot = document.createElement("slot");
  leftSlot.name = "icon-left-button";
  leftSlot.setAttribute("data-testid", `${dataTestid}-Header-IconLeftButton`);
  leftSlot.innerHTML = "&lt;";
  leftButton.appendChild(leftSlot);
  buttonsDiv.appendChild(leftButton);

  // Right button
  const rightButton = document.createElement("button");
  rightButton.className = "right-button";
  rightButton.setAttribute("part", "right-button");
  rightButton.setAttribute("data-testid", `${dataTestid}-Header-IconRightButton`);
  rightButton.disabled = isMaxDisabled;
  rightButton.addEventListener("click", handleNextMonth);

  const rightSlot = document.createElement("slot");
  rightSlot.name = "icon-right-button";
  rightSlot.setAttribute("data-testid", `${dataTestid}-Header-IconRight`);
  rightSlot.innerHTML = "&gt;";
  rightButton.appendChild(rightSlot);
  buttonsDiv.appendChild(rightButton);

  header.appendChild(buttonsDiv);
  container.appendChild(header);

  // Create week days row
  const weekDiv = document.createElement("div");
  weekDiv.className = "week";
  weekDiv.setAttribute("data-testid", `${dataTestid}-Header-Week`);

  getWeeks(locale).forEach((dayWeek) => {
    const span = document.createElement("span");
    span.className = "day-header";
    span.setAttribute("data-testid", `${dataTestid}-Header-DayHeader`);
    span.textContent = dayWeek;
    weekDiv.appendChild(span);
  });

  container.appendChild(weekDiv);
}

export interface YearsTemplateData {
  dataTestid: string;
  years: string[];
  isSelectedYear: (year: string) => boolean;
  isYearDisabled: (year: number) => boolean;
  handlePrev: () => void;
  handleNext: () => void;
  handleYearSelect: (year: number) => void;
}

export function renderColCalYears(container: ShadowRoot, data: YearsTemplateData): void {
  const {
    dataTestid,
    years,
    isSelectedYear,
    isYearDisabled,
    handlePrev,
    handleNext,
    handleYearSelect,
  } = data;

  const yearGrid = document.createElement("div");
  yearGrid.className = "year-grid";
  yearGrid.setAttribute("data-testid", `${dataTestid}-Grid`);

  // Create navigation
  const navigation = document.createElement("div");
  navigation.className = "navigation";
  navigation.setAttribute("data-testid", `${dataTestid}-Navigation`);

  // Prev button
  const prevButton = document.createElement("button");
  prevButton.addEventListener("click", handlePrev);
  prevButton.setAttribute("data-testid", `${dataTestid}-Button-Prev`);

  const prevSlot = document.createElement("slot");
  prevSlot.name = "icon-left-button";
  prevSlot.setAttribute("data-testid", `${dataTestid}-Button-Left`);
  prevSlot.innerHTML = "&lt;";
  prevButton.appendChild(prevSlot);
  navigation.appendChild(prevButton);

  // Next button
  const nextButton = document.createElement("button");
  nextButton.addEventListener("click", handleNext);
  nextButton.setAttribute("data-testid", `${dataTestid}-Button-Next`);

  const nextSlot = document.createElement("slot");
  nextSlot.name = "icon-right-button";
  nextSlot.setAttribute("data-testid", `${dataTestid}-Button-NextIcon`);
  nextSlot.innerHTML = "&gt;";
  nextButton.appendChild(nextSlot);
  navigation.appendChild(nextButton);

  yearGrid.appendChild(navigation);

  // Create years grid
  const yearsDiv = document.createElement("div");
  yearsDiv.className = "years";
  yearsDiv.setAttribute("data-testid", dataTestid);

  years.forEach((year) => {
    const cell = document.createElement("div");
    cell.setAttribute("data-testid", `${dataTestid}-YearCell`);

    const classes = ["year-cell"];
    if (isSelectedYear(year)) classes.push("selected");
    if (isYearDisabled(Number(year)) && !isSelectedYear(year)) classes.push("disabled");
    cell.className = classes.join(" ");

    cell.addEventListener("click", () => {
      if (!isYearDisabled(Number(year))) {
        handleYearSelect(Number(year));
      }
    });

    const partValue = isYearDisabled(Number(year)) && !isSelectedYear(year)
      ? "year disabled"
      : "year";
    cell.setAttribute("part", partValue);
    cell.setAttribute("aria-selected", String(isSelectedYear(year)));
    cell.textContent = year;

    yearsDiv.appendChild(cell);
  });

  yearGrid.appendChild(yearsDiv);
  container.appendChild(yearGrid);
}

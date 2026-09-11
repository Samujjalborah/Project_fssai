/**
 * Oyster Mushroom (Pleurotus ostreatus) Nutrition & Wellness Web App
 * Handles dynamic serving size adjustments, nutrition table filtering,
 * cooking guides, and mobile navigation interactions.
 */

// Base nutritional data per 100g (USDA FoodData Central standard)
const NUTRITION_DATA = [
  // Macronutrients
  {
    id: "calories",
    name: "Calories (Energy)",
    category: "macro",
    amountPer100g: 33,
    unit: "kcal",
    dvBase: 2000,
    dvPercent: 2,
    details: "Low caloric density, ideal for weight management and metabolic health."
  },
  {
    id: "protein",
    name: "Plant-Based Protein",
    category: "macro",
    amountPer100g: 3.3,
    unit: "g",
    dvBase: 50,
    dvPercent: 7,
    details: "Contains all nine essential amino acids with high digestibility."
  },
  {
    id: "fiber",
    name: "Dietary Fiber",
    category: "macro",
    amountPer100g: 2.3,
    unit: "g",
    dvBase: 28,
    dvPercent: 8,
    details: "Rich in soluble & insoluble prebiotic fibers including Beta-D-glucans."
  },
  {
    id: "fat",
    name: "Total Lipid (Fat)",
    category: "macro",
    amountPer100g: 0.4,
    unit: "g",
    dvBase: 78,
    dvPercent: 1,
    details: "Naturally virtually fat-free; 0g saturated fats and zero dietary cholesterol."
  },
  {
    id: "carbs",
    name: "Total Carbohydrates",
    category: "macro",
    amountPer100g: 6.1,
    unit: "g",
    dvBase: 275,
    dvPercent: 2,
    details: "Low glycemic impact with 3.8g net carbs per 100g."
  },
  {
    id: "water",
    name: "Water Content",
    category: "macro",
    amountPer100g: 89.2,
    unit: "g",
    dvBase: null,
    dvPercent: null,
    details: "Promotes natural hydration and imparts tender culinary texture."
  },

  // Micronutrients: B-Vitamins
  {
    id: "niacin",
    name: "Niacin (Vitamin B3)",
    category: "micro",
    amountPer100g: 4.96,
    unit: "mg",
    dvBase: 16,
    dvPercent: 31,
    details: "Critical for cellular energy production, DNA repair, and lipid metabolism."
  },
  {
    id: "riboflavin",
    name: "Riboflavin (Vitamin B2)",
    category: "micro",
    amountPer100g: 0.35,
    unit: "mg",
    dvBase: 1.3,
    dvPercent: 27,
    details: "Supports energy synthesis, cellular respiration, and tissue repair."
  },
  {
    id: "folate",
    name: "Folate (Vitamin B9)",
    category: "micro",
    amountPer100g: 38.0,
    unit: "µg",
    dvBase: 400,
    dvPercent: 10,
    details: "Crucial for red blood cell formation and healthy cellular division."
  },
  {
    id: "vitamin_b6",
    name: "Vitamin B6 (Pyridoxine)",
    category: "micro",
    amountPer100g: 0.11,
    unit: "mg",
    dvBase: 1.7,
    dvPercent: 6,
    details: "Aids neurotransmitter synthesis and immune cytokine production."
  },

  // Micronutrients: Essential Minerals
  {
    id: "potassium",
    name: "Potassium (K)",
    category: "micro",
    amountPer100g: 420.0,
    unit: "mg",
    dvBase: 4700,
    dvPercent: 9,
    details: "Essential electrolyte supporting healthy blood pressure and muscle function."
  },
  {
    id: "phosphorus",
    name: "Phosphorus (P)",
    category: "micro",
    amountPer100g: 120.0,
    unit: "mg",
    dvBase: 1250,
    dvPercent: 10,
    details: "Maintains strong bone matrix and cellular membrane integrity."
  },
  {
    id: "iron",
    name: "Iron (Fe)",
    category: "micro",
    amountPer100g: 1.33,
    unit: "mg",
    dvBase: 18,
    dvPercent: 7,
    details: "Plant-based non-heme iron promoting oxygen transport in the bloodstream."
  },
  {
    id: "zinc",
    name: "Zinc (Zn)",
    category: "micro",
    amountPer100g: 0.77,
    unit: "mg",
    dvBase: 11,
    dvPercent: 7,
    details: "Potent trace mineral essential for immune defense and wound healing."
  },
  {
    id: "copper",
    name: "Copper (Cu)",
    category: "micro",
    amountPer100g: 0.24,
    unit: "mg",
    dvBase: 0.9,
    dvPercent: 27,
    details: "Enzyme cofactor that supports cardiovascular and nervous system health."
  }
];

// Current state
let currentServingGrams = 100;
let currentFilter = "all";

// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
  initServingSwitcher();
  initTableFilter();
  initPrepTabs();
  initMobileNav();
  initScrollEffects();
  renderNutritionTable();
  updateHighlightCards();
});

/**
 * Serving Size Switcher
 */
function initServingSwitcher() {
  const servingButtons = document.querySelectorAll(".serving-btn");
  const currentServingLabel = document.getElementById("current-serving-display");

  servingButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      servingButtons.forEach((b) => {
        b.classList.remove("bg-[#1E3F2D]", "text-white", "shadow-sm");
        b.classList.add("bg-white", "text-[#374151]", "hover:bg-[#F2ECE1]");
      });

      btn.classList.add("bg-[#1E3F2D]", "text-white", "shadow-sm");
      btn.classList.remove("bg-white", "text-[#374151]", "hover:bg-[#F2ECE1]");

      const grams = parseFloat(btn.getAttribute("data-grams"));
      currentServingGrams = grams;

      if (currentServingLabel) {
        currentServingLabel.textContent = `${grams}g`;
      }

      updateHighlightCards();
      renderNutritionTable();
    });
  });
}

/**
 * Update the Top 4 Quick-Glance Highlight Cards
 */
function updateHighlightCards() {
  const multiplier = currentServingGrams / 100;

  // Calories
  const calVal = Math.round(33 * multiplier);
  const calElem = document.getElementById("highlight-calories");
  if (calElem) calElem.textContent = calVal;

  // Protein
  const proteinVal = (3.3 * multiplier).toFixed(1);
  const proteinElem = document.getElementById("highlight-protein");
  if (proteinElem) proteinElem.textContent = `${proteinVal}g`;

  // Fiber
  const fiberVal = (2.3 * multiplier).toFixed(1);
  const fiberElem = document.getElementById("highlight-fiber");
  if (fiberElem) fiberElem.textContent = `${fiberVal}g`;

  // Fat
  const fatVal = (0.4 * multiplier).toFixed(1);
  const fatElem = document.getElementById("highlight-fat");
  if (fatElem) fatElem.textContent = `${fatVal}g`;
}

/**
 * Filter Nutrition Table
 */
function initTableFilter() {
  const filterButtons = document.querySelectorAll(".table-filter-btn");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => {
        b.classList.remove("bg-[#1E3F2D]", "text-white", "shadow-sm");
        b.classList.add("bg-white", "text-[#374151]", "hover:bg-[#F2ECE1]");
      });

      btn.classList.add("bg-[#1E3F2D]", "text-white", "shadow-sm");
      btn.classList.remove("bg-white", "text-[#374151]", "hover:bg-[#F2ECE1]");

      currentFilter = btn.getAttribute("data-filter");
      renderNutritionTable();
    });
  });
}

/**
 * Render Detailed Nutrition Table with dynamic serving values
 */
function renderNutritionTable() {
  const tableBody = document.getElementById("nutrition-table-body");
  if (!tableBody) return;

  const multiplier = currentServingGrams / 100;
  const filtered = NUTRITION_DATA.filter((item) => {
    if (currentFilter === "all") return true;
    return item.category === currentFilter;
  });

  tableBody.innerHTML = filtered
    .map((item) => {
      const scaledAmount = (item.amountPer100g * multiplier);
      // Format number display
      let displayAmount;
      if (item.unit === "kcal") {
        displayAmount = Math.round(scaledAmount);
      } else if (scaledAmount < 1) {
        displayAmount = scaledAmount.toFixed(2);
      } else if (scaledAmount >= 10) {
        displayAmount = Math.round(scaledAmount);
      } else {
        displayAmount = scaledAmount.toFixed(1);
      }

      // Calculate % DV
      let dvText = "—";
      let dvProgress = 0;
      if (item.dvBase) {
        const dv = Math.round((scaledAmount / item.dvBase) * 100);
        dvText = `${dv}%`;
        dvProgress = Math.min(dv, 100);
      }

      const isMacro = item.category === "macro";
      const tagLabel = isMacro ? "Macro" : "Micro";
      const tagBg = isMacro ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200";

      return `
        <tr class="table-row-hover transition-colors border-b border-[#EAE3D6] text-sm">
          <td class="py-3.5 px-4 font-medium text-[#1E3F2D] flex items-center gap-2">
            <span>${item.name}</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full border ${tagBg} font-mono tracking-wider">${tagLabel}</span>
          </td>
          <td class="py-3.5 px-4 text-right font-semibold text-[#27303E]">
            ${displayAmount} <span class="text-xs font-normal text-[#6B7280]">${item.unit}</span>
          </td>
          <td class="py-3.5 px-4 text-right">
            ${
              item.dvBase
                ? `<div class="inline-flex items-center justify-end gap-2">
                    <div class="w-12 bg-[#E2DACB] h-1.5 rounded-full overflow-hidden hidden sm:block">
                      <div class="bg-[#2D5A43] h-full rounded-full" style="width: ${dvProgress}%"></div>
                    </div>
                    <span class="font-semibold text-[#1E3F2D] min-w-[34px]">${dvText}</span>
                  </div>`
                : `<span class="text-[#9CA3AF] text-xs">N/A</span>`
            }
          </td>
          <td class="py-3.5 px-4 text-[#4B5563] text-xs hidden md:table-cell">
            ${item.details}
          </td>
        </tr>
      `;
    })
    .join("");
}

/**
 * Preparation & Storage Tabs
 */
function initPrepTabs() {
  const tabBtns = document.querySelectorAll(".prep-tab-btn");
  const tabPanes = document.querySelectorAll(".prep-pane");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-tab");

      tabBtns.forEach((b) => {
        b.classList.remove("bg-[#1E3F2D]", "text-white", "shadow-sm");
        b.classList.add("bg-white", "text-[#374151]", "hover:bg-[#F2ECE1]");
      });

      btn.classList.add("bg-[#1E3F2D]", "text-white", "shadow-sm");
      btn.classList.remove("bg-white", "text-[#374151]", "hover:bg-[#F2ECE1]");

      tabPanes.forEach((pane) => {
        if (pane.id === targetId) {
          pane.classList.remove("hidden");
        } else {
          pane.classList.add("hidden");
        }
      });
    });
  });
}

/**
 * Mobile Navigation Menu Toggle
 */
function initMobileNav() {
  const toggleBtn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  const navLinks = document.querySelectorAll(".mobile-nav-link");

  if (toggleBtn && menu) {
    toggleBtn.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.add("hidden");
      });
    });
  }
}

/**
 * Scroll effects (Header shadow & Back to Top)
 */
function initScrollEffects() {
  const backToTopBtn = document.getElementById("back-to-top");
  const header = document.getElementById("main-header");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    if (header) {
      if (scrollY > 20) {
        header.classList.add("shadow-sm", "border-b", "border-[#E4DCCE]");
      } else {
        header.classList.remove("shadow-sm", "border-b", "border-[#E4DCCE]");
      }
    }

    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.remove("opacity-0", "pointer-events-none", "translate-y-4");
        backToTopBtn.classList.add("opacity-100", "translate-y-0");
      } else {
        backToTopBtn.classList.add("opacity-0", "pointer-events-none", "translate-y-4");
        backToTopBtn.classList.remove("opacity-100", "translate-y-0");
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

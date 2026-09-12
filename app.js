/**
 * KATHFULA — Fresh Oyster Mushroom (Pleurotus ostreatus) Web App
 * Handles dynamic nutrition calculators, table filters, preparation guides,
 * interactive order estimation, WhatsApp/Call integrations, and scroll animations.
 */

// Base nutritional data per 100g (USDA FoodData Central standard)
const NUTRITION_DATA = [
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

// Pack sizing metadata for order estimator
const PACK_SIZES = {
  "200g": {
    name: "200g Fresh Retail Punnet",
    weight: "200g",
    description: "Ideal for fresh family meals and daily sautés.",
    badge: "Most Popular"
  },
  "500g": {
    name: "500g Fresh Pack",
    weight: "500g",
    description: "Perfect for weekend family cooking, soups & pasta.",
    badge: "Best Value"
  },
  "1kg": {
    name: "1kg Culinary Crate",
    weight: "1kg",
    description: "Freshly harvested for culinary creators & batch cooking.",
    badge: "Chef Choice"
  },
  "bulk": {
    name: "Bulk Wholesale (5kg+)",
    weight: "5kg+",
    description: "Direct farm supply for restaurants, caterers & grocers.",
    badge: "Wholesale B2B"
  }
};

// Global state
let currentServingGrams = 100;
let currentFilter = "all";
let selectedPackKey = "200g";
let orderQuantity = 2;

document.addEventListener("DOMContentLoaded", () => {
  initServingSwitcher();
  initTableFilter();
  initPrepTabs();
  initMobileNav();
  initScrollEffects();
  initOrderEstimator();
  initContactForm();
  initScrollReveal();
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
        b.classList.remove("bg-forest-800", "text-white", "shadow-sm");
        b.classList.add("bg-white", "text-slate-700", "hover:bg-cream-100");
      });

      btn.classList.add("bg-forest-800", "text-white", "shadow-sm");
      btn.classList.remove("bg-white", "text-slate-700", "hover:bg-cream-100");

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

  const calVal = Math.round(33 * multiplier);
  const calElem = document.getElementById("highlight-calories");
  if (calElem) calElem.textContent = calVal;

  const proteinVal = (3.3 * multiplier).toFixed(1);
  const proteinElem = document.getElementById("highlight-protein");
  if (proteinElem) proteinElem.textContent = `${proteinVal}g`;

  const fiberVal = (2.3 * multiplier).toFixed(1);
  const fiberElem = document.getElementById("highlight-fiber");
  if (fiberElem) fiberElem.textContent = `${fiberVal}g`;

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
        b.classList.remove("bg-forest-800", "text-white", "shadow-sm");
        b.classList.add("bg-white", "text-slate-700", "hover:bg-cream-100");
      });

      btn.classList.add("bg-forest-800", "text-white", "shadow-sm");
      btn.classList.remove("bg-white", "text-slate-700", "hover:bg-cream-100");

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
      const scaledAmount = item.amountPer100g * multiplier;
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
        <tr class="table-row-hover transition-colors border-b border-cream-200 text-sm">
          <td class="py-3.5 px-4 font-medium text-forest-900 flex items-center gap-2">
            <span>${item.name}</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full border ${tagBg} font-mono tracking-wider">${tagLabel}</span>
          </td>
          <td class="py-3.5 px-4 text-right font-semibold text-slate-800">
            ${displayAmount} <span class="text-xs font-normal text-slate-500">${item.unit}</span>
          </td>
          <td class="py-3.5 px-4 text-right">
            ${
              item.dvBase
                ? `<div class="inline-flex items-center justify-end gap-2">
                    <div class="w-12 bg-cream-300 h-1.5 rounded-full overflow-hidden hidden sm:block">
                      <div class="bg-forest-600 h-full rounded-full" style="width: ${dvProgress}%"></div>
                    </div>
                    <span class="font-semibold text-forest-800 min-w-[34px]">${dvText}</span>
                  </div>`
                : `<span class="text-slate-400 text-xs">N/A</span>`
            }
          </td>
          <td class="py-3.5 px-4 text-slate-600 text-xs hidden md:table-cell">
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
        b.classList.remove("bg-forest-800", "text-white", "shadow-sm");
        b.classList.add("bg-white/10", "text-cream-200", "hover:bg-white/20");
      });

      btn.classList.add("bg-forest-800", "text-white", "shadow-sm");
      btn.classList.remove("bg-white/10", "text-cream-200", "hover:bg-white/20");

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
 * Order Estimator & Direct WhatsApp / Call Dispatch
 */
function initOrderEstimator() {
  const packCards = document.querySelectorAll(".pack-card");
  const qtyDisplay = document.getElementById("order-qty-display");
  const btnPlus = document.getElementById("order-qty-plus");
  const btnMinus = document.getElementById("order-qty-minus");
  const orderSummaryText = document.getElementById("order-summary-pack");
  const waOrderBtn = document.getElementById("wa-order-btn");
  const mailOrderBtn = document.getElementById("mail-order-btn");
  const customerAddressInput = document.getElementById("order-customer-address");

  function updateOrderDisplay() {
    const pack = PACK_SIZES[selectedPackKey] || PACK_SIZES["200g"];
    if (qtyDisplay) qtyDisplay.textContent = orderQuantity;
    if (orderSummaryText) {
      orderSummaryText.textContent = `${orderQuantity} × ${pack.name}`;
    }

    // Build WhatsApp message
    const userNote = customerAddressInput ? customerAddressInput.value.trim() : "";
    let waMessage = `Hello KATHFULA Team! I would like to order Fresh Oyster Mushrooms:\n\n• Pack Size: ${pack.name}\n• Quantity: ${orderQuantity} pack(s)`;
    if (userNote) {
      waMessage += `\n• Delivery / Inquiry Notes: ${userNote}`;
    }
    waMessage += `\n\nPlease confirm availability and delivery timeframe. Thank you!`;

    const encodedWa = encodeURIComponent(waMessage);
    if (waOrderBtn) {
      waOrderBtn.href = `https://wa.me/919126431273?text=${encodedWa}`;
    }

    // Build Email mailto link
    const emailSubject = encodeURIComponent(`Order Inquiry: ${orderQuantity}x ${pack.name}`);
    const emailBody = encodeURIComponent(waMessage);
    if (mailOrderBtn) {
      mailOrderBtn.href = `mailto:smjjlborah@gmail.com?subject=${emailSubject}&body=${emailBody}`;
    }
  }

  packCards.forEach((card) => {
    card.addEventListener("click", () => {
      packCards.forEach((c) => {
        c.classList.remove("selected", "border-forest-800", "bg-emerald-50/50");
        c.classList.add("border-cream-300", "bg-white");
      });

      card.classList.add("selected", "border-forest-800", "bg-emerald-50/50");
      card.classList.remove("border-cream-300", "bg-white");

      selectedPackKey = card.getAttribute("data-pack") || "200g";
      updateOrderDisplay();
    });
  });

  if (btnPlus) {
    btnPlus.addEventListener("click", () => {
      orderQuantity = Math.min(orderQuantity + 1, 50);
      updateOrderDisplay();
    });
  }

  if (btnMinus) {
    btnMinus.addEventListener("click", () => {
      orderQuantity = Math.max(orderQuantity - 1, 1);
      updateOrderDisplay();
    });
  }

  if (customerAddressInput) {
    customerAddressInput.addEventListener("input", updateOrderDisplay);
  }

  updateOrderDisplay();
}

/**
 * Contact Inquiry Form & Toast Notifications
 */
function initContactForm() {
  const form = document.getElementById("kathfula-contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = (document.getElementById("contact-name")?.value || "").trim();
    const phone = (document.getElementById("contact-phone")?.value || "").trim();
    const message = (document.getElementById("contact-message")?.value || "").trim();

    if (!name || !phone) {
      showToast("Please enter your name and contact phone number.", "error");
      return;
    }

    // Compose instant WhatsApp dispatch
    const text = encodeURIComponent(
      `Hi Kathfula!\nName: ${name}\nPhone: ${phone}\nMessage: ${message || "I would like to inquire about fresh oyster mushrooms."}`
    );
    const waUrl = `https://wa.me/919126431273?text=${text}`;

    showToast("Opening WhatsApp with your inquiry details...", "success");
    setTimeout(() => {
      window.open(waUrl, "_blank");
      form.reset();
    }, 800);
  });
}

/**
 * Toast Notification Helper
 */
function showToast(message, type = "success") {
  const toast = document.getElementById("toast-notification");
  const toastMsg = document.getElementById("toast-message");
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;

  toast.classList.remove("translate-y-20", "opacity-0", "pointer-events-none");
  toast.classList.add("translate-y-0", "opacity-100");

  setTimeout(() => {
    toast.classList.add("translate-y-20", "opacity-0", "pointer-events-none");
    toast.classList.remove("translate-y-0", "opacity-100");
  }, 4000);
}

/**
 * Scroll Reveal Animations using Intersection Observer
 */
function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal-on-scroll");
  if (!elements.length) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
  } else {
    elements.forEach((el) => el.classList.add("revealed"));
  }
}

/**
 * Scroll Effects (Header shadow, Mobile bar & Back to Top)
 */
function initScrollEffects() {
  const backToTopBtn = document.getElementById("back-to-top");
  const header = document.getElementById("main-header");
  const mobileBar = document.getElementById("mobile-action-bar");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    if (header) {
      if (scrollY > 20) {
        header.classList.add("shadow-sm", "border-b", "border-cream-300");
      } else {
        header.classList.remove("shadow-sm", "border-b", "border-cream-300");
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

    if (mobileBar) {
      if (scrollY > 250) {
        mobileBar.classList.remove("translate-y-full");
        mobileBar.classList.add("translate-y-0");
      } else {
        mobileBar.classList.add("translate-y-full");
        mobileBar.classList.remove("translate-y-0");
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

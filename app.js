/**
 * KATHFULA — Fresh Oyster Mushroom (Pleurotus ostreatus) Web App
 * Features exact pricing (200g: ₹59, 500g: ₹149, 1kg: ₹299, Bulk: Pre-Order 50% Advance),
 * dynamic WhatsApp integration, nutrition calculators, table filters, and animations.
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

// Exact Pack Sizing and Pricing Structure
const PACK_SIZES = {
  "200g": {
    name: "200g Fresh Retail Punnet",
    weight: "200g",
    unitPrice: 59,
    priceDisplay: "₹59",
    description: "Standard retail punnet for 2–3 servings. Daily fresh harvest.",
    badge: "Most Popular",
    isLocked: false
  },
  "500g": {
    name: "500g Fresh Pack",
    weight: "500g",
    unitPrice: 149,
    priceDisplay: "₹149",
    description: "Ideal for family meal prep, stir-fries, noodle bowls & curries.",
    badge: "Best Value",
    isLocked: false
  },
  "1kg": {
    name: "1kg Culinary Crate",
    weight: "1kg",
    unitPrice: 299,
    priceDisplay: "₹299",
    description: "Freshly harvested batch for culinary creators & hearty feasts.",
    badge: "Chef Choice",
    isLocked: false
  },
  "bulk": {
    name: "Bulk Wholesale (5kg+)",
    weight: "5kg+",
    unitPrice: 0,
    priceDisplay: "Wholesale Quote",
    description: "🔒 Purely Pre-Order Only • 50% Advance Payment Required. Harvest scheduled upon advance receipt.",
    badge: "🔒 Pre-Order Only (50% Advance)",
    isLocked: true
  }
};

// Global State
let currentServingGrams = 100;
let currentFilter = "all";
let selectedPackKey = "200g";
let orderQuantity = 1;

function getCustomerNote() {
  const input = document.getElementById("order-customer-address");
  return input ? input.value.trim() : "";
}

function getWhatsAppURL() {
  const pack = PACK_SIZES[selectedPackKey] || PACK_SIZES["200g"];
  const userNote = getCustomerNote();
  let waMessage = "";

  if (pack.isLocked) {
    waMessage = `Hello KATHFULA Team! I would like to place a B2B Bulk Wholesale Pre-Order:\n\n• Order Item: ${pack.name}\n• Quantity: ${orderQuantity} order unit(s) (5kg+ min)\n• Terms: Purely Pre-Order with 50% Advance Payment required.`;
    if (userNote) {
      waMessage += `\n• Business / Delivery Notes: ${userNote}`;
    }
    waMessage += `\n\nPlease provide quotation and 50% advance payment details. Thank you!`;
  } else {
    const totalAmount = orderQuantity * pack.unitPrice;
    waMessage = `Hello KATHFULA Team! I would like to order Fresh Oyster Mushrooms:\n\n• Pack Size: ${pack.name} (@ ${pack.priceDisplay}/pack)\n• Quantity: ${orderQuantity} pack(s)\n• Total Amount: ₹${totalAmount}`;
    if (userNote) {
      waMessage += `\n• Delivery / Address Notes: ${userNote}`;
    }
    waMessage += `\n\nPlease confirm fresh harvest availability and delivery. Thank you!`;
  }

  const encoded = encodeURIComponent(waMessage);
  return `https://api.whatsapp.com/send?phone=919126431273&text=${encoded}`;
}

function updateOrderDisplay() {
  const pack = PACK_SIZES[selectedPackKey] || PACK_SIZES["200g"];
  const qtyDisplay = document.getElementById("order-qty-display");
  const orderSummaryText = document.getElementById("order-summary-pack");
  const orderTotalText = document.getElementById("order-summary-total");
  const waOrderBtn = document.getElementById("wa-order-btn");
  const mailOrderBtn = document.getElementById("mail-order-btn");
  const userNote = getCustomerNote();

  if (qtyDisplay) {
    qtyDisplay.textContent = String(orderQuantity);
  }

  if (orderSummaryText) {
    orderSummaryText.textContent = `${orderQuantity} × ${pack.name}`;
  }

  if (orderTotalText) {
    if (pack.isLocked) {
      orderTotalText.innerHTML = `<span class="text-rose-700 font-bold">50% Advance Required • Wholesale Pricing</span>`;
    } else {
      const total = orderQuantity * pack.unitPrice;
      orderTotalText.innerHTML = `Total: <strong class="text-forest-900 font-extrabold text-lg">₹${total}</strong> <span class="text-xs text-slate-500 font-normal">(${orderQuantity} × ${pack.priceDisplay})</span>`;
    }
  }

  const waUrl = getWhatsAppURL();
  if (waOrderBtn) {
    waOrderBtn.href = waUrl;
    if (pack.isLocked) {
      waOrderBtn.className = "flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer";
      waOrderBtn.innerHTML = `
        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>
        <span>Pre-Order Bulk on WhatsApp (50% Advance)</span>
      `;
    } else {
      waOrderBtn.className = "flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer";
      waOrderBtn.innerHTML = `
        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
        <span>Send Order via WhatsApp</span>
      `;
    }
  }

  if (mailOrderBtn) {
    const subject = encodeURIComponent(
      pack.isLocked
        ? `Bulk Pre-Order Request (${orderQuantity}x 5kg+ Wholesale)`
        : `Order Request: ${orderQuantity}x ${pack.name}`
    );
    const body = encodeURIComponent(
      pack.isLocked
        ? `Hello KATHFULA Team,\n\nI want to place a Bulk Wholesale Pre-Order:\n- Quantity: ${orderQuantity} units\n- Note: 50% advance payment acknowledged.\n- Delivery details: ${userNote || "None"}\n\nPlease reply with bank details.`
        : `Hello KATHFULA Team,\n\nI want to order:\n- ${orderQuantity}x ${pack.name} (@ ${pack.priceDisplay})\n- Total: ₹${orderQuantity * pack.unitPrice}\n- Delivery note: ${userNote || "None"}`
    );
    mailOrderBtn.href = `mailto:smjjlborah@gmail.com?subject=${subject}&body=${body}`;
  }
}

function selectPack(packKey) {
  if (!PACK_SIZES[packKey]) return;
  selectedPackKey = packKey;

  const packCards = document.querySelectorAll(".pack-card");
  packCards.forEach((card) => {
    const key = card.getAttribute("data-pack");
    const isBulk = key === "bulk";

    if (key === packKey) {
      if (isBulk) {
        card.className = "pack-card pack-bulk selected p-4 rounded-2xl border-2 border-rose-600 bg-rose-100/80 text-rose-950 cursor-pointer transition-all card-hover relative ring-2 ring-rose-600/30";
      } else {
        card.className = "pack-card selected p-4 rounded-2xl border-2 border-forest-800 bg-emerald-50/80 cursor-pointer transition-all card-hover relative ring-2 ring-forest-800/20";
      }
    } else {
      if (isBulk) {
        card.className = "pack-card pack-bulk p-4 rounded-2xl border-2 border-rose-400 bg-rose-50/70 text-rose-950 cursor-pointer transition-all card-hover relative";
      } else {
        card.className = "pack-card p-4 rounded-2xl border-2 border-cream-300 bg-white cursor-pointer transition-all card-hover relative";
      }
    }
  });

  updateOrderDisplay();
}

function changeQuantity(delta) {
  orderQuantity = Math.max(1, Math.min(50, orderQuantity + delta));
  const qtyDisplay = document.getElementById("order-qty-display");
  if (qtyDisplay) {
    qtyDisplay.textContent = String(orderQuantity);
  }
  updateOrderDisplay();
}

function openWhatsAppOrder(e) {
  if (e && e.preventDefault) e.preventDefault();
  const url = getWhatsAppURL();
  window.open(url, "_blank");
  showToast("Opening WhatsApp with your order...", "success");
}

// Expose on window for direct HTML onclick attributes
window.selectPack = selectPack;
window.changeQuantity = changeQuantity;
window.openWhatsAppOrder = openWhatsAppOrder;

function initApp() {
  try { initServingSwitcher(); } catch (e) { console.error("initServingSwitcher error:", e); }
  try { initTableFilter(); } catch (e) { console.error("initTableFilter error:", e); }
  try { initPrepTabs(); } catch (e) { console.error("initPrepTabs error:", e); }
  try { initMobileNav(); } catch (e) { console.error("initMobileNav error:", e); }
  try { initScrollEffects(); } catch (e) { console.error("initScrollEffects error:", e); }
  try { initOrderEstimator(); } catch (e) { console.error("initOrderEstimator error:", e); }
  try { initContactForm(); } catch (e) { console.error("initContactForm error:", e); }
  try { initScrollReveal(); } catch (e) { console.error("initScrollReveal error:", e); }
  try { renderNutritionTable(); } catch (e) { console.error("renderNutritionTable error:", e); }
  try { updateHighlightCards(); } catch (e) { console.error("updateHighlightCards error:", e); }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

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
 * Order Estimator with Exact Pricing & Rock-Solid WhatsApp Integration
 */
function initOrderEstimator() {
  const packCards = document.querySelectorAll(".pack-card");
  const btnPlus = document.getElementById("order-qty-plus");
  const btnMinus = document.getElementById("order-qty-minus");
  const waOrderBtn = document.getElementById("wa-order-btn");
  const customerAddressInput = document.getElementById("order-customer-address");

  // Click listeners on cards
  packCards.forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.getAttribute("data-pack");
      if (key) selectPack(key);
    });
  });

  // Click listeners on stepper
  if (btnPlus) {
    btnPlus.addEventListener("click", (e) => {
      e.preventDefault();
      changeQuantity(1);
    });
  }

  if (btnMinus) {
    btnMinus.addEventListener("click", (e) => {
      e.preventDefault();
      changeQuantity(-1);
    });
  }

  // Address/note input listener
  if (customerAddressInput) {
    customerAddressInput.addEventListener("input", updateOrderDisplay);
  }

  // Explicit click handler on WhatsApp order button
  if (waOrderBtn) {
    waOrderBtn.addEventListener("click", (e) => {
      openWhatsAppOrder(e);
    });
  }

  // Initial render
  selectPack(selectedPackKey);
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

    const text = encodeURIComponent(
      `Hello KATHFULA!\nName: ${name}\nPhone: ${phone}\nMessage: ${message || "I would like to inquire about fresh oyster mushrooms."}`
    );
    const waUrl = `https://api.whatsapp.com/send?phone=919126431273&text=${text}`;

    showToast("Launching WhatsApp with your inquiry...", "success");
    setTimeout(() => {
      window.open(waUrl, "_blank");
      form.reset();
    }, 400);
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
        header.classList.add("shadow-md", "border-b", "border-cream-300");
      } else {
        header.classList.remove("shadow-md", "border-b", "border-cream-300");
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
      if (scrollY > 200) {
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

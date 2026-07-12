'use strict';

/*
 * Butler's Pizza — combined JavaScript
 *
 * This single file contains:
 * 1. Location / nearest-branch search
 * 2. Menu filtering, searching and sorting
 * 3. Order-page cart and selected-pizza logic
 * 4. Contact form → Gmail compose logic
 *
 * Every feature checks that its page elements exist before running,
 * so this file can safely be linked on every HTML page.
 */

document.addEventListener('DOMContentLoaded', () => {
  initLocationSearch();
  initMenuPage();
  initOrderPage();
  initContactForm();
});

/* =========================================================
   LOCATION / NEAREST BRANCH SEARCH
   ========================================================= */

function initLocationSearch() {
  const input = document.getElementById('suburbInput');
  const suggestionsBox = document.getElementById('suburbSuggestions');
  const resultBox = document.getElementById('branchResult');
  const form = document.getElementById('branchSearchForm');

  // This page does not contain the location search.
  if (!input || !suggestionsBox || !resultBox || !form) {
    return;
  }

  const suburbs = [
    { name: 'Rondebosch', branch: 'Rondebosch' },
    { name: 'Rosebank', branch: 'Rondebosch' },
    { name: 'Mowbray', branch: 'Rondebosch' },
    { name: 'Observatory', branch: 'Rondebosch' },

    { name: 'Newlands', branch: 'Newlands' },
    { name: 'Claremont', branch: 'Newlands' },
    { name: 'Bishopscourt', branch: 'Newlands' },
    { name: 'Fernwood', branch: 'Newlands' },

    { name: 'Wynberg', branch: 'Wynberg' },
    { name: 'Kenilworth', branch: 'Wynberg' },
    { name: 'Plumstead', branch: 'Wynberg' },
    { name: 'Diep River', branch: 'Wynberg' },
    { name: 'Constantia', branch: 'Wynberg' },
    { name: 'Tokai', branch: 'Wynberg' },
    { name: 'Bergvliet', branch: 'Wynberg' },
    { name: 'Retreat', branch: 'Wynberg' },

    { name: 'City Bowl', branch: 'City Bowl' },
    { name: 'Cape Town CBD', branch: 'City Bowl' },
    { name: 'Gardens', branch: 'City Bowl' },
    { name: 'Vredehoek', branch: 'City Bowl' },
    { name: 'Oranjezicht', branch: 'City Bowl' },
    { name: 'Woodstock', branch: 'City Bowl' },
    { name: 'Salt River', branch: 'City Bowl' },
    { name: 'Sea Point', branch: 'City Bowl' },
    { name: 'Green Point', branch: 'City Bowl' },

    { name: 'Bellville', branch: 'Bellville' },
    { name: 'Durbanville', branch: 'Bellville' },
    { name: 'Parow', branch: 'Bellville' },
    { name: 'Goodwood', branch: 'Bellville' },
    { name: 'Tyger Valley', branch: 'Bellville' },
    { name: 'Brackenfell', branch: 'Bellville' },
    { name: 'Kuils River', branch: 'Bellville' },

    { name: 'Table View', branch: 'Table View' },
    { name: 'Blouberg', branch: 'Table View' },
    { name: 'Bloubergstrand', branch: 'Table View' },
    { name: 'Parklands', branch: 'Table View' },
    { name: 'Portlands', branch: 'Table View' },
    { name: 'Sunningdale', branch: 'Table View' },
    { name: 'West Beach', branch: 'Table View' },
    { name: 'Big Bay', branch: 'Table View' },
    { name: 'Milnerton', branch: 'Table View' },
    { name: 'Century City', branch: 'Table View' },
    { name: 'Bothasig', branch: 'Table View' },
    { name: 'Edgemead', branch: 'Table View' }
  ];

  const branchPhones = {
    Rondebosch: '021 686 9007',
    Newlands: '021 686 3333',
    Wynberg: '021 797 9980',
    'City Bowl': '021 462 3344',
    Bellville: '021 948 8888',
    'Table View': '021 557 8899'
  };

  function normalise(text) {
    return text.toLowerCase().trim();
  }

  function clearBranchHighlights() {
    document.querySelectorAll('.loc-card').forEach((card) => {
      card.classList.remove('branch-match');
    });
  }

  function highlightBranch(branchName) {
    clearBranchHighlights();

    document.querySelectorAll('.loc-card').forEach((card) => {
      const title = card.querySelector('h3');

      if (title && normalise(title.textContent) === normalise(branchName)) {
        card.classList.add('branch-match');
        card.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    });
  }

  function findBranch(value) {
    const search = normalise(value);

    if (!search) {
      resultBox.textContent = 'Please enter a Cape Town suburb.';
      clearBranchHighlights();
      return;
    }

    let match = suburbs.find((item) => normalise(item.name) === search);

    if (!match) {
      match = suburbs.find((item) => normalise(item.name).startsWith(search));
    }

    if (!match) {
      match = suburbs.find((item) => normalise(item.name).includes(search));
    }

    if (!match) {
      resultBox.innerHTML =
        'We could not find that suburb yet.<br>' +
        'Try another nearby Cape Town suburb.';
      clearBranchHighlights();
      return;
    }

    const phone = branchPhones[match.branch];

    resultBox.innerHTML = `
      Nearest branch for <strong>${match.name}</strong>:<br>
      <strong>${match.branch}</strong><br>
      Call: ${phone}
    `;

    highlightBranch(match.branch);
  }

  function showSuggestions(value) {
    const search = normalise(value);
    suggestionsBox.innerHTML = '';

    if (search.length < 1) {
      suggestionsBox.style.display = 'none';
      return;
    }

    const matches = suburbs
      .filter((item) => normalise(item.name).startsWith(search))
      .slice(0, 6);

    if (matches.length === 0) {
      suggestionsBox.style.display = 'none';
      return;
    }

    matches.forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = `${item.name} → ${item.branch}`;

      button.addEventListener('click', () => {
        input.value = item.name;
        suggestionsBox.style.display = 'none';
        findBranch(item.name);
      });

      suggestionsBox.appendChild(button);
    });

    suggestionsBox.style.display = 'block';
  }

  input.addEventListener('input', () => {
    showSuggestions(input.value);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    suggestionsBox.style.display = 'none';
    findBranch(input.value);
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.branch-search')) {
      suggestionsBox.style.display = 'none';
    }
  });
}

/* =========================================================
   MENU FILTERING, SEARCH AND SORTING
   ========================================================= */

function initMenuPage() {
  const tabs = [
    ...document.querySelectorAll('.menu-tabs .tab-item[data-filter]')
  ];
  const searchInput = document.getElementById('menuSearch');
  const sortButton = document.getElementById('menuSort');
  const sections = [
    ...document.querySelectorAll('.complete-category-block')
  ];
  const cards = [...document.querySelectorAll('.menu-filter-item')];
  const noResults = document.getElementById('menuNoResults');

  // This page does not contain the complete menu.
  if (tabs.length === 0 || cards.length === 0) {
    return;
  }

  let activeFilter = 'pizza';
  const sortModes = ['featured', 'price-asc', 'price-desc', 'name'];
  let sortIndex = 0;

  const labels = {
    featured: 'Sort: Featured',
    'price-asc': 'Sort: Price Low',
    'price-desc': 'Sort: Price High',
    name: 'Sort: A–Z'
  };

  function updateTabState(filter) {
    tabs.forEach((tab) => {
      const selected = tab.dataset.filter === filter;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
  }

  function applyFilters() {
    const query = (searchInput?.value || '').trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const categoryMatch =
        query.length > 0 || card.dataset.category === activeFilter;
      const searchText = card.dataset.search || '';
      const queryMatch = !query || searchText.includes(query);
      const visible = categoryMatch && queryMatch;

      card.hidden = !visible;

      if (visible) {
        visibleCount += 1;
      }
    });

    sections.forEach((section) => {
      const hasVisibleCard = [
        ...section.querySelectorAll('.menu-filter-item')
      ].some((card) => !card.hidden);

      section.hidden = !hasVisibleCard;
    });

    if (noResults) {
      noResults.hidden = visibleCount !== 0;
    }
  }

  function sortCards(mode) {
    document.querySelectorAll('.sortable-menu-grid').forEach((grid) => {
      const items = [...grid.children];

      items.sort((a, b) => {
        if (mode === 'price-asc') {
          return (
            Number(a.dataset.price || 0) - Number(b.dataset.price || 0)
          );
        }

        if (mode === 'price-desc') {
          return (
            Number(b.dataset.price || 0) - Number(a.dataset.price || 0)
          );
        }

        if (mode === 'name') {
          return (a.dataset.name || '').localeCompare(
            b.dataset.name || ''
          );
        }

        return (
          Number(a.dataset.originalIndex || 0) -
          Number(b.dataset.originalIndex || 0)
        );
      });

      items.forEach((item) => grid.appendChild(item));
    });
  }

  document.querySelectorAll('.sortable-menu-grid').forEach((grid) => {
    [...grid.children].forEach((item, index) => {
      item.dataset.originalIndex = String(index);
    });
  });

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeFilter = tab.dataset.filter || 'pizza';

      if (searchInput) {
        searchInput.value = '';
      }

      updateTabState(activeFilter);
      applyFilters();

      document.getElementById('completeMenu')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });

    tab.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        tab.click();
      }
    });
  });

  searchInput?.addEventListener('input', applyFilters);

  sortButton?.addEventListener('click', () => {
    sortIndex = (sortIndex + 1) % sortModes.length;
    const mode = sortModes[sortIndex];

    sortButton.textContent = labels[mode];
    sortCards(mode);
    applyFilters();
  });


  /* Pizza customizer and persistent cart */
  const customizer = document.getElementById('pizzaCustomizer');
  const customizerForm = document.getElementById('pizzaCustomizerForm');
  const customizerClose = document.getElementById('pizzaCustomizerClose');
  const customizerName = document.getElementById('pizzaCustomizerName');
  const customizerDescription = document.getElementById('pizzaCustomizerDescription');
  const customizerImage = document.getElementById('pizzaCustomizerImage');
  const sizeOptions = document.getElementById('pizzaSizeOptions');
  const baseOptions = document.getElementById('pizzaBaseOptions');
  const toppingOptions = document.getElementById('pizzaToppingOptions');
  const customizerTotal = document.getElementById('pizzaCustomizerTotal');
  const cartToast = document.getElementById('menuCartToast');

  const bases = [
    { id: 'standard', name: 'Standard Base', medium: 0, large: 0 },
    { id: 'pumpkin', name: 'Pumpkin Base', medium: 37.95, large: null },
    { id: 'zucchini', name: 'Zucchini Base', medium: 37.95, large: null },
    { id: 'gluten-free', name: 'Gluten Free Base', medium: 28, large: 39.75 },
    { id: 'lite', name: 'Lite Pizza', medium: 0, large: 0 },
    { id: 'thin', name: 'Thin Base', medium: 0, large: 0 },
    { id: 'thick', name: 'Thick Base', medium: 0, large: 0 }
  ];

  const toppings = [
    { id: 'pineapple', name: 'Pineapple', group: 'Fresh veg', medium: 13.5, large: 19.5 },
    { id: 'onion', name: 'Onion', group: 'Fresh veg', medium: 13.5, large: 19.5 },
    { id: 'garlic', name: 'Garlic', group: 'Fresh veg', medium: 13.5, large: 19.5 },
    { id: 'spinach', name: 'Spinach', group: 'Fresh veg', medium: 13.5, large: 19.5 },
    { id: 'green-pepper', name: 'Green Pepper', group: 'Fresh veg', medium: 13.5, large: 19.5 },
    { id: 'tomato', name: 'Tomato', group: 'Fresh veg', medium: 13.5, large: 19.5 },
    { id: 'mushrooms', name: 'Mushrooms', group: 'Premium veg', medium: 19.5, large: 24.2 },
    { id: 'olives', name: 'Olives', group: 'Premium veg', medium: 19.5, large: 24.2 },
    { id: 'jalapeno', name: 'Jalapeño Chillies', group: 'Premium veg', medium: 19.5, large: 24.2 },
    { id: 'avo', name: 'Avo Guacamole', group: 'Premium veg', medium: 19.5, large: 24.2 },
    { id: 'bacon', name: 'Bacon', group: 'Meat & sauce', medium: 24.2, large: 34.5 },
    { id: 'ham', name: 'Ham', group: 'Meat & sauce', medium: 24.2, large: 34.5 },
    { id: 'salami', name: 'Salami', group: 'Meat & sauce', medium: 24.2, large: 34.5 },
    { id: 'pepperoni', name: 'Pepperoni', group: 'Meat & sauce', medium: 24.2, large: 34.5 },
    { id: 'thai-chicken', name: 'Thai Chicken', group: 'Meat & sauce', medium: 24.2, large: 34.5 },
    { id: 'extra-mozzarella', name: 'Extra Mozzarella', group: 'Cheese', medium: 24.2, large: 34.5 },
    { id: 'vegan-mozzarella', name: 'Vegan Mozzarella', group: 'Cheese', medium: 24.2, large: 34.5 },
    { id: 'feta', name: 'Feta Cheese', group: 'Cheese', medium: 24.2, large: 34.5 }
  ];

  let selectedPizzaCard = null;

  function moneyMenu(value) {
    return `R${Number(value).toFixed(2)}`;
  }

  function readPizzaCard(card) {
    const prices = [...card.querySelectorAll('.menu-size-prices > div')].map((row) => {
      const label = row.querySelector('span')?.textContent.trim() || '';
      const priceText = row.querySelector('strong')?.textContent || '';
      const price = Number(priceText.replace(/[^\d.]/g, ''));
      return { label, price };
    });

    return {
      name: card.querySelector('h3')?.textContent.trim() || 'Pizza',
      description: card.querySelector('.full-menu-body > p')?.textContent.trim() || '',
      image: card.querySelector('.full-menu-photo img')?.getAttribute('src') || 'assets/pizza-hms.jpg',
      medium: prices[0]?.price || Number(card.dataset.price || 0),
      large: prices[1]?.price || prices[0]?.price || Number(card.dataset.price || 0)
    };
  }

  function selectedSize() {
    return customizerForm?.querySelector('input[name="pizza-size"]:checked')?.value || 'medium';
  }

  function renderBaseOptions() {
    if (!baseOptions) return;
    const size = selectedSize();

    baseOptions.innerHTML = bases
      .filter((base) => base[size] !== null)
      .map((base, index) => `
        <label class="pizza-choice-card">
          <input type="radio" name="pizza-base" value="${base.id}" ${index === 0 ? 'checked' : ''}>
          <span>
            <strong>${base.name}</strong>
            <small>${base[size] === 0 ? 'No extra charge' : `+ ${moneyMenu(base[size])}`}</small>
          </span>
        </label>
      `)
      .join('');
  }

  function renderToppingOptions() {
    if (!toppingOptions) return;
    const size = selectedSize();

    toppingOptions.innerHTML = toppings.map((topping) => `
      <label class="pizza-topping-card">
        <input type="checkbox" name="pizza-topping" value="${topping.id}">
        <span>
          <strong>${topping.name}</strong>
          <small>${topping.group} · + ${moneyMenu(topping[size])}</small>
        </span>
      </label>
    `).join('');
  }

  function calculateCustomizerTotal() {
    if (!selectedPizzaCard || !customizerTotal || !customizerForm) return;
    const pizza = readPizzaCard(selectedPizzaCard);
    const size = selectedSize();
    const chosenBaseId = customizerForm.querySelector('input[name="pizza-base"]:checked')?.value || 'standard';
    const chosenBase = bases.find((base) => base.id === chosenBaseId);
    const chosenToppingIds = [...customizerForm.querySelectorAll('input[name="pizza-topping"]:checked')]
      .map((input) => input.value);

    const toppingTotal = chosenToppingIds.reduce((sum, id) => {
      const topping = toppings.find((item) => item.id === id);
      return sum + (topping?.[size] || 0);
    }, 0);

    customizerTotal.textContent = moneyMenu(
      pizza[size] + (chosenBase?.[size] || 0) + toppingTotal
    );
  }

  function openCustomizer(card) {
    selectedPizzaCard = card;
    const pizza = readPizzaCard(card);

    customizerName.textContent = pizza.name;
    customizerDescription.textContent = pizza.description;
    customizerImage.src = pizza.image;
    customizerImage.alt = pizza.name;

    sizeOptions.innerHTML = `
      <label class="pizza-choice-card">
        <input type="radio" name="pizza-size" value="medium" checked>
        <span><strong>26cm Medium</strong><small>${moneyMenu(pizza.medium)}</small></span>
      </label>
      <label class="pizza-choice-card">
        <input type="radio" name="pizza-size" value="large">
        <span><strong>32cm Large</strong><small>${moneyMenu(pizza.large)}</small></span>
      </label>
    `;

    renderBaseOptions();
    renderToppingOptions();
    calculateCustomizerTotal();
    customizer.showModal();
  }

  document.querySelectorAll('.pizza-customize-button').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.full-menu-card');
      if (card) openCustomizer(card);
    });
  });

  customizerClose?.addEventListener('click', () => customizer?.close());

  customizer?.addEventListener('click', (event) => {
    if (event.target === customizer) customizer.close();
  });

  customizerForm?.addEventListener('change', (event) => {
    if (event.target.name === 'pizza-size') {
      renderBaseOptions();
      renderToppingOptions();
    }
    calculateCustomizerTotal();
  });

  customizerForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!selectedPizzaCard) return;

    const pizza = readPizzaCard(selectedPizzaCard);
    const size = selectedSize();
    const baseId = customizerForm.querySelector('input[name="pizza-base"]:checked')?.value || 'standard';
    const selectedBase = bases.find((base) => base.id === baseId) || bases[0];
    const selectedToppings = [...customizerForm.querySelectorAll('input[name="pizza-topping"]:checked')]
      .map((input) => toppings.find((item) => item.id === input.value))
      .filter(Boolean);

    const unitPrice =
      pizza[size] +
      (selectedBase[size] || 0) +
      selectedToppings.reduce((sum, topping) => sum + topping[size], 0);

    const configurationKey = [
      pizza.name,
      size,
      selectedBase.id,
      ...selectedToppings.map((item) => item.id).sort()
    ].join('|');

    const cart = JSON.parse(localStorage.getItem('butlersCart') || '[]');
    const existing = cart.find((item) => item.configurationKey === configurationKey);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: `pizza-${Date.now()}`,
        configurationKey,
        name: pizza.name,
        subtitle: `${size === 'medium' ? '26cm Medium' : '32cm Large'} · ${selectedBase.name}${
          selectedToppings.length ? ` · ${selectedToppings.map((item) => item.name).join(', ')}` : ''
        }`,
        price: unitPrice,
        image: pizza.image.replace(/^assets\//, ''),
        quantity: 1
      });
    }

    localStorage.setItem('butlersCart', JSON.stringify(cart));
    customizer.close();

    if (cartToast) {
      cartToast.innerHTML = `<strong>${pizza.name}</strong> added to your cart. <a href="order-now.html">View cart →</a>`;
      cartToast.classList.add('is-visible');
      window.setTimeout(() => cartToast.classList.remove('is-visible'), 4200);
    }
  });

  updateTabState(activeFilter);
  applyFilters();
}

/* =========================================================
   ORDER PAGE, CART AND SELECTED PIZZA
   ========================================================= */

function initOrderPage() {
  const page = document.querySelector('.order-pro-main');

  if (!page) {
    return;
  }

  const FREE_DELIVERY_THRESHOLD = 150;
  const STANDARD_DELIVERY_FEE = 25;

  const pizzaData = {
    Margherita: { price: 77.95, image: 'pizza-hms.jpg' },
    'Cheezi Margherita': { price: 101.95, image: 'pizza-four-cheese.jpg' },
    Hawaii: { price: 115.5, image: 'pizza-hms.jpg' },
    Regina: { price: 117.95, image: 'pizza-hms.jpg' },
    Caribbean: { price: 123.5, image: 'pizza-hms.jpg' },
    Smog: { price: 129.5, image: 'pizza-groovy-greek.jpg' },
    HMS: { price: 132.5, image: 'pizza-hms.jpg' },
    Vegetarian: { price: 126.5, image: 'pizza-groovy-greek.jpg' },
    'Thai Chicken': { price: 132.5, image: 'pizza-bbq-chicken.jpg' },
    'Pepperoni Classic': { price: 132.5, image: 'pizza-pepperoni.jpg' },
    'Groovy Greek': { price: 132.5, image: 'pizza-groovy-greek.jpg' },
    'Big Cheese Blue': { price: 132.5, image: 'pizza-four-cheese.jpg' },
    'The Rotherham': { price: 132.5, image: 'pizza-meaty-supreme.jpg' },
    'Meaty Foursome': { price: 132.5, image: 'pizza-meaty-supreme.jpg' },
    'Porky McGorky': { price: 132.5, image: 'pizza-meaty-supreme.jpg' },
    'The Plantify': { price: 161.5, image: 'pizza-groovy-greek.jpg' },
    'Vegan Vibe': { price: 145.95, image: 'pizza-groovy-greek.jpg' },
    'Holy Moly': { price: 132.5, image: 'pizza-holy-moly.jpg' },
    'Holy Veggie': { price: 132.5, image: 'pizza-holy-moly.jpg' },
    Phoenix: { price: 132.5, image: 'pizza-bbq-chicken.jpg' },
    'Baconator!': { price: 132.5, image: 'pizza-meaty-supreme.jpg' },
    "Dug's Dynamite": { price: 132.5, image: 'pizza-meaty-supreme.jpg' },
    'The Hero': { price: 132.5, image: 'pizza-bbq-chicken.jpg' },
    'Funky Fabb': { price: 132.5, image: 'pizza-holy-moly.jpg' },
    "Pops' Princess": { price: 141.5, image: 'pizza-groovy-greek.jpg' },
    'Mr Bacon': { price: 101.95, image: 'pizza-meaty-supreme.jpg' },
    "Lil' Cheeze": { price: 101.95, image: 'pizza-four-cheese.jpg' },
    Hammie: { price: 101.95, image: 'pizza-hms.jpg' }
  };

  const cartItemsElement = document.getElementById('orderCartItems');
  const emptyCartElement = document.querySelector('.order-cart-empty');
  const subtotalElement = document.getElementById('orderSubtotal');
  const deliveryElement = document.getElementById('orderDelivery');
  const totalElement = document.getElementById('orderTotal');
  const progressBar = document.getElementById('orderProgressBar');
  const progressMessage = document.getElementById('orderProgressMessage');
  const checkoutForm = document.getElementById('orderCheckoutForm');
  const formStatus = document.getElementById('orderFormStatus');

  const cart = JSON.parse(localStorage.getItem('butlersCart') || '[]');

  function saveCart() {
    localStorage.setItem('butlersCart', JSON.stringify(cart));
  }

  const params = new URLSearchParams(window.location.search);
  const selectedName = params.get('item');
  const selectedPizza = selectedName ? pizzaData[selectedName] : null;

  if (selectedPizza && selectedName && !cart.some((item) => item.name === selectedName)) {
    cart.push({
      id: `pizza-${selectedName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      name: selectedName,
      subtitle: '26cm Medium pizza',
      price: selectedPizza.price,
      image: selectedPizza.image,
      quantity: 1
    });
    saveCart();
  }

  function money(value) {
    return `R${value.toFixed(2)}`;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function cartSubtotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function deliveryFee(subtotal) {
    if (subtotal === 0) {
      return 0;
    }

    return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  }

  function updateTotals() {
    const subtotal = cartSubtotal();
    const delivery = deliveryFee(subtotal);
    const total = subtotal + delivery;

    if (subtotalElement) subtotalElement.textContent = money(subtotal);
    if (deliveryElement) {
      deliveryElement.textContent =
        subtotal >= FREE_DELIVERY_THRESHOLD && subtotal > 0
          ? 'FREE'
          : money(delivery);
    }
    if (totalElement) totalElement.textContent = money(total);

    if (!progressBar || !progressMessage) {
      return;
    }

    const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
    progressBar.style.width = `${progress}%`;

    if (subtotal === 0) {
      progressMessage.textContent =
        'Add items to unlock free delivery on orders over R150.';
    } else if (subtotal < FREE_DELIVERY_THRESHOLD) {
      progressMessage.innerHTML =
        `You’re only <strong>${money(
          FREE_DELIVERY_THRESHOLD - subtotal
        )}</strong> away from <strong>FREE</strong> delivery!`;
    } else {
      progressMessage.innerHTML =
        'Nice! You unlocked <strong>FREE delivery.</strong>';
    }
  }

  function renderCart() {
    if (!cartItemsElement || !emptyCartElement) {
      return;
    }

    const hasItems = cart.length > 0;
    emptyCartElement.hidden = hasItems;
    cartItemsElement.hidden = !hasItems;

    if (!hasItems) {
      cartItemsElement.innerHTML = '';
      updateTotals();
      return;
    }

    cartItemsElement.innerHTML = cart
      .map(
        (item) => `
          <article class="order-pro-cart-line" data-cart-id="${escapeHtml(item.id)}">
            <img src="assets/${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">
            <div class="order-pro-cart-line-copy">
              <h3>${escapeHtml(item.name)}</h3>
              <p>${escapeHtml(item.subtitle)}</p>
              <button class="order-pro-remove-item" type="button" data-cart-action="remove">Remove</button>
            </div>
            <div class="order-pro-cart-line-side">
              <div class="order-pro-quantity" aria-label="${escapeHtml(item.name)} quantity">
                <button type="button" data-cart-action="decrease" aria-label="Decrease ${escapeHtml(item.name)} quantity">−</button>
                <span>${item.quantity}</span>
                <button type="button" data-cart-action="increase" aria-label="Increase ${escapeHtml(item.name)} quantity">+</button>
              </div>
              <strong>${money(item.price * item.quantity)}</strong>
            </div>
          </article>
        `
      )
      .join('');

    updateTotals();
  }

  function addItem(item) {
    const existing = cart.find((cartItem) => cartItem.id === item.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    saveCart();
    renderCart();
  }

  cartItemsElement?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-cart-action]');
    const line = event.target.closest('[data-cart-id]');

    if (!button || !line) {
      return;
    }

    const item = cart.find((cartItem) => cartItem.id === line.dataset.cartId);

    if (!item) {
      return;
    }

    const action = button.dataset.cartAction;

    if (action === 'increase') {
      item.quantity += 1;
    }

    if (action === 'decrease') {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        cart.splice(cart.indexOf(item), 1);
      }
    }

    if (action === 'remove') {
      cart.splice(cart.indexOf(item), 1);
    }

    saveCart();
    renderCart();
  });

  document.querySelectorAll('.order-addon-card').forEach((card) => {
    const button = card.querySelector('.addon-plus');

    button?.addEventListener('click', () => {
      const price = Number(card.dataset.price || 0);

      addItem({
        id: `addon-${card.dataset.addonId || Date.now()}`,
        name: card.dataset.name || 'Add-on',
        subtitle: 'Popular add-on',
        price,
        image: card.dataset.image || 'addon-garlic-bread.png'
      });

      button.classList.add('is-added');
      button.textContent = 'Added ✓';

      window.setTimeout(() => {
        button.classList.remove('is-added');
        button.textContent = '+ Add';
      }, 950);
    });
  });

  checkoutForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      if (formStatus) {
        formStatus.textContent =
          'Add at least one menu item before continuing to payment.';
      }

      document.querySelector('.order-pro-summary-panel')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }

    if (!checkoutForm.reportValidity()) {
      if (formStatus) {
        formStatus.textContent =
          'Please complete the required delivery details above.';
      }
      return;
    }

    if (formStatus) {
      formStatus.textContent =
        "Your delivery details are ready. Online payment is not connected yet—please contact Butler's Pizza to complete the order.";
    }
  });

  renderCart();
}

/* =========================================================
   CONTACT FORM → GMAIL
   ========================================================= */

function initContactForm() {
  const form = document.getElementById('contactMessageForm');

  // This page does not contain the Gmail contact form.
  if (!form) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const name =
      document.getElementById('contactName')?.value.trim() || '';
    const email =
      document.getElementById('contactEmail')?.value.trim() || '';
    const subjectInput =
      document.getElementById('contactSubject')?.value.trim() || '';
    const message =
      document.getElementById('contactMessage')?.value.trim() || '';

    const subject = subjectInput || `Website enquiry from ${name}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      '',
      'Message:',
      message
    ].join('\n');

    const gmailUrl =
      'https://mail.google.com/mail/?view=cm&fs=1' +
      '&to=' +
      encodeURIComponent('customercare@butlers.co.za') +
      '&su=' +
      encodeURIComponent(subject) +
      '&body=' +
      encodeURIComponent(body);

    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  });
}

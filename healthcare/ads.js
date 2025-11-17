"use strict";

// Ad links
const adLinks = [
  "https://www.effectivegatecpm.com/v37cfafhr?key=cc12415044cd7578b9a4c3abf7e8a7f7", //... Hiran Ads Link ...//
  "https://otieu.com/4/9835092", //... Hansaka Ads Link ...//
  "https://www.effectivegatecpm.com/ndp5e9aww3?key=4efa3e2fabbac771694e2c3791bc9014", //... Share Account Ads Link ...//
  "https://www.effectivegatecpm.com/uccum8g1j?key=dbdc91a1494138cc50a17be31032ce44", //... User-1 Ads Link ...//
  "https://otieu.com/4/9835091", //... User-2 Ads Link ...//
  "https://otieu.com/4/9835088" //... User-3 Ads Link ...//
];

// Direct link for first click
const directLink = "https://otieu.com/4/9835089"; //... Share Account Ads Link ...//

// Popunder links (used by triggerPopunder)
const popunderLinks = [
  directLink
];

// State variables

let clickCount = 0;
let requiredClicks = Math.floor(Math.random() * 3) + 5; // 5 or 6
let adsEnabled = true;
let hasTriggeredPopunder = false;

const videoWrapper = document.getElementById('videoWrapper');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const counterText = document.getElementById('counterText');

function getRandomAd() {
  const randomIndex = Math.floor(Math.random() * adLinks.length);
  return adLinks[randomIndex];
}

function getRandomPopunder() {
  const randomIndex = Math.floor(Math.random() * popunderLinks.length);
  return popunderLinks[randomIndex];
}

function triggerPopunder() {
  if (hasTriggeredPopunder) return;

  const popunderUrl = getRandomPopunder();
  const popunder = window.open(popunderUrl, '_blank', 'width=1,height=1,left=10000,top=10000');

  if (popunder) {
    try {
      popunder.blur();
      window.focus();
      setTimeout(() => {
        try { popunder.close(); } catch(e) {}
      }, 100);
    } catch(e) {}
  }

  hasTriggeredPopunder = true;
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    if (mobileMenu) {
      mobileMenu.classList.toggle('active');
    }
  });
}

document.addEventListener('click', (event) => {
  if (mobileMenu && !mobileMenu.contains(event.target) && event.target !== mobileMenuBtn) {
    mobileMenu.classList.remove('active');
  }
});

if (videoWrapper) {
  videoWrapper.addEventListener('click', (event) => {
    if (event.target && event.target.closest && event.target.closest('.anime-card')) {
      return;
    }
    if (!adsEnabled) return;

    clickCount++;
    const randomAd = clickCount === 1 ? directLink : getRandomAd();
    const adWindow = window.open(randomAd, '_blank');

    // Try to focus back on main window
    setTimeout(() => {
      try {
        if (adWindow) {
          adWindow.blur();
        }
        window.focus();
      } catch(e) {}
    }, 100);

    if (clickCount >= requiredClicks) {
      adsEnabled = false;
      videoWrapper.classList.add('active');

      // Trigger popunder when ads are completed
      triggerPopunder();

      // Reset after 60 seconds
      setTimeout(() => {
        adsEnabled = true;
        clickCount = 0;
        requiredClicks = Math.floor(Math.random() * 3) + 5; // reset to 5 or 6
        videoWrapper.classList.remove('active');
        hasTriggeredPopunder = false;
      }, 60000);
    }
  });
}

// Trigger ads when clicking on cartoon cards
document.addEventListener('click', (event) => {
  const card = event.target && event.target.closest ? event.target.closest('.anime-card') : null;
  if (!card) return;
  if (!adsEnabled) return;

  clickCount++;
  const randomAd = clickCount === 1 ? directLink : getRandomAd();
  const adWindow = window.open(randomAd, '_blank');

  setTimeout(() => {
    try {
      if (adWindow) {
        adWindow.blur();
      }
      window.focus();
    } catch(e) {}
  }, 100);

  if (clickCount >= requiredClicks) {
    adsEnabled = false;
    if (videoWrapper) videoWrapper.classList.add('active');

    triggerPopunder();

    setTimeout(() => {
      adsEnabled = true;
      clickCount = 0;
      requiredClicks = Math.floor(Math.random() * 3) + 5;
      if (videoWrapper) videoWrapper.classList.remove('active');
      hasTriggeredPopunder = false;
    }, 60000);
  }
}, true);

// Initial popup after 30 seconds
setTimeout(() => {
  const randomAd = getRandomAd();
  const adWindow = window.open(randomAd, '_blank');

  // Try to focus back on main window
  setTimeout(() => {
    try {
      if (adWindow) {
        adWindow.blur();
      }
      window.focus();
    } catch(e) {}
  }, 100);
}, 30000);

// Disable right-click context menu
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  return false;
});


/*
 * Y4PEL interactive Africa hero
 * IMPORTANT: Confirm this list with Y4PEL before publishing.
 * The initial entries are editable starter data, not verified organisation records.
 */
const REPRESENTED_COUNTRIES = [
  { name: "Algeria", description: "Part of the African network.", iso: "DZA" },
  { name: "Egypt", description: "Part of the African network.", iso: "EGY" },
  { name: "Senegal", description: "Part of the African network.", iso: "SEN" },
  { name: "Nigeria", description: "Part of the African network.", iso: "NGA" },
  { name: "Burkina Faso", description: "Part of the African network.", iso: "BFA" },
  { name: "Cameroon", description: "Part of the African network.", iso: "CMR" },
  { name: "Democratic Republic of the Congo", description: "Part of the African network.", iso: "COD" },
  { name: "Ethiopia", description: "Part of the African network.", iso: "ETH" },
  { name: "Kenya", description: "Part of the African network.", iso: "KEN" },
  { name: "Somalia", description: "Part of the African network.", iso: "SOM" },
  { name: "Uganda", description: "Part of the African network.", iso: "UGA" },
  { name: "Tanzania", description: "Part of the African network.", iso: "TZA" },
  { name: "Zambia", description: "Part of the African network.", iso: "ZMB" },
  { name: "Namibia", description: "Part of the African network.", iso: "NAM" },
  { name: "Madagascar", description: "Part of the African network.", iso: "MDG" }
];

const representedByName = new Map(REPRESENTED_COUNTRIES.map(country => [country.name, country]));
const countryCount = document.getElementById("countryCount");
const countryName = document.getElementById("countryName");
const countryDescription = document.getElementById("countryDescription");
countryCount.textContent = String(REPRESENTED_COUNTRIES.length);
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

function showCountry(country) {
  if (!country) return;
  countryName.textContent = country.name;
  countryDescription.textContent = country.description || "Part of the Y4PEL network.";
}

function initGlobe() {
  const container = document.getElementById("globeViz");
  if (!container || typeof Globe !== "function" || !window.topojson) {
    container.innerHTML = '<div class="map-fallback">Interactive globe could not load. Please check your internet connection.</div>';
    return;
  }

  const globe = Globe()(container)
    .backgroundColor("rgba(0,0,0,0)")
    .showAtmosphere(true)
    .atmosphereColor("#83e8ad")
    .atmosphereAltitude(0.16)
    .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-dark.jpg")
    .polygonsData([])
    .polygonCapColor(feature => representedByName.has(feature.properties.name) ? "rgba(49, 202, 125, 0.82)" : "rgba(16, 93, 66, 0.22)")
    .polygonSideColor(() => "rgba(35, 164, 104, 0.18)")
    .polygonStrokeColor(feature => representedByName.has(feature.properties.name) ? "#a8f5c9" : "rgba(190, 235, 211, 0.24)")
    .polygonAltitude(feature => representedByName.has(feature.properties.name) ? 0.012 : 0.002)
    .polygonLabel(feature => {
      const represented = representedByName.get(feature.properties.name);
      return `<div style="padding:7px 10px;border-radius:6px;background:#063a2c;color:white;font:12px 'DM Sans',sans-serif;border:1px solid rgba(184,240,210,.4)">${feature.properties.name}${represented ? '<br><span style="color:#9be5bc;font-size:10px">Y4PEL network country</span>' : ""}</div>`;
    })
    .onPolygonHover(feature => {
      if (feature && representedByName.has(feature.properties.name)) showCountry(representedByName.get(feature.properties.name));
    })
    .onPolygonClick(feature => {
      if (feature && representedByName.has(feature.properties.name)) showCountry(representedByName.get(feature.properties.name));
    })
    .polygonsTransitionDuration(250);

  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.35;
  globe.controls().enableDamping = true;
  globe.controls().dampingFactor = 0.08;
  globe.controls().minDistance = 150;
  globe.controls().maxDistance = 350;

  // Start with Africa facing the visitor.
  globe.pointOfView({ lat: 3, lng: 20, altitude: 2.05 }, 0);

  fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .then(response => {
      if (!response.ok) throw new Error("Could not load country geography");
      return response.json();
    })
    .then(world => {
      const countries = topojson.feature(world, world.objects.countries).features;
      globe.polygonsData(countries);
      // world-atlas country names are supplied by its properties when available.
      // Ensure the initial country detail reflects the first configured country.
      showCountry(REPRESENTED_COUNTRIES[0]);
      // Adjust globe sizing after the geography has loaded.
      resizeGlobe();
    })
    .catch(error => {
      console.error(error);
      countryName.textContent = "Map unavailable";
      countryDescription.textContent = "Check your connection and reload to explore the globe.";
    });

  function resizeGlobe() {
    const rect = container.getBoundingClientRect();
    globe.width(Math.max(280, rect.width));
    globe.height(Math.max(300, rect.height));
  }
  const resizeObserver = new ResizeObserver(resizeGlobe);
  resizeObserver.observe(container);
  window.addEventListener("resize", resizeGlobe);
  resizeGlobe();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) globe.controls().autoRotate = false;
}
initGlobe();

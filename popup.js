const checkboxes = ["opgg", "opggmulti", "ugg", "uggmulti", "dpm"];
const defaults = { opgg: true, dpm: true }; // opgg abd DPM.lol are default 

// Initialize UI
document.addEventListener("DOMContentLoaded", async () => {
  // load stored data (checkboxes u checked)
  const stored = await chrome.storage.sync.get(checkboxes);

  // set checkboxes
  for (const id of checkboxes) {
    const el = document.getElementById(id);
    el.checked = stored[id] ?? defaults[id] ?? false;

    // save changes to checkboxes
    el.addEventListener("change", () => {
      chrome.storage.sync.set({ [id]: el.checked });
    });
  }
});

// Button / Enter
document.getElementById("openBtn").addEventListener("click", openProfiles);
document.getElementById("names").addEventListener("keydown", (e) => {
  if (e.key === "Enter") openProfiles();
});

function openProfiles() {
  const namesInput = document.getElementById("names").value.trim();
  if (!namesInput) return;

  const players = namesInput.split(",").map(p => p.trim()).filter(Boolean);
  const states = {};

  for (const id of checkboxes) {
    states[id] = document.getElementById(id).checked;
  }

  const tags = new Set();

  for (const player of players) {
    if (!player.includes("#")) continue;
    const [name, tag] = player.split("#");
    const tagUpper = tag.toUpperCase();
    const encodedName = encodeURIComponent(name);

    if (states.opgg)
      chrome.tabs.create({ url: `https://op.gg/lol/summoners/EUW/${encodedName}-${tagUpper}` });

    if (states.ugg)
      chrome.tabs.create({ url: `https://u.gg/lol/profile/euw1/${encodedName}-${tagUpper}/overview` });

    if (states.dpm)
      chrome.tabs.create({ url: `https://dpm.lol/${encodedName}-${tagUpper}` });

    tags.add(tagUpper);
  }


if (states.opggmulti || states.uggmulti) {
  const opggNames = players
    .map(p => encodeURIComponent(p.trim()))
    .join("%2C+");

  const uggNames = players
    .map(p => p.trim().replace("#", "-").replaceAll(" ", "%20"))
    .join(",");

  if (states.opggmulti) {
    const opggUrl = `https://op.gg/de/lol/multisearch/euw?summoners=${opggNames}%2C`;
    chrome.tabs.create({ url: opggUrl });
  }

  if (states.uggmulti) {
    const uggUrl = `https://u.gg/lol/multisearch?summoners=${uggNames}&region=euw1`;
    chrome.tabs.create({ url: uggUrl });
  }
}

}
// Maybe extra button for Region EUW with that input, default EUW then saved. Dropdown oder Eingabe??
// 
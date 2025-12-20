const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");
const issueSelect = document.getElementById("issueSelect");
const customIssueWrap = document.getElementById("customIssueWrap");

const setTab = (tabName) => {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === tabName;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === tabName);
  });
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setTab(tab.dataset.tab));
});

if (issueSelect && customIssueWrap) {
  issueSelect.addEventListener("change", () => {
    const showCustom = issueSelect.value === "Something else";
    customIssueWrap.classList.toggle("hidden", !showCustom);
  });
}

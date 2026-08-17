(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  var STORAGE_KEY = "hit-new-lecturers-checklist-v1";
  var checkboxes = Array.from(document.querySelectorAll(".task-checkbox"));
  var progressText = document.getElementById("progressText");
  var progressBar = document.getElementById("progressBar");
  var progressElement = document.getElementById("checklistProgress");
  var progressAnnouncement = document.getElementById("progressAnnouncement");
  var resetButton = document.getElementById("resetChecklist");
  var printButton = document.getElementById("printChecklist");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var siteNavbar = document.getElementById("siteNavbar");
  var mainNav = document.getElementById("mainNav");
  var backToTop = document.getElementById("backToTop");

  // נקודת חיבור עתידית לאנליטיקה. כרגע אינה שולחת מידע לשום שירות.
  window.siteAnalytics = window.siteAnalytics || function () {};

  function getSavedTasks() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveTasks(taskIds) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(taskIds));
    } catch (error) {
      // האתר והצ׳ק־ליסט ממשיכים לפעול גם אם אחסון מקומי חסום.
    }
  }

  function getCompletedTasks() {
    return checkboxes.filter(function (checkbox) {
      return checkbox.checked;
    }).map(function (checkbox) {
      return checkbox.dataset.taskId;
    });
  }

  function updateProgress(announce) {
    var completed = getCompletedTasks();
    var total = checkboxes.length;
    var percent = total ? Math.round((completed.length / total) * 100) : 0;

    progressText.textContent = completed.length + " מתוך " + total + " משימות";
    progressBar.style.width = percent + "%";
    progressElement.setAttribute("aria-valuemax", String(total));
    progressElement.setAttribute("aria-valuenow", String(completed.length));
    progressElement.setAttribute("aria-valuetext", percent + " אחוזים הושלמו");

    if (announce) {
      progressAnnouncement.textContent = "עדכון התקדמות: " + completed.length + " מתוך " + total + " משימות הושלמו.";
    }

    saveTasks(completed);
  }

  function restoreChecklist() {
    var completed = new Set(getSavedTasks());
    checkboxes.forEach(function (checkbox) {
      checkbox.checked = completed.has(checkbox.dataset.taskId);
    });
    updateProgress(false);
  }

  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      updateProgress(true);
      window.siteAnalytics("checklist_change", {
        task: checkbox.dataset.taskId,
        checked: checkbox.checked
      });
    });
  });

  resetButton.addEventListener("click", function () {
    var shouldReset = window.confirm("לאפס את כל הסימונים בצ’ק־ליסט? לא ניתן לשחזר אותם לאחר האיפוס.");
    if (!shouldReset) return;

    checkboxes.forEach(function (checkbox) {
      checkbox.checked = false;
    });
    updateProgress(true);
    checkboxes[0].focus();
  });

  printButton.addEventListener("click", function () {
    window.siteAnalytics("checklist_print", {});
    window.print();
  });

  var taskModalElement = document.getElementById("taskInfoModal");
  var taskModal = window.bootstrap ? window.bootstrap.Modal.getOrCreateInstance(taskModalElement) : null;
  var lastModalTrigger = null;
  var taskTitle = document.getElementById("taskInfoTitle");
  var taskAction = document.getElementById("taskAction");
  var taskContact = document.getElementById("taskContact");
  var taskMissing = document.getElementById("taskMissing");

  document.querySelectorAll("[data-task-info]").forEach(function (button) {
    button.addEventListener("click", function () {
      var content = window.NEW_LECTURERS_CONTENT;
      var details = content && content.checklistDetails[button.dataset.taskInfo];
      if (!details || !taskModal) return;

      taskTitle.textContent = details.title;
      taskAction.textContent = details.action;
      taskContact.textContent = details.contact;
      taskMissing.innerHTML = "<strong>להשלמה לפני השקה:</strong> " + details.missing;
      lastModalTrigger = button;
      taskModal.show(button);
      window.siteAnalytics("checklist_info_open", { task: button.dataset.taskInfo });
    });
  });

  taskModalElement.addEventListener("hidden.bs.modal", function () {
    if (lastModalTrigger && document.contains(lastModalTrigger)) {
      lastModalTrigger.focus();
    }
  });

  document.querySelectorAll(".support-category").forEach(function (category) {
    var switchVersion = 0;

    category.querySelectorAll("details").forEach(function (item) {
      var summary = item.querySelector("summary");

      summary.addEventListener("click", function (event) {
        event.preventDefault();
        switchVersion += 1;
        var currentVersion = switchVersion;
        var wasOpen = item.open;
        var openItems = Array.from(category.querySelectorAll("details[open]"));

        openItems.forEach(function (openItem) {
          openItem.removeAttribute("open");
        });

        if (wasOpen) return;

        if (!openItems.length) {
          item.setAttribute("open", "");
          return;
        }

        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            if (currentVersion === switchVersion) {
              item.setAttribute("open", "");
            }
          });
        });
      });
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var targetId = link.getAttribute("href");
      if (targetId === "#") return;
      var target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion.matches ? "auto" : "smooth",
        block: "start"
      });

      if (targetId !== "#top") {
        window.history.replaceState(null, "", targetId);
      }

      if (window.bootstrap && mainNav.classList.contains("show")) {
        window.bootstrap.Collapse.getOrCreateInstance(mainNav).hide();
      }
    });
  });

  var persistentControlsTicking = false;

  function updatePersistentControls() {
    var currentY = Math.max(0, window.scrollY || window.pageYOffset);
    siteNavbar.classList.remove("nav-hidden");
    siteNavbar.classList.toggle("nav-at-top", currentY < 24);
    backToTop.classList.toggle("is-visible", currentY > 420);
    persistentControlsTicking = false;
  }

  function requestPersistentControlsUpdate() {
    if (persistentControlsTicking) return;
    persistentControlsTicking = true;
    window.requestAnimationFrame(updatePersistentControls);
  }

  window.addEventListener("scroll", requestPersistentControlsUpdate, { passive: true });
  updatePersistentControls();

  if (window.bootstrap && window.bootstrap.ScrollSpy) {
    new window.bootstrap.ScrollSpy(document.body, {
      target: "#mainNav",
      rootMargin: "-22% 0px -62%",
      smoothScroll: false
    });

    window.addEventListener("activate.bs.scrollspy", function () {
      document.querySelectorAll("#mainNav .nav-link").forEach(function (navLink) {
        if (navLink.classList.contains("active")) {
          navLink.setAttribute("aria-current", "location");
        } else {
          navLink.removeAttribute("aria-current");
        }
      });
    });
  }

  var ticking = false;

  function updateParallax() {
    var scrollY = Math.max(0, window.scrollY || window.pageYOffset);
    var cappedHero = Math.min(scrollY, 430);
    var rootStyle = document.documentElement.style;

    rootStyle.setProperty("--sky-shift", (scrollY * 0.025).toFixed(2) + "px");
    rootStyle.setProperty("--diver-drop", (cappedHero * 0.16).toFixed(2) + "px");
    rootStyle.setProperty("--diver-rotate", (cappedHero * 0.025).toFixed(2) + "deg");
    rootStyle.setProperty("--bubbles-shift", (scrollY * -0.018).toFixed(2) + "px");
    rootStyle.setProperty("--fish-one-shift", (scrollY * 0.055).toFixed(2) + "px");
    rootStyle.setProperty("--fish-two-shift", (scrollY * 0.03).toFixed(2) + "px");
    rootStyle.setProperty("--reef-shift", Math.max(-70, scrollY * -0.009).toFixed(2) + "px");
    ticking = false;
  }

  function requestParallaxUpdate() {
    if (reduceMotion.matches || ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateParallax);
  }

  if (!reduceMotion.matches) {
    updateParallax();
    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
  }

  reduceMotion.addEventListener("change", function (event) {
    if (event.matches) {
      document.documentElement.removeAttribute("style");
      window.removeEventListener("scroll", requestParallaxUpdate);
    } else {
      updateParallax();
      window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    }
  });

  restoreChecklist();
})();

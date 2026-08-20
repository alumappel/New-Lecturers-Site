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
  var resetModalElement = document.getElementById("resetChecklistModal");
  var confirmResetButton = document.getElementById("confirmResetChecklist");
  var resetModal = window.bootstrap && resetModalElement ? window.bootstrap.Modal.getOrCreateInstance(resetModalElement) : null;
  var focusFirstTaskAfterReset = false;
  var printButton = document.getElementById("printChecklist");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var siteNavbar = document.getElementById("siteNavbar");
  var mainNav = document.getElementById("mainNav");
  var backToTop = document.getElementById("backToTop");
  var toolboxSection = document.getElementById("toolbox");
  var toolboxCoralTwo = document.querySelector(".toolbox-coral-two");
  var toolboxCoralThree = document.querySelector(".toolbox-coral-three");
  var desktopViewport = window.matchMedia("(min-width: 768px)");
  var supportSection = document.getElementById("support");
  var supportCreatures = Array.from(document.querySelectorAll(".fluorescent-creatures img"));
  var supportCreatureDirections = [1, -1, 1, -1, 1, -1, 1, -1, 1];
  var supportCreatureMotion = supportCreatures.map(function (creature, index) {
    return { direction: supportCreatureDirections[index] || 1, x: 0, path: 0 };
  });
  var lastSupportCreatureScroll = null;
  var aboutKelpField = document.querySelector(".about-kelp-field");
  var kelpScrollPauseTimer = null;
  var checklistSection = document.getElementById("checklist");
  var checklistFish = Array.from(document.querySelectorAll(".checklist-fish"));
  var checklistFishDirections = [1, 1, 1, -1, -1, 1, -1, 1, -1];
  var checklistFishMotion = checklistFish.map(function (fish, index) {
    return { direction: checklistFishDirections[index] || 1, x: 0, path: 0 };
  });
  var lastChecklistScroll = null;
  var mobileViewport = window.matchMedia("(max-width: 767.98px)");
  var checklistGroupToggles = Array.from(document.querySelectorAll(".checklist-group-toggle"));
  var mobileResourceToggles = Array.from(document.querySelectorAll(".mobile-resource-toggle"));
  var sectionNavItems = Array.from(document.querySelectorAll('#mainNav .nav-link[href^="#"]')).map(function (navLink) {
    var section = document.querySelector(navLink.getAttribute("href"));
    return section ? { navLink: navLink, section: section } : null;
  }).filter(Boolean);

  // נקודת חיבור עתידית לאנליטיקה. כרגע אינה שולחת מידע לשום שירות.
  window.siteAnalytics = window.siteAnalytics || function () { };

  function setExpandableState(toggle, isExpanded) {
    var content = document.getElementById(toggle.getAttribute("aria-controls"));
    toggle.setAttribute("aria-expanded", String(isExpanded));

    if (content) {
      content.hidden = !isExpanded;
    }
  }

  function updateMobileAccordions() {
    if (mobileViewport.matches) {
      checklistGroupToggles.forEach(function (toggle) {
        setExpandableState(toggle, false);
      });

      mobileResourceToggles.forEach(function (toggle, index) {
        setExpandableState(toggle, index === 0);
      });
      return;
    }

    checklistGroupToggles.concat(mobileResourceToggles).forEach(function (toggle) {
      setExpandableState(toggle, true);
    });
  }

  function setMobileAccordionListeners(toggles) {
    toggles.forEach(function (toggle) {
      toggle.addEventListener("click", function () {
        if (!mobileViewport.matches) return;

        var shouldExpand = toggle.getAttribute("aria-expanded") !== "true";
        toggles.forEach(function (otherToggle) {
          setExpandableState(otherToggle, otherToggle === toggle && shouldExpand);
        });
      });
    });
  }

  setMobileAccordionListeners(checklistGroupToggles);
  setMobileAccordionListeners(mobileResourceToggles);
  updateMobileAccordions();

  if (mobileViewport.addEventListener) {
    mobileViewport.addEventListener("change", updateMobileAccordions);
  } else {
    mobileViewport.addListener(updateMobileAccordions);
  }

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

  function resetChecklist() {
    checkboxes.forEach(function (checkbox) {
      checkbox.checked = false;
    });
    updateProgress(true);

    if (resetModal) {
      focusFirstTaskAfterReset = true;
      resetModal.hide();
    } else if (checkboxes[0]) {
      checkboxes[0].focus();
    }
  }

  resetButton.addEventListener("click", function () {
    if (resetModal) {
      resetModal.show(resetButton);
      return;
    }

    resetChecklist();
  });

  if (confirmResetButton) {
    confirmResetButton.addEventListener("click", resetChecklist);
  }

  if (resetModalElement) {
    resetModalElement.addEventListener("hidden.bs.modal", function () {
      if (focusFirstTaskAfterReset && checkboxes[0]) {
        checkboxes[0].focus();
      }
      focusFirstTaskAfterReset = false;
    });
  }

  printButton.addEventListener("click", function () {
    window.siteAnalytics("checklist_print", {});
    window.print();
  });

  var taskModalElement = document.getElementById("taskInfoModal");
  var taskModal = window.bootstrap ? window.bootstrap.Modal.getOrCreateInstance(taskModalElement) : null;
  var lastModalTrigger = null;
  var taskTitle = document.getElementById("taskInfoTitle");
  var taskBody = document.getElementById("taskInfoDescription");

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function sanitizeUrl(url) {
    if (!url) return "#";
    var trimmed = String(url).trim();
    if (/^(https?:\/\/|mailto:|tel:|\/|\.\/|\.\.\/|#|assets\/)/i.test(trimmed)) {
      return trimmed;
    }
    return encodeURI(trimmed);
  }

  function renderBulletItem(item) {
    if (!item) return "";

    if (typeof item === "string") {
      return "<li>" + escapeHtml(item) + "</li>";
    }

    if (typeof item === "object") {
      var labelHtml = item.label ? '<strong class="task-modal-item-label">' + escapeHtml(item.label) + ':</strong> ' : '';
      var itemText = item.text || item.title || "";
      var contentHtml = "";

      if (item.phone) {
        var rawPhone = String(item.phone).trim();
        var cleanPhone = rawPhone.replace(/[^0-9+*#]/g, "");
        var phoneLabel = itemText || rawPhone;
        contentHtml = '<a class="task-modal-link task-modal-phone" href="tel:' + cleanPhone + '" dir="ltr">' + escapeHtml(phoneLabel) + '</a>';
        if (item.contactName) {
          contentHtml += ' <span class="text-muted">(' + escapeHtml(item.contactName) + ')</span>';
        }
      } else if (item.url || item.link) {
        var linkUrl = sanitizeUrl(item.url || item.link);
        var linkLabel = itemText || item.url || item.link;
        contentHtml = '<a class="task-modal-link task-modal-url" href="' + escapeHtml(linkUrl) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(linkLabel) + ' <span class="visually-hidden">(נפתח בלשונית חדשה)</span></a>';
      } else if (item.file || item.doc) {
        var fileUrl = sanitizeUrl(item.file || item.doc);
        var fileLabel = itemText || "הורדת מסמך";
        contentHtml = '<a class="task-modal-link task-modal-doc" href="' + escapeHtml(fileUrl) + '" target="_blank" rel="noopener noreferrer" download>' + escapeHtml(fileLabel) + '</a>';
      } else if (item.email || item.mail) {
        var emailVal = String(item.email || item.mail).trim();
        var emailLabel = itemText || emailVal;
        contentHtml = '<a class="task-modal-link task-modal-email" href="mailto:' + escapeHtml(emailVal) + '">' + escapeHtml(emailLabel) + '</a>';
      } else if (itemText) {
        contentHtml = escapeHtml(itemText);
      }

      if (item.note || item.subtext) {
        contentHtml += '<div class="task-modal-subtext text-muted small mt-1">' + escapeHtml(item.note || item.subtext) + '</div>';
      }

      return "<li>" + labelHtml + contentHtml + "</li>";
    }

    return "";
  }

  document.querySelectorAll("[data-task-info]").forEach(function (button) {
    button.addEventListener("click", function () {
      var content = window.NEW_LECTURERS_CONTENT;
      var details = content && content.checklistDetails && content.checklistDetails[button.dataset.taskInfo];
      if (!details || !taskModal || !taskBody) return;

      if (taskTitle) {
        taskTitle.textContent = details.title || "מידע נוסף";
      }

      var bodyHtml = "";

      // מה עושים (אופציונלי - מוצג רק אם קיים)
      if (details.action) {
        var actionHeading = details.actionTitle || "מה עושים?";
        bodyHtml += '<div class="task-modal-section mb-3">' +
          '<h3 class="h6 fw-bold">' + escapeHtml(actionHeading) + '</h3>' +
          '<p class="mb-0">' + escapeHtml(details.action) + '</p>' +
          '</div>';
      }

      // למי פונים (אופציונלי - מוצג רק אם קיים)
      if (details.contact) {
        var contactHeading = details.contactTitle || "למי פונים?";
        bodyHtml += '<div class="task-modal-section mb-3">' +
          '<h3 class="h6 fw-bold">' + escapeHtml(contactHeading) + '</h3>' +
          '<p class="mb-0">' + escapeHtml(details.contact) + '</p>' +
          '</div>';
      }

      // רשימת בולטים / קישורים / טלפונים / מסמכים (אופציונלי - מוצג רק אם קיים ויש פריטים)
      var bulletList = details.bullets || details.items || details.links;
      if (Array.isArray(bulletList) && bulletList.length > 0) {
        var bulletsHeading = details.bulletsTitle || details.linksTitle || "קישורים ומידע שימושי:";
        var itemsHtml = bulletList.map(renderBulletItem).filter(Boolean).join("");

        if (itemsHtml) {
          bodyHtml += '<div class="task-modal-section mb-3">' +
            (bulletsHeading ? '<h3 class="h6 fw-bold mb-2">' + escapeHtml(bulletsHeading) + '</h3>' : '') +
            '<ul class="task-modal-list">' + itemsHtml + '</ul>' +
            '</div>';
        }
      }

      // הערת placeholder להשלמה לפני השקה (אופציונלי - מוצג רק אם קיים)
      if (details.missing) {
        bodyHtml += '<div class="content-placeholder mt-3" role="note">' +
          '<strong>להשלמה לפני השקה:</strong> ' + escapeHtml(details.missing) +
          '</div>';
      }

      taskBody.innerHTML = bodyHtml;
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
    var isAnimating = false;

    function collapseDetails(detailsItem, animate) {
      return new Promise(function (resolve) {
        var content = detailsItem.querySelector(".support-details-content");
        if (!content || !detailsItem.hasAttribute("open")) {
          resolve();
          return;
        }

        if (!animate || reduceMotion.matches) {
          detailsItem.removeAttribute("open");
          resolve();
          return;
        }

        var startHeight = content.offsetHeight;
        content.style.overflow = "hidden";
        content.style.height = startHeight + "px";

        var anim = content.animate(
          [
            { height: startHeight + "px" },
            { height: "0px" }
          ],
          {
            duration: 220,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)"
          }
        );

        anim.onfinish = function () {
          detailsItem.removeAttribute("open");
          content.style.height = "";
          content.style.overflow = "";
          resolve();
        };
      });
    }

    function expandDetails(detailsItem, animate) {
      return new Promise(function (resolve) {
        var content = detailsItem.querySelector(".support-details-content");
        if (!content) {
          detailsItem.setAttribute("open", "");
          resolve();
          return;
        }

        detailsItem.setAttribute("open", "");

        if (!animate || reduceMotion.matches) {
          resolve();
          return;
        }

        var endHeight = content.offsetHeight;
        content.style.overflow = "hidden";
        content.style.height = "0px";

        var anim = content.animate(
          [
            { height: "0px" },
            { height: endHeight + "px" }
          ],
          {
            duration: 250,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)"
          }
        );

        anim.onfinish = function () {
          content.style.height = "";
          content.style.overflow = "";
          resolve();
        };
      });
    }

    category.querySelectorAll("details").forEach(function (item) {
      var summary = item.querySelector("summary");
      if (!summary) return;

      summary.addEventListener("click", function (event) {
        event.preventDefault();
        if (isAnimating) return;

        var isOpen = item.hasAttribute("open");
        var openItems = Array.from(category.querySelectorAll("details[open]"));

        if (isOpen) {
          isAnimating = true;
          collapseDetails(item, true).then(function () {
            isAnimating = false;
          });
        } else {
          isAnimating = true;
          var closePromises = openItems.map(function (openItem) {
            return collapseDetails(openItem, true);
          });

          Promise.all(closePromises).then(function () {
            expandDetails(item, true).then(function () {
              isAnimating = false;
            });
          });
        }
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
      window.setTimeout(requestPersistentControlsUpdate, 0);

      if (targetId !== "#top") {
        window.history.replaceState(null, "", targetId);
      }

      if (window.bootstrap && mainNav.classList.contains("show")) {
        window.bootstrap.Collapse.getOrCreateInstance(mainNav).hide();
      }
    });
  });

  var persistentControlsTicking = false;

  function updateSectionNavigation() {
    if (!sectionNavItems.length) return;

    var navbarHeight = siteNavbar ? siteNavbar.getBoundingClientRect().height : 0;
    var activationLine = navbarHeight + ((window.innerHeight - navbarHeight) * 0.28);
    var activeItem = null;

    sectionNavItems.forEach(function (item) {
      if (item.section.getBoundingClientRect().top <= activationLine) {
        activeItem = item;
      }
    });

    sectionNavItems.forEach(function (item) {
      var isActive = item === activeItem;
      item.navLink.classList.toggle("active", isActive);

      if (isActive) {
        item.navLink.setAttribute("aria-current", "location");
      } else {
        item.navLink.removeAttribute("aria-current");
      }
    });
  }

  function updatePersistentControls() {
    var currentY = Math.max(0, window.scrollY || window.pageYOffset);
    siteNavbar.classList.remove("nav-hidden");
    siteNavbar.classList.toggle("nav-at-top", currentY < 24);
    backToTop.classList.toggle("is-visible", currentY > 420);
    updateSectionNavigation();
    persistentControlsTicking = false;
  }

  function requestPersistentControlsUpdate() {
    if (persistentControlsTicking) return;
    persistentControlsTicking = true;
    window.requestAnimationFrame(updatePersistentControls);
  }

  window.addEventListener("scroll", requestPersistentControlsUpdate, { passive: true });
  window.addEventListener("resize", requestPersistentControlsUpdate, { passive: true });
  window.addEventListener("load", requestPersistentControlsUpdate, { once: true });
  updatePersistentControls();

  var ticking = false;

  function updateParallax() {
    var scrollY = Math.max(0, window.scrollY || window.pageYOffset);
    var cappedHero = Math.min(scrollY, 430);
    var rootStyle = document.documentElement.style;

    rootStyle.setProperty("--sky-shift", (scrollY * 0.025).toFixed(2) + "px");
    rootStyle.setProperty("--diver-drop", (cappedHero * 0.16).toFixed(2) + "px");
    rootStyle.setProperty("--diver-rotate", (cappedHero * 0.025).toFixed(2) + "deg");
    rootStyle.setProperty("--bubbles-shift", (scrollY * -0.018).toFixed(2) + "px");

    if (toolboxSection && desktopViewport.matches) {
      if (toolboxCoralTwo) {
        var coralTwoBounds = toolboxCoralTwo.getBoundingClientRect();
        var coralTwoProgress = Math.max(0, Math.min(1, (window.innerHeight - coralTwoBounds.top) / (window.innerHeight * 0.58)));
        var coralTwoRemainingDistance = Math.pow(1 - coralTwoProgress, 2);

        toolboxSection.style.setProperty("--toolbox-coral-left-enter", (-224 * coralTwoRemainingDistance).toFixed(2) + "px");
      }

      if (toolboxCoralThree) {
        var coralThreeBounds = toolboxCoralThree.getBoundingClientRect();
        var coralThreeProgress = Math.max(0, Math.min(1, (window.innerHeight - coralThreeBounds.top) / (window.innerHeight * 0.58)));
        var coralThreeRemainingDistance = Math.pow(1 - coralThreeProgress, 2);

        toolboxSection.style.setProperty("--toolbox-coral-right-enter", (224 * coralThreeRemainingDistance).toFixed(2) + "px");
      }
    }

    if (supportSection && supportCreatures.length) {
      var supportBounds = supportSection.getBoundingClientRect();
      var isSupportVisible = supportBounds.bottom > 0 && supportBounds.top < window.innerHeight;

      if (isSupportVisible) {
        var supportScroll = scrollY - (supportSection.offsetTop - window.innerHeight);
        var supportScrollDelta = lastSupportCreatureScroll === null ? 0 : Math.max(-52, Math.min(52, supportScroll - lastSupportCreatureScroll));

        supportCreatures.forEach(function (creature, index) {
          var motion = supportCreatureMotion[index];

          motion.x = Math.max(-60, Math.min(60, motion.x + (supportScrollDelta * 0.052 * motion.direction)));
          motion.path += Math.abs(supportScrollDelta) * 0.052;

          var swimY = Math.sin((motion.path * 0.2) + (index * 1.25)) * 3.2;
          var swimTurn = Math.sin((motion.path * 0.14) + (index * 1.25)) * 2.1;

          creature.style.setProperty("--creature-swim-x", motion.x.toFixed(2) + "px");
          creature.style.setProperty("--creature-swim-y", swimY.toFixed(2) + "px");
          creature.style.setProperty("--creature-swim-turn", swimTurn.toFixed(2) + "deg");
        });

        lastSupportCreatureScroll = supportScroll;
      } else {
        lastSupportCreatureScroll = null;
      }
    }

    if (checklistSection && checklistFish.length) {
      var checklistBounds = checklistSection.getBoundingClientRect();
      var isChecklistVisible = checklistBounds.bottom > 0 && checklistBounds.top < window.innerHeight;

      if (isChecklistVisible) {
        var checklistScroll = scrollY - (checklistSection.offsetTop - window.innerHeight);
        var bubbleShift = Math.max(-180, Math.min(0, checklistScroll * -0.11));

        rootStyle.setProperty("--checklist-bubbles-shift", bubbleShift.toFixed(2) + "px");

        checklistFish.forEach(function (fish, index) {
          var motion = checklistFishMotion[index];
          var scrollDelta = lastChecklistScroll === null ? 0 : Math.max(-56, Math.min(56, checklistScroll - lastChecklistScroll));

          motion.x = Math.max(-80, Math.min(80, motion.x + (scrollDelta * 0.07 * motion.direction)));
          motion.path += Math.abs(scrollDelta) * 0.065;

          var swimY = Math.sin((motion.path * 0.18) + (index * 1.35)) * 4;
          var swimTurn = Math.sin((motion.path * 0.12) + (index * 1.35)) * 2.4;

          fish.style.setProperty("--fish-swim-x", motion.x.toFixed(2) + "px");
          fish.style.setProperty("--fish-swim-y", swimY.toFixed(2) + "px");
          fish.style.setProperty("--fish-swim-turn", swimTurn.toFixed(2) + "deg");
        });

        lastChecklistScroll = checklistScroll;
      } else {
        lastChecklistScroll = null;
      }
    }

    ticking = false;
  }

  function keepKelpAnimatingWhileScrolling() {
    if (aboutKelpField) {
      aboutKelpField.classList.add("is-kelp-animating");
      window.clearTimeout(kelpScrollPauseTimer);
      kelpScrollPauseTimer = window.setTimeout(function () {
        aboutKelpField.classList.remove("is-kelp-animating");
      }, 650);
    }
  }

  function requestParallaxUpdate() {
    if (reduceMotion.matches) return;

    keepKelpAnimatingWhileScrolling();

    if (ticking) return;

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
      checklistFish.forEach(function (fish) {
        fish.style.removeProperty("--fish-swim-x");
        fish.style.removeProperty("--fish-swim-y");
        fish.style.removeProperty("--fish-swim-turn");
      });
      checklistFishMotion.forEach(function (motion) {
        motion.x = 0;
        motion.path = 0;
      });
      lastChecklistScroll = null;
      supportCreatures.forEach(function (creature) {
        creature.style.removeProperty("--creature-swim-x");
        creature.style.removeProperty("--creature-swim-y");
        creature.style.removeProperty("--creature-swim-turn");
      });
      supportCreatureMotion.forEach(function (motion) {
        motion.x = 0;
        motion.path = 0;
      });
      lastSupportCreatureScroll = null;
      window.clearTimeout(kelpScrollPauseTimer);
      if (aboutKelpField) aboutKelpField.classList.remove("is-kelp-animating");
      window.removeEventListener("scroll", requestParallaxUpdate);
    } else {
      updateParallax();
      window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    }
  });

  // Auto-show connectedModal when reaching 50% scroll depth (once per session)
  var autoConnectedModal = document.getElementById("connectedModal");
  if (autoConnectedModal && window.bootstrap && window.bootstrap.Modal) {
    if (!sessionStorage.getItem("hit_connected_modal_shown")) {
      var checkScrollPopup = function () {
        var scrollPos = window.scrollY || window.pageYOffset;
        var maxScroll = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
        if (maxScroll > 0 && (scrollPos / maxScroll) >= 0.50) {
          sessionStorage.setItem("hit_connected_modal_shown", "true");
          window.removeEventListener("scroll", checkScrollPopup);
          var bsModal = window.bootstrap.Modal.getInstance(autoConnectedModal) || new window.bootstrap.Modal(autoConnectedModal);
          bsModal.show();
        }
      };
      window.addEventListener("scroll", checkScrollPopup, { passive: true });
    }
  }

  restoreChecklist();
})();

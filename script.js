/* ============================================================
   NetworkFinder AI — application logic
   All data below is fictional and exists only for this demo.
   ============================================================ */

(function () {
  "use strict";

  /* ---------------- Reference data ---------------- */

  const NETWORKS = {
    mtn: { name: "MTN", logo: "MTN", brand: "#ffcb05", brand2: "#f5a623", ink: "#1a1500" },
    airtel: { name: "Airtel", logo: "A", brand: "#e60000", brand2: "#ff5252", ink: "#ffffff" },
    glo: { name: "Glo", logo: "G", brand: "#00a651", brand2: "#4ade80", ink: "#03210f" },
    etisalat: { name: "9mobile", logo: "9", brand: "#9dc813", brand2: "#c8e64a", ink: "#12200a" }
  };

  const NETWORK_KEYS = ["mtn", "airtel", "glo", "etisalat"];

  const OVERALL_WEIGHTS = { down: 0.35, up: 0.2, ping: 0.25, signal: 0.2 };

  const QUALITY_COLORS = { strong: "#22c55e", moderate: "#f5b942", weak: "#ef4444" };

  const LOCATIONS = [
    {
      id: "gombe", name: "Gombe", state: "Gombe State",
      aliases: ["gombe", "gombe state", "gombe central", "gombe city"],
      nets: {
        mtn: { signal: 88, down: 38.4, up: 12.1, ping: 32 },
        airtel: { signal: 79, down: 31.7, up: 10.4, ping: 38 },
        glo: { signal: 63, down: 18.2, up: 6.3, ping: 61 },
        etisalat: { signal: 52, down: 12.6, up: 4.8, ping: 74 }
      }
    },
    {
      id: "tumfure", name: "Tumfure", state: "Gombe State",
      aliases: ["tumfure", "tumfure ward", "tumfure gombe"],
      nets: {
        mtn: { signal: 84, down: 34.2, up: 11.3, ping: 36 },
        airtel: { signal: 76, down: 28.9, up: 9.8, ping: 42 },
        glo: { signal: 58, down: 15.4, up: 5.6, ping: 68 },
        etisalat: { signal: 47, down: 10.8, up: 4.1, ping: 81 }
      }
    },
    {
      id: "akko", name: "Akko", state: "Gombe State",
      aliases: ["akko", "akko lga", "akko gombe"],
      nets: {
        mtn: { signal: 68, down: 22.6, up: 7.4, ping: 52 },
        airtel: { signal: 73, down: 26.4, up: 8.9, ping: 45 },
        glo: { signal: 60, down: 17.8, up: 6.1, ping: 63 },
        etisalat: { signal: 42, down: 9.6, up: 3.7, ping: 88 }
      }
    },
    {
      id: "abuja", name: "Abuja (Wuse II)", state: "FCT",
      aliases: ["abuja", "wuse", "wuse 2", "wuse ii", "fct"],
      nets: {
        mtn: { signal: 89, down: 44.1, up: 15.4, ping: 26 },
        airtel: { signal: 91, down: 46.8, up: 16.2, ping: 24 },
        glo: { signal: 71, down: 27.3, up: 9.1, ping: 48 },
        etisalat: { signal: 64, down: 21.5, up: 7.6, ping: 58 }
      }
    },
    {
      id: "lagos", name: "Lagos (Ikeja)", state: "Lagos State",
      aliases: ["lagos", "ikeja", "ikeja gra", "lagos state"],
      nets: {
        mtn: { signal: 94, down: 52.3, up: 18.6, ping: 21 },
        airtel: { signal: 92, down: 48.7, up: 17.1, ping: 23 },
        glo: { signal: 74, down: 30.2, up: 10.8, ping: 44 },
        etisalat: { signal: 68, down: 26.4, up: 9.2, ping: 52 }
      }
    },
    {
      id: "kano", name: "Kano (Sabon Gari)", state: "Kano State",
      aliases: ["kano", "sabon gari", "kano state"],
      nets: {
        mtn: { signal: 81, down: 33.1, up: 10.9, ping: 39 },
        airtel: { signal: 78, down: 30.5, up: 10.1, ping: 41 },
        glo: { signal: 69, down: 24.6, up: 8.2, ping: 55 },
        etisalat: { signal: 55, down: 14.7, up: 5.2, ping: 72 }
      }
    },
    {
      id: "portharcourt", name: "Port Harcourt (GRA)", state: "Rivers State",
      aliases: ["port harcourt", "ph", "gra", "gra phase 2", "rivers"],
      nets: {
        mtn: { signal: 84, down: 39.6, up: 13.8, ping: 31 },
        airtel: { signal: 86, down: 41.2, up: 14.3, ping: 29 },
        glo: { signal: 61, down: 19.4, up: 6.7, ping: 62 },
        etisalat: { signal: 66, down: 22.8, up: 8.0, ping: 56 }
      }
    },
    {
      id: "jos", name: "Jos (Rayfield)", state: "Plateau State",
      aliases: ["jos", "rayfield", "plateau", "plateau state"],
      nets: {
        mtn: { signal: 76, down: 29.4, up: 9.7, ping: 44 },
        airtel: { signal: 73, down: 27.1, up: 9.0, ping: 47 },
        glo: { signal: 66, down: 21.7, up: 7.3, ping: 58 },
        etisalat: { signal: 50, down: 13.2, up: 4.6, ping: 77 }
      }
    }
  ];

  const COVERAGE = [
    { area: "Gombe Central", region: "Gombe", mtn: "strong", airtel: "strong", glo: "moderate", etisalat: "weak" },
    { area: "Tumfure", region: "Gombe", mtn: "strong", airtel: "moderate", glo: "moderate", etisalat: "weak" },
    { area: "Akko", region: "Gombe", mtn: "moderate", airtel: "strong", glo: "moderate", etisalat: "weak" },
    { area: "Nassarawo", region: "Gombe", mtn: "strong", airtel: "moderate", glo: "weak", etisalat: "weak" },
    { area: "Kaltungo", region: "Gombe", mtn: "moderate", airtel: "strong", glo: "weak", etisalat: "weak" },
    { area: "Dukku", region: "Gombe", mtn: "moderate", airtel: "weak", glo: "weak", etisalat: "weak" },
    { area: "Wuse II", region: "FCT", mtn: "strong", airtel: "strong", glo: "moderate", etisalat: "moderate" },
    { area: "Ikeja GRA", region: "Lagos", mtn: "strong", airtel: "strong", glo: "moderate", etisalat: "moderate" },
    { area: "Sabon Gari", region: "Kano", mtn: "strong", airtel: "moderate", glo: "moderate", etisalat: "weak" },
    { area: "GRA Phase 2", region: "Rivers", mtn: "strong", airtel: "strong", glo: "moderate", etisalat: "moderate" },
    { area: "Rayfield", region: "Plateau", mtn: "moderate", airtel: "moderate", glo: "moderate", etisalat: "weak" },
    { area: "Bodija", region: "Oyo", mtn: "strong", airtel: "moderate", glo: "moderate", etisalat: "moderate" },
    { area: "Uyo Central", region: "Akwa Ibom", mtn: "strong", airtel: "moderate", glo: "moderate", etisalat: "weak" },
    { area: "Billiri", region: "Gombe", mtn: "moderate", airtel: "moderate", glo: "weak", etisalat: "weak" }
  ];

  const ACTIVITIES = {
    learning: {
      label: "Online learning",
      weights: { down: 0.3, up: 0.2, ping: 0.3, signal: 0.2 },
      why: "Online learning needs dependable download speed for class videos, enough upload for assignments, and low delay for live sessions."
    },
    calls: {
      label: "Video calls",
      weights: { down: 0.25, up: 0.3, ping: 0.3, signal: 0.15 },
      why: "Video calls need a balanced connection: strong upload for your camera, steady download for everyone else, and low ping so conversation stays in sync."
    },
    gaming: {
      label: "Gaming",
      weights: { down: 0.2, up: 0.15, ping: 0.45, signal: 0.2 },
      why: "Gaming is most sensitive to ping. A low, stable delay matters more than a very high download speed."
    },
    downloads: {
      label: "Downloading files",
      weights: { down: 0.5, up: 0.2, ping: 0.1, signal: 0.2 },
      why: "Large downloads mostly benefit from raw download throughput, while upload and delay play a smaller role."
    }
  };

  /* ---------------- State ---------------- */

  let currentLocation = LOCATIONS.find((loc) => loc.id === "gombe");
  let selectedActivity = "learning";
  let coverageFilter = "all";
  let bestRevealed = false;
  let speedRunning = false;
  let speedTimer = null;

  /* ---------------- Helpers ---------------- */

  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.prototype.slice.call((root || document).querySelectorAll(selector));

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalize(value) {
    return String(value).toLowerCase().trim().replace(/\s+/g, " ");
  }

  function quality(signal) {
    if (signal >= 75) return "strong";
    if (signal >= 55) return "moderate";
    return "weak";
  }

  function qualityLabel(signal) {
    const map = { strong: "Strong", moderate: "Moderate", weak: "Weak" };
    return map[quality(signal)];
  }

  function signalBars(signal) {
    const filled = clamp(Math.round(signal / 23), 1, 4);
    let bars = "";
    for (let i = 0; i < 4; i += 1) {
      bars += '<i class="' + (i < filled ? "on" : "") + '"></i>';
    }
    return '<span class="signal-bars" aria-hidden="true">' + bars + "</span>";
  }

  function setGauge(value) {
    const gauge = $("#speedGauge");
    const numeric = Number(value) || 0;
    gauge.style.setProperty("--val", String(clamp((numeric / 60) * 100, 0, 100)));
    $("#gaugeValue").textContent = numeric.toFixed(1);
  }

  function logoMarkup(key, sizeClass) {
    const net = NETWORKS[key];
    return (
      '<span class="net-logo' + (sizeClass ? " " + sizeClass : "") + '" ' +
      'style="--brand:' + net.brand + ";--brand-ink:" + net.ink + '" aria-hidden="true">' +
      net.logo +
      "</span>"
    );
  }

  function networkByKey(key) {
    return NETWORKS[key];
  }

  function scoresFor(location, weights) {
    return NETWORK_KEYS.map((key) => {
      const net = location.nets[key];
      const downScore = clamp((net.down / 60) * 100, 0, 100);
      const upScore = clamp((net.up / 20) * 100, 0, 100);
      const pingScore = clamp(((100 - net.ping) / 70) * 100, 0, 100);
      const signalScore = clamp(net.signal, 0, 100);
      const total = downScore * weights.down + upScore * weights.up +
        pingScore * weights.ping + signalScore * weights.signal;
      return {
        key: key,
        info: networkByKey(key),
        data: net,
        score: Math.round(total)
      };
    }).sort((a, b) => b.score - a.score || b.data.down - a.data.down);
  }

  function strongest(ranked) {
    return ranked[0];
  }

  function findLocation(query) {
    const needle = normalize(query);
    if (!needle) return null;

    const exact = LOCATIONS.find((loc) => {
      const candidates = [loc.id, loc.name, loc.state].concat(loc.aliases || []);
      return candidates.some((candidate) => normalize(candidate) === needle);
    });
    if (exact) return exact;

    if (needle.length < 3) return null;

    return LOCATIONS.find((loc) => {
      const candidates = [loc.name].concat(loc.aliases || []);
      return candidates.some((candidate) => {
        const value = normalize(candidate);
        return value.indexOf(needle) !== -1 || needle.indexOf(value) !== -1;
      });
    }) || null;
  }

  /* ---------------- Render: hero ---------------- */

  function renderHero() {
    const ranked = scoresFor(currentLocation, OVERALL_WEIGHTS);
    const top = strongest(ranked);
    const signalState = quality(top.data.signal);

    $("#heroPanel").innerHTML =
      '<div class="hero-panel-top">' +
        "<span>Best sample match</span>" +
        '<span class="chip">Top pick</span>' +
      "</div>" +
      '<div class="hero-best">' +
        logoMarkup(top.key) +
        "<div>" +
          "<h3>" + top.info.name + "</h3>" +
          "<p>" + escapeHtml(currentLocation.name) + ", " + escapeHtml(currentLocation.state) + "</p>" +
        "</div>" +
        '<div class="hero-score"><strong>' + top.score + "</strong><small>out of 100</small></div>" +
      "</div>" +
      '<div class="hero-metrics">' +
        '<div><span>Download</span><strong>' + top.data.down + ' <em>Mbps</em></strong></div>' +
        '<div><span>Upload</span><strong>' + top.data.up + ' <em>Mbps</em></strong></div>' +
        '<div><span>Ping</span><strong>' + top.data.ping + ' <em>ms</em></strong></div>' +
      "</div>" +
      '<div class="hero-foot"><span class="dot ' + signalState + '"></span>' +
        qualityLabel(top.data.signal) + " sample signal · " + top.data.signal + "% · four networks compared" +
      "</div>";

    $("#currentLocationPill").textContent = currentLocation.name;
  }

  /* ---------------- Render: network cards ---------------- */

  function renderNetworkCards() {
    const ranked = scoresFor(currentLocation, OVERALL_WEIGHTS);
    const topScore = ranked[0].score;

    $("#snapshotSub").textContent =
      "Sample performance profile for " + currentLocation.name + ", " + currentLocation.state +
      " — ranked by the overall score.";

    $("#networkGrid").innerHTML = ranked.map((entry, index) => {
      const net = entry.info;
      const data = entry.data;
      const state = quality(data.signal);
      const downloadWidth = clamp((data.down / 60) * 100, 6, 100);
      const uploadWidth = clamp((data.up / 20) * 100, 6, 100);
      const isTop = entry.score === topScore;

      return (
        '<article class="net-card' + (isTop ? " is-top" : "") + '" style="--brand:' + net.brand +
          ";--brand-2:" + net.brand2 + ";animation-delay:" + (index * 55) + 'ms">' +
          '<div class="net-top">' +
            '<div class="net-id">' +
              logoMarkup(entry.key) +
              "<div>" +
                "<h3>" + net.name + "</h3>" +
                '<p><span class="dot ' + state + '"></span>' + qualityLabel(data.signal) + " signal</p>" +
              "</div>" +
            "</div>" +
            '<div class="score-badge"><strong>' + entry.score + "</strong><small>score</small></div>" +
          "</div>" +

          '<div class="signal-row">' +
            signalBars(data.signal) +
            "<span><strong>" + data.signal + "%</strong> signal strength</span>" +
          "</div>" +

          '<div class="metrics">' +
            '<div class="metric"><span>Download</span><strong>' + data.down + " <em>Mbps</em></strong></div>" +
            '<div class="metric"><span>Upload</span><strong>' + data.up + " <em>Mbps</em></strong></div>" +
            '<div class="metric"><span>Ping</span><strong>' + data.ping + " <em>ms</em></strong></div>" +
          "</div>" +

          '<div class="meter-block">' +
            '<div class="meter-label"><span>Download</span><strong>' + data.down + " Mbps</strong></div>" +
            '<div class="meter"><i style="width:' + downloadWidth + '%"></i></div>' +
          "</div>" +
          '<div class="meter-block">' +
            '<div class="meter-label"><span>Upload</span><strong>' + data.up + " Mbps</strong></div>" +
            '<div class="meter"><i style="width:' + uploadWidth + '%"></i></div>' +
          "</div>" +

          '<div class="net-foot"><span class="dot ' + state + '"></span>' +
            qualityLabel(data.signal) + " quality · " + data.ping + " ms ping" +
            (isTop
              ? '<span class="chip" style="margin-left:auto;color:#67e8f9;background:rgba(34,211,238,.1);border:1px solid rgba(34,211,238,.26);font-size:9px;padding:2px 7px;">Top pick</span>'
              : "") +
          "</div>" +
        "</article>"
      );
    }).join("");
  }

  /* ---------------- Render: comparison ---------------- */

  function verdictFor(index) {
    if (index === 0) return { text: "Best overall", cls: "best" };
    if (index === 1) return { text: "Strong alternative", cls: "strong" };
    if (index === 2) return { text: "Fair option", cls: "fair" };
    return { text: "Limited", cls: "low" };
  }

  function renderCompare() {
    const ranked = scoresFor(currentLocation, OVERALL_WEIGHTS);
    const topScore = ranked[0].score;

    $("#compareSub").textContent =
      "All four networks ranked for " + currentLocation.name +
      " using the same four-metric model.";
    $("#compareChip").textContent = currentLocation.name;

    $("#compareBody").innerHTML = ranked.map((entry, index) => {
      const verdict = verdictFor(index);
      const barWidth = clamp(entry.score, 3, 100);
      return (
        '<tr class="' + (index === 0 ? "top-row" : "") + '">' +
          '<td><span class="rank-pill">' + (index + 1) + "</span></td>" +
          '<td><span class="table-net">' + logoMarkup(entry.key) + entry.info.name + "</span></td>" +
          '<td><span class="dot ' + quality(entry.data.signal) + '"></span> ' +
            entry.data.signal + "%</td>" +
          "<td>" + entry.data.down + " Mbps</td>" +
          "<td>" + entry.data.up + " Mbps</td>" +
          "<td>" + entry.data.ping + " ms</td>" +
          '<td><span class="score-cell"><strong>' + entry.score + "</strong>" +
            '<span class="meter"><i style="width:' + barWidth + '%"></i></span></span></td>' +
          '<td><span class="verdict ' + verdict.cls + '">' + verdict.text + "</span></td>" +
        "</tr>"
      );
    }).join("");

    if (bestRevealed) renderBest();
  }

  function renderBest() {
    const panel = $("#bestPanel");
    const ranked = scoresFor(currentLocation, OVERALL_WEIGHTS);
    const top = strongest(ranked);
    const runnerUp = ranked[1];
    const gap = top.score - runnerUp.score;
    const topPing = Math.min.apply(null, NETWORK_KEYS.map((key) => currentLocation.nets[key].ping));
    const topDown = Math.max.apply(null, NETWORK_KEYS.map((key) => currentLocation.nets[key].down));

    const reasons = [];
    reasons.push(
      "Leads this location with a sample score of <strong>" + top.score + "/100</strong>, " +
      gap + " point" + (gap === 1 ? "" : "s") + " ahead of " + runnerUp.info.name + "."
    );
    reasons.push(
      (top.data.down === topDown
        ? "Fastest sample download here at <strong>" + top.data.down + " Mbps</strong>"
        : "Solid sample download at <strong>" + top.data.down + " Mbps</strong>") +
      ", with " + top.data.up + " Mbps upload."
    );
    reasons.push(
      (top.data.ping === topPing
        ? "Lowest ping in this area at <strong>" + top.data.ping + " ms</strong>"
        : "A responsive <strong>" + top.data.ping + " ms</strong> ping") +
      ", which helps with calls and live video."
    );
    reasons.push(
      qualityLabel(top.data.signal) + " sample signal at <strong>" + top.data.signal +
      "%</strong> — " + quality(top.data.signal) + " coverage quality in this demonstration."
    );

    panel.innerHTML =
      '<div class="best-grid">' +
        '<div class="best-main">' +
          '<div class="best-kicker">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>' +
            "Recommended network" +
          "</div>" +
          '<div class="best-heading">' +
            logoMarkup(top.key) +
            "<div>" +
              "<h3>" + top.info.name + "</h3>" +
              "<p>Best overall for " + escapeHtml(currentLocation.name) + ", " + escapeHtml(currentLocation.state) + "</p>" +
            "</div>" +
            '<div class="best-score"><strong>' + top.score + '</strong><small>score / 100</small></div>' +
          "</div>" +
          '<div class="best-why"><h4>Why it ranked first</h4><ul class="why-list">' +
            reasons.map((reason) => "<li>" + reason + "</li>").join("") +
          "</ul></div>" +
          '<div class="best-note">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>' +
            "<span>Scoring formula: download 35%, upload 20%, ping 25%, signal 20%. Higher speeds and signal score higher; lower ping scores higher. All values are fictional samples.</span>" +
          "</div>" +
        "</div>" +

        '<div class="ranking-card">' +
          "<h4>Full ranking here</h4>" +
          '<div class="rank-list">' +
            ranked.map((entry, index) =>
              '<div class="rank-item">' +
                '<div class="rank-item-top">' +
                  logoMarkup(entry.key) +
                  "<strong>" + entry.info.name + "</strong>" +
                  "<span>" + entry.score + "/100</span>" +
                "</div>" +
                '<div class="rank-bar"><i class="' + (index === 0 ? "" : "dim") + '" style="width:' + clamp(entry.score, 3, 100) + '%"></i></div>' +
              "</div>"
            ).join("") +
          "</div>" +
        "</div>" +
      "</div>";

    panel.hidden = false;
  }

  /* ---------------- Render: advisor ---------------- */

  function renderAdvisor() {
    const activity = ACTIVITIES[selectedActivity];
    const ranked = scoresFor(currentLocation, activity.weights);
    const top = strongest(ranked);
    const runnerUp = ranked[1];
    const gap = top.score - runnerUp.score;
    const weights = activity.weights;
    const requirementText =
      "This prototype weights download " + Math.round(weights.down * 100) +
      "%, upload " + Math.round(weights.up * 100) +
      "%, ping " + Math.round(weights.ping * 100) +
      "% and signal " + Math.round(weights.signal * 100) + "% for this activity.";

    $$("#activityGrid .activity-btn").forEach((button) => {
      button.classList.toggle("active", button.dataset.activity === selectedActivity);
    });

    $("#advisorResult").innerHTML =
      '<div class="advisor-card">' +
        "<div>" +
          '<div class="advisor-kicker">Sample recommendation · ' + escapeHtml(activity.label) + "</div>" +
          '<div class="advisor-pick">' +
            logoMarkup(top.key) +
            "<div>" +
              "<h3>" + top.info.name + "</h3>" +
              "<p>Best sample fit in " + escapeHtml(currentLocation.name) + " for " + escapeHtml(activity.label.toLowerCase()) + "</p>" +
            "</div>" +
          "</div>" +
          '<p class="advisor-text">' +
            "<strong>" + top.info.name + "</strong> is the strongest sample match for " + escapeHtml(activity.label.toLowerCase()) +
            " here. It offers <strong>" + top.data.down + " Mbps</strong> download, <strong>" +
            top.data.up + " Mbps</strong> upload and <strong>" + top.data.ping +
            " ms</strong> ping, with <strong>" + top.data.signal + "%</strong> sample signal. " +
            "It is " + gap + " point" + (gap === 1 ? "" : "s") + " ahead of " + runnerUp.info.name + " under this activity's weighting." +
          "</p>" +
          '<div class="advisor-why">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5.9 1.2.9 2.1h5.2c0-.9.3-1.6.9-2.1A6 6 0 0 0 12 3Z"/></svg>' +
            "<span><strong>Why:</strong> " + activity.why + " " + requirementText + "</span>" +
          "</div>" +
        "</div>" +

        '<div class="advisor-board">' +
          '<div class="advisor-kicker">Activity fit scores</div>' +
          ranked.map((entry, index) =>
            '<div class="advisor-row">' +
              '<div class="advisor-row-top">' +
                logoMarkup(entry.key) +
                "<strong>" + entry.info.name + "</strong>" +
                (index === 0 ? '<span class="tag">Best match</span>' : "") +
                "<span>" + entry.score + "/100</span>" +
              "</div>" +
              '<div class="advisor-bar"><i class="' + (index === 0 ? "" : "dim") + '" style="width:' + clamp(entry.score, 3, 100) + '%"></i></div>' +
            "</div>"
          ).join("") +
        "</div>" +
      "</div>";
  }

  /* ---------------- Render: search chips / coverage ---------------- */

  function renderLocationChoices() {
    const sorted = LOCATIONS;

    $("#locationChips").innerHTML = sorted.map((loc) =>
      '<button type="button" class="chip-btn' + (loc.id === currentLocation.id ? " active" : "") +
      '" data-loc-id="' + loc.id + '">' + escapeHtml(loc.name) + "</button>"
    ).join("");

    const datalist = $("#locationList");
    datalist.innerHTML = sorted.map((loc) =>
      '<option value="' + escapeHtml(loc.name) + '">' + escapeHtml(loc.state) + "</option>"
    ).join("");
  }

  function renderCoverage() {
    const isAll = coverageFilter === "all";
    const selectedName = isAll ? "" : NETWORKS[coverageFilter].name;

    const cards = COVERAGE.map((row) => {
      const activeLevel = isAll ? null : row[coverageFilter];
      const areaColor = isAll ? "#22d3ee" : QUALITY_COLORS[activeLevel];

      const chips = NETWORK_KEYS.map((key) => {
        const level = row[key];
        const dimmed = !isAll && key !== coverageFilter;
        return (
          '<span class="area-chip ' + level + (dimmed ? " dimmed" : "") + '">' +
            "<b>" + NETWORKS[key].name + "</b>" +
            '<i class="dot ' + level + '"></i>' +
            (isAll || dimmed ? "" : level.charAt(0).toUpperCase() + level.slice(1)) +
          "</span>"
        );
      }).join("");

      return (
        '<article class="area-card' + (isAll ? "" : " focused") + '" style="--area-color:' + areaColor + '">' +
          '<div class="area-head"><h4>' + escapeHtml(row.area) + "</h4><span>" + escapeHtml(row.region) + "</span></div>" +
          '<div class="area-chips">' + chips + "</div>" +
        "</article>"
      );
    }).join("");

    $("#coverageGrid").innerHTML = cards;

    if (isAll) {
      $("#coverageSummary").textContent =
        "Sample quality across " + COVERAGE.length +
        " areas — green, amber and red are illustrative, not verified real-world coverage.";
    } else {
      const counts = { strong: 0, moderate: 0, weak: 0 };
      COVERAGE.forEach((row) => { counts[row[coverageFilter]] += 1; });
      $("#coverageSummary").textContent =
        "Sample " + selectedName + " strength across " + COVERAGE.length + " areas: " +
        counts.strong + " strong · " + counts.moderate + " moderate · " + counts.weak + " weak (illustrative only).";
    }

    $$("#coverageFilters .filter-btn").forEach((button) => {
      button.classList.toggle("active", button.dataset.filter === coverageFilter);
    });
  }

  function renderSpeedProfile() {
    if (speedRunning) return;
    const ranked = scoresFor(currentLocation, OVERALL_WEIGHTS);
    $("#speedProfile").textContent = strongest(ranked).info.name + " · " + currentLocation.name;
  }

  /* ---------------- Render: all ---------------- */

  function renderAll() {
    renderHero();
    renderNetworkCards();
    renderCompare();
    renderAdvisor();
    renderSpeedProfile();
    renderLocationChoices();
  }

  /* ---------------- Search ---------------- */

  function showNotice(type, html) {
    const notice = $("#searchNotice");
    notice.className = "notice " + type;
    notice.innerHTML = html;
    notice.hidden = false;
  }

  function noDataNotice(query) {
    const suggestions = LOCATIONS.slice(0, 5).map((loc) =>
      '<button type="button" class="chip-btn" data-loc-id="' + loc.id + '">' +
        escapeHtml(loc.name) + "</button>"
    ).join("");

    return (
      '<div class="notice-title">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>' +
        "<span>No sample data for “" + escapeHtml(query) + "”</span>" +
      "</div>" +
      "<p>This prototype only includes a small fictional dataset. Choose a demonstration area below, or try Gombe, Tumfure or Akko.</p>" +
      '<div class="notice-chips">' + suggestions + "</div>"
    );
  }

  function applyLocation(loc) {
    if (!loc) return;
    currentLocation = loc;
    if (speedRunning) {
      stopSpeedTest();
      $("#speedState").textContent = "Location changed — ready to run again.";
      $("#speedBtn").disabled = false;
      $("#speedBtn").innerHTML = SPEED_BTN_HTML;
      speedRunning = false;
    }
    renderAll();
    $("#locationInput").value = loc.name;
  }

  function handleSearch(query) {
    const trimmed = query.trim();
    if (!trimmed) {
      showNotice("error",
        '<div class="notice-title">Enter a location</div><p>Type a sample area such as Gombe, Tumfure or Akko, then press Search.</p>'
      );
      return;
    }

    const loc = findLocation(trimmed);
    if (!loc) {
      showNotice("error", noDataNotice(trimmed));
      return;
    }

    applyLocation(loc);
    showNotice("success",
      '<div class="notice-title">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m5 12 4.5 4.5L19 7"/></svg>' +
        "<span>Sample results loaded for " + escapeHtml(loc.name) + "</span>" +
      "</div>" +
      "<p>Four fictional network records found for <strong>" + escapeHtml(loc.name) + ", " +
      escapeHtml(loc.state) + "</strong>. The dashboard, comparison table and recommendations have been updated.</p>"
    );
  }

  /* ---------------- Speed test ---------------- */

  const SPEED_BTN_HTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4l14 8-14 8V4Z"/></svg>' +
    "Start Speed Test";

  const SPEED_BTN_AGAIN =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4l14 8-14 8V4Z"/></svg>' +
    "Run Again";

  function stopSpeedTest() {
    if (speedTimer) {
      clearInterval(speedTimer);
      speedTimer = null;
    }
    speedRunning = false;
  }

  function startSpeedTest() {
    if (speedRunning) return;

    const button = $("#speedBtn");
    const ranked = scoresFor(currentLocation, OVERALL_WEIGHTS);
    const profile = strongest(ranked);

    const targetDown = Math.round(profile.data.down * (0.86 + Math.random() * 0.18) * 10) / 10;
    const targetUp = Math.round(profile.data.up * (0.85 + Math.random() * 0.2) * 10) / 10;
    const targetPing = Math.round(profile.data.ping * (0.9 + Math.random() * 0.22));

    speedRunning = true;
    button.disabled = true;
    button.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3a9 9 0 1 0 9 9"/></svg>' +
      "Testing…";
    $("#speedState").textContent = "Connecting to nearest sample tower…";
    $("#speedProgress").style.width = "0%";
    $("#resultDown").textContent = "—";
    $("#resultUp").textContent = "—";
    $("#resultPing").textContent = "—";
    setGauge(0);

    let progress = 0;
    const totalTicks = 60;

    speedTimer = setInterval(function () {
      progress += 100 / totalTicks;

      if (progress >= 100) {
        stopSpeedTest();
        $("#speedProgress").style.width = "100%";
        setGauge(targetDown);
        $("#resultDown").innerHTML = targetDown + "<em>Mbps</em>";
        $("#resultUp").innerHTML = targetUp + "<em>Mbps</em>";
        $("#resultPing").innerHTML = targetPing + "<em>ms</em>";
        $("#speedState").textContent =
          "Demonstration complete — simulated results using the " + profile.info.name + " sample profile.";
        button.disabled = false;
        button.innerHTML = SPEED_BTN_AGAIN;
        return;
      }

      $("#speedProgress").style.width = progress.toFixed(1) + "%";

      if (progress < 12) {
        $("#speedState").textContent = "Connecting to nearest sample tower…";
      } else if (progress < 52) {
        $("#speedState").textContent = "Measuring download throughput…";
        setGauge((targetDown * Math.min(progress / 52, 1)) * (0.88 + Math.random() * 0.14));
      } else if (progress < 82) {
        $("#speedState").textContent = "Measuring upload throughput…";
        setGauge(targetDown * (0.94 + Math.random() * 0.08));
      } else if (progress < 95) {
        $("#speedState").textContent = "Measuring latency…";
        setGauge(targetDown * (0.98 + Math.random() * 0.03));
      } else {
        $("#speedState").textContent = "Finalising demonstration…";
        setGauge(targetDown);
      }
    }, 60);
  }

  /* ---------------- Navigation ---------------- */

  function setActiveNav(sectionId) {
    $$(".nav-link").forEach((link) => {
      link.classList.toggle("active", link.dataset.section === sectionId);
    });
  }

  function updateActiveNavOnScroll() {
    let activeId = "dashboard";
    const offset = window.innerWidth <= 900 ? 120 : 150;

    $$(".section").forEach((section) => {
      if (section.getBoundingClientRect().top <= offset) {
        activeId = section.id;
      }
    });

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 60) {
      activeId = "coverage";
    }

    setActiveNav(activeId);
  }

  function closeSidebar() {
    $("#sidebar").classList.remove("open");
    $("#scrim").classList.remove("show");
    $("#menuBtn").setAttribute("aria-expanded", "false");
  }

  /* ---------------- Events ---------------- */

  function bindEvents() {
    // Search form
    $("#searchForm").addEventListener("submit", function (event) {
      event.preventDefault();
      handleSearch($("#locationInput").value);
    });

    // Location chips (sidebar-free chips, search notice suggestions)
    document.addEventListener("click", function (event) {
      const trigger = event.target.closest("[data-loc-id]");
      if (!trigger) return;
      const loc = LOCATIONS.find((item) => item.id === trigger.dataset.locId);
      if (!loc) return;
      applyLocation(loc);
      showNotice("success",
        '<div class="notice-title">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m5 12 4.5 4.5L19 7"/></svg>' +
          "<span>Sample results loaded for " + escapeHtml(loc.name) + "</span>" +
        "</div><p>The dashboard, comparison table and recommendations now reflect <strong>" +
          escapeHtml(loc.name) + ", " + escapeHtml(loc.state) + "</strong>.</p>"
      );
    });

    // Find best network
    $("#findBestBtn").addEventListener("click", function () {
      bestRevealed = true;
      renderBest();
      $("#bestPanel").scrollIntoView({ behavior: "smooth", block: "center" });
    });

    // Activity selection
    $("#activityGrid").addEventListener("click", function (event) {
      const button = event.target.closest(".activity-btn");
      if (!button) return;
      selectedActivity = button.dataset.activity;
      renderAdvisor();
    });

    // Speed test
    $("#speedBtn").addEventListener("click", startSpeedTest);

    // Coverage filters
    $("#coverageFilters").addEventListener("click", function (event) {
      const button = event.target.closest(".filter-btn");
      if (!button) return;
      coverageFilter = button.dataset.filter;
      renderCoverage();
    });

    // Mobile sidebar
    $("#menuBtn").addEventListener("click", function () {
      const sidebar = $("#sidebar");
      const isOpen = sidebar.classList.toggle("open");
      $("#scrim").classList.toggle("show", isOpen);
      $("#menuBtn").setAttribute("aria-expanded", String(isOpen));
    });
    $("#scrim").addEventListener("click", closeSidebar);

    $$(".nav-link").forEach((link) => {
      link.addEventListener("click", function () {
        setActiveNav(link.dataset.section);
        if (window.innerWidth <= 900) closeSidebar();
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeSidebar();
    });

    let scrollTick = false;
    window.addEventListener("scroll", function () {
      if (scrollTick) return;
      scrollTick = true;
      window.requestAnimationFrame(function () {
        updateActiveNavOnScroll();
        scrollTick = false;
      });
    }, { passive: true });
  }

  /* ---------------- Init ---------------- */

  function init() {
    $("#statLocations").textContent = String(LOCATIONS.length);
    $("#statAreas").textContent = String(COVERAGE.length);
    bindEvents();
    renderAll();
    renderCoverage();
    $("#locationInput").value = currentLocation.name;
    setActiveNav("dashboard");
    updateActiveNavOnScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

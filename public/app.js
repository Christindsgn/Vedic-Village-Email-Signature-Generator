const PRODUCTION_BASE = "https://framer-email-signature-generator.vercel.app";

/**
 * Returns the base URL for hosted assets.
 * When running on localhost the generated signature HTML is pasted into
 * Outlook/Gmail — those clients can't reach localhost, so we always fall
 * back to the production Vercel URL for asset paths.
 */
function assetBase() {
  if (typeof location !== "undefined" && /^https?:/i.test(location.protocol)) {
    const host = location.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) {
      return PRODUCTION_BASE;
    }
    return location.origin;
  }
  return PRODUCTION_BASE;
}

function hostedAssets() {
  const b = assetBase();
  return {
    patternBg: b + "/bg.png",
    logo: b + "/Vedic-Logo.png",
    instagramIcon: b + "/Instagram.png",
    linkedinIcon: b + "/Linkedin.png",
  };
}

/**
 * Hero pattern column dimensions.
 * bg.png is 899×233px. Right column is 296px wide.
 * Natural height at 296px width = round(296 × 233 / 899) = 77px.
 */
const PATTERN_COL_W = 296;
const PATTERN_COL_H = 77;

const BRAND = {
  text: "#000000",
  muted: "#000000",
  link: "#0a84a9",
  /** Social vectors in Figma use ~#a24213 */
  socialBrown: "#a24213",
  footerBg: "#fdfaf7",
  /** Verdana is web-safe and renders consistently across Outlook (Win/Mac) and Gmail. */
  fontSans: "Verdana,Geneva,Tahoma,sans-serif",
};

/** Footer is a single centered column — no multi-column collapse needed. */
const RESPONSIVE_STYLE = "";

const HEAD_SNIPPET =
  RESPONSIVE_STYLE + '<meta name="viewport" content="width=device-width,initial-scale=1">';

function escapeHtml(s) {
  if (s == null || s === "") return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function ensureUrl(u) {
  const t = String(u || "").trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  return "https://" + t.replace(/^\/+/, "");
}

function mailto(email) {
  const e = String(email || "").trim();
  if (!e) return "#";
  return "mailto:" + e.replace(/"/g, "");
}

function telHref(phone) {
  const p = String(phone || "").replace(/[\s()-]/g, "");
  if (!p) return "#";
  return "tel:" + p;
}

function buildSocial(instagramUrl, linkedinUrl, igIcon, liIcon) {
  const ig = ensureUrl(instagramUrl);
  const li = ensureUrl(linkedinUrl);
  const parts = [];
  if (igIcon && ig) {
    parts.push(
      '<a href="' + escapeHtml(ig) + '" style="text-decoration:none;margin-right:20px;display:inline-block;"><img src="' + escapeHtml(ensureUrl(igIcon)) + '" width="24" height="24" alt="Instagram" border="0" style="display:block;border:0;"></a>'
    );
  } else if (ig) {
    parts.push(
      '<a href="' +
        escapeHtml(ig) +
        '" style="font-family:' +
        BRAND.fontSans +
        ';font-size:10px;font-weight:500;color:' +
        BRAND.socialBrown +
        ';text-decoration:underline;margin-right:12px;">Instagram</a>'
    );
  }
  if (liIcon && li) {
    parts.push(
      '<a href="' + escapeHtml(li) + '" style="text-decoration:none;display:inline-block;"><img src="' + escapeHtml(ensureUrl(liIcon)) + '" width="24" height="24" alt="LinkedIn" border="0" style="display:block;border:0;"></a>'
    );
  } else if (li) {
    parts.push(
      '<a href="' +
        escapeHtml(li) +
        '" style="font-family:' +
        BRAND.fontSans +
        ';font-size:10px;font-weight:500;color:' +
        BRAND.socialBrown +
        ';text-decoration:underline;">LinkedIn</a>'
    );
  }
  return parts.join("") || '<span style="font-size:11px;color:#666;">Add social URLs in the form</span>';
}

function buildLogoHtml(logoUrl) {
  return (
    '<img src="' +
    escapeHtml(ensureUrl(logoUrl)) +
    '" alt="Logo" border="0" style="display:block;margin:0 auto;border:0;max-height:32px;height:auto;width:auto;max-width:120px;">'
  );
}

function formatAddress(s) {
  const lines = String(s || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  // Gmail/Outlook can wrap long address text mid-word (ex: "P O" -> two lines).
  // Use non-breaking spaces in known abbreviations so "P O" stays together.
  return lines
    .map((l) =>
      escapeHtml(
        l
          .replace(/\bV\s+P\b/g, "V\u00A0P")
          .replace(/\bP\s+O\b/g, "P\u00A0O")
      )
    )
    .join("<br>");
}

function signatureTemplate() {
  const { text, link, footerBg, fontSans } = BRAND;
  return `<!-- Vedic Village email signature — Verdana -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
  <tr>
    <td width="600" bgcolor="#FFFFFF" style="padding:0;background-color:#FFFFFF;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;border-collapse:collapse;">
        <tr>
          <!-- Left: text content -->
          <td width="304" valign="top" style="width:304px;padding:15px 0 15px 0;background-color:#FFFFFF;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="304" style="width:304px;max-width:304px;border-collapse:collapse;border-spacing:0;">
              <tr>
                <td style="padding:0 0 0 0;">
                  <span style="display:block;font-family:${fontSans};font-size:14px;line-height:normal;font-weight:bold;color:${text};margin:0 0 8px 0;padding:0;">__FULLNAME__</span>
                </td>
              </tr>
              <tr>
                <td style="font-family:${fontSans};font-size:11px;line-height:18px;font-weight:400;color:${text};padding:0;">__TITLE1__</td>
              </tr>
              <tr>
                <td style="font-family:${fontSans};font-size:11px;line-height:18px;font-weight:400;color:${text};padding:0 0 8px 0;">__TITLE2__</td>
              </tr>
              <tr>
                <td style="padding:0 0 8px 0;">
                  <a href="__MAILTO__" style="font-family:${fontSans};font-size:12px;line-height:20px;font-weight:400;color:${link};text-decoration:none;letter-spacing:0.12px;">__EMAIL__</a>
                </td>
              </tr>
              <tr>
                <td style="padding:0;">
                  <a href="__TEL__" style="font-family:${fontSans};font-size:12px;line-height:20px;font-weight:400;color:${link};text-decoration:none;letter-spacing:0.12px;">__PHONE__</a>
                </td>
              </tr>
            </table>
          </td>
          <!-- Right: hero pattern image (real <img> — works in Outlook + Gmail) -->
          <td width="296" valign="top" style="width:296px;padding:0;vertical-align:top;line-height:0;font-size:0;">
            <img src="__PATTERN_SRC__" width="296" height="77" alt="" border="0" style="display:block;width:296px;height:77px;border:0;line-height:0;font-size:0;">
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td width="100%" bgcolor="${footerBg}" style="background-color:${footerBg};padding:20px 24px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="100%" style="margin:0 auto;border-collapse:collapse;">
        <tr>
          <td align="center" style="padding:0 0 7px 0;">__LOGO_IMG__</td>
        </tr>
        <tr>
          <td align="center" style="font-family:${fontSans};font-size:10px;line-height:15px;font-weight:400;color:${text};padding:0 0 7px 0;text-align:center;">__LOCATIONS__</td>
        </tr>
        <tr>
          <td align="center" style="font-family:${fontSans};font-size:10px;line-height:16px;font-weight:400;color:#969696;padding:0 0 18px 0;text-align:center;">__ADDRESS__</td>
        </tr>
        <tr>
          <td align="center" style="padding:0 0 18px 0;">
            <a href="__WEBSITE_HREF__" style="font-family:${fontSans};font-size:10px;line-height:12px;font-weight:400;color:${link};text-decoration:none;">__WEBSITE_LABEL__</a>
          </td>
        </tr>
        <tr>
          <td align="center" style="font-family:${fontSans};font-size:10px;line-height:12px;font-weight:400;color:${text};padding:0 0 12px 0;text-align:center;">Follow us on</td>
        </tr>
        <tr>
          <td align="center" style="padding:0;text-align:center;">__SOCIAL__</td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

function buildHtml(values) {
  const assets = hostedAssets();

  let websiteHref = ensureUrl(values.websiteUrl);
  if (!websiteHref) websiteHref = "#";
  const social = buildSocial(
    values.instagramUrl,
    values.linkedinUrl,
    assets.instagramIcon,
    assets.linkedinIcon
  );

  const telRaw = telHref(values.phone);
  let html = signatureTemplate();
  const map = {
    __PATTERN_SRC__: escapeHtml(ensureUrl(assets.patternBg)),
    __FULLNAME__: escapeHtml(values.fullName),
    __TITLE1__: escapeHtml(values.titleLine1),
    __TITLE2__: escapeHtml(values.titleLine2),
    __MAILTO__: escapeHtml(mailto(values.email)),
    __EMAIL__: escapeHtml(values.email),
    __TEL__: escapeHtml(telRaw),
    __PHONE__: escapeHtml(values.phone),
    __LOGO_IMG__: buildLogoHtml(assets.logo),
    __WEBSITE_HREF__: escapeHtml(websiteHref),
    __WEBSITE_LABEL__: escapeHtml(values.websiteLabel),
    __LOCATIONS__: escapeHtml(values.locations),
    __SOCIAL__: social,
    __ADDRESS__: formatAddress(values.address),
  };
  for (const [k, v] of Object.entries(map)) {
    html = html.split(k).join(v);
  }
  return html;
}

function collectValues() {
  const values = {};
  document.querySelectorAll("[data-field-id]").forEach((el) => {
    const id = el.getAttribute("data-field-id");
    values[id] = el.value;
  });
  return values;
}

function renderForm(fields) {
  const root = document.getElementById("fields");
  root.innerHTML = fields
    .map((f) => {
      const hint = f.hint
        ? '<p class="hint">' + escapeHtml(f.hint) + "</p>"
        : "";
      const def = f.default != null ? f.default : "";
      if (f.type === "textarea") {
        return (
          '<label class="field"><span class="label">' +
          escapeHtml(f.label) +
          '</span><textarea data-field-id="' +
          escapeHtml(f.id) +
          '" rows="3">' +
          escapeHtml(def) +
          "</textarea>" +
          hint +
          "</label>"
        );
      }
      return (
        '<label class="field"><span class="label">' +
        escapeHtml(f.label) +
        '</span><input type="' +
        (f.type === "email" ? "email" : "text") +
        '" data-field-id="' +
        escapeHtml(f.id) +
        '" value="' +
        escapeHtml(def) +
        '">' +
        hint +
        "</label>"
      );
    })
    .join("");
}

function signatureRichDocument(tableHtml) {
  return (
    "<!DOCTYPE html><html><head><meta charset='utf-8'>" +
    HEAD_SNIPPET +
    "</head><body>" +
    tableHtml +
    "</body></html>"
  );
}

function tableToPlainText(tableHtml) {
  try {
    const d = new DOMParser().parseFromString(tableHtml, "text/html");
    if (!d.body) return "";
    return d.body.textContent.replace(/\n{3,}/g, "\n\n").trim();
  } catch {
    return "";
  }
}

function copyFromPreviewIframe() {
  const iframe = document.getElementById("preview");
  if (!iframe || !iframe.contentDocument || !iframe.contentDocument.body) return false;
  const doc = iframe.contentDocument;
  const win = iframe.contentWindow;
  try {
    win.focus();
    const range = doc.createRange();
    range.selectNodeContents(doc.body);
    const sel = win.getSelection();
    if (!sel) return false;
    sel.removeAllRanges();
    sel.addRange(range);
    const ok = doc.execCommand("copy");
    sel.removeAllRanges();
    return ok;
  } catch {
    return false;
  }
}

async function copySignatureForPaste() {
  const tableHtml = buildHtml(collectValues());
  const plain = tableToPlainText(tableHtml) || "Vedic Village email signature";
  const richFull = signatureRichDocument(tableHtml);
  const richTableOnly =
    '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>' +
    tableHtml +
    "</body></html>";

  /** Outlook web often ignores ClipboardItem; copying the live preview matches a manual “select all → copy” and usually stays rich. */
  if (copyFromPreviewIframe()) return "rich";

  if (navigator.clipboard && typeof ClipboardItem !== "undefined") {
    for (const htmlPayload of [richTableOnly, richFull]) {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([htmlPayload], { type: "text/html" }),
            "text/plain": new Blob([plain], { type: "text/plain" }),
          }),
        ]);
        return "rich";
      } catch {
        /* try next */
      }
    }
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([richTableOnly], { type: "text/html" }),
        }),
      ]);
      return "rich";
    } catch {
      /* fall through */
    }
  }

  try {
    const wrap = document.createElement("div");
    wrap.innerHTML = tableHtml;
    wrap.style.cssText = "position:fixed;left:-9999px;top:600;";
    document.body.appendChild(wrap);
    const rng = document.createRange();
    rng.selectNodeContents(wrap);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(rng);
    const ok = document.execCommand("copy");
    sel.removeAllRanges();
    document.body.removeChild(wrap);
    if (ok) return "rich";
  } catch {
    /* fall through */
  }

  await navigator.clipboard.writeText(richFull);
  return "raw";
}

function updatePreview() {
  const tableHtml = buildHtml(collectValues());
  const iframe = document.getElementById("preview");
  iframe.srcdoc =
    "<!DOCTYPE html><html><head><meta charset='utf-8'>" +
    HEAD_SNIPPET +
    "</head><body style=\"margin:0;padding:12px;background:#e8e8e8;\">" +
    tableHtml +
    "</body></html>";
  window.__lastSignatureHtml = HEAD_SNIPPET + tableHtml;
}

async function init() {
  const res = await fetch("fields.json");
  const fields = await res.json();
  renderForm(fields);
  document.getElementById("fields").addEventListener("input", updatePreview);
  updatePreview();

  /* ── Responsive preview (Chrome DevTools style) ── */
  const rwdViewport = document.getElementById("rwdViewport");
  const rwdStage = rwdViewport.parentElement;
  const vpWInput = document.getElementById("vpW");
  const vpHEl = document.getElementById("vpH");
  const previewIframe = document.getElementById("preview");

  function syncDimDisplay() {
    const w = rwdViewport.getBoundingClientRect().width;
    const h = previewIframe.getBoundingClientRect().height;
    vpWInput.value = Math.round(w);
    vpHEl.textContent = Math.round(h);
  }

  function setViewportWidth(w) {
    const isFullWidth = w === 0;
    rwdViewport.classList.toggle("rwd-full", isFullWidth);
    if (!isFullWidth) {
      const stageW = rwdStage.clientWidth - 80; // account for padding + handles
      rwdViewport.style.width = Math.max(280, Math.min(w, stageW)) + "px";
    } else {
      rwdViewport.style.width = "";
    }
    document.querySelectorAll(".rwd-preset").forEach((b) => {
      b.classList.toggle("active", parseInt(b.dataset.w) === w);
    });
    syncDimDisplay();
  }

  document.querySelectorAll(".rwd-preset").forEach((btn) => {
    btn.addEventListener("click", () => setViewportWidth(parseInt(btn.dataset.w)));
  });

  vpWInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const v = Math.max(280, Math.min(parseInt(vpWInput.value) || 600, 2000));
      setViewportWidth(v);
      document.querySelectorAll(".rwd-preset").forEach((b) => b.classList.remove("active"));
    }
  });

  vpWInput.addEventListener("blur", () => {
    const v = Math.max(280, Math.min(parseInt(vpWInput.value) || 600, 2000));
    setViewportWidth(v);
    document.querySelectorAll(".rwd-preset").forEach((b) => b.classList.remove("active"));
  });

  /* Drag-to-resize handles */
  let dragState = null;

  function startDrag(e, side) {
    e.preventDefault();
    const rect = rwdViewport.getBoundingClientRect();
    dragState = {
      side,
      startX: e.clientX,
      startW: rect.width,
      anchorX: side === "right" ? rect.left : rect.right,
    };
    document.querySelectorAll(".rwd-handle").forEach((h) => h.classList.remove("dragging"));
    e.currentTarget.classList.add("dragging");
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
    rwdViewport.classList.remove("rwd-full");
  }

  document.getElementById("rwdHandleR").addEventListener("mousedown", (e) => startDrag(e, "right"));
  document.getElementById("rwdHandleL").addEventListener("mousedown", (e) => startDrag(e, "left"));

  document.addEventListener("mousemove", (e) => {
    if (!dragState) return;
    const stageW = rwdStage.clientWidth - 80;
    let newW;
    if (dragState.side === "right") {
      newW = dragState.startW + (e.clientX - dragState.startX);
    } else {
      newW = dragState.startW - (e.clientX - dragState.startX);
    }
    newW = Math.max(280, Math.min(newW, stageW));
    rwdViewport.style.width = newW + "px";
    vpWInput.value = Math.round(newW);
    document.querySelectorAll(".rwd-preset").forEach((b) => b.classList.remove("active"));
  });

  document.addEventListener("mouseup", () => {
    if (!dragState) return;
    dragState = null;
    document.querySelectorAll(".rwd-handle").forEach((h) => h.classList.remove("dragging"));
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    syncDimDisplay();
  });

  new ResizeObserver(syncDimDisplay).observe(rwdViewport);
  syncDimDisplay();

  const copyBtn = document.getElementById("copyBtn");
  copyBtn.addEventListener("click", async () => {
    const ta = document.getElementById("fallbackCopy");
    try {
      const mode = await copySignatureForPaste();
      copyBtn.textContent = mode === "raw" ? "Copied (as code — see tip below)" : "Copied!";
      setTimeout(() => {
        copyBtn.textContent = "Copy for Gmail / Outlook";
      }, 2800);
    } catch {
      ta.value = window.__lastSignatureHtml || "";
      ta.style.display = "block";
      ta.select();
      document.execCommand("copy");
      ta.style.display = "none";
      copyBtn.textContent = "Copied (fallback)";
      setTimeout(() => {
        copyBtn.textContent = "Copy for Gmail / Outlook";
      }, 2800);
    }
  });
}

init().catch(console.error);

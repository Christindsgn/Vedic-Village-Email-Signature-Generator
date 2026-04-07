const PRODUCTION_BASE = "https://framer-email-signature-generator.vercel.app";

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

function signatureTemplate() {
  return `<table width="600" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,sans-serif;width:600px;max-width:100%;">

  <!-- TOP: white section -->
  <tr>
    <td bgcolor="#ffffff" style="padding:16px 8px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td style="font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:#000000;padding-bottom:7px;">__FULLNAME__</td>
        </tr>
        <tr>
          <td style="font-family:Arial,sans-serif;font-size:11px;line-height:18px;color:#000000;padding-bottom:7px;">__TITLE__</td>
        </tr>
        <tr>
          <td style="font-family:Arial,sans-serif;font-size:12px;line-height:20px;letter-spacing:0.12px;padding-bottom:12px;">
            <a href="__MAILTO__" style="color:#0286CD;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.12px;">__EMAIL__</a>
          </td>
        </tr>
        <tr>
          <td style="font-family:Arial,sans-serif;font-size:12px;line-height:20px;letter-spacing:0.12px;padding-bottom:12px;">
            <a href="__TEL__" style="color:#0286CD;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.12px;">__PHONE__</a>
          </td>
        </tr>
        <tr>
          <td style="font-family:Arial,sans-serif;font-size:12px;line-height:12px;">
            <a href="__WEBSITE_HREF__" style="color:#0286cd;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;">__WEBSITE_LABEL__</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- PATTERN STRIP -->
  <tr>
    <td bgcolor="#ffffff" style="padding:0;line-height:0;font-size:0;">
      <img src="__PATTERN_SRC__" width="600" height="54" alt="" border="0" style="display:block;width:600px;max-width:100%;height:54px;" />
    </td>
  </tr>

  <!-- BOTTOM: beige bar -->
  <tr>
    <td bgcolor="#f6f6ee" style="padding:24px 61px 24px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>

          <!-- LEFT: Logo -->
          <td width="71" valign="middle" style="padding-right:16px;">
            <a href="__WEBSITE_HREF__" style="text-decoration:none;display:block;">
              <img src="__LOGO_SRC__" width="55" height="40" alt="Vedic Village" border="0" style="display:block;" />
            </a>
          </td>

          <!-- CENTER: Address -->
          <td valign="middle">
            <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
              <tr>
                <td style="font-family:Arial,sans-serif;font-size:11px;line-height:16px;color:#2d4f59;padding-bottom:2px;">__ADDRESS1__</td>
              </tr>
              <tr>
                <td style="font-family:Arial,sans-serif;font-size:11px;line-height:16px;color:#2d4f59;">__ADDRESS2__</td>
              </tr>
            </table>
          </td>

          <!-- RIGHT: Social icons -->
          <td valign="middle" align="right" width="80">
            <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
              <tr>
                <td width="24" height="24">
                  <a href="__INSTAGRAM_HREF__" style="text-decoration:none;display:block;">
                    <img src="__IG_ICON__" width="24" height="24" alt="Instagram" border="0" style="display:block;" />
                  </a>
                </td>
                <td width="32">&nbsp;</td>
                <td width="24" height="24">
                  <a href="__LINKEDIN_HREF__" style="text-decoration:none;display:block;">
                    <img src="__LI_ICON__" width="24" height="24" alt="LinkedIn" border="0" style="display:block;" />
                  </a>
                </td>
              </tr>
            </table>
          </td>

        </tr>
      </table>
    </td>
  </tr>

</table>`;
}

function buildHtml(values) {
  const base = assetBase();

  const title = [values.titleLine1, values.titleLine2].filter(Boolean).join(" - ");

  const addressLines = String(values.address || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const address1 = escapeHtml(addressLines[0] || "");
  const address2 = escapeHtml(addressLines[1] || "");

  const websiteHref = ensureUrl(values.websiteUrl) || "#";

  let html = signatureTemplate();
  const map = {
    __PATTERN_SRC__: escapeHtml(base + "/bg.png"),
    __LOGO_SRC__: escapeHtml(base + "/vedic-logo.png"),
    __IG_ICON__: escapeHtml(base + "/Instagram.png"),
    __LI_ICON__: escapeHtml(base + "/Linkedin.png"),
    __FULLNAME__: escapeHtml(values.fullName),
    __TITLE__: escapeHtml(title),
    __MAILTO__: escapeHtml(mailto(values.email)),
    __EMAIL__: escapeHtml(values.email),
    __TEL__: escapeHtml(telHref(values.phone)),
    __PHONE__: escapeHtml(values.phone),
    __WEBSITE_HREF__: escapeHtml(websiteHref),
    __WEBSITE_LABEL__: escapeHtml(values.websiteLabel || values.websiteUrl),
    __ADDRESS1__: address1,
    __ADDRESS2__: address2,
    __INSTAGRAM_HREF__: escapeHtml(ensureUrl(values.instagramUrl) || "https://www.instagram.com/vedicvillagelife/"),
    __LINKEDIN_HREF__: escapeHtml(ensureUrl(values.linkedinUrl) || "https://www.linkedin.com/company/vedicvillagekochi/"),
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
      const hint = f.hint ? '<p class="hint">' + escapeHtml(f.hint) + "</p>" : "";
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

function updatePreview() {
  const tableHtml = buildHtml(collectValues());
  const iframe = document.getElementById("preview");
  iframe.srcdoc =
    "<!DOCTYPE html><html><head><meta charset='utf-8'></head><body style=\"margin:0;padding:12px;background:#e8e8e8;\">" +
    tableHtml +
    "</body></html>";
  window.__lastSignatureHtml = tableHtml;
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
  const plain = "Vedic Village email signature";
  const richHtml =
    '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>' +
    tableHtml +
    "</body></html>";

  if (copyFromPreviewIframe()) return "rich";

  if (navigator.clipboard && typeof ClipboardItem !== "undefined") {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([richHtml], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" }),
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
    wrap.style.cssText = "position:fixed;left:-9999px;top:0;";
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

  await navigator.clipboard.writeText(richHtml);
  return "raw";
}

async function init() {
  const res = await fetch("fields.json");
  const fields = await res.json();
  renderForm(fields);
  document.getElementById("fields").addEventListener("input", updatePreview);
  updatePreview();

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

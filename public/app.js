/** Same origin when served over HTTP(S); fallback for odd contexts. */
function assetBase() {
  if (typeof location !== "undefined" && /^https?:/i.test(location.protocol)) {
    return location.origin;
  }
  return "https://framer-email-signature-generator.vercel.app";
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

/** Figma Vedic Village, frame 663:5185 — read via Figma MCP. */
const BRAND = {
  text: "#000000",
  muted: "#000000",
  link: "#0a84a9",
  /** Social vectors in Figma use ~#a24213 */
  socialBrown: "#a24213",
  footerBg: "#fdfaf7",
  fontSans: "'Sen',Arial,Helvetica,sans-serif",
};

const FONT_SNIPPET =
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?family=Sen:wght@400;500;600;700;800&display=swap" rel="stylesheet">';

/** Small screens: stack footer columns. Outlook desktop ignores @media — keeps 2-col (safe fallback). */
const RESPONSIVE_STYLE =
  '<style type="text/css">' +
  "@media only screen and (max-width:480px){" +
  ".vv-s{display:block!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important;}" +
  ".vv-s2{padding-top:16px!important;}" +
  ".vv-l,.vv-l table,.vv-l td{text-align:left!important;}" +
  ".vv-l table{margin-left:0!important;}" +
  "}" +
  "</style>";

const HEAD_SNIPPET =
  FONT_SNIPPET +
  RESPONSIVE_STYLE +
  '<meta name="viewport" content="width=device-width,initial-scale=1">';

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
      '<a href="' + escapeHtml(ig) + '" style="text-decoration:none;margin-right:12px;display:inline-block;"><img src="' + escapeHtml(ensureUrl(igIcon)) + '" width="20" height="20" alt="Instagram" border="0" style="display:block;border:0;"></a>'
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
      '<a href="' + escapeHtml(li) + '" style="text-decoration:none;display:inline-block;"><img src="' + escapeHtml(ensureUrl(liIcon)) + '" width="20" height="20" alt="LinkedIn" border="0" style="display:block;border:0;"></a>'
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
    '" alt="Logo" border="0" style="display:block;margin:0 auto;border:0;max-height:40px;height:auto;width:auto;max-width:120px;">'
  );
}

function formatAddress(s) {
  const lines = String(s || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  return lines.map((l) => escapeHtml(l)).join("<br>");
}

function signatureTemplate() {
  const { text, muted, link, footerBg, fontSans } = BRAND;
  return `<!-- Vedic Village email signature — Sen (Google Fonts) -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;max-width:600px;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
  <tr>
    <td width="100%" valign="top" bgcolor="#FFFFFF" __PATTERN_ATTR__ style="padding:15px 27px 18px 27px;__PATTERN_STYLE__">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="304" style="width:304px;max-width:304px;border-collapse:collapse;border-spacing:0;">
        <tr>
          <td style="padding:0;font-size:14px;line-height:0;mso-line-height-alt:0;">
            <span style="display:block;font-family:${fontSans};font-size:14px;line-height:normal;font-weight:500;color:${text};mso-line-height-rule:at-least;margin:0 0 8px 0;padding:0;">__FULLNAME__</span>
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
            <a href="__MAILTO__" style="font-family:${fontSans};font-size:12px;line-height:20px;font-weight:500;color:${link};text-decoration:none;letter-spacing:0.12px;">__EMAIL__</a>
          </td>
        </tr>
        <tr>
          <td style="padding:0;">
            <a href="__TEL__" style="font-family:${fontSans};font-size:12px;line-height:20px;font-weight:500;color:${link};text-decoration:none;letter-spacing:0.12px;">__PHONE__</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td width="100%" bgcolor="${footerBg}" style="background-color:${footerBg};padding:16px 27px 20px 27px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        <tr>
          <td class="vv-s" width="304" valign="bottom" style="vertical-align:bottom;width:304px;max-width:304px;padding:0 16px 0 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
              <tr>
                <td style="padding:0 0 6px 0;">
                  <a href="__WEBSITE_HREF__" style="font-family:${fontSans};font-size:10px;line-height:16px;font-weight:500;color:${link};text-decoration:none;letter-spacing:0.1px;">__WEBSITE_LABEL__</a>
                </td>
              </tr>
              <tr>
                <td style="font-family:${fontSans};font-size:8px;line-height:15px;font-weight:400;color:${muted};padding:0 0 10px 0;">__LOCATIONS__</td>
              </tr>
              <tr>
                <td style="padding:0;">__SOCIAL__</td>
              </tr>
            </table>
          </td>
          <td class="vv-s vv-s2 vv-l" valign="bottom" align="center" style="vertical-align:bottom;text-align:center;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="176" style="width:176px;max-width:176px;border-collapse:collapse;margin:0 auto;">
              <tr>
                <td align="center" style="padding:0 0 12px 0;text-align:center;">__LOGO_IMG__</td>
              </tr>
              <tr>
                <td class="vv-l" align="center" style="font-family:${fontSans};font-size:8px;line-height:12px;font-weight:400;color:${muted};text-align:center;">__ADDRESS__</td>
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
  const assets = hostedAssets();
  const u = escapeHtml(ensureUrl(assets.patternBg));
  const patternAttr = 'background="' + u + '"';
  const patternStyle =
    "background-color:#FFFFFF;background-image:url(" +
    u +
    ");background-repeat:repeat;background-position:0 0;";

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
    __PATTERN_ATTR__: patternAttr,
    __PATTERN_STYLE__: patternStyle,
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

/* @sdcorejs/utils — chỉ các hàm plugin dùng */
const hex2 = n => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
export const ColorUtilities = {
  rgbToHex: (r, g, b) => '#' + hex2(r) + hex2(g) + hex2(b),
  hslToHex: (h, s, l) => {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return '#' + hex2(255 * f(0)) + hex2(255 * f(8)) + hex2(255 * f(4));
  }
};
export const Utilities = {
  generateUuid: () => (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16); })
};
export const BrowserUtilities = {
  downloadBlob: (blob, fileName) => {
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = fileName; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
};
export const resolveMaybeAsync = async v => await v;

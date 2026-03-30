const fs = require('fs');
const path = require('path');

const icons = {
  shoppingBagIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:8px;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
  waveIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-left:8px;"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path></svg>`,
  clockIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#92400e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:8px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  lockIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:8px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`
};

const templatePath = path.join(__dirname, '../templates/emails/resetPassword.html');
const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

function renderTemplate(template, replacements) {
  return Object.entries(replacements).reduce((acc, [key, value]) => {
    const safeValue = value === undefined || value === null ? '' : String(value);
    return acc.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), safeValue);
  }, template);
}

function resetPasswordTemplate({ userName, resetUrl, expiresIn, appName, heroImageUrl }) {
  return renderTemplate(htmlTemplate, {
    appName: appName || 'MODACOLOMBIA',
    userName: userName || 'usuario',
    resetUrl,
    expiresIn,
    heroImageUrl: heroImageUrl || 'https://images.pexels.com/photos/8386654/pexels-photo-8386654.jpeg?auto=compress&cs=tinysrgb&w=1200&h=500&dpr=1',
    year: new Date().getFullYear(),
    ...icons
  }).trim();
}

module.exports = { resetPasswordTemplate };

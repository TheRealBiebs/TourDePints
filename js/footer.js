// Shared footer — edit this file to update the footer on every page.
(function () {
  const mount = document.getElementById("site-footer");
  if (!mount) return;

  mount.outerHTML = `
<footer>
  <div class="footer-inner">
    <div>
      <div class="footer-brand">
        <img src="images/rider.png" alt="Tour De Pints" class="brand-logo" />
        <span id="footer-name"></span>
      </div>
      <p>Contact <a href="mailto:${SITE.contactEmail}" id="footer-email">${SITE.contactEmail}</a></p>
      <p>Connect with the Community. <a href="https://discord.gg/PYJP5Nnf6h">Join the Discord</a></p>
    </div>
    <div style="text-align:right;">
      <p style="font-size:0.82rem;">Seattle, Washington</p>
    </div>
    <p class="footer-copy">&copy; <span id="footer-year"></span> Seattle Tour De Pints. All rights reserved.</p>
  </div>
</footer>`;

  document.getElementById("footer-name").textContent = SITE.name;
  document.getElementById("footer-year").textContent = new Date().getFullYear();
})();

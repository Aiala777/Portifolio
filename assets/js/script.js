(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menu");
      });
    });
  }

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Rede de pontos e conexões no fundo do hero. Sem dependências externas.
  const canvas = document.querySelector("#hero-network");
  const hero = document.querySelector("#inicio");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canvas && hero && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let width = 0, height = 0, points = [], frame = 0;
    const pointer = { x: -1000, y: -1000 };

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width; height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(24, Math.min(68, Math.floor((width * height) / 18000)));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
        r: Math.random() * 1.5 + .7
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      points.forEach((p) => {
        const dx = pointer.x - p.x, dy = pointer.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < 120 && d > 0) { p.x -= dx / d * .12; p.y -= dy / d * .12; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));
      });
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i], b = points[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 125) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(55, 119, 76, ${.14 * (1 - d / 125)})`;
            ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      points.forEach((p) => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(48, 113, 70, .34)"; ctx.fill();
      });
      frame = requestAnimationFrame(draw);
    };

    hero.addEventListener("pointermove", (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left; pointer.y = event.clientY - rect.top;
    });
    hero.addEventListener("pointerleave", () => { pointer.x = -1000; pointer.y = -1000; });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) frame = requestAnimationFrame(draw);
    });
    resize(); draw();
  }

})();

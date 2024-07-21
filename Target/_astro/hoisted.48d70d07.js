const q = "modulepreload",
	H = function (t) {
		return "/" + t;
	},
	v = {},
	I = function (e, n, o) {
		if (!n || n.length === 0) return e();
		const i = document.getElementsByTagName("link");
		return Promise.all(
			n.map((s) => {
				if (((s = H(s)), s in v)) return;
				v[s] = !0;
				const a = s.endsWith(".css"),
					h = a ? '[rel="stylesheet"]' : "";
				if (!!o)
					for (let r = i.length - 1; r >= 0; r--) {
						const c = i[r];
						if (c.href === s && (!a || c.rel === "stylesheet"))
							return;
					}
				else if (document.querySelector(`link[href="${s}"]${h}`))
					return;
				const f = document.createElement("link");
				if (
					((f.rel = a ? "stylesheet" : q),
					a || ((f.as = "script"), (f.crossOrigin = "")),
					(f.href = s),
					document.head.appendChild(f),
					a)
				)
					return new Promise((r, c) => {
						f.addEventListener("load", r),
							f.addEventListener("error", () =>
								c(new Error(`Unable to preload CSS for ${s}`))
							);
					});
			})
		)
			.then(() => e())
			.catch((s) => {
				const a = new Event("vite:preloadError", { cancelable: !0 });
				if (
					((a.payload = s),
					window.dispatchEvent(a),
					!a.defaultPrevented)
				)
					throw s;
			});
	};
(await I(() => import("./index.esm.b3124093.js"), [])).initializeApp({
	apiKey: "",
	appId: "",
	authDomain: "",
	databaseURL: "",
	measurementId: "",
	messagingSenderId: "",
	projectId: "",
	storageBucket: "",
});
document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");
const M = (t) =>
		history.state && history.replaceState({ ...history.state, ...t }, ""),
	b = !!document.startViewTransition,
	g = () =>
		!!document.querySelector('[name="astro-view-transitions-enabled"]'),
	k = (t) => location.pathname === t.pathname && location.search === t.search,
	x = (t) => document.dispatchEvent(new Event(t)),
	P = () => x("astro:page-load"),
	C = () => {
		let t = document.createElement("div");
		t.setAttribute("aria-live", "assertive"),
			t.setAttribute("aria-atomic", "true"),
			t.setAttribute(
				"style",
				"position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px"
			),
			document.body.append(t),
			setTimeout(() => {
				let e =
					document.title ||
					document.querySelector("h1")?.textContent ||
					location.pathname;
				t.textContent = e;
			}, 60);
	},
	p = "data-astro-transition-persist";
let A,
	E = 0;
history.state
	? ((E = history.state.index),
		scrollTo({ left: history.state.scrollX, top: history.state.scrollY }))
	: g() &&
		history.replaceState({ index: E, scrollX, scrollY, intraPage: !1 }, "");
const _ = (t, e) => {
	let n = !1,
		o = !1;
	return (...i) => {
		if (n) {
			o = !0;
			return;
		}
		t(...i),
			(n = !0),
			setTimeout(() => {
				o && ((o = !1), t(...i)), (n = !1);
			}, e);
	};
};
async function F(t) {
	try {
		const e = await fetch(t),
			n = e.headers.get("content-type")?.replace(/;.*$/, "");
		return n !== "text/html" && n !== "application/xhtml+xml"
			? null
			: {
					html: await e.text(),
					redirected: e.redirected ? e.url : void 0,
					mediaType: n,
				};
	} catch {
		return null;
	}
}
function L() {
	const t = document.querySelector(
		'[name="astro-view-transitions-fallback"]'
	);
	return t ? t.getAttribute("content") : "animate";
}
function X() {
	let t = Promise.resolve();
	for (const e of Array.from(document.scripts)) {
		if (e.dataset.astroExec === "") continue;
		const n = document.createElement("script");
		n.innerHTML = e.innerHTML;
		for (const o of e.attributes) {
			if (o.name === "src") {
				const i = new Promise((s) => {
					n.onload = s;
				});
				t = t.then(() => i);
			}
			n.setAttribute(o.name, o.value);
		}
		(n.dataset.astroExec = ""), e.replaceWith(n);
	}
	return t;
}
function Y(t) {
	const e = t.effect;
	return !e || !(e instanceof KeyframeEffect) || !e.target
		? !1
		: window.getComputedStyle(e.target, e.pseudoElement)
				.animationIterationCount === "infinite";
}
const R = (t, e, n) => {
	const o = !k(t);
	let i = !1;
	t.href !== location.href &&
		(e
			? history.replaceState({ ...history.state }, "", t.href)
			: (history.replaceState({ ...history.state, intraPage: n }, ""),
				history.pushState(
					{ index: ++E, scrollX: 0, scrollY: 0 },
					"",
					t.href
				)),
		o && (scrollTo({ left: 0, top: 0, behavior: "instant" }), (i = !0))),
		t.hash
			? (location.href = t.href)
			: i || scrollTo({ left: 0, top: 0, behavior: "instant" });
};
function K(t) {
	const e = [];
	for (const n of t.querySelectorAll("head link[rel=stylesheet]"))
		if (
			!document.querySelector(
				`[${p}="${n.getAttribute(
					p
				)}"], link[rel=stylesheet][href="${n.getAttribute("href")}"]`
			)
		) {
			const o = document.createElement("link");
			o.setAttribute("rel", "preload"),
				o.setAttribute("as", "style"),
				o.setAttribute("href", n.getAttribute("href")),
				e.push(
					new Promise((i) => {
						["load", "error"].forEach((s) =>
							o.addEventListener(s, i)
						),
							document.head.append(o);
					})
				);
		}
	return e;
}
async function T(t, e, n, o, i) {
	const s = (r) => {
			const c = r.getAttribute(p),
				d = c && t.head.querySelector(`[${p}="${c}"]`);
			if (d) return d;
			if (r.matches("link[rel=stylesheet]")) {
				const m = r.getAttribute("href");
				return t.head.querySelector(
					`link[rel=stylesheet][href="${m}"]`
				);
			}
			return null;
		},
		a = () => {
			const r = document.activeElement;
			if (r?.closest(`[${p}]`)) {
				if (
					r instanceof HTMLInputElement ||
					r instanceof HTMLTextAreaElement
				) {
					const c = r.selectionStart,
						d = r.selectionEnd;
					return { activeElement: r, start: c, end: d };
				}
				return { activeElement: r };
			} else return { activeElement: null };
		},
		h = ({ activeElement: r, start: c, end: d }) => {
			r &&
				(r.focus(),
				(r instanceof HTMLInputElement ||
					r instanceof HTMLTextAreaElement) &&
					((r.selectionStart = c), (r.selectionEnd = d)));
		},
		y = () => {
			const r = document.documentElement,
				c = [...r.attributes].filter(
					({ name: l }) => (
						r.removeAttribute(l), l.startsWith("data-astro-")
					)
				);
			[...t.documentElement.attributes, ...c].forEach(
				({ name: l, value: u }) => r.setAttribute(l, u)
			);
			for (const l of document.scripts)
				for (const u of t.scripts)
					if (
						(!l.src && l.textContent === u.textContent) ||
						(l.src && l.type === u.type && l.src === u.src)
					) {
						u.dataset.astroExec = "";
						break;
					}
			for (const l of Array.from(document.head.children)) {
				const u = s(l);
				u ? u.remove() : l.remove();
			}
			document.head.append(...t.head.children);
			const d = document.body,
				m = a();
			document.body.replaceWith(t.body);
			for (const l of d.querySelectorAll(`[${p}]`)) {
				const u = l.getAttribute(p),
					w = document.querySelector(`[${p}="${u}"]`);
				w && w.replaceWith(l);
			}
			h(m),
				o
					? scrollTo(o.scrollX, o.scrollY)
					: R(e, n.history === "replace", !1),
				x("astro:after-swap");
		},
		f = K(t);
	if ((f.length && (await Promise.all(f)), i === "animate")) {
		const r = document.getAnimations();
		document.documentElement.dataset.astroTransitionFallback = "old";
		const c = document
			.getAnimations()
			.filter((m) => !r.includes(m) && !Y(m));
		await Promise.all(c.map((m) => m.finished)),
			y(),
			(document.documentElement.dataset.astroTransitionFallback = "new");
	} else y();
}
async function $(t, e, n, o) {
	let i;
	const s = e.href,
		a = await F(s);
	if (a === null) {
		location.href = s;
		return;
	}
	a.redirected && (e = new URL(a.redirected)), (A ??= new DOMParser());
	const h = A.parseFromString(a.html, a.mediaType);
	if (
		(h.querySelectorAll("noscript").forEach((y) => y.remove()),
		!h.querySelector('[name="astro-view-transitions-enabled"]'))
	) {
		location.href = s;
		return;
	}
	o || history.replaceState({ ...history.state, scrollX, scrollY }, ""),
		(document.documentElement.dataset.astroTransition = t),
		b
			? (i = document.startViewTransition(() => T(h, e, n, o)).finished)
			: (i = T(h, e, n, o, L()));
	try {
		await i;
	} finally {
		await X(), P(), C();
	}
}
function U(t, e) {
	if (!g()) {
		location.href = t;
		return;
	}
	const n = new URL(t, location.href);
	location.origin === n.origin && k(n)
		? R(n, e?.history === "replace", !0)
		: $("forward", n, e ?? {});
}
function B(t) {
	if (!g() && t.state) {
		history.scrollRestoration && (history.scrollRestoration = "manual"),
			location.reload();
		return;
	}
	if (t.state === null) {
		history.scrollRestoration && (history.scrollRestoration = "auto");
		return;
	}
	history.scrollRestoration && (history.scrollRestoration = "manual");
	const e = history.state;
	if (e.intraPage) scrollTo(e.scrollX, e.scrollY);
	else {
		const n = e.index,
			o = n > E ? "forward" : "back";
		(E = n), $(o, new URL(location.href), {}, e);
	}
}
const S = () => {
	M({ scrollX, scrollY });
};
{
	(b || L() !== "none") &&
		(addEventListener("popstate", B),
		addEventListener("load", P),
		"onscrollend" in window
			? addEventListener("scrollend", S)
			: addEventListener("scroll", _(S, 300)));
	for (const t of document.scripts) t.dataset.astroExec = "";
}
function O() {
	const t = document.querySelector(
		'[name="astro-view-transitions-fallback"]'
	);
	return t ? t.getAttribute("content") : "animate";
}
function W(t) {
	if (document.querySelector(`link[rel=prefetch][href="${t}"]`)) return;
	if (navigator.connection) {
		let n = navigator.connection;
		if (n.saveData || /(2|3)g/.test(n.effectiveType || "")) return;
	}
	let e = document.createElement("link");
	e.setAttribute("rel", "prefetch"),
		e.setAttribute("href", t),
		document.head.append(e);
}
(b || O() !== "none") &&
	(document.addEventListener("click", (t) => {
		let e = t.target;
		e instanceof Element && e.tagName !== "A" && (e = e.closest("a")),
			!(
				!e ||
				!(e instanceof HTMLAnchorElement) ||
				e.dataset.astroReload !== void 0 ||
				e.hasAttribute("download") ||
				!e.href ||
				(e.target && e.target !== "_self") ||
				e.origin !== location.origin ||
				t.button !== 0 ||
				t.metaKey ||
				t.ctrlKey ||
				t.altKey ||
				t.shiftKey ||
				t.defaultPrevented
			) &&
				(t.preventDefault(),
				U(e.href, {
					history:
						e.dataset.astroHistory === "replace"
							? "replace"
							: "auto",
				}));
	}),
	["mouseenter", "touchstart", "focus"].forEach((t) => {
		document.addEventListener(
			t,
			(e) => {
				if (e.target instanceof HTMLAnchorElement) {
					let n = e.target;
					n.origin === location.origin &&
						n.pathname !== location.pathname &&
						g() &&
						W(n.pathname);
				}
			},
			{ passive: !0, capture: !0 }
		);
	}));
//# sourceMappingURL=hoisted.48d70d07.js.map

const W = function (e) {
		const t = [];
		let n = 0;
		for (let r = 0; r < e.length; r++) {
			let a = e.charCodeAt(r);
			a < 128
				? (t[n++] = a)
				: a < 2048
					? ((t[n++] = (a >> 6) | 192), (t[n++] = (63 & a) | 128))
					: 55296 == (64512 & a) &&
						  r + 1 < e.length &&
						  56320 == (64512 & e.charCodeAt(r + 1))
						? ((a =
								65536 +
								((1023 & a) << 10) +
								(1023 & e.charCodeAt(++r))),
							(t[n++] = (a >> 18) | 240),
							(t[n++] = ((a >> 12) & 63) | 128),
							(t[n++] = ((a >> 6) & 63) | 128),
							(t[n++] = (63 & a) | 128))
						: ((t[n++] = (a >> 12) | 224),
							(t[n++] = ((a >> 6) & 63) | 128),
							(t[n++] = (63 & a) | 128));
		}
		return t;
	},
	ne = function (e) {
		const t = [];
		let n = 0,
			r = 0;
		for (; n < e.length; ) {
			const a = e[n++];
			if (a < 128) t[r++] = String.fromCharCode(a);
			else if (a > 191 && a < 224) {
				const i = e[n++];
				t[r++] = String.fromCharCode(((31 & a) << 6) | (63 & i));
			} else if (a > 239 && a < 365) {
				const i =
					(((7 & a) << 18) |
						((63 & e[n++]) << 12) |
						((63 & e[n++]) << 6) |
						(63 & e[n++])) -
					65536;
				(t[r++] = String.fromCharCode(55296 + (i >> 10))),
					(t[r++] = String.fromCharCode(56320 + (1023 & i)));
			} else {
				const i = e[n++],
					s = e[n++];
				t[r++] = String.fromCharCode(
					((15 & a) << 12) | ((63 & i) << 6) | (63 & s)
				);
			}
		}
		return t.join("");
	},
	G = {
		byteToCharMap_: null,
		charToByteMap_: null,
		byteToCharMapWebSafe_: null,
		charToByteMapWebSafe_: null,
		ENCODED_VALS_BASE:
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
		get ENCODED_VALS() {
			return this.ENCODED_VALS_BASE + "+/=";
		},
		get ENCODED_VALS_WEBSAFE() {
			return this.ENCODED_VALS_BASE + "-_.";
		},
		HAS_NATIVE_SUPPORT: "function" == typeof atob,
		encodeByteArray(e, t) {
			if (!Array.isArray(e))
				throw Error("encodeByteArray takes an array as a parameter");
			this.init_();
			const n = t ? this.byteToCharMapWebSafe_ : this.byteToCharMap_,
				r = [];
			for (let t = 0; t < e.length; t += 3) {
				const a = e[t],
					i = t + 1 < e.length,
					s = i ? e[t + 1] : 0,
					o = t + 2 < e.length,
					c = o ? e[t + 2] : 0,
					h = a >> 2,
					l = ((3 & a) << 4) | (s >> 4);
				let u = ((15 & s) << 2) | (c >> 6),
					d = 63 & c;
				o || ((d = 64), i || (u = 64)), r.push(n[h], n[l], n[u], n[d]);
			}
			return r.join("");
		},
		encodeString(e, t) {
			return this.HAS_NATIVE_SUPPORT && !t
				? btoa(e)
				: this.encodeByteArray(W(e), t);
		},
		decodeString(e, t) {
			return this.HAS_NATIVE_SUPPORT && !t
				? atob(e)
				: ne(this.decodeStringToByteArray(e, t));
		},
		decodeStringToByteArray(e, t) {
			this.init_();
			const n = t ? this.charToByteMapWebSafe_ : this.charToByteMap_,
				r = [];
			for (let t = 0; t < e.length; ) {
				const a = n[e.charAt(t++)],
					i = t < e.length ? n[e.charAt(t)] : 0;
				++t;
				const s = t < e.length ? n[e.charAt(t)] : 64;
				++t;
				const o = t < e.length ? n[e.charAt(t)] : 64;
				if ((++t, null == a || null == i || null == s || null == o))
					throw new re();
				const c = (a << 2) | (i >> 4);
				if ((r.push(c), 64 !== s)) {
					const e = ((i << 4) & 240) | (s >> 2);
					if ((r.push(e), 64 !== o)) {
						const e = ((s << 6) & 192) | o;
						r.push(e);
					}
				}
			}
			return r;
		},
		init_() {
			if (!this.byteToCharMap_) {
				(this.byteToCharMap_ = {}),
					(this.charToByteMap_ = {}),
					(this.byteToCharMapWebSafe_ = {}),
					(this.charToByteMapWebSafe_ = {});
				for (let e = 0; e < this.ENCODED_VALS.length; e++)
					(this.byteToCharMap_[e] = this.ENCODED_VALS.charAt(e)),
						(this.charToByteMap_[this.byteToCharMap_[e]] = e),
						(this.byteToCharMapWebSafe_[e] =
							this.ENCODED_VALS_WEBSAFE.charAt(e)),
						(this.charToByteMapWebSafe_[
							this.byteToCharMapWebSafe_[e]
						] = e),
						e >= this.ENCODED_VALS_BASE.length &&
							((this.charToByteMap_[
								this.ENCODED_VALS_WEBSAFE.charAt(e)
							] = e),
							(this.charToByteMapWebSafe_[
								this.ENCODED_VALS.charAt(e)
							] = e));
			}
		},
	};
class re extends Error {
	constructor() {
		super(...arguments), (this.name = "DecodeBase64StringError");
	}
}
const se = function (e) {
		const t = W(e);
		return G.encodeByteArray(t, !0);
	},
	K = function (e) {
		return se(e).replace(/\./g, "");
	},
	ae = function (e) {
		try {
			return G.decodeString(e, !0);
		} catch (e) {
			console.error("base64Decode failed: ", e);
		}
		return null;
	};
function ie() {
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw new Error("Unable to locate global object.");
}
const oe = () => ie().__FIREBASE_DEFAULTS__,
	ce = () => {
		if (typeof process > "u" || typeof process.env > "u") return;
		const e = {}.__FIREBASE_DEFAULTS__;
		return e ? JSON.parse(e) : void 0;
	},
	le = () => {
		if (typeof document > "u") return;
		let e;
		try {
			e = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
		} catch {
			return;
		}
		const t = e && ae(e[1]);
		return t && JSON.parse(t);
	},
	he = () => {
		try {
			return oe() || ce() || le();
		} catch (e) {
			return void console.info(
				`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`
			);
		}
	},
	J = () => {
		var e;
		return null === (e = he()) || void 0 === e ? void 0 : e.config;
	};
class de {
	constructor() {
		(this.reject = () => {}),
			(this.resolve = () => {}),
			(this.promise = new Promise((e, t) => {
				(this.resolve = e), (this.reject = t);
			}));
	}
	wrapCallback(e) {
		return (t, n) => {
			t ? this.reject(t) : this.resolve(n),
				"function" == typeof e &&
					(this.promise.catch(() => {}),
					1 === e.length ? e(t) : e(t, n));
		};
	}
}
function fe() {
	try {
		return "object" == typeof indexedDB;
	} catch {
		return !1;
	}
}
function ue() {
	return new Promise((e, t) => {
		try {
			let n = !0;
			const r = "validate-browser-context-for-indexeddb-analytics-module",
				a = self.indexedDB.open(r);
			(a.onsuccess = () => {
				a.result.close(), n || self.indexedDB.deleteDatabase(r), e(!0);
			}),
				(a.onupgradeneeded = () => {
					n = !1;
				}),
				(a.onerror = () => {
					var e;
					t(
						(null === (e = a.error) || void 0 === e
							? void 0
							: e.message) || ""
					);
				});
		} catch (e) {
			t(e);
		}
	});
}
const pe = "FirebaseError";
class E extends Error {
	constructor(e, t, n) {
		super(t),
			(this.code = e),
			(this.customData = n),
			(this.name = pe),
			Object.setPrototypeOf(this, E.prototype),
			Error.captureStackTrace &&
				Error.captureStackTrace(this, Y.prototype.create);
	}
}
class Y {
	constructor(e, t, n) {
		(this.service = e), (this.serviceName = t), (this.errors = n);
	}
	create(e, ...t) {
		const n = t[0] || {},
			r = `${this.service}/${e}`,
			a = this.errors[e],
			i = a ? me(a, n) : "Error",
			s = `${this.serviceName}: ${i} (${r}).`;
		return new E(r, s, n);
	}
}
function me(e, t) {
	return e.replace(ge, (e, n) => {
		const r = t[n];
		return null != r ? String(r) : `<${n}?>`;
	});
}
const ge = /\{\$([^}]+)}/g;
function O(e, t) {
	if (e === t) return !0;
	const n = Object.keys(e),
		r = Object.keys(t);
	for (const a of n) {
		if (!r.includes(a)) return !1;
		const n = e[a],
			i = t[a];
		if (P(n) && P(i)) {
			if (!O(n, i)) return !1;
		} else if (n !== i) return !1;
	}
	for (const e of r) if (!n.includes(e)) return !1;
	return !0;
}
function P(e) {
	return null !== e && "object" == typeof e;
}
class D {
	constructor(e, t, n) {
		(this.name = e),
			(this.instanceFactory = t),
			(this.type = n),
			(this.multipleInstances = !1),
			(this.serviceProps = {}),
			(this.instantiationMode = "LAZY"),
			(this.onInstanceCreated = null);
	}
	setInstantiationMode(e) {
		return (this.instantiationMode = e), this;
	}
	setMultipleInstances(e) {
		return (this.multipleInstances = e), this;
	}
	setServiceProps(e) {
		return (this.serviceProps = e), this;
	}
	setInstanceCreatedCallback(e) {
		return (this.onInstanceCreated = e), this;
	}
}
const u = "[DEFAULT]";
class be {
	constructor(e, t) {
		(this.name = e),
			(this.container = t),
			(this.component = null),
			(this.instances = new Map()),
			(this.instancesDeferred = new Map()),
			(this.instancesOptions = new Map()),
			(this.onInitCallbacks = new Map());
	}
	get(e) {
		const t = this.normalizeInstanceIdentifier(e);
		if (!this.instancesDeferred.has(t)) {
			const e = new de();
			if (
				(this.instancesDeferred.set(t, e),
				this.isInitialized(t) || this.shouldAutoInitialize())
			)
				try {
					const n = this.getOrInitializeService({
						instanceIdentifier: t,
					});
					n && e.resolve(n);
				} catch {}
		}
		return this.instancesDeferred.get(t).promise;
	}
	getImmediate(e) {
		var t;
		const n = this.normalizeInstanceIdentifier(e?.identifier),
			r = null !== (t = e?.optional) && void 0 !== t && t;
		if (!this.isInitialized(n) && !this.shouldAutoInitialize()) {
			if (r) return null;
			throw Error(`Service ${this.name} is not available`);
		}
		try {
			return this.getOrInitializeService({ instanceIdentifier: n });
		} catch (e) {
			if (r) return null;
			throw e;
		}
	}
	getComponent() {
		return this.component;
	}
	setComponent(e) {
		if (e.name !== this.name)
			throw Error(
				`Mismatching Component ${e.name} for Provider ${this.name}.`
			);
		if (this.component)
			throw Error(`Component for ${this.name} has already been provided`);
		if (((this.component = e), this.shouldAutoInitialize())) {
			if (_e(e))
				try {
					this.getOrInitializeService({ instanceIdentifier: u });
				} catch {}
			for (const [e, t] of this.instancesDeferred.entries()) {
				const n = this.normalizeInstanceIdentifier(e);
				try {
					const e = this.getOrInitializeService({
						instanceIdentifier: n,
					});
					t.resolve(e);
				} catch {}
			}
		}
	}
	clearInstance(e = u) {
		this.instancesDeferred.delete(e),
			this.instancesOptions.delete(e),
			this.instances.delete(e);
	}
	async delete() {
		const e = Array.from(this.instances.values());
		await Promise.all([
			...e.filter((e) => "INTERNAL" in e).map((e) => e.INTERNAL.delete()),
			...e.filter((e) => "_delete" in e).map((e) => e._delete()),
		]);
	}
	isComponentSet() {
		return null != this.component;
	}
	isInitialized(e = u) {
		return this.instances.has(e);
	}
	getOptions(e = u) {
		return this.instancesOptions.get(e) || {};
	}
	initialize(e = {}) {
		const { options: t = {} } = e,
			n = this.normalizeInstanceIdentifier(e.instanceIdentifier);
		if (this.isInitialized(n))
			throw Error(`${this.name}(${n}) has already been initialized`);
		if (!this.isComponentSet())
			throw Error(`Component ${this.name} has not been registered yet`);
		const r = this.getOrInitializeService({
			instanceIdentifier: n,
			options: t,
		});
		for (const [e, t] of this.instancesDeferred.entries()) {
			n === this.normalizeInstanceIdentifier(e) && t.resolve(r);
		}
		return r;
	}
	onInit(e, t) {
		var n;
		const r = this.normalizeInstanceIdentifier(t),
			a =
				null !== (n = this.onInitCallbacks.get(r)) && void 0 !== n
					? n
					: new Set();
		a.add(e), this.onInitCallbacks.set(r, a);
		const i = this.instances.get(r);
		return (
			i && e(i, r),
			() => {
				a.delete(e);
			}
		);
	}
	invokeOnInitCallbacks(e, t) {
		const n = this.onInitCallbacks.get(t);
		if (n)
			for (const r of n)
				try {
					r(e, t);
				} catch {}
	}
	getOrInitializeService({ instanceIdentifier: e, options: t = {} }) {
		let n = this.instances.get(e);
		if (
			!n &&
			this.component &&
			((n = this.component.instanceFactory(this.container, {
				instanceIdentifier: Ee(e),
				options: t,
			})),
			this.instances.set(e, n),
			this.instancesOptions.set(e, t),
			this.invokeOnInitCallbacks(n, e),
			this.component.onInstanceCreated)
		)
			try {
				this.component.onInstanceCreated(this.container, e, n);
			} catch {}
		return n || null;
	}
	normalizeInstanceIdentifier(e = u) {
		return this.component ? (this.component.multipleInstances ? e : u) : e;
	}
	shouldAutoInitialize() {
		return (
			!!this.component && "EXPLICIT" !== this.component.instantiationMode
		);
	}
}
function Ee(e) {
	return e === u ? void 0 : e;
}
function _e(e) {
	return "EAGER" === e.instantiationMode;
}
class ye {
	constructor(e) {
		(this.name = e), (this.providers = new Map());
	}
	addComponent(e) {
		const t = this.getProvider(e.name);
		if (t.isComponentSet())
			throw new Error(
				`Component ${e.name} has already been registered with ${this.name}`
			);
		t.setComponent(e);
	}
	addOrOverwriteComponent(e) {
		this.getProvider(e.name).isComponentSet() &&
			this.providers.delete(e.name),
			this.addComponent(e);
	}
	getProvider(e) {
		if (this.providers.has(e)) return this.providers.get(e);
		const t = new be(e, this);
		return this.providers.set(e, t), t;
	}
	getProviders() {
		return Array.from(this.providers.values());
	}
}
const $ = [];
var l;
!(function (e) {
	(e[(e.DEBUG = 0)] = "DEBUG"),
		(e[(e.VERBOSE = 1)] = "VERBOSE"),
		(e[(e.INFO = 2)] = "INFO"),
		(e[(e.WARN = 3)] = "WARN"),
		(e[(e.ERROR = 4)] = "ERROR"),
		(e[(e.SILENT = 5)] = "SILENT");
})(l || (l = {}));
const X = {
		debug: l.DEBUG,
		verbose: l.VERBOSE,
		info: l.INFO,
		warn: l.WARN,
		error: l.ERROR,
		silent: l.SILENT,
	},
	Ie = l.INFO,
	De = {
		[l.DEBUG]: "log",
		[l.VERBOSE]: "log",
		[l.INFO]: "info",
		[l.WARN]: "warn",
		[l.ERROR]: "error",
	},
	ve = (e, t, ...n) => {
		if (t < e.logLevel) return;
		const r = new Date().toISOString(),
			a = De[t];
		if (!a)
			throw new Error(
				`Attempted to log a message with an invalid logType (value: ${t})`
			);
		console[a](`[${r}]  ${e.name}:`, ...n);
	};
class we {
	constructor(e) {
		(this.name = e),
			(this._logLevel = Ie),
			(this._logHandler = ve),
			(this._userLogHandler = null),
			$.push(this);
	}
	get logLevel() {
		return this._logLevel;
	}
	set logLevel(e) {
		if (!(e in l))
			throw new TypeError(
				`Invalid value "${e}" assigned to \`logLevel\``
			);
		this._logLevel = e;
	}
	setLogLevel(e) {
		this._logLevel = "string" == typeof e ? X[e] : e;
	}
	get logHandler() {
		return this._logHandler;
	}
	set logHandler(e) {
		if ("function" != typeof e)
			throw new TypeError(
				"Value assigned to `logHandler` must be a function"
			);
		this._logHandler = e;
	}
	get userLogHandler() {
		return this._userLogHandler;
	}
	set userLogHandler(e) {
		this._userLogHandler = e;
	}
	debug(...e) {
		this._userLogHandler && this._userLogHandler(this, l.DEBUG, ...e),
			this._logHandler(this, l.DEBUG, ...e);
	}
	log(...e) {
		this._userLogHandler && this._userLogHandler(this, l.VERBOSE, ...e),
			this._logHandler(this, l.VERBOSE, ...e);
	}
	info(...e) {
		this._userLogHandler && this._userLogHandler(this, l.INFO, ...e),
			this._logHandler(this, l.INFO, ...e);
	}
	warn(...e) {
		this._userLogHandler && this._userLogHandler(this, l.WARN, ...e),
			this._logHandler(this, l.WARN, ...e);
	}
	error(...e) {
		this._userLogHandler && this._userLogHandler(this, l.ERROR, ...e),
			this._logHandler(this, l.ERROR, ...e);
	}
}
function Se(e) {
	$.forEach((t) => {
		t.setLogLevel(e);
	});
}
function Ce(e, t) {
	for (const n of $) {
		let r = null;
		t && t.level && (r = X[t.level]),
			(n.userLogHandler =
				null === e
					? null
					: (t, n, ...a) => {
							const i = a
								.map((e) => {
									if (null == e) return null;
									if ("string" == typeof e) return e;
									if (
										"number" == typeof e ||
										"boolean" == typeof e
									)
										return e.toString();
									if (e instanceof Error) return e.message;
									try {
										return JSON.stringify(e);
									} catch {
										return null;
									}
								})
								.filter((e) => e)
								.join(" ");
							n >= (r ?? t.logLevel) &&
								e({
									level: l[n].toLowerCase(),
									message: i,
									args: a,
									type: t.name,
								});
						});
	}
}
const Ae = (e, t) => t.some((t) => e instanceof t);
let x, F;
function Be() {
	return (
		x ||
		(x = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction])
	);
}
function Oe() {
	return (
		F ||
		(F = [
			IDBCursor.prototype.advance,
			IDBCursor.prototype.continue,
			IDBCursor.prototype.continuePrimaryKey,
		])
	);
}
const Z = new WeakMap(),
	T = new WeakMap(),
	Q = new WeakMap(),
	S = new WeakMap(),
	R = new WeakMap();
function Te(e) {
	const t = new Promise((t, n) => {
		const r = () => {
				e.removeEventListener("success", a),
					e.removeEventListener("error", i);
			},
			a = () => {
				t(f(e.result)), r();
			},
			i = () => {
				n(e.error), r();
			};
		e.addEventListener("success", a), e.addEventListener("error", i);
	});
	return (
		t
			.then((t) => {
				t instanceof IDBCursor && Z.set(t, e);
			})
			.catch(() => {}),
		R.set(t, e),
		t
	);
}
function Me(e) {
	if (T.has(e)) return;
	const t = new Promise((t, n) => {
		const r = () => {
				e.removeEventListener("complete", a),
					e.removeEventListener("error", i),
					e.removeEventListener("abort", i);
			},
			a = () => {
				t(), r();
			},
			i = () => {
				n(e.error || new DOMException("AbortError", "AbortError")), r();
			};
		e.addEventListener("complete", a),
			e.addEventListener("error", i),
			e.addEventListener("abort", i);
	});
	T.set(e, t);
}
let M = {
	get(e, t, n) {
		if (e instanceof IDBTransaction) {
			if ("done" === t) return T.get(e);
			if ("objectStoreNames" === t) return e.objectStoreNames || Q.get(e);
			if ("store" === t)
				return n.objectStoreNames[1]
					? void 0
					: n.objectStore(n.objectStoreNames[0]);
		}
		return f(e[t]);
	},
	set: (e, t, n) => ((e[t] = n), !0),
	has: (e, t) =>
		(e instanceof IDBTransaction && ("done" === t || "store" === t)) ||
		t in e,
};
function Ne(e) {
	M = e(M);
}
function Le(e) {
	return e !== IDBDatabase.prototype.transaction ||
		"objectStoreNames" in IDBTransaction.prototype
		? Oe().includes(e)
			? function (...t) {
					return e.apply(C(this), t), f(Z.get(this));
				}
			: function (...t) {
					return f(e.apply(C(this), t));
				}
		: function (t, ...n) {
				const r = e.call(C(this), t, ...n);
				return Q.set(r, t.sort ? t.sort() : [t]), f(r);
			};
}
function $e(e) {
	return "function" == typeof e
		? Le(e)
		: (e instanceof IDBTransaction && Me(e),
			Ae(e, Be()) ? new Proxy(e, M) : e);
}
function f(e) {
	if (e instanceof IDBRequest) return Te(e);
	if (S.has(e)) return S.get(e);
	const t = $e(e);
	return t !== e && (S.set(e, t), R.set(t, e)), t;
}
const C = (e) => R.get(e);
function Re(e, t, { blocked: n, upgrade: r, blocking: a, terminated: i } = {}) {
	const s = indexedDB.open(e, t),
		o = f(s);
	return (
		r &&
			s.addEventListener("upgradeneeded", (e) => {
				r(f(s.result), e.oldVersion, e.newVersion, f(s.transaction), e);
			}),
		n &&
			s.addEventListener("blocked", (e) =>
				n(e.oldVersion, e.newVersion, e)
			),
		o
			.then((e) => {
				i && e.addEventListener("close", () => i()),
					a &&
						e.addEventListener("versionchange", (e) =>
							a(e.oldVersion, e.newVersion, e)
						);
			})
			.catch(() => {}),
		o
	);
}
const He = ["get", "getKey", "getAll", "getAllKeys", "count"],
	Pe = ["put", "add", "delete", "clear"],
	A = new Map();
function j(e, t) {
	if (!(e instanceof IDBDatabase) || t in e || "string" != typeof t) return;
	if (A.get(t)) return A.get(t);
	const n = t.replace(/FromIndex$/, ""),
		r = t !== n,
		a = Pe.includes(n);
	if (
		!(n in (r ? IDBIndex : IDBObjectStore).prototype) ||
		(!a && !He.includes(n))
	)
		return;
	const i = async function (e, ...t) {
		const i = this.transaction(e, a ? "readwrite" : "readonly");
		let s = i.store;
		return (
			r && (s = s.index(t.shift())),
			(await Promise.all([s[n](...t), a && i.done]))[0]
		);
	};
	return A.set(t, i), i;
}
Ne((e) => ({
	...e,
	get: (t, n, r) => j(t, n) || e.get(t, n, r),
	has: (t, n) => !!j(t, n) || e.has(t, n),
}));
class xe {
	constructor(e) {
		this.container = e;
	}
	getPlatformInfoString() {
		return this.container
			.getProviders()
			.map((e) => {
				if (Fe(e)) {
					const t = e.getImmediate();
					return `${t.library}/${t.version}`;
				}
				return null;
			})
			.filter((e) => e)
			.join(" ");
	}
}
function Fe(e) {
	const t = e.getComponent();
	return "VERSION" === t?.type;
}
const N = "@firebase/app",
	V = "0.9.22",
	p = new we("@firebase/app"),
	je = "@firebase/app-compat",
	Ve = "@firebase/analytics-compat",
	Ue = "@firebase/analytics",
	ke = "@firebase/app-check-compat",
	ze = "@firebase/app-check",
	We = "@firebase/auth",
	Ge = "@firebase/auth-compat",
	Ke = "@firebase/database",
	Je = "@firebase/database-compat",
	Ye = "@firebase/functions",
	Xe = "@firebase/functions-compat",
	Ze = "@firebase/installations",
	Qe = "@firebase/installations-compat",
	qe = "@firebase/messaging",
	et = "@firebase/messaging-compat",
	tt = "@firebase/performance",
	nt = "@firebase/performance-compat",
	rt = "@firebase/remote-config",
	st = "@firebase/remote-config-compat",
	at = "@firebase/storage",
	it = "@firebase/storage-compat",
	ot = "@firebase/firestore",
	ct = "@firebase/firestore-compat",
	lt = "firebase",
	ht = "10.5.2",
	v = "[DEFAULT]",
	dt = {
		[N]: "fire-core",
		[je]: "fire-core-compat",
		[Ue]: "fire-analytics",
		[Ve]: "fire-analytics-compat",
		[ze]: "fire-app-check",
		[ke]: "fire-app-check-compat",
		[We]: "fire-auth",
		[Ge]: "fire-auth-compat",
		[Ke]: "fire-rtdb",
		[Je]: "fire-rtdb-compat",
		[Ye]: "fire-fn",
		[Xe]: "fire-fn-compat",
		[Ze]: "fire-iid",
		[Qe]: "fire-iid-compat",
		[qe]: "fire-fcm",
		[et]: "fire-fcm-compat",
		[tt]: "fire-perf",
		[nt]: "fire-perf-compat",
		[rt]: "fire-rc",
		[st]: "fire-rc-compat",
		[at]: "fire-gcs",
		[it]: "fire-gcs-compat",
		[ot]: "fire-fst",
		[ct]: "fire-fst-compat",
		"fire-js": "fire-js",
		[lt]: "fire-js-all",
	},
	m = new Map(),
	w = new Map();
function ft(e, t) {
	try {
		e.container.addComponent(t);
	} catch (n) {
		p.debug(
			`Component ${t.name} failed to register with FirebaseApp ${e.name}`,
			n
		);
	}
}
function Bt(e, t) {
	e.container.addOrOverwriteComponent(t);
}
function L(e) {
	const t = e.name;
	if (w.has(t))
		return (
			p.debug(`There were multiple attempts to register component ${t}.`),
			!1
		);
	w.set(t, e);
	for (const t of m.values()) ft(t, e);
	return !0;
}
function ut(e, t) {
	const n = e.container
		.getProvider("heartbeat")
		.getImmediate({ optional: !0 });
	return n && n.triggerHeartbeat(), e.container.getProvider(t);
}
function Ot(e, t, n = v) {
	ut(e, t).clearInstance(n);
}
function Tt() {
	w.clear();
}
const pt = {
		"no-app":
			"No Firebase App '{$appName}' has been created - call initializeApp() first",
		"bad-app-name": "Illegal App name: '{$appName}",
		"duplicate-app":
			"Firebase App named '{$appName}' already exists with different options or config",
		"app-deleted": "Firebase App named '{$appName}' already deleted",
		"no-options":
			"Need to provide options, when not being deployed to hosting via source.",
		"invalid-app-argument":
			"firebase.{$appName}() takes either no argument or a Firebase App instance.",
		"invalid-log-argument":
			"First argument to `onLog` must be null or a function.",
		"idb-open":
			"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
		"idb-get":
			"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
		"idb-set":
			"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
		"idb-delete":
			"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
	},
	d = new Y("app", "Firebase", pt);
class mt {
	constructor(e, t, n) {
		(this._isDeleted = !1),
			(this._options = Object.assign({}, e)),
			(this._config = Object.assign({}, t)),
			(this._name = t.name),
			(this._automaticDataCollectionEnabled =
				t.automaticDataCollectionEnabled),
			(this._container = n),
			this.container.addComponent(new D("app", () => this, "PUBLIC"));
	}
	get automaticDataCollectionEnabled() {
		return this.checkDestroyed(), this._automaticDataCollectionEnabled;
	}
	set automaticDataCollectionEnabled(e) {
		this.checkDestroyed(), (this._automaticDataCollectionEnabled = e);
	}
	get name() {
		return this.checkDestroyed(), this._name;
	}
	get options() {
		return this.checkDestroyed(), this._options;
	}
	get config() {
		return this.checkDestroyed(), this._config;
	}
	get container() {
		return this._container;
	}
	get isDeleted() {
		return this._isDeleted;
	}
	set isDeleted(e) {
		this._isDeleted = e;
	}
	checkDestroyed() {
		if (this.isDeleted)
			throw d.create("app-deleted", { appName: this._name });
	}
}
const Mt = ht;
function gt(e, t = {}) {
	let n = e;
	"object" != typeof t && (t = { name: t });
	const r = Object.assign({ name: v, automaticDataCollectionEnabled: !1 }, t),
		a = r.name;
	if ("string" != typeof a || !a)
		throw d.create("bad-app-name", { appName: String(a) });
	if ((n || (n = J()), !n)) throw d.create("no-options");
	const i = m.get(a);
	if (i) {
		if (O(n, i.options) && O(r, i.config)) return i;
		throw d.create("duplicate-app", { appName: a });
	}
	const s = new ye(a);
	for (const e of w.values()) s.addComponent(e);
	const o = new mt(n, r, s);
	return m.set(a, o), o;
}
function Nt(e = v) {
	const t = m.get(e);
	if (!t && e === v && J()) return gt();
	if (!t) throw d.create("no-app", { appName: e });
	return t;
}
function Lt() {
	return Array.from(m.values());
}
async function $t(e) {
	const t = e.name;
	m.has(t) &&
		(m.delete(t),
		await Promise.all(e.container.getProviders().map((e) => e.delete())),
		(e.isDeleted = !0));
}
function I(e, t, n) {
	var r;
	let a = null !== (r = dt[e]) && void 0 !== r ? r : e;
	n && (a += `-${n}`);
	const i = a.match(/\s|\//),
		s = t.match(/\s|\//);
	if (i || s) {
		const e = [`Unable to register library "${a}" with version "${t}":`];
		return (
			i &&
				e.push(
					`library name "${a}" contains illegal characters (whitespace or "/")`
				),
			i && s && e.push("and"),
			s &&
				e.push(
					`version name "${t}" contains illegal characters (whitespace or "/")`
				),
			void p.warn(e.join(" "))
		);
	}
	L(new D(`${a}-version`, () => ({ library: a, version: t }), "VERSION"));
}
function Rt(e, t) {
	if (null !== e && "function" != typeof e)
		throw d.create("invalid-log-argument");
	Ce(e, t);
}
function Ht(e) {
	Se(e);
}
const bt = "firebase-heartbeat-database",
	Et = 1,
	b = "firebase-heartbeat-store";
let B = null;
function q() {
	return (
		B ||
			(B = Re(bt, Et, {
				upgrade: (e, t) => {
					if (0 === t) e.createObjectStore(b);
				},
			}).catch((e) => {
				throw d.create("idb-open", { originalErrorMessage: e.message });
			})),
		B
	);
}
async function _t(e) {
	try {
		return await (await q()).transaction(b).objectStore(b).get(ee(e));
	} catch (e) {
		if (e instanceof E) p.warn(e.message);
		else {
			const t = d.create("idb-get", { originalErrorMessage: e?.message });
			p.warn(t.message);
		}
	}
}
async function U(e, t) {
	try {
		const n = (await q()).transaction(b, "readwrite");
		await n.objectStore(b).put(t, ee(e)), await n.done;
	} catch (e) {
		if (e instanceof E) p.warn(e.message);
		else {
			const t = d.create("idb-set", { originalErrorMessage: e?.message });
			p.warn(t.message);
		}
	}
}
function ee(e) {
	return `${e.name}!${e.options.appId}`;
}
const yt = 1024,
	It = 2592e6;
class Dt {
	constructor(e) {
		(this.container = e), (this._heartbeatsCache = null);
		const t = this.container.getProvider("app").getImmediate();
		(this._storage = new wt(t)),
			(this._heartbeatsCachePromise = this._storage
				.read()
				.then((e) => ((this._heartbeatsCache = e), e)));
	}
	async triggerHeartbeat() {
		const e = this.container
				.getProvider("platform-logger")
				.getImmediate()
				.getPlatformInfoString(),
			t = k();
		if (
			(null === this._heartbeatsCache &&
				(this._heartbeatsCache = await this._heartbeatsCachePromise),
			this._heartbeatsCache.lastSentHeartbeatDate !== t &&
				!this._heartbeatsCache.heartbeats.some((e) => e.date === t))
		)
			return (
				this._heartbeatsCache.heartbeats.push({ date: t, agent: e }),
				(this._heartbeatsCache.heartbeats =
					this._heartbeatsCache.heartbeats.filter((e) => {
						const t = new Date(e.date).valueOf();
						return Date.now() - t <= It;
					})),
				this._storage.overwrite(this._heartbeatsCache)
			);
	}
	async getHeartbeatsHeader() {
		if (
			(null === this._heartbeatsCache &&
				(await this._heartbeatsCachePromise),
			null === this._heartbeatsCache ||
				0 === this._heartbeatsCache.heartbeats.length)
		)
			return "";
		const e = k(),
			{ heartbeatsToSend: t, unsentEntries: n } = vt(
				this._heartbeatsCache.heartbeats
			),
			r = K(JSON.stringify({ version: 2, heartbeats: t }));
		return (
			(this._heartbeatsCache.lastSentHeartbeatDate = e),
			n.length > 0
				? ((this._heartbeatsCache.heartbeats = n),
					await this._storage.overwrite(this._heartbeatsCache))
				: ((this._heartbeatsCache.heartbeats = []),
					this._storage.overwrite(this._heartbeatsCache)),
			r
		);
	}
}
function k() {
	return new Date().toISOString().substring(0, 10);
}
function vt(e, t = yt) {
	const n = [];
	let r = e.slice();
	for (const a of e) {
		const e = n.find((e) => e.agent === a.agent);
		if (e) {
			if ((e.dates.push(a.date), z(n) > t)) {
				e.dates.pop();
				break;
			}
		} else if ((n.push({ agent: a.agent, dates: [a.date] }), z(n) > t)) {
			n.pop();
			break;
		}
		r = r.slice(1);
	}
	return { heartbeatsToSend: n, unsentEntries: r };
}
class wt {
	constructor(e) {
		(this.app = e),
			(this._canUseIndexedDBPromise =
				this.runIndexedDBEnvironmentCheck());
	}
	async runIndexedDBEnvironmentCheck() {
		return (
			!!fe() &&
			ue()
				.then(() => !0)
				.catch(() => !1)
		);
	}
	async read() {
		return (
			((await this._canUseIndexedDBPromise) && (await _t(this.app))) || {
				heartbeats: [],
			}
		);
	}
	async overwrite(e) {
		var t;
		if (await this._canUseIndexedDBPromise) {
			const n = await this.read();
			return U(this.app, {
				lastSentHeartbeatDate:
					null !== (t = e.lastSentHeartbeatDate) && void 0 !== t
						? t
						: n.lastSentHeartbeatDate,
				heartbeats: e.heartbeats,
			});
		}
	}
	async add(e) {
		var t;
		if (await this._canUseIndexedDBPromise) {
			const n = await this.read();
			return U(this.app, {
				lastSentHeartbeatDate:
					null !== (t = e.lastSentHeartbeatDate) && void 0 !== t
						? t
						: n.lastSentHeartbeatDate,
				heartbeats: [...n.heartbeats, ...e.heartbeats],
			});
		}
	}
}
function z(e) {
	return K(JSON.stringify({ version: 2, heartbeats: e })).length;
}
function St(e) {
	L(new D("platform-logger", (e) => new xe(e), "PRIVATE")),
		L(new D("heartbeat", (e) => new Dt(e), "PRIVATE")),
		I(N, V, e),
		I(N, V, "esm2017"),
		I("fire-js", "");
}
St("");
var Ct = "firebase",
	At = "10.5.2";
I(Ct, At, "app");
export {
	E as FirebaseError,
	Mt as SDK_VERSION,
	v as _DEFAULT_ENTRY_NAME,
	ft as _addComponent,
	Bt as _addOrOverwriteComponent,
	m as _apps,
	Tt as _clearComponents,
	w as _components,
	ut as _getProvider,
	L as _registerComponent,
	Ot as _removeServiceInstance,
	$t as deleteApp,
	Nt as getApp,
	Lt as getApps,
	gt as initializeApp,
	Rt as onLog,
	I as registerVersion,
	Ht as setLogLevel,
};

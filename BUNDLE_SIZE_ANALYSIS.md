# Bundle Size Analysis and Optimization Recommendations

This document provides a comprehensive analysis of the `col-cal` component bundle size and recommendations for achieving the 10 KB target.

## Current State Analysis

### Bundle Size Breakdown

| Metric | Current Value |
|--------|---------------|
| **Total bundle (minified)** | 64.06 KB |
| **Total bundle (gzipped)** | 15.90 KB |
| **Component code only (externalized Lit)** | 38.68 KB minified / 8.37 KB gzipped |
| **Lit framework overhead** | ~25.4 KB minified / ~7.5 KB gzipped |

### Source Code Composition

| Category | Size (bytes) |
|----------|-------------|
| Total source files | 56,906 |
| CSS styles (.css.ts files) | 11,467 |
| HTML templates (.html.ts files) | 11,273 |
| Logic files | 34,166 |

### Largest Files

1. `col-cal-popover.ts` - 8,505 bytes
2. `col-cal.ts` - 8,317 bytes
3. `col-cal.html.ts` - 5,189 bytes
4. `date.utils.ts` - 5,160 bytes
5. `col-cal-popover.css.ts` - 3,679 bytes
6. `col-cal-dates.ts` - 3,571 bytes

## Target Analysis

To achieve the **10 KB maximum** target, we have several interpretation options:

| Interpretation | Target | Gap from Current |
|----------------|--------|------------------|
| 10 KB minified (full bundle) | 10,240 bytes | -53.8 KB (84% reduction) |
| 10 KB minified (component only) | 10,240 bytes | -28.4 KB (74% reduction) |
| 10 KB gzipped (full bundle) | 10,240 bytes | -5.7 KB (36% reduction) |
| 10 KB gzipped (component only) | 10,240 bytes | +1.9 KB (already within target!) |

**Key Finding**: With Lit externalized, the component code is **8.37 KB gzipped**, which is already under the 10 KB target.

---

## Optimization Strategies

### Strategy 1: Externalize Lit (Recommended - Minimal Change)

**Impact**: Reduces bundle from 64 KB to 38.7 KB (minified), 15.9 KB to 8.4 KB (gzipped)

**How**: Configure Vite to treat Lit as an external dependency:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['lit', 'lit/decorators.js', 'lit/directives/ref.js'],
    }
  }
});
```

**Pros**:
- No code changes required
- Lit can be shared across multiple components on a page
- Consumers can use CDN-hosted Lit
- Achieves 10 KB gzipped target immediately

**Cons**:
- Consumers must include Lit separately
- Requires documentation update

### Strategy 2: Migrate to Vanilla Web Components

**Impact**: Could reduce to 5-15 KB total (minified)

**How**: Replace Lit with native Custom Elements API:

```javascript
// Before (Lit)
@customElement("col-cal-dates")
export class ColCalDates extends LitElement {
  @property({ type: Date }) month = null;
  render() { return html`...`; }
}

// After (Vanilla)
class ColCalDates extends HTMLElement {
  static get observedAttributes() { return ['month']; }
  connectedCallback() { this.render(); }
  render() { this.innerHTML = `...`; }
}
customElements.define('col-cal-dates', ColCalDates);
```

**Pros**:
- Zero framework dependency
- Maximum performance
- No build step required (optionally)

**Cons**:
- Significant rewrite effort
- Loss of Lit's reactive system
- Manual template updates required
- More boilerplate code

### Strategy 3: Use Lightweight Alternative Framework

**Potential Alternatives**:

| Framework | Size (minified+gzipped) | Notes |
|-----------|------------------------|-------|
| VanJS | ~1 KB | Ultra-minimal, no build step |
| Tonic | ~3 KB | Minimalist, audit-friendly |
| Atomico | ~3 KB | Hooks-based, functional API |
| Haunted | ~4 KB | React hooks for web components |
| slim.js | ~5 KB | Micro-framework |

**Impact**: Could reduce framework overhead from ~7.5 KB to ~1-5 KB gzipped

### Strategy 4: Code-Level Optimizations

#### 4.1 Remove Unused Code

The `col-cal.html.ts` file (5.2 KB) appears to be duplicating functionality that already exists in `col-cal.ts`. Consider removing if unused:

```bash
# Check if renderColCal is actually used
grep -r "renderColCal" src/
# Result: Not imported in col-cal.ts
```

#### 4.2 Reduce CSS Custom Properties

Current CSS files define ~50+ custom properties. Consider:
- Using CSS shorthand properties
- Removing unused custom properties
- Consolidating common variables into a shared file

#### 4.3 Simplify Template Literals

Many templates contain extensive `data-testid` attributes. Consider making test IDs opt-in:

```typescript
// Before
data-testid="${`${this.dataTestid}-Header-LeftButton`}"

// After (build-time removal for production)
${this.testMode ? `data-testid="${this.dataTestid}-Header-LeftButton"` : ''}
```

#### 4.4 Remove Duplicate Functions

The `subMonths` function calls `addMonths` with a negative value. This pattern can be optimized:

```typescript
// Current
export const subMonths = (date: Date, amount: number): Date => {
  return addMonths(date, -amount);
};

// Optimized: Inline at call sites or use addMonths(-1) directly
```

### Strategy 5: Build Optimizations

#### 5.1 Enable Advanced Minification

```typescript
// vite.config.ts
import terser from '@rollup/plugin-terser';

export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.warn'],
      },
      mangle: {
        properties: {
          regex: /^_/  // Mangle private properties
        }
      }
    }
  }
});
```

#### 5.2 Remove Decorators at Build Time

Lit decorators add overhead. Consider using static properties instead:

```typescript
// Before (with decorators)
@property({ type: String }) locale: string = "en-US";

// After (no decorators)
static properties = {
  locale: { type: String }
};
locale = "en-US";
```

This eliminates decorator transform code from the bundle.

---

## Recommended Action Plan

### Phase 1: Quick Wins (No breaking changes)

1. **Externalize Lit** - Achieves 8.4 KB gzipped (under 10 KB target)
2. **Remove unused code** - Remove `col-cal.html.ts` if unused
3. **Enable terser minification** - Additional 5-10% reduction

**Estimated Result**: ~8 KB gzipped component code

### Phase 2: Deeper Optimizations (Minor API changes)

1. **Remove decorator dependency** - Use static properties
2. **Make test IDs opt-in** - Reduces template size
3. **Consolidate CSS variables** - Reduce duplication

**Estimated Result**: ~6-7 KB gzipped component code

### Phase 3: Major Refactor (If 10 KB minified is required)

1. **Migrate to vanilla Web Components** OR
2. **Use VanJS/Tonic** (~1-3 KB framework)
3. **Code-split the popover** - Lazy load popover component

**Estimated Result**: ~10-15 KB minified total

---

## Conclusion

**The most practical approach is Strategy 1 (Externalize Lit)** because:

1. It achieves the 10 KB gzipped target immediately (8.37 KB)
2. Requires zero code changes
3. Aligns with modern bundler practices (peer dependencies)
4. Allows Lit to be shared across components

If the 10 KB target refers to minified (not gzipped) bundle size, then a more significant refactor would be required, potentially moving to vanilla Web Components or a micro-framework like VanJS.

---

## References

- [Lit Official Documentation](https://lit.dev/)
- [VanJS - 1.0kB Framework](https://vanjs.org/)
- [Open Web Components - Base Libraries](https://open-wc.org/guides/community/base-libraries/)
- [Vanilla Web Components](https://github.com/vanillawc)
- [Web Components Framework Comparison](https://coderpad.io/blog/development/web-components-101-framework-comparison/)

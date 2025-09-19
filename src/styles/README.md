# CSS Architecture Documentation

## Overview

This document outlines the CSS architecture and design system for the JEEPedia frontend application. Our approach focuses on consistency, maintainability, and scalability through the use of design tokens and modular CSS.

## File Structure

```
src/
├── styles/
│   ├── design-tokens.css     # Design system variables
│   └── README.md            # This file
├── app/
│   └── globals.css          # Global styles and imports
└── components/
    └── [component]/
        └── [component].module.css  # Component-specific styles
```

## Design System

### Design Tokens

Our design system is built on CSS custom properties (variables) defined in `src/styles/design-tokens.css`. This provides:

- **Consistency**: Unified color palette, spacing, and typography
- **Maintainability**: Single source of truth for design values
- **Theming**: Easy to implement theme switching
- **DX**: Better developer experience with semantic naming

### Token Categories

#### 1. Colors

- **Primary Brand**: `--color-primary-*` (gradients and brand colors)
- **Surfaces**: `--color-surface-*` (background colors for dark theme)
- **Borders**: `--color-border-*` (various border color variations)
- **Text**: `--color-text-*` (text color hierarchy)
- **Overlays**: `--color-overlay-*` (backdrop and overlay colors)
- **Glass**: `--color-glass-*` (glassmorphism effects)

#### 2. Spacing

- **Base Unit**: `--space-unit: 4px` (foundation for all spacing)
- **Scale**: `--space-1` through `--space-24` (mathematical scale)
- **Semantic**: `--space-xs`, `--space-sm`, etc. (contextual naming)

#### 3. Typography

- **Fonts**: `--font-primary`, `--font-mono`, `--font-impact`
- **Sizes**: `--text-xs` through `--text-5xl`
- **Weights**: `--font-thin` through `--font-black`
- **Spacing**: Letter spacing and line height values

#### 4. Component Dimensions

- **Heights**: Standard component heights (`--height-input`, etc.)
- **Widths**: Common width values
- **Radius**: Border radius scale (`--radius-sm` through `--radius-full`)

#### 5. Effects & Animation

- **Shadows**: Consistent shadow system
- **Transitions**: Predefined timing and easing
- **Z-index**: Layering system
- **Backdrop**: Blur effects

## CSS Module Conventions

### Naming Conventions

#### BEM-inspired Component Structure

```css
.componentName {
  /* Block */
}
.componentName__element {
  /* Element */
}
.componentName--modifier {
  /* Modifier */
}
.componentName.isActive {
  /* State */
}
```

#### State Classes

- Use `is*` prefix: `.isActive`, `.isOpen`, `.isDisabled`
- Use `has*` prefix: `.hasError`, `.hasIcon`

#### Utility Classes

- Keep minimal, prefer component-specific styles
- Use semantic names: `.visually-hidden`, `.sr-only`

### File Organization

Each component should have its CSS module organized as follows:

```css
/* Component base styles */
.componentName {
  /* Layout properties */
  /* Visual properties */
  /* Animation properties */
}

/* Element styles */
.componentName__element {
  /* ... */
}

/* Modifier styles */
.componentName--variant {
  /* ... */
}

/* State styles */
.componentName.isActive {
  /* ... */
}

/* Media queries */
@media (min-width: 768px) {
  .componentName {
    /* Responsive styles */
  }
}
```

## Migration Strategy

### Phase 1: Design Tokens ✅

- [x] Create design tokens file
- [x] Define color system
- [x] Define spacing system
- [x] Define typography system
- [x] Import tokens in globals.css

### Phase 2: Component Refactoring

- [ ] Identify components with duplicate styles
- [ ] Refactor components to use design tokens
- [ ] Remove hardcoded values
- [ ] Standardize naming conventions

### Phase 3: Optimization

- [ ] Remove unused styles
- [ ] Consolidate similar components
- [ ] Optimize bundle size
- [ ] Add CSS linting rules

## Usage Guidelines

### Using Design Tokens

✅ **Good**:

```css
.button {
  background: var(--color-surface-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-button);
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  transition: var(--transition-normal);
}
```

❌ **Bad**:

```css
.button {
  background: rgba(15, 15, 15, 1);
  border: 1px solid rgb(45, 45, 45);
  border-radius: 7px;
  padding: 8px 16px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  transition: all 0.2s ease;
}
```

### Color Usage

- Use semantic color names: `--color-surface-primary` instead of `--color-gray-900`
- Gradients should use defined gradient variables
- Opacity variations should use separate tokens

### Spacing

- Always use spacing tokens instead of hardcoded pixels
- Use semantic spacing (`--space-md`) for common cases
- Use numerical spacing (`--space-4`) for specific measurements

### Responsive Design

- Use design token breakpoints
- Mobile-first approach
- Prefer CSS Grid and Flexbox

```css
@media (min-width: var(--breakpoint-md)) {
  /* Tablet and desktop styles */
}
```

## Common Patterns

### Glassmorphism

```css
.glass-card {
  background: var(--color-glass-primary);
  backdrop-filter: var(--backdrop-blur-lg);
  border: 1px solid var(--color-border-muted);
  border-radius: var(--radius-card);
}
```

### Primary Button

```css
.primaryButton {
  background: var(--gradient-primary);
  color: var(--color-text-primary);
  border-radius: var(--radius-button);
  transition: var(--transition-normal);
}

.primaryButton:hover {
  transform: scale(0.98);
}
```

### Input Field

```css
.input {
  background: var(--color-surface-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-input);
  height: var(--height-input);
  padding: 0 var(--space-3);
  color: var(--color-text-secondary);
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  transition: var(--transition-normal);
}

.input:hover {
  background: var(--color-surface-tertiary);
  border-color: var(--color-border-secondary);
}

.input:focus {
  outline: 2px solid var(--color-primary-middle);
  outline-offset: 2px;
}
```

## Performance Considerations

- CSS custom properties have excellent browser support
- Minimal runtime overhead
- Better than CSS-in-JS for static values
- Enables better caching strategies

## Tools and Linting

Consider adding these tools for better CSS maintenance:

- **stylelint**: CSS linting
- **postcss**: CSS processing
- **css-tree-shake**: Remove unused styles
- **cssnano**: CSS minification

## Future Considerations

- **CSS-in-JS Migration**: For components requiring dynamic styling
- **CSS Container Queries**: For truly responsive components
- **CSS Cascade Layers**: Better specificity management
- **Design System Evolution**: Regular review and updates

---

**Last Updated**: September 19, 2025
**Version**: 1.0.0
**Contributors**: JEEPedia Team

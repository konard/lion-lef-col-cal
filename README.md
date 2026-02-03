# Col-Cal

A lightweight, HTML-friendly web component calendar.

## Bundle Size

| Metric | Size |
|--------|------|
| Component (minified) | 38.68 KB |
| Component (gzipped) | **8.37 KB** |

*Note: Lit is a peer dependency and not included in the bundle size above.*

## Installation

```sh
npm install col-cal lit
```

### Compile from source

```sh
git clone https://github.com/pksep/col-cal
cd col-cal
npm ci
npx vite build
```

## Usage

```html
<col-cal locale="en-US"></col-cal>
<script type="module">
  import "col-cal";
</script>
```

## Dependencies

- **Lit** (peer dependency): A lightweight library for building web components (~5 KB gzipped).

## Development

To develop this project, you can use the following commands:

### Start Development Server

Install bun

```sh
bun vite
```

### Build for Production

```sh
bun vite build
```
<!--
## Contributing
Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information
-->

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

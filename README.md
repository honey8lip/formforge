# formforge

Lightweight library for generating accessible HTML forms from JSON schema.

## Installation

```bash
npm install formforge
```

## Usage

Define your form structure as a JSON schema and let formforge handle the rest:

```javascript
import { forge } from 'formforge';

const schema = {
  title: 'Contact Us',
  fields: [
    { name: 'fullName', type: 'text', label: 'Full Name', required: true },
    { name: 'email', type: 'email', label: 'Email Address', required: true },
    { name: 'message', type: 'textarea', label: 'Message' }
  ]
};

const form = forge(schema);
document.getElementById('app').appendChild(form);
```

formforge automatically adds ARIA attributes, proper label associations, and semantic HTML to keep your forms accessible out of the box.

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `novalidate` | boolean | `false` | Disable native browser validation |
| `className` | string | `''` | CSS class applied to the form element |
| `onSubmit` | function | `null` | Callback fired on form submission |

## License

[MIT](LICENSE)
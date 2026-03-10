# DynamicForm

A config-driven dynamic form engine built with React, TypeScript, Formik, Zod, and MUI.

Forms are defined as plain JSON/TypeScript config objects — no form JSX required. The engine handles rendering, validation, conditional visibility, and field state sync automatically.

---

## Tech Stack

| Layer             | Library                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| UI                | [MUI v7](https://mui.com/)                                                                             |
| Forms             | [Formik](https://formik.org/)                                                                          |
| Validation        | [Zod v4](https://zod.dev/)                                                                             |
| Conditional logic | [json-logic-js](https://jsonlogic.com/)                                                                |
| Date picker       | [MUI X Date Pickers](https://mui.com/x/react-date-pickers/) + [Day.js](https://day.js.org/)            |
| Tests             | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)                        |
| Linting           | [ESLint](https://eslint.org/) + [typescript-eslint](https://typescript-eslint.io/)                     |
| Formatting        | [Prettier](https://prettier.io/)                                                                       |
| Pre-commit        | [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) |
| Deploy            | AWS S3 via GitHub Actions                                                                              |

---

## Getting Started

```bash
npm install
npm run dev
```

---

## Scripts

| Script                  | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `npm run dev`           | Start dev server                                 |
| `npm run build`         | Type-check + production build                    |
| `npm test`              | Run all tests once                               |
| `npm run test:watch`    | Run tests in watch mode                          |
| `npm run test:coverage` | Run tests with coverage report                   |
| `npm run lint`          | Lint and auto-fix                                |
| `npm run format`        | Format all files with Prettier                   |
| `npm run format:check`  | Check formatting without writing                 |
| `npm run setup:bucket`  | Create/configure the S3 bucket (requires `.env`) |

---

## Form Config

Forms are defined with a `FormConfig` object:

```ts
const config: FormConfig = {
  id: 'my_form',
  title: 'My Form',
  fields: [
    {
      name: 'email',
      type: FieldDataType.Text,
      ui: { label: 'Email', widget: WidgetType.Input, inputType: InputType.Email },
      validation: { required: true, email: true },
    },
  ],
}
```

Pass it to `<FormDynamic>`:

```tsx
<FormDynamic config={config} onSubmit={(values) => console.log(values)} />
```

---

## Widgets

| Widget          | `WidgetType` |
| --------------- | ------------ |
| Text input      | `Input`      |
| Textarea        | `Textarea`   |
| Number          | `Number`     |
| Select dropdown | `Select`     |
| Radio group     | `RadioGroup` |
| Checkbox        | `Checkbox`   |
| Date picker     | `DatePicker` |

---

## Validation

Set a `validation` key on any field:

```ts
validation: {
  required: true,                          // or a custom message string
  email: true,
  minLength: 3,                            // or { value: 3, message: '...' }
  maxLength: 100,
  min: 0,
  max: 999,
  pattern: '^[A-Z]+$',                     // or { value: '...', message: '...' }
  minDate: '2024-01-01',
  maxDate: '2026-12-31',
}
```

---

## Conditional Logic

Fields support `logic.visibleIf` using [json-logic-js](https://jsonlogic.com/) rules. Fields hidden by logic are excluded from the submitted values.

```ts
logic: {
  visibleIf: { '==': [{ var: 'role' }, 'admin'] }
}
```

Select/Radio options also support per-option `logic.visibleIf` to filter available choices based on other field values.

---

## Project Structure

```
src/
  components/
    FormDynamic/          # Core form engine
      utils/              # buildInitialValues, buildValidationSchema, renderFields, syncFieldState, validate
    FormWidgets/          # Individual MUI widget components
  contracts/              # TypeScript types and enums
  mocks/                  # Example form configs
  pages/
    FormExamples/         # Live demo page
  _utils/                 # Shared utilities (evaluateLogic, areEqual)
```

---

## Deployment

The app deploys to AWS S3 static hosting on every push to `main` via GitHub Actions.

### Required GitHub Secrets

| Secret                  | Description                 |
| ----------------------- | --------------------------- |
| `AWS_ACCESS_KEY_ID`     | IAM user access key         |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key         |
| `AWS_REGION`            | e.g. `eu-central-1`         |
| `S3_BUCKET_NAME`        | Globally unique bucket name |

The pipeline runs: **install → test → lint → format check → build → create bucket → deploy**.

### Local bucket setup

```bash
cp .env.example .env   # fill in your AWS credentials
npm run setup:bucket
```

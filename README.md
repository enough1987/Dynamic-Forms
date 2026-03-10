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

---

## Loading a Config from a JSON File

The live demo includes a **Custom** tab that lets you load any `.json` config file from disk and instantly render the form — no code changes needed.

### How it works

1. Select **Custom — paste your own config** in the demo.
2. Click **Choose JSON file…** and pick a `.json` file.
3. The file is parsed client-side and the form renders immediately on the left.

### JSON format

JSON configs use the same structure as TypeScript configs. Field `type` and `ui.widget` values are the **string equivalents** of the TypeScript enums:

| TypeScript               | JSON string     |
| ------------------------ | --------------- |
| `FieldDataType.Text`     | `"text"`        |
| `FieldDataType.Integer`  | `"integer"`     |
| `FieldDataType.DateTime` | `"datetime"`    |
| `WidgetType.Input`       | `"input"`       |
| `WidgetType.Select`      | `"select"`      |
| `WidgetType.Textarea`    | `"textarea"`    |
| `WidgetType.Number`      | `"number"`      |
| `WidgetType.Checkbox`    | `"checkbox"`    |
| `WidgetType.RadioGroup`  | `"radio-group"` |
| `WidgetType.DatePicker`  | `"datepicker"`  |
| `InputType.Email`        | `"email"`       |
| `InputType.Url`          | `"url"`         |

> The demo also accepts the TypeScript enum name strings (e.g. `"WidgetType.Select"`) and normalises them automatically.

### Example — `src/mocks/custom.json`

```json
{
  "id": "job_application",
  "title": "Job Application",
  "fields": [
    {
      "name": "role",
      "type": "text",
      "ui": {
        "label": "Role Applied For",
        "widget": "select",
        "placeholder": "Select a role…"
      },
      "validation": { "required": true },
      "options": [
        { "value": "frontend", "label": "Frontend Engineer" },
        { "value": "backend", "label": "Backend Engineer" },
        { "value": "fullstack", "label": "Fullstack Engineer" }
      ]
    },
    {
      "name": "employment_type",
      "type": "text",
      "ui": { "label": "Employment Type", "widget": "radio-group" },
      "validation": { "required": true },
      "options": [
        { "value": "full_time", "label": "Full-time" },
        { "value": "part_time", "label": "Part-time" },
        { "value": "contract", "label": "Contract" }
      ]
    },
    {
      "name": "years_experience",
      "type": "integer",
      "ui": {
        "label": "Years of Experience",
        "widget": "number",
        "helpText": "Total professional experience in years."
      },
      "validation": { "required": true, "min": 0, "max": 40 }
    },
    {
      "name": "senior_summary",
      "type": "text",
      "ui": {
        "label": "Senior Experience Summary",
        "widget": "textarea",
        "helpText": "Required for 5+ years experience."
      },
      "validation": { "required": true, "minLength": 20, "maxLength": 600 },
      "logic": { "visibleIf": { ">=": [{ "var": "years_experience" }, 5] } }
    },
    {
      "name": "salary_expectation",
      "type": "integer",
      "ui": {
        "label": "Salary Expectation (USD / year)",
        "widget": "number"
      },
      "validation": { "required": true, "min": 0 },
      "logic": {
        "visibleIf": { "in": [{ "var": "employment_type" }, ["full_time", "contract"]] }
      }
    },
    {
      "name": "cover_letter",
      "type": "text",
      "ui": {
        "label": "Cover Letter",
        "widget": "textarea",
        "helpText": "Required. Between 100 and 1000 characters."
      },
      "validation": { "required": true, "minLength": 100, "maxLength": 1000 }
    }
  ]
}
```

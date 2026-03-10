import { FieldDataType, WidgetType } from '@/contracts/enums'
import type { FormConfig } from '@/contracts/field.types'

export const formConfig: FormConfig = {
  id: 'team_assignment',
  title: 'Sprint Team Assignment',
  fields: [
    {
      name: 'project_lead',
      type: FieldDataType.Text,
      ui: { label: 'Project Lead', widget: WidgetType.Select, placeholder: 'Select a project lead…' },
      validation: { required: true },
      options: [
        { value: 'alice', label: 'Alice Chen',  logic: { visibleIf: { and: [{ '!=': [{ var: 'technical_lead' }, 'alice'] }, { '!=': [{ var: 'qa_lead' }, 'alice'] }] } } },
        { value: 'bob',   label: 'Bob Smith',   logic: { visibleIf: { and: [{ '!=': [{ var: 'technical_lead' }, 'bob']   }, { '!=': [{ var: 'qa_lead' }, 'bob']   }] } } },
        { value: 'carol', label: 'Carol Davis', logic: { visibleIf: { and: [{ '!=': [{ var: 'technical_lead' }, 'carol'] }, { '!=': [{ var: 'qa_lead' }, 'carol'] }] } } },
        { value: 'dave',  label: 'Dave Wilson', logic: { visibleIf: { and: [{ '!=': [{ var: 'technical_lead' }, 'dave']  }, { '!=': [{ var: 'qa_lead' }, 'dave']  }] } } },
      ],
    },
    {
      name: 'technical_lead',
      type: FieldDataType.Text,
      ui: { label: 'Technical Lead', widget: WidgetType.Select, placeholder: 'Select a technical lead…' },
      validation: { required: true },
      options: [
        { value: 'alice', label: 'Alice Chen',  logic: { visibleIf: { and: [{ '!=': [{ var: 'project_lead' }, 'alice'] }, { '!=': [{ var: 'qa_lead' }, 'alice'] }] } } },
        { value: 'bob',   label: 'Bob Smith',   logic: { visibleIf: { and: [{ '!=': [{ var: 'project_lead' }, 'bob']   }, { '!=': [{ var: 'qa_lead' }, 'bob']   }] } } },
        { value: 'carol', label: 'Carol Davis', logic: { visibleIf: { and: [{ '!=': [{ var: 'project_lead' }, 'carol'] }, { '!=': [{ var: 'qa_lead' }, 'carol'] }] } } },
        { value: 'dave',  label: 'Dave Wilson', logic: { visibleIf: { and: [{ '!=': [{ var: 'project_lead' }, 'dave']  }, { '!=': [{ var: 'qa_lead' }, 'dave']  }] } } },
      ],
    },
    {
      name: 'qa_lead',
      type: FieldDataType.Text,
      ui: { label: 'QA Lead', widget: WidgetType.Select, placeholder: 'Select a QA lead…' },
      validation: { required: true },
      options: [
        { value: 'alice', label: 'Alice Chen',  logic: { visibleIf: { and: [{ '!=': [{ var: 'project_lead' }, 'alice'] }, { '!=': [{ var: 'technical_lead' }, 'alice'] }] } } },
        { value: 'bob',   label: 'Bob Smith',   logic: { visibleIf: { and: [{ '!=': [{ var: 'project_lead' }, 'bob']   }, { '!=': [{ var: 'technical_lead' }, 'bob']   }] } } },
        { value: 'carol', label: 'Carol Davis', logic: { visibleIf: { and: [{ '!=': [{ var: 'project_lead' }, 'carol'] }, { '!=': [{ var: 'technical_lead' }, 'carol'] }] } } },
        { value: 'dave',  label: 'Dave Wilson', logic: { visibleIf: { and: [{ '!=': [{ var: 'project_lead' }, 'dave']  }, { '!=': [{ var: 'technical_lead' }, 'dave']  }] } } },
      ],
    },
    {
      name: 'sprint_start',
      type: FieldDataType.DateTime,
      ui: { label: 'Sprint Start Date', widget: WidgetType.DatePicker },
      validation: { required: true },
    },
    {
      name: 'team_size',
      type: FieldDataType.Integer,
      ui: { label: 'Team Size', widget: WidgetType.Number, helpText: 'Minimum 3 people, maximum 12.' },
      validation: { required: true, min: 3, max: 12 },
    },
    {
      name: 'notes',
      type: FieldDataType.Text,
      ui: { label: 'Large Team Notes', widget: WidgetType.Textarea, helpText: 'Required when the team has 8 or more members.' },
      validation: { required: true, minLength: 10 },
      logic: { visibleIf: { '>=': [{ var: 'team_size' }, 8] } },
    },
  ],
}

export const formConfig2: FormConfig = {
  id: 'shipping_location',
  title: 'Shipping Location',
  fields: [
    // ── Level 1 — Region ────────────────────────────────────────────────────
    {
      name: 'region',
      type: FieldDataType.Text,
      ui: { label: 'Region', widget: WidgetType.Select, placeholder: 'Select a region…' },
      validation: { required: true },
      options: [
        { value: 'europe',   label: 'Europe' },
        { value: 'americas', label: 'The Americas' },
        { value: 'asia',     label: 'Asia Pacific' },
      ],
    },

    // ── Level 2 — Country ───────────────────────────────────────────────────
    {
      name: 'country',
      type: FieldDataType.Text,
      ui: { label: 'Country', widget: WidgetType.Select, placeholder: 'Select a country…' },
      validation: { required: true },
      logic: { visibleIf: { '!!': [{ var: 'region' }] } },
      options: [
        { value: 'fr', label: 'France',         logic: { visibleIf: { '==': [{ var: 'region' }, 'europe'] } } },
        { value: 'de', label: 'Germany',        logic: { visibleIf: { '==': [{ var: 'region' }, 'europe'] } } },
        { value: 'uk', label: 'United Kingdom', logic: { visibleIf: { '==': [{ var: 'region' }, 'europe'] } } },
        { value: 'us', label: 'United States',  logic: { visibleIf: { '==': [{ var: 'region' }, 'americas'] } } },
        { value: 'ca', label: 'Canada',         logic: { visibleIf: { '==': [{ var: 'region' }, 'americas'] } } },
        { value: 'br', label: 'Brazil',         logic: { visibleIf: { '==': [{ var: 'region' }, 'americas'] } } },
        { value: 'jp', label: 'Japan',          logic: { visibleIf: { '==': [{ var: 'region' }, 'asia'] } } },
        { value: 'au', label: 'Australia',      logic: { visibleIf: { '==': [{ var: 'region' }, 'asia'] } } },
        { value: 'sg', label: 'Singapore',      logic: { visibleIf: { '==': [{ var: 'region' }, 'asia'] } } },
      ],
    },

    // ── Level 3 — City ──────────────────────────────────────────────────────
    {
      name: 'city',
      type: FieldDataType.Text,
      ui: { label: 'City', widget: WidgetType.Select, placeholder: 'Select a city…' },
      validation: { required: true },
      logic: { visibleIf: { '!!': [{ var: 'country' }] } },
      options: [
        { value: 'paris',          label: 'Paris',           logic: { visibleIf: { '==': [{ var: 'country' }, 'fr'] } } },
        { value: 'lyon',           label: 'Lyon',            logic: { visibleIf: { '==': [{ var: 'country' }, 'fr'] } } },
        { value: 'marseille',      label: 'Marseille',       logic: { visibleIf: { '==': [{ var: 'country' }, 'fr'] } } },
        { value: 'berlin',         label: 'Berlin',          logic: { visibleIf: { '==': [{ var: 'country' }, 'de'] } } },
        { value: 'munich',         label: 'Munich',          logic: { visibleIf: { '==': [{ var: 'country' }, 'de'] } } },
        { value: 'hamburg',        label: 'Hamburg',         logic: { visibleIf: { '==': [{ var: 'country' }, 'de'] } } },
        { value: 'london',         label: 'London',          logic: { visibleIf: { '==': [{ var: 'country' }, 'uk'] } } },
        { value: 'manchester',     label: 'Manchester',      logic: { visibleIf: { '==': [{ var: 'country' }, 'uk'] } } },
        { value: 'new_york',       label: 'New York',        logic: { visibleIf: { '==': [{ var: 'country' }, 'us'] } } },
        { value: 'san_francisco',  label: 'San Francisco',   logic: { visibleIf: { '==': [{ var: 'country' }, 'us'] } } },
        { value: 'chicago',        label: 'Chicago',         logic: { visibleIf: { '==': [{ var: 'country' }, 'us'] } } },
        { value: 'toronto',        label: 'Toronto',         logic: { visibleIf: { '==': [{ var: 'country' }, 'ca'] } } },
        { value: 'vancouver',      label: 'Vancouver',       logic: { visibleIf: { '==': [{ var: 'country' }, 'ca'] } } },
        { value: 'sao_paulo',      label: 'São Paulo',       logic: { visibleIf: { '==': [{ var: 'country' }, 'br'] } } },
        { value: 'rio',            label: 'Rio de Janeiro',  logic: { visibleIf: { '==': [{ var: 'country' }, 'br'] } } },
        { value: 'tokyo',          label: 'Tokyo',           logic: { visibleIf: { '==': [{ var: 'country' }, 'jp'] } } },
        { value: 'osaka',          label: 'Osaka',           logic: { visibleIf: { '==': [{ var: 'country' }, 'jp'] } } },
        { value: 'sydney',         label: 'Sydney',          logic: { visibleIf: { '==': [{ var: 'country' }, 'au'] } } },
        { value: 'melbourne',      label: 'Melbourne',       logic: { visibleIf: { '==': [{ var: 'country' }, 'au'] } } },
        { value: 'singapore_city', label: 'Singapore City',  logic: { visibleIf: { '==': [{ var: 'country' }, 'sg'] } } },
      ],
    },

    // ── Level 4 — Shipping Method ────────────────────────────────────────────
    {
      name: 'shipping_method',
      type: FieldDataType.Text,
      ui: { label: 'Shipping Method', widget: WidgetType.Select, placeholder: 'Choose shipping…' },
      validation: { required: true },
      logic: { visibleIf: { '!!': [{ var: 'city' }] } },
      options: [
        { value: 'standard',  label: 'Standard (5–7 business days)' },
        { value: 'express',   label: 'Express (2–3 business days)' },
        {
          value: 'overnight',
          label: 'Overnight (next business day)',
          logic: {
            visibleIf: {
              in: [{ var: 'city' }, ['paris', 'london', 'new_york', 'san_francisco', 'tokyo', 'sydney']],
            },
          },
        },
      ],
    },

    // ── Address Notes ────────────────────────────────────────────────────────
    {
      name: 'address_notes',
      type: FieldDataType.Text,
      ui: {
        label: 'Delivery Instructions',
        widget: WidgetType.Textarea,
        placeholder: 'Gate code, floor number, special instructions…',
        helpText: 'Optional — 200 characters max.',
      },
      validation: { maxLength: 200 },
      logic: { visibleIf: { '!!': [{ var: 'shipping_method' }] } },
    },
  ],
}

export const formConfig3: FormConfig = {
  id: 'passenger_manifest',
  title: 'Passenger Details',
  fields: [
    // ── Adults ──────────────────────────────────────────────────────────────
    {
      name: 'adult_count',
      type: FieldDataType.Integer,
      ui: { label: 'Number of Adults', widget: WidgetType.Number, helpText: 'At least one adult must travel.' },
      validation: { required: true, min: 1, max: 9 },
    },

    // ── Gate 1 — children ───────────────────────────────────────────────────
    {
      name: 'has_kids',
      type: FieldDataType.Text,
      ui: { label: 'Travelling with children? (under 18)', widget: WidgetType.Checkbox },
    },
    {
      name: 'kids_count',
      type: FieldDataType.Integer,
      ui: { label: 'Number of Children', widget: WidgetType.Number, helpText: 'Enter how many children are travelling (max 6).' },
      validation: { required: true, min: 1, max: 6 },
      logic: { visibleIf: { '==': [{ var: 'has_kids' }, true] } },
    },

    // ── Individual child ages ────────────────────────────────────────────────
    {
      name: 'kid_1_age',
      type: FieldDataType.Integer,
      ui: { label: 'Child 1 — Age', widget: WidgetType.Number, helpText: '0 = infant (under 2 years).' },
      validation: { required: true, min: 0, max: 17 },
      logic: { visibleIf: { and: [{ '==': [{ var: 'has_kids' }, true] }, { '>=': [{ var: 'kids_count' }, 1] }] } },
    },
    {
      name: 'kid_2_age',
      type: FieldDataType.Integer,
      ui: { label: 'Child 2 — Age', widget: WidgetType.Number },
      validation: { required: true, min: 0, max: 17 },
      logic: { visibleIf: { and: [{ '==': [{ var: 'has_kids' }, true] }, { '>=': [{ var: 'kids_count' }, 2] }] } },
    },
    {
      name: 'kid_3_age',
      type: FieldDataType.Integer,
      ui: { label: 'Child 3 — Age', widget: WidgetType.Number },
      validation: { required: true, min: 0, max: 17 },
      logic: { visibleIf: { and: [{ '==': [{ var: 'has_kids' }, true] }, { '>=': [{ var: 'kids_count' }, 3] }] } },
    },
    {
      name: 'kid_4_age',
      type: FieldDataType.Integer,
      ui: { label: 'Child 4 — Age', widget: WidgetType.Number },
      validation: { required: true, min: 0, max: 17 },
      logic: { visibleIf: { and: [{ '==': [{ var: 'has_kids' }, true] }, { '>=': [{ var: 'kids_count' }, 4] }] } },
    },
    {
      name: 'kid_5_age',
      type: FieldDataType.Integer,
      ui: { label: 'Child 5 — Age', widget: WidgetType.Number },
      validation: { required: true, min: 0, max: 17 },
      logic: { visibleIf: { and: [{ '==': [{ var: 'has_kids' }, true] }, { '>=': [{ var: 'kids_count' }, 5] }] } },
    },
    {
      name: 'kid_6_age',
      type: FieldDataType.Integer,
      ui: { label: 'Child 6 — Age', widget: WidgetType.Number },
      validation: { required: true, min: 0, max: 17 },
      logic: { visibleIf: { and: [{ '==': [{ var: 'has_kids' }, true] }, { '>=': [{ var: 'kids_count' }, 6] }] } },
    },

    // ── Gate 2 — special assistance ─────────────────────────────────────────
    {
      name: 'needs_assistance',
      type: FieldDataType.Text,
      ui: { label: 'Does anyone in your group need special assistance?', widget: WidgetType.Checkbox },
    },
    {
      name: 'assistance_types',
      type: FieldDataType.Text,
      ui: { label: 'Type of Assistance Required', widget: WidgetType.Select, placeholder: 'Select the primary need…' },
      validation: { required: true },
      logic: { visibleIf: { '==': [{ var: 'needs_assistance' }, true] } },
      options: [
        { value: 'wheelchair', label: 'Wheelchair / Mobility Aid' },
        { value: 'visual',     label: 'Visual Impairment Support' },
        { value: 'hearing',    label: 'Hearing Impairment Support' },
        { value: 'dietary',    label: 'Medical Dietary Requirement' },
        {
          value: 'infant',
          label: 'Infant / Bassinet Request',
          logic: {
            visibleIf: {
              or: [
                { '==': [{ var: 'kid_1_age' }, 0] },
                { '==': [{ var: 'kid_2_age' }, 0] },
                { '==': [{ var: 'kid_3_age' }, 0] },
                { '==': [{ var: 'kid_4_age' }, 0] },
                { '==': [{ var: 'kid_5_age' }, 0] },
                { '==': [{ var: 'kid_6_age' }, 0] },
              ],
            },
          },
        },
      ],
    },
    {
      name: 'assistance_notes',
      type: FieldDataType.Text,
      ui: {
        label: 'Assistance Notes',
        widget: WidgetType.Textarea,
        placeholder: 'Any additional details for ground crew…',
        helpText: 'Optional — 500 characters max.',
      },
      validation: { maxLength: 500 },
      logic: { visibleIf: { '!!': [{ var: 'assistance_types' }] } },
    },

    // ── Meal preference ──────────────────────────────────────────────────────
    {
      name: 'meal_preference',
      type: FieldDataType.Text,
      ui: { label: 'Meal Preference', widget: WidgetType.Select, placeholder: 'Select a meal…' },
      validation: { required: true },
      options: [
        { value: 'standard',    label: 'Standard' },
        { value: 'vegetarian',  label: 'Vegetarian' },
        { value: 'vegan',       label: 'Vegan' },
        { value: 'halal',       label: 'Halal' },
        { value: 'kosher',      label: 'Kosher' },
        { value: 'gluten_free', label: 'Gluten-Free' },
      ],
    },
    {
      name: 'meal_note',
      type: FieldDataType.Text,
      ui: {
        label: 'Meal Allergy / Requirement Note',
        widget: WidgetType.Textarea,
        placeholder: 'Describe any allergies or specific requirements…',
        helpText: 'Required for non-standard meals. Maximum 300 characters.',
      },
      validation: { required: true, minLength: 5, maxLength: 300 },
      logic: {
        visibleIf: {
          and: [
            { '!!': [{ var: 'meal_preference' }] },
            { '!=': [{ var: 'meal_preference' }, 'standard'] },
          ],
        },
      },
    },
  ],
}

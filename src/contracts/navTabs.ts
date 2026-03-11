import { lazy } from 'react'

export const ROUTING = [
  {
    to: '/',
    label: 'Dynamic Form Example',
    element: lazy(() => import('@/pages/FormExamples').then((m) => ({ default: m.FormExamples }))),
  },
  {
    to: '/query-builder',
    label: 'Query Builder Example',
    element: lazy(() => import('@/pages/QueryBuilderExample').then((m) => ({ default: m.QueryBuilderExample }))),
  },
]

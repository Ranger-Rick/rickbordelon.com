import type { Component } from 'vue'

export type SectionAlignment = 'left' | 'center' | 'right'

export type SectionBodyItem = string

export type SectionLinks = Array<{
  label: string
  href: string
}>

export type Section = {
  id: string
  component: Component
  title?: string
  align?: SectionAlignment
  body?: SectionBodyItem[]
  links?: SectionLinks
  image?: string
  imageAlt?: string
}

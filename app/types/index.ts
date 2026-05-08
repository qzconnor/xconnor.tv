export interface Skill {
  id: string
  name: string
  level: 1 | 2 | 3 | 4 | 5
  category: string
  icon?: string
  color?: string
  enabled?: boolean
}

export interface Tool {
  id: string
  name: string
  category: string
  icon?: string
  description?: string
  url?: string
  enabled?: boolean
}

export interface Experience {
  id: string
  company: string
  role: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
  technologies: string[]
  location?: string
  logo?: string
  enabled?: boolean
}

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  url?: string
  repo?: string
  color?: string
  featured?: boolean
  enabled?: boolean
}

export interface Contact {
  id: string
  label: string
  value: string
  href: string
  icon: string
  colorPreset: string
}

export interface ToolCategory {
  id: string
  value: string
  labelEn: string
  labelDe: string
}

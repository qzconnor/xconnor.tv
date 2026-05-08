export default defineNitroPlugin(async () => {
  const storage = useStorage('data')

  const hasSkills = await storage.hasItem('skills')
  if (!hasSkills) {
    await storage.setItem('skills', [
      { id: '1', name: 'Vue.js', level: 5, category: 'frontend', icon: 'vue', color: '#4FC08D' },
      { id: '2', name: 'Nuxt.js', level: 5, category: 'frontend', icon: 'nuxt', color: '#00DC82' },
      { id: '3', name: 'TypeScript', level: 4, category: 'frontend', icon: 'typescript', color: '#3178C6' },
      { id: '4', name: 'Node.js', level: 4, category: 'backend', icon: 'nodejs', color: '#339933' },
      { id: '5', name: 'React', level: 3, category: 'frontend', icon: 'react', color: '#61DAFB' },
      { id: '6', name: 'PostgreSQL', level: 3, category: 'database', icon: 'postgresql', color: '#336791' },
      { id: '7', name: 'Docker', level: 3, category: 'devops', icon: 'docker', color: '#2496ED' },
      { id: '8', name: 'Tailwind CSS', level: 5, category: 'frontend', icon: 'tailwindcss', color: '#38B2AC' },
      { id: '9', name: 'Git', level: 4, category: 'devops', icon: 'git', color: '#F05032' },
      { id: '10', name: 'Python', level: 3, category: 'backend', icon: 'python', color: '#3776AB' },
    ])
  }

  const hasTools = await storage.hasItem('tools')
  if (!hasTools) {
    await storage.setItem('tools', [
      { id: '1', name: 'VS Code', category: 'editor', icon: 'vscode', description: 'Primärer Code-Editor' },
      { id: '2', name: 'Figma', category: 'design', icon: 'figma', description: 'UI/UX Design' },
      { id: '3', name: 'GitHub', category: 'vcs', icon: 'github', description: 'Versionskontrolle & Kollaboration' },
      { id: '4', name: 'Vercel', category: 'deployment', icon: 'vercel', description: 'Deployment & Hosting' },
      { id: '5', name: 'Postman', category: 'api', icon: 'postman', description: 'API Testing' },
      { id: '6', name: 'Notion', category: 'productivity', icon: 'notion', description: 'Projektmanagement & Notizen' },
      { id: '7', name: 'Warp', category: 'terminal', icon: 'warp', description: 'Modernes Terminal' },
      { id: '8', name: 'TablePlus', category: 'database', icon: 'tableplus', description: 'Datenbankverwaltung' },
    ])
  }

  const hasExperience = await storage.hasItem('experience')
  if (!hasExperience) {
    await storage.setItem('experience', [
      {
        id: '1',
        company: 'Freelance',
        role: 'Full-Stack Developer',
        startDate: '2023-01',
        current: true,
        description: 'Entwicklung moderner Webanwendungen für verschiedene Kunden. Spezialisiert auf Vue.js/Nuxt.js und Node.js Backends.',
        technologies: ['Vue.js', 'Nuxt.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'PostgreSQL'],
        location: 'Remote',
      },
    ])
  }

  const hasProjects = await storage.hasItem('projects')
  if (!hasProjects) {
    await storage.setItem('projects', [
      {
        id: '1',
        title: 'xconnor.tv Portfolio',
        description: 'Mein persönliches Portfolio – gebaut mit Nuxt 4, Tailwind CSS und einem Admin-Panel zur Inhaltsverwaltung.',
        tags: ['Nuxt', 'Vue.js', 'TypeScript', 'Tailwind CSS'],
        repo: 'https://github.com/xconnortv/xconnor.tv',
        url: 'https://xconnor.tv',
        color: '#00DC82',
        featured: true,
        enabled: true,
      },
    ])
  }

  const rawCats = await storage.getItem<any>('tool-categories')
  if (!Array.isArray(rawCats) || !rawCats[0]?.labelEn) {
    await storage.setItem('tool-categories', [
      { id: '1',  value: 'lang',         labelEn: 'Programming Language', labelDe: 'Programmiersprache' },
      { id: '2',  value: 'framework',    labelEn: 'Framework',            labelDe: 'Framework' },
      { id: '3',  value: 'library',      labelEn: 'Library',              labelDe: 'Bibliothek' },
      { id: '4',  value: 'editor',       labelEn: 'Editor',               labelDe: 'Editor' },
      { id: '5',  value: 'design',       labelEn: 'Design',               labelDe: 'Design' },
      { id: '6',  value: 'vcs',          labelEn: 'Version Control',      labelDe: 'Versionskontrolle' },
      { id: '7',  value: 'deployment',   labelEn: 'Deployment',           labelDe: 'Deployment' },
      { id: '8',  value: 'cloud',        labelEn: 'Cloud',                labelDe: 'Cloud' },
      { id: '9',  value: 'devops',       labelEn: 'DevOps',               labelDe: 'DevOps' },
      { id: '10', value: 'api',          labelEn: 'API',                  labelDe: 'API' },
      { id: '11', value: 'database',     labelEn: 'Database',             labelDe: 'Datenbank' },
      { id: '12', value: 'testing',      labelEn: 'Testing',              labelDe: 'Testing' },
      { id: '13', value: 'mobile',       labelEn: 'Mobile',               labelDe: 'Mobile' },
      { id: '14', value: 'os',           labelEn: 'Operating System',     labelDe: 'Betriebssystem' },
      { id: '15', value: 'productivity', labelEn: 'Productivity',         labelDe: 'Produktivität' },
      { id: '16', value: 'terminal',     labelEn: 'Terminal',             labelDe: 'Terminal' },
      { id: '17', value: 'security',     labelEn: 'Security',             labelDe: 'Sicherheit' },
      { id: '18', value: 'other',        labelEn: 'Other',                labelDe: 'Sonstiges' },
    ])
  }

  const hasContacts = await storage.hasItem('contacts')
  if (!hasContacts) {
    await storage.setItem('contacts', [
      { id: '1', label: 'GitHub', value: '@xconnortv', href: 'https://github.com/xconnortv', icon: 'Github', colorPreset: 'purple' },
      { id: '2', label: 'E-Mail', value: 'connor@xconnor.tv', href: 'mailto:connor@xconnor.tv', icon: 'Mail', colorPreset: 'primary' },
      { id: '3', label: 'Twitter / X', value: '@xConnorTV', href: 'https://twitter.com/xConnorTV', icon: 'Twitter', colorPreset: 'sky' },
      { id: '4', label: 'LinkedIn', value: 'Connor Breuer', href: 'https://linkedin.com/in/connor-breuer', icon: 'Linkedin', colorPreset: 'blue' },
    ])
  }
})

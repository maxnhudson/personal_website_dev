import AboutSection from '@/components/AboutSection.vue'
import SkillsSection from '@/components/SkillsSection.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import ContactSection from '@/components/ContactSection.vue'

// Single source of truth for the page sections. The navbar in App.vue and the
// section list in HomeView both read from here, so ids can't drift apart.
const sectionComponents = {
  AboutSection,
  SkillsSection,
  ProjectsSection,
  ContactSection
}

const sections = [
  { id: 'about', label: 'About', title: 'About Me', component: 'AboutSection' },
  { id: 'skills', label: 'Skills', title: 'Skills', component: 'SkillsSection' },
  { id: 'projects', label: 'Projects', title: 'Projects', component: 'ProjectsSection' },
  { id: 'contact', label: 'Contact', title: 'Contact', component: 'ContactSection' }
].map((section) => ({
  ...section,
  component: sectionComponents[section.component]
}))

export default sections
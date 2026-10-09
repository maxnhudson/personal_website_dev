import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    // The About content lives on the home page as a section, so send old
    // links to the anchor instead of a separate page.
    path: '/about',
    name: 'about',
    redirect: { path: '/', hash: '#about' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
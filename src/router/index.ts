import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import BibleStudiesPage from '../pages/BibleStudiesPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/bible',
      name: 'bible',
      component: BibleStudiesPage,
    },
  ],
})

export default router

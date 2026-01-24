import { createRouter, createWebHistory } from 'vue-router'

const NavigationView = () => import('../views/NavigationView.vue')
const HomeView = () => import('../views/HomeView.vue')
const SubtitleConverterView = () => import('../views/SubtitleConverterView.vue')
const PortfolioView = () => import('../views/PortfolioView.vue')
const AboutView = () => import('../views/AboutView.vue')
const StudentWorksView = () => import('../views/StudentWorksView.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: NavigationView,
    meta: {
      title: '小阳AI工具箱 - 网址导航'
    }
  },
  {
    path: '/navigation',
    redirect: '/'
  },
  {
    path: '/admin/nav',
    name: 'NavigationAdmin',
    component: NavigationView,
    meta: {
      title: '小阳AI工具箱 - 导航管理'
    }
  },
  {
    path: '/toolbox',
    name: 'Toolbox',
    component: HomeView,
    meta: {
      title: '小阳AI工具箱 - AI工具箱'
    }
  },
  {
    path: '/works',
    name: 'Works',
    component: PortfolioView,
    meta: {
      title: '小阳AI工具箱 - 作品一览'
    }
  },
  {
    path: '/student-works',
    name: 'StudentWorks',
    component: StudentWorksView,
    meta: {
      title: '小阳AI工具箱 - 学员作品'
    }
  },
  {
    path: '/toolbox/subtitle',
    name: 'Subtitle',
    component: SubtitleConverterView,
    meta: {
      title: '小阳AI工具箱 - 字幕提取助手'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: {
      title: '小阳AI工具箱 - 关于'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.afterEach(to => {
  document.title = to.meta?.title || '小阳AI工具箱'
})

export default router

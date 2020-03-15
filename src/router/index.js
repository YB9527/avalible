import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Main from '@/components/Main'
import AvalibleProject from '@/components/avalible/AvalibleProject'

import XTProject from '@/components/avalible/XTProject'
import Reportpage from '@/components/avalible/Reportpage'
import CreateProject from '@/components/avalible/CreateProject'
import ProjectModel from '@/components/avalible/ProjectModel'
import BaseicPercentages from '@/components/avalible/BaseicPercentages'
import ReportSet from '@/components/admin/ReportSet'
import Login from '@/components/user/Login'
import User from '@/components/user/User'
import UserReadme from '@/components/user/UserReadme'
import SoftwareLog from '@/components/user/SoftwareLog'
import Software from '@/components/user/Software'
import Feedback from '@/components/user/Feedback'
import Regist from '@/components/admin/Regist'
import Admin from '@/components/admin/Admin'
import Level from '@/components/admin/Level'
import AdminUser from '@/components/admin/User'

import Pageination from '@/components/public/Pageination'
import Test from '@/components/public/Test'
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {

      path: '/user',
      name: 'User',
      component: User,
      children: [
        {
          path: 'avalibleproject',
          name: 'AvalibleProject',
          component: AvalibleProject
        },
        {
          path: 'xtproject',
          name: 'XTProject',
          component: XTProject
        },
        {
          path: 'reportpage',
          name: 'Reportpage',
          component: Reportpage
        },
        {
          path: 'createproject',
          name: 'CreateProject',
          component: CreateProject
        },
        {
          path: 'software',
          name: 'Software',
          component: Software,
          children: [
            {
              path: 'userreadme',
              name: 'UserReadme',
              component: UserReadme
            },
            {
              path: 'softwarelog',
              name: 'SoftwareLog',
              component: SoftwareLog
            },
            {
              path: 'feedback',
              name: 'Feedback',
              component: Feedback
            },
          ]
        },


      ]
    },

    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      children: [
        {
          path: 'regist',
          name: 'Regist',
          component: Regist,
        },
        {
          path: 'level',
          name: 'Level',
          component: Level,
        },
        {
          path: 'user',
          name: 'AdminUser',
          component: AdminUser,
        },
        {
          path: 'reportset',
          name: 'ReportSet',
          component: ReportSet,
        },
        {
          path: 'baseicpercentages',
          name: 'BaseicPercentages',
          component: BaseicPercentages
        },
        {
          path: 'projectmodel',
          name: 'ProjectModel',
          component: ProjectModel
        },
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/pageination',
      name: 'Pageination',
      component: Pageination
    },
    {
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '*',
      name: 'User',
      component: User
    },
  ],
  linkActiveClass: 'active',

})

import Vue from "vue";
import VueRouter from "vue-router";

import Admin from "../views/admin/Admin.vue";
import Home from "../views/Home.vue";
import GameList from "../views/admin/GameList.vue";
import AddQuestion from "../views/admin/AddQuestion.vue";
import AddTeam from "../views/admin/AddTeam.vue";
import Login from "../views/Login.vue";

import Player from "../views/player/Player.vue";

import { auth } from "../firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/game-list",
    name: "game-list",
    component: GameList,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/game/:id",
    name: "admin",
    component: Admin,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/game/:id/add-question",
    name: "add-question",
    component: AddQuestion,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/game/:id/add-team",
    name: "add-team",
    component: AddTeam,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/game/:gameId/team/:teamId",
    name: "team",
    component: Player
  },
  {
    path: "/login",
    name: "login",
    component: Login
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next("login");
  else next();
});

export default router;

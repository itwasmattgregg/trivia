import Vue from "vue";
import VueRouter from "vue-router";

// Admin components
const Admin = () =>
  import(/* webpackChunkName: "group-admin" */ "../views/admin/Admin.vue");
const GameList = () =>
  import(/* webpackChunkName: "group-admin" */ "../views/admin/GameList.vue");
const AddQuestion = () =>
  import(
    /* webpackChunkName: "group-admin" */ "../views/admin/AddQuestion.vue"
  );
const AddTeam = () =>
  import(/* webpackChunkName: "group-admin" */ "../views/admin/AddTeam.vue");
const Login = () => import("../views/Login.vue");

// Player components
const Player = () =>
  import(/* webpackChunkName: "group-team" */ "../views/player/Player.vue");
const Home = () =>
  import(/* webpackChunkName: "group-team" */ "../views/Home.vue");

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

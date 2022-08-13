<template>
  <transition name="slide-fade" mode="out-in">
    <router-view  key="$route.fullPath"/>
  </transition>
</template>

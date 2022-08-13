<template>
  <transition name="slide-fade" mode="out-in">
    <keep-alive>
      <router-view />
    </keep-alive>
  </transition>
</template>
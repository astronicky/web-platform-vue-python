<template>
  <div class="wrapper">
    <div class="list">
      <div v-for="(item, index) in list" :key="index" class="thing">
        <span>
          {{item}}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [
        'MGS',
        'Dota',
        'CS:GO',
        'SotC',
        'SotN',
        'dog',
        'moon',
        'rainbow',
        'jump',
        'action',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'one',
        'two',
        '3',
        'cuatro',
      ],
    };
  },
};
</script>
<style scoped>
.wrapper {
  position: relative;
}

.list {
  display: flex;
  flex-direction: column;
  position: fixed;
  max-height: 6rem;
  width: 100%;
  overflow: hidden;
  z-index: 1;
  transition: .35s all;
}

.list:hover {
  max-height: 20rem;
  overflow-y: scroll;
  transition: .35s all;
}

.list > div {
  flex: 0 0 .4rem;
  position: relative;
  border: .1rem solid hsla(0, 100%, 50%, 1);
  border-bottom: none;
  background: white;
  overflow: hidden;
  transition: .35s all;
}

.list > div > span {
  position: absolute;
  line-height: 0;
}

.list > div:last-of-type {
  border-bottom: .1rem solid hsla(0, 100%, 50%, 1);

  flex: 0 0 4rem;
}

.list:hover > div {
  flex: 0 0 4rem;
  transition: .35s all;
}

</style>

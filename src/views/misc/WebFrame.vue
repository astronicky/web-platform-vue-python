<template>
  <div class="web_frame">
    <div class="header">
      <span>●</span>
      <span>●</span>
      <span>●</span>
      <div class="uri">
        {{uri}}
      </div>
    </div>
    <div class="content">
      <slot name="webContent"/>
    </div>
  </div>
</template>

<style scoped>

.web_frame {
  box-sizing: border-box;
  box-shadow: 0 1rem 2rem 0rem rgba(0, 0, 0, 0.15),
    0 0.5rem 1rem 0rem rgba(0, 0, 0, 0.25);
}

.web_frame .header {
  display: flex;
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
  padding: 0 1rem;
  background: linear-gradient(0deg, #eee, #fafafa);
  font-family: Arial;
  letter-spacing: -0.2rem;
  font-size: 2.5rem;
  user-select: none;
  cursor: default;
  border-bottom: 0.1rem solid #bbb;
}

.web_frame .header span {
  color: #ccc;
  text-shadow: 0rem -0.1rem #555;
  margin: 0.25rem 0.25rem;
}

.web_frame .header span:nth-of-type(3) {
  margin-right: -5.5rem;
}

.web_frame .header .uri {
  color: #777;
  font-weight: 400;
  letter-spacing: initial;
  font-size: 1.8rem;
  background: linear-gradient(180deg, #eee, #fafafa);
  max-width: 100%;
  text-align: center;
  padding: 0 20%;
  margin: 0.5rem auto;
  border: 0.1rem solid #ddd;
  border-radius: 0.2rem;
  background: #eee;
  box-shadow: inset 0 0.1rem 0.1rem #dadada;
  /* text-shadow: 0rem -.1rem #555; */
}

.web_frame .content {
  background: white;
}

.web_frame .content img {
  width: 100%;
  height: auto;
}

.web_frame .header span:nth-of-type(1):hover {
  animation: web_frame_color_red 7s infinite;
}

.web_frame .header span:nth-of-type(2):hover {
  animation: web_frame_color_yellow 7s infinite;
}

.web_frame .header span:nth-of-type(3):hover {
  animation: web_frame_color_green 7s infinite;
}

@keyframes web_frame_color_red {
  0% {
    color: #cc0000;
  }
  14.28% {
    color: #ef6c00;
  }
  28.57% {
    color: #ffea00;
  }
  42.85% {
    color: #64dd17;
  }
  57.14% {
    color: #0d47a1;
  }
  71.42% {
    color: #311b92;
  }
  85.71% {
    color: #aa00ff;
  }
  100% {
    color: #cc0000;
  }
}

@keyframes web_frame_color_yellow {
  0% {
    color: #ffea00;
  }
  14.28% {
    color: #64dd17;
  }
  28.57% {
    color: #0d47a1;
  }
  42.85% {
    color: #311b92;
  }
  57.14% {
    color: #aa00ff;
  }
  71.42% {
    color: #cc0000;
  }
  85.71% {
    color: #ef6c00;
  }
  100% {
    color: #ffea00;
  }
}

@keyframes web_frame_color_green {
  0% {
    color: #64dd17;
  }
  14.28% {
    color: #0d47a1;
  }
  28.57% {
    color: #311b92;
  }
  42.85% {
    color: #aa00ff;
  }
  57.14% {
    color: #cc0000;
  }
  71.42% {
    color: #ef6c00;
  }
  85.71% {
    color: #ffea00;
  }
  100% {
    color: #64dd17;
  }
}
</style>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class WebFrame extends Vue {
  @Prop()
  private uri: string;
}
</script>


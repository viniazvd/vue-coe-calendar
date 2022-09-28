<h1 align="center">vue-coe-calendar ✅</h1>

<p align="center">
  <a href="#"><img src="https://img.shields.io/npm/l/vuelidation.svg" alt="License" target="_blank"></a>
</p>

<br>

<p align="center">
  ✨ <a href="https://viniazvd.github.io/vue-coe-calendar/">Example</a>✨
</p>

<br>

**Install**

`yarn add vue-coe-calendar`

<br>

**Use**
```vue
<template>
  <calendar v-model="date" />
</template>

<script>
import Calendar from 'vue-coe-calendar'

export default {
  components: { Calendar },

  data () {
    return { date: '' }
  }
}
</script>
```

<br>

## Props

Name                |   type               | required  | About
-----               | -------------------- | --------- | ------
value                |  `(String, Object)`  |  `true`   |
isRange             |  Boolean             | `false`   |

## Events

Name          | About
-----         | -----
input  |

## Contribution
- @VitorLuizC
- @convenia team


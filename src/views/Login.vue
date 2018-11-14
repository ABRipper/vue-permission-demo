<template>
  <button @click="login">登录</button>
</template>

<script>
export default {
  methods: {
    login () {
      this.$store.dispatch('login', { username: 'johnson', password: 'abc123' })
    }
  }
}
</script>

<style>

</style>

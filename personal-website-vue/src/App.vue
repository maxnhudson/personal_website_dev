<template>
  <div id = "wrapper">
    <nav class="navbar is-fixed-top">
      <div class ="navbar-brand">
        <router-link to="/" class="navbar-item"><strong>Max Hudson</strong></router-link>
        <a class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbar-menu">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div id="navbar-menu" class="navbar-menu">
          <a class="navbar-item" href="#hero">Home</a>
          <a class="navbar-item" href="#about">About</a>
          <a class="navbar-item" href="#skills">Skills</a>
          <a class="navbar-item" href="#projects">Projects</a>
          <a class="navbar-item" href="#contact">Contact</a>
      </div>
      <div class ="navbar-end">
        <a class="navbar-item" href=".\assets\MHudson_Resume_FS.pdf" download="MHudson_Resume_FS">
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-download"></i>
            </span>
            <span>Resume</span>
          </span>
        </a>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {

      // Add a click event on each of them
      $navbarBurgers.forEach( el => {
        el.addEventListener('click', () => {

          // Get the target from the "data-target" attribute
          const target = el.dataset.target;
          const $target = document.getElementById(target);

          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle('is-active');
          $target.classList.toggle('is-active');

        });
      });
    }
  }
}
</script>

<style lang="scss">
@import '../node_modules/bulma';

html {
  scroll-behavior: smooth;
}

// body {
//   padding-top: 3.25rem;
// }

// .navbar {
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   z-index: 999;
//   box-shadow: 0 2px 8px rgba(0,0,0,0.15);
// }

.navbar-menu {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  justify-content: space-evenly;
  min-width: 50%
}

// @media (min-width: 768px) {
//   .navbar-menu {
//     min-width: 600px;
//   }
// }

#wrapper {
  min-height: 100vh;
}
</style>

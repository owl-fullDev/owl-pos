<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">Owl</span>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link
                to="/pendingSales"
                active-class="nav-link"
                class="nav-link"
              >
                Pending Sales
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/salesForm"
                active-class="nav-link"
                class="nav-link"
              >
                POS
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/shipments"
                active-class="nav-link"
                class="nav-link"
              >
                Shipments
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/Employees"
                active-class="nav-link"
                class="nav-link"
              >
                Employees
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

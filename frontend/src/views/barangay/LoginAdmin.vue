<template>
  <div id="user-identity" class="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
    <div class="container bg-transparent text-light p-4 rounded shadow-lg mb-5" style="max-width: 400px;">
      <!-- Logo -->
      <img src="@/assets/logo.png" alt="logo" class="logo mb-4 d-block mx-auto" />

      <!-- Display identity -->
      <h3 class="text-start">Welcome Administrator</h3>
      <div v-if="userIdentity" class="form-group mb-3">
        <label for="identity" class="form-label">Your Location: </label>
        <p class="text-center">{{ userIdentity }}</p>
      </div>
      <div v-else>
        <p class="text-center">Determining your location...plese wait !!</p>
      </div>

      <!-- Connect Button -->
      <button @click="connectToFabric" :disabled="!userIdentity" class="btn btn-primary w-100">Continue</button>

      <!-- Status Message -->
      <p v-if="connectionStatus" :style="{ color: statusColor }" class="text-center mt-3">{{ connectionStatus }}</p>
    </div>
  </div>
</template>

<style scoped>
#user-identity {
  background-color: #262529;
}

.logo {
  width: 100px;
  height: auto;
  z-index: 10;
}
</style>


<script>
export default {
  data() {
    return {
      userIdentity: "", // To store the fetched identity
      connectionStatus: "", // To store connection status message
      statusColor: "black", // Status message color
      isLoading: false, // To show a loading spinner or message
    };
  },
  methods: {
    // Get user's coordinates and determine identity dynamically
    getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            this.reverseGeocode(latitude, longitude);
          },
          (error) => {
            console.error("Error getting location: ", error);
            this.connectionStatus = `❌ Error: ${error.message}`;
            this.statusColor = "red";
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          }
        );
      } else {
        this.connectionStatus = "❌ Geolocation is not supported by this browser.";
        this.statusColor = "red";
      }
    },

    // Reverse geocode the coordinates if no known location matches
    reverseGeocode(latitude, longitude) {
      const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=40ab30f288d142e9bc097f4b490d76f9`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.features && data.features.length > 0) {
            const displayName = data.features[0].properties.formatted; // Get the full address

            if (displayName.includes("Mahay")) {
              this.userIdentity = "org1-admin"; // Set identity to "Mahay"
              this.connectionStatus = "Identity: Brgy. org1-admin";
              this.statusColor = "green";
            } else if (displayName.includes("Buenavista")) {
              this.userIdentity = "org2-admin"; // Set identity to "Buenavista"
              this.connectionStatus = "Identity: Brgy. org2-admin";
              this.statusColor = "green";
            } else {
              this.userIdentity = displayName; // Use the full address if neither is found
              this.connectionStatus = "Identity determined from geocoding!";
              this.statusColor = "green";
            }
          } else {
            this.userIdentity = "Address not found"; // Fallback if no address found
            this.connectionStatus = "❌ Address not found";
            this.statusColor = "red";
          }
          this.isLoading = false; // Stop loading
        })
        .catch((error) => {
          console.error("Error fetching location:", error);
          this.connectionStatus = `❌ Error: ${error.message}`;
          this.statusColor = "red";
        });
    },

    // Handle connection to the backend (Fabric network or other)
    async connectToFabric() {
      if (!this.userIdentity || this.userIdentity === "") {
        this.connectionStatus = "❌ User identity is required.";
        this.statusColor = "red";
        return;
      }

      try {
        this.connectionStatus = "Connecting...";
        this.statusColor = "black";

        const response = await fetch("https://servern.loophole.site/connect", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userIdentity: this.userIdentity }),
        });

        if (response.ok) {
          const data = await response.json();
          this.connectionStatus = `✅ ${data.message}`;
          this.statusColor = "green";

          // Redirect to the report page
          this.$router.push({ path: "/reports-list", query: { userIdentity: this.userIdentity } });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
      } catch (error) {
        this.connectionStatus = `❌ Error: ${error.message}`;
        this.statusColor = "red";
      }
    },
  },
  mounted() {
    // Automatically fetch location when the component is mounted
    this.getCurrentLocation();
  },
};
</script>

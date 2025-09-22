<template>
  <div class="container-fluid py-4 bg-dark rounded-3 text-white">
    <!-- Section 1: Crime Statistics Overview -->
    <div class="row mb-4 d-flex justify-content-center">
      <h2 class="mb-3">Crime Statistics Overview</h2>
      <div class="col-12 col-md-4 me-4">
        <div class="card bg-transparent rounded-3 shadow p-3 mb-5 text-white">
          <div class="card-body">
            <h4 class="card-title">Reports Overview</h4>
            <div class="chart-container text-center">
              <div class="pie-chart">
                <Pie :data="chartData" :options="chartOptions" :width="150" :height="75" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Info Column -->
      <div class="col-12 col-md-4 mt-5">
        <div class="row">
          <div class="col-12 mb-3">
            <div class="card bg-transparent rounded-3 shadow p-3 mb-3">
              <div class="card-body">
                <h4 class="card-title text-light">Today's Report Total</h4>
                <p class="card-text text-info bold fs-2 fw-bold">{{ computedTotalReports }}</p>
              </div>
            </div>
          </div>

          <div class="col-12">
            <div class="card text-info bg-transparent rounded-3 shadow p-3 mb-3">
              <div class="card-body">
                <h4 class="card-title text-light">Report Percentage</h4>
                <p class="card-text text-info fs-2">{{ reportsTodayPercentage }}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="border border-light mb-3"></div>
    <!-- Section 2: Crime Statistics Summary -->
    <div class="row mb-5 d-flex justify-content-between">
      <div class="col-12">
        <h3>Crime Statistics</h3>
        <div class="row">
          <div class="col-md-3">
            <div class="card text-secondary bg-transparent shadow border border-success mb-3">
              <div class="card-body">
                <h4 class="card-title fs-5">Total Verified Reports</h4>
                <p class="card-text text-light fs-3 fw-bold">{{ totalverifiedReports }}</p>
                <progress :value="totalverifiedReports" class="bg-success"></progress>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-secondary bg-transparent  shadow border border-secondary mb-3">
              <div class="card-body">
                <h4 class="card-title fs-5">Total Unverified Reports</h4>
                <p class="card-text text-light fs-3 fw-bold">{{ totalunverifiedReports }}</p>
                <progress :value="totalunverifiedReports" class="bg-danger"></progress>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-secondary bg-transparent shadow border border-danger mb-3">
              <div class="card-body">
                <h4 class="card-title fs-5">High Crime Reports</h4>
                <p class="card-text text-light fs-3 fw-bold">{{ highCrimeReports }}</p>
                <progress :value="highCrimeReports" class="bg-danger"></progress>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-secondary bg-transparent shadow border border-info mb-3">
              <div class="card-body">
                <h4 class="card-title fs-5">Low Crime Reports</h4>
                <p class="card-text text-light fs-3 fw-bold">{{ lowCrimeReports }}</p>
                <progress :value="lowCrimeReports" :max="computedTotalReports" class="bg-info"></progress>
              </div>
            </div>
          </div>
          <!-- Add an empty column for spacing (if necessary) -->
          <div class="col-md-3"></div>
        </div>
      </div>
    </div>
    <div class="border border-light mb-3"></div>
    <!-- Section 3: High Crime Reports Table -->
    <div class="row mb-4">
      <div class="col-12">
        <h3>High Crime Reports</h3>
        <!-- Check if there are any high crime reports -->
        <template v-if="highCrimeReportsList.length > 0">
          <table class="table table-bordered table-dark">
            <thead>
              <tr>
                <th>Crime ID</th>
                <th>Description</th>
                <th>Anonymized Name</th>
                <th>Category</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(report, index) in highCrimeReportsList" :key="index">
                <td>{{ report.crimeId }}</td>
                <td>{{ report.description }}</td>
                <td>{{ report.anonyname }}</td>
                <td>{{ report.category }}</td>
                <td>{{ report.date }}</td>
                <td :class="report.status === 'verified' ? 'text-success' : report.status === 'unverified' ? 'b text-secondary' : ''">
                 {{ report.status }}
                </td>
                <td>
                  <button @click="viewMedia(report.mediaLink)" class="btn btn-info">View Media</button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
        <!-- If there are no high crime reports -->
        <template v-else>
          <p class="text-danger">No reported high crimes.</p>
        </template>
      </div>
        <div v-if="currentMedia" class="media-modal" @click="handleOutsideClick($event)">
  <!-- Modal content inside Bootstrap modal structure -->
  <div class="modal-dialog modal-dialog-centered" role="document" @click.stop>
    <div class="modal-content bg-dark text-white p-4" ref="mediaContainer"> <!-- Added ref here -->
      <div class="modal-header">
        <h5 class="modal-title">View Media</h5>
        <button type="button" class="btn-close text-white" @click="closeMedia"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <!-- Loop through the media URLs and display each media -->
          <div v-for="(url, index) in currentMedia.urls" :key="index" class="col">
            <div v-if="currentMedia.types[index] === 'image'">
              <img :src="url" alt="Media Image" class="img-fluid small-img rounded-3" />
            </div>
            <div v-if="currentMedia.types[index] === 'video'">
              <video controls class="w-100 small-img rounded-3">
                <source :src="url" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" @click="closeMedia">Close</button>
      </div>
    </div>
  </div>
</div>

    </div>

    <!-- Section 4: Low Crime Reports Table -->
    <div class="row mb-4">
      <div class="col-12">
        <h3>Low Crime Reports</h3>
        <!-- Check if there are any low crime reports -->
        <template v-if="lowCrimeReportsList.length > 0">
          <table class="table table-bordered table-dark">
            <thead>
              <tr>
                <th>Crime ID</th>
                <th>Description</th>
                <th>Anonymized Name</th>
                <th>Category</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(report, index) in lowCrimeReportsList" :key="index">
                <td>{{ report.crimeId }}</td>
                <td>{{ report.description }}</td>
                <td>{{ report.anonyname }}</td>
                <td>{{ report.category }}</td>
                <td>{{ report.date }}</td>
                <td :class="report.status === 'verified' ? 'text-success' : report.status === 'unverified' ? 'text-secondary' : ''">
                  {{ report.status }}
                </td>
                <td>
                  <button @click="viewMedia(report.mediaLink)" class="btn btn-info">View Media</button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
        <!-- If there are no low crime reports -->
        <template v-else>
          <p class="text-danger">No reported low crimes.</p>
        </template>
      </div>

     <div v-if="currentMedia" class="media-modal" @click="handleOutsideClick($event)">
  <!-- Modal content inside Bootstrap modal structure -->
  <div class="modal-dialog modal-dialog-centered" role="document" @click.stop>
    <div class="modal-content bg-dark text-white p-4" ref="mediaContainer"> <!-- Added ref here -->
      <div class="modal-header">
        <h5 class="modal-title">View Media</h5>
        <button type="button" class="btn-close text-white" @click="closeMedia"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <!-- Loop through the media URLs and display each media -->
          <div v-for="(url, index) in currentMedia.urls" :key="index" class="col">
            <div v-if="currentMedia.types[index] === 'image'">
              <img :src="url" alt="Media Image" class="img-fluid small-img rounded-3" />
            </div>
            <div v-if="currentMedia.types[index] === 'video'">
              <video controls class="w-100 small-img rounded-3">
                <source :src="url" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" @click="closeMedia">Close</button>
      </div>
    </div>
  </div>
</div>


    </div>
  </div>
</template>

<style scoped>
/* Ensure the modal takes the full screen and center content */
.media-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Center the content inside each column */
.col {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Apply a fixed size and center images/videos inside the modal */
.media-media {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>

<script>
// Import necessary components from Vue-Chartjs and Axios
import { Pie } from 'vue-chartjs'
import axios from 'axios'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js'

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale)

export default {
  components: {
    Pie,
  },
  data() {
    return {
      crimeReports: [], // Empty array to store fetched reports
      totalReportsToday: 0, // Placeholder for today's total reports
      reportsTodayPercentage: 0, // Placeholder for today's report percentage
      totalReports: 0, // Placeholder for total reports
      reportsPercentage: 0, // Placeholder for percentage of total reports
      userIdentity: '', // Placeholder for user identity
      currentMedia: null, // The current media to display
    };
  },
  computed: {
    computedTotalReports() {
      return this.crimeReports.length;
    },
   totalverifiedReports() {
      return this.crimeReports.filter((report) => report.status === "verified").length;
    },
    totalunverifiedReports() {
      return this.crimeReports.filter((report) => report.status === "unverified").length;
    },
    highCrimeReports() {
      return this.crimeReports.filter((report) => report.category === "High").length;
    },
    lowCrimeReports() {
      return this.crimeReports.filter((report) => report.category === "Low").length;
    },
    highCrimeReportsList() {
      return this.crimeReports.filter((report) => report.category === "High");
    },
    lowCrimeReportsList() {
      return this.crimeReports.filter((report) => report.category === "Low");
    },
    chartData() {
      return {
        labels: ['High Crime', 'Low Crime'],
        datasets: [
          {
            data: [this.highCrimeReports, this.lowCrimeReports],
            backgroundColor: ['#FF6347', '#32CD32'], // Red for high, green for low
            hoverBackgroundColor: ['#FF4500', '#228B22'], // Darker shades for hover effect
            borderColor: ['#FFFFFF', '#FFFFFF'], // White borders for each segment
            borderWidth: 2,
          },
        ],
      };
    },
    chartOptions() {
      return {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              fontSize: 14,
            },
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const dataset = tooltipItem.dataset;
                const total = dataset.data.reduce((acc, value) => acc + value, 0);
                const percentage = ((tooltipItem.raw / total) * 100).toFixed(2);
                return `${tooltipItem.label}: ${tooltipItem.raw} reports (${percentage}%)`;
              },
            },
          },
        },
      };
    },
  },
  created() {
    this.fetchUserIdentity();
  },
  methods: {
    viewMedia(mediaLink) {
    // Split the mediaLink string by commas to get multiple image URLs
    const mediaUrls = mediaLink.split(',');  // Creates an array of URLs

    console.log("Media URLs:", mediaUrls); // Log the array of media URLs
    // Check if the URLs are image types or videos
    const mediaTypes = mediaUrls.map(url => {
      const fileExtension = url.split('.').pop().toLowerCase();
      return fileExtension === 'mp4' ? 'video' : 'image';
    });

    // Set the current media to display the list of URLs and their types
    this.currentMedia = {
      urls: mediaUrls,   // Array of media URLs
      types: mediaTypes, // Array of media types (either 'image' or 'video')
    };
    },
   handleOutsideClick(event) {
    // Check if the click happened outside the media container
    if (!this.$refs.mediaContainer.contains(event.target)) {
      this.closeMedia(); // Close the modal if the click is outside
    }
    },

    closeMedia() {
      this.currentMedia = null; // Close the media viewer
    },
    getApiBase() {
      const isNgrok = location.hostname.includes("servern");
      return isNgrok
        ? `https://${location.hostname}`
        : "https://servern.loophole.site";
    },

    async fetchUserIdentity() {
      try {
        const response = await axios.get('https://servern.loophole.site/get-identity-session', {
          withCredentials: true,
        });

        if (response.status === 200) {
          this.userIdentity = response.data.userIdentity;
          this.fetchCrimeReports();
        } else {
          console.error("Failed to retrieve user identity:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching user identity:", error);
      }
    },

    async fetchCrimeReports() {
      const apiBase = this.getApiBase();

      try {
        const userIdentity = this.userIdentity;

        const response = await axios.get(`${apiBase}/blockchain/reports?userIdentity=${encodeURIComponent(userIdentity)}`, {
          method: "GET",
          withCredentials: true,
        });

        this.crimeReports = response.data;

        // Calculate today's reports and percentages
        this.totalReports = this.crimeReports.length;
        this.totalReportsToday = this.crimeReports.filter(report => report.category === 'High').length;
        this.reportsTodayPercentage = (this.totalReportsToday / this.totalReports * 100).toFixed(2);

        // Handle cases where there are no high crime reports
        if (this.highCrimeReports === 0) {
          this.reportsTodayPercentage = (this.lowCrimeReports / this.totalReports * 100).toFixed(2);
        }

      } catch (error) {
        console.error("Error fetching crime reports:", error);
      }
    },
  },
};
</script>

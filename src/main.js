import './style.css';
import { initMap } from './modules/map';
import { setupScheduleListeners, addClass } from './modules/schedule';
import { loadMenu } from './modules/menu';
import { loadAnnouncements } from './modules/news';
import { requestNotificationPermission, setupClassReminders } from './utils/notifications';

class UniversityApp {
  constructor() {
    this.domElements = {
      app: document.querySelector('#app'),
      classNameInput: null,
      classTimeInput: null,
      addClassBtn: null,
      classList: null,
      newsList: null,
      menu: null,
      campusMap: null,
      scheduleForm: null
    };
    
    this.reminderInterval = null;
    this.unsubscribeSchedule = null;
  }

  initialize() {
    this.renderBaseHTML();
    this.cacheDOM();
    this.initFeatures();
    this.setupEventListeners();
  }

  renderBaseHTML() {
    this.domElements.app.innerHTML = `
      <div>
        <h1>University App</h1>
        
        <div class="news-section">
          <h2>News & Announcements</h2>
          <div id="newsList"></div>
        </div>
        
        <div class="schedule-section">
          <h2>Class Schedule</h2>
          <form id="schedule-form">
            <input type="text" id="className" placeholder="Class Name" />
            <input type="datetime-local" id="classTime" />
            <button type="submit" id="addClassBtn">Add Class</button>
          </form>
          <ul id="classList"></ul>
        </div>
        
        <div class="menu-section">
          <h2>Today's Menu</h2>
          <div id="menu"></div>
        </div>
        
        <div class="map-section">
          <h2>Campus Map</h2>
          <div id="campus-map" style="height: 400px; width: 100%;"></div>
        </div>
      </div>
    `;
  }

  cacheDOM() {
    this.domElements.classNameInput = document.getElementById('className');
    this.domElements.classTimeInput = document.getElementById('classTime');
    this.domElements.addClassBtn = document.getElementById('addClassBtn');
    this.domElements.classList = document.getElementById('classList');
    this.domElements.newsList = document.getElementById('newsList');
    this.domElements.menu = document.getElementById('menu');
    this.domElements.campusMap = document.getElementById('campus-map');
    this.domElements.scheduleForm = document.getElementById('schedule-form');
  }

  initFeatures() {
    // Initialize features
    initMap('campus-map', [35.51418979227663, 44.80524008876968]);
    requestNotificationPermission();
    this.unsubscribeSchedule = setupScheduleListeners(this.domElements);
    loadAnnouncements(this.domElements.newsList);
    loadMenu(this.domElements.menu);
    this.reminderInterval = setupClassReminders();
  }

  setupEventListeners() {
    this.domElements.scheduleForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await addClass(
          this.domElements.classNameInput.value,
          this.domElements.classTimeInput.value
        );
        this.domElements.classNameInput.value = '';
      } catch (error) {
        console.error("Error adding class:", error);
      }
    });

    // Event delegation for delete buttons
    this.domElements.classList.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-class')) {
        deleteClass(e.target.dataset.id);
      }
    });
  }

  cleanup() {
    if (this.unsubscribeSchedule) this.unsubscribeSchedule();
    if (this.reminderInterval) clearInterval(this.reminderInterval);
  }
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
  const app = new UniversityApp();
  app.initialize();
  
  // Cleanup when needed (e.g., for hot module replacement)
  window.appInstance = app;
});
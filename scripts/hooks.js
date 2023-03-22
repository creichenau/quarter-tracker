Hooks.once('init', () => {
  console.log('quarter-tracker | Initializing...')

  window.quarterTracker = {
    dashboard: new TrackerDashboard(),
    datamanager: new TrackerDataManager()
  }

  window.quarterTracker.datamanager.register();

  console.log('quarter-tracker | Initialization Complete.')
});

Hooks.once('ready', () => {
  let newData = { progress: { 'quarter': 1, 'weather': [] } };
  if (window.quarterTracker.datamanager.get() == null) {
    window.quarterTracker.datamanager.set(newData);
  }
});

Hooks.on('renderActorDirectory', (app, html, data) => {
  html
    .find(".directory-header")
    .prepend(`<div class="action-buttons flexrow"><button id="btn-dashboard">Quarter Tracker</div>`)
    .promise()
    .done(() => {
      $('#btn-dashboard').on('click', e => {
        window.quarterTracker.dashboard.redraw(true);
      });
    })
});

class TrackerDashboard extends Application {

  static get defaultOptions() {

    return mergeObject(super.defaultOptions, {
      id: "quarter-tracker-dashboard",
      classes: ["quarter-dashboard"],
      template: "modules/quarter-tracker/templates/quarter_tracker.html",
      minimizable: true,
      resizable: false,
      title: "Quarter Tracker",
    })
  }

  activateListeners(html) {
    super.activateListeners(html);
  }

  redraw(force) {
    this.render(force);
  }

  getData() {
    return window.quarterTracker.datamanager.progress();
  }

}

class TrackerDataManager {

  progress() {
    let retVal = this.get();
    return retVal;
  }

  clearProgress() {
    let newData = { progress: { 'quarter': 1, 'weather': [] } };
    this.set(newData);
  }

  updateProgress(current) {
    let newData = { progress: current };
    this.set(newData);
  }

  register() {
    console.log('quarter-tracker | registering settings...')

    // register save data setting
    game.settings.register('quarter-tracker', 'quarter-data', {
      name: "Quarter Tracker",
      scope: "world",
      config: false,
      type: Object,
      default: null
    });

    // register weather table setting
    game.settings.register('quarter-tracker', 'weather-table', {
      name: "Weather Table",
      scope: "client",
      config: true,
      type: String,
      default: "None",
      choices: {
        "None": "None",
        "rl": "Ravenlands",
        "br": "Bitter Reach",
        "bm": "Bloodmarch",
        "tw2k": "Twilight 2000"
      },
      onChange: value => { // value is the new value of the setting
        console.log('quarter-tracker | New weathe table value = ' + value);
        if (value == "tw2k") {
          window.quarterTracker.datamanager.clearProgress();
        }
      },
    });

    console.log('quarter-tracker | settings registered.')
  }

  get() {
    return game.settings.get('quarter-tracker', 'quarter-data');
  }

  set(value) {
    game.settings.set('quarter-tracker', 'quarter-data', value)
  }
}

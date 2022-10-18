import './content.scss';

export default class Content {
  /**
   * @class
   * @param {object} [params={}] Parameters.
   */
  constructor(params = {}) {
    this.params = params;

    this.dom = document.createElement('div');
    this.dom.classList.add('h5p-tabs-content-container');
    this.dom.setAttribute('id', `h5p-tabs-tabpanel-${this.params.uuid}`);
    this.dom.setAttribute('role', 'tabpanel');
    this.dom.setAttribute('aria-labelledby', `h5p-tabs-tab-${this.params.uuid}`);

    const content = document.createElement('div');
    content.classList.add('h5p-tabs-tab-content');

    this.instance = H5P.newRunnable(
      this.params.content,
      this.params.contentId,
      H5P.jQuery(content),
      false,
      { previousState: this.params.previousState }
    );

    this.dom.appendChild(content);
  }

  /**
   * Return DOM for component..
   *
   * @returns {HTMLElement} DOM for component.
   */
  getDOM() {
    return this.dom;
  }

  /**
   * Get H5P instance.
   *
   * @returns {H5P.ContentType} H5P instance.
   */
  getInstance() {
    return this.instance;
  }

  /**
   * Show content.
   */
  show() {
    this.dom.classList.remove('display-none');
  }

  /**
   * Hide content.
   */
  hide() {
    this.dom.classList.add('display-none');
  }

  /**
   * Set content to done or not done.
   *
   * @param {boolean} state Done state.
   */
  setDoneState(state) {
    if (typeof state !== 'boolean') {
      return;
    }

    this.isDone = state;
  }

  /**
   * Check whether content is done.
   *
   * @returns {boolean} True, if sone. Else false.
   */
  getDoneState() {
    return this.isDone || false;
  }
}

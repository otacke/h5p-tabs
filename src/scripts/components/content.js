import './content.scss';

export default class Content {
  /**
   * @class
   * @param {object} [params={}] Parameters.
   * @param {object} [callbacks={}] Callbacks.
   * @param {function} [callbacks.resize] Resize callback.
   */
  constructor(params = {}, callbacks = {}) {
    this.params = params;

    this.callbacks = callbacks || {};
    this.callbacks.resize = this.callbacks.resize || (() => {});

    this.dom = document.createElement('div');
    this.dom.classList.add('h5p-tabs-content-container');
    this.dom.setAttribute('id', `h5p-tabs-tabpanel-${this.params.uuid}`);
    this.dom.setAttribute('role', 'tabpanel');
    this.dom.setAttribute('aria-labelledby', `h5p-tabs-tab-${this.params.uuid}`);

    this.content = document.createElement('div');
    this.content.classList.add('h5p-tabs-tab-content');

    this.instance = H5P.newRunnable(
      this.params.content,
      this.params.contentId,
      undefined, // must attach later
      true,
      { previousState: this.params.previousState }
    );

    this.dom.appendChild(this.content);

    /*
     * Some of Tabs subcontents may require to be attached to the page's
     * `document` before being attached to a container.
     * If observer is started immediately, it may depend on timing whether it
     * actually fires when target is visible. Waiting for next animation frame
     * helps but can fail when content is embedded.
     */
    const initCallback = window.requestIdleCallback ?
      window.requestIdleCallback :
      window.requestAnimationFrame;

    initCallback(() => {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect(); // Not needed anymore

          this.attach();

          window.requestAnimationFrame(() => {
            this.callbacks.resize();
          });
        }
      }, {
        threshold: 0.01
      });
      observer.observe(this.dom);
    });
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
   * Attach content to document.
   */
  attach() {
    if (typeof this.instance?.attach !== 'function') {
      return;
    }

    this.instance.attach(H5P.jQuery(this.content));
    this.isInstanceAttached = true;
  }

  /**
   * Determine whether instance was attached already.
   *
   * @returns {boolean} True if instance is attached.
   */
  isAttached() {
    return this.isInstanceAttached;
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

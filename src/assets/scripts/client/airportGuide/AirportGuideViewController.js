import _has from 'lodash/has';
import EventBus from '../lib/EventBus';
import AirportGuideView from './AirportGuideView';
import { EVENT } from '../constants/eventNames';

/**
 * Controls airportGuide view
 *
 * Responsible for maintaining a dictionary of `{[icao: string] html string}`
 * where each key is an airport icao with an html string as a value.
 * This markup is generated during the build from source markdown files
 *
 * @class AirportGuideViewController
 */
export default class AirportGuideViewController {
    /**
     * @constructor
     * @param {JQuery|HTMLElement} $element
     * @param {object} airportGuideData  dictionary of airport icao and html string
     * @param {string} initialIcao  airport used during startup of the app
     */
    constructor($element, airportGuideData, initialIcao) {
        /**
         * Local reference to the EventBus
         *
         * @property _eventBus
         * @type {EventBus}
         * @private
         */
        this._eventBus = EventBus;

        /**
         * Root DOM element
         *
         * @property _$element
         * @type {JQuery|HTMLElement}
         * @default null
         * @private
         */
        this._$element = null;

        /**
         * The ICAO of the initial airport.
         *
         * @property _initialIcao
         * @type {string}
         * @private
         */
        this._initialIcao = initialIcao.toLowerCase();

        /**
         * View instance model
         *
         * Used to show, hide, update the airportGuide view
         *
         * @property _airportGuideView
         * @type {AirportGuideView}
         * @default null
         * @private
         */
        this._airportGuideView = null;

        /**
         * Contains an object with keys of icao idents and values
         * of the airport guides from the documentation folder.
         *
         * @property _guideData
         * @type {object<string, string>}
         * @private
         */
        this._guideData = airportGuideData;

        return this.init()
            ._createChildren($element)
            ._setupHandlers()
            .enable();
    }

    /**
     * Initialize the instance
     *
     * Should only be run once on instantiation
     *
     * @for airportGuideViewController
     * @method init
     * @chainable
     */
    init() {
        this._eventBus = EventBus;

        return this;
    }

    /**
     * Create child elements
     *
     * Should be run only once on instantiation
     *
     * @for AirportGuideViewController
     * @method _createChildren
     * @param {Jquery Element} $element
     * @chainable
     * @private
     */
    _createChildren($element) {
        const activeAirportGuide = this.getAirportGuide(this._initialIcao);
        this._airportGuideView = new AirportGuideView($element, activeAirportGuide);

        return this;
    }

    /**
     * Bind method handlers
     *
     * Should only be run once on instantiation
     *
     * @for airportGuideViewController
     * @method _setupHandlers
     * @chainable
     */
    _setupHandlers() {
        this._onAirportChangeHandler = this._onAirportChange.bind(this);
        this._onToggleViewHandler = this._onToggleView.bind(this);

        return this;
    }

    /**
     * Enable handlers
     *
     * @for airportGuideViewController
     * @method enable
     * @chainable
     */
    enable() {
        this._eventBus.on(EVENT.AIRPORT_CHANGE, this._onAirportChangeHandler);
        this._eventBus.on(EVENT.TOGGLE_AIRPORT_GUIDE, this._onToggleViewHandler);

        return this;
    }

    /**
     * Disable handlers
     *
     * @for airportGuideViewController
     * @method disable
     * @chainable
     */
    disable() {
        this._eventBus.off(EVENT.AIRPORT_CHANGE, this._onAirportChangeHandler);
        this._eventBus.off(EVENT.TOGGLE_AIRPORT_GUIDE, this._onToggleViewHandler);

        return this;
    }

    /**
     * Reset the instance
     *
     * @for airportGuideViewController
     * @method destroy
     * @chainable
     */
    destroy() {
        this._eventBus = null;
        this._$element = null;
        this._initialIcao = null;
        this._airportGuideView = null;
        this._guideData = null;
        this._onAirportChangeHandler = null;
        this._onToggleViewHandler = null;

        return this;
    }

    /**
     * Event handler for when the `airportGuideView` instance is clicked
     *
     * @for airportGuideViewController
     * @method _onToggleView
     * @param event {JQueryEventObject}
     * @private
     */
    _onToggleView() {
        this._airportGuideView.toggleView();
    }

    /**
     * Event handler for when an airport is changed.
     *
     * @for AirportGuideViewController
     * @method _onAirportChange
     * @param {object} nextAirportJson
     * @private
     */
    _onAirportChange(nextAirportJson) {
        const nextIcao = nextAirportJson.icao.toLowerCase();
        const airportGuideMarkupString = this.getAirportGuide(nextIcao);

        this._airportGuideView.update(airportGuideMarkupString);
    }

    /**
     * Main getter method for an airport guide, identified by ICAO
     *
     * @for AirportGuideViewController
     * @method getAirportGuide
     * @param {string} nextIcao
     * @returns {string} - the requested guide
     */
    getAirportGuide(nextIcao) {
        const guideExists = this.hasAirportGuide(nextIcao);

        if (!guideExists) {
            nextIcao = 'not_found';
        }

        return this._guideData[nextIcao];
    }

    /**
     * Returns whether or not an airport guide
     * exists for the given airport
     *
     * @for AirportGuideViewController
     * @method hasAirportGuide
     * @param {string} icao
     * @returns {Boolean} whether a guide was found
     */
    hasAirportGuide(icao) {
        return _has(this._guideData, icao);
    }
}

import $ from 'jquery';
import BaseModel from '../../base/BaseModel';
import EventBus from '../../lib/EventBus';
import { STRIP_VIEW_TEMPLATE } from './stripViewTemplate';
import { EVENT } from '../../constants/eventNames';
import { INVALID_NUMBER } from '../../constants/globalConstants';
import { SELECTORS } from '../../constants/selectors';
import { leftPad } from '../../utilities/generalUtilities';

/**
 * Encapsulation of data and view elements for a single aircraft progress strip
 *
 * Handles display and updating of an aircraft progress strip
 *
 * @class StripViewModel
 * @extends BaseModel
 */
export default class StripViewModel extends BaseModel {
    /**
     * Height of the AircraftStrip DOM element in px.
     *
     * @property AIRCRAFT_STRIP_HEIGHT
     * @type {number}
     * @static
     */
    static HEIGHT = 60;

    /**
     * @constructor
     * @param aircraftModel {object}
     * @param cidValue {number}
     */
    constructor(aircraftModel, cidValue) {
        super('stripViewModel');

        /**
         * Model `#_id` inherited from `BaseModel`
         *
         * @property _id
         * @type {string}
         */

        /**
         * Internal reference to `EventBus` class
         *
         * @property _eventBus
         * @type {EventBus}
         * @default EventBus
         * @private
         */
        this._eventBus = EventBus;

        /**
         * If an aircraft is a Departure
         *
         * When this is true it means the aircraft is a Departure
         * and if this is false it means the aircraft is an Arrival.
         *
         * @property isDeparture
         * @type {boolean}
         * @default false
         */
        this.isDeparture = false;

        /**
         * Root HTML Element
         *
         * @property $element
         * @type {JQuery Element}
         * @default null
         */
        this.$element = null;

        /**
         * Reference to the `AircraftModel#id` property
         *
         * Used only for associating a `StripViewModel` with a
         * specific `aircraftId`
         *
         * @property aircraftId
         * @type {string}
         */
        this.aircraftId = aircraftModel.id;

        /**
         * If an aircraft inside controlled airspace
         *
         * When this is true it means the aircraft is (or should)
         * be under ATC control and it's progress strip should
         * be visible in the strip list.
         *
         * @property insideCenter
         * @type {boolean}
         * @default false
         */
        this.insideCenter = false;

        /**
         * CSS classname applied for arrival or departure
         *
         * @property _categoryClassname
         * @type string
         * @default ''
         */
        this._categoryClassName = '';

        // the following properties are arranged in view order
        // this sort will be used throughout this class

        /**
         * Aircraft callsign
         *
         * @property _callsign
         * @type {string}
         * @default ''
         * @private
         */
        this._callsign = '';

        /**
         * HTML Element that holds the `#_callsign` value
         *
         * @property
         * @type {JQuery Element}
         * @default null
         */
        this.$callsignView = null;

        /**
         * The aircraft type, with weight prefix and equipment suffix
         *
         * Will be generated by the `AircraftTypeDefinitionModel`,
         * this merely caches that value so it doesn't need to be
         * calculated every time.
         *
         * @property _aircraftType
         * @type {string}
         * @default ''
         * @private
         */
        this._aircraftType = '';

        /**
         * HTML Element that holds the `#_aircraftType` value
         *
         * @property $aircraftTypeView
         * @type {JQuery Element}
         * @default null
         */
        this.$aircraftTypeView = null;

        /**
         * This value is generated by the `StripViewController` and is
         * unique to every `StripViewModel`
         *
         * Currently only numeric, but could be made alpha-numberic
         *
         * Padded with leading zeros in `#cidString` for display purposes
         *
         * @property cid
         * @type {number}
         * @default cidValue
         */
        this.cid = cidValue;

        /**
         * A string version of `#cid` for display purposes
         * Has been padded with leading zeros so that it is always
         * displayed as three digits
         *
         * @property cidString
         * @type {string}
         * @default cidValue
         */
        this.cidString = leftPad(cidValue, 3);

        /**
         * HTML Element that holds `#_cidValue`
         *
         * @property $cidView
         * @type {JQuery Element}
         * @default null
         */
        this.$cidView = null;

        /**
         * Aircraft transponder code
         *
         * @property _transponder
         * @type {number}
         * @default INVALID_NUMBER
         * @private
         */
        this._transponder = INVALID_NUMBER;

        /**
         * HTML Element that holds the `#_transponderCode` value
         *
         * @property $transponderView
         * @type {JQuery Element}
         * @default null
         */
        this.$transponderView = null;

        /**
         * Altitude aircraft has been assigned in FL feet
         *
         * @property _assingedAltitude
         * @type {number}
         * @default INVALID_NUMBER
         * @private
         */
        this._assignedAltitude = INVALID_NUMBER;

        /**
         * HTML Element that holds the `#_assignedAltitude` value
         *
         * @property $assignedAltitudeView
         * @type {JQuery Element}
         * @default null
         */
        this.$assignedAltitudeView = null;

        /**
         * Cruise altitude
         *
         * @property _flightPlanAltitude
         * @type {number}
         * @default INVALID_NUMBER
         * @private
         */
        this._flightPlanAltitude = INVALID_NUMBER;

        /**
         * HTML Element that holds the `#_flightPlanAltitude` value
         *
         * @property $flightPlanAltitudeView
         * @type {JQuery Element}
         * @default null
         */
        this.$flightPlanAltitudeView = null;

        /**
         * Arrival airport icao
         *
         * @property _arrivalAirport
         * @type
         * @default
         * @private
         */
        this._arrivalAirport = '';

        /**
         * HTML Element that hold the `#_arrivalAirport` value
         *
         * @property $arrivalAirportView
         * @type {JQuery Element}
         * @default null
         */
        this.$arrivalAirportView = null;

        /**
         * Departure airport icao
         *
         * @property _departureAirport
         * @type
         * @default
         * @private
         */
        this._departureAirport = '';

        /**
         * HTML Element that hold the `#_departureAirport` value
         *
         * @property $departureAirportView
         * @type {JQuery Element}
         * @default null
         */
        this.$departureAirportView = null;

        /**
         * Alternate airport icao
         *
         * @property _alternateAirport
         * @type
         * @default
         * @private
         */
        this._alternateAirport = '';

        /**
         * HTML Element that hold the `#_alternateAirport` value
         *
         * @property $alternateAirportView
         * @type {JQuery Element}
         * @default null
         */
        this.$alternateAirportView = null;

        /**
         * Route string that represents the 'filed' flight plan
         *
         * @property _flightPlan
         * @type {string}
         * @default ''
         * @private
         */
        this._flightPlan = '';

        /**
         * HTML Element that holds the `#_flightPlan` value
         *
         * @property $flightPlanView
         * @type {JQuery Element}
         * @default null
         */
        this.$flightPlanView = null;

        /**
         * Value of the remarks field
         *
         * @property _remarks
         * @type {string}
         * @default ''
         * @private
         */
        this._remarks = '';

        /**
         * HTML Element that holds the `#remarks` value
         *
         * @property $remarks
         * @type {JQuery Element}
         * @default null
         */
        this.$remarks = null;

        /**
         * The expected or assigned runway
         *
         * @property _runwayInformation
         * @type {object}
         * @default ''
         * @private
         */
        this._runwayInformation = null;

        /**
         * HTML Element that holds the `#runway` value
         *
         * @property $runway
         * @type {JQuery Element}
         * @default null
         */
        this.$runway = null;

        return this._init(aircraftModel)
            ._createChildren()
            ._setupHandlers()
            ._enable()
            ._layout()
            ._redraw();
    }

    /**
     * Does `#$element` currently have the active css classname applied
     *
     * This is useful when trying to find the current active `stripView`
     * by looping through the `StripViewCollection#_items`.
     *
     * @property isActive
     * @type {boolean}
     */
    get isActive() {
        return this.$element.hasClass(SELECTORS.CLASSNAMES.ACTIVE);
    }

    /**
     * Initialize the instance
     *
     * Should be run once only on instantiation
     *
     * @for StripViewModel
     * @method _init
     * @param aircraftModel {object}
     * @chainable
     */
    _init(aircraftModel) {
        const {
            insideCenter,
            callsign,
            icaoWithWeightClass,
            transponderCode,
            assignedAltitude,
            arrivalAirportId,
            departureAirportId,
            flightPlanAltitude,
            flightPlan
        } = aircraftModel.getViewModel();

        this.insideCenter = insideCenter;
        this._callsign = callsign;
        this._transponder = transponderCode;
        this._aircraftType = icaoWithWeightClass;
        this._assignedAltitude = assignedAltitude;
        this._flightPlanAltitude = flightPlanAltitude;
        this._arrivalAirport = arrivalAirportId;
        this._departureAirport = departureAirportId;
        this._flightPlan = flightPlan;
        this._categoryClassName = this._buildClassnameForFlightCategory(aircraftModel);
        this.isDeparture = aircraftModel.isDeparture();
        this._runwayInformation = this._buildRunwayInformation(aircraftModel);

        return this;
    }

    /**
     * Set initial element references
     *
     * Should be run once only on instantiation
     *
     * @for StripViewModel
     * @method _createChildren
     * @chainable
     */
    _createChildren() {
        this.$element = $(STRIP_VIEW_TEMPLATE);
        this.$callsignView = this.$element.find(SELECTORS.CLASSNAMES.STRIP_VIEW_CALLSIGN);
        this.$aircraftTypeView = this.$element.find(SELECTORS.CLASSNAMES.STRIP_VIEW_AIRCRAFT_TYPE);
        this.$cidView = this.$element.find(SELECTORS.CLASSNAMES.STRIP_VIEW_CID);
        this.$transponderView = this.$element.find(SELECTORS.CLASSNAMES.STRIP_VIEW_TRANSPONDER);
        this.$assignedAltitudeView = this.$element.find(SELECTORS.CLASSNAMES.STRIP_VIEW_ASSIGNED_ALTITUDE);
        this.$flightPlanAltitudeView = this.$element.find(SELECTORS.CLASSNAMES.STRIP_VIEW_FLIGHT_PLAN_ALTITUDE);
        this.$arrivalAirportView = this.$element.find(SELECTORS.CLASSNAMES.STRIP_VIEW_ARRIVAL_AIRPORT_ID);
        this.$departureAirportView = this.$element.find(SELECTORS.CLASSNAMES.STRIP_VIEW_DEPARTURE_AIRPORT_ID);
        this.$alternateAirportView = this.$element.find(SELECTORS.CLASSNAMES.STRIP_VIEW_ALTERNATE_AIRPORT_ID);
        this.$flightPlanView = this.$element.find(SELECTORS.CLASSNAMES.STRIP_VIEW_FLIGHT_PLAN);
        this.$remarks = this.$element.find(SELECTORS.CLASSNAMES.STRIP_VIEW_REMARKS);
        this.$runway = this.$element.find(SELECTORS.CLASSNAMES.STRIP_VIEW_RUNWAY);

        return this;
    }

    /**
     * Create event handlers
     *
     * Should be run once only on instantiation
     *
     * @for StripViewModel
     * @method _setupHandlers
     * @chainable
     */
    _setupHandlers() {
        this._onClickHandler = this._onClick.bind(this);
        this._onDoubleClickHandler = this._onDoubleClick.bind(this);

        return this;
    }

    /**
     * Register handlers with events on the `$element`
     *
     * @for StripViewModel
     * @method _enable
     * @private
     */
    _enable() {
        this.$element.on('click', this._onClickHandler);
        this.$element.on('dblclick', this._onDoubleClickHandler);

        return this;
    }

    /**
     * Set the layout with the correct data
     *
     * This method will be run on instantiation to set up the view for the first time
     * and will also run on every subsequent re-render.
     *
     * We do not selectively render, if one property has changed
     * (as determined by `_shouldUpdate()`) we re-draw everything in one shot.
     *
     * @for StripViewModel
     * @method _layout
     * @chainable
     */
    _layout() {
        this.$element.addClass(this._categoryClassName);

        return this;
    }

    /**
     * Update teh view with new data
     *
     * This method will be run on instantiation to initialize the view with data,
     * and will be run again any time updatable data has changed.
     *
     * After instantiation, this method should only be run after `._shouldUpdate()`
     * has returned true.
     *
     * @for StripViewModel
     * @method _render
     * @chainable
     */
    _redraw() {
        this.$callsignView.text(this._callsign);
        this.$aircraftTypeView.text(this._aircraftType);
        this.$cidView.text(this.cidString);
        this.$transponderView.text(this._transponder);
        this.$assignedAltitudeView.text(this._assignedAltitude);
        this.$flightPlanAltitudeView.text(this._flightPlanAltitude);
        this.$departureAirportView.text(this._departureAirport);
        this.$arrivalAirportView.text(this._arrivalAirport);
        this.$alternateAirportView.text(this._alternateAirport);
        this.$flightPlanView.text(this._flightPlan);
        this.$remarks.text(this._remarks);
        this.$runway.text(this._runwayInformation.name);

        return this;
    }

    /**
     * Disable the instance ane tear down handlers
     *
     * @for StripViewModel
     * @method disable
     */
    disable() {
        this.$element.off('click', this._onClickHandler);
        this.$element.off('dblclick', this._onDoubleClickHandler);

        return this;
    }

    /**
     * Destroy the instance
     *
     * @for StripViewModel
     * @method destroy
     * @chainable
     */
    destroy() {
        this.disable();
        this.$element.remove();

        this.id = '';
        this._eventBus = null;
        this.$element = null;
        this.aircraftId = '';
        this.insideCenter = false;
        this._categoryClassName = '';
        this._callsign = '';
        this.$callsignView = null;
        this._aircraftType = '';
        this.$aircraftTypeView = null;
        this.cid = INVALID_NUMBER;
        this.cidString = '';
        this.$cidView = null;
        this._transponder = 1200;
        this.$transponderView = null;
        this._assignedAltitude = INVALID_NUMBER;
        this.$assignedAltitudeView = null;
        this._flightPlanAltitude = INVALID_NUMBER;
        this.$flightPlanAltitudeView = null;
        this._arrivalAirport = '';
        this.$arrivalAirportView = null;
        this._departureAirport = '';
        this.$departureAirportView = null;
        this._alternateAirport = '';
        this.$alternateAirportView = null;
        this._flightPlan = '';
        this.$flightPlanView = null;
        this._remarks = '';
        this.$remarks = null;
        this._runwayInformation = null;
        this.$runway = null;

        return this;
    }

    /**
     * Update the instance with new information or return
     * early if nothing has changed
     *
     * @for StripViewModel
     * @method update
     * @param aircraftModel {AircraftModel}
     */
    update(aircraftModel) {
        if (!this._shouldUpdate(aircraftModel)) {
            return;
        }

        this._updateStripView(aircraftModel);
    }

    /**
     * Add active css classname
     *
     * @for StripViewModel
     * @method addActiveState
     */
    addActiveState() {
        this.$element.addClass(SELECTORS.CLASSNAMES.ACTIVE);
    }

    /**
     * Remove active css classname
     *
     * @for StripViewModel
     * @method removeActiveState
     */
    removeActiveState() {
        this.$element.removeClass(SELECTORS.CLASSNAMES.ACTIVE);
    }

    /**
     * Scroll into view
     *
     * @for StripViewModel
     * @method scrollIntoView
     */
    scrollIntoView() {
        this.$element[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Return a classname based on whether an aircraft is a `departure` or an `arrival`
     *
     * @for AircraftStripView
     * @method _buildClassnameForFlightCategory
     * @param aircraftModel {AircraftModel}
     * @return {string}
     */
    _buildClassnameForFlightCategory(aircraftModel) {
        if (aircraftModel.isDeparture()) {
            return SELECTORS.CLASSNAMES.DEPARTURE;
        }

        if (aircraftModel.isOverflight()) {
            return SELECTORS.CLASSNAMES.OVERFLIGHT;
        }

        return SELECTORS.CLASSNAMES.ARRIVAL;
    }

    /**
     * Returns the runway and if it is expected or assigned based on whether an
     * aircraft is a `departure` or an `arrival`.
     *
     * @for AircraftStripView
     * @method _buildRunwayInformation
     * @param aircraftModel {AircraftModel}
     * @return {object}
     */
    _buildRunwayInformation(aircraftModel) {
        if (aircraftModel.isDeparture() && aircraftModel.isOnGround()) {
            return {
                hasRunwayAssigned: !aircraftModel.isApron(),
                name: aircraftModel.fms.departureRunwayModel.name
            };
        }

        if (aircraftModel.isArrival()) {
            return {
                hasRunwayAssigned: aircraftModel.pilot.hasApproachClearance,
                name: aircraftModel.fms.arrivalRunwayModel.name
            };
        }

        return {
            hasRunwayAssigned: false,
            name: ''
        };
    }

    /**
     * Click handler for a single click on `StripViewModel`
     *
     * This method will prevent event bubbling so a click
     * doesn't cause the `stripView` to close
     *
     * @for AircraftStripView
     * @method _onClick
     * @param event {jquery event}
     * @private
     */
    _onClick(event) {
        event.stopPropagation();

        this._eventBus.trigger(EVENT.STRIP_CLICK, this._callsign);
    }

    /**
     * Handler for a double-click on an AircraftStripView
     *
     * Initiates the process of centering a single aircraft in the middle of the view
     *
     * This method should prevent event bubbling so a click doesn't cause the `stripView` to close
     *
     * @for AircraftStripView
     * @method _onDoubleClick
     * @param  event {Event}
     * @private
     */
    _onDoubleClick(event) {
        event.stopPropagation();

        this._eventBus.trigger(EVENT.STRIP_DOUBLE_CLICK, this._callsign);
    }


    /**
     * Encapsulation of boolean logic used to determine if the view needs to be updated
     *
     * This method provides an implementation an 'early exit', so if the view doesn't
     * need to be updated it can be skipped.
     *
     * @for StripViewModel
     * @method shouldUpdate
     * @param  aircraftModel {AircraftModel}
     * @return {boolean}
     * @private
     */
    _shouldUpdate(aircraftModel) {
        const viewModel = aircraftModel.getViewModel();
        const runwayInfo = this._buildRunwayInformation(aircraftModel);

        return this.insideCenter !== viewModel.insideCenter ||
            this._transponder !== viewModel.transponderCode ||
            this._assignedAltitude !== viewModel.assignedAltitude ||
            this._flightPlanAltitude !== viewModel.flightPlanAltitude ||
            this._arrivalAirport !== viewModel.arrivalAirportId ||
            this._departureAirport !== viewModel.departureAirportId ||
            this._flightPlan !== viewModel.flightPlan ||
            this._runwayInformation.hasRunwayAssigned !== runwayInfo.hasRunwayAssigned ||
            this._runwayInformation.name !== runwayInfo.name;
    }

    /**
     * Update instance properties with new values from the `AircraftModel`
     *
     * This method should only be run after `_shouldUpdate()` returns true
     * This method will only update the mutable properties of `StripViewModel`
     *
     * @for StripViewModel
     * @method _updateStripView
     * @param {AircraftModel} aircraftModel
     * @private
     */
    _updateStripView(aircraftModel) {
        const {
            insideCenter,
            transponderCode,
            assignedAltitude,
            arrivalAirportId,
            departureAirportId,
            flightPlanAltitude,
            flightPlan
        } = aircraftModel.getViewModel();

        this.insideCenter = insideCenter;
        this._transponder = transponderCode;
        this._assignedAltitude = assignedAltitude;
        this._flightPlanAltitude = flightPlanAltitude;
        this._arrivalAirport = arrivalAirportId;
        this._departureAirport = departureAirportId;
        this._flightPlan = flightPlan;
        this._runwayInformation = this._buildRunwayInformation(aircraftModel);

        this.$runway.toggleClass(
            SELECTORS.CLASSNAMES.STRIP_VIEW_PREPLANNING,
            !this._runwayInformation.hasRunwayAssigned
        );

        return this._redraw();
    }
}

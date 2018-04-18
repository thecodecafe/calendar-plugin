(function ($) {

    /**
     * basic constants we will need within this javascript file
     */
    var NAME = 'CalendarPlugin';
    var PREFIX = 'calendar-plugin';
    var DATA_KEY = 'calendar_plugin';
    var EVENT_KEY = '.' + DATA_KEY;
    var DATA_API_KEY = '.data-api';

    /**
     * these are possible events that may occure
     * during life cycle of the plugin.
     */
    var Event = {
        REMOVE: 'remove' + EVENT_KEY,
        REMOVED: 'removed' + EVENT_KEY,
        LAUNCH: 'launch' + EVENT_KEY,
        LAUNCHED: 'launched' + EVENT_KEY,
        RELOAD: 'reload' + EVENT_KEY,
        RELOADED: 'reloaded' + EVENT_KEY

        /**
         * here we have possible class names that may occure
         * during the lifecycle of the event.
         */
    };var ClassName = {
        LOADER_SHOW: 'show-loader'

        /**
         * here we have defined the names of the selector names
         * required for selecting different parts of an instantiated
         * calendar plugin.
         */
    };var Selector = {
        CONTAINER: '.' + PREFIX + '-container',
        DATE_CELL: '.' + PREFIX + '-date',
        WEEK_CELL: '.' + PREFIX + '-week',
        MONTH_CELL: '.' + PREFIX + '-month'
    };

    var CalenderPlugin = new function () {
        var self = this;
        self.moment = new moment();

        self.init = function (el, options) {
            self.el = el;
            self.settings = $.extend({
                current_date: self.moment.format('MM/DD/YYYY')
            }, options);

            return self;
        };

        var launch = function launch() {};
    }();

    $.fn[NAME] = CalenderPlugin.init;
})(jQuery);
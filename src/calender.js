(function($){

    /**
     * basic constants we will need within this javascript file
     */
    const NAME                         = 'CalendarPlugin';
    const PREFIX                       = 'calendar-plugin';
    const DATA_KEY                     = 'calendar_plugin';
    const EVENT_KEY                    = '.'+DATA_KEY;
    const DATA_API_KEY                 = '.data-api';

    /**
     * these are possible events that may occure
     * during life cycle of the plugin.
     */
    const Event = {
        REMOVE              : 'remove'+EVENT_KEY,
        REMOVED             : 'removed'+EVENT_KEY,
        LAUNCH              : 'launch'+EVENT_KEY,
        LAUNCHED            : 'launched'+EVENT_KEY,
        RELOAD              : 'reload'+EVENT_KEY,
        RELOADED            : 'reloaded'+EVENT_KEY
    }

    /**
     * here we have possible class names that may occure
     * during the lifecycle of the event.
     */
    const ClassName = {
        LOADER_SHOW               : 'show-loader',
    }

    /**
     * here we have defined the names of the selector names
     * required for selecting different parts of an instantiated
     * calendar plugin.
     */
    const Selector = {
        CONTAINER               : '.'+PREFIX+'-container',
        DATE_CELL               : '.'+PREFIX+'-date',
        WEEK_CELL               : '.'+PREFIX+'-week',
        MONTH_CELL              : '.'+PREFIX+'-month',
    }


    var CalenderPlugin = new function()
    {
        var self = this;
        self.moment = new moment;

        self.init = function(el, options)
        {
            self.el = el;
            self.settings = $.extend({
                current_date: self.moment.format('MM/DD/YYYY')
            }, options);

            return self;
        }

        const launch = function()
        {

        }
    }

    $.fn[NAME] = CalenderPlugin.init;
})(jQuery)
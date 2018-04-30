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
    var EVENTS = {
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
    };var CLASSNAMES = {
        LOADER_SHOW: 'show-loader',
        CONTAINER: PREFIX + '-container',
        CALENDAR: PREFIX + '-calendar',
        HEADER: PREFIX + '-header',
        DATE_CELL: PREFIX + '-date',
        WEEK_CELL: PREFIX + '-week',
        MONTH_HEADING: PREFIX + '-month-heading',
        MONTH_CELL: PREFIX + '-month',
        CONTROLS_CONTAINER: PREFIX + '-control-container',
        MONTH_NAME: PREFIX + '-month-name'

        /**
         * here we have defined the names of the selector names
         * required for selecting different parts of an instantiated
         * calendar plugin.
         */
    };var SELECTORS = {
        CONTAINER: '.' + PREFIX + '-container',
        CALENDAR: '.' + PREFIX + '-calendar',
        HEADER: '.' + PREFIX + '-header',
        DATE_CELL: '.' + PREFIX + '-date',
        WEEK_CELL: '.' + PREFIX + '-week',
        MONTH_HEADING: '.' + PREFIX + '-month-heading',
        MONTH_CELL: '.' + PREFIX + '-month',
        CONTROLS_CONTAINER: '.' + PREFIX + '-control-container',
        MONTH_NAME: '.' + PREFIX + '-month-name'

        /**
         * html templates for all the different parts of the calendar
         */
    };var TEMPLATES = {
        CONTAINER: "<div class='" + CLASSNAMES.CONTAINER + "'>{header}{calendar}</div>",
        MAIN: "<table class='" + CLASSNAMES.CALENDAR + "'><thead>{heading}</thead><tbody>{content}</tbody></table>",
        DAYS_HEADING: "<tr class='" + CLASSNAMES.MONTH_HEADING + "'> <th>Sun</th> <th>Mon</th> <th>Tue</th> <th>Wed</th> <th>Thur</th> <th>Fri</th> <th>Sat</th> </tr>",
        WEEK_ROW: "<tr class='" + CLASSNAMES.WEEK_CELL + "'>{content}</tr>",
        DAY_CELL: "<td class='" + CLASSNAMES.DATE_CELL + "'>{content}</td>",
        HEADER: "<div class='" + CLASSNAMES.HEADER + "'>{left-control}<h3 class='" + CLASSNAMES.MONTH_NAME + "'>{month}</h3>{right-control}</div>",
        CONTROL: "<div class='" + CLASSNAMES.CONTROLS_CONTAINER + " {position}'><button class='' type='submit'>{label}</button></div>"
    };

    /**
     * list of months
     */
    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var CalenderPlugin = new function () {
        var self = this;
        self.moment = new moment();
        self.now = new Date();
        self.settings = {};
        self.year = self.now.getFullYear();;
        self.month = self.now.getMonth();
        self.date = self.now.getDate();
        self.days = [];

        self.init = function (options) {
            self.el = this;
            self.settings = $.extend({
                month: self.now.getMonth() + 1,
                year: self.now.getFullYear(),
                dayStyle: 'short',
                cellMaxHeigh: 100
            }, options);

            if (self.settings.month < 1 || self.settings.month > 12) {
                self.settings.month = 1;
            }

            launch();
            return self;
        };

        var launch = function launch() {
            render(create_view(create_calendar()));
        };

        var render = function render(view) {
            $(self.el).html(view);
            resize_calendar();
            $(window).off('resize', resize_calendar);
            $(window).on('resize', resize_calendar);
        };

        var create_view = function create_view(calendar) {
            var container_tpl = copy_var(TEMPLATES.CONTAINER);
            var header_tpl = copy_var(TEMPLATES.HEADER);
            var calendar_tpl = copy_var(TEMPLATES.MAIN);
            var days_heading_tpl = copy_var(TEMPLATES.DAYS_HEADING);
            var cell_tpl = copy_var(TEMPLATES.DAY_CELL);
            var week_tpl = copy_var(TEMPLATES.WEEK_ROW);
            var left_control = copy_var(TEMPLATES.CONTROL);
            var right_control = copy_var(TEMPLATES.CONTROL);

            var weeks = '';
            // loop through calendar and the access weeks within it
            for (var i = 0; i < calendar.length; i++) {
                var week = '';
                // loop through each week and access the day within it
                for (var j = 0; j < calendar[i].length; j++) {
                    week += cell_tpl.replace('{content}', calendar[i][j]);
                }
                // create week template
                weeks += week_tpl.replace('{content}', week);
            }

            // add content to calendar template
            var calendar_tpl = calendar_tpl.replace('{content}', weeks);
            calendar_tpl = calendar_tpl.replace('{heading}', days_heading_tpl);

            // create controls
            left_control = left_control.replace('{label}', '&larr;');
            left_control = left_control.replace('{position}', '');
            right_control = right_control.replace('{label}', '&rarr;');
            right_control = right_control.replace('{position}', 'right');
            month_name = get_month_name(self.settings.month - 1);

            // configure header
            header_tpl = header_tpl.replace('{left-control}', left_control);
            header_tpl = header_tpl.replace('{right-control}', right_control);
            header_tpl = header_tpl.replace('{month}', month_name + ' ' + self.settings.year);

            // add header to calendar
            container_tpl = container_tpl.replace('{header}', header_tpl);
            // add calender to container
            container_tpl = container_tpl.replace('{calendar}', calendar_tpl);

            // return generated calendar
            return container_tpl;
        };

        var create_calendar = function create_calendar() {
            var days = get_month_days(self.settings.month, self.settings.year);
            var firstDay = new Date(self.settings.year, self.settings.month - 1, 1);
            var startDay = firstDay.getDay();
            return array_chunk(create_month_arrays(startDay, days), 7);
        };

        var create_month_arrays = function create_month_arrays(start, days) {
            var days = [];
            // add days to days array
            for (i = 0; i < 35; i++) {
                if (i >= start && i - start < 31) {
                    // add day to array
                    days.push(i - start + 1);
                } else {
                    // add empty day entry to array
                    days.push('');
                }
            }
            // return days in array
            return days;
        };

        var get_month_days = function get_month_days(month, year) {
            // days number variable
            var days;
            // set 31 days and 30 days months
            var _31Days = ['1', '3', '5', '7', '8', '10', '12'];
            var _30Days = ['4', '6', '9', '11', '8'];

            // get days in the specified month
            if (_31Days.indexOf(month) != -1) days = 31;else if (_30Days.indexOf(month) != -1) days = 30;else if (month === 2) {
                if (is_leap_year(year)) days = 29;else days = 28;
            }

            // return the number of the days for the given month
            return days;
        };

        var is_leap_year = function is_leap_year(year) {
            if (year % 4 == 0) // basic rule
                return true; // is leap year
            /* else */ // else not needed when statement is "return"
            return false; // is not leap year
        };

        var resize_calendar = function resize_calendar() {
            var CONTAINER = SELECTORS.CONTAINER,
                CALENDAR = SELECTORS.CALENDAR,
                WEEK_CELL = SELECTORS.WEEK_CELL,
                DATE_CELL = SELECTORS.DATE_CELL;

            var cells = $(CONTAINER + ' ' + CALENDAR + ' ' + WEEK_CELL + ' ' + DATE_CELL);
            var height = $(cells[0]).outerWidth() > self.settings.cellMaxHeigh ? self.settings.cellMaxHeigh : $(cells[0]).outerWidth();
            cells.css({ height: height + 'px' });
        };

        // utl functions go here
        var array_chunk = function array_chunk(data, chunk_size) {
            var checked_data = [];
            for (var i = 0; i < data.length; i += chunk_size) {
                checked_data.push(data.slice(i, i + chunk_size));
            }
            return checked_data;
        };

        var copy_var = function copy_var(data) {
            return JSON.parse(JSON.stringify(data));
        };

        var get_month_name = function get_month_name(month) {
            // return nuthing if specified month does not exist
            if (MONTHS[month] == undefined) {
                return '';
            }
            // return month
            return MONTHS[month];
        };
    }();

    // initialize plugin
    $.fn[NAME] = CalenderPlugin.init;
})(jQuery);
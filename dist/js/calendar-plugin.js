(function ($) {

    /**
     * basic constants we will need within this javascript file
     */
    var NAME = 'CalendarPlugin';
    var PREFIX = 'cp';
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
        MONTH_CALENDAR: PREFIX + '-calendar-{month}',
        SEASON_CALENDAR: PREFIX + '-calendar-{season}',
        HEADER: PREFIX + '-header',
        HEADER_CONTENT: PREFIX + '-header-content',
        HEADER_OPTIONS_CONTAINER: PREFIX + '-header-options-container',
        HEADER_OPTIONS: PREFIX + '-header-options',
        HEADER_OPTIONS_INNER: PREFIX + '-header-options-inner',
        HEADER_OPTIONS_BUTTONS_CONTAINER: PREFIX + '-header-options-buttons-container',
        HEADER_OPTIONS_BUTTON: PREFIX + '-header-options-button',
        HEADER_OPTIONS_ABOVE: PREFIX + '-header-options-above',
        HEADER_OPTIONS_VISIBLE: PREFIX + '-header-options-visible',
        MONTH_HEADER: PREFIX + '-header-{month}',
        SEASON_HEADER: PREFIX + '-header-{season}',
        DATE_CELL: PREFIX + '-date',
        DATE_DAY: PREFIX + '-day',
        DATE_SELECTED: PREFIX + '-date-selected',
        DATE_CELL_CONTENT: PREFIX + '-date-content',
        WEEK_ROW: PREFIX + '-week',
        WEEK_EVENTS: PREFIX + '-week-events',
        MONTH_HEADING: PREFIX + '-month-heading',
        MONTH_CELL: PREFIX + '-month',
        CONTROLS_CONTAINER: PREFIX + '-control-container',
        MONTH_NAME_BUTTON: PREFIX + '-month-name',
        EMPTY_DAY: PREFIX + '-empty-day',
        EMPTY_DAY_BEGINNING: PREFIX + '-empty-day-beginning',
        EMPTY_DAY_ENDING: PREFIX + '-empty-day-ending',
        ADD_MENU_CONTAINER: PREFIX + '-add-menu',
        ADD_MENU_INNER: PREFIX + '-add-menu-inner',
        ADD_MENU_BUTTONS_CONTAINER: PREFIX + '-add-menu-buttons-container',
        ADD_MENU_BUTTON: PREFIX + '-add-menu-button',
        ADD_MENU_ABOVE: PREFIX + '-add-menu-above',
        ADD_MENU_VISIBLE: PREFIX + '-add-menu-visible',
        EVENTS_CONTAINER_READY: 'ready'

        /**
         * here we have defined the names of the selector names
         * required for selecting different parts of an instantiated
         * calendar plugin.
         */
    };var SELECTORS = {
        BODY: 'body',
        CONTAINER: '.' + PREFIX + '-container',
        CONTAINER_ID: PREFIX + '-container-id',
        CALENDAR: '.' + PREFIX + '-calendar',
        HEADER: '.' + PREFIX + '-header',
        HEADER_CONTENT: '.' + PREFIX + '-header-content',
        HEADER_OPTIONS_CONTAINER: '.' + PREFIX + '-header-options-container',
        HEADER_OPTIONS: '.' + PREFIX + '-header-options',
        HEADER_OPTIONS_INNER: '.' + PREFIX + '-header-options-inner',
        HEADER_OPTIONS_BUTTONS_CONTAINER: '.' + PREFIX + '-header-options-buttons-container',
        HEADER_OPTIONS_BUTTON: '.' + PREFIX + '-header-options-button',
        HEADER_OPTIONS_ABOVE: '.' + PREFIX + '-header-options-above',
        HEADER_OPTIONS_VISIBLE: '.' + PREFIX + '-header-options-visible',
        DATE_CELL: '.' + PREFIX + '-date',
        DATE_DAY: '.' + PREFIX + '-day',
        DATE_SELECTED: '.' + PREFIX + '-date-selected',
        DATE_CELL_CONTENT: '.' + PREFIX + '-date-content',
        WEEK_ROW: '.' + PREFIX + '-week',
        WEEK_EVENTS: '.' + PREFIX + '-week-events',
        MONTH_HEADING: '.' + PREFIX + '-month-heading',
        MONTH_CELL: '.' + PREFIX + '-month',
        CONTROLS_CONTAINER: '.' + PREFIX + '-control-container',
        CONTROL_BUTTONS: '.' + PREFIX + '-control-container > button',
        MONTH_NAME_BUTTON: '.' + PREFIX + '-month-name',
        EMPTY_DAY: '.' + PREFIX + '-empty-day',
        EMPTY_DAY_BEGINNING: '.' + PREFIX + '-empty-day-beginning',
        EMPTY_DAY_ENDING: '.' + PREFIX + '-empty-day-ending',
        ADD_MENU_CONTAINER: '.' + PREFIX + '-add-menu',
        ADD_MENU_INNER: '.' + PREFIX + '-add-menu-inner',
        ADD_MENU_BUTTON: '.' + PREFIX + '-add-menu-button',
        ADD_MENU_BUTTONS_CONTAINER: '.' + PREFIX + '-add-menu-buttons-container',
        EVENT_FORM_MODAL: '.' + PREFIX + '-ef-modal',
        EXPORT_BUTTON: '[data-export="calendar"]'

        /**
         * html templates for all the different parts of the calendar
         */
    };var TEMPLATES = {
        CONTAINER: "<div class='" + CLASSNAMES.CONTAINER + "' id='" + SELECTORS.CONTAINER_ID + "'>{header}{calendar}{event-containers}{add_menu}</div>",
        MAIN: "<table class='" + CLASSNAMES.CALENDAR + " {classnames}'  cellspacing='0' cellpadding='0'><thead>{heading}</thead><tbody>{content}</tbody></table>",
        DAYS_HEADING: "<tr class='" + CLASSNAMES.MONTH_HEADING + "'> <th>Sun</th> <th>Mon</th> <th>Tue</th> <th>Wed</th> <th>Thur</th> <th>Fri</th> <th>Sat</th> </tr>",
        WEEK_ROW: "<tr class='" + CLASSNAMES.WEEK_ROW + "' data-row='{row}'>{content}</tr>",
        DAY_CELL: "<td class='" + CLASSNAMES.DATE_CELL + " {classnames}' data-date='{date}'><div class='" + CLASSNAMES.DATE_CELL_CONTENT + "'>{content}</div></td>",
        HEADER: "<div class='" + CLASSNAMES.HEADER + " {classnames}'>{left-control}" + "<div class='" + CLASSNAMES.HEADER_CONTENT + "'>" + "<div class='" + CLASSNAMES.HEADER_OPTIONS_CONTAINER + "'>" + "<button class='" + CLASSNAMES.MONTH_NAME_BUTTON + "'>{month}<span class='caret'></span></button>" + "<div class='" + CLASSNAMES.HEADER_OPTIONS + "' id='headerOptionsComponent'><div class='" + CLASSNAMES.HEADER_OPTIONS_INNER + "'><div class='" + CLASSNAMES.HEADER_OPTIONS_BUTTONS_CONTAINER + "'><a class='" + CLASSNAMES.HEADER_OPTIONS_BUTTON + "' href='javascript:;' data-export='calendar' data-format='pdf'>Export to .pdf</a><a class='" + CLASSNAMES.HEADER_OPTIONS_BUTTON + "' href='javascript:;' data-export='calendar' data-format='docx'>Export to .docx</a></div><span class='caret'></span></div></div>" + "</div>" + "</div>" + "{right-control}</div>",
        CONTROL: "<div class='" + CLASSNAMES.CONTROLS_CONTAINER + " {position}'><button class='' type='submit' {direction}>{label}</button></div>",
        ADD_MENU: "<div class='" + CLASSNAMES.ADD_MENU_CONTAINER + "' id='addMenuComponent'><div class='" + CLASSNAMES.ADD_MENU_INNER + "'><div class='" + CLASSNAMES.ADD_MENU_BUTTONS_CONTAINER + "'><button class='" + CLASSNAMES.ADD_MENU_BUTTON + "' type='button' data-action='add-event'>Add Event</button><button class='" + CLASSNAMES.ADD_MENU_BUTTON + " cancel' data-action='cancel' type='button'>Cancel</button></div><span class='caret'></span></div></div>",
        EVENTS_CONTAINER: "<div class='" + CLASSNAMES.WEEK_EVENTS + "' data-row='{row}'></div>"
    };

    /**
     * the seasons of the year
     */
    var SEASONS = {
        spring: {
            display_name: 'Spring',
            months: [3, 4, 5, 6]
        },
        summer: {
            display_name: 'Summer',
            months: [7, 8, 9]
        },
        fall: {
            display_name: 'Fall',
            months: [10, 11]
        },
        winter: {
            display_name: 'Winter',
            months: [12, 1, 2]
        }
    };

    /**
     * list of months
     */
    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var CalenderPlugin = new function () {
        var self = this;
        self.moment = new moment();
        self.now = new Date();
        self.selection = [];
        self.modal = null;
        self.editModal = null;
        self.events = [];
        self.eventInstances = [];

        // plugin settings
        self.settings = {};

        // initializer
        self.init = function (options) {
            self.el = this;
            self.settings = $.extend({
                month: self.now.getMonth() + 1,
                year: self.now.getFullYear(),
                dayStyle: 'short',
                cellMaxHeigh: 150,
                respData: 'data',
                // reference to event data
                id: 'id',
                title: 'title',
                startDate: 'startDate',
                endDate: 'endDate',
                startTime: 'startTime',
                endTime: 'endTime',
                creatRequest: null,
                editRequest: null
            }, options);

            // configure seasons
            var seasons = $.extend(SEASONS, options ? options.seasons : {});

            // add seasons to settings
            self.settings.seasons = seasons;

            // ensure month is with in the 1 - 12 range
            if (self.settings.month < 1 || self.settings.month > 12) {
                self.settings.month = 1;
            }

            launch();
            return self;
        };

        var launch = function launch() {
            // render calender
            render();

            // create new event modal
            self.modal = new CPEventFormModal('new-event' + self.now.getTime(), {
                url: self.settings.createUrl || self.settings.url || null,
                data: self.settings.data,
                headers: self.settings.headers,
                onSaved: refresh_calendar_events,
                requestStruct: self.settings.creatRequest || null
            });
            self.modal.render();

            // edit new event modal
            self.editModal = new CPEventFormModal('edit-event' + self.now.getTime(), {
                editting: true,
                url: self.settings.editUrl || self.settings.url || null,
                deleteUrl: self.settings.deleteUrl || self.settings.url || null,
                data: self.settings.data,
                headers: self.settings.headers,
                onSaved: refresh_calendar_events,
                onDelete: refresh_calendar_events,
                requestStruct: self.settings.editRequest || null
            });
            self.editModal.render();
        };

        var render = function render() {
            if ($(self.el).find(SELECTORS.CONTAINER).length > 0) {
                $(self.el).find(SELECTORS.CONTAINER).fadeOut(200, function () {
                    $(self.el).html('');
                    $(create_view(create_calendar())).hide().prependTo($(self.el)).fadeIn(200, function () {
                        refresh_calendar_events();
                    }).call(start);
                });
            } else {
                $(create_view(create_calendar())).hide().prependTo($(self.el)).fadeIn(200, function () {
                    refresh_calendar_events();
                }).call(start);
            }
        };

        var render_events = function render_events() {
            // destroy old events first
            destroy_events();

            var CALENDAR = SELECTORS.CALENDAR,
                WEEK_ROW = SELECTORS.WEEK_ROW,
                WEEK_EVENTS = SELECTORS.WEEK_EVENTS,
                DATE_CELL = SELECTORS.DATE_CELL,
                weeks = $(CALENDAR).find(WEEK_ROW),
                week,
                eventsContainer,
                eventObj;


            for (var i = 0; i < self.events.length; i++) {
                var event = self.events[i];
                for (var j = 0; j < weeks.length; j++) {
                    week = weeks.eq(j);
                    if (is_in_week(week, event)) {
                        eventsContainer = $(WEEK_EVENTS + '[data-row="' + week.attr('data-row') + '"]');
                        // console.log(week);
                        // console.log(eventsContainer);
                        // console.log('______________');
                        eventObj = new CPEvent(event, eventsContainer, week, DATE_CELL, {
                            onClick: handle_event_click
                        });
                        eventObj.render();
                        self.eventInstances.push(eventObj);
                    }
                }
            }

            reposition_event_containers();
        };

        var destroy_events = function destroy_events() {
            for (var i = 0; i < self.eventInstances.length; i++) {
                var eventInstance = self.eventInstances[i];
                eventInstance.destroy();
            }
            self.eventInstances = [];
        };

        var start = function start() {
            // get required selectors
            var CONTAINER = SELECTORS.CONTAINER,
                ADD_MENU_BUTTON = SELECTORS.ADD_MENU_BUTTON,
                EXPORT_BUTTON = SELECTORS.EXPORT_BUTTON;

            // resize calendar

            resize_calendar();

            // resize calendar when window resizes
            $(window).off('resize', resize_calendar);
            $(window).on('resize', resize_calendar);

            // reposition empty cells background
            reposition_cell_background();

            // reposition empty cells background when window resizes
            $(window).off('resize', reposition_cell_background);
            $(window).on('resize', reposition_cell_background);

            // reposition events and event containers when window resizes
            $(window).off('resize', reposition_event_containers);
            $(window).on('resize', reposition_event_containers);

            // listen for click on add menu buttons
            $(CONTAINER).find(ADD_MENU_BUTTON).off('click', handle_add_menu_button_click);
            $(CONTAINER).find(ADD_MENU_BUTTON).on('click', handle_add_menu_button_click);

            // listen for click on export button
            $(CONTAINER).find(EXPORT_BUTTON).off('click', export_to);
            $(CONTAINER).find(EXPORT_BUTTON).on('click', export_to);

            // listen for control button click event
            listen_for_control_button_click();

            // listen for date select
            listen_for_date_select();

            // update calendar with selection
            update_Selection();
        };

        var create_view = function create_view(calendar) {
            var container_tpl = copy_var(TEMPLATES.CONTAINER);
            var header_tpl = copy_var(TEMPLATES.HEADER);
            var calendar_tpl = copy_var(TEMPLATES.MAIN);
            var days_heading_tpl = copy_var(TEMPLATES.DAYS_HEADING);
            var cell_tpl = copy_var(TEMPLATES.DAY_CELL);
            var week_tpl = copy_var(TEMPLATES.WEEK_ROW);
            var ev_container_tpl = copy_var(TEMPLATES.EVENTS_CONTAINER);
            var left_control = copy_var(TEMPLATES.CONTROL);
            var right_control = copy_var(TEMPLATES.CONTROL);
            var add_menu = copy_var(TEMPLATES.ADD_MENU);
            var month_name = get_month_name(self.settings.month - 1);
            var season = get_season();
            var weeks = '';
            var event_containers = '';

            // loop through calendar and the access weeks within it
            for (var i = 0; i < calendar.length; i++) {
                var week = '';
                // loop through each week and access the day within it
                for (var j = 0; j < calendar[i].length; j++) {
                    // class names container for dat cell
                    var classnames = '';

                    var dayNum = calendar[i][j].toString();
                    var prevDayNum = calendar[i][j - 1] ? calendar[i][j - 1].toString() : '';

                    // create day html
                    var day = cell_tpl.replace('{content}', calendar[i][j]);

                    // modify empty days
                    if (dayNum.length < 1) {
                        // add empty day class to empty days
                        classnames += ' ' + CLASSNAMES.EMPTY_DAY + ' ';

                        // add beginning class to first empty day
                        if (j == 0 && dayNum.length < 1) classnames += ' ' + CLASSNAMES.EMPTY_DAY_BEGINNING + ' ';

                        // add ending class to last empty day
                        if (prevDayNum && get_month_days() == prevDayNum.trim()) classnames += ' ' + CLASSNAMES.EMPTY_DAY_ENDING + ' ';

                        // make dat attribute empty
                        day = day.replace('{date}', '');
                    } else {
                        // add class to show that day is not empty
                        classnames += ' ' + CLASSNAMES.DATE_DAY;

                        // create new date object from current dat
                        var d = new Date(self.settings.month + '/' + calendar[i][j] + '/' + self.settings.year);

                        // fill date attribute with current date
                        day = day.replace('{date}', d.getTime());
                    }

                    // add class names to day
                    day = day.replace('{classnames}', classnames);

                    // add day to week
                    week += day;
                }
                // create week template
                var curr_week_tpl = copy_var(week_tpl);
                curr_week_tpl = curr_week_tpl.replace('{row}', i + 1);
                event_containers += ev_container_tpl.replace('{row}', i + 1);

                weeks += curr_week_tpl.replace('{content}', week);
            }

            // create calendar from template
            var calenderClassnames = '';
            calenderClassnames += ' ' + CLASSNAMES.MONTH_CALENDAR.replace('{month}', month_name.toLowerCase()) + ' ';
            calenderClassnames += ' ' + CLASSNAMES.SEASON_CALENDAR.replace('{season}', season ? season.name : '') + ' ';
            var calendar_tpl = calendar_tpl.replace('{content}', weeks);
            calendar_tpl = calendar_tpl.replace('{heading}', days_heading_tpl);
            calendar_tpl = calendar_tpl.replace('{classnames}', calenderClassnames);

            // create controls
            left_control = left_control.replace('{label}', '&larr;');
            left_control = left_control.replace('{position}', '');
            left_control = left_control.replace('{direction}', 'left');
            right_control = right_control.replace('{label}', '&rarr;');
            right_control = right_control.replace('{position}', 'right');
            right_control = right_control.replace('{direction}', 'right');

            // create calendar header from template
            var headerClassnames = '';
            headerClassnames += ' ' + CLASSNAMES.MONTH_HEADER.replace('{month}', month_name.toLowerCase()) + ' ';
            headerClassnames += ' ' + CLASSNAMES.SEASON_HEADER.replace('{season}', season ? season.name : '') + ' ';
            header_tpl = header_tpl.replace('{left-control}', left_control);
            header_tpl = header_tpl.replace('{right-control}', right_control);
            header_tpl = header_tpl.replace('{month}', month_name + ' ' + self.settings.year);
            header_tpl = header_tpl.replace('{classnames}', headerClassnames);

            // add header to calendar
            container_tpl = container_tpl.replace('{header}', header_tpl);
            // add calender to container
            container_tpl = container_tpl.replace('{calendar}', calendar_tpl);
            // add event containers
            container_tpl = container_tpl.replace('{event-containers}', event_containers);
            // add, add menu
            container_tpl = container_tpl.replace('{add_menu}', add_menu);

            // return generated calendar
            return container_tpl;
        };

        var create_calendar = function create_calendar() {
            var days = get_month_days(self.settings.month, self.settings.year);
            var firstDay = new Date(self.settings.year, self.settings.month - 1, 1);
            var startDay = firstDay.getDay();
            return array_chunk(create_month_arrays(startDay, days), 7);
        };

        var create_month_arrays = function create_month_arrays(start, maxDays) {
            var days = [];
            // add days to days array
            for (i = 0; i < 35; i++) {
                if (i >= start && i - start < maxDays) {
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
            // create month number as string
            var monthStr = typeof month == 'number' ? month.toString() : month;

            // days number variable
            var days;

            // set 31 days and 30 days months
            var _31Days = ['1', '3', '5', '7', '8', '10', '12'];
            var _30Days = ['4', '6', '9', '11', '8'];

            // get days in the specified month
            if (_31Days.indexOf(monthStr) != -1) days = 31;else if (_30Days.indexOf(monthStr) != -1) days = 30;else if (month == 2) {
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
                WEEK_ROW = SELECTORS.WEEK_ROW,
                DATE_CELL = SELECTORS.DATE_CELL,
                DATE_CELL_CONTENT = SELECTORS.DATE_CELL_CONTENT;

            var cells = $(CONTAINER + ' ' + CALENDAR + ' ' + WEEK_ROW + ' ' + DATE_CELL);
            var height = $(cells[0]).outerWidth() > self.settings.cellMaxHeigh ? self.settings.cellMaxHeigh : $(cells[0]).outerWidth();
            cells.find(DATE_CELL_CONTENT).css({ height: height + 'px' });
            reposition_addmenu();
        };

        var reposition_cell_background = function reposition_cell_background() {
            var CONTAINER = SELECTORS.CONTAINER,
                CALENDAR = SELECTORS.CALENDAR,
                WEEK_ROW = SELECTORS.WEEK_ROW,
                DATE_CELL = SELECTORS.DATE_CELL;

            var cells = $(CONTAINER + ' ' + CALENDAR + ' ' + WEEK_ROW + ' ' + DATE_CELL);
            var width = $(cells[0]).outerWidth();
            var bgDistance = 0;

            for (var i = 0; i < cells.length; i++) {
                // get sell from cells list
                var cell = cells.eq(i);

                // empty days 
                if (cell.hasClass(CLASSNAMES.EMPTY_DAY)) {
                    // set background position
                    var bgPosition = bgDistance * width;
                    bgPosition = bgPosition <= 0 ? 0 : -bgPosition;

                    // set background x position
                    cell.css({ backgroundPosition: bgPosition + 'px' + " 0px" });

                    // increment bg distance
                    bgDistance++;
                }
            }
        };

        var listen_for_control_button_click = function listen_for_control_button_click() {
            // copy selector name
            var BUTTONS = copy_var(SELECTORS.CONTROL_BUTTONS);
            $(BUTTONS).off('click', handle_control_button_click);
            $(BUTTONS).on('click', handle_control_button_click);
        };

        var handle_control_button_click = function handle_control_button_click(ev) {
            // get target element
            var el = ev.target;
            var left = $(el).attr('left');
            var right = $(el).attr('right');
            var settings = copy_var(self.settings);

            // determine what direction to go to
            if (left != undefined) {
                // set year
                settings.year = settings.month <= 1 ? settings.year - 1 : settings.year;
                // set month
                settings.month = settings.month <= 1 ? settings.month = 12 : settings.month - 1;
            } else if (right != undefined) {
                // set year
                settings.year = settings.month >= 12 ? settings.year + 1 : settings.year;
                // set month
                settings.month = settings.month >= 12 ? settings.month = 1 : settings.month + 1;
            }

            // update object settings
            self.settings = $.extend(self.settings, settings);

            // rerender calendar
            launch();
        };

        var handle_add_menu_button_click = function handle_add_menu_button_click(ev) {
            // get required selectors
            var CONTAINER = SELECTORS.CONTAINER,
                ADD_MENU_BUTTON = SELECTORS.ADD_MENU_BUTTON;

            // turn click event listener off

            $(CONTAINER).find(ADD_MENU_BUTTON).off('click', handle_add_menu_button_click);

            // get element
            var el = $(ev.currentTarget);
            var action = el.attr('data-action');
            switch (action) {
                case 'add-event':
                    // pop up modal
                    add_event();
                    break;
                case 'cancel':
                    // cancel selection
                    cancel_selection();
                    break;
                default:
                    // do nothing
                    break;
            }

            // start listening for click events on add menu buttons again
            start();
        };

        var add_event = function add_event() {
            // get start and end
            var start = self.selection.length > 0 ? self.selection[0] : null;
            var end = self.selection.length > 1 ? self.selection[1] : start;
            // only continue if start is not null
            if (start == null) return;

            // create start and end date
            var startDate = new Date(start);
            var endDate = new Date(end);

            // create new event data
            var data = {
                startDate: startDate,
                endDate: endDate
            };

            // show modal
            self.modal.show(data);

            // calcel selection
            cancel_selection();
        };

        var cancel_selection = function cancel_selection() {
            self.selection = [];
            update_Selection();
        };

        var handle_event_click = function handle_event_click(event) {
            // create start and end date
            var startDate = new Date(event.startDate);
            var endDate = new Date(event.endDate);

            // create new event data
            var data = {
                title: event.title,
                startDate: startDate,
                endDate: endDate,
                startTime: event.startTime,
                endTime: event.endTime
            };

            self.editModal.show(data, event.id);
        };

        var listen_for_date_select = function listen_for_date_select() {
            var DATE_DAY = SELECTORS.DATE_DAY;

            $(DATE_DAY).off('click', handle_date_select);
            $(DATE_DAY).on('click', handle_date_select);
        };

        var handle_date_select = function handle_date_select(ev) {
            // turn off click event listener
            var DATE_DAY = SELECTORS.DATE_DAY;

            $(DATE_DAY).off('click', handle_date_select);

            // get element and date
            var el = ev.currentTarget;
            var date = $(el).attr('data-date');
            var start = self.selection.length > 0 ? self.selection[0] : 0;
            var end = self.selection.length > 1 ? self.selection[1] : start;
            if (date != undefined) {
                date = parseInt(date);
                if (start < 1 || start > 0 && date < start) {
                    // make start date equal to date
                    self.selection[0] = date;
                } else if (date == start && end == start) {
                    // reset 
                    self.selection = [];
                } else if (date == start) {
                    self.selection = [start];
                } else {
                    self.selection[1] = date;
                }
            }

            // listen for click event again
            listen_for_date_select();

            // update the selected dates on calendar
            update_Selection();
        };

        var update_Selection = function update_Selection() {
            var CALENDAR = SELECTORS.CALENDAR,
                DATE_DAY = SELECTORS.DATE_DAY;
            var DATE_SELECTED = CLASSNAMES.DATE_SELECTED;

            var days = $(CALENDAR).find(DATE_DAY);
            var start = self.selection.length > 0 ? self.selection[0] : 0;
            var end = self.selection.length > 1 ? self.selection[1] : start;
            if (days && days.length > 0) {
                for (var i = 0; i < days.length; i++) {
                    // get element and date
                    var el = days.eq(i);
                    var date = $(el).attr('data-date');

                    // skip if date attribute is undefined
                    if (date == undefined) continue;

                    // convert date time string to integer
                    date = parseInt(date);

                    // determine current date is within selected range
                    var select = date >= start && date <= end;

                    if (select) {
                        // if the element does not have the selected class
                        if (!$(el).hasClass(DATE_SELECTED)) {
                            // add selected class to element
                            $(el).addClass(DATE_SELECTED);
                        }
                    } else // if date is found in selection
                        {
                            // if the element has the selected class
                            if ($(el).hasClass(DATE_SELECTED)) {
                                // remove selected class from element
                                $(el).removeClass(DATE_SELECTED);
                            }
                        }
                }
            }
            toggle_add_menu_visiblity();
        };

        var toggle_add_menu_visiblity = function toggle_add_menu_visiblity() {
            // get plugin html selector references
            var CONTAINER = SELECTORS.CONTAINER,
                ADD_MENU_CONTAINER = SELECTORS.ADD_MENU_CONTAINER,
                DATE_SELECTED = SELECTORS.DATE_SELECTED;
            // get required classnames

            var ADD_MENU_VISIBLE = CLASSNAMES.ADD_MENU_VISIBLE;

            // select elements

            var container = $(CONTAINER);
            var selected = container.find(DATE_SELECTED);
            var addMenuEl = container.find(ADD_MENU_CONTAINER);

            // toggle visibility
            if (selected && selected.length > 0) {
                if (!addMenuEl.hasClass(ADD_MENU_VISIBLE)) {
                    addMenuEl.addClass(ADD_MENU_VISIBLE);
                }
            } else {
                if (addMenuEl.hasClass(ADD_MENU_VISIBLE)) {
                    addMenuEl.removeClass(ADD_MENU_VISIBLE);
                }
            }

            // reposition add menu
            reposition_addmenu();
        };

        var reposition_addmenu = function reposition_addmenu() {
            // get plugin html selector references
            var ADD_MENU_CONTAINER = SELECTORS.ADD_MENU_CONTAINER,
                DATE_CELL_CONTENT = SELECTORS.DATE_CELL_CONTENT,
                CONTAINER = SELECTORS.CONTAINER;
            var ADD_MENU_ABOVE = CLASSNAMES.ADD_MENU_ABOVE;

            // get end element

            var end = get_selection_end_cell();
            var container = $(CONTAINER);
            var addMenuEl = container.find(ADD_MENU_CONTAINER);
            var viewport = get_viewport();

            if (end != null && end != undefined) {
                var offset = end.offset();
                var left = offset ? offset.left : 0;
                var top = offset ? offset.top + end.outerHeight() - 10 : 0;

                if (end.outerWidth() > addMenuEl.outerWidth()) {
                    left = left + (end.outerWidth() - addMenuEl.outerWidth()) / 2;
                } else {
                    left = left - (addMenuEl.outerWidth() - end.outerWidth()) / 2;
                }

                if (addMenuEl.outerHeight() + top > viewport.height) {
                    top = offset ? offset.top - addMenuEl.outerHeight() + 10 : 0;
                    if (!addMenuEl.hasClass(ADD_MENU_ABOVE)) {
                        addMenuEl.addClass(ADD_MENU_ABOVE);
                    }
                } else {
                    if (addMenuEl.hasClass(ADD_MENU_ABOVE)) {
                        addMenuEl.removeClass(ADD_MENU_ABOVE);
                    }
                }

                // add css positions to element
                addMenuEl.css({ 'top': top, 'left': left });
            }
        };

        var reposition_event_containers = function reposition_event_containers() {
            // get plugin html selector references
            var CONTAINER = SELECTORS.CONTAINER,
                CALENDAR = SELECTORS.CALENDAR,
                WEEK_EVENTS = SELECTORS.WEEK_EVENTS,
                WEEK_ROW = SELECTORS.WEEK_ROW,
                EVENTS_CONTAINER_READY = CLASSNAMES.EVENTS_CONTAINER_READY,
                eventContainers = $(CONTAINER).find(WEEK_EVENTS),
                eventsContainer,
                week,
                weekPosition,
                weekWidth,
                weekHeight,
                calendarPosition = $(CALENDAR).position(),
                container = $(CONTAINER),
                containerHeight = container.outerHeight(),
                bottom;


            for (var i = 0; i < eventContainers.length; i++) {
                // get events container
                eventsContainer = eventContainers.eq(i);

                // 
                var children = eventsContainer.children('button.cp-ev-event');

                // get week
                week = $(CALENDAR).find(WEEK_ROW + '[data-row="' + eventsContainer.attr('data-row') + '"]');
                // console.log(week);
                // console.log(eventsContainer);
                // console.log('______________');
                weekPosition = week.position();
                weekWidth = week.outerWidth;
                weekHeight = week.outerHeight();
                bottom = containerHeight - (calendarPosition.top + weekPosition.top) - weekHeight + 10;
                if (children.length > 0) {
                    var childrenHeight = children.first().outerHeight() * children.length;
                    bottom = bottom + childrenHeight;
                }

                // apply new styles to events container
                eventsContainer.css({
                    left: weekPosition.left,
                    bottom: bottom,
                    width: weekWidth
                });
            }

            // reposition events
            reposition_events();

            // make events visible
            // eventContainers.addClass(EVENTS_CONTAINER_READY);
        };

        var reposition_events = function reposition_events() {
            for (var i = 0; i < self.eventInstances.length; i++) {
                var eventInstance = self.eventInstances[i];
                eventInstance.reposition();
            }
        };

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

        var get_season = function get_season() {
            for (var name in self.settings.seasons) {
                // get season
                var season = self.settings.seasons[name];

                // skip season if not supported
                if (season == null) continue;

                // skip if month is not season
                if (season.months.indexOf(self.settings.month) == -1) continue;

                // return season info
                return {
                    name: name,
                    display_name: season.display_name
                };
            }

            return null;
        };

        var get_selection_end_cell = function get_selection_end_cell() {
            // get end date from selection
            var start = self.selection.length > 0 ? self.selection[0] : null;
            var end = self.selection.length > 1 ? self.selection[1] : start;

            // get plugin html selector references
            var CONTAINER = SELECTORS.CONTAINER,
                DATE_SELECTED = SELECTORS.DATE_SELECTED;

            // select end element if an end date is set

            if (end) {
                end = $(CONTAINER).find(DATE_SELECTED).last();
            }

            // return end
            return end;
        };

        var get_viewport = function get_viewport() {
            var width = $(document).outerWidth();
            var height = $(document).outerHeight();
            return { width: width, height: height };
        };

        var refresh_calendar_events = function refresh_calendar_events() {
            // cancel ongoing get requests
            if (getEventsRequest && getEventsRequest.readyState != 4) {
                getEventsRequest.abort();
            }

            // get url
            var url = self.settings.list_url || self.settings.url || null;

            // stop if url is not set
            if (!url) return;

            // join default data and form data
            var data = $.extend({}, self.settings.data, {
                month: self.settings.month,
                year: self.settings.year
            });

            // join default headers with custom headers
            var headers = $.extend({}, self.settings.headers);

            // get event
            var getEventsRequest = $.ajax({
                url: url,
                method: 'GET',
                data: data,
                headers: headers
            }).done(refresh_calendar_events_done).fail(refresh_calendar_events_fail);
        };

        var refresh_calendar_events_done = function refresh_calendar_events_done(resp) {
            // get the events
            self.events = get_events_data(resp);
            // render events
            render_events();
        };

        var refresh_calendar_events_fail = function refresh_calendar_events_fail(err) {
            if (err.statusText != 'abort') {
                var message = 'Failed to load events.';
                var message = err.message && err.message.length > 0 ? err.message : message;
                // alert(message);
            }
        };

        var get_events_data = function get_events_data(data) {
            if (self.settings.respData === null) return data;

            if (typeof self.settings.respData != 'string') {
                console.error(new Error('Data path invalid, please contact system\'s admin.'));
                return data;
            }

            var dataPath = copy_var(self.settings.respData);
            dataPath = dataPath.trim();
            dataPath = dataPath.split('.');

            var events = copy_var(data);

            for (var i = 0; i < dataPath.length; i++) {
                if (!events.hasOwnProperty(dataPath[i])) continue;
                events = events[dataPath[i]];
            }

            if (events) {
                for (var i = 0; i < events.length; i++) {
                    events[i] = transform_data(events[i]);
                }
            }

            return events;
        };

        var transform_data = function transform_data(data) {
            var transform = {
                id: find_data(data, self.settings.id),
                title: find_data(data, self.settings.title),
                startDate: find_data(data, self.settings.startDate),
                endDate: find_data(data, self.settings.endDate),
                startTime: find_data(data, self.settings.startTime),
                endTime: find_data(data, self.settings.endTime)
            };
            return transform;
        };

        var find_data = function find_data(data, key) {
            if (typeof key != 'string') {
                console.error(new Error('Data path invalid, please contact system\'s admin.'));
                return data;
            }

            var dataPath = copy_var(key);
            dataPath = dataPath.trim();
            dataPath = dataPath.split('.');

            var found = copy_var(data);
            var didFind = false;

            for (var i = 0; i < dataPath.length; i++) {
                if (!found.hasOwnProperty(dataPath[i])) continue;
                found = found[dataPath[i]];
                didFind = true;
            }

            return didFind ? found : null;
        };

        var is_in_week = function is_in_week(week, event) {
            // define variables
            var DATE_CELL = SELECTORS.DATE_CELL,
                cells = week.find(DATE_CELL),
                found = false,
                startDate = new Date(event.startDate),
                endDate = new Date(event.endDate),
                cellDate,
                cell;


            for (var i = 0; i < cells.length; i++) {
                cell = cells.eq(i);
                cellDate = parseInt(cell.attr('data-date'));

                // if current cell date is within event date range
                if (startDate.getTime() == cellDate || startDate.getTime() <= cellDate && endDate.getTime() >= cellDate) {
                    // set found to true and break loop
                    found = true;
                    break;
                }
            }

            return found;
        };

        var export_to = function export_to(ev) {
            ev.preventDefault();
            var el = $(ev.currentTarget),
                CONTAINER = SELECTORS.CONTAINER,
                CONTAINER_ID = SELECTORS.CONTAINER_ID,
                format = el.attr('data-format'),
                target = $('#' + CONTAINER_ID);


            if (format == 'pdf') {
                html2canvas(target, {
                    onrendered: function onrendered(canvas) {
                        var imgData = canvas.toDataURL('image/png');
                        var doc = new jsPDF('p', 'mm');
                        doc.addImage(imgData, 'PNG', 10, 10);
                        doc.save('sample-file.pdf');
                    }
                });
            } else if (format == 'docx') {}
        };
    }();

    // initialize plugin
    $.fn[NAME] = CalenderPlugin.init;

    /**
     * This simply allows for adding the call method to jquery
     * when chaining methods
     * @param {function} fn 
     * @param {any} args 
     * @param {object} thisp 
     */
    $.fn.call = function (fn, args, thisp) {
        fn.apply(thisp || this, args);
        return this;
    };
})(jQuery);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CPEventFormModal = function () {
    _createClass(CPEventFormModal, [{
        key: 'SELECTORS',

        /**
         * selectors used within this class
         */
        value: function SELECTORS() {
            return {
                BODY: 'body',
                FORM: '.' + this.PREFIX + '-form',
                FIELDSET: 'fieldset',
                MODAL: '.' + this.PREFIX + '-modal',
                BUTTON: '.' + this.PREFIX + '-button',
                TITLE: 'input[name="event-title"]',
                END_TIME: 'input[name="end-time"]',
                END_DATE: 'input[name="end-date"]',
                START_DATE: 'input[name="start-date"]',
                START_TIME: 'input[name="start-time"]',
                ERROR_CONTAINER: '.' + this.PREFIX + '-error-container'
            };
        }

        /**
         * class names used within the component
         */

    }, {
        key: 'CLASSNAMES',
        value: function CLASSNAMES() {
            return {
                SHOW: 'show',
                CANCEL: 'cancel',
                SAVE: 'save',
                DELETE: 'delete'
            };
        }
    }]);

    function CPEventFormModal(uniqueID, options) {
        _classCallCheck(this, CPEventFormModal);

        this.uniqueID = uniqueID;
        this.id = null;
        this.modal = null;
        this.PREFIX = 'cp-ef';
        this.options = $.extend({
            url: null,
            edit: false,
            onWillShow: null,
            onShown: null,
            onWillHide: null,
            onHidden: null,
            onDelete: null
        }, options);

        // bind methods
        this.html = this.html.bind(this);
        this.render = this.render.bind(this);
        this.SELECTORS = this.SELECTORS.bind(this);
        this.CLASSNAMES = this.CLASSNAMES.bind(this);
        this.componentDidRender = this.componentDidRender.bind(this);
    }

    _createClass(CPEventFormModal, [{
        key: 'componentDidRender',
        value: function componentDidRender() {
            // reset/set modal
            this.modal = $('#' + this.uniqueID);
            // reset/set listeners
            this.listeners();
            // initialize date pickers
            this.initializePickers();
        }
    }, {
        key: 'render',
        value: function render() {
            // required selectors
            var _SELECTORS = this.SELECTORS(),
                MODAL = _SELECTORS.MODAL,
                BODY = _SELECTORS.BODY;

            // select modal


            var modal = $('#' + this.uniqueID);

            // remove modal if exists
            if (modal.length > 0) {
                modal.remove();
            }

            // render new form
            $(this.html()).attr('id', this.uniqueID).appendTo(BODY);

            // fire component did render
            this.componentDidRender();
        }
    }, {
        key: 'html',
        value: function html() {
            return "<div class='" + this.PREFIX + "-modal'>" + "<div class='" + this.PREFIX + "-backdrop'>&nbsp;</div>" + "<div class='" + this.PREFIX + "-content'>" + "<div class='" + this.PREFIX + "-dialog'>" + "<form action='javascript:;' class='" + this.PREFIX + "-form' method='POST'>" + "<fieldset>" + "<p class='" + this.PREFIX + "-error " + this.PREFIX + "-error-container'></p>" + "<div class='" + this.PREFIX + "-group'>" + "<div class='" + this.PREFIX + "-control'>" + "<input type='text' name='event-title' class='" + this.PREFIX + "-title' placeholder='Event title...' />" + "</div>" + "</div>" + "<div class='" + this.PREFIX + "-group'>" + "<div class='" + this.PREFIX + "-control'>" + "<label for='start-date'>Start Date</label>" + "<input type='text' name='start-date' placeholder='MM/DD/YYYY' />" + "</div>" + "<div class='" + this.PREFIX + "-control'>" + "<label for='end-date'>End Date</label>" + "<input type='text' name='end-date' placeholder='MM/DD/YYYY' />" + "</div>" + "</div>" + "<div class='" + this.PREFIX + "-group'>" + "<div class='" + this.PREFIX + "-control'>" + "<label for='start-time'>Start Time</label>" + "<input type='time' name='start-time' placeholder='hh:mm AM/PM' />" + "</div>" + "<div class='" + this.PREFIX + "-control'>" + "<label for='end-time'>End Time</label>" + "<input type='time' name='end-time' placeholder='hh:mm AM/PM' />" + "</div>" + "</div>" + "<div class='" + this.PREFIX + "-actions'>" + this.delete_button() + "<button type='button' class='" + this.PREFIX + "-button cancel'>Cancel</button>" + "<button type='submit' class='" + this.PREFIX + "-button save'>Save</button>" + "</div>" + "</fieldset>" + "</form>" + "</div>" + "</div>" + "</div>";
        }
    }, {
        key: 'listeners',
        value: function listeners() {
            var _SELECTORS2 = this.SELECTORS(),
                BUTTON = _SELECTORS2.BUTTON,
                FORM = _SELECTORS2.FORM;
            // listen for button clicks


            this.modal.find(BUTTON).off('click', this.handle_button_click.bind(this));
            this.modal.find(BUTTON).on('click', this.handle_button_click.bind(this));
            // listen for form submit
            this.modal.find(FORM).off('submit', this.handle_form_submit.bind(this));
            this.modal.find(FORM).on('submit', this.handle_form_submit.bind(this));
            // check for when for transition ends
            this.modal.find(FORM).off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', this.handle_form_transition_end.bind(this));
            this.modal.find(FORM).on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', this.handle_form_transition_end.bind(this));
        }
    }, {
        key: 'initializePickers',
        value: function initializePickers() {
            var _SELECTORS3 = this.SELECTORS(),
                START_DATE = _SELECTORS3.START_DATE,
                END_DATE = _SELECTORS3.END_DATE;
            // initialize start date picker


            this.modal.find(START_DATE).datepicker('destroy');
            this.modal.find(START_DATE).datepicker();

            // initialize end date picker
            this.modal.find(END_DATE).datepicker('destroy');
            this.modal.find(END_DATE).datepicker();
        }
    }, {
        key: 'handle_button_click',
        value: function handle_button_click(ev) {
            var _CLASSNAMES = this.CLASSNAMES(),
                CANCEL = _CLASSNAMES.CANCEL,
                SAVE = _CLASSNAMES.SAVE,
                DELETE = _CLASSNAMES.DELETE;

            var el = $(ev.currentTarget);
            if (el.hasClass(CANCEL)) {
                this.hide();
            }
            if (el.hasClass(DELETE)) {
                this.confirm_delete();
            }
        }
    }, {
        key: 'handle_form_submit',
        value: function handle_form_submit(ev) {
            ev.preventDefault();

            if (this.validate()) {
                // show validation errors
                this.show_validation_error();
                return;
            }

            // hide validation error
            this.hide_validation_error();

            // save changes
            this.save();
        }
    }, {
        key: 'delete_button',
        value: function delete_button() {
            if (this.options.editting) {
                return "<button type='button' class='" + this.PREFIX + "-button delete'>Delete</button>";
            }
            return '';
        }
    }, {
        key: 'handle_form_transition_end',
        value: function handle_form_transition_end(ev) {}
    }, {
        key: 'show',
        value: function show(data, id) {
            if (!this.has_rendered()) return;
            // setTimeout(this.reset.bind(this, data), 1000);
            this.reset(data);
            this.id = id ? id : null;

            var _CLASSNAMES2 = this.CLASSNAMES(),
                SHOW = _CLASSNAMES2.SHOW;

            if (!this.modal.hasClass(SHOW)) {
                this.modal.addClass(SHOW);
            }
        }
    }, {
        key: 'confirm_delete',
        value: function confirm_delete() {
            if (confirm("Are you sure you want to delete, this event?")) ;
            {
                this.delete();
            }
        }
    }, {
        key: 'hide',
        value: function hide() {
            if (!this.has_rendered()) return;

            var _CLASSNAMES3 = this.CLASSNAMES(),
                SHOW = _CLASSNAMES3.SHOW;

            if (this.modal.hasClass(SHOW)) {
                this.modal.removeClass(SHOW);
            }
        }
    }, {
        key: 'has_rendered',
        value: function has_rendered() {
            return this.modal != null && this.modal != undefined && this.modal.length > 0;
        }
    }, {
        key: 'reset',
        value: function reset(data) {
            var _SELECTORS4 = this.SELECTORS(),
                START_DATE = _SELECTORS4.START_DATE,
                END_DATE = _SELECTORS4.END_DATE,
                START_TIME = _SELECTORS4.START_TIME,
                END_TIME = _SELECTORS4.END_TIME,
                TITLE = _SELECTORS4.TITLE;
            // prep form data


            var startDate = data.startDate ? this.format_date(data.startDate) : '';
            var endDate = data.endDate ? this.format_date(data.endDate) : '';
            var startTime = data.startTime || '';
            var endTime = data.endTime || '';
            var title = data.title || '';
            // update form data
            this.modal.find(START_DATE).val(startDate);
            this.modal.find(END_DATE).val(endDate);
            this.modal.find(START_TIME).val(startTime);
            this.modal.find(END_TIME).val(endTime);
            this.modal.find(TITLE).val(title);
            // hode validation error
            this.hide_validation_error();
        }
    }, {
        key: 'format_date',
        value: function format_date(date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return this.leading_zero(month) + '/' + this.leading_zero(day) + '/' + year;
        }
    }, {
        key: 'leading_zero',
        value: function leading_zero(data) {
            // return zero if data type is niether string nur number
            if (typeof data != 'string' && typeof data != 'number') return "0";

            // convert data to string if data is a number
            if (typeof data == 'number') data = data.toString();

            // return data with zero prepended to it
            return data.length > 1 ? data : "0" + data;
        }
    }, {
        key: 'validate',
        value: function validate() {
            if (!this.modal) {
                return 'An unknow error has occured.';
            }
            var form_data = this.get_form_data();

            // validate title
            if (!form_data.title || form_data.title.length < 1) return 'Please enter and event title.';

            // validate start date
            if (!form_data.startDate || form_data.startDate.length < 1) return 'Please select a start date.';
            if (new Date(form_data.startDate) == 'Invalid Date') return 'Start date is not a valid date.';

            // validate end date
            if (!form_data.endDate || form_data.endDate.length < 1) return 'Please select an end date.';
            if (new Date(form_data.endDate) == 'Invalid Date') return 'End date is not a valid date.';

            // validate start time
            if (!form_data.startTime || form_data.startTime.length < 1) return 'Please specify a start time.';
            if (!this.time_regex(form_data.startTime)) return 'Start time invalid. E.g hh:mm AM/PM.';

            // validate end time
            if (!form_data.endTime || form_data.endTime.length < 1) return 'Please specify a end time.';
            if (!this.time_regex(form_data.endTime)) return 'End time invalid. E.g hh:mm AM/PM.';

            // default is false
            return false;
        }
    }, {
        key: 'show_validation_error',
        value: function show_validation_error() {
            // get validation error
            var error = this.validate();

            // stop if there is no validation error
            if (!error) return;

            // get required selectors and class names

            var _SELECTORS5 = this.SELECTORS(),
                FORM = _SELECTORS5.FORM,
                ERROR_CONTAINER = _SELECTORS5.ERROR_CONTAINER;

            var _CLASSNAMES4 = this.CLASSNAMES(),
                SHOW = _CLASSNAMES4.SHOW;

            // get error container


            var error_container = this.modal.find(FORM).find(ERROR_CONTAINER);
            if (!error_container || error_container.length < 1) return;

            // change error text in view
            error_container.text(error);

            // make error container visible if not visible
            if (!error_container.hasClass(SHOW)) error_container.addClass(SHOW);
        }
    }, {
        key: 'hide_validation_error',
        value: function hide_validation_error() {
            // get required selectors and class names
            var _SELECTORS6 = this.SELECTORS(),
                FORM = _SELECTORS6.FORM,
                ERROR_CONTAINER = _SELECTORS6.ERROR_CONTAINER;

            var _CLASSNAMES5 = this.CLASSNAMES(),
                SHOW = _CLASSNAMES5.SHOW;

            // get error container


            var error_container = this.modal.find(FORM).find(ERROR_CONTAINER);
            if (!error_container || error_container.length < 1) return;

            // change error text in view
            error_container.text('');

            // make error container visible if not visible
            if (error_container.hasClass(SHOW)) error_container.removeClass(SHOW);
        }
    }, {
        key: 'disable',
        value: function disable(state) {
            // get selectors
            var _SELECTORS7 = this.SELECTORS(),
                FORM = _SELECTORS7.FORM,
                FIELDSET = _SELECTORS7.FIELDSET,
                BUTTON = _SELECTORS7.BUTTON;
            // convert state to proper type


            state = state ? true : false;
            // toggle editable state
            this.modal.find(FORM).find(FIELDSET).attr('disabled', state);
            this.modal.find(FORM).find(BUTTON).attr('disabled', state);
        }
    }, {
        key: 'time_regex',
        value: function time_regex(time) {
            if (typeof time != 'string') time = time + '';
            var regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            return regex.test(time);
        }
    }, {
        key: 'get_form_data',
        value: function get_form_data() {
            var _SELECTORS8 = this.SELECTORS(),
                START_DATE = _SELECTORS8.START_DATE,
                END_DATE = _SELECTORS8.END_DATE,
                START_TIME = _SELECTORS8.START_TIME,
                END_TIME = _SELECTORS8.END_TIME,
                TITLE = _SELECTORS8.TITLE;
            // get form values


            return {
                title: this.modal.find(TITLE).val(),
                startDate: this.modal.find(START_DATE).val(),
                endDate: this.modal.find(END_DATE).val(),
                startTime: this.modal.find(START_TIME).val(),
                endTime: this.modal.find(END_TIME).val()
            };
        }
    }, {
        key: 'save',
        value: function save() {
            // get post url
            var url = this.build_url();
            // stop if no url was specified
            if (url == null) return;
            // join default data and form data
            var data = $.extend({}, this.options.data, this.get_form_data());
            data = this.add_structs(data);
            // join default headers with custom headers
            var headers = $.extend({}, this.options.headers);
            // disable form
            this.disable(true);
            // make ajax post request and try to save new event
            $.ajax({
                url: this.options.url,
                data: data,
                headers: headers,
                method: this.options.editting ? 'PUT' : 'POST'
            }).done(this.save_done.bind(this)).fail(this.save_failed.bind(this));
        }
    }, {
        key: 'save_done',
        value: function save_done(response) {
            // fire onSave function if set
            if (typeof this.options.onSaved == 'function') this.options.onSaved();

            // create referenc for object instance
            var self = this;

            // delay modal hide and form enable action
            setTimeout(function () {
                // enable form
                self.disable(false);
                // hide modal
                self.hide();
            }, 800);
        }
    }, {
        key: 'save_failed',
        value: function save_failed(err) {
            // enable form
            this.disable(false);
            // get and display error message
            var message = 'Failed to' + (this.options.editting ? ' save changes.' : ' save new event.');
            var message = err.message && err.message.length > 0 ? err.message : message;
            alert(message);
        }
    }, {
        key: 'add_structs',
        value: function add_structs(data) {
            if (this.options.requestStruct) {
                var structs = JSON.parse(JSON.stringify(this.options.requestStruct));
                for (var i in structs) {
                    if (typeof structs[i] != 'string') continue;
                    if (typeof data[i] == 'undefined') continue;
                    if (typeof data[structs[i]] != 'undefined') continue;
                    data[structs[i]] = JSON.parse(JSON.stringify(data[i]));
                    delete data[i];
                }
            }

            return data;
        }
    }, {
        key: 'delete',
        value: function _delete() {
            // get post url
            var url = this.build_url('delete');
            // stop if no url was specified
            if (url == null) return;
            // join default data and form data
            var data = $.extend({}, this.options.data);
            // join default headers with custom headers
            var headers = $.extend({}, this.options.headers);
            // disable form
            this.disable(true);
            // make ajax post request and try to delete new event
            $.ajax({
                url: this.options.url,
                data: data,
                headers: headers,
                method: 'DELETE'
            }).done(this.delete_done.bind(this)).fail(this.delete_failed.bind(this));
        }
    }, {
        key: 'delete_done',
        value: function delete_done(response) {
            // fire onSave function if set
            if (typeof this.options.onDelete == 'function') this.options.onDelete();

            // create referenc for object instance
            var self = this;

            // delay modal hide and form enable action
            setTimeout(function () {
                // enable form
                self.disable(false);
                // hide modal
                self.hide();
            }, 800);
        }
    }, {
        key: 'delete_failed',
        value: function delete_failed(err) {
            // enable form
            this.disable(false);
            // get and display error message
            var message = 'Could not delete event, please try again in a moment.';
            var message = err.message && err.message.length > 0 ? err.message : message;
            alert(message);
        }
    }, {
        key: 'build_url',
        value: function build_url(deleteUrl) {
            deleteUrl = deleteUrl ? true : false;
            if (!deleteUrl && this.options.url == null || deleteUrl && this.options.deleteUrl == null) return null;
            var url = deleteUrl ? JSON.parse(JSON.stringify(this.options.deleteUrl)) : JSON.parse(JSON.stringify(this.options.url));
            var regex = new RegExp(/^(:id)$/, 'ig');
            if (this.options.editting) {
                if (regex.test(url)) {
                    url = url.replace(regex, this.id);
                } else {
                    this.options.data = $.extend({}, this.options.data, { id: this.id });
                }
            } else {
                url = url;
            }
            return url;
        }
    }]);

    return CPEventFormModal;
}();
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CPEvent = function () {
    _createClass(CPEvent, [{
        key: 'SELECTORS',

        /**
         * selectors used within this class
         */
        value: function SELECTORS() {
            return {
                BODY: 'body',
                FORM: '.' + this.PREFIX + '-form',
                FIELDSET: 'fieldset',
                MODAL: '.' + this.PREFIX + '-modal',
                BUTTON: '.' + this.PREFIX + '-button',
                TITLE: 'input[name="event-title"]',
                END_TIME: 'input[name="end-time"]',
                END_DATE: 'input[name="end-date"]',
                START_DATE: 'input[name="start-date"]',
                START_TIME: 'input[name="start-time"]',
                ERROR_CONTAINER: '.' + this.PREFIX + '-error-container'
            };
        }

        /**
         * class names used within the component
         */

    }, {
        key: 'CLASSNAMES',
        value: function CLASSNAMES() {
            return {
                CONTAINER: this.PREFIX + "-event-container",
                EVENT: this.PREFIX + "-event",
                LABEL: this.PREFIX + "-event-label",
                START: 'start',
                END: 'end'
            };
        }
    }]);

    function CPEvent(data, container, week, cellSelector, options) {
        _classCallCheck(this, CPEvent);

        var now = new Date();
        this.PREFIX = 'cp-ev';
        this.uniqueID = this.PREFIX + now.getTime() + '' + Math.ceil(Math.random() * 100);
        this.container = container;
        this.week = week;
        this.cellSelector = cellSelector;
        this.event = null;
        this.data = data;
        this.start = this.options = $.extend({
            onClick: null
        }, options);

        // bind methods
        this.html = this.html.bind(this);
        this.render = this.render.bind(this);
        this.SELECTORS = this.SELECTORS.bind(this);
        this.CLASSNAMES = this.CLASSNAMES.bind(this);
        this.componentDidRender = this.componentDidRender.bind(this);
        this.reposition = this.reposition.bind(this);
        this.resize = this.resize.bind(this);
        this.set_start_end = this.set_start_end.bind(this);
        this.destroy = this.destroy.bind(this);
    }

    _createClass(CPEvent, [{
        key: 'componentDidRender',
        value: function componentDidRender() {
            // reset/set event
            this.event = this.container.find('#' + this.uniqueID);
            // reset/set listeners
            this.listeners();
            // reposition event element
            this.reposition();
        }
    }, {
        key: 'render',
        value: function render() {
            // render event html
            this.container.append(this.html());
            // fire component did render function
            this.componentDidRender();
        }
    }, {
        key: 'html',
        value: function html() {
            return "<button class='" + this.CLASSNAMES().EVENT + "' id='" + this.uniqueID + "' title='" + this.title() + "'>" + "<span class='" + this.CLASSNAMES().LABEL + "'>" + this.data.title + "</span>" + "</button>";
        }
    }, {
        key: 'title',
        value: function title() {
            return this.data.title + ' (' + this.data.startDate + ' - ' + this.data.endDate + ')';
        }
    }, {
        key: 'listeners',
        value: function listeners() {
            // listen for clicks on 
            if (typeof this.options.onClick == 'function') {
                this.event.off('click', this.handle_on_click.bind(this));
                this.event.on('click', this.handle_on_click.bind(this));
            }
        }
    }, {
        key: 'handle_on_click',
        value: function handle_on_click(ev) {
            this.options.onClick(this.data);
        }
    }, {
        key: 'reposition',
        value: function reposition() {
            this.set_start_end();
            var startDate = new Date(this.data.startDate);
            var endDate = new Date(this.data.endDate);
            var left = this.start.offset().left - this.container.offset().left;
            if (startDate.getTime() == parseInt(this.start.attr('data-date'))) {
                left = left + 15;
            }
            this.event.css({ marginLeft: left + 'px' });
            this.resize();
        }
    }, {
        key: 'resize',
        value: function resize() {
            var startDate = new Date(this.data.startDate);
            var endDate = new Date(this.data.endDate);
            var sizeStart = this.start.offset().left;
            var sizeEnd = this.end.offset().left + this.end.outerWidth();

            if (startDate.getTime() == parseInt(this.start.attr('data-date'))) {
                sizeStart = sizeStart + 15;
                if (!this.event.hasClass(this.CLASSNAMES().START)) {
                    this.event.addClass(this.CLASSNAMES().START);
                }
            }

            if (endDate.getTime() == parseInt(this.end.attr('data-date'))) {
                sizeEnd = sizeEnd - 15;
                if (!this.event.hasClass(this.CLASSNAMES().END)) {
                    this.event.addClass(this.CLASSNAMES().END);
                }
            }
            var size = sizeEnd - sizeStart;
            // console.log(this.start);
            // console.log(this.end);
            // console.log('__________');
            this.event.css({ width: size + 'px' });
        }
    }, {
        key: 'set_start_end',
        value: function set_start_end() {
            var startDate = new Date(this.data.startDate);
            var endDate = new Date(this.data.endDate);
            var cells = this.week.find(this.cellSelector);
            var start = null;
            var end = null;

            for (var i = 0; i < cells.length; i++) {
                var cell = cells.eq(i);
                var cellDate = parseInt(cell.attr('data-date'));

                // set start element
                if (start == null) {
                    start = cellDate >= startDate.getTime() && cellDate <= endDate.getTime() || cellDate == startDate.getTime() ? cell : null;
                }

                // set end element
                if (end == null) {
                    if (cells.length - 1 == i || cellDate == endDate.getTime()) {
                        end = cell;
                    }
                }

                // stop when start and end have been selected
                if (start != null && end != null) break;
            }

            this.start = start;
            this.end = end;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.event.remove();
            this.event = null;
        }
    }]);

    return CPEvent;
}();
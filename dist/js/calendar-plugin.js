var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
        ACTIVE: 'active',
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
        NAV_CONTROLS: PREFIX + '-nav-controls',
        CONTROLS_CONTAINER: PREFIX + '-nav',
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
        EVENT_MENU_CONTAINER: PREFIX + '-event-menu',
        EVENT_MENU_INNER: PREFIX + '-event-menu-inner',
        EVENT_MENU_BUTTONS_CONTAINER: PREFIX + '-event-menu-buttons-container',
        EVENT_MENU_BUTTON: PREFIX + '-event-menu-button',
        EVENT_MENU_ABOVE: PREFIX + '-event-menu-above',
        EVENT_MENU_VISIBLE: PREFIX + '-event-menu-visible',
        VIEWS_LIST_CONTAINER: PREFIX + '-view-list-container',
        VIEWS_LIST: PREFIX + '-view-list',
        VIEWS_ITEM: PREFIX + '-view',
        VIEW_BUTTON: PREFIX + '-view-button',
        SHOW_COPIED_EVENT_MENU: PREFIX + '-show-copied-menu'

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
        NAV_CONTROLS: '.' + PREFIX + '-nav-controls',
        CONTROL_BUTTONS: 'button.' + PREFIX + '-nav',
        DATE_CELL: '.' + PREFIX + '-date',
        DATE_DAY: '.' + PREFIX + '-day',
        DATE_SELECTED: '.' + PREFIX + '-date-selected',
        DATE_CELL_CONTENT: '.' + PREFIX + '-date-content',
        WEEK_ROW: '.' + PREFIX + '-week',
        WEEK_EVENTS: '.' + PREFIX + '-week-events',
        MONTH_HEADING: '.' + PREFIX + '-month-heading',
        MONTH_CELL: '.' + PREFIX + '-month',
        MONTH_NAME_BUTTON: '.' + PREFIX + '-month-name',
        EMPTY_DAY: '.' + PREFIX + '-empty-day',
        EMPTY_DAY_BEGINNING: '.' + PREFIX + '-empty-day-beginning',
        EMPTY_DAY_ENDING: '.' + PREFIX + '-empty-day-ending',
        ADD_MENU_CONTAINER: '.' + PREFIX + '-add-menu',
        ADD_MENU_INNER: '.' + PREFIX + '-add-menu-inner',
        ADD_MENU_BUTTON: '.' + PREFIX + '-add-menu-button',
        ADD_MENU_BUTTONS_CONTAINER: '.' + PREFIX + '-add-menu-buttons-container',
        EVENT_MENU_CONTAINER: '.' + PREFIX + '-event-menu',
        EVENT_MENU_INNER: '.' + PREFIX + '-event-menu-inner',
        EVENT_MENU_BUTTON: '.' + PREFIX + '-event-menu-button',
        EVENT_MENU_BUTTONS_CONTAINER: '.' + PREFIX + '-event-menu-buttons-container',
        VIEWS_LIST_CONTAINER: '.' + PREFIX + '-view-list-container',
        VIEWS_LIST: '.' + PREFIX + '-view-list',
        VIEWS_ITEM: '.' + PREFIX + '-view',
        VIEW_BUTTON: '.' + PREFIX + '-view-button',
        VIEW_SELECTOR: '[data-toggle="calendar-view"]',
        EVENT_FORM_MODAL: '.' + PREFIX + '-ef-modal',
        EXPORT_BUTTON: '[data-export="calendar"]'

        /**
         * html month templates for all the different parts of the calendar
         */
    };var TEMPLATES = {
        CONTAINER: "<div class='" + CLASSNAMES.CONTAINER + "' id='" + SELECTORS.CONTAINER_ID + "'>{header}{calendar}{add_menu}{event_menu}</div>",
        MAIN: "<table class='" + CLASSNAMES.CALENDAR + " {classnames}'  cellspacing='0' cellpadding='0'><thead>{heading}</thead><tbody>{content}</tbody></table>",
        DAYS_HEADING: "<tr class='" + CLASSNAMES.MONTH_HEADING + "'> <th>Sun</th> <th>Mon</th> <th>Tue</th> <th>Wed</th> <th>Thur</th> <th>Fri</th> <th>Sat</th> </tr>",
        WEEK_ROW: "<tr class='" + CLASSNAMES.WEEK_ROW + "' data-row='{row}'>{content}</tr>",
        DAY_CELL: "<td class='" + CLASSNAMES.DATE_CELL + " {classnames}' data-date='{date}'><div class='" + CLASSNAMES.DATE_CELL_CONTENT + "'>{content}</div></td>",
        HEADER: "<div class='" + CLASSNAMES.HEADER + " {classnames}'>" + "<div class='" + CLASSNAMES.NAV_CONTROLS + "'>{left-control}{right-control}</div>" + "<div class='" + CLASSNAMES.HEADER_CONTENT + "'>" + "<div class='" + CLASSNAMES.HEADER_OPTIONS_CONTAINER + "'>" + "<button class='" + CLASSNAMES.MONTH_NAME_BUTTON + "'>{month}<span class='caret'></span></button>" + "<div class='" + CLASSNAMES.HEADER_OPTIONS + "' id='headerOptionsComponent'><div class='" + CLASSNAMES.HEADER_OPTIONS_INNER + "'><div class='" + CLASSNAMES.HEADER_OPTIONS_BUTTONS_CONTAINER + "'><a class='" + CLASSNAMES.HEADER_OPTIONS_BUTTON + "' href='javascript:;' data-export='calendar' data-format='pdf'>Export to .pdf</a><a class='" + CLASSNAMES.HEADER_OPTIONS_BUTTON + "' href='javascript:;' data-export='calendar' data-format='docx'>Export to .docx</a></div><span class='caret'></span></div></div>" + "</div>" + "</div>" + "{view-options}" + "</div>",
        VIEWS: "<div class='" + CLASSNAMES.VIEWS_LIST_CONTAINER + "'><ul class='" + CLASSNAMES.VIEWS_LIST + "'>" + "<li class='" + CLASSNAMES.VIEWS_ITEM + "'>" + "<button type='button' class='" + CLASSNAMES.VIEW_BUTTON + " daily' data-toggle='calendar-view' data-option='daily'>Daily</button>" + "</li>" + "<li class='" + CLASSNAMES.VIEWS_ITEM + "'>" + "<button type='button' class='" + CLASSNAMES.VIEW_BUTTON + " weekly' data-toggle='calendar-view' data-option='weekly'>Weekly</button>" + "</li>" + "<li class='" + CLASSNAMES.VIEWS_ITEM + "'>" + "<button type='button' class='" + CLASSNAMES.VIEW_BUTTON + " monthly' data-toggle='calendar-view' data-option='monthly'>Monthly</button>" + "</li>" + "</ul></div>",
        CONTROL: "<button class='" + CLASSNAMES.CONTROLS_CONTAINER + "' type='submit' {direction}>{label}</button>",
        ADD_MENU: "<div class='" + CLASSNAMES.ADD_MENU_CONTAINER + "' id='addMenuComponent'><div class='" + CLASSNAMES.ADD_MENU_INNER + "'><div class='" + CLASSNAMES.ADD_MENU_BUTTONS_CONTAINER + "'><button class='" + CLASSNAMES.ADD_MENU_BUTTON + "' type='button' data-action='add-event'>Add Event</button><button class='" + CLASSNAMES.ADD_MENU_BUTTON + " cancel' data-action='cancel' type='button'>Cancel</button></div><span class='caret'></span></div></div>"
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
        self.now = new Date();
        self.selection = [];
        self.createFormModal = null;
        self.editFormModal = null;
        self.events = [];
        self.eventInstances = [];
        self.viewOptions = ['daily', 'weekly', 'monthly'];
        var weekStart = moment(moment().format('YYYY-MM-DD 00:00:00'));
        var weekEnd = moment(weekStart).add(6, 'days');
        var dailyDate = moment();

        // plugin settings
        self.settings = {};

        // initializer
        self.init = function (options) {
            self.el = this;
            self.settings = $.extend({
                month: self.now.getMonth() + 1,
                year: self.now.getFullYear(),
                dayStyle: 'short',
                cellMaxHeigh: 200,
                respData: 'data',
                // reference to event data
                id: 'id',
                title: 'title',
                startDate: 'startDate',
                endDate: 'endDate',
                startTime: 'startTime',
                endTime: 'endTime',
                creatRequest: null,
                editRequest: null,
                view: 'monthly',
                changableView: true,
                form: [],
                disableForm: false,
                escCloseEventMenu: true,
                escCloseAddMenu: true
            }, options);

            // configure seasons
            var seasons = $.extend(SEASONS, options ? options.seasons : {});

            // add seasons to settings
            self.settings.seasons = seasons;

            // ensure month is with in the 1 - 12 range
            if (self.settings.month < 1 || self.settings.month > 12) {
                self.settings.month = 1;
            }

            setupForm();

            launch();

            if (options == 'destroy') {
                self.destroy();
            }
            return self;
        };

        var launch = function launch() {
            // render calender
            render();

            // create new event modal
            self.createFormModal = new CPEventFormModal('new-event' + self.now.getTime(), {
                url: self.settings.createUrl || self.settings.url || null,
                data: self.settings.data,
                headers: self.settings.headers,
                onSaved: refreshCalendarEvents,
                requestStruct: self.settings.creatRequest || null,
                fieldsList: self.settings.form
            });
            self.createFormModal.render();

            // edit new event modal
            self.editFormModal = new CPEventFormModal('edit-event' + self.now.getTime(), {
                editting: true,
                url: self.settings.editUrl || self.settings.url || null,
                deleteUrl: self.settings.deleteUrl || self.settings.url || null,
                data: self.settings.data,
                headers: self.settings.headers,
                onSaved: refreshCalendarEvents,
                onDelete: refreshCalendarEvents,
                requestStruct: self.settings.editRequest || null,
                fieldsList: self.settings.form
            });
            self.editFormModal.render();
        };

        setupForm = function setupForm() {
            var form = self.settings.form;

            var fields = {};
            if (!form || form.constructor != Array) {
                return;
            }
            for (var i = 0; i < form.length; i++) {
                if (form[i] == undefined) {
                    continue;
                }
                if (form[i].constructor != Array) {
                    console.warn('Form structure malformed at fields list ' + i + ' form must have the following structure in order to render. Array<Array<object>>');
                    continue;
                }
                for (var j = 0; j < form[i].length; j++) {
                    fields[form[i][j]['name']] = _extends({}, form[i][j]);
                }
            }
        };

        var render = function render() {
            var html = '';
            switch (self.settings.view) {
                case 'daily':
                    html = dailyCalendar();
                    break;
                case 'weekly':
                    html = weeklyCalendar();
                    break;
                case 'monthly':
                    html = createView(createCalendar());
                    break;
            }

            $(self.el).html('');
            $(html).prependTo($(self.el));
            refreshCalendarEvents();
            start();
        };

        var weeklyCalendar = function weeklyCalendar() {
            return "<div class='" + CLASSNAMES.CONTAINER + "' id='" + SELECTORS.CONTAINER_ID + "'>" + renderHeader('weekly') + "<table class='" + CLASSNAMES.CALENDAR + " weekly'  cellspacing='0' cellpadding='0'>" + "<thead>" + renderWeeklyHeading() + "</thead>" + "<tbody>" + renderWeeklyBody() + "</tbody>" + "</table>" + renderAddMenu() + renderEventMenu() + "</div>";
        };

        var dailyCalendar = function dailyCalendar() {
            return "<div class='" + CLASSNAMES.CONTAINER + "' id='" + SELECTORS.CONTAINER_ID + "'>" + renderHeader('daily') + "<table class='" + CLASSNAMES.CALENDAR + " daily'  cellspacing='0' cellpadding='0'>" + "<thead>" + renderDailyHeading() + "</thead>" + "<tbody>" + renderDailyBody() + "</tbody>" + "</table>" + renderAddMenu() + renderEventMenu() + "</div>";
        };

        var renderEventMenu = function renderEventMenu() {
            return ('\n                <div class=\'' + CLASSNAMES.EVENT_MENU_CONTAINER + '\' id=\'eventMenuComponent\'>\n                    <div class=\'' + CLASSNAMES.EVENT_MENU_INNER + '\'>\n                        <div class=\'' + CLASSNAMES.EVENT_MENU_BUTTONS_CONTAINER + '\'>\n                            <button class=\'' + CLASSNAMES.EVENT_MENU_BUTTON + '\' type=\'button\' data-action=\'edit-event\'>Edit Event</button>\n                            <button class=\'' + CLASSNAMES.EVENT_MENU_BUTTON + '\' type=\'button\' data-action=\'copy-event\'>Copy Event</button>\n                            <button class=\'' + CLASSNAMES.EVENT_MENU_BUTTON + ' cancel\' data-action=\'cancel\' type=\'button\'>Cancel</button>\n                        </div>\n                        <span class=\'caret\'></span>\n                    </div>\n                </div>\n            ').trim();
        };

        var renderDailyHeading = function renderDailyHeading() {
            var heading = '<tr class="' + CLASSNAMES.MONTH_HEADING + '">' + '<th>Time</th>' + '<th></th>' + '</tr>';
            return heading;
        };

        var renderDailyBody = function renderDailyBody() {
            var hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                body = '',
                amPm;

            for (var i = 0; i < hours.length; i++) {
                amPm = i >= 12 ? 'PM' : 'AM';
                body += '<tr class="' + CLASSNAMES.WEEK_ROW + ' daily">\n                            <td>' + leadingZero(hours[i]) + ' ' + amPm + '</td>\n                            <td class="' + CLASSNAMES.DATE_CELL + ' ' + CLASSNAMES.DATE_DAY + '" data-date="' + moment(dailyDate.format('YYYY-MM-DD ' + leadingZero(hours[i]) + ':00:00')).get('time') + '">\n                                <div class="' + CLASSNAMES.DATE_CELL_CONTENT + '"></div>\n                            </td>\n                        </tr>';
            }
            return body;
        };

        var renderWeeklyHeading = function renderWeeklyHeading() {
            var heading = '<tr class="' + CLASSNAMES.MONTH_HEADING + '"><th>Time</th>';
            for (var i = weekStart.get('time'); i <= weekEnd.get('time'); i = i + 86400000) {
                heading += '<th >' + moment(i).format('ddd DD') + '</th>';
            }
            heading += '</tr>';
            return heading;
        };

        var renderWeeklyBody = function renderWeeklyBody() {
            var hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                body = '',
                time,
                timeDate,
                amPm;

            for (var i = 0; i < hours.length; i++) {
                amPm = i >= 12 ? 'PM' : 'AM';
                time = leadingZero(hours[i]) + ' ' + amPm;
                body += '<tr class="' + CLASSNAMES.WEEK_ROW + ' weekly">' + '<td style=" text-align: right; padding-right: 15px;">' + time + '</td>';
                for (var j = weekStart.get('time'); j <= weekEnd.get('time'); j = j + 86400000) {
                    timeDate = moment(moment(j).format('YYYY-MM-DD ') + leadingZero(hours[i]) + ':00:00');
                    body += '<td class="' + CLASSNAMES.DATE_CELL + ' ' + CLASSNAMES.DATE_DAY + '" data-date="' + timeDate.get('time') + '"><div class="' + CLASSNAMES.DATE_CELL_CONTENT + '"></div></td>';
                }
                body += '</tr>';
            }
            return body;
        };

        var renderHeader = function renderHeader(type) {
            var month_name = getMonthName(self.settings.month - 1);
            var headerClassnames = '';
            headerClassnames += ' ' + CLASSNAMES.MONTH_HEADER.replace('{month}', getMonthName(self.settings.month - 1).toLowerCase()) + ' ';
            headerClassnames += ' ' + CLASSNAMES.SEASON_HEADER.replace('{season}', getSeason() ? getSeason().name : '') + ' ';
            // create view specific name
            if (type == 'weekly') {
                var month_name = getMonthName(weekStart.get('month'));
                headerClassnames += ' ' + CLASSNAMES.MONTH_HEADER.replace('{month}', getMonthName(weekStart.get('month') - 1).toLowerCase()) + ' ';

                month_name += ' ' + leadingZero(weekStart.get('date')) + ' - ';
                month_name += weekEnd.get('month') != weekStart.get('month') ? getMonthName(weekEnd.get('month')) + ' ' + leadingZero(weekEnd.get('date')) : leadingZero(weekEnd.get('date'));
            }

            // create view specific name
            if (type == 'daily') {
                var month_name = dailyDate.format('Do MMMM YYYY');
                headerClassnames += ' ' + CLASSNAMES.MONTH_HEADER.replace('{month}', getMonthName(dailyDate.get('month') - 1).toLowerCase()) + ' ';
            }

            // return html
            return "<div class='" + CLASSNAMES.HEADER + " " + headerClassnames + "'>" + "<div class='" + CLASSNAMES.NAV_CONTROLS + "'>" + renderNavControl('left') + renderNavControl('right') + "</div>" + "<div class='" + CLASSNAMES.HEADER_CONTENT + "'>" + "<div class='" + CLASSNAMES.HEADER_OPTIONS_CONTAINER + "'>" + "<button class='" + CLASSNAMES.MONTH_NAME_BUTTON + "'>" + month_name + "<span class='caret'></span></button>" + "<div class='" + CLASSNAMES.HEADER_OPTIONS + "' id='headerOptionsComponent'>" + "<div class='" + CLASSNAMES.HEADER_OPTIONS_INNER + "'>" + "<div class='" + CLASSNAMES.HEADER_OPTIONS_BUTTONS_CONTAINER + "'>" + "<a class='" + CLASSNAMES.HEADER_OPTIONS_BUTTON + "' href='javascript:;' " + "data-export='calendar' data-format='pdf'>Export to .pdf</a>" + "<a class='" + CLASSNAMES.HEADER_OPTIONS_BUTTON + "' href='javascript:;' " + "data-export='calendar' data-format='docx'>Export to .docx</a>" + "</div>" + "<span class='caret'></span>" + "</div>" + "</div>" + "</div>" + "</div>" + renderViewOptions() + "</div>";
        };

        var renderNavControl = function renderNavControl(direction) {
            var label = direction == 'right' ? '&rarr;' : '&larr;';
            return "<button class='" + CLASSNAMES.CONTROLS_CONTAINER + "' " + "type='submit' " + direction + ">" + label + "</button>";
        };

        var renderViewOptions = function renderViewOptions() {
            if (!self.settings.changableView) {
                return '';
            }
            return "<div class='" + CLASSNAMES.VIEWS_LIST_CONTAINER + "'><ul class='" + CLASSNAMES.VIEWS_LIST + "'>" + "<li class='" + CLASSNAMES.VIEWS_ITEM + "'>" + "<button type='button' class='" + CLASSNAMES.VIEW_BUTTON + " daily' data-toggle='calendar-view' data-option='daily'>Day</button>" + "</li>" + "<li class='" + CLASSNAMES.VIEWS_ITEM + "'>" + "<button type='button' class='" + CLASSNAMES.VIEW_BUTTON + " weekly' data-toggle='calendar-view' data-option='weekly'>Week</button>" + "</li>" + "<li class='" + CLASSNAMES.VIEWS_ITEM + "'>" + "<button type='button' class='" + CLASSNAMES.VIEW_BUTTON + " monthly' data-toggle='calendar-view' data-option='monthly'>Month</button>" + "</li>" + "</ul></div>";
        };

        var renderAddMenu = function renderAddMenu() {
            if (self.settings.disableForm) {
                return '';
            }
            var copiedMenuClass = '';
            if (self.copiedEvent) {
                copiedMenuClass = CLASSNAMES.SHOW_COPIED_EVENT_MENU;
            }
            return ('\n                <div class=\'' + CLASSNAMES.ADD_MENU_CONTAINER + ' ' + copiedMenuClass + '\' id=\'addMenuComponent\'>\n                    <div class=\'' + CLASSNAMES.ADD_MENU_INNER + '\'>\n                        <div class=\'' + CLASSNAMES.ADD_MENU_BUTTONS_CONTAINER + '\'>\n                            <button \n                                class=\'' + CLASSNAMES.ADD_MENU_BUTTON + ' anti-copied-button\' \n                                type=\'button\' data-action=\'add-event\'\n                            >\n                                Add Event\n                            </button>\n                            <button \n                                class=\'' + CLASSNAMES.ADD_MENU_BUTTON + ' copied-button\' \n                                type=\'button\' data-action=\'paste-event\'\n                            >\n                                Paste Event\n                            </button>\n                            <button \n                                class=\'' + CLASSNAMES.ADD_MENU_BUTTON + ' copied-button cancel\'\n                                data-action=\'cancel-copy\'\n                                type=\'button\'\n                            >\n                                Clear Copy\n                            </button>\n                            <button \n                                class=\'' + CLASSNAMES.ADD_MENU_BUTTON + ' destructive\'\n                                data-action=\'cancel\'\n                                type=\'button\'\n                            >\n                                Cancel\n                            </button>\n                        </div>\n                        <span class=\'caret\'></span>\n                    </div>\n                </div>\n            ').trim();
        };

        var renderEvents = function renderEvents() {
            // destroy old events first
            destroyEvents();

            var CALENDAR = SELECTORS.CALENDAR,
                WEEK_ROW = SELECTORS.WEEK_ROW,
                WEEK_EVENTS = SELECTORS.WEEK_EVENTS,
                DATE_CELL = SELECTORS.DATE_CELL,
                DATE_CELL_CONTENT = SELECTORS.DATE_CELL_CONTENT,
                weeks = $(CALENDAR).find(WEEK_ROW),
                week,
                eventsContainer,
                eventObj,
                container,
                cellTimestamp,
                evStart,
                evEnd;

            var dateCells = $(CALENDAR).find(DATE_CELL);
            for (var i = 0; i < dateCells.length; i++) {
                // get date cell
                container = dateCells.eq(i);

                // Gets cell's timestampe (date and time in unix timestamp)
                cellTimestamp = parseInt(container.attr('data-date'));

                // only if the cell's date is not a number
                if (typeof cellTimestamp == 'number' && cellTimestamp >= 0) {
                    // create instances
                    for (var j = 0; j < self.events.length; j++) {
                        var event = self.events[j];
                        evStart = new Date(event.startDate + ' ' + event.startTime).getTime();
                        evEnd = new Date(event.endDate + ' ' + event.endTime).getTime();

                        // if event is happening on the current cell's date
                        if (cellTimestamp >= moment(moment(evStart).format('YYYY-MM-DD 00:00:00')).get('time') && cellTimestamp <= moment(moment(evEnd).format('YYYY-MM-DD 23:59:59')).get('time')) {

                            /**
                             * Gets start and end time for current cell, this is used
                             * to verify if the event is occuring at the time of the
                             * given cell timestamp
                             */
                            var st = moment(moment(cellTimestamp).format('YYYY-MM-DDT' + event.startTime)).get('time');
                            var et = moment(moment(cellTimestamp).format('YYYY-MM-DDT' + event.endTime)).get('time');

                            /**
                             * if in monthly view, the time doesn't really matter else,
                             * check if it's happening at the time within current
                             * cell's date
                             */
                            if (self.settings.view == 'monthly' || cellTimestamp >= st && cellTimestamp <= et) {
                                eventObj = new CPEvent(event, container.find(DATE_CELL_CONTENT), week, DATE_CELL, {
                                    onClick: handleEventClick
                                });
                                eventObj.render();
                                self.eventInstances.push(eventObj);
                            }
                        }
                    }
                }
            }
        };

        var destroyEvents = function destroyEvents() {
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
                EXPORT_BUTTON = SELECTORS.EXPORT_BUTTON,
                EVENT_MENU_BUTTON = SELECTORS.EVENT_MENU_BUTTON;

            // resize calendar

            resizeCalendar();

            // resize calendar when window resizes
            $(window).off('resize', resizeCalendar);
            $(window).on('resize', resizeCalendar);

            // reposition empty cells background
            repositionCellBackground();

            // reposition empty cells background when window resizes
            $(window).off('resize', repositionCellBackground);
            $(window).on('resize', repositionCellBackground);

            // listen for click on add menu buttons
            $(CONTAINER).find(ADD_MENU_BUTTON).off('click', handleAddMenuButtonClick);
            $(CONTAINER).find(ADD_MENU_BUTTON).on('click', handleAddMenuButtonClick);

            // listen for click on event menu buttons
            $(CONTAINER).find(EVENT_MENU_BUTTON).off('click', handleEventMenuButtonClick);
            $(CONTAINER).find(EVENT_MENU_BUTTON).on('click', handleEventMenuButtonClick);

            // listen for click on export button
            $(CONTAINER).find(EXPORT_BUTTON).off('click', exportTo);
            $(CONTAINER).find(EXPORT_BUTTON).on('click', exportTo);

            document.removeEventListener('keyup', handleDocumentKeyUp);
            document.addEventListener('keyup', handleDocumentKeyUp);

            // listen for control button click event
            listenForControlButtonClick();

            // listen for date select
            listenForDateSelect();

            // update calendar with selection
            updateSelection();

            // select active view
            selectActiveView();

            // listen for view select
            listenViewSelect();
        };

        var createView = function createView(calendar) {
            var container_tpl = copyVar(TEMPLATES.CONTAINER);
            var calendar_tpl = copyVar(TEMPLATES.MAIN);
            var days_heading_tpl = copyVar(TEMPLATES.DAYS_HEADING);
            var cell_tpl = copyVar(TEMPLATES.DAY_CELL);
            var week_tpl = copyVar(TEMPLATES.WEEK_ROW);
            var month_name = getMonthName(self.settings.month - 1);
            var season = getSeason();
            var weeks = '';

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
                        if (prevDayNum && getMonthDays() == prevDayNum.trim()) classnames += ' ' + CLASSNAMES.EMPTY_DAY_ENDING + ' ';

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
                var curr_week_tpl = copyVar(week_tpl);
                curr_week_tpl = curr_week_tpl.replace('{row}', i + 1);

                weeks += curr_week_tpl.replace('{content}', week);
            }

            // create calendar from template
            var calenderClassnames = 'monthly';
            calenderClassnames += ' ' + CLASSNAMES.MONTH_CALENDAR.replace('{month}', month_name.toLowerCase()) + ' ';
            calenderClassnames += ' ' + CLASSNAMES.SEASON_CALENDAR.replace('{season}', season ? season.name : '') + ' ';
            var calendar_tpl = calendar_tpl.replace('{content}', weeks);
            calendar_tpl = calendar_tpl.replace('{heading}', days_heading_tpl);
            calendar_tpl = calendar_tpl.replace('{classnames}', calenderClassnames);

            // add header to calendar
            container_tpl = container_tpl.replace('{header}', renderHeader());
            // add calender to container
            container_tpl = container_tpl.replace('{calendar}', calendar_tpl);
            // add, add menu
            container_tpl = container_tpl.replace('{add_menu}', renderAddMenu());
            // add, edit menu
            container_tpl = container_tpl.replace('{event_menu}', renderEventMenu());

            // return generated calendar
            return container_tpl;
        };

        var createCalendar = function createCalendar() {
            var days = getMonthDays(self.settings.month, self.settings.year);
            var firstDay = new Date(self.settings.year, self.settings.month - 1, 1);
            var startDay = firstDay.getDay();
            return arrayChunk(createMonthArrays(startDay, days), 7);
        };

        var createMonthArrays = function createMonthArrays(start, maxDays) {
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

        var getMonthDays = function getMonthDays(month, year) {
            // create month number as string
            var monthStr = typeof month == 'number' ? month.toString() : month;

            // days number variable
            var days;

            // set 31 days and 30 days months
            var _31Days = ['1', '3', '5', '7', '8', '10', '12'];
            var _30Days = ['4', '6', '9', '11', '8'];

            // get days in the specified month
            if (_31Days.indexOf(monthStr) != -1) days = 31;else if (_30Days.indexOf(monthStr) != -1) days = 30;else if (month == 2) {
                if (isLeapYear(year)) days = 29;else days = 28;
            }

            // return the number of the days for the given month
            return days;
        };

        var isLeapYear = function isLeapYear(year) {
            if (year % 4 == 0) // basic rule
                return true; // is leap year
            /* else */ // else not needed when statement is "return"
            return false; // is not leap year
        };

        var resizeCalendar = function resizeCalendar() {
            var CONTAINER = SELECTORS.CONTAINER,
                CALENDAR = SELECTORS.CALENDAR,
                WEEK_ROW = SELECTORS.WEEK_ROW,
                DATE_CELL = SELECTORS.DATE_CELL,
                DATE_CELL_CONTENT = SELECTORS.DATE_CELL_CONTENT;

            var cells = $(CONTAINER + ' ' + CALENDAR + ' ' + WEEK_ROW + ' ' + DATE_CELL);
            var height = $(cells[0]).outerWidth() > self.settings.cellMaxHeigh ? self.settings.cellMaxHeigh + 'px' : $(cells[0]).outerWidth() + 'px';
            if (self.settings.view != 'monthly') {
                height = 'initial';
            }
            cells.find(DATE_CELL_CONTENT).css({ height: height });
            repositionAddmenu();
        };

        var repositionCellBackground = function repositionCellBackground() {
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

        var listenForControlButtonClick = function listenForControlButtonClick() {
            // copy selector name
            var BUTTONS = copyVar(SELECTORS.CONTROL_BUTTONS);
            $(BUTTONS).off('click', handleControlButtonClick);
            $(BUTTONS).on('click', handleControlButtonClick);
        };

        var handleControlButtonClick = function handleControlButtonClick(ev) {
            // get target element
            var el = ev.target;
            var left = $(el).attr('left');
            var right = $(el).attr('right');
            var settings = copyVar(self.settings);
            var direction = left !== undefined ? 'left' : undefined;
            direction = right !== undefined ? 'right' : direction;

            // chang month if calendar is in monthly view
            if (settings.view == 'monthly') {
                changeMonth(direction);
            }
            // change week if calendar is in week view
            if (settings.view == 'weekly') {
                changeWeek(direction);
            }
            // determine what direction to go to
            if (settings.view == 'daily') {
                changeDate(direction);
            }

            cancelEventSelection();
        };

        var changeMonth = function changeMonth(direction) {
            var settings = copyVar(self.settings);

            if (direction == 'left') {
                // set year
                settings.year = settings.month <= 1 ? settings.year - 1 : settings.year;
                // set month
                settings.month = settings.month <= 1 ? settings.month = 12 : settings.month - 1;
            } else if (direction == 'right') {
                // set year
                settings.year = settings.month >= 12 ? settings.year + 1 : settings.year;
                // set month
                settings.month = settings.month >= 12 ? settings.month = 1 : settings.month + 1;
            }

            // update object settings
            self.settings = $.extend({}, self.settings, settings);
            // get now
            var now = moment();
            // reset week start
            weekStart = now.get('month') + 1 == settings.month && now.get('year') == settings.year ? moment(settings.year + '-' + leadingZero(settings.month) + '-' + leadingZero(now.get('date'))) : moment(settings.year + '-' + leadingZero(settings.month) + '-01');
            // reset week end
            weekEnd = moment(weekStart).add(6, 'days');
            // reset daily start
            dailyDate = moment(weekStart);
            // rerender calendar
            launch();
        };

        var changeWeek = function changeWeek(direction) {
            var settings = copyVar(self.settings);
            if (direction == 'left') {
                weekStart = moment(weekStart).subtract(8, 'day');
            } else if (direction == 'right') {
                weekStart = moment(weekEnd).add(1, 'day');
            }
            weekEnd = moment(weekStart).add(6, 'day');
            // get now
            var now = moment();
            // reset year start
            self.settings = $.extend({}, self.settings, {
                year: weekStart.get('year'),
                month: weekStart.get('month') + 1
            });
            // reset daily start
            dailyDate = moment(weekStart);
            // rerender calendar
            launch();
        };

        var changeDate = function changeDate(direction) {
            var settings = copyVar(self.settings);
            if (direction == 'left') {
                dailyDate = moment(dailyDate).subtract(1, 'day');
            } else if (direction == 'right') {
                dailyDate = moment(dailyDate).add(1, 'day');
            }

            if (dailyDate.get('time') < weekStart.get('time') || dailyDate.get('time') > weekEnd.get('time')) {
                // reset week start
                weekStart = moment(dailyDate);
                // reset week end
                weekEnd = moment(weekStart).add(6, 'days');
            }

            // reset year start
            self.settings = $.extend({}, self.settings, {
                year: dailyDate.get('year'),
                month: dailyDate.get('month') + 1
            });

            // rerender calendar
            launch();
        };

        var toggleCopiedEventMenu = function toggleCopiedEventMenu(hide) {
            var CONTAINER = SELECTORS.CONTAINER,
                ADD_MENU_CONTAINER = SELECTORS.ADD_MENU_CONTAINER;

            var el = $(CONTAINER).find(ADD_MENU_CONTAINER);
            if (!hide && el.length > 0 && !el.hasClass(CLASSNAMES.SHOW_COPIED_EVENT_MENU)) {
                el.addClass(CLASSNAMES.SHOW_COPIED_EVENT_MENU);
            }
            if (hide && el.length > 0 && el.hasClass(CLASSNAMES.SHOW_COPIED_EVENT_MENU)) {
                el.removeClass(CLASSNAMES.SHOW_COPIED_EVENT_MENU);
            }
        };

        var handleAddMenuButtonClick = function handleAddMenuButtonClick(ev) {
            // get required selectors
            var CONTAINER = SELECTORS.CONTAINER,
                ADD_MENU_BUTTON = SELECTORS.ADD_MENU_BUTTON;

            // turn click event listener off

            $(CONTAINER).find(ADD_MENU_BUTTON).off('click', handleAddMenuButtonClick);

            // get element
            var el = $(ev.currentTarget);
            var action = el.attr('data-action');
            switch (action) {
                case 'add-event':
                    // pop up modal
                    addEvent();
                    break;
                case 'paste-event':
                    // cancel selection
                    pasteEvent();
                    break;
                case 'cancel-copy':
                    // cancel selection
                    cancelEventCopy();
                    break;
                case 'cancel':
                    // cancel selection
                    cancelSelection();
                    break;
                default:
                    // do nothing
                    break;
            }

            // start listening for click events on add menu buttons again
            start();
        };

        var handleEventMenuButtonClick = function handleEventMenuButtonClick(ev) {
            // get required selectors
            var CONTAINER = SELECTORS.CONTAINER,
                ADD_MENU_BUTTON = SELECTORS.ADD_MENU_BUTTON;

            // turn click event listener off

            $(CONTAINER).find(ADD_MENU_BUTTON).off('click', handleAddMenuButtonClick);

            // get element
            var el = $(ev.currentTarget);
            var action = el.attr('data-action');
            switch (action) {
                case 'edit-event':
                    // pop up modal
                    self.editFormModal.show(self.selectedEvent, self.selectedEvent.id);
                    break;
                case 'copy-event':
                    // display form with selected event's data
                    copyEvent(self.selectedEvent);
                    break;
                case 'cancel':
                    // cancel selection
                    cancelEventSelection();
                    break;
                default:
                    // do nothing
                    break;
            }

            cancelEventSelection();

            // start listening for click events on add menu buttons again
            start();
        };

        var copyEvent = function copyEvent(data) {
            // create new event data
            self.copiedEvent = Object.assign({}, data);

            // toggle copied event option on add menu
            toggleCopiedEventMenu();

            // show modal
            // self.createFormModal.show(copyData);
        };

        var addEvent = function addEvent() {
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
            self.createFormModal.show(data);

            // calcel selection
            cancelSelection();
        };

        var pasteEvent = function pasteEvent() {
            // get start and end
            var start = self.selection.length > 0 ? self.selection[0] : null;
            var end = self.selection.length > 1 ? self.selection[1] : start;
            // only continue if start is not null
            if (start == null) return;

            // create start and end date
            var startDate = new Date(start);
            var endDate = new Date(end);

            // create new event data
            var data = Object.assign({}, self.copiedEvent, {
                startDate: startDate.getMonth() + 1 + '/' + startDate.getDate() + '/' + startDate.getFullYear(),
                endDate: endDate.getMonth() + 1 + '/' + endDate.getDate() + '/' + endDate.getFullYear()
            }, self.settings.data || {});

            // make ajax post request and try to save new event
            $.ajax({
                url: self.settings.createUrl || self.settings.url,
                data: data,
                headers: self.settings.headers,
                method: 'POST'
            }).done(function () {
                alert('Event pasted to date successfully!');
                refreshCalendarEvents();
            }).fail(function (err) {
                // get and display error message
                var message = 'Failed to paste event to date.';
                var message = err.message && err.message.length > 0 ? err.message : message;
                alert(message);
            });

            // calcel selection
            cancelSelection();
            cancelEventCopy();
        };

        var cancelEventCopy = function cancelEventCopy() {
            self.copiedEvent = undefined;
            toggleCopiedEventMenu(true);
        };

        var cancelSelection = function cancelSelection() {
            self.selection = [];
            updateSelection();
        };

        var cancelEventSelection = function cancelEventSelection() {
            toggleSelectedEventHighlight(true);
            self.selectedEvent = undefined;
            self.selectedEventTarget = undefined;
            toggleEventMenuVisiblity();
        };

        var handleDocumentKeyUp = function handleDocumentKeyUp(event) {
            // detect escape key press
            if (event && event.keyCode == 27) {
                // detect if focused
                if (self.selectedEvent) {
                    // check if escape close for event menu is enabled
                    if (self.settings.escCloseEventMenu) {
                        // dismiss popover
                        cancelEventSelection();
                    }
                }

                // check if escape close for event menu is enabled
                if (self.settings.escCloseAddMenu) {
                    // detect if dates havve been selected
                    if (self.selection && self.selection.length > 0) {
                        cancelSelection();
                    }
                }
            }
        };

        var handleEventClick = function handleEventClick(eventData, ev) {
            if (self.settings.disableForm) {
                return;
            }

            // create start and end date
            var startDate = new Date(eventData.startDate);
            var endDate = new Date(eventData.endDate);

            // create new eventData data
            var data = Object.assign({}, eventData, {
                title: eventData.title,
                startDate: startDate,
                endDate: endDate,
                startTime: eventData.startTime,
                endTime: eventData.endTime
            });

            // deselect previously selected event
            toggleSelectedEventHighlight(true);

            // set selected eventData
            self.selectedEvent = Object.assign({}, data);
            self.selectedEventTarget = $(ev.currentTarget);

            // highlight selected events
            toggleSelectedEventHighlight();

            // console.log(ev.currentTarget);
            toggleEventMenuVisiblity();

            // self.editFormModal.show(data, eventData.id);
        };

        var toggleSelectedEventHighlight = function toggleSelectedEventHighlight(remove) {
            if (self.selectedEventTarget) {
                var eventButtons = $('.cp-ev-event[data-evid=' + self.selectedEventTarget.attr('data-evid') + ']');
                if (eventButtons.length > 0) {
                    if (remove) {
                        eventButtons.removeClass('cp-ev-event-selected');
                        return;
                    }
                    eventButtons.addClass('cp-ev-event-selected');
                }
            }
        };

        var listenForDateSelect = function listenForDateSelect() {
            var DATE_DAY = SELECTORS.DATE_DAY;

            $(DATE_DAY).off('click', handleDateSelect);
            $(DATE_DAY).on('click', handleDateSelect);
        };

        var handleDateSelect = function handleDateSelect(ev) {
            // turn off click event listener
            var DATE_DAY = SELECTORS.DATE_DAY;

            $(DATE_DAY).off('click', handleDateSelect);

            if (self.settings.disableForm) {
                return;
            }

            // get element and date
            var el = ev.currentTarget;
            if (!$(ev.target).hasClass('cp-ev-event') && !$(ev.target).hasClass('cp-ev-event-label')) {
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

                // update the selected dates on calendar
                updateSelection();
            }

            // listen for click event again
            listenForDateSelect();
        };

        var updateSelection = function updateSelection() {
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
            toggleAddMenuVisiblity();
        };

        var toggleAddMenuVisiblity = function toggleAddMenuVisiblity() {
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
                    cancelEventSelection();
                }
            } else {
                if (addMenuEl.hasClass(ADD_MENU_VISIBLE)) {
                    addMenuEl.removeClass(ADD_MENU_VISIBLE);
                }
            }

            // reposition add menu
            repositionAddmenu();
        };

        var toggleEventMenuVisiblity = function toggleEventMenuVisiblity() {
            // get plugin html selector references
            var CONTAINER = SELECTORS.CONTAINER,
                EVENT_MENU_CONTAINER = SELECTORS.EVENT_MENU_CONTAINER,
                DATE_SELECTED = SELECTORS.DATE_SELECTED;
            // get required classnames

            var EVENT_MENU_VISIBLE = CLASSNAMES.EVENT_MENU_VISIBLE;

            // select elements

            var container = $(CONTAINER);
            var selected = container.find(DATE_SELECTED);
            var eventMenuEl = container.find(EVENT_MENU_CONTAINER);

            // toggle visibility
            if (self.selectedEventTarget && self.selectedEventTarget.length > 0) {
                if (!eventMenuEl.hasClass(EVENT_MENU_VISIBLE)) {
                    eventMenuEl.addClass(EVENT_MENU_VISIBLE);
                    cancelSelection();
                }
            } else {
                if (eventMenuEl.hasClass(EVENT_MENU_VISIBLE)) {
                    eventMenuEl.removeClass(EVENT_MENU_VISIBLE);
                }
                self.selectedEventTarget = undefined;
            }

            // reposition event menu
            repositionEventmenu();
        };

        var repositionEventmenu = function repositionEventmenu() {
            // get plugin html selector references
            var EVENT_MENU_CONTAINER = SELECTORS.EVENT_MENU_CONTAINER,
                DATE_CELL_CONTENT = SELECTORS.DATE_CELL_CONTENT,
                CONTAINER = SELECTORS.CONTAINER;
            var EVENT_MENU_ABOVE = CLASSNAMES.EVENT_MENU_ABOVE;

            // get end element

            var end = self.selectedEventTarget;
            var container = $(CONTAINER);
            var eventMenuEl = container.find(EVENT_MENU_CONTAINER);
            var viewport = getViewport();

            if (end != null && end != undefined) {
                var offset = end.offset();
                var left = offset ? offset.left : 0;
                var top = offset ? offset.top + end.outerHeight() - 10 : 0;

                if (end.outerWidth() > eventMenuEl.outerWidth()) {
                    left = left + (end.outerWidth() - eventMenuEl.outerWidth()) / 2;
                } else {
                    left = left - (eventMenuEl.outerWidth() - end.outerWidth()) / 2;
                }

                if (eventMenuEl.outerHeight() + top > viewport.height) {
                    top = offset ? offset.top - eventMenuEl.outerHeight() + 10 : 0;
                    if (!eventMenuEl.hasClass(EVENT_MENU_ABOVE)) {
                        eventMenuEl.addClass(EVENT_MENU_ABOVE);
                    }
                } else {
                    if (eventMenuEl.hasClass(EVENT_MENU_ABOVE)) {
                        eventMenuEl.removeClass(EVENT_MENU_ABOVE);
                    }
                }

                // add css positions to element
                eventMenuEl.css({ 'top': top, 'left': left });
            }
        };

        var repositionAddmenu = function repositionAddmenu() {
            // get plugin html selector references
            var ADD_MENU_CONTAINER = SELECTORS.ADD_MENU_CONTAINER,
                DATE_CELL_CONTENT = SELECTORS.DATE_CELL_CONTENT,
                CONTAINER = SELECTORS.CONTAINER;
            var ADD_MENU_ABOVE = CLASSNAMES.ADD_MENU_ABOVE;

            // get end element

            var end = getSelectionEndCell();
            var container = $(CONTAINER);
            var addMenuEl = container.find(ADD_MENU_CONTAINER);
            var viewport = getViewport();

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

        var repositionEvents = function repositionEvents() {
            for (var i = 0; i < self.eventInstances.length; i++) {
                var eventInstance = self.eventInstances[i];
                eventInstance.reposition();
            }
        };

        var arrayChunk = function arrayChunk(data, chunk_size) {
            var checked_data = [];
            for (var i = 0; i < data.length; i += chunk_size) {
                checked_data.push(data.slice(i, i + chunk_size));
            }
            return checked_data;
        };

        var copyVar = function copyVar(data) {
            return JSON.parse(JSON.stringify(data));
        };

        var getMonthName = function getMonthName(month) {
            // return nuthing if specified month does not exist
            if (MONTHS[month] == undefined) {
                return '';
            }
            // return month
            return MONTHS[month];
        };

        var getSeason = function getSeason() {
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

        var getSelectionEndCell = function getSelectionEndCell() {
            // get end date from selection
            var start = self.selection.length > 0 ? self.selection[0] : null;
            var end = self.selection.length > 1 ? self.selection[1] : start;

            // get plugin html selector references
            var CONTAINER = SELECTORS.CONTAINER,
                DATE_SELECTED = SELECTORS.DATE_SELECTED;

            // select end element if an end date is set

            if (end) {
                end = $(CONTAINER).find('[data-date="' + end + '"]');
            }

            // return end
            return end;
        };

        var getViewport = function getViewport() {
            var width = $(document).outerWidth();
            var height = $(document).outerHeight();
            return { width: width, height: height };
        };

        var refreshCalendarEvents = function refreshCalendarEvents() {
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
            }).done(refreshCalendarEventsDone).fail(refreshCalendarEventsFail);
        };

        var refreshCalendarEventsDone = function refreshCalendarEventsDone(resp) {
            // get the events
            self.events = getEventsData(resp);
            // render events
            renderEvents();
        };

        var refreshCalendarEventsFail = function refreshCalendarEventsFail(err) {
            if (err.statusText != 'abort') {
                var message = 'Failed to load events.';
                var message = err.message && err.message.length > 0 ? err.message : message;
                // alert(message);
            }
        };

        var getEventsData = function getEventsData(data) {
            if (self.settings.respData === null) return data;

            if (typeof self.settings.respData != 'string') {
                console.error(new Error('Data path invalid, please contact system\'s admin.'));
                return data;
            }

            var dataPath = copyVar(self.settings.respData);
            dataPath = dataPath.trim();
            dataPath = dataPath.split('.');

            var events = copyVar(data);

            for (var i = 0; i < dataPath.length; i++) {
                if (!events.hasOwnProperty(dataPath[i])) continue;
                events = events[dataPath[i]];
            }

            if (events) {
                for (var i = 0; i < events.length; i++) {
                    events[i] = parseEvent(events[i]);
                }
            }

            return events;
        };

        var parseEvent = function parseEvent(data) {
            if (self.settings.map && self.settings.map.constructor == Object) {
                var transform = Object.assign({}, data);
                var mapKeys = Object.keys(self.settings.map);
                for (var i = 0; i < mapKeys.length; i++) {
                    transform[mapKeys[i]] = findData(data, self.settings.map[mapKeys[i]]);
                }
                return transform;
            }
            return data;
        };

        var findData = function findData(data, key) {
            if (typeof key != 'string') {
                console.error(new Error('Data path invalid, please contact system\'s admin.'));
                return data;
            }

            var dataPath = copyVar(key);
            dataPath = dataPath.trim();
            dataPath = dataPath.split('.');

            var found = copyVar(data);
            var didFind = false;

            for (var i = 0; i < dataPath.length; i++) {
                if (!found.hasOwnProperty(dataPath[i])) continue;
                found = found[dataPath[i]];
                didFind = true;
            }

            return didFind ? found : null;
        };

        var isInWeek = function isInWeek(week, event) {
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

        var exportTo = function exportTo(ev) {
            ev.preventDefault();
            var el = $(ev.currentTarget),
                CONTAINER = SELECTORS.CONTAINER,
                CONTAINER_ID = SELECTORS.CONTAINER_ID,
                format = el.attr('data-format'),
                target = $('#' + CONTAINER_ID);


            if (format == 'pdf') {} else if (format == 'docx') {}
        };

        var listenViewSelect = function listenViewSelect() {
            $(SELECTORS.VIEW_SELECTOR).off('click', handleViewSelect);
            $(SELECTORS.VIEW_SELECTOR).on('click', handleViewSelect);
        };

        var handleViewSelect = function handleViewSelect(ev) {
            var el = $(ev.currentTarget);
            var option = el.attr('data-option');
            if (self.viewOptions.indexOf(option) == -1) {
                option = 'monthly';
            }
            if (self.settings.view != option) {
                self.settings = $.extend({}, self.settings, {
                    view: option
                });
                // remove any selection
                cancelSelection();
                // rerender calendar
                setTimeout(launch, 200);
            }
        };

        var selectActiveView = function selectActiveView() {
            var VIEWS_LIST_CONTAINER = SELECTORS.VIEWS_LIST_CONTAINER;


            var option = $(VIEWS_LIST_CONTAINER).find("[data-option='" + self.settings.view + "']");

            if (option.length > 0) {
                if (!option.hasClass(CLASSNAMES.ACTIVE)) {
                    $(VIEWS_LIST_CONTAINER).find("[data-toggle='calendar-view']").removeClass(CLASSNAMES.ACTIVE);
                    option.addClass(CLASSNAMES.ACTIVE);
                }
            }
        };

        var leadingZero = function leadingZero(number) {
            if (typeof number == 'number') {
                number = number.toString();
            }
            return number.trim().length >= 2 ? number : '0' + number;
        };

        var destroy = function destroy() {
            if (self.createFormModal) {
                self.createFormModal.destroy();
            }
            if (self.editFormModal) {
                self.editFormModal.destroy();
            }
            $(self.el).children().remove().call(function () {
                $(self.el).html('');
            });
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
                END: 'end',
                HIGHLIGHTED: 'highlighted'
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
        this.start = null;
        this.options = $.extend({
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
            // this.reposition();
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
            return "<button class='" + this.CLASSNAMES().EVENT + "' id='" + this.uniqueID + "' data-evid='" + this.data.id + "' title='" + this.title() + "'>" + "<span class='" + this.CLASSNAMES().LABEL + "'>" + this.data.title + "</span>" + "</button>";
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

            this.event.off('mouseenter', this.handle_on_mouse_enter.bind(this));
            this.event.on('mouseenter', this.handle_on_mouse_enter.bind(this));

            this.event.off('mouseleave', this.handle_on_mouse_leave.bind(this));
            this.event.on('mouseleave', this.handle_on_mouse_leave.bind(this));
        }
    }, {
        key: 'handle_on_click',
        value: function handle_on_click(ev) {
            this.options.onClick(this.data, ev);
        }
    }, {
        key: 'handle_on_mouse_enter',
        value: function handle_on_mouse_enter(ev) {
            var evID = this.event.attr('data-evid');
            if (evID != undefined) {
                $('[data-evid="' + evID + '"]').addClass(this.CLASSNAMES().HIGHLIGHTED);
            }
        }
    }, {
        key: 'handle_on_mouse_leave',
        value: function handle_on_mouse_leave(ev) {
            var evID = this.event.attr('data-evid');
            if (evID != undefined) {
                $('[data-evid="' + evID + '"]').removeClass(this.CLASSNAMES().HIGHLIGHTED);
            }
        }
    }, {
        key: 'reposition',
        value: function reposition() {
            // this.set_start_end();
            // var startDate = new Date(this.data.startDate);
            // var endDate = new Date(this.data.endDate);
            // var left = this.container.offset() ? (this.start.offset().left) - this.container.offset().left : 0; 
            // if(startDate.getTime() == parseInt(this.start.attr('data-date')))
            // {
            //     left = left + 15;
            // }
            // this.event.css({marginLeft: left+'px'});
            // this.resize();
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
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CPEventFormModal = function () {
    /**
     * selectors used within this class
     */
    function CPEventFormModal(uniqueID, options) {
        var _this = this;

        _classCallCheck(this, CPEventFormModal);

        Object.defineProperty(this, 'SELECTORS', {
            enumerable: true,
            writable: true,
            value: function value() {
                return {
                    BODY: 'body',
                    FORM: '.' + _this.PREFIX + '-form',
                    FIELDSET: 'fieldset',
                    MODAL: '.' + _this.PREFIX + '-modal',
                    BUTTON: '.' + _this.PREFIX + '-button',
                    TITLE: 'input[name="event-title"]',
                    END_TIME: 'input[name="end-time"]',
                    END_DATE: 'input[name="end-date"]',
                    START_DATE: 'input[name="start-date"]',
                    START_TIME: 'input[name="start-time"]',
                    ERROR_CONTAINER: '.' + _this.PREFIX + '-error-container'
                };
            }
        });
        Object.defineProperty(this, 'CLASSNAMES', {
            enumerable: true,
            writable: true,
            value: function value() {
                return {
                    SHOW: 'show',
                    CANCEL: 'cancel',
                    SAVE: 'save',
                    DELETE: 'delete'
                };
            }
        });
        Object.defineProperty(this, 'PREFIX', {
            enumerable: true,
            writable: true,
            value: 'cp-ef'
        });
        Object.defineProperty(this, 'fields', {
            enumerable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, 'dateTimeFields', {
            enumerable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, 'flatpickrs', {
            enumerable: true,
            writable: true,
            value: null
        });

        this.uniqueID = uniqueID;
        this.id = null;
        this.modal = null;
        this.options = Object.assign({
            url: null,
            edit: false,
            onWillShow: null,
            onShown: null,
            onWillHide: null,
            onHidden: null,
            onDelete: null,
            fieldsList: []
        }, options);

        // bind methods
        this.html = this.html.bind(this);
        this.render = this.render.bind(this);
        this.componentDidRender = this.componentDidRender.bind(this);
    }

    /**
     * class names used within the component
     */


    _createClass(CPEventFormModal, [{
        key: 'componentDidRender',
        value: function componentDidRender() {
            // reset/set modal
            this.modal = $('#' + this.uniqueID);
            // reset/set listeners
            this.listeners();
            // enable datetime fields
            this.enableDatetieFields();
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            // required selectors
            var _SELECTORS = this.SELECTORS(),
                BODY = _SELECTORS.BODY;

            // select modal


            var modal = $('#' + this.uniqueID);

            // remove modal if exists
            if (modal.length > 0) {
                modal.remove();
            }

            // render new form
            $(this.html().trim()).attr('id', this.uniqueID).appendTo(BODY).call(function () {
                return _this2.renderFields();
            }).call(function () {
                return _this2.componentDidRender();
            });
        }
    }, {
        key: 'html',
        value: function html() {
            var _this3 = this;

            return ('\n            <div class="' + this.PREFIX + '-modal">\n                <div class="' + this.PREFIX + '-backdrop">&nbsp;</div>\n                <div class="' + this.PREFIX + '-content">\n                    <div class="' + this.PREFIX + '-dialog">\n                        <form action="javascript:;" class="' + this.PREFIX + '-form" method="POST">\n                            <fieldset>\n                            ' + (this.options.fieldsList.constructor == Array ? this.options.fieldsList.map(function (group, index) {
                return _this3.renderFieldsList(group, index);
            }).join('') : null) + '\n                                <div class="' + this.PREFIX + '-actions">\n                                    ' + (this.options.editting ? '<button type="button" \n                                            class="' + this.PREFIX + '-button delete"\n                                        > Delete </button>' : "") + '\n                                    <button type="button" class="' + this.PREFIX + '-button ' + this.CLASSNAMES().CANCEL + '">Cancel</button>\n                                    <button type="submit" class="' + this.PREFIX + '-button ' + this.CLASSNAMES().SAVE + '">Save</button>\n                                </div>\n                            </fieldset>\n                        </form>\n                    </div>\n                </div>\n            </div>\n        ').trim();
        }
    }, {
        key: 'renderFieldsList',
        value: function renderFieldsList(group, index) {
            var _this4 = this;

            if (group.constructor != Array) return null;
            var parent = '' + this.uniqueID + this.PREFIX + '-group' + index;
            return ('\n            <div\n                class="' + this.PREFIX + '-group"\n            >\n                ' + group.map(function (field, index) {
                return _this4.makeField(field, parent, index);
            }).join("") + '\n            </div>\n        ').trim();
        }
    }, {
        key: 'makeField',
        value: function makeField(field, parent, index) {
            var id = '' + parent + this.PREFIX + '-group-item' + index;
            var container = '#' + id;
            var composition = null;
            if (field && (typeof field === 'undefined' ? 'undefined' : _typeof(field)) == 'object' && field.constructor == Object && Object.keys(field)) {
                // create field based on type
                switch (field.type) {
                    case 'text':
                        composition = new CPFText(container, _extends({}, field));
                        break;
                    case 'date':
                        composition = new CPFDate(container, _extends({}, field));
                        break;
                    case 'datetime':
                        composition = new CPFDatetime(container, _extends({}, field));
                        this.dateTimeFields.push(composition);
                        break;
                    case 'select':
                        composition = new CPFSelect(container, _extends({}, field));
                        break;
                    case 'radio':
                        composition = new CPFRadioGroup(container, _extends({}, field));
                        break;
                    case 'time':
                        composition = new CPFTime(container, _extends({}, field));
                        break;
                }
            }

            if (composition) {
                this.fields.push(composition);
            }

            return '<div class="' + this.PREFIX + '-group-item" id="' + id + '"></div>';
        }
    }, {
        key: 'fieldHtmlType',
        value: function fieldHtmlType(type) {
            switch (type) {
                case 'select':
                    return 'select';
                case 'long-text':
                    return 'textarea';
                default:
                    return 'input';
            }
        }
    }, {
        key: 'renderFields',
        value: function renderFields() {
            if (!this.fields || this.fields.constructor != Array) {
                return;
            }
            for (var i = 0; i < this.fields.length; i++) {
                this.fields[i].render();
            }
        }
    }, {
        key: 'listeners',
        value: function listeners() {
            var _SELECTORS2 = this.SELECTORS(),
                BUTTON = _SELECTORS2.BUTTON,
                FORM = _SELECTORS2.FORM;
            // listen for button clicks


            this.modal.find(BUTTON).off('click', this.handleButtonClick.bind(this));
            this.modal.find(BUTTON).on('click', this.handleButtonClick.bind(this));
            // listen for form submit
            this.modal.find(FORM).off('submit', this.handleFormSubmit.bind(this));
            this.modal.find(FORM).on('submit', this.handleFormSubmit.bind(this));
            // check for when for transition ends
            this.modal.find(FORM).off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', this.handleFormTransitionEnd.bind(this));
            this.modal.find(FORM).on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', this.handleFormTransitionEnd.bind(this));
        }
    }, {
        key: 'enableDatetieFields',
        value: function enableDatetieFields() {
            if (this.dateTimeFields.length > 0 && flatpickr !== undefined) {
                this.flatpickrs = {};
                for (var i = 0; i < this.dateTimeFields.length; i++) {
                    var field = this.dateTimeFields[i];
                    this.flatpickrs[field.name] = $(field.containerSelector).find(field.fieldSelector).flatpickr({
                        enableTime: true,
                        altFormat: "F J, Y \\a\\t h:i K",
                        altInput: true,
                        dateFormat: "Y-m-d h:iK"
                    });
                }
            }
        }
    }, {
        key: 'handleButtonClick',
        value: function handleButtonClick(ev) {
            var _CLASSNAMES = this.CLASSNAMES(),
                CANCEL = _CLASSNAMES.CANCEL,
                SAVE = _CLASSNAMES.SAVE,
                DELETE = _CLASSNAMES.DELETE;

            var el = $(ev.currentTarget);
            if (el.hasClass(CANCEL)) {
                this.hide();
            }
            if (el.hasClass(DELETE)) {
                this.confirmDelete();
            }
        }
    }, {
        key: 'handleFormSubmit',
        value: function handleFormSubmit(ev) {
            ev.preventDefault();

            if (this.validate()) {
                // show validation errors
                this.showValidationError();
                return;
            }

            // hide validation error
            this.hideValidationError();

            // save changes
            this.save();
        }
    }, {
        key: 'handleFormTransitionEnd',
        value: function handleFormTransitionEnd(ev) {}
    }, {
        key: 'show',
        value: function show(data, id) {
            if (!this.hasRendered()) return;
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
        key: 'confirmDelete',
        value: function confirmDelete() {
            if (confirm("Are you sure you want to delete, this event?")) ;
            {
                this.delete();
            }
        }
    }, {
        key: 'hide',
        value: function hide() {
            if (!this.hasRendered()) return;

            var _CLASSNAMES3 = this.CLASSNAMES(),
                SHOW = _CLASSNAMES3.SHOW;

            if (this.modal.hasClass(SHOW)) {
                this.modal.removeClass(SHOW);
            }
        }
    }, {
        key: 'hasRendered',
        value: function hasRendered() {
            return this.modal != null && this.modal != undefined && this.modal.length > 0;
        }
    }, {
        key: 'reset',
        value: function reset(data) {
            // 
            var field = void 0;

            // hide validation error
            this.hideValidationError();

            // set the field values
            for (var i = 0; i < this.fields.length; i++) {
                field = this.fields[i];
                if (field['type'] == 'datetime' && this.flatpickrs && this.flatpickrs.constructor == Object && this.flatpickrs[field['name']]) {
                    this.flatpickrs[field['name']].setDate(data[field.name], true);
                    continue;
                }
                if (data.hasOwnProperty(field.name)) {
                    field.setValue(data[field.name]);
                }
            }
        }
    }, {
        key: 'formatDate',
        value: function formatDate(date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return this.leadingZero(month) + '/' + this.leadingZero(day) + '/' + year;
        }
    }, {
        key: 'leadingZero',
        value: function leadingZero(data) {
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
            var formData = this.getFormData();

            // // validate title
            // if (!formData.title || formData.title.length < 1) return 'Please enter and event title.';

            // // validate start date
            // if (!formData.startDate || formData.startDate.length < 1) return 'Please select a start date.';
            // if (new Date(formData.startDate) == 'Invalid Date') return 'Start date is not a valid date.';

            // // validate end date
            // if (!formData.endDate || formData.endDate.length < 1) return 'Please select an end date.';
            // if (new Date(formData.endDate) == 'Invalid Date') return 'End date is not a valid date.';

            // // validate start time
            // if (!formData.startTime || formData.startTime.length < 1) return 'Please specify a start time.';
            // if (!this.timeRegex(formData.startTime)) return 'Start time invalid. E.g hh:mm AM/PM.';

            // // validate end time
            // if (!formData.endTime || formData.endTime.length < 1) return 'Please specify a end time.';
            // if (!this.timeRegex(formData.endTime)) return 'End time invalid. E.g hh:mm AM/PM.';

            // default is false
            return false;
        }
    }, {
        key: 'showValidationError',
        value: function showValidationError() {
            // get validation error
            var error = this.validate();

            // stop if there is no validation error
            if (!error) return;

            // get required selectors and class names

            var _SELECTORS3 = this.SELECTORS(),
                FORM = _SELECTORS3.FORM,
                ERROR_CONTAINER = _SELECTORS3.ERROR_CONTAINER;

            var _CLASSNAMES4 = this.CLASSNAMES(),
                SHOW = _CLASSNAMES4.SHOW;

            // get error container


            var errorContainer = this.modal.find(FORM).find(ERROR_CONTAINER);
            if (!errorContainer || errorContainer.length < 1) return;

            // change error text in view
            errorContainer.text(error);

            // make error container visible if not visible
            if (!errorContainer.hasClass(SHOW)) {
                errorContainer.addClass(SHOW);
            }
        }
    }, {
        key: 'hideValidationError',
        value: function hideValidationError() {
            // get required selectors and class names
            var _SELECTORS4 = this.SELECTORS(),
                FORM = _SELECTORS4.FORM,
                ERROR_CONTAINER = _SELECTORS4.ERROR_CONTAINER;

            var _CLASSNAMES5 = this.CLASSNAMES(),
                SHOW = _CLASSNAMES5.SHOW;

            // get error container


            var errorContainer = this.modal.find(FORM).find(ERROR_CONTAINER);
            if (!errorContainer || errorContainer.length < 1) return;

            // change error text in view
            errorContainer.text('');

            // make error container visible if not visible
            if (errorContainer.hasClass(SHOW)) errorContainer.removeClass(SHOW);
        }
    }, {
        key: 'disable',
        value: function disable(state) {
            // get selectors
            var _SELECTORS5 = this.SELECTORS(),
                FORM = _SELECTORS5.FORM,
                FIELDSET = _SELECTORS5.FIELDSET,
                BUTTON = _SELECTORS5.BUTTON;
            // convert state to proper type


            state = state ? true : false;
            // toggle editable state
            this.modal.find(FORM).find(FIELDSET).attr('disabled', state);
            this.modal.find(FORM).find(BUTTON).attr('disabled', state);
        }
    }, {
        key: 'timeRegex',
        value: function timeRegex(time) {
            if (typeof time != 'string') time = time + '';
            var regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            return regex.test(time);
        }
    }, {
        key: 'getFormData',
        value: function getFormData() {
            var data = {};
            for (var i = 0; i < this.fields.length; i++) {
                data[this.fields[i].name] = this.fields[i].getValue();
            }
            // get form values
            return data;
        }
    }, {
        key: 'save',
        value: function save() {
            // get post url
            var url = this.buildUrl();
            // stop if no url was specified
            if (url == null) return;
            // join default data and form data
            var data = Object.assign({}, this.options.data, this.getFormData());
            data = this.addStructs(data);
            // join default headers with custom headers
            var headers = Object.assign({}, this.options.headers);
            // disable form
            this.disable(true);
            // make ajax post request and try to save new event
            $.ajax({
                url: this.options.url,
                data: data,
                headers: headers,
                method: this.options.editting ? 'PUT' : 'POST'
            }).done(this.saveDone.bind(this)).fail(this.saveFailed.bind(this));
        }
    }, {
        key: 'saveDone',
        value: function saveDone(response) {
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
        key: 'saveFailed',
        value: function saveFailed(err) {
            // enable form
            this.disable(false);
            // get and display error message
            var message = 'Failed to' + (this.options.editting ? ' save changes.' : ' save new event.');
            var message = err.message && err.message.length > 0 ? err.message : message;
            alert(message);
        }
    }, {
        key: 'addStructs',
        value: function addStructs(data) {
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
            var url = this.buildUrl('delete');
            // stop if no url was specified
            if (url == null) return;
            // join default data and form data
            var data = Object.assign({}, this.options.data);
            // join default headers with custom headers
            var headers = Object.assign({}, this.options.headers);
            // disable form
            this.disable(true);
            // make ajax post request and try to delete new event
            $.ajax({
                url: this.options.url,
                data: data,
                headers: headers,
                method: 'DELETE'
            }).done(this.deleteDone.bind(this)).fail(this.deleteFailed.bind(this));
        }
    }, {
        key: 'deleteDone',
        value: function deleteDone(response) {
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
        key: 'deleteFailed',
        value: function deleteFailed(err) {
            // enable form
            this.disable(false);
            // get and display error message
            var message = 'Could not delete event, please try again in a moment.';
            var message = err.message && err.message.length > 0 ? err.message : message;
            alert(message);
        }
    }, {
        key: 'buildUrl',
        value: function buildUrl(deleteUrl) {
            deleteUrl = deleteUrl ? true : false;
            if (!deleteUrl && this.options.url == null || deleteUrl && this.options.deleteUrl == null) return null;
            var url = deleteUrl ? JSON.parse(JSON.stringify(this.options.deleteUrl)) : JSON.parse(JSON.stringify(this.options.url));
            var regex = new RegExp(/^(:id)$/, 'ig');
            if (this.options.editting) {
                if (regex.test(url)) {
                    url = url.replace(regex, this.id);
                } else {
                    this.options.data = Object.assign({}, this.options.data, { id: this.id });
                }
            }
            return url;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            if (this.fields || this.fields.constructor == Array) {
                for (var i = 0; i < this.fields.length; i++) {
                    if (thie.field[i]['type'] == 'datetime' && this.flatpickrs && this.flatpickrs.constructor == Object, this.flatpickrs[thie.field[i]['name']]) {
                        this.flatpickrs[thie.field[i]['name']].destroy();
                    }
                    this.fields[i].destroy();
                }
            }
            $(this.uniqueID).remove();
            this.fields = [];
        }
    }]);

    return CPEventFormModal;
}();
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CPField = function () {
    function CPField(container, props) {
        _classCallCheck(this, CPField);

        Object.defineProperty(this, "container", {
            enumerable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "props", {
            enumerable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "prefix", {
            enumerable: true,
            writable: true,
            value: "cp-ef"
        });
        Object.defineProperty(this, "id", {
            enumerable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "type", {
            enumerable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "state", {
            enumerable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "idAttribute", {
            enumerable: true,
            writable: true,
            value: "data-cpf-id"
        });
        Object.defineProperty(this, "fieldSelector", {
            enumerable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "containerSelector", {
            enumerable: true,
            writable: true,
            value: null
        });

        this.container = container;
        this.props = Object.assign({}, this.props, props);
        var date = new Date();
        this.id = "" + date.getTime() + Math.random() * 2000;
        this.name = props.name || null;
        this.fieldSelector = this.htmlType() + "[name=\"" + this.name + "\"]";
        this.containerSelector = "[" + this.idAttribute + "=\"" + this.id + "\"]";
    }

    _createClass(CPField, [{
        key: "render",
        value: function render() {
            $(this.container).call(this.handleWillRender.bind(this)).html(this.content().trim()).call(this.handleCompletedRender.bind(this));
        }
    }, {
        key: "label",
        value: function label() {
            if (typeof this.props.label == 'string') {
                return ("\n                <label \n                    for=\"" + this.props.name + "\"\n                >\n                    " + this.props.label + "\n                </label>\n            ").trim();
            }
            return null;
        }
    }, {
        key: "placeholder",
        value: function placeholder() {
            if (typeof this.props.placeholder == 'string' && this.props.placeholder.trim().length > 0) {
                return this.props.placeholder;
            }
            return null;
        }
    }, {
        key: "handleWillRender",
        value: function handleWillRender() {
            if (typeof this.willRender == 'function') {
                this.willRender();
            }
        }
    }, {
        key: "handleCompletedRender",
        value: function handleCompletedRender() {
            if (typeof this.completedRender == 'function') {
                this.completedRender();
            }
        }
    }, {
        key: "setDefaultValue",
        value: function setDefaultValue() {
            // set default value on the form field
            if (this.props.defaultValue != undefined) {
                switch (this.type) {
                    case 'text':
                    case 'time':
                        $(this.containerSelector).children("input[type=\"" + this.type + "\"]").val(this.props.defaultValue);
                        break;
                    case 'radio':
                        $(this.containerSelector).children("input[value=\"" + this.props.defaultValue + "\"]").props('checked', true);
                        break;
                    case 'date':
                        $(this.containerSelector).children('input[type="date"]').val(this.formatDate(this.props.defaultValue));
                        break;
                }
            }
        }
    }, {
        key: "formatDate",
        value: function formatDate(date) {
            date = new Date(date);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return year + "-" + this.leadingZero(month) + "-" + this.leadingZero(day);
        }
    }, {
        key: "leadingZero",
        value: function leadingZero(data) {
            // return zero if data type is niether string nur number
            if (typeof data != 'string' && typeof data != 'number') return "0";

            // convert data to string if data is a number
            if (typeof data == 'number') data = data.toString();

            // return data with zero prepended to it
            return data.length > 1 ? data : "0" + data;
        }
    }, {
        key: "setState",
        value: function setState(state, callback) {
            var prevState = _extends({}, this.state);
            this.state = Object.assign({}, prevState, state);
            // fire callback if any was set
            if (typeof callback == 'function') {
                callback();
            }
            // fire component changed method
            if (typeof this.componentChanged == 'function') {
                this.componentChanged(prevState);
                this.setDefaultValue();
            }
        }
    }, {
        key: "setValue",
        value: function setValue(value) {
            if (this.type == 'date') {
                value = this.formatDate(value);
            }

            if (this.type == 'datetime') {
                return;
            }

            if (this.type == 'radio') {
                $(this.containerSelector).children(this.htmlType() + "[value=\"" + value + "\"]").prop('checked', true);
                return;
            }

            $(this.containerSelector).children(this.htmlType() + "[name=\"" + this.name + "\"]").val(value);
        }
    }, {
        key: "getValue",
        value: function getValue() {
            return $(this.containerSelector).children(this.fieldSelector).val();
        }
    }, {
        key: "htmlType",
        value: function htmlType() {
            switch (this.props.type) {
                case 'long-text':
                    return 'textarea';
                case 'select':
                    return 'select';
                default:
                    return 'input';
            }
        }
    }, {
        key: "destory",
        value: function destory() {
            $(this.containerSelector).remove();
        }
    }]);

    return CPField;
}();

var AllowedCPFTypes = ['select', 'text', 'long-text', 'email', 'color-picker', 'date', 'time', 'image', 'number', 'phone', 'pdf', 'word-doc', 'spreadsheet', 'checkbox'];
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CPFDate = function (_CPField) {
    _inherits(CPFDate, _CPField);

    function CPFDate(container, props) {
        _classCallCheck(this, CPFDate);

        var _this = _possibleConstructorReturn(this, (CPFDate.__proto__ || Object.getPrototypeOf(CPFDate)).call(this, container, props));

        _this.type = 'date';
        return _this;
    }

    _createClass(CPFDate, [{
        key: "content",
        value: function content() {
            return "\n            <div class=\"" + this.prefix + "-control-group\" " + this.idAttribute + "=\"" + this.id + "\">\n                " + this.label() + "\n                <input \n                    type=\"date\"\n                    name=\"" + this.props.name + "\"\n                    autoComplete=\"off\"\n                    class=\"" + this.prefix + "-form-control\"\n                    " + (this.placeholder() ? "placeholder=\"" + this.placeholder() + "\"" : "DD/MM/YYYY") + "\n                />\n            </div>\n        ";
        }
    }]);

    return CPFDate;
}(CPField);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CPFDatetime = function (_CPField) {
    _inherits(CPFDatetime, _CPField);

    function CPFDatetime(container, props) {
        _classCallCheck(this, CPFDatetime);

        var _this = _possibleConstructorReturn(this, (CPFDatetime.__proto__ || Object.getPrototypeOf(CPFDatetime)).call(this, container, props));

        _this.type = 'datetime';
        return _this;
    }

    _createClass(CPFDatetime, [{
        key: 'content',
        value: function content() {
            return '\n            <div class="' + this.prefix + '-control-group" ' + this.idAttribute + '="' + this.id + '">\n                ' + this.label() + '\n                <input \n                    type="text"\n                    name="' + this.props.name + '"\n                    autoComplete="off"\n                    class="' + this.prefix + '-form-control"\n                    placeholder="' + (this.placeholder() || '') + '"\n                />\n            </div>\n        ';
        }
    }]);

    return CPFDatetime;
}(CPField);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CPFRadioGroup = function (_CPField) {
    _inherits(CPFRadioGroup, _CPField);

    function CPFRadioGroup(container, props) {
        _classCallCheck(this, CPFRadioGroup);

        var _this = _possibleConstructorReturn(this, (CPFRadioGroup.__proto__ || Object.getPrototypeOf(CPFRadioGroup)).call(this, container, props));

        Object.defineProperty(_this, 'renderOptions', {
            enumerable: true,
            writable: true,
            value: function value(_value, label) {
                return (' \n            <div\n                class="' + _this.prefix + '-form-control radio-group"\n            >\n                <label class="' + _this.prefix + '-radio-option">\n                    <input\n                        name="' + _this.props.name + '"\n                        type="radio" \n                        value="' + _value + '"\n                        ' + (_this.props.defaultValue == _value ? "checked" : "") + '\n                    />\n                    <span>' + label + '</span>\n                </label>\n            </div>\n        ').trim();
            }
        });

        _this.type = 'radio';
        return _this;
    }

    _createClass(CPFRadioGroup, [{
        key: 'content',
        value: function content() {
            var _this2 = this;

            if (this.props.options.constructor != Object) {
                return '';
            }
            var options = _extends({}, this.props.options);
            var optionKeys = Object.keys(options);
            return '\n            <div class="' + this.prefix + '-control-group radio-group" ' + this.idAttribute + '="' + this.id + '">\n                ' + this.label() + '\n                ' + optionKeys.map(function (key) {
                return _this2.renderOptions(key, options[key]);
            }).join("") + '\n            </div>\n        ';
        }
    }, {
        key: 'getValue',
        value: function getValue() {
            var radioButtons = $(this.containerSelector).find(this.fieldSelector);

            for (var i = 0; i <= radioButtons.length; i++) {
                var radioButton = radioButtons.eq(i);
                if (radioButton.is(':checked')) {
                    return radioButton.val();
                }
            }
            return '';
        }
    }]);

    return CPFRadioGroup;
}(CPField);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CPFSelect = function (_CPField) {
    _inherits(CPFSelect, _CPField);

    function CPFSelect(container, props) {
        _classCallCheck(this, CPFSelect);

        var _this = _possibleConstructorReturn(this, (CPFSelect.__proto__ || Object.getPrototypeOf(CPFSelect)).call(this, container, props));

        Object.defineProperty(_this, 'renderOptions', {
            enumerable: true,
            writable: true,
            value: function value(_value, label) {
                return ('<option \n            value="' + _value + '"\n            ' + (_this.props.defaultValue == _value ? "selected" : "") + '\n        >\n            ' + label + '\n        </option>').trim();
            }
        });

        _this.type = 'select';
        return _this;
    }

    _createClass(CPFSelect, [{
        key: 'content',
        value: function content() {
            var _this2 = this;

            if (this.props.options.constructor != Object) {
                return '';
            }
            var options = _extends({ "": this.placeholder() }, this.props.options);
            var optionKeys = Object.keys(options);
            return '\n            <div class="' + this.prefix + '-control-group" ' + this.idAttribute + '="' + this.id + '">\n                ' + this.label() + '\n                <select\n                    name="' + this.props.name + '"\n                    class="' + this.prefix + '-form-control"\n                >\n                    ' + optionKeys.map(function (key) {
                return _this2.renderOptions(key, options[key]);
            }).join("") + '\n                </select>\n            </div>\n        ';
        }
    }]);

    return CPFSelect;
}(CPField);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CPFText = function (_CPField) {
    _inherits(CPFText, _CPField);

    function CPFText(container, props) {
        _classCallCheck(this, CPFText);

        var _this = _possibleConstructorReturn(this, (CPFText.__proto__ || Object.getPrototypeOf(CPFText)).call(this, container, props));

        _this.type = 'text';
        return _this;
    }

    _createClass(CPFText, [{
        key: "content",
        value: function content() {
            return "\n            <div class=\"" + this.prefix + "-control-group\" " + this.idAttribute + "=\"" + this.id + "\">\n                " + this.label() + "\n                <input \n                    type=\"text\"\n                    name=\"" + this.props.name + "\"\n                    autoComplete=\"off\"\n                    class=\"" + this.prefix + "-form-control\"\n                    " + (this.placeholder() ? "placeholder=\"" + this.placeholder() + "\"" : "") + "\n                />\n            </div>\n        ";
        }
    }]);

    return CPFText;
}(CPField);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CPFTime = function (_CPField) {
    _inherits(CPFTime, _CPField);

    function CPFTime(container, props) {
        _classCallCheck(this, CPFTime);

        var _this = _possibleConstructorReturn(this, (CPFTime.__proto__ || Object.getPrototypeOf(CPFTime)).call(this, container, props));

        _this.type = 'time';
        return _this;
    }

    _createClass(CPFTime, [{
        key: "content",
        value: function content() {
            return "\n            <div class=\"" + this.prefix + "-control-group\" " + this.idAttribute + "=\"" + this.id + "\">\n                " + this.label() + "\n                <input \n                    type=\"time\"\n                    name=\"" + this.props.name + "\"\n                    autoComplete=\"off\"\n                    class=\"" + this.prefix + "-form-control\"\n                    " + (this.placeholder() ? "placeholder=\"" + this.placeholder() + "\"" : "") + "\n                />\n            </div>\n        ";
        }
    }]);

    return CPFTime;
}(CPField);
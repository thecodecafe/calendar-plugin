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
    const EVENTS = {
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
    const CLASSNAMES = {
        LOADER_SHOW               : 'show-loader',
        CONTAINER                 : PREFIX+'-container',
        CALENDAR                  : PREFIX+'-calendar',
        MONTH_CALENDAR            : PREFIX+'-calendar-{month}',
        SEASON_CALENDAR           : PREFIX+'-calendar-{season}',
        HEADER                    : PREFIX+'-header',
        MONTH_HEADER              : PREFIX+'-header-{month}',
        SEASON_HEADER             : PREFIX+'-header-{season}',
        DATE_CELL                 : PREFIX+'-date',
        WEEK_CELL                 : PREFIX+'-week',
        MONTH_HEADING             : PREFIX+'-month-heading',
        MONTH_CELL                : PREFIX+'-month',
        CONTROLS_CONTAINER        : PREFIX+'-control-container',
        MONTH_NAME                : PREFIX+'-month-name',
        EMPTY_DAY                 : PREFIX+'-empty-day',
        EMPTY_DAY_BEGINNING       : PREFIX+'-empty-day-beginning',
        EMPTY_DAY_ENDING          : PREFIX+'-empty-day-ending',
    }

    /**
     * here we have defined the names of the selector names
     * required for selecting different parts of an instantiated
     * calendar plugin.
     */
    const SELECTORS = {
        CONTAINER                 : '.'+PREFIX+'-container',
        CALENDAR                  : '.'+PREFIX+'-calendar',
        HEADER                    : '.'+PREFIX+'-header',
        DATE_CELL                 : '.'+PREFIX+'-date',
        WEEK_CELL                 : '.'+PREFIX+'-week',
        MONTH_HEADING             : '.'+PREFIX+'-month-heading',
        MONTH_CELL                : '.'+PREFIX+'-month',
        CONTROLS_CONTAINER        : '.'+PREFIX+'-control-container',
        CONTROL_BUTTONS           : '.'+PREFIX+'-control-container > button',
        MONTH_NAME                : '.'+PREFIX+'-month-name',
        EMPTY_DAY                 : '.'+PREFIX+'-empty-day',
        EMPTY_DAY_BEGINNING       : '.'+PREFIX+'-empty-day-beginning',
        EMPTY_DAY_ENDING          : '.'+PREFIX+'-empty-day-ending',
    }

    /**
     * html templates for all the different parts of the calendar
     */
    const TEMPLATES = {
        CONTAINER: "<div class='"+CLASSNAMES.CONTAINER+"'>{header}{calendar}</div>",
        MAIN: "<table class='"+CLASSNAMES.CALENDAR+" {classnames}'><thead>{heading}</thead><tbody>{content}</tbody></table>",
        DAYS_HEADING: "<tr class='"+CLASSNAMES.MONTH_HEADING+"'> <th>Sun</th> <th>Mon</th> <th>Tue</th> <th>Wed</th> <th>Thur</th> <th>Fri</th> <th>Sat</th> </tr>",
        WEEK_ROW: "<tr class='"+CLASSNAMES.WEEK_CELL+"'>{content}</tr>",
        DAY_CELL: "<td class='"+CLASSNAMES.DATE_CELL+" {classnames}'>{content}</td>",
        HEADER: "<div class='"+CLASSNAMES.HEADER+" {classnames}'>{left-control}<h3 class='"+CLASSNAMES.MONTH_NAME+"'>{month}</h3>{right-control}</div>",
        CONTROL: "<div class='"+CLASSNAMES.CONTROLS_CONTAINER+" {position}'><button class='' type='submit' {direction}>{label}</button></div>"
    };

    /**
     * the seasons of the year
     */
    const SEASONS = {
        spring  : {
            display_name: 'Spring',
            months: [3,4,5,6]
        },
        summer  : {
            display_name: 'Summer',
            months: [7,8,9]
        },
        fall    : {
            display_name: 'Fall',
            months: [10,11]
        },
        winter  : {
            display_name: 'Winter',
            months: [12,1,2]
        }
    };

    /**
     * list of months
     */
    const MONTHS = ['January', 'February', 'March',
            'April', 'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'];


    var CalenderPlugin = new function()
    {
        var self = this;
        self.moment = new moment;
        self.now = new Date();

        // plugin settings
        self.settings = {};

        // initializer
        self.init = function(options)
        {
            self.el = this;
            self.settings = $.extend({
                month: self.now.getMonth() + 1,
                year: self.now.getFullYear(),
                dayStyle: 'short',
                cellMaxHeigh: 100,
            }, options);

            // configure seasons
            var seasons = $.extend(SEASONS, options ? options.seasons : {});

            // add seasons to settings
            self.settings.seasons = seasons;

            // ensure month is with in the 1 - 12 range
            if(self.settings.month < 1 || self.settings.month > 12)
            {
                self.settings.month = 1;
            }

            launch();
            return self;
        }

        const launch = function()
        {
            // render calender
            render();
        }

        const render = function()
        {
            if($(self.el).find(SELECTORS.CONTAINER).length > 0)
            {
                $(self.el).find(SELECTORS.CONTAINER).fadeOut(200, function(){
                    $(self.el).html('');
                    $(create_view( create_calendar() )).hide().prependTo($(self.el)).fadeIn(200).call(start);
                });
            }
            else
            {
                $(create_view( create_calendar() )).hide().prependTo($(self.el)).fadeIn(200).call(start);
            }
        }

        const start = function()
        {
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

            // listen for control button click event
            listen_for_control_button_click();

        }

        const create_view = function(calendar)
        {
            var container_tpl = copy_var(TEMPLATES.CONTAINER);
            var header_tpl = copy_var(TEMPLATES.HEADER);
            var calendar_tpl = copy_var(TEMPLATES.MAIN);
            var days_heading_tpl = copy_var(TEMPLATES.DAYS_HEADING);
            var cell_tpl = copy_var(TEMPLATES.DAY_CELL);
            var week_tpl = copy_var(TEMPLATES.WEEK_ROW);
            var left_control = copy_var(TEMPLATES.CONTROL);
            var right_control = copy_var(TEMPLATES.CONTROL);
            var month_name = get_month_name(self.settings.month - 1);
            var season = get_season();
            var weeks = '';

            // loop through calendar and the access weeks within it
            for(var i = 0; i < calendar.length; i++)
            {
                var week = '';
                // loop through each week and access the day within it
                for(var j = 0; j < calendar[i].length; j++)
                {
                    // class names container for dat cell
                    var classnames = '';

                    var dayNum = calendar[i][j].toString();
                    var prevDayNum = calendar[i][j-1] ? calendar[i][j-1].toString() : '';

                    // modify empty days
                    if( dayNum.length < 1 ) {
                        // add empty day class to empty days
                        classnames += ' '+CLASSNAMES.EMPTY_DAY+' ';

                        // add beginning class to first empty day
                        if(j == 0 && dayNum.length < 1) classnames += ' '+CLASSNAMES.EMPTY_DAY_BEGINNING+' ' ;
                        
                        // add ending class to last empty day
                        if(prevDayNum && get_month_days() == prevDayNum.trim()) classnames += ' '+CLASSNAMES.EMPTY_DAY_ENDING+' ' ;
                    }


                    // create day html
                    var day = cell_tpl.replace('{content}', calendar[i][j]);
                        day = day.replace('{classnames}', classnames);

                    // add day to week
                    week += day;
                }
                // create week template
                weeks += week_tpl.replace('{content}', week);
            }

            // create calendar from template
            var calenderClassnames = '';
            calenderClassnames += ' '+ CLASSNAMES.MONTH_CALENDAR.replace('{month}', month_name.toLowerCase())+' ';
            calenderClassnames += ' '+ CLASSNAMES.SEASON_CALENDAR.replace('{season}', season ? season.name : '')+' ';
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
            headerClassnames += ' '+ CLASSNAMES.MONTH_HEADER.replace('{month}', month_name.toLowerCase())+' ';
            headerClassnames += ' '+ CLASSNAMES.SEASON_HEADER.replace('{season}', season ? season.name : '')+' ';
            header_tpl = header_tpl.replace('{left-control}', left_control);
            header_tpl = header_tpl.replace('{right-control}', right_control);
            header_tpl = header_tpl.replace('{month}', month_name+' '+self.settings.year);
            header_tpl = header_tpl.replace('{classnames}', headerClassnames);

            // add header to calendar
            container_tpl = container_tpl.replace('{header}', header_tpl);
            // add calender to container
            container_tpl = container_tpl.replace('{calendar}', calendar_tpl);

            // return generated calendar
            return container_tpl;
        }

        const create_calendar = function() {
            var days = get_month_days(self.settings.month, self.settings.year);
            var firstDay = new Date(self.settings.year, self.settings.month - 1, 1);
            var startDay = firstDay.getDay();
            return array_chunk(create_month_arrays(startDay, days), 7);
        }

        const create_month_arrays = function(start, maxDays)
        {
            var days = [];
            // add days to days array
            for(i = 0; i < 35; i++){
                if(i >= start && (i - start) < maxDays ){
                    // add day to array
                    days.push( (i - start+1 ) )
                }
                else{
                    // add empty day entry to array
                    days.push('');
                }
            }
            // return days in array
            return days;
        }

        const get_month_days = function(month, year)
        {
            // create month number as string
            var monthStr = typeof month == 'number' ? month.toString() : month;

            // days number variable
            var days;

            // set 31 days and 30 days months
            let _31Days = ['1', '3', '5', '7', '8', '10', '12'];
            let _30Days = ['4', '6', '9', '11', '8'];

            // get days in the specified month
            if (_31Days.indexOf(monthStr) != -1) days = 31;
            else if (_30Days.indexOf(monthStr) != -1) days = 30;
            else if (month == 2) {
                console.log('February');
                if (is_leap_year(year)) days = 29;
                else days = 28;
            }

            // return the number of the days for the given month
            return (days);
        }

        const is_leap_year = function(year)
        {
            if (year % 4 == 0) // basic rule
            return true // is leap year
            /* else */ // else not needed when statement is "return"
            return false // is not leap year
        }

        const resize_calendar = function()
        {
            let {CONTAINER, CALENDAR, WEEK_CELL, DATE_CELL} = SELECTORS;
            var cells = $(CONTAINER+' '+CALENDAR+' '+WEEK_CELL+' '+DATE_CELL);
            var height = $(cells[0]).outerWidth() > self.settings.cellMaxHeigh ? self.settings.cellMaxHeigh : $(cells[0]).outerWidth();
            cells.css({height: height+'px'});
        }

        const reposition_cell_background = function()
        {
            let {CONTAINER, CALENDAR, WEEK_CELL, DATE_CELL} = SELECTORS;
            var cells = $(CONTAINER+' '+CALENDAR+' '+WEEK_CELL+' '+DATE_CELL);
            var width = $(cells[0]).outerWidth();
            var bgDistance = 0;

            for(var i = 0; i < cells.length; i++)
            {
                // get sell from cells list
                var cell = cells.eq(i);

                // empty days 
                if(cell.hasClass(CLASSNAMES.EMPTY_DAY))
                {
                    // set background position
                    var bgPosition = (bgDistance * width);
                    bgPosition = bgPosition <= 0 ? 0 : -bgPosition;

                    // set background x position
                    cell.css({backgroundPosition: bgPosition+'px'+" 0px"});

                    // increment bg distance
                    bgDistance++;
                }

            }
        }

        const listen_for_control_button_click = function()
        {
            // copy selector name
            var BUTTONS = copy_var(SELECTORS.CONTROL_BUTTONS);
            $(BUTTONS).off('click', handle_controll_button_click);
            $(BUTTONS).on('click', handle_controll_button_click);
        }

        const handle_controll_button_click = function(ev)
        {
            // get target element
            var el = ev.target;
            var left = $(el).attr('left');
            var right = $(el).attr('right');
            var settings  = copy_var(self.settings);

            // determine what direction to go to
            if(left != undefined)
            {
                // set year
                settings.year = settings.month <= 1 ? settings.year - 1 : settings.year;
                // set month
                settings.month = settings.month <= 1 ? settings.month = 12 : settings.month - 1;
            }
            else if(right != undefined)
            {
                // set year
                settings.year = settings.month >= 12 ? settings.year + 1 : settings.year;
                // set month
                settings.month = settings.month >= 12 ? settings.month = 1 : settings.month + 1;
            }

            // update object settings
            self.settings = $.extend(self.settings, settings);

            // rerender calendar
            launch()
        }

        // utl functions go here
        const array_chunk = function(data, chunk_size)
        {
            var checked_data = [];
            for (var i=0; i < data.length; i+=chunk_size)
            {
                checked_data.push(data.slice(i,i+chunk_size));
            }
            return checked_data
        }


        const copy_var = function(data)
        {
            return JSON.parse(JSON.stringify(data));
        }

        const get_month_name = function(month)
        {
            // return nuthing if specified month does not exist
            if(MONTHS[month] == undefined)
            {
                return '';
            }
            // return month
            return MONTHS[month];
        }

        const get_season = function()
        {
            for(var name in self.settings.seasons)
            {
                // get season
                var season = self.settings.seasons[name];

                // skip season if not supported
                if(season == null) continue;

                // skip if month is not season
                if(season.months.indexOf(self.settings.month) == -1) continue;

                // return season info
                return {
                    name         : name,
                    display_name : season.display_name,
                };
            }

            return null;
        }
        
    }

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
    }

})(jQuery)
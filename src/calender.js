(function($){

    /**
     * basic constants we will need within this javascript file
     */
    const NAME                         = 'CalendarPlugin';
    const PREFIX                       = 'cp';
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
        ACTIVE                     : 'active',
        LOADER_SHOW                : 'show-loader',
        CONTAINER                  : PREFIX+'-container',
        CALENDAR                   : PREFIX+'-calendar',
        MONTH_CALENDAR             : PREFIX+'-calendar-{month}',
        SEASON_CALENDAR            : PREFIX+'-calendar-{season}',
        HEADER                     : PREFIX+'-header',
        HEADER_CONTENT             : PREFIX+'-header-content',
        HEADER_OPTIONS_CONTAINER   : PREFIX+'-header-options-container',
        HEADER_OPTIONS             : PREFIX+'-header-options',
        HEADER_OPTIONS_INNER             : PREFIX+'-header-options-inner',
        HEADER_OPTIONS_BUTTONS_CONTAINER : PREFIX+'-header-options-buttons-container',
        HEADER_OPTIONS_BUTTON            : PREFIX+'-header-options-button',
        HEADER_OPTIONS_ABOVE             : PREFIX+'-header-options-above',
        HEADER_OPTIONS_VISIBLE           : PREFIX+'-header-options-visible',
        NAV_CONTROLS               : PREFIX+'-nav-controls',
        CONTROLS_CONTAINER         : PREFIX+'-nav',
        MONTH_HEADER               : PREFIX+'-header-{month}',
        SEASON_HEADER              : PREFIX+'-header-{season}',
        DATE_CELL                  : PREFIX+'-date',
        DATE_DAY                   : PREFIX+'-day',
        DATE_SELECTED              : PREFIX+'-date-selected',
        DATE_CELL_CONTENT          : PREFIX+'-date-content',
        WEEK_ROW                   : PREFIX+'-week',
        WEEK_EVENTS                : PREFIX+'-week-events',
        MONTH_HEADING              : PREFIX+'-month-heading',
        MONTH_CELL                 : PREFIX+'-month',
        MONTH_NAME_BUTTON          : PREFIX+'-month-name',
        EMPTY_DAY                  : PREFIX+'-empty-day',
        EMPTY_DAY_BEGINNING        : PREFIX+'-empty-day-beginning',
        EMPTY_DAY_ENDING           : PREFIX+'-empty-day-ending',
        ADD_MENU_CONTAINER         : PREFIX+'-add-menu',
        ADD_MENU_INNER             : PREFIX+'-add-menu-inner',
        ADD_MENU_BUTTONS_CONTAINER : PREFIX+'-add-menu-buttons-container',
        ADD_MENU_BUTTON            : PREFIX+'-add-menu-button',
        ADD_MENU_ABOVE             : PREFIX+'-add-menu-above',
        ADD_MENU_VISIBLE           : PREFIX+'-add-menu-visible',
        VIEWS_LIST_CONTAINER       : PREFIX+'-view-list-container',
        VIEWS_LIST                 : PREFIX+'-view-list',
        VIEWS_ITEM                 : PREFIX+'-view',
        VIEW_BUTTON                : PREFIX+'-view-button',
    }

    /**
     * here we have defined the names of the selector names
     * required for selecting different parts of an instantiated
     * calendar plugin.
     */
    const SELECTORS = {
        BODY                       : 'body',
        CONTAINER                  : '.'+PREFIX+'-container',
        CONTAINER_ID               : PREFIX+'-container-id',
        CALENDAR                   : '.'+PREFIX+'-calendar',
        HEADER                     : '.'+PREFIX+'-header',
        HEADER_CONTENT             : '.'+PREFIX+'-header-content',
        HEADER_OPTIONS_CONTAINER   : '.'+PREFIX+'-header-options-container',
        HEADER_OPTIONS             : '.'+PREFIX+'-header-options',
        HEADER_OPTIONS_INNER             : '.'+PREFIX+'-header-options-inner',
        HEADER_OPTIONS_BUTTONS_CONTAINER : '.'+PREFIX+'-header-options-buttons-container',
        HEADER_OPTIONS_BUTTON            : '.'+PREFIX+'-header-options-button',
        HEADER_OPTIONS_ABOVE             : '.'+PREFIX+'-header-options-above',
        HEADER_OPTIONS_VISIBLE           : '.'+PREFIX+'-header-options-visible',
        NAV_CONTROLS               : '.'+PREFIX+'-nav-controls',
        CONTROL_BUTTONS            : 'button.'+PREFIX+'-nav',
        DATE_CELL                  : '.'+PREFIX+'-date',
        DATE_DAY                   : '.'+PREFIX+'-day',
        DATE_SELECTED              : '.'+PREFIX+'-date-selected',
        DATE_CELL_CONTENT          : '.'+PREFIX+'-date-content',
        WEEK_ROW                   : '.'+PREFIX+'-week',
        WEEK_EVENTS                : '.'+PREFIX+'-week-events',
        MONTH_HEADING              : '.'+PREFIX+'-month-heading',
        MONTH_CELL                 : '.'+PREFIX+'-month',
        MONTH_NAME_BUTTON          : '.'+PREFIX+'-month-name',
        EMPTY_DAY                  : '.'+PREFIX+'-empty-day',
        EMPTY_DAY_BEGINNING        : '.'+PREFIX+'-empty-day-beginning',
        EMPTY_DAY_ENDING           : '.'+PREFIX+'-empty-day-ending',
        ADD_MENU_CONTAINER         : '.'+PREFIX+'-add-menu',
        ADD_MENU_INNER             : '.'+PREFIX+'-add-menu-inner',
        ADD_MENU_BUTTON            : '.'+PREFIX+'-add-menu-button',
        ADD_MENU_BUTTONS_CONTAINER : '.'+PREFIX+'-add-menu-buttons-container',
        VIEWS_LIST_CONTAINER       : '.'+PREFIX+'-view-list-container',
        VIEWS_LIST                 : '.'+PREFIX+'-view-list',
        VIEWS_ITEM                 : '.'+PREFIX+'-view',
        VIEW_BUTTON                : '.'+PREFIX+'-view-button',
        VIEW_SELECTOR              : '[data-toggle="calendar-view"]',
        EVENT_FORM_MODAL           : '.'+PREFIX+'-ef-modal',
        EXPORT_BUTTON              : '[data-export="calendar"]',
    }

    /**
     * html month templates for all the different parts of the calendar
     */
    const TEMPLATES = {
        CONTAINER: "<div class='"+CLASSNAMES.CONTAINER+"' id='"+SELECTORS.CONTAINER_ID+"'>{header}{calendar}{add_menu}</div>",
        MAIN: "<table class='"+CLASSNAMES.CALENDAR+" {classnames}'  cellspacing='0' cellpadding='0'><thead>{heading}</thead><tbody>{content}</tbody></table>",
        DAYS_HEADING: "<tr class='"+CLASSNAMES.MONTH_HEADING+"'> <th>Sun</th> <th>Mon</th> <th>Tue</th> <th>Wed</th> <th>Thur</th> <th>Fri</th> <th>Sat</th> </tr>",
        WEEK_ROW: "<tr class='"+CLASSNAMES.WEEK_ROW+"' data-row='{row}'>{content}</tr>",
        DAY_CELL: "<td class='"+CLASSNAMES.DATE_CELL+" {classnames}' data-date='{date}'><div class='"+CLASSNAMES.DATE_CELL_CONTENT+"'>{content}</div></td>",
        HEADER: "<div class='"+CLASSNAMES.HEADER+" {classnames}'>"+
                    "<div class='"+CLASSNAMES.NAV_CONTROLS+"'>{left-control}{right-control}</div>"+
                    "<div class='"+CLASSNAMES.HEADER_CONTENT+"'>"+
                        "<div class='"+CLASSNAMES.HEADER_OPTIONS_CONTAINER+"'>"+
                            "<button class='"+CLASSNAMES.MONTH_NAME_BUTTON+"'>{month}<span class='caret'></span></button>"+
                            "<div class='"+CLASSNAMES.HEADER_OPTIONS+"' id='headerOptionsComponent'><div class='"+CLASSNAMES.HEADER_OPTIONS_INNER+"'><div class='"+CLASSNAMES.HEADER_OPTIONS_BUTTONS_CONTAINER+"'><a class='"+CLASSNAMES.HEADER_OPTIONS_BUTTON+"' href='javascript:;' data-export='calendar' data-format='pdf'>Export to .pdf</a><a class='"+CLASSNAMES.HEADER_OPTIONS_BUTTON+"' href='javascript:;' data-export='calendar' data-format='docx'>Export to .docx</a></div><span class='caret'></span></div></div>"+
                        "</div>"+
                    "</div>"+
                    "{view-options}"+
                "</div>",
        VIEWS: "<div class='"+CLASSNAMES.VIEWS_LIST_CONTAINER+"'><ul class='"+CLASSNAMES.VIEWS_LIST+"'>"+
                    "<li class='"+CLASSNAMES.VIEWS_ITEM+"'>"+
                        "<button type='button' class='"+CLASSNAMES.VIEW_BUTTON+" daily' data-toggle='calendar-view' data-option='daily'>Daily</button>"+
                    "</li>"+
                    "<li class='"+CLASSNAMES.VIEWS_ITEM+"'>"+
                        "<button type='button' class='"+CLASSNAMES.VIEW_BUTTON+" weekly' data-toggle='calendar-view' data-option='weekly'>Weekly</button>"+
                    "</li>"+
                    "<li class='"+CLASSNAMES.VIEWS_ITEM+"'>"+
                        "<button type='button' class='"+CLASSNAMES.VIEW_BUTTON+" monthly' data-toggle='calendar-view' data-option='monthly'>Monthly</button>"+
                    "</li>"+
                "</ul></div>",
        CONTROL: "<button class='"+CLASSNAMES.CONTROLS_CONTAINER+"' type='submit' {direction}>{label}</button>",
        ADD_MENU: "<div class='"+CLASSNAMES.ADD_MENU_CONTAINER+"' id='addMenuComponent'><div class='"+CLASSNAMES.ADD_MENU_INNER+"'><div class='"+CLASSNAMES.ADD_MENU_BUTTONS_CONTAINER+"'><button class='"+CLASSNAMES.ADD_MENU_BUTTON+"' type='button' data-action='add-event'>Add Event</button><button class='"+CLASSNAMES.ADD_MENU_BUTTON+" cancel' data-action='cancel' type='button'>Cancel</button></div><span class='caret'></span></div></div>",
    };

    /**
     * the seasons of the year
     */
    const SEASONS = {
        spring: {
            display_name: 'Spring',
            months: [3,4,5,6]
        },
        summer: {
            display_name: 'Summer',
            months: [7,8,9]
        },
        fall: {
            display_name: 'Fall',
            months: [10,11]
        },
        winter: {
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
        self.now = new Date();
        self.selection = [];
        self.modal = null;
        self.editModal = null;
        self.events = [];
        self.eventInstances = [];
        self.viewOptions = ['daily', 'weekly', 'monthly'];
        var weekStart = moment( moment().format('YYYY-MM-DD 00:00:00') );
        var weekEnd = moment(weekStart).add(6, 'days');
        var dailyDate = moment();

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
                cellMaxHeigh: 200,
                respData: 'data',
                // reference to event data
                id: 'id',
                title: 'title',
                startDate: 'startDate',
                endDate:   'endDate',
                startTime: 'startTime',
                endTime:   'endTime',
                creatRequest: null,
                editRequest: null,
                view: 'monthly',
                hideViewOptions: false 
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

            // create new event modal
            self.modal = new CPEventFormModal('new-event'+self.now.getTime(), {
                url: self.settings.createUrl || self.settings.url || null,
                data: self.settings.data,
                headers: self.settings.headers,
                onSaved: refresh_calendar_events,
                requestStruct: self.settings.creatRequest || null,
            });
            self.modal.render();

            // edit new event modal
            self.editModal = new CPEventFormModal('edit-event'+self.now.getTime(), {
                editting: true,
                url: self.settings.editUrl || self.settings.url || null,
                deleteUrl: self.settings.deleteUrl || self.settings.url || null,
                data: self.settings.data,
                headers: self.settings.headers,
                onSaved: refresh_calendar_events,
                onDelete: refresh_calendar_events,
                requestStruct: self.settings.editRequest || null,
            });
            self.editModal.render();

        }

        const render_OLD = function()
        {
            var html = '';
            switch(self.settings.view)
            {
                case 'daily':
                    html = daily_calendar();
                break;
                case 'weekly':
                    html = weekly_calendar();
                break;
                case 'monthly':
                    html = create_view( create_calendar() );
                break;
            }

            if($(self.el).find(SELECTORS.CONTAINER).length > 0){
                $(self.el).find(SELECTORS.CONTAINER).fadeOut(1, function(){
                    $(self.el).html('');
                    $( html ).hide().prependTo($(self.el)).fadeIn(1, function(){
                        refresh_calendar_events();
                    }).call(start);
                });
            }
            else{
                $( html ).hide().prependTo($(self.el)).fadeIn(1, function(){
                    refresh_calendar_events();
                }).call(start);
            }
        }

        const render = function()
        {
            var html = '';
            switch(self.settings.view)
            {
                case 'daily':
                    html = daily_calendar();
                break;
                case 'weekly':
                    html = weekly_calendar();
                break;
                case 'monthly':
                    html = create_view( create_calendar() );
                break;
            }

            $(self.el).html('');
            $( html ).prependTo($(self.el));
            refresh_calendar_events();
            start();
        }

        const weekly_calendar = function(){
            return "<div class='"+CLASSNAMES.CONTAINER+"' id='"+SELECTORS.CONTAINER_ID+"'>"+
                render_header('weekly')+
                "<table class='"+CLASSNAMES.CALENDAR+" weekly'  cellspacing='0' cellpadding='0'>"+
                    "<thead>"+render_weekly_heading()+"</thead>"+
                    "<tbody>"+render_weekly_body()+"</tbody>"+
                "</table>"+
                render_add_menu()+
            "</div>";
        }

        const daily_calendar = function(){
            return "<div class='"+CLASSNAMES.CONTAINER+"' id='"+SELECTORS.CONTAINER_ID+"'>"+
                render_header('daily')+
                "<table class='"+CLASSNAMES.CALENDAR+" daily'  cellspacing='0' cellpadding='0'>"+
                    "<thead>"+render_daily_heading()+"</thead>"+
                    "<tbody>"+render_daily_body()+"</tbody>"+
                "</table>"+
                render_add_menu()+
            "</div>";
        }

        const render_daily_heading = function()
        {
            var heading = '<tr class="'+CLASSNAMES.MONTH_HEADING+'">'+
                            '<th>Time</th>'+
                            '<th></th>'+
                          '</tr>';
            return heading;
        }

        const render_daily_body = function()
        {
            var hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                body = '', amPm;

            for(var i = 0; i < hours.length; i++){
                amPm = i >= 12 ? 'PM' : 'AM';
                body += `<tr class="${CLASSNAMES.WEEK_ROW} daily">
                            <td>${leading_zero(hours[i])} ${amPm}</td>
                            <td class="${CLASSNAMES.DATE_CELL} ${CLASSNAMES.DATE_DAY}" data-date="${moment(dailyDate.format(`YYYY-MM-DD ${leading_zero(hours[i])}:00:00`)).get('time')}">
                                <div class="${CLASSNAMES.DATE_CELL_CONTENT}"></div>
                            </td>
                        </tr>`;
            }
            return body;
        }

        const render_weekly_heading = function()
        {
            var heading = '<tr class="'+CLASSNAMES.MONTH_HEADING+'"><th>Time</th>';
            for(var i = weekStart.get('time'); i <= weekEnd.get('time'); i = i+86400000)
            {
                heading += '<th >'+moment(i).format('ddd DD')+'</th>';
            }
            heading += '</tr>';
            return heading;
        }

        const render_weekly_body = function()
        {
            var hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                body = '', 
                time, timeDate,
                amPm;

            for(var i = 0; i < hours.length; i++){
                amPm = i >= 12 ? 'PM' : 'AM';
                time = leading_zero(hours[i])+' '+amPm;
                body += '<tr class="'+CLASSNAMES.WEEK_ROW+' weekly">'+
                    '<td style=" text-align: right; padding-right: 15px;">'+time+'</td>';
                for(var j = weekStart.get('time'); j <= weekEnd.get('time'); j = j+86400000){
                    timeDate = moment(moment( j ).format('YYYY-MM-DD ')+leading_zero(hours[i])+':00:00');
                    body += '<td class="'+CLASSNAMES.DATE_CELL+' '+CLASSNAMES.DATE_DAY+'" data-date="'+timeDate.get('time')+'"><div class="'+CLASSNAMES.DATE_CELL_CONTENT+'"></div></td>';
                }
                body += '</tr>';
            }
            return body;
        }

        const render_header = function(type){
            var month_name = get_month_name(self.settings.month - 1);
            var headerClassnames = '';
            headerClassnames += ' '+ CLASSNAMES.MONTH_HEADER.replace('{month}', get_month_name(self.settings.month - 1).toLowerCase())+' ';
            headerClassnames += ' '+ CLASSNAMES.SEASON_HEADER.replace('{season}', get_season() ? get_season().name : '')+' ';
            // create view specific name
            if(type == 'weekly'){
                var month_name = get_month_name(weekStart.get('month'));
                headerClassnames += ' '+ CLASSNAMES.MONTH_HEADER.replace('{month}', get_month_name(weekStart.get('month') - 1).toLowerCase())+' ';

                month_name+= ' '+leading_zero(weekStart.get('date'))+' - ';
                month_name+= (weekEnd.get('month') != weekStart.get('month')) 
                            ? get_month_name(weekEnd.get('month'))+' '+leading_zero(weekEnd.get('date')) 
                            :  leading_zero(weekEnd.get('date')) ;
            }

            // create view specific name
            if(type == 'daily'){
                var month_name = dailyDate.format('Do MMMM YYYY');
                headerClassnames += ' '+ CLASSNAMES.MONTH_HEADER.replace('{month}', get_month_name(dailyDate.get('month') - 1).toLowerCase())+' ';
            }

            // return html
            return "<div class='"+CLASSNAMES.HEADER+" "+headerClassnames+"'>"+
                "<div class='"+CLASSNAMES.NAV_CONTROLS+"'>"+render_nav_control('left')+render_nav_control('right')+"</div>"+
                "<div class='"+CLASSNAMES.HEADER_CONTENT+"'>"+
                    "<div class='"+CLASSNAMES.HEADER_OPTIONS_CONTAINER+"'>"+
                        "<button class='"+CLASSNAMES.MONTH_NAME_BUTTON+"'>"+month_name+"<span class='caret'></span></button>"+
                        "<div class='"+CLASSNAMES.HEADER_OPTIONS+"' id='headerOptionsComponent'>"+
                            "<div class='"+CLASSNAMES.HEADER_OPTIONS_INNER+"'>"+
                                "<div class='"+CLASSNAMES.HEADER_OPTIONS_BUTTONS_CONTAINER+"'>"+
                                    "<a class='"+CLASSNAMES.HEADER_OPTIONS_BUTTON+"' href='javascript:;' "+
                                        "data-export='calendar' data-format='pdf'>Export to .pdf</a>"+
                                    "<a class='"+CLASSNAMES.HEADER_OPTIONS_BUTTON+"' href='javascript:;' "+
                                        "data-export='calendar' data-format='docx'>Export to .docx</a>"+
                                "</div>"+
                                "<span class='caret'></span>"+
                            "</div>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
                render_view_options()+
            "</div>"
        }

        const render_nav_control = function(direction){
            var label = direction == 'right' ? '&rarr;' : '&larr;';
            return "<button class='"+CLASSNAMES.CONTROLS_CONTAINER+"' "+
                        "type='submit' "+direction+">"+label+"</button>";
        }

        const render_view_options = function(){
            return "<div class='"+CLASSNAMES.VIEWS_LIST_CONTAINER+"'><ul class='"+CLASSNAMES.VIEWS_LIST+"'>"+
                "<li class='"+CLASSNAMES.VIEWS_ITEM+"'>"+
                    "<button type='button' class='"+CLASSNAMES.VIEW_BUTTON+" daily' data-toggle='calendar-view' data-option='daily'>Day</button>"+
                "</li>"+
                "<li class='"+CLASSNAMES.VIEWS_ITEM+"'>"+
                    "<button type='button' class='"+CLASSNAMES.VIEW_BUTTON+" weekly' data-toggle='calendar-view' data-option='weekly'>Week</button>"+
                "</li>"+
                "<li class='"+CLASSNAMES.VIEWS_ITEM+"'>"+
                    "<button type='button' class='"+CLASSNAMES.VIEW_BUTTON+" monthly' data-toggle='calendar-view' data-option='monthly'>Month</button>"+
                "</li>"+
            "</ul></div>";
        }

        const render_add_menu = function(){
            return "<div class='"+CLASSNAMES.ADD_MENU_CONTAINER+"' id='addMenuComponent'>"+
                "<div class='"+CLASSNAMES.ADD_MENU_INNER+"'>"+
                    "<div class='"+CLASSNAMES.ADD_MENU_BUTTONS_CONTAINER+"'>"+
                        "<button class='"+CLASSNAMES.ADD_MENU_BUTTON+"' type='button' data-action='add-event'>"+
                        "Add Event</button>"+
                        "<button class='"+CLASSNAMES.ADD_MENU_BUTTON+" cancel' data-action='cancel' type='button'>"+
                        "Cancel</button>"+
                    "</div>"+
                    "<span class='caret'></span>"+
                "</div>"+
            "</div>";
        }
        const render_events = function()
        {
            // destroy old events first
            destroy_events();

            var {CALENDAR, WEEK_ROW, WEEK_EVENTS, DATE_CELL, DATE_CELL_CONTENT} = SELECTORS,
                weeks = $(CALENDAR).find(WEEK_ROW),
                week, eventsContainer, eventObj, container, cellTimestamp, evStart, evEnd;
            var dateCells = $(CALENDAR).find(DATE_CELL);
            for(var i = 0; i < dateCells.length; i++){
                // get date cell
                container = dateCells.eq(i);
                
                // Gets cell's timestampe (date and time in unix timestamp)
                cellTimestamp = parseInt(container.attr('data-date'));
                
                // only if the cell's date is not a number
                if( typeof cellTimestamp == 'number' && cellTimestamp >= 0){
                    // create instances
                    for(var j = 0; j < self.events.length; j++){
                        var event = self.events[j];
                        evStart = new Date( `${event.startDate} ${event.startTime}` ).getTime();
                        evEnd = new Date( `${event.endDate} ${event.endTime}` ).getTime();

                        // if event is happening on the current cell's date
                        if(cellTimestamp >= moment(moment(evStart).format('YYYY-MM-DD 00:00:00')).get('time') 
                            && cellTimestamp <= moment(moment(evEnd).format('YYYY-MM-DD 23:59:59')).get('time') ){

                            /**
                             * Gets start and end time for current cell, this is used
                             * to verify if the event is occuring at the time of the
                             * given cell timestamp
                             */
                            var st = moment(moment(cellTimestamp).format(`YYYY-MM-DDT${event.startTime}`)).get('time');
                            var et = moment(moment(cellTimestamp).format(`YYYY-MM-DDT${event.endTime}`)).get('time');

                            /**
                             * if in monthly view, the time doesn't really matter else,
                             * check if it's happening at the time within current
                             * cell's date
                             */
                            if(self.settings.view == 'monthly' ||
                              (cellTimestamp >= st && cellTimestamp <= et)
                            ){
                                eventObj = new CPEvent(event, container.find(DATE_CELL_CONTENT), week, DATE_CELL, {
                                    onClick: handle_event_click
                                });
                                eventObj.render();
                                self.eventInstances.push(eventObj);
                            }
                        }
                    }
                }

            }

        }

        const destroy_events = function()
        {
            for(var i = 0; i < self.eventInstances.length; i++)
            {
                var eventInstance = self.eventInstances[i];
                eventInstance.destroy();
            }
            self.eventInstances = [];
        }

        const start = function()
        {
            // get required selectors
            var {CONTAINER, ADD_MENU_BUTTON, EXPORT_BUTTON} = SELECTORS; 

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

            // select active view
            select_active_view();

            // listen for view select
            listen_view_select();
        }

        const create_view = function(calendar)
        {
            var container_tpl = copy_var(TEMPLATES.CONTAINER);
            var calendar_tpl = copy_var(TEMPLATES.MAIN);
            var days_heading_tpl = copy_var(TEMPLATES.DAYS_HEADING);
            var cell_tpl = copy_var(TEMPLATES.DAY_CELL);
            var week_tpl = copy_var(TEMPLATES.WEEK_ROW);
            var view_options = !self.settings.hideViewOptions ? copy_var(TEMPLATES.VIEWS) : '';
            var add_menu = copy_var(TEMPLATES.ADD_MENU);
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

                    // create day html
                    var day = cell_tpl.replace('{content}', calendar[i][j]);

                    // modify empty days
                    if( dayNum.length < 1 ) {
                        // add empty day class to empty days
                        classnames += ' '+CLASSNAMES.EMPTY_DAY+' ';

                        // add beginning class to first empty day
                        if(j == 0 && dayNum.length < 1) classnames += ' '+CLASSNAMES.EMPTY_DAY_BEGINNING+' ' ;
                        
                        // add ending class to last empty day
                        if(prevDayNum && get_month_days() == prevDayNum.trim()) classnames += ' '+CLASSNAMES.EMPTY_DAY_ENDING+' ' ;

                        // make dat attribute empty
                        day = day.replace('{date}', '');
                    }
                    else
                    {
                        // add class to show that day is not empty
                        classnames += ' '+CLASSNAMES.DATE_DAY;

                        // create new date object from current dat
                        var d = new Date(
                            self.settings.month+'/'+
                            calendar[i][j]+'/'+
                            self.settings.year
                        );

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
                curr_week_tpl = curr_week_tpl.replace('{row}', (i+1));

                weeks += curr_week_tpl.replace('{content}', week);
            }

            // create calendar from template
            var calenderClassnames = 'monthly';
            calenderClassnames += ' '+ CLASSNAMES.MONTH_CALENDAR.replace('{month}', month_name.toLowerCase())+' ';
            calenderClassnames += ' '+ CLASSNAMES.SEASON_CALENDAR.replace('{season}', season ? season.name : '')+' ';
            var calendar_tpl = calendar_tpl.replace('{content}', weeks);
            calendar_tpl = calendar_tpl.replace('{heading}', days_heading_tpl);
            calendar_tpl = calendar_tpl.replace('{classnames}', calenderClassnames);

            // add header to calendar
            container_tpl = container_tpl.replace('{header}', render_header());
            // add calender to container
            container_tpl = container_tpl.replace('{calendar}', calendar_tpl);
            // add, add menu
            container_tpl = container_tpl.replace('{add_menu}', render_add_menu());

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
            let {CONTAINER, CALENDAR, WEEK_ROW, DATE_CELL, DATE_CELL_CONTENT} = SELECTORS;
            var cells = $(CONTAINER+' '+CALENDAR+' '+WEEK_ROW+' '+DATE_CELL);
            var height = $(cells[0]).outerWidth() > self.settings.cellMaxHeigh ? self.settings.cellMaxHeigh+'px' : $(cells[0]).outerWidth()+'px';
            if(self.settings.view != 'monthly'){
                height = 'initial'
            }
            cells.find(DATE_CELL_CONTENT).css({height: height});
            reposition_addmenu();
        }

        const reposition_cell_background = function()
        {
            let {CONTAINER, CALENDAR, WEEK_ROW, DATE_CELL} = SELECTORS;
            var cells = $(CONTAINER+' '+CALENDAR+' '+WEEK_ROW+' '+DATE_CELL);
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
            $(BUTTONS).off('click', handle_control_button_click);
            $(BUTTONS).on('click', handle_control_button_click);
        }

        const handle_control_button_click = function(ev)
        {
            // get target element
            var el = ev.target;
            var left = $(el).attr('left');
            var right = $(el).attr('right');
            var settings  = copy_var(self.settings);
            var direction = left !== undefined ? 'left' : undefined
                direction = right !== undefined ? 'right' : direction

            // chang month if calendar is in monthly view
            if(settings.view == 'monthly'){
                change_month(direction);
            }
            // change week if calendar is in week view
            if(settings.view == 'weekly'){
                change_week(direction);
            }
            // determine what direction to go to
            if(settings.view == 'daily'){
                change_date(direction);
            }
        }

        const change_month = function(direction){
            var settings  = copy_var(self.settings);

            if(direction == 'left')
            {
                // set year
                settings.year = settings.month <= 1 ? settings.year - 1 : settings.year;
                // set month
                settings.month = settings.month <= 1 ? settings.month = 12 : settings.month - 1;
            }
            else if(direction == 'right')
            {
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
            weekStart = (now.get('month') + 1) == settings.month && now.get('year') == settings.year 
                        ? moment( `${settings.year}-${leading_zero(settings.month)}-${leading_zero(now.get('date'))}` ) 
                        : moment(`${settings.year}-${leading_zero(settings.month)}-01`);
            // reset week end
            weekEnd = moment(weekStart).add(6, 'days');
            // reset daily start
            dailyDate = moment(weekStart);
            // rerender calendar
            launch();
        }

        const change_week = function(direction){
            var settings  = copy_var(self.settings);
            if(direction == 'left'){
                weekStart = moment(weekStart).subtract(8, 'day');
            } else if(direction == 'right'){
                weekStart = moment(weekEnd).add(1, 'day');
            }
            weekEnd = moment(weekStart).add(6, 'day');
            // get now
            var now = moment();
            // reset year start
            self.settings = $.extend({}, self.settings, {
                year: weekStart.get('year'),
                month: weekStart.get('month') + 1,
            });
            // reset daily start
            dailyDate = moment(weekStart);
            // rerender calendar
            launch();
        }

        const change_date = function(direction){
            var settings  = copy_var(self.settings);
            if(direction == 'left'){
                dailyDate = moment(dailyDate).subtract(1, 'day');
            } else if(direction == 'right'){
                dailyDate = moment(dailyDate).add(1, 'day');
            }

            if(dailyDate.get('time') < weekStart.get('time') ||
               dailyDate.get('time') > weekEnd.get('time')){
                // reset week start
                weekStart = moment(dailyDate);
                // reset week end
                weekEnd = moment(weekStart).add(6, 'days');

            }

            // reset year start
            self.settings = $.extend({}, self.settings, {
                year: dailyDate.get('year'),
                month: dailyDate.get('month') + 1,
            });

            // rerender calendar
            launch();
        }

        const handle_add_menu_button_click = function(ev)
        {
            // get required selectors
            var {CONTAINER, ADD_MENU_BUTTON} = SELECTORS; 

            // turn click event listener off
            $(CONTAINER).find(ADD_MENU_BUTTON).off('click', handle_add_menu_button_click);

            // get element
            var el = $(ev.currentTarget);
            var action = el.attr('data-action');
            switch(action){
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
        }

        const add_event = function()
        {
            // get start and end
            var start = self.selection.length > 0 ? self.selection[0] : null;
            var end = self.selection.length > 1 ? self.selection[1] : start;
            // only continue if start is not null
            if(start == null) return;

            // create start and end date
            var startDate = new Date(start);
            var endDate = new Date(end);

            // create new event data
            var data = {
                startDate,
                endDate
            };

            // show modal
            self.modal.show(data);

            // calcel selection
            cancel_selection();
        }

        const cancel_selection = function()
        {
            self.selection = [];
            update_Selection();
        }

        const handle_event_click = function(event)
        {
            // create start and end date
            var startDate = new Date(event.startDate);
            var endDate = new Date(event.endDate);

            // create new event data
            var data = {
                title: event.title,
                startDate,
                endDate,
                startTime: event.startTime,
                endTime: event.endTime
            };

            self.editModal.show(data, event.id);
        }

        const listen_for_date_select = function()
        {
            var {DATE_DAY} = SELECTORS;
            $(DATE_DAY).off('click', handle_date_select);
            $(DATE_DAY).on('click', handle_date_select);
        }

        const handle_date_select = function(ev)
        {
            // turn off click event listener
            var {DATE_DAY} = SELECTORS;
            $(DATE_DAY).off('click', handle_date_select);

            // get element and date
            var el = ev.currentTarget;
            if(!$(ev.target).hasClass('cp-ev-event') && !$(ev.target).hasClass('cp-ev-event-label')){
                var date = $(el).attr('data-date');
                var start = self.selection.length > 0 ? self.selection[0] : 0;
                var end = self.selection.length > 1 ? self.selection[1] : start;
                if(date != undefined)
                {
                    date = parseInt(date);
                    if(start < 1 || (start > 0 && date < start))
                    {
                        // make start date equal to date
                        self.selection[0] = date;
                    }
                    else if(date == start && end == start)
                    {
                        // reset 
                        self.selection = [];
                    }
                    else if(date == start)
                    {
                        self.selection = [start];
                    }
                    else
                    {
                        self.selection[1] = date;
                    }
                }
    
                // update the selected dates on calendar
                update_Selection();
            }
    
            // listen for click event again
            listen_for_date_select();
        };

        const update_Selection = function()
        {
            var {CALENDAR, DATE_DAY} = SELECTORS;
            var {DATE_SELECTED} = CLASSNAMES;
            var days = $(CALENDAR).find(DATE_DAY);
            var start = self.selection.length > 0 ? self.selection[0] : 0;
            var end = self.selection.length > 1 ? self.selection[1] : start;
            if(days && days.length > 0)
            {
                for(var i = 0; i < days.length; i ++)
                {
                    // get element and date
                    var el = days.eq(i);
                    var date = $(el).attr('data-date');

                    // skip if date attribute is undefined
                    if(date == undefined) continue;
                    
                    // convert date time string to integer
                    date = parseInt(date);

                    // determine current date is within selected range
                    var select = (date >= start && date <= end);

                    if(select)
                    {
                        // if the element does not have the selected class
                        if(!$(el).hasClass(DATE_SELECTED))
                        {
                            // add selected class to element
                            $(el).addClass(DATE_SELECTED);
                        }
                    }
                    else // if date is found in selection
                    {
                        // if the element has the selected class
                        if($(el).hasClass(DATE_SELECTED))
                        {
                            // remove selected class from element
                            $(el).removeClass(DATE_SELECTED);
                        }
                    }
                    
                }
            }
            toggle_add_menu_visiblity();
        };

        const toggle_add_menu_visiblity = function()
        {
            // get plugin html selector references
            var {CONTAINER, ADD_MENU_CONTAINER, DATE_SELECTED} = SELECTORS;
            // get required classnames
            var {ADD_MENU_VISIBLE} = CLASSNAMES;

            // select elements
            var container = $(CONTAINER);
            var selected = container.find(DATE_SELECTED);
            var addMenuEl = container.find(ADD_MENU_CONTAINER);

            // toggle visibility
            if(selected && selected.length > 0)
            {
                if(!addMenuEl.hasClass(ADD_MENU_VISIBLE))
                {
                    addMenuEl.addClass(ADD_MENU_VISIBLE);
                }
            }
            else
            {
                if(addMenuEl.hasClass(ADD_MENU_VISIBLE))
                {
                    addMenuEl.removeClass(ADD_MENU_VISIBLE);
                }
            }
            
            // reposition add menu
            reposition_addmenu();
        }

        const reposition_addmenu = function()
        {
            // get plugin html selector references
            var {ADD_MENU_CONTAINER, DATE_CELL_CONTENT, CONTAINER} = SELECTORS;
            var {ADD_MENU_ABOVE} = CLASSNAMES;

            // get end element
            var end = get_selection_end_cell();
            var container = $(CONTAINER);
            var addMenuEl = container.find(ADD_MENU_CONTAINER);
            var viewport = get_viewport();

            if(end != null && end != undefined)
            {
                var offset = end.offset();
                var left = offset ? offset.left : 0;
                var top = offset ? ( offset.top + end.outerHeight() ) - 10 : 0;

                if(end.outerWidth() > addMenuEl.outerWidth())
                {
                    left = left + ( (end.outerWidth() - addMenuEl.outerWidth()) / 2 )
                }
                else
                {
                    left = left - ( (addMenuEl.outerWidth() - end.outerWidth()) / 2 )
                }

                if((addMenuEl.outerHeight() + top) > viewport.height)
                { 
                    top = offset ? (offset.top - addMenuEl.outerHeight()) + 10 : 0;
                    if(!addMenuEl.hasClass(ADD_MENU_ABOVE))
                    { addMenuEl.addClass(ADD_MENU_ABOVE); }
                }
                else
                {
                    if(addMenuEl.hasClass(ADD_MENU_ABOVE))
                    { addMenuEl.removeClass(ADD_MENU_ABOVE); }
                }

                // add css positions to element
                addMenuEl.css({'top': top, 'left': left});

            }
        }

        const reposition_events = function()
        {
            for(var i = 0; i < self.eventInstances.length; i++)
            {
                var eventInstance = self.eventInstances[i];
                eventInstance.reposition();
            }
        }

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

        const get_selection_end_cell = function()
        {
            // get end date from selection
            var start = self.selection.length > 0 ? self.selection[0] : null;
            var end = self.selection.length > 1 ? self.selection[1] : start;

            // get plugin html selector references
            var {CONTAINER, DATE_SELECTED} = SELECTORS;

            // select end element if an end date is set
            if(end) { end = $(CONTAINER).find('[data-date="'+end+'"]'); }

            // return end
            return end;
        }

        const get_viewport = function()
        {
            var width = $(document).outerWidth();
            var height = $(document).outerHeight();
            return {width, height};
        }

        const refresh_calendar_events = function()
        {
            // cancel ongoing get requests
            if(getEventsRequest && getEventsRequest.readyState != 4)
            { getEventsRequest.abort() }

            // get url
            var url = self.settings.list_url || self.settings.url || null;

            // stop if url is not set
            if(!url) return;

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
        }

        const refresh_calendar_events_done = function(resp)
        {
            // get the events
            self.events = get_events_data(resp);
            // render events
            render_events();
        }

        const refresh_calendar_events_fail = function(err)
        {
            if(err.statusText != 'abort')
            {
                var message = 'Failed to load events.';
                var message = err.message && err.message.length > 0 ? err.message : message;
                // alert(message);
            }
        }

        const get_events_data = function(data)
        {
            if(self.settings.respData === null) return data;

            if(typeof self.settings.respData != 'string')
            {
                console.error(new Error('Data path invalid, please contact system\'s admin.'));
                return data;
            }

            var dataPath = copy_var( self.settings.respData );
            dataPath = dataPath.trim();
            dataPath = dataPath.split('.');

            var events = copy_var( data );

            for(var i = 0; i < dataPath.length; i++)
            {
                if(!events.hasOwnProperty(dataPath[i])) continue;
                events = events[dataPath[i]];
            }

            if(events)
            {
                for(var i = 0; i < events.length; i++)
                {  events[i] = transform_data(events[i]); }
            }

            return events;
        }

        const transform_data = function(data)
        {
            var transform = {
                id: find_data(data, self.settings.id),
                title: find_data(data, self.settings.title),
                startDate: find_data(data, self.settings.startDate),
                endDate: find_data(data, self.settings.endDate),
                startTime: find_data(data, self.settings.startTime),
                endTime: find_data(data, self.settings.endTime),
            };
            return transform;
        }

        const find_data = function(data, key)
        {
            if(typeof key != 'string')
            {
                console.error(new Error('Data path invalid, please contact system\'s admin.'));
                return data;
            }

            var dataPath = copy_var( key );
            dataPath = dataPath.trim();
            dataPath = dataPath.split('.');

            var found = copy_var( data );
            var didFind = false;

            for(var i = 0; i < dataPath.length; i++)
            {
                if(!found.hasOwnProperty(dataPath[i])) continue;
                found = found[dataPath[i]];
                didFind = true;
            }

            return didFind ? found : null;
        }

        const is_in_week = function(week, event)
        {
            // define variables
            var {DATE_CELL} = SELECTORS,
                cells = week.find(DATE_CELL),
                found = false,
                startDate = new Date(event.startDate),
                endDate = new Date(event.endDate),
                cellDate, cell;

            for( var i = 0; i < cells.length; i++ )
            {
                cell = cells.eq(i);
                cellDate = parseInt(cell.attr('data-date'));

                // if current cell date is within event date range
                if(
                    startDate.getTime() == cellDate || 
                    (startDate.getTime() <= cellDate && endDate.getTime() >= cellDate)
                )
                {
                    // set found to true and break loop
                    found = true;
                    break;
                }
            }

            return found;
        }

        const export_to = function(ev)
        {
            ev.preventDefault();
            var el = $(ev.currentTarget),
                {CONTAINER, CONTAINER_ID} = SELECTORS,
                format = el.attr('data-format'),
                target = $('#'+CONTAINER_ID);

            if(format == 'pdf')
            {
               
            }
            else if(format == 'docx')
            {
                
            }
        }

        const listen_view_select = function(){
            $(SELECTORS.VIEW_SELECTOR).off('click', handle_view_select);
            $(SELECTORS.VIEW_SELECTOR).on('click', handle_view_select);
        }

        const handle_view_select = function(ev){
            var el = $(ev.currentTarget);
            var option = el.attr('data-option');
            if(self.viewOptions.indexOf(option) == -1){
                option = 'monthly';
            }
            if(self.settings.view != option){
                self.settings = $.extend({}, self.settings, {
                    view: option
                });
                // remove any selection
                cancel_selection();
                // rerender calendar
                setTimeout(launch, 200);
            }
        }

        const select_active_view = function(){
            var { VIEWS_LIST_CONTAINER } = SELECTORS;

            var option = $(VIEWS_LIST_CONTAINER).find("[data-option='"+self.settings.view+"']");

            if(option.length > 0)
            {
                if(!option.hasClass(CLASSNAMES.ACTIVE))
                {
                    $(VIEWS_LIST_CONTAINER).find("[data-toggle='calendar-view']").removeClass(CLASSNAMES.ACTIVE);
                    option.addClass(CLASSNAMES.ACTIVE);
                }
            }
        }

        const leading_zero = function(number){
            if(typeof number == 'number')
            {
                number = number.toString();
            }
            return number.trim().length >= 2 ? number : '0'+number;
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